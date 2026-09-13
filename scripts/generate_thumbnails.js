const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.resolve(__dirname, '../images');
const THUMB_DIR = path.resolve(__dirname, '../images/thumbnails');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'thumbnails' || file.startsWith('.')) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  console.log('🚀 Starting WebP thumbnail generation...');
  const files = getFiles(IMAGES_DIR);
  console.log(`Found ${files.length} images to process.`);

  let totalOrigBytes = 0;
  let totalThumbBytes = 0;
  let count = 0;

  for (const file of files) {
    const relPath = path.relative(IMAGES_DIR, file);
    const parsed = path.parse(relPath);
    const targetSubDir = path.join(THUMB_DIR, parsed.dir);
    const targetFile = path.join(targetSubDir, `${parsed.name}.webp`);

    if (!fs.existsSync(targetSubDir)) {
      fs.mkdirSync(targetSubDir, { recursive: true });
    }

    const origStat = fs.statSync(file);
    totalOrigBytes += origStat.size;

    // Generate WebP thumbnail: width 400px, auto height, quality 82
    await sharp(file)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(targetFile);

    const thumbStat = fs.statSync(targetFile);
    totalThumbBytes += thumbStat.size;
    count++;

    if (count % 30 === 0 || count === files.length) {
      console.log(`  Processed [${count}/${files.length}] images...`);
    }
  }

  const origMB = (totalOrigBytes / 1024 / 1024).toFixed(2);
  const thumbMB = (totalThumbBytes / 1024 / 1024).toFixed(2);
  const reduction = (((totalOrigBytes - totalThumbBytes) / totalOrigBytes) * 100).toFixed(1);

  console.log('\n========================================');
  console.log(`✅ Finished generating ${count} WebP thumbnails!`);
  console.log(`📊 Original total size:   ${origMB} MB`);
  console.log(`📊 Thumbnail total size:  ${thumbMB} MB`);
  console.log(`⚡ Size reduction:        ${reduction}% (Saved ${(origMB - thumbMB).toFixed(2)} MB!)`);
  console.log('========================================\n');
}

main().catch(err => {
  console.error('❌ Error generating thumbnails:', err);
  process.exit(1);
});
