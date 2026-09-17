const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DATA_FILE = path.resolve(__dirname, '../data.js');
const BASE_DIR = path.resolve(__dirname, '..');
const OUT_BASE = path.resolve(BASE_DIR, 'images/detail_webp');

async function main() {
  const content = fs.readFileSync(DATA_FILE, 'utf-8');
  const regex = /"output":\s*"([^"]+)"/g;
  let match;
  const outputs = [];
  while ((match = regex.exec(content)) !== null) {
    outputs.push(match[1]);
  }

  const uniqueOutputs = [...new Set(outputs)].filter(p => p.endsWith('.png'));
  console.log(`Found ${uniqueOutputs.length} unique detail PNG images to process.`);

  let origTotal = 0;
  let newTotal = 0;
  let count = 0;

  for (const relPath of uniqueOutputs) {
    const srcPath = path.resolve(BASE_DIR, relPath);
    if (!fs.existsSync(srcPath)) {
      console.warn(`Source not found: ${srcPath}`);
      continue;
    }

    // Determine target path in images/detail_webp/
    const subRel = relPath.replace(/^images\//, '');
    const targetPath = path.resolve(OUT_BASE, subRel.replace(/\.png$/i, '.webp'));
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const srcStat = fs.statSync(srcPath);
    origTotal += srcStat.size;

    // Check if target already exists and is newer than source
    let needGen = true;
    if (fs.existsSync(targetPath)) {
      const tgtStat = fs.statSync(targetPath);
      if (tgtStat.mtimeMs >= srcStat.mtimeMs && tgtStat.size > 1000) {
        newTotal += tgtStat.size;
        needGen = false;
      }
    }

    if (needGen) {
      await sharp(srcPath)
        .webp({ quality: 85, effort: 4 })
        .toFile(targetPath);
      const tgtStat = fs.statSync(targetPath);
      newTotal += tgtStat.size;
      count++;
      if (count % 25 === 0 || count === uniqueOutputs.length) {
        console.log(`Processed ${count}/${uniqueOutputs.length}... (${(newTotal / 1024 / 1024).toFixed(1)} MB generated)`);
      }
    }
  }

  const origMb = origTotal / 1024 / 1024;
  const newMb = newTotal / 1024 / 1024;
  const savedPercent = ((1 - newTotal / origTotal) * 100).toFixed(1);
  console.log('\n========================================');
  console.log(`✓ Detail WebP generation finished!`);
  console.log(`Original total: ${origMb.toFixed(2)} MB`);
  console.log(`Optimized WebP total: ${newMb.toFixed(2)} MB`);
  console.log(`Saved: ${(origMb - newMb).toFixed(2)} MB (${savedPercent}%)`);
  console.log(`Average detail size: ${(newTotal / uniqueOutputs.length / 1024).toFixed(1)} KB`);
  console.log('========================================');
}

main().catch(err => {
  console.error('Error generating detail WebP:', err);
  process.exit(1);
});
