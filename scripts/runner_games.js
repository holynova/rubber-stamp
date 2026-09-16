const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { ITEMS, buildPrompt } = require('./batch_games');

const OUTPUT_DIR = path.resolve(__dirname, '../images/games');
const TMP_DIR = '/tmp/games_gen';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getLatestPng(dir) {
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.png') || f.endsWith('.webp') || f.endsWith('.jpg'))
    .map(f => {
      const p = path.join(dir, f);
      return { path: p, mtime: fs.statSync(p).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);
  return files.length > 0 ? files[0].path : null;
}

async function run() {
  for (let i = 0; i < ITEMS.length; i++) {
    const item = ITEMS[i];
    const targetFile = path.join(OUTPUT_DIR, item.file);
    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 100000) {
      console.log(`[${i + 1}/${ITEMS.length}] Already exists: ${item.file}`);
      continue;
    }

    console.log(`\n========================================`);
    console.log(`[${i + 1}/${ITEMS.length}] Generating: ${item.title} (${item.file})`);
    const prompt = buildPrompt(item);
    console.log(`Prompt preview: ${prompt.slice(0, 80)}...`);

    // Clean tmp dir before generation
    fs.readdirSync(TMP_DIR).forEach(f => {
      try { fs.unlinkSync(path.join(TMP_DIR, f)); } catch(e) {}
    });

    // Start fresh chat session to prevent message pileup
    try {
      execSync('/Users/sym/Library/pnpm/opencli chatgpt new', { stdio: 'ignore' });
      await sleep(2000);
    } catch (e) {}

    const cmd = `/Users/sym/Library/pnpm/opencli chatgpt image ${JSON.stringify(prompt)} --op ${TMP_DIR} --timeout 300`;
    try {
      execSync(cmd, { stdio: 'inherit' });
      const latest = getLatestPng(TMP_DIR);
      if (latest && fs.existsSync(latest)) {
        fs.copyFileSync(latest, targetFile);
        console.log(`✓ Saved to ${targetFile} (${(fs.statSync(targetFile).size / 1024 / 1024).toFixed(2)} MB)`);
      } else {
        console.error(`✗ No image found in ${TMP_DIR} for ${item.file}`);
      }
    } catch (err) {
      console.error(`✗ Error generating ${item.file}:`, err.message);
    }

    // Cooling pause between generations
    console.log("Waiting 8s cooldown before next generation...");
    await sleep(8000);
  }
}

run();
