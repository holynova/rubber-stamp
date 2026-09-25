const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.resolve(ROOT_DIR, 'images/festivals');
const THUMB_DIR = path.resolve(ROOT_DIR, 'images/thumbnails/festivals');
const DETAIL_DIR = path.resolve(ROOT_DIR, 'images/detail_webp/festivals');
const TMP_DIR = '/tmp/festivals_gen';
const OPENCLI = '/Users/sym/Library/pnpm/opencli';

[OUTPUT_DIR, THUMB_DIR, DETAIL_DIR, TMP_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const MOON_ITEMS = [
  {
    id: 7,
    festival: 'mid_autumn',
    festivalName: '中秋节',
    name: '桂影穿月',
    file: '07_中秋_桂影穿月.png',
    title: '桂影穿月 · 玉兔凝望',
    desc: '一轮秋月高悬，金桂横斜破月而过，玉兔仰首凝望天际',
    colors: '桂花金黄 · 故宫朱红 · 松烟墨黑',
    prompt: "A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: Mid-Autumn Festival - Osmanthus Branch Crossing Harvest Moon (中秋桂影穿月). Extremely simplified iconic silhouette of a luminous golden autumn moon high in the open sky, dramatically crossed by a gnarled asymmetrical osmanthus branch laden with delicate clusters of fragrant golden flowers and scattering petals, below which an agile white jade rabbit sits gazing upward in wonder, open natural organic silhouette. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: osmanthus golden yellow, imperial cinnabar red, and pine soot black. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO circular frame, NO round border, NO circular composition, NO circle enclosure, NO round seal medallion, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark."
  },
  {
    id: 8,
    festival: 'mid_autumn',
    festivalName: '中秋节',
    name: '飞檐托月',
    file: '08_中秋_飞檐托月.png',
    title: '飞檐托月 · 古阁清辉',
    desc: '重檐飞翘托衬一轮朗月，朱红宫灯随风轻曳，天幕空灵',
    colors: '故宫朱红 · 琉璃月金 · 黛瓦墨灰',
    prompt: "A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: Mid-Autumn Festival - Ancient Pavilion Eaves Cradling Moon (飞檐托月古阁清辉). Extremely simplified iconic silhouette of sweeping upturned eaves of a traditional Chinese pavilion extending diagonally from the left with carved rooftop beast finials pointing towards and cradling a glowing autumn moon in the open night sky, with a single imperial red palace lantern swaying gently from the eave tip, open architectural diagonal silhouette with wide empty rice paper sky. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: imperial cinnabar red, autumn moon ochre gold, and slate tile black. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO circular frame, NO round border, NO circular composition, NO circle enclosure, NO round seal medallion, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark."
  },
  {
    id: 9,
    festival: 'mid_autumn',
    festivalName: '中秋节',
    name: '流云捧月',
    file: '09_中秋_流云捧月.png',
    title: '流云捧月 · 嫦娥凌虚',
    desc: '如意祥云漫卷半掩清月，嫦娥广袖飞扬凌虚飞升',
    colors: '浅水石青 · 桃粉浅红 · 皓月秋金',
    prompt: "A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: Mid-Autumn Festival - Chang'e Ascending to the Misty Moon (流云捧月嫦娥凌虚). Extremely simplified iconic silhouette of celestial maiden Chang'e ascending gracefully into the night sky with fluttering silk ribbons and flowing sleeves, carrying an osmanthus sprig towards a soft glowing autumn moon partially veiled by dynamic sweeping swirl clouds, open vertical ascending silhouette. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: river indigo slate blue, soft blossom pink, and glowing moon yellow. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO circular frame, NO round border, NO circular composition, NO circle enclosure, NO round seal medallion, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark."
  },
  {
    id: 10,
    festival: 'mid_autumn',
    festivalName: '中秋节',
    name: '断桥霁月',
    file: '10_中秋_断桥霁月.png',
    title: '断桥霁月 · 湖波流金',
    desc: '断桥横卧烟波，明月高悬倾泻碎金，垂柳残荷秋韵深',
    colors: '西湖石绿 · 朗月秋金 · 松烟水墨',
    prompt: "A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: Mid-Autumn Festival - West Lake Broken Bridge Under Autumn Moon (平湖秋月断桥霁月). Extremely simplified iconic silhouette of an arched stone bridge crossing tranquil lake water ripples, flanked on one side by weeping willow branches and autumn lotus pods, with a luminous autumn moon shining high above casting subtle golden reflections on the water, open horizontal-diagonal landscape silhouette. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: lake willow green, harvest moon ochre gold, and pine soot ink black. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO circular frame, NO round border, NO circular composition, NO circle enclosure, NO round seal medallion, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark."
  },
  {
    id: 11,
    festival: 'mid_autumn',
    festivalName: '中秋节',
    name: '把酒邀月',
    file: '11_中秋_把酒邀月.png',
    title: '把酒邀月 · 谪仙凭栏',
    desc: '举杯邀明月，对影成三人。诗仙凭栏把盏对空遥祝',
    colors: '松烟墨黑 · 琉璃月黄 · 故宫朱红',
    prompt: "A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: Mid-Autumn Festival - Poet Li Bai Raising Cup to the Moon (举杯邀月把酒问天). Extremely simplified iconic silhouette of ancient Chinese poet in flowing scholar robes sitting beside slender bamboo stalks on a rocky outcrop, raising a traditional wine chalice high toward a bright luminous autumn moon hanging in the open sky, a wine jar on the stone table, open diagonal silhouette with vast negative space. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: pine soot ink black, imperial cinnabar red, and moonlight pale gold. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO circular frame, NO round border, NO circular composition, NO circle enclosure, NO round seal medallion, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark."
  },
  {
    id: 12,
    festival: 'mid_autumn',
    festivalName: '中秋节',
    name: '孤舟载月',
    file: '12_中秋_孤舟载月.png',
    title: '孤舟载月 · 芦荡晚泊',
    desc: '满载一船秋色，平铺十里湖光。扁舟系缆荻花浅滩，月华如水',
    colors: '浅水苍青 · 芦花暖金 · 苍石深褐',
    prompt: "A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: Mid-Autumn Festival - Lone Boat Moored Under Autumn Moon (孤舟载月芦荡晚泊). Extremely simplified iconic silhouette of a slender wooden fishing skiff moored among wind-blown wild autumn river reeds and cattails, a warm lantern glowing at the prow, with a serene glowing autumn moon hovering over tranquil water ripples and distant rolling mountain silhouettes, open landscape contour. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: river indigo slate blue, warm lantern amber gold, and charcoal soot grey. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO circular frame, NO round border, NO circular composition, NO circle enclosure, NO round seal medallion, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark."
  },
  {
    id: 13,
    festival: 'mid_autumn',
    festivalName: '中秋节',
    name: '松崖映月',
    file: '13_中秋_松崖映月.png',
    title: '松崖映月 · 黄山秋霁',
    desc: '明月松间照，清泉石上流。奇松破壁探虚空，群峰云海揽明月',
    colors: '黄山石绿 · 皓月秋金 · 岩石赭褐',
    prompt: "A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: Mid-Autumn Festival - Pine Cliff and Rising Autumn Moon (松崖映月黄山秋霁). Extremely simplified iconic silhouette of an ancient gnarled pine tree emerging from a craggy granite cliff edge on one side, jutting out over stylized swirling mountain mist, with a magnificent luminous autumn moon rising high above distant mountain ridges, open dramatic diagonal mountain landscape silhouette. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: mountain pine green, harvest moon ochre gold, and crag stone black. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO circular frame, NO round border, NO circular composition, NO circle enclosure, NO round seal medallion, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark."
  }
];

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

async function processStandardImages(rawImgPath, targetPngPath, baseName) {
  const meta = await sharp(rawImgPath).metadata();
  console.log(`  Raw size: ${meta.width}x${meta.height}`);

  await sharp(rawImgPath)
    .resize(1122, 1402, { fit: 'cover', position: 'center' })
    .png({ compressionLevel: 8 })
    .toFile(targetPngPath);
  console.log(`  ✓ Saved standard 1122x1402 PNG: ${targetPngPath}`);

  const thumbPath = path.join(THUMB_DIR, `${baseName}.webp`);
  await sharp(targetPngPath)
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(thumbPath);
  console.log(`  ✓ Generated thumbnail: ${thumbPath}`);

  const detailPath = path.join(DETAIL_DIR, `${baseName}.webp`);
  await sharp(targetPngPath)
    .webp({ quality: 85, effort: 4 })
    .toFile(detailPath);
  console.log(`  ✓ Generated detail WebP: ${detailPath}`);
}

async function run() {
  console.log(`=== Starting Mid-Autumn Festival Moon Stamps Generation (${MOON_ITEMS.length} items) ===\n`);

  // Update prompts_festivals.json
  const promptsPath = path.resolve(ROOT_DIR, 'prompts_festivals.json');
  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));
  } catch(e) {}
  
  // Merge
  const merged = [...existing];
  for (const item of MOON_ITEMS) {
    const idx = merged.findIndex(x => x.id === item.id);
    if (idx >= 0) merged[idx] = item;
    else merged.push(item);
  }
  fs.writeFileSync(promptsPath, JSON.stringify(merged, null, 2), 'utf-8');
  console.log(`✓ Updated prompt config in ${promptsPath}\n`);

  for (let i = 0; i < MOON_ITEMS.length; i++) {
    const item = MOON_ITEMS[i];
    const targetFile = path.join(OUTPUT_DIR, item.file);
    const baseName = path.parse(item.file).name;

    console.log(`------------------------------------------------------------`);
    console.log(`[${i + 1}/${MOON_ITEMS.length}] Generating ${item.festivalName} · ${item.name} (${item.file})`);
    console.log(`Theme: ${item.title}`);
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

    const cmd = `${OPENCLI} chatgpt image ${JSON.stringify(item.prompt)} --op ${TMP_DIR} --timeout 300`;
    let success = false;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`  [Attempt ${attempt}/3] Running opencli chatgpt image...`);
        execSync(cmd, { stdio: 'inherit' });
        const latest = getLatestPng(TMP_DIR);
        if (latest && fs.existsSync(latest)) {
          await processStandardImages(latest, targetFile, baseName);
          success = true;
          break;
        } else {
          console.warn(`  Attempt ${attempt} produced no image in ${TMP_DIR}`);
        }
      } catch (err) {
        console.error(`  Attempt ${attempt} error:`, err.message);
      }
      if (attempt < 3) {
        console.log("  Waiting 10s before retry...");
        await sleep(10000);
      }
    }

    if (!success) {
      console.error(`✗ Failed to generate ${item.file}`);
    }

    if (i < MOON_ITEMS.length - 1) {
      console.log("  Waiting 5s before next image...\n");
      await sleep(5000);
    }
  }

  console.log(`\n=== All Mid-Autumn Moon Stamps Completed! ===`);
}

run();
