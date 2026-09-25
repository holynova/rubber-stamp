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

const FESTIVAL_ITEMS = [
  // 中秋节 3 张
  {
    id: 1,
    festival: 'mid_autumn',
    festivalName: '中秋节',
    name: '玉兔折桂',
    file: '01_中秋_玉兔折桂.png',
    title: '中秋月夜 · 玉兔折桂',
    desc: '玉兔腾跃折桂枝，桂子月中落，天香云外飘',
    colors: '故宫朱红 · 桂花金黄 · 松烟墨黑',
    prompt: "A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: Mid-Autumn Festival - Jade Rabbit and Fragrant Osmanthus (中秋玉兔折桂). Extremely simplified iconic silhouette of an agile white jade rabbit leaping gracefully upwards toward an asymmetric gnarled osmanthus branch laden with delicate clusters of fragrant golden osmanthus blossoms, accompanied by gently fluttering flower petals and dynamic flowing silk mist, completely open silhouette with no enclosing boundary. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: imperial cinnabar red, osmanthus golden yellow, and pine soot black. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO circular frame, NO round border, NO circular composition, NO circle enclosure, NO round seal medallion, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark."
  },
  {
    id: 2,
    festival: 'mid_autumn',
    festivalName: '中秋节',
    name: '嫦娥奔月',
    file: '02_中秋_嫦娥奔月.png',
    title: '广寒仙羽 · 嫦娥奔月',
    desc: '嫦娥应悔偷灵药，碧海青天夜夜心',
    colors: '浅水苍青 · 桃粉浅红 · 松烟墨黑',
    prompt: "A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: Mid-Autumn Festival - Chang'e Ascending to the Moon (嫦娥奔月). Extremely simplified iconic silhouette of the celestial maiden Chang'e floating gracefully into the misty night sky with long sweeping ethereal silk ribbons and celestial sleeves, holding an osmanthus sprig, hovering over carved sweeping pavilion eaves and stylized swirl clouds, an open vertical ascending silhouette. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: river indigo slate blue, soft blossom pink, and pine soot black. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO circular frame, NO round border, NO circular composition, NO circle enclosure, NO round seal medallion, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark."
  },
  {
    id: 3,
    festival: 'mid_autumn',
    festivalName: '中秋节',
    name: '水榭秋夕',
    file: '03_中秋_水榭秋夕.png',
    title: '水榭泛舟 · 荻花秋夕',
    desc: '江南水榭挂华灯，扁舟横渡荻花岸',
    colors: '苍松青绿 · 琉璃暖金 · 松烟墨黑',
    prompt: "A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: Mid-Autumn Festival - Autumn Night Water Pavilion (水榭泛舟赏月). Extremely simplified iconic silhouette of a traditional Jiangnan waterside pavilion with curved upturned eaves and an amber hanging palace lantern, a slender wooden fishing boat moored among wild autumn reeds and lotus seed pods, with soft distant mountain layers in an open horizontal-diagonal landscape silhouette. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: mountain pine green, warm amber gold, and deep charcoal soot black. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO circular frame, NO round border, NO circular composition, NO circle enclosure, NO round seal medallion, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark."
  },
  // 国庆节 3 张
  {
    id: 4,
    festival: 'national_day',
    festivalName: '国庆节',
    name: '华表祥云',
    file: '04_国庆_华表祥云.png',
    title: '巍巍华表 · 天安祥云',
    desc: '金水桥畔耸华表，重檐飞翼伴祥云，白鸽展翅迎盛世',
    colors: '故宫朱红 · 琉璃金黄 · 汉白玉青',
    prompt: "A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: National Day Celebration - Tiananmen Rostrum and Huabiao (天安门华表祥云). Extremely simplified iconic silhouette of the grand Tiananmen rostrum with flying curved eaves and hanging red lanterns, paired with a towering carved marble Huabiao ceremonial pillar with auspicious dragon and cloud carvings on one side, and two white peace doves soaring upwards in an open celebratory diagonal silhouette. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: imperial cinnabar red, forbidden city ochre gold, and slate stone grey. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO circular frame, NO round border, NO circular composition, NO circle enclosure, NO round seal medallion, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark."
  },
  {
    id: 5,
    festival: 'national_day',
    festivalName: '国庆节',
    name: '长城远眺',
    file: '05_国庆_长城远眺.png',
    title: '万里长城 · 盛世巍峨',
    desc: '万里长城蜿蜒崇山峻岭，烽燧雄关迎朝阳金晖',
    colors: '故宫朱红 · 古砖灰石 · 苍松青绿',
    prompt: "A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: National Day - Magnificent Great Wall (万里长城盛世巍峨). Extremely simplified iconic silhouette of the Great Wall of China winding across grand rugged mountain crags with stone watchtowers, beacon parapets, an ancient gnarled pine tree extending on one flank, and distant mountain ridges bathed in festive golden sunrise rays, open dynamic diagonal mountain landscape silhouette with completely open borders. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: imperial cinnabar red, ancient brick grey, and pine needle green. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO circular frame, NO round border, NO circular composition, NO circle enclosure, NO round seal medallion, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark."
  },
  {
    id: 6,
    festival: 'national_day',
    festivalName: '国庆节',
    name: '繁花祥鸽',
    file: '06_国庆_繁花祥鸽.png',
    title: '盛世繁花 · 和平祥鸽',
    desc: '富贵牡丹傲然绽放，和平吉鸽振翅高飞，国泰民安',
    colors: '故宫朱红 · 琉璃金黄 · 松烟墨黑',
    prompt: "A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: National Day - Auspicious Peonies and Peace Doves (盛世繁花国泰民安). Extremely simplified iconic silhouette of magnificent blooming Chinese peonies with layered petals and delicate leafy tendrils, with two soaring white peace doves with spread wings gliding above the floral bouquet, open organic botanical silhouette. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: vibrant cinnabar red, imperial ochre gold, and pine soot black. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO circular frame, NO round border, NO circular composition, NO circle enclosure, NO round seal medallion, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark."
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
  // Ensure target dimension is exactly 1122 x 1402 (standard 4:5 vertical)
  const meta = await sharp(rawImgPath).metadata();
  console.log(`  Raw image size: ${meta.width}x${meta.height}`);

  await sharp(rawImgPath)
    .resize(1122, 1402, { fit: 'cover', position: 'center' })
    .png({ compressionLevel: 8 })
    .toFile(targetPngPath);
  console.log(`  ✓ Saved standard 1122x1402 PNG: ${targetPngPath}`);

  // Generate 400px WebP thumbnail
  const thumbPath = path.join(THUMB_DIR, `${baseName}.webp`);
  await sharp(targetPngPath)
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(thumbPath);
  console.log(`  ✓ Generated thumbnail: ${thumbPath}`);

  // Generate 1122x1402 detail WebP
  const detailPath = path.join(DETAIL_DIR, `${baseName}.webp`);
  await sharp(targetPngPath)
    .webp({ quality: 85, effort: 4 })
    .toFile(detailPath);
  console.log(`  ✓ Generated detail WebP: ${detailPath}`);
}

async function run() {
  console.log(`=== Starting Generation of 6 Festival Stamps (3 Mid-Autumn + 3 National Day) ===\n`);

  // Write prompts to prompts_festivals.json
  const promptsPath = path.resolve(ROOT_DIR, 'prompts_festivals.json');
  fs.writeFileSync(promptsPath, JSON.stringify(FESTIVAL_ITEMS, null, 2), 'utf-8');
  console.log(`✓ Saved prompt configuration to ${promptsPath}\n`);

  for (let i = 0; i < FESTIVAL_ITEMS.length; i++) {
    const item = FESTIVAL_ITEMS[i];
    const targetFile = path.join(OUTPUT_DIR, item.file);
    const baseName = path.parse(item.file).name;

    console.log(`------------------------------------------------------------`);
    console.log(`[${i + 1}/${FESTIVAL_ITEMS.length}] Generating ${item.festivalName} · ${item.name} (${item.file})`);
    console.log(`Colors: ${item.colors}`);

    // Clean tmp directory
    fs.readdirSync(TMP_DIR).forEach(f => {
      try { fs.unlinkSync(path.join(TMP_DIR, f)); } catch(e) {}
    });

    // Reset ChatGPT session
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

    if (i < FESTIVAL_ITEMS.length - 1) {
      console.log("  Waiting 5s before next image...\n");
      await sleep(5000);
    }
  }

  console.log(`\n=== All Festival Stamps Processed! ===`);
}

run();
