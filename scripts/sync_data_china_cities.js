const fs = require('fs');
const path = require('path');
const { ITEMS, buildPrompt } = require('./batch_china_cities');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.resolve(ROOT_DIR, 'data.js');
const PROMPTS_FILE = path.resolve(ROOT_DIR, 'prompts_china_cities.json');

// Build formatted items
const formattedItems = ITEMS.map(item => {
  return {
    id: item.id,
    name: item.name,
    city: item.city,
    region: item.region,
    title: item.title,
    features: item.features,
    keywords: item.keywords,
    colors: item.colors,
    output: `images/china_cities/${item.file}`,
    prompt: buildPrompt(item)
  };
});

// 1. Write prompts_china_cities.json
fs.writeFileSync(PROMPTS_FILE, JSON.stringify(formattedItems, null, 2), 'utf-8');
console.log(`✓ Generated ${PROMPTS_FILE} (${formattedItems.length} items)`);

// 2. Read existing data.js
let content = fs.readFileSync(DATA_FILE, 'utf-8');

const chinaCitiesCollection = {
  id: "china_cities",
  title: "中国城市",
  titleEn: "Major Chinese Cities",
  count: formattedItems.length,
  kicker: "china major metropolitan field notes / rubber stamp collection / 2026",
  headline: "橡胶戳华夏名城<br>中国知名大城市",
  desc: "精选 30 座中国最具代表性的直辖市、新一线与核心大城市。以极简手工多色版画雕刻印章，定格每座城池最富辨识度的天际线、古今地标与文脉印记。",
  tagPrefix: "名城",
  badgeFormat: "名城 {id}",
  items: formattedItems
};

const chinaCitiesJson = JSON.stringify(chinaCitiesCollection, null, 4)
  .split('\n')
  .map((line, idx) => idx === 0 ? line : '    ' + line)
  .join('\n');

// Check if china_cities already exists in data.js
if (content.includes('"china_cities":')) {
  // Replace existing china_cities
  content = content.replace(
    /\s*"china_cities":\s*\{[\s\S]*?\n\s*\},(\n\s*"games":)/,
    `\n  "china_cities": ${chinaCitiesJson},\$1`
  );
} else {
  // Insert right before games
  const marker = '\n  "games": {';
  if (content.includes(marker)) {
    content = content.replace(
      marker,
      `\n  "china_cities": ${chinaCitiesJson},\n  "games": {`
    );
  } else {
    content = content.replace(
      /\n\};\n\n\/\/ 兼容旧版引用/,
      `,\n  "china_cities": ${chinaCitiesJson}\n};\n\n// 兼容旧版引用`
    );
  }
}

// Add window.CHINA_CITIES compatibility if not present
if (!content.includes('window.CHINA_CITIES =')) {
  content = content.replace(
    'window.CITIES = window.COLLECTIONS.cities.items;',
    'window.CITIES = window.COLLECTIONS.cities.items;\nwindow.CHINA_CITIES = window.COLLECTIONS.china_cities ? window.COLLECTIONS.china_cities.items : [];'
  );
}

// Update header summary comment in data.js
content = content.replace(
  /\/\/ 橡胶戳艺术画廊数据集：[^\n]+/,
  '// 橡胶戳艺术画廊数据集：名胜风景 (50) · 古诗名句 (50) · 世界城市 (30) · 中国城市 (30) · 游戏神作 (40) · 珍稀动物 (20) · 海洋生物 (20) · 大气现象 (20) · 十二生肖 (12) · 二十四节气 (24) · 山海神异 (10) -> 共 306 枚'
);

fs.writeFileSync(DATA_FILE, content, 'utf-8');
console.log(`✓ Updated ${DATA_FILE} successfully with china_cities collection!`);
