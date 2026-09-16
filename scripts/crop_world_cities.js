const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.resolve(__dirname, '../images/backup_cities');
const OUTPUT_DIR = path.resolve(__dirname, '../images');

async function processCity(file) {
  const srcPath = path.join(BACKUP_DIR, file);
  const destPath = path.join(OUTPUT_DIR, file);

  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const c = info.channels;

  // 1. Scan rows between 920 and 1220 to find the zero-ink gap separating artwork from typewriter text
  const rowCounts = [];
  for (let y = 920; y < 1220; y++) {
    let count = 0;
    for (let x = 100; x < w - 100; x += 2) {
      const idx = (y * w + x) * c;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      if (lum < 165) count++;
    }
    rowCounts.push({ y, count });
  }

  let bestY = 1050;
  let minSum = 999999;
  for (let i = 5; i < rowCounts.length - 5; i++) {
    let sum = 0;
    for (let d = -3; d <= 3; d++) sum += rowCounts[i + d].count;
    if (sum < minSum) {
      minSum = sum;
      bestY = rowCounts[i].y;
    }
  }

  // 2. Measure artwork boundaries above bestY
  let artTop = 0;
  for (let y = 150; y < bestY; y++) {
    let count = 0;
    for (let x = 100; x < w - 100; x += 2) {
      const idx = (y * w + x) * c;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      if (lum < 165) count++;
    }
    if (count > 8) {
      artTop = y;
      break;
    }
  }

  let artBottom = bestY;
  for (let y = bestY; y >= artTop; y--) {
    let count = 0;
    for (let x = 100; x < w - 100; x += 2) {
      const idx = (y * w + x) * c;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      if (lum < 165) count++;
    }
    if (count > 8) {
      artBottom = y;
      break;
    }
  }

  let artLeft = w;
  let artRight = 0;
  for (let y = artTop; y <= artBottom; y += 2) {
    for (let x = 60; x < w - 60; x += 2) {
      const idx = (y * w + x) * c;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      if (lum < 165) {
        if (x < artLeft) artLeft = x;
        if (x > artRight) artRight = x;
      }
    }
  }

  const artW = artRight - artLeft;
  const artH = artBottom - artTop;
  const centerX = Math.round((artLeft + artRight) / 2);
  const centerY = Math.round((artTop + artBottom) / 2);

  // 3. Compute optimal crop framing with ~30% negative space on 4:5 canvas
  const scaleW = artW / 0.86;
  const scaleH = artH / 0.70;
  const cropW = Math.round(Math.max(scaleW, scaleH * 0.8));
  const cropH = Math.round(cropW / 0.8);

  let left = Math.round(centerX - cropW / 2);
  let top = Math.round(centerY - cropH / 2);
  if (left < 0) left = 0;
  if (left + cropW > w) left = w - cropW;
  if (top < 0) top = 0;

  // 4. Extended canvas buffer if cropH extends beyond bottom
  const requiredH = Math.max(h, top + cropH + 20);
  const extBuf = Buffer.alloc(w * requiredH * c);
  data.copy(extBuf, 0, 0, w * h * c);

  // Seamlessly patch text area starting from (bestY - 10) down to the bottom
  const patchStartY = bestY - 10;
  const sampleTopY = 100;
  const feather = 15;

  for (let y = patchStartY; y < requiredH; y++) {
    const dy = y - patchStartY;
    const alpha = Math.min(1.0, dy / feather);
    const sampleY = sampleTopY + (dy % 400);
    const origY = Math.min(h - 1, y);

    for (let x = 0; x < w; x++) {
      const targetIdx = (y * w + x) * c;
      const sampleIdx = (sampleY * w + x) * c;
      const origIdx = (origY * w + x) * c;

      for (let ch = 0; ch < 3; ch++) {
        extBuf[targetIdx + ch] = Math.round(data[origIdx + ch] * (1 - alpha) + data[sampleIdx + ch] * alpha);
      }
      if (c === 4) {
        extBuf[targetIdx + 3] = 255;
      }
    }
  }

  // 5. Extract cropped region and resize to standard 1122 x 1402
  await sharp(extBuf, { raw: { width: w, height: requiredH, channels: c } })
    .extract({ left, top, width: cropW, height: cropH })
    .resize(1122, 1402)
    .png({ compressionLevel: 8 })
    .toFile(destPath);

  const occW = ((artW / cropW) * 100).toFixed(1);
  const occH = ((artH / cropH) * 100).toFixed(1);
  console.log(`✓ ${file.padEnd(16)} | Crop [${left}, ${top}, ${cropW}, ${cropH}] | Artwork: ${artW}x${artH} (occ: ${occW}% x ${occH}%)`);
}

async function main() {
  console.log('🚀 Starting batch cropping & text removal for 30 World Cities...\n');
  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.png') && /^\d\d_/.test(f)).sort();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`[${i + 1}/${files.length}] Processing ${file}...`);
    await processCity(file);
  }

  console.log('\n✅ All 30 World Cities cropped, text-removed, and centered with ~30% negative space!');
}

main().catch(err => {
  console.error('❌ Error processing cities:', err);
  process.exit(1);
});
