const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data.js');

global.window = {};
require(DATA_FILE);

const COLLECTIONS = window.COLLECTIONS;

const FILE_MAP = {
  scenic_spots: 'prompts_scenic_spots.json',
  poetry: 'prompts_poetry.json',
  marine: 'prompts_marine.json',
  atmosphere: 'prompts_atmosphere.json',
  china_cities: 'prompts_china_cities.json',
  games: 'prompts_games.json'
};

for (const [collKey, jsonFile] of Object.entries(FILE_MAP)) {
  const p = path.join(ROOT_DIR, jsonFile);
  if (!fs.existsSync(p)) continue;
  const items = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (COLLECTIONS[collKey]) {
    items.forEach(srcItem => {
      const tgtItem = COLLECTIONS[collKey].items.find(x => x.id === srcItem.id);
      if (tgtItem) {
        tgtItem.prompt = srcItem.prompt;
      }
    });
    console.log(`Synced ${collKey} (${items.length} items)`);
  }
}

const headerComment = `// 橡胶戳艺术画廊数据集：名胜风景 (50) · 古诗名句 (50) · 世界城市 (30) · 中国城市 (30) · 游戏神作 (40) · 珍稀动物 (20) · 海洋生物 (20) · 大气现象 (20) · 十二生肖 (12) · 二十四节气 (24) · 山海神异 (10) -> 共 306 枚\n`;
const collectionsCode = `window.COLLECTIONS = ${JSON.stringify(COLLECTIONS, null, 2)};\n\n`;
const tailCode = `// 兼容旧版引用
window.CITIES = window.COLLECTIONS.cities.items;
window.CHINA_CITIES = window.COLLECTIONS.china_cities ? window.COLLECTIONS.china_cities.items : [];
window.SCENIC_SPOTS = window.COLLECTIONS.scenic_spots.items;
window.POETRY = window.COLLECTIONS.poetry.items;
window.WILDLIFE = window.COLLECTIONS.wildlife.items;
window.MARINE = window.COLLECTIONS.marine.items;
window.ATMOSPHERE = window.COLLECTIONS.atmosphere.items;
window.ZODIAC = window.COLLECTIONS.zodiac.items;
window.SOLAR_TERMS = window.COLLECTIONS.solar_terms.items;
window.SHANHAIJING = window.COLLECTIONS.shanhaijing.items;
window.GAMES = window.COLLECTIONS.games.items;
`;

fs.writeFileSync(DATA_FILE, headerComment + collectionsCode + tailCode, 'utf8');
console.log('✓ Successfully wrote synchronized data.js!');
