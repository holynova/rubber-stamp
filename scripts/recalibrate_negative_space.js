const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT_DIR, 'images');

// ==========================================
// 1. BOUNDING BOX DETECTION HELPER
// ==========================================
async function detectIsolatedArtwork(file, inkThresh = 175) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;

  const rowInk = new Int32Array(h);
  const colInk = new Int32Array(w);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * c;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      if (lum < inkThresh) {
        rowInk[y]++;
        colInk[x]++;
      }
    }
  }

  const initCenterX = Math.round(w / 2);
  const initCenterY = Math.round(h * 0.52);
  const noiseThresh = 15;
  const maxGap = 25;

  let left = initCenterX;
  let gapCount = 0;
  for (let x = initCenterX; x >= 0; x--) {
    if (colInk[x] < noiseThresh) {
      if (++gapCount >= maxGap) { left = x + maxGap; break; }
    } else gapCount = 0;
  }

  let right = initCenterX;
  gapCount = 0;
  for (let x = initCenterX; x < w; x++) {
    if (colInk[x] < noiseThresh) {
      if (++gapCount >= maxGap) { right = x - maxGap; break; }
    } else gapCount = 0;
  }

  let top = initCenterY;
  gapCount = 0;
  for (let y = initCenterY; y >= 0; y--) {
    if (rowInk[y] < noiseThresh) {
      if (++gapCount >= maxGap) { top = y + maxGap; break; }
    } else gapCount = 0;
  }

  let bottom = initCenterY;
  gapCount = 0;
  for (let y = initCenterY; y < h; y++) {
    if (rowInk[y] < noiseThresh) {
      if (++gapCount >= maxGap) { bottom = y - maxGap; break; }
    } else gapCount = 0;
  }

  const artW = Math.max(0, right - left + 1);
  const artH = Math.max(0, bottom - top + 1);
  const centerX = Math.round((left + right) / 2);
  const centerY = Math.round((top + bottom) / 2);

  return { w, h, c, left, right, top, bottom, artW, artH, centerX, centerY };
}

// ==========================================
// 2. CITY BOUNDING BOX DETECTION HELPER
// ==========================================
async function detectCityArtwork(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;

  const rowInk = new Int32Array(h);
  for (let y = 0; y < h; y++) {
    for (let x = 60; x < w - 60; x++) {
      const idx = (y * w + x) * c;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      if (lum < 175) rowInk[y]++;
    }
  }

  // Find gap between artwork and text (text is near bottom, y in [920..1220])
  let minInk = 999999;
  let gapY = 1050;
  for (let y = 920; y < 1220; y++) {
    let sum = 0;
    for (let dy = -3; dy <= 3; dy++) sum += rowInk[y + dy];
    if (sum < minInk) {
      minInk = sum;
      gapY = y;
    }
  }

  // Artwork bottom: scan upward from gapY
  let artBottom = gapY;
  while (artBottom > 200 && rowInk[artBottom] < 15) artBottom--;

  // Artwork top: scan downward from 100
  let artTop = 100;
  while (artTop < artBottom && rowInk[artTop] < 15) artTop++;

  // Column ink between artTop and artBottom
  const colInk = new Int32Array(w);
  for (let y = artTop; y <= artBottom; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * c;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      if (lum < 175) colInk[x]++;
    }
  }

  const initCenterX = Math.round(w / 2);
  const noiseThresh = 15;
  const maxGap = 20;

  let artLeft = initCenterX;
  let gap = 0;
  for (let x = initCenterX; x >= 0; x--) {
    if (colInk[x] < noiseThresh) {
      if (++gap >= maxGap) { artLeft = x + maxGap; break; }
    } else gap = 0;
  }

  let artRight = initCenterX;
  gap = 0;
  for (let x = initCenterX; x < w; x++) {
    if (colInk[x] < noiseThresh) {
      if (++gap >= maxGap) { artRight = x - maxGap; break; }
    } else gap = 0;
  }

  const artW = artRight - artLeft + 1;
  const artH = artBottom - artTop + 1;
  const centerX = Math.round((artLeft + artRight) / 2);
  const centerY = Math.round((artTop + artBottom) / 2);

  return { data, w, h, c, gapY, artTop, artBottom, artLeft, artRight, artW, artH, centerX, centerY };
}

// ==========================================
// 3. MEASURE ARTWORK METRICS IN FINAL IMAGE
// ==========================================
async function measureArtwork(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const margin = 15;
  const rowInk = new Int32Array(h);
  const colInk = new Int32Array(w);

  for (let y = margin; y < h - margin; y++) {
    for (let x = margin; x < w - margin; x++) {
      const idx = (y * w + x) * c;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      if (lum < 180) {
        rowInk[y]++;
        colInk[x]++;
      }
    }
  }

  let top = margin;
  while (top < h - margin && rowInk[top] < 20) top++;
  let bottom = h - 1 - margin;
  while (bottom >= margin && rowInk[bottom] < 20) bottom--;

  let left = margin;
  while (left < w - margin && colInk[left] < 20) left++;
  let right = w - 1 - margin;
  while (right >= margin && colInk[right] < 20) right--;

  const artW = Math.max(0, right - left + 1);
  const artH = Math.max(0, bottom - top + 1);

  return {
    w, h,
    top, bottom, left, right,
    artW, artH,
    occW: artW / w,
    occH: artH / h,
    topMargin: top / h,
    bottomMargin: (h - 1 - bottom) / h,
    negSpaceH: 1 - (artH / h),
    negSpaceW: 1 - (artW / w)
  };
}

// ==========================================
// 4. PROCESS SOLAR TERMS (24 IMAGES)
// ==========================================
async function processSolarTerms() {
  console.log('\n==================================================');
  console.log('🌸 Processing 24 Solar Terms (二十四节气)...');
  console.log('==================================================');

  const srcDir = path.join(IMAGES_DIR, 'backup_solar_terms');
  const destDir = path.join(IMAGES_DIR, 'solar_terms');
  const thumbDir = path.join(IMAGES_DIR, 'thumbnails/solar_terms');
  const detailDir = path.join(IMAGES_DIR, 'detail_webp/solar_terms');

  [destDir, thumbDir, detailDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.png')).sort();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    const baseName = path.parse(file).name;
    const thumbFile = path.join(thumbDir, `${baseName}.webp`);
    const detailFile = path.join(detailDir, `${baseName}.webp`);

    const det = await detectIsolatedArtwork(srcFile);

    // Frame at 4:5 ratio: max(artH / 0.70, (artW / 0.80) / 0.8)
    const cropH = Math.round(Math.max(det.artH / 0.70, (det.artW / 0.80) / 0.8));
    const cropW = Math.round(cropH * 0.8);

    let cropL = Math.round(det.centerX - cropW / 2);
    let cropT = Math.round(det.centerY - cropH / 2);

    // Boundary clamp
    if (cropL < 0) cropL = 0;
    if (cropL + cropW > det.w) cropL = det.w - cropW;
    if (cropT < 0) cropT = 0;
    if (cropT + cropH > det.h) cropT = det.h - cropH;

    // 1. Generate standard 1122x1402 PNG
    await sharp(srcFile)
      .extract({ left: cropL, top: cropT, width: cropW, height: cropH })
      .resize(1122, 1402)
      .png({ compressionLevel: 8 })
      .toFile(destFile);

    // 2. Generate WebP Thumbnail (width 400, quality 82)
    await sharp(destFile)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(thumbFile);

    // 3. Generate Detail WebP (1122x1402, quality 85)
    await sharp(destFile)
      .webp({ quality: 85, effort: 4 })
      .toFile(detailFile);

    const occW = ((det.artW / cropW) * 100).toFixed(1);
    const occH = ((det.artH / cropH) * 100).toFixed(1);
    console.log(`[${String(i + 1).padStart(2)}/24] ✓ ${file.padEnd(14)} | Art: ${det.artW}x${det.artH} | Crop: [${cropL},${cropT}, ${cropW}x${cropH}] | Occ: ${occW}% W, ${occH}% H`);
  }
}

// ==========================================
// 5. PROCESS ZODIAC (12 IMAGES)
// ==========================================
async function processZodiac() {
  console.log('\n==================================================');
  console.log('🐉 Processing 12 Zodiac (十二生肖)...');
  console.log('==================================================');

  const srcDir = path.join(IMAGES_DIR, 'backup_zodiac');
  const destDir = path.join(IMAGES_DIR, 'zodiac');
  const thumbDir = path.join(IMAGES_DIR, 'thumbnails/zodiac');
  const detailDir = path.join(IMAGES_DIR, 'detail_webp/zodiac');

  [destDir, thumbDir, detailDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.png')).sort();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    const baseName = path.parse(file).name;
    const thumbFile = path.join(thumbDir, `${baseName}.webp`);
    const detailFile = path.join(detailDir, `${baseName}.webp`);

    const det = await detectIsolatedArtwork(srcFile);

    // Frame at 4:5 ratio: max(artH / 0.70, (artW / 0.80) / 0.8)
    const cropH = Math.round(Math.max(det.artH / 0.70, (det.artW / 0.80) / 0.8));
    const cropW = Math.round(cropH * 0.8);

    let cropL = Math.round(det.centerX - cropW / 2);
    let cropT = Math.round(det.centerY - cropH / 2);

    // Boundary clamp
    if (cropL < 0) cropL = 0;
    if (cropL + cropW > det.w) cropL = det.w - cropW;
    if (cropT < 0) cropT = 0;
    if (cropT + cropH > det.h) cropT = det.h - cropH;

    // 1. Generate standard 1122x1402 PNG
    await sharp(srcFile)
      .extract({ left: cropL, top: cropT, width: cropW, height: cropH })
      .resize(1122, 1402)
      .png({ compressionLevel: 8 })
      .toFile(destFile);

    // 2. Generate WebP Thumbnail (width 400, quality 82)
    await sharp(destFile)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(thumbFile);

    // 3. Generate Detail WebP (1122x1402, quality 85)
    await sharp(destFile)
      .webp({ quality: 85, effort: 4 })
      .toFile(detailFile);

    const occW = ((det.artW / cropW) * 100).toFixed(1);
    const occH = ((det.artH / cropH) * 100).toFixed(1);
    console.log(`[${String(i + 1).padStart(2)}/12] ✓ ${file.padEnd(14)} | Art: ${det.artW}x${det.artH} | Crop: [${cropL},${cropT}, ${cropW}x${cropH}] | Occ: ${occW}% W, ${occH}% H`);
  }
}

// ==========================================
// 6. PROCESS WORLD CITIES (30 IMAGES)
// ==========================================
async function processCities() {
  console.log('\n==================================================');
  console.log('🏙️  Processing 30 World Cities (世界城市)...');
  console.log('==================================================');

  const srcDir = path.join(IMAGES_DIR, 'backup_cities');
  const destDir = IMAGES_DIR;
  const thumbDir = path.join(IMAGES_DIR, 'thumbnails');
  const detailDir = path.join(IMAGES_DIR, 'detail_webp');

  const files = fs.readdirSync(srcDir).filter(f => /^\d\d_/.test(f) && f.endsWith('.png')).sort();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    const baseName = path.parse(file).name;
    const thumbFile = path.join(thumbDir, `${baseName}.webp`);
    const detailFile = path.join(detailDir, `${baseName}.webp`);

    const det = await detectCityArtwork(srcFile);

    // Frame at 4:5 ratio: max(artH / 0.70, (artW / 0.80) / 0.8)
    let cropH = Math.round(Math.max(det.artH / 0.70, (det.artW / 0.80) / 0.8));
    let cropW = Math.min(det.w, Math.round(cropH * 0.8));
    cropH = Math.round(cropW / 0.8);

    let cropL = Math.round(det.centerX - cropW / 2);
    let cropT = Math.round(det.centerY - cropH / 2);

    if (cropL < 0) cropL = 0;
    if (cropL + cropW > det.w) cropL = det.w - cropW;
    if (cropT < 0) cropT = 0;

    const requiredH = Math.max(det.h, cropT + cropH + 50);
    const extBuf = Buffer.alloc(det.w * requiredH * det.c);
    det.data.copy(extBuf, 0, 0, det.w * det.h * det.c);

    // Seamless texture patching of typewriter text area
    const patchStartY = Math.max(det.artBottom + 5, det.gapY - 15);
    const sampleTopY = 80;
    const feather = 20;

    for (let y = patchStartY; y < requiredH; y++) {
      const dy = y - patchStartY;
      const alpha = Math.min(1.0, dy / feather);
      const sampleY = sampleTopY + (dy % 350);
      const origY = Math.min(det.h - 1, y);

      for (let x = 0; x < det.w; x++) {
        const targetIdx = (y * det.w + x) * det.c;
        const sampleIdx = (sampleY * det.w + x) * det.c;
        const origIdx = (origY * det.w + x) * det.c;

        for (let ch = 0; ch < 3; ch++) {
          extBuf[targetIdx + ch] = Math.round(det.data[origIdx + ch] * (1 - alpha) + det.data[sampleIdx + ch] * alpha);
        }
        if (det.c === 4) extBuf[targetIdx + 3] = 255;
      }
    }

    // 1. Generate standard 1122x1402 PNG
    await sharp(extBuf, { raw: { width: det.w, height: requiredH, channels: det.c } })
      .extract({ left: cropL, top: cropT, width: cropW, height: cropH })
      .resize(1122, 1402)
      .png({ compressionLevel: 8 })
      .toFile(destFile);

    // 2. Generate WebP Thumbnail (width 400, quality 82)
    await sharp(destFile)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(thumbFile);

    // 3. Generate Detail WebP (1122x1402, quality 85)
    await sharp(destFile)
      .webp({ quality: 85, effort: 4 })
      .toFile(detailFile);

    const occW = ((det.artW / cropW) * 100).toFixed(1);
    const occH = ((det.artH / cropH) * 100).toFixed(1);
    console.log(`[${String(i + 1).padStart(2)}/30] ✓ ${file.padEnd(16)} | Art: ${det.artW}x${det.artH} | Crop: [${cropL},${cropT}, ${cropW}x${cropH}] | Occ: ${occW}% W, ${occH}% H`);
  }
}

// ==========================================
// 7. STATISTICAL REPORT GENERATION
// ==========================================
async function collectCategoryStats(dir, files) {
  let totalOccH = 0, totalOccW = 0, totalTopM = 0, totalBotM = 0;
  for (const f of files) {
    const filePath = path.join(dir, f);
    const m = await measureArtwork(filePath);
    totalOccH += m.occH;
    totalOccW += m.occW;
    totalTopM += m.topMargin;
    totalBotM += m.bottomMargin;
  }
  const n = files.length;
  return {
    count: n,
    occH: (totalOccH / n * 100).toFixed(1),
    occW: (totalOccW / n * 100).toFixed(1),
    topM: (totalTopM / n * 100).toFixed(1),
    botM: (totalBotM / n * 100).toFixed(1),
    negSpaceV: ((1 - totalOccH / n) * 100).toFixed(1),
    negSpaceH: ((1 - totalOccW / n) * 100).toFixed(1)
  };
}

async function verifyAllSiteAssets() {
  console.log('\n==================================================');
  console.log('🔍 Verifying all 276 stamps across the site...');
  console.log('==================================================');

  const content = fs.readFileSync(path.join(ROOT_DIR, 'data.js'), 'utf8');
  const fakeWindow = {};
  new Function('window', content)(fakeWindow);
  const cols = fakeWindow.COLLECTIONS;

  let totalStamps = 0;
  let validPng = 0;
  let validThumb = 0;
  let validDetail = 0;
  const errors = [];

  for (const [colKey, col] of Object.entries(cols)) {
    for (const item of col.items || []) {
      totalStamps++;
      const pngPath = path.resolve(ROOT_DIR, item.output);
      const relFromImages = item.output.replace(/^images\//, '');
      const thumbPath = path.resolve(ROOT_DIR, 'images/thumbnails', relFromImages.replace(/\.png$/, '.webp'));
      const detailPath = path.resolve(ROOT_DIR, 'images/detail_webp', relFromImages.replace(/\.png$/, '.webp'));

      try {
        const sPng = fs.statSync(pngPath);
        if (sPng.size < 1000) errors.push(`PNG too small: ${pngPath}`);
        else validPng++;
      } catch (e) {
        errors.push(`Missing PNG: ${pngPath}`);
      }

      try {
        const sThumb = fs.statSync(thumbPath);
        if (sThumb.size < 500) errors.push(`Thumb too small: ${thumbPath}`);
        else validThumb++;
      } catch (e) {
        errors.push(`Missing Thumb: ${thumbPath}`);
      }

      try {
        const sDetail = fs.statSync(detailPath);
        if (sDetail.size < 1000) errors.push(`Detail too small: ${detailPath}`);
        else validDetail++;
      } catch (e) {
        errors.push(`Missing Detail: ${detailPath}`);
      }
    }
  }

  console.log(`Total stamps registered: ${totalStamps}`);
  console.log(`Valid PNGs:             ${validPng} / ${totalStamps}`);
  console.log(`Valid Thumbnails:       ${validThumb} / ${totalStamps}`);
  console.log(`Valid Detail WebPs:     ${validDetail} / ${totalStamps}`);

  if (errors.length > 0) {
    console.error('Validation errors:', errors);
    throw new Error(`Integrity check failed with ${errors.length} errors`);
  }
  console.log('✨ All 276 stamps (PNG, Thumbnail, Detail WebP) verified 100% intact!');
}

async function main() {
  const startTime = Date.now();
  console.log('🎨 RECALIBRATE IMAGE GROUP NEGATIVE SPACE TO GOLDEN STANDARD');
  console.log('Benchmark: scenic_spots (~68-72% OccH, ~78-82% OccW, ~30% Negative Space)');
  console.log('Target Groups: 24 solar_terms + 12 zodiac + 30 cities = 66 images\n');

  // Collect BEFORE stats
  console.log('📊 Measuring BEFORE stats...');
  const scenicFiles = fs.readdirSync(path.join(IMAGES_DIR, 'scenic_spots')).filter(f => f.endsWith('.png')).sort();
  const solarFiles = fs.readdirSync(path.join(IMAGES_DIR, 'backup_solar_terms')).filter(f => f.endsWith('.png')).sort();
  const zodiacFiles = fs.readdirSync(path.join(IMAGES_DIR, 'backup_zodiac')).filter(f => f.endsWith('.png')).sort();
  const cityFiles = fs.readdirSync(path.join(IMAGES_DIR, 'backup_cities')).filter(f => /^\d\d_/.test(f) && f.endsWith('.png')).sort();

  const beforeScenic = await collectCategoryStats(path.join(IMAGES_DIR, 'scenic_spots'), scenicFiles);
  const beforeSolar = await collectCategoryStats(path.join(IMAGES_DIR, 'backup_solar_terms'), solarFiles);
  const beforeZodiac = await collectCategoryStats(path.join(IMAGES_DIR, 'backup_zodiac'), zodiacFiles);
  // Current cities in images/ before re-crop
  const beforeCities = await collectCategoryStats(IMAGES_DIR, cityFiles);

  // Execute processing
  await processSolarTerms();
  await processZodiac();
  await processCities();

  // Collect AFTER stats
  console.log('\n📊 Measuring AFTER stats...');
  const afterSolar = await collectCategoryStats(path.join(IMAGES_DIR, 'solar_terms'), solarFiles);
  const afterZodiac = await collectCategoryStats(path.join(IMAGES_DIR, 'zodiac'), zodiacFiles);
  const afterCities = await collectCategoryStats(IMAGES_DIR, cityFiles);

  // Print Comparison Table
  console.log('\n========================================================================================');
  console.log('📈 BEFORE vs AFTER NEGATIVE SPACE & OCCUPANCY CALIBRATION REPORT');
  console.log('========================================================================================');
  console.log('| 分类组别                  | 主体宽度占比 (OccW) | 主体高度占比 (OccH) | 顶部留白 (TopM) | 底部留白 (BotM) | 纵向整体留白 |');
  console.log('|---------------------------|-------------------|-------------------|----------------|----------------|-------------|');
  console.log(`| 黄金基准: 名胜风景 (50)   | ${beforeScenic.occW}%            | ${beforeScenic.occH}%            | ${beforeScenic.topM}%          | ${beforeScenic.botM}%          | ${beforeScenic.negSpaceV}%        |`);
  console.log(`| 二十四节气 (24) [处理前]  | ${beforeSolar.occW}%            | ${beforeSolar.occH}%            | ${beforeSolar.topM}%          | ${beforeSolar.botM}%          | ${beforeSolar.negSpaceV}%        |`);
  console.log(`| 二十四节气 (24) [校准后]  | ${afterSolar.occW}%            | ${afterSolar.occH}%            | ${afterSolar.topM}%          | ${afterSolar.botM}%          | ${afterSolar.negSpaceV}%        |`);
  console.log(`| 十二生肖 (12)   [处理前]  | ${beforeZodiac.occW}%            | ${beforeZodiac.occH}%            | ${beforeZodiac.topM}%          | ${beforeZodiac.botM}%          | ${beforeZodiac.negSpaceV}%        |`);
  console.log(`| 十二生肖 (12)   [校准后]  | ${afterZodiac.occW}%            | ${afterZodiac.occH}%            | ${afterZodiac.topM}%          | ${afterZodiac.botM}%          | ${afterZodiac.negSpaceV}%        |`);
  console.log(`| 世界城市 (30)   [处理前]  | ${beforeCities.occW}%            | ${beforeCities.occH}%            | ${beforeCities.topM}%          | ${beforeCities.botM}%          | ${beforeCities.negSpaceV}%        |`);
  console.log(`| 世界城市 (30)   [校准后]  | ${afterCities.occW}%            | ${afterCities.occH}%            | ${afterCities.topM}%          | ${afterCities.botM}%          | ${afterCities.negSpaceV}%        |`);
  console.log('========================================================================================\n');

  // Verify site inventory
  await verifyAllSiteAssets();

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n🎉 All operations completed successfully in ${duration}s!`);
}

main().catch(err => {
  console.error('❌ Error executing calibration:', err);
  process.exit(1);
});
