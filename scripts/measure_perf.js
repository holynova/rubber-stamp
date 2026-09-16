const { spawn } = require('child_process');
const http = require('http');
const net = require('net');

const URL = 'http://127.0.0.1:8788/';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9225;

function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function runCdpSession() {
  return new Promise(async (resolve, reject) => {
    let chromeProc = null;
    try {
      chromeProc = spawn(CHROME_PATH, [
        '--headless=new',
        `--remote-debugging-port=${DEBUG_PORT}`,
        '--disable-gpu',
        '--window-size=430,932',
        '--no-first-run',
        '--no-default-browser-check',
        'about:blank'
      ]);

      await wait(1200);
      const tabs = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json`);
      const targetTab = tabs.find(t => t.type === 'page') || tabs[0];
      const wsUrl = targetTab.webSocketDebuggerUrl;

      const wsUrlParsed = new (require('url').URL)(wsUrl);
      const client = net.createConnection({ host: wsUrlParsed.hostname, port: wsUrlParsed.port });

      const secKey = Buffer.from('antigravity-' + Date.now()).toString('base64');
      client.write(
        `GET ${wsUrlParsed.pathname} HTTP/1.1\r\n` +
        `Host: ${wsUrlParsed.host}\r\n` +
        `Upgrade: websocket\r\n` +
        `Connection: Upgrade\r\n` +
        `Sec-WebSocket-Key: ${secKey}\r\n` +
        `Sec-WebSocket-Version: 13\r\n\r\n`
      );

      let msgId = 1;
      const callbacks = new Map();
      let buffer = Buffer.alloc(0);

      function send(method, params = {}) {
        const id = msgId++;
        const payload = JSON.stringify({ id, method, params });
        return new Promise((res, rej) => {
          callbacks.set(id, { res, rej });
          const dataBuf = Buffer.from(payload);
          let frameHeader;
          const len = dataBuf.length;
          if (len <= 125) {
            frameHeader = Buffer.from([0x81, 0x80 | len]);
          } else if (len <= 65535) {
            frameHeader = Buffer.alloc(4);
            frameHeader[0] = 0x81;
            frameHeader[1] = 0x80 | 126;
            frameHeader.writeUInt16BE(len, 2);
          } else {
            frameHeader = Buffer.alloc(10);
            frameHeader[0] = 0x81;
            frameHeader[1] = 0x80 | 127;
            frameHeader.writeBigUInt64BE(BigInt(len), 2);
          }
          const mask = Buffer.from([0x12, 0x34, 0x56, 0x78]);
          const maskedData = Buffer.alloc(len);
          for (let i = 0; i < len; i++) {
            maskedData[i] = dataBuf[i] ^ mask[i % 4];
          }
          client.write(Buffer.concat([frameHeader, mask, maskedData]));
        });
      }

      client.on('data', chunk => {
        buffer = Buffer.concat([buffer, chunk]);
        while (buffer.length >= 2) {
          if (buffer.toString('utf8', 0, 12).startsWith('HTTP/1.1 101')) {
            const endIdx = buffer.indexOf('\r\n\r\n');
            if (endIdx !== -1) {
              buffer = buffer.slice(endIdx + 4);
              continue;
            } else {
              break;
            }
          }
          const b1 = buffer[0];
          const b2 = buffer[1];
          let payloadLen = b2 & 0x7f;
          let offset = 2;
          if (payloadLen === 126) {
            if (buffer.length < 4) break;
            payloadLen = buffer.readUInt16BE(2);
            offset = 4;
          } else if (payloadLen === 127) {
            if (buffer.length < 10) break;
            payloadLen = Number(buffer.readBigUInt64BE(2));
            offset = 10;
          }
          if (buffer.length < offset + payloadLen) break;
          const payload = buffer.slice(offset, offset + payloadLen).toString('utf8');
          buffer = buffer.slice(offset + payloadLen);

          try {
            const msg = JSON.parse(payload);
            if (msg.id && callbacks.has(msg.id)) {
              const cb = callbacks.get(msg.id);
              callbacks.delete(msg.id);
              if (msg.error) cb.rej(msg.error);
              else cb.res(msg.result);
            }
          } catch (e) {}
        }
      });

      await wait(300);
      await send('Network.enable');
      await send('Page.enable');
      await send('Network.clearBrowserCache');
      await send('Page.navigate', { url: URL });
      await wait(3500);

      const evalMetrics = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const nav = performance.getEntriesByType('navigation')[0] || {};
            const paint = performance.getEntriesByType('paint');
            const fcp = paint.find(p => p.name === 'first-contentful-paint');
            
            const resources = performance.getEntriesByType('resource');
            let totalTransfer = 0;
            let jsTransfer = 0;
            let imgTransfer = 0;
            let reqCount = resources.length + 1;

            resources.forEach(r => {
              const size = r.transferSize || r.encodedBodySize || 0;
              totalTransfer += size;
              if (r.initiatorType === 'script' || r.name.endsWith('.js')) {
                jsTransfer += size;
              } else if (r.initiatorType === 'img' || r.name.match(/\\.(png|webp|svg|jpg)$/i)) {
                imgTransfer += size;
              }
            });

            return {
              domNodes: document.getElementsByTagName('*').length,
              dcl: Math.round(nav.domContentLoadedEventEnd || 0),
              load: Math.round(nav.loadEventEnd || 0),
              fcp: fcp ? Math.round(fcp.startTime) : null,
              totalTransferBytes: totalTransfer,
              jsTransferBytes: jsTransfer,
              imgTransferBytes: imgTransfer,
              resourceCount: reqCount
            };
          })()
        `,
        returnByValue: true
      });

      client.end();
      chromeProc.kill();
      resolve(evalMetrics.result.value);
    } catch (err) {
      if (chromeProc) chromeProc.kill();
      reject(err);
    }
  });
}

async function runBenchmark(label = 'Run', count = 3) {
  console.log(`\n=== 开始测量: ${label} (共测试 ${count} 次取平均值) ===`);
  const results = [];
  for (let i = 1; i <= count; i++) {
    process.stdout.write(`  正在进行第 ${i}/${count} 次测试... `);
    try {
      const res = await runCdpSession();
      results.push(res);
      console.log(`完成! (FCP: ${res.fcp}ms, DCL: ${res.dcl}ms, DOM节点: ${res.domNodes}, 资源数: ${res.resourceCount})`);
      await wait(1000);
    } catch (e) {
      console.log(`失败: ${e.message}`);
    }
  }

  if (results.length === 0) {
    throw new Error("测量全部失败");
  }

  const avg = {
    fcp: Math.round(results.reduce((s, r) => s + (r.fcp || 0), 0) / results.length),
    dcl: Math.round(results.reduce((s, r) => s + (r.dcl || 0), 0) / results.length),
    load: Math.round(results.reduce((s, r) => s + (r.load || 0), 0) / results.length),
    domNodes: Math.round(results.reduce((s, r) => s + (r.domNodes || 0), 0) / results.length),
    totalTransferKB: Math.round(results.reduce((s, r) => s + (r.totalTransferBytes || 0), 0) / results.length / 1024),
    jsTransferKB: Math.round(results.reduce((s, r) => s + (r.jsTransferBytes || 0), 0) / results.length / 1024),
    imgTransferKB: Math.round(results.reduce((s, r) => s + (r.imgTransferBytes || 0), 0) / results.length / 1024),
    resourceCount: Math.round(results.reduce((s, r) => s + (r.resourceCount || 0), 0) / results.length)
  };

  console.log(`\n--- [${label}] 最终平均指标 ---`);
  console.log(`- FCP (首次内容绘制):   ${avg.fcp} ms`);
  console.log(`- DCL (DOM解析就绪):     ${avg.dcl} ms`);
  console.log(`- Load (页面完全加载):   ${avg.load} ms`);
  console.log(`- 初始 DOM 节点数:       ${avg.domNodes}`);
  console.log(`- 初始网络请求总数:      ${avg.resourceCount}`);
  console.log(`- JS 传输体积:           ${avg.jsTransferKB} KB`);
  console.log(`- 图片传输体积:          ${avg.imgTransferKB} KB`);
  console.log(`- 首屏总传输体积:        ${avg.totalTransferKB} KB`);
  console.log('-------------------------------\n');

  return avg;
}

if (require.main === module) {
  const label = process.argv[2] || 'Baseline';
  runBenchmark(label).catch(err => {
    console.error("Benchmark error:", err);
    process.exit(1);
  });
}

module.exports = { runBenchmark };
