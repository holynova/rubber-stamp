const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { ITEMS, buildPrompt } = require('./batch_china_cities');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.resolve(ROOT_DIR, 'images/china_cities');
const THUMB_DIR = path.resolve(ROOT_DIR, 'images/thumbnails/china_cities');
const DETAIL_DIR = path.resolve(ROOT_DIR, 'images/detail_webp/china_cities');
const TMP_DIR = '/tmp/china_cities_gen';
const OPENCLI = '/Users/sym/Library/pnpm/opencli';

[OUTPUT_DIR, THUMB_DIR, DETAIL_DIR, TMP_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getLatestPng(dir) {
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.png') || f.endsWith('.webp') || f.endsWith('.jpg'))
    .map(f => {
      const p = path.join(dir, f);
      return { path: p, mtime: fs.statSync(p).mtimeMs, size: fs.statSync(p).size };
    })
    .filter(f => f.size > 100000)
    .sort((a, b) => b.mtime - a.mtime);
  return files.length > 0 ? files[0].path : null;
}

async function processDerivatives(pngPath, baseName) {
  try {
    const thumbPath = path.join(THUMB_DIR, `${baseName}.webp`);
    await sharp(pngPath)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(thumbPath);
    console.log(`  ✓ Created thumbnail: ${thumbPath}`);

    const detailPath = path.join(DETAIL_DIR, `${baseName}.webp`);
    await sharp(pngPath)
      .webp({ quality: 85, effort: 4 })
      .toFile(detailPath);
    console.log(`  ✓ Created detail WebP: ${detailPath}`);
  } catch (err) {
    console.error(`  ✗ Error generating WebP derivatives for ${baseName}:`, err.message);
  }
}

async function run() {
  const args = process.argv.slice(2);
  let targetItems = ITEMS;

  // Filter if specific id/range or city passed as argument
  if (args.length > 0) {
    const filterArg = args[0];
    if (/^\d+$/.test(filterArg)) {
      const idx = parseInt(filterArg, 10);
      targetItems = ITEMS.filter(it => it.id === idx);
    } else if (/^\d+-\d+$/.test(filterArg)) {
      const [start, end] = filterArg.split('-').map(Number);
      targetItems = ITEMS.filter(it => it.id >= start && it.id <= end);
    } else {
      targetItems = ITEMS.filter(it => it.name === filterArg || it.city === filterArg);
    }
  }

  console.log(`=== Starting China Cities Stamp Generator (${targetItems.length} items) ===\n`);

  for (let i = 0; i < targetItems.length; i++) {
    const item = targetItems[i];
    const targetFile = path.join(OUTPUT_DIR, item.file);
    const baseName = path.parse(item.file).name;

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 100000) {
      console.log(`[${i + 1}/${targetItems.length}] Already exists: ${item.file} (${(fs.statSync(targetFile).size / 1024 / 1024).toFixed(2)} MB)`);
      // Ensure thumbnails exist
      const thumbFile = path.join(THUMB_DIR, `${baseName}.webp`);
      if (!fs.existsSync(thumbFile)) {
        await processDerivatives(targetFile, baseName);
      }
      continue;
    }

    console.log(`----------------------------------------`);
    console.log(`[${i + 1}/${targetItems.length}] Generating: ${item.title} (${item.file})`);
    const prompt = buildPrompt(item);
    console.log(`Theme: ${item.theme}`);
    console.log(`Colors: ${item.colors}`);

    // Clean tmp directory
    fs.readdirSync(TMP_DIR).forEach(f => {
      try { fs.unlinkSync(path.join(TMP_DIR, f)); } catch(e) {}
    });

    // Reset ChatGPT conversation
    try {
      execSync(`${OPENCLI} chatgpt new`, { stdio: 'ignore' });
      await sleep(2000);
    } catch (e) {}

    const cmd = `${OPENCLI} chatgpt image ${JSON.stringify(prompt)} --op ${TMP_DIR} --timeout 300`;

    let success = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`  Running opencli chatgpt image (attempt ${attempt}/3)...`);
        execSync(cmd, { stdio: 'inherit' });
        const latest = getLatestPng(TMP_DIR);
        if (latest && fs.existsSync(latest)) {
          fs.copyFileSync(latest, targetFile);
          const mb = (fs.statSync(targetFile).size / 1024 / 1024).toFixed(2);
          console.log(`  ✓ SUCCESS: Saved to ${item.file} (${mb} MB)`);
          await processDerivatives(targetFile, baseName);
          success = true;
          break;
        } else {
          console.warn(`  Attempt ${attempt} produced no image in ${TMP_DIR}`);
        }
      } catch (err) {
        console.error(`  Attempt ${attempt} error:`, err.message);
      }
      if (attempt < 3) {
        console.log("  Waiting 15s before retry...");
        await sleep(15000);
      }
    }

    if (!success) {
      console.error(`✗ Failed to generate ${item.file} after 3 attempts.`);
    }

    if (i < targetItems.length - 1) {
      console.log("Waiting 8s cooldown before next city...");
      await sleep(8000);
    }
  }

  console.log("\n=== Finished China Cities Stamp Generation ===");
}

run();
