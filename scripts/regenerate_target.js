const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..');
const OPENCLI = '/Users/sym/Library/pnpm/opencli';
const TMP_DIR = '/tmp/circular_regen';

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getLatestImage(dir) {
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

async function processDerivatives(pngPath, collection, baseName) {
  const thumbDir = path.join(ROOT_DIR, 'images/thumbnails', collection);
  const detailDir = path.join(ROOT_DIR, 'images/detail_webp', collection);
  if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });
  if (!fs.existsSync(detailDir)) fs.mkdirSync(detailDir, { recursive: true });

  const thumbPath = path.join(thumbDir, `${baseName}.webp`);
  await sharp(pngPath)
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(thumbPath);
  console.log(`  ✓ Thumbnail updated: ${thumbPath}`);

  const detailPath = path.join(detailDir, `${baseName}.webp`);
  await sharp(pngPath)
    .webp({ quality: 85, effort: 4 })
    .toFile(detailPath);
  console.log(`  ✓ Detail WebP updated: ${detailPath}`);
}

async function regenerateOne(task) {
  // task: { collection, id, name, targetPng, prompt }
  console.log(`\n========================================`);
  console.log(`>>> Regenerating [${task.collection}] ID ${task.id} (${task.name})`);
  console.log(`Target: ${task.targetPng}`);
  console.log(`Prompt: ${task.prompt}`);
  console.log(`========================================`);

  const fullTargetPath = path.join(ROOT_DIR, task.targetPng);
  const baseName = path.parse(fullTargetPath).name;

  // 1. Backup old image
  const backupDir = path.join(ROOT_DIR, 'images/backup_circular', task.collection);
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  const backupFile = path.join(backupDir, path.basename(fullTargetPath));
  if (fs.existsSync(fullTargetPath) && !fs.existsSync(backupFile)) {
    fs.copyFileSync(fullTargetPath, backupFile);
    console.log(`  ✓ Backed up old image to ${backupFile}`);
  }

  // 2. Clean tmp
  fs.readdirSync(TMP_DIR).forEach(f => {
    try { fs.unlinkSync(path.join(TMP_DIR, f)); } catch(e) {}
  });

  // 3. Reset conversation
  try {
    execSync(`${OPENCLI} chatgpt new`, { stdio: 'ignore' });
    await sleep(2000);
  } catch(e) {}

  // 4. Generate
  const cmd = `${OPENCLI} chatgpt image ${JSON.stringify(task.prompt)} --op ${TMP_DIR} --timeout 300`;
  let success = false;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`  [Attempt ${attempt}/3] Calling opencli chatgpt image...`);
      execSync(cmd, { stdio: 'inherit' });
      const latest = getLatestImage(TMP_DIR);
      if (latest && fs.existsSync(latest)) {
        // Save to targetPng
        fs.copyFileSync(latest, fullTargetPath);
        const mb = (fs.statSync(fullTargetPath).size / 1024 / 1024).toFixed(2);
        console.log(`  ✓ Saved regenerated image: ${fullTargetPath} (${mb} MB)`);
        await processDerivatives(fullTargetPath, task.collection, baseName);
        success = true;
        break;
      } else {
        console.warn(`  Attempt ${attempt} produced no image in ${TMP_DIR}`);
      }
    } catch(err) {
      console.error(`  Attempt ${attempt} failed:`, err.message);
    }
    if (attempt < 3) {
      console.log('  Waiting 15s before retry...');
      await sleep(15000);
    }
  }

  if (!success) {
    console.error(`  ✗ FAILED to regenerate [${task.collection}] ID ${task.id} (${task.name})`);
    return false;
  }
  return true;
}

module.exports = { regenerateOne, processDerivatives, sleep };
