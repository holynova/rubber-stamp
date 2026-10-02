const fs = require('fs');
const path = require('path');
const { TRAVEL_DESTINATIONS_LIST } = require('./batch_travel_destinations');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.resolve(ROOT_DIR, 'data.js');
const INDEX_FILE = path.resolve(ROOT_DIR, 'index.html');
const PROMPTS_FILE = path.resolve(ROOT_DIR, 'prompts_travel_destinations.json');

const files = fs.readdirSync(path.resolve(ROOT_DIR, 'images/travel_destinations')).filter(f => f.endsWith('.png'));

const formattedItems = TRAVEL_DESTINATIONS_LIST.map(item => {
  const prefix = String(item.id).padStart(2, '0');
  const match = files.find(f => f.startsWith(prefix));
  const fileName = match || `${prefix}_${item.name}.png`;
  return {
    id: item.id,
    name: item.name,
    title: item.title,
    country: item.country,
    features: item.features,
    keywords: item.keywords,
    colors: item.colors,
    output: `images/travel_destinations/${fileName}`,
    prompt: item.prompt
  };
});

fs.writeFileSync(PROMPTS_FILE, JSON.stringify(formattedItems, null, 2), 'utf-8');
console.log(`✓ Generated ${PROMPTS_FILE} (${formattedItems.length} items)`);

let content = fs.readFileSync(DATA_FILE, 'utf-8');

const travelCollection = {
  id: "travel_destinations",
  title: "热门胜地",
  titleEn: "Popular Destinations",
  count: formattedItems.length,
  kicker: "travel destinations / rubber stamp collection / 2026",
  headline: "橡胶戳山河异域<br>中外热门名胜胜境",
  desc: "精选 24 处深受国人喜爱的境内外旅行胜地，囊括川藏秘境、江南水乡、彩云之南，以及日泰海岛度假热点。以极简多色版画凝固天地胜景。",
  tagPrefix: "胜地",
  badgeFormat: "胜地 {id}",
  items: formattedItems
};

const travelJson = JSON.stringify(travelCollection, null, 4)
  .split('\n')
  .map((line, idx) => idx === 0 ? line : '    ' + line)
  .join('\n');

if (content.includes('"travel_destinations":')) {
  content = content.replace(
    /\s*"travel_destinations":\s*\{[\s\S]*?\n\s*\},(\n\s*"games":)/,
    `\n  "travel_destinations": ${travelJson},\$1`
  );
} else {
  // Insert right after festivals and before games
  const marker = '\n  "games": {';
  if (content.includes(marker)) {
    content = content.replace(
      marker,
      `\n  "travel_destinations": ${travelJson},\n  "games": {`
    );
  }
}

if (!content.includes('window.TRAVEL_DESTINATIONS =')) {
  content = content.replace(
    'window.FESTIVALS = window.COLLECTIONS.festivals ? window.COLLECTIONS.festivals.items : [];',
    'window.FESTIVALS = window.COLLECTIONS.festivals ? window.COLLECTIONS.festivals.items : [];\nwindow.TRAVEL_DESTINATIONS = window.COLLECTIONS.travel_destinations ? window.COLLECTIONS.travel_destinations.items : [];'
  );
}

content = content.replace(
  /\/\/ 橡胶戳艺术画廊数据集：[^\n]+/,
  '// 橡胶戳艺术画廊数据集：名胜风景 (50) · 古诗名句 (50) · 世界城市 (30) · 中国城市 (30) · 时令节日 (20) · 热门胜地 (24) · 游戏神作 (40) · 珍稀动物 (20) · 海洋生物 (20) · 大气现象 (20) · 十二生肖 (12) · 二十四节气 (24) · 山海神异 (10) -> 共 350 枚'
);

fs.writeFileSync(DATA_FILE, content, 'utf-8');
console.log(`✓ Updated ${DATA_FILE} successfully with travel_destinations collection!`);

let indexContent = fs.readFileSync(INDEX_FILE, 'utf-8');
if (!indexContent.includes('data-series="travel_destinations"')) {
  const tabButton = `        <button class="xhs-tab" data-series="travel_destinations">
          <span class="tab-text">热门胜地</span>
          <span class="tab-indicator"></span>
        </button>`;

  indexContent = indexContent.replace(
    /(<button class="xhs-tab" data-series="festivals">[\s\S]*?<\/button>)/,
    `\$1\n${tabButton}`
  );
  fs.writeFileSync(INDEX_FILE, indexContent, 'utf-8');
  console.log(`✓ Updated ${INDEX_FILE} with travel_destinations navigation tab!`);
} else {
  console.log(`✓ ${INDEX_FILE} already includes travel_destinations navigation tab.`);
}
