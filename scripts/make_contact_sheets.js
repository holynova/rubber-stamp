const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(ROOT_DIR, 'contact_sheets');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Read data.js collections
const dataJs = fs.readFileSync(path.join(ROOT_DIR, 'data.js'), 'utf-8');
const match = dataJs.match(/window\.COLLECTIONS\s*=\s*(\{[\s\S]*?\n\};)/);
let collections = {};
if (match) {
  try {
    const fn = new Function('window', `window = {}; window.COLLECTIONS = ${match[1]} return window.COLLECTIONS;`);
    collections = fn({});
  } catch (e) {
    console.error('Failed to parse COLLECTIONS:', e);
  }
}

const THUMB_W = 160;
const THUMB_H = 200;
const COLS = 6;

async function createSheet(title, items, outFile) {
  if (!items || items.length === 0) return;
  const rows = Math.ceil(items.length / COLS);
  const sheetW = COLS * THUMB_W;
  const sheetH = rows * THUMB_H + 40; // 40px for header

  const composites = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const left = col * THUMB_W;
    const top = 40 + row * THUMB_H;

    // Resolve image file (try thumbnail first, fallback to output)
    let imgPath = path.resolve(ROOT_DIR, item.output);
    const thumbPath = path.resolve(ROOT_DIR, item.output.replace(/^images\//, 'images/thumbnails/').replace(/\.png$/i, '.webp'));
    if (fs.existsSync(thumbPath)) {
      imgPath = thumbPath;
    }

    if (!fs.existsSync(imgPath)) {
      console.warn(`Missing image: ${imgPath}`);
      continue;
    }

    try {
      // Resize to fit inside box
      const resizedBuf = await sharp(imgPath)
        .resize(THUMB_W - 10, THUMB_H - 26, { fit: 'contain', background: '#faf6ee' })
        .toBuffer();

      // Create label SVG
      const labelText = `${item.id}. ${item.name || item.city || ''}`;
      const labelSvg = Buffer.from(`
        <svg width="${THUMB_W}" height="20">
          <rect width="100%" height="100%" fill="#231b15" />
          <text x="${THUMB_W / 2}" y="14" font-size="11" fill="#faf6ee" font-family="sans-serif" text-anchor="middle" font-weight="bold">${labelText}</text>
        </svg>
      `);

      composites.push({
        input: resizedBuf,
        left: left + 5,
        top: top + 3
      });

      composites.push({
        input: labelSvg,
        left: left,
        top: top + THUMB_H - 22
      });
    } catch (err) {
      console.error(`Error processing ${item.id}:`, err);
    }
  }

  // Header SVG
  const headerSvg = Buffer.from(`
    <svg width="${sheetW}" height="40">
      <rect width="100%" height="100%" fill="#b9281e" />
      <text x="20" y="26" font-size="16" fill="#ffffff" font-family="sans-serif" font-weight="bold">${title} (${items.length} 张)</text>
    </svg>
  `);
  composites.unshift({ input: headerSvg, left: 0, top: 0 });

  await sharp({
    create: {
      width: sheetW,
      height: sheetH,
      channels: 3,
      background: '#faf6ee'
    }
  })
  .composite(composites)
  .jpeg({ quality: 85 })
  .toFile(outFile);

  console.log(`✓ Generated ${outFile} (${sheetW}x${sheetH})`);
}

async function main() {
  for (const [key, col] of Object.entries(collections)) {
    const outFile = path.join(OUT_DIR, `sheet_${key}.jpg`);
    await createSheet(col.title, col.items, outFile);
  }
}

main().catch(console.error);
