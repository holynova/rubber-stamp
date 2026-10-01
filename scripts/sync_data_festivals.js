const fs = require('fs');
const path = require('path');
const { FESTIVALS_LIST } = require('./batch_festivals_category');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.resolve(ROOT_DIR, 'data.js');
const INDEX_FILE = path.resolve(ROOT_DIR, 'index.html');
const PROMPTS_FILE = path.resolve(ROOT_DIR, 'prompts_festivals_category.json');

// Build formatted items
const formattedItems = FESTIVALS_LIST.map(item => {
  return {
    id: item.id,
    name: item.name,
    title: item.title,
    features: item.features,
    keywords: item.keywords,
    colors: item.colors,
    output: `images/festivals/${item.file}`,
    prompt: item.prompt
  };
});

// 1. Write prompts_festivals_category.json
fs.writeFileSync(PROMPTS_FILE, JSON.stringify(formattedItems, null, 2), 'utf-8');
console.log(`✓ Generated ${PROMPTS_FILE} (${formattedItems.length} items)`);

// 2. Read existing data.js
let content = fs.readFileSync(DATA_FILE, 'utf-8');

const festivalsCollection = {
  id: "festivals",
  title: "时令节日",
  titleEn: "Festivals & Folkways",
  count: formattedItems.length,
  kicker: "festivals & cultural traditions / rubber stamp collection / 2026",
  headline: "橡胶戳岁时佳节<br>华夏节庆与知名节俗",
  desc: "精选 20 个中国最具代表性的岁时传统节令与广为人知的现代经典节日。以极简手工多色版画雕刻印章，凝固人间烟火与岁序浪漫。",
  tagPrefix: "节日",
  badgeFormat: "节日 {id}",
  items: formattedItems
};

const festivalsJson = JSON.stringify(festivalsCollection, null, 4)
  .split('\n')
  .map((line, idx) => idx === 0 ? line : '    ' + line)
  .join('\n');

// Check if festivals already exists in data.js
if (content.includes('"festivals":')) {
  // Replace existing festivals
  content = content.replace(
    /\s*"festivals":\s*\{[\s\S]*?\n\s*\},(\n\s*"games":)/,
    `\n  "festivals": ${festivalsJson},\$1`
  );
} else {
  // Insert right after china_cities and before games
  const marker = '\n  "games": {';
  if (content.includes(marker)) {
    content = content.replace(
      marker,
      `\n  "festivals": ${festivalsJson},\n  "games": {`
    );
  } else {
    content = content.replace(
      /\n\};\n\n\/\/ 兼容旧版引用/,
      `,\n  "festivals": ${festivalsJson}\n};\n\n// 兼容旧版引用`
    );
  }
}

// Add window.FESTIVALS compatibility if not present
if (!content.includes('window.FESTIVALS =')) {
  content = content.replace(
    'window.CHINA_CITIES = window.COLLECTIONS.china_cities ? window.COLLECTIONS.china_cities.items : [];',
    'window.CHINA_CITIES = window.COLLECTIONS.china_cities ? window.COLLECTIONS.china_cities.items : [];\nwindow.FESTIVALS = window.COLLECTIONS.festivals ? window.COLLECTIONS.festivals.items : [];'
  );
}

// Update header summary comment in data.js
content = content.replace(
  /\/\/ 橡胶戳艺术画廊数据集：[^\n]+/,
  '// 橡胶戳艺术画廊数据集：名胜风景 (50) · 古诗名句 (50) · 世界城市 (30) · 中国城市 (30) · 时令节日 (20) · 游戏神作 (40) · 珍稀动物 (20) · 海洋生物 (20) · 大气现象 (20) · 十二生肖 (12) · 二十四节气 (24) · 山海神异 (10) -> 共 326 枚'
);

fs.writeFileSync(DATA_FILE, content, 'utf-8');
console.log(`✓ Updated ${DATA_FILE} successfully with festivals collection!`);

// 3. Update index.html navigation tabs if not already present
let indexContent = fs.readFileSync(INDEX_FILE, 'utf-8');
if (!indexContent.includes('data-series="festivals"')) {
  const tabButton = `        <button class="xhs-tab" data-series="festivals">
          <span class="tab-text">节日</span>
          <span class="tab-indicator"></span>
        </button>`;

  indexContent = indexContent.replace(
    /(<button class="xhs-tab" data-series="china_cities">[\s\S]*?<\/button>)/,
    `\$1\n${tabButton}`
  );
  fs.writeFileSync(INDEX_FILE, indexContent, 'utf-8');
  console.log(`✓ Updated ${INDEX_FILE} with festivals navigation tab!`);
} else {
  console.log(`✓ ${INDEX_FILE} already includes festivals navigation tab.`);
}
