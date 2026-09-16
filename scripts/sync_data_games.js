const fs = require('fs');
const path = require('path');
const { ITEMS, buildPrompt } = require('./batch_games');

const DATA_FILE = path.resolve(__dirname, '../data.js');

// Group ITEMS by game:
const gameOrder = [
  "黑神话：悟空",
  "艾尔登法环",
  "塞尔达传说",
  "荒野大镖客2",
  "原神",
  "巫师3",
  "赛博朋克2077",
  "最终幻想7"
];

let sortedItems = [];
for (const g of gameOrder) {
  const matching = ITEMS.filter(it => it.game === g);
  sortedItems = sortedItems.concat(matching);
}

const formattedItems = sortedItems.map((item, idx) => {
  return {
    id: idx + 1,
    name: item.name,
    title: item.title,
    features: item.features,
    keywords: item.keywords,
    colors: item.colors,
    output: `images/games/${item.file}`,
    prompt: buildPrompt(item)
  };
});

const content = fs.readFileSync(DATA_FILE, 'utf-8');

const splitMarker = '  "games": {';
if (!content.includes(splitMarker)) {
  console.error("Marker not found in data.js");
  process.exit(1);
}

const parts = content.split(splitMarker);
const before = parts[0];

const gamesHeader = `  "games": {
    "id": "games",
    "title": "游戏神作",
    "titleEn": "Iconic Video Games",
    "count": 40,
    "kicker": "legendary games / characters & scenes / 2026",
    "headline": "橡胶戳旷世史诗<br>游戏神作",
    "desc": "8 款全球顶流现象级游戏、40 组标志性主角与经典场景交融的版画印章。融合东方神话、交界地史诗、海拉鲁旷野与西部狂野，以极简木刻阳刻线定格游戏艺术的高光时刻。",
    "tagPrefix": "游戏",
    "badgeFormat": "神作 {id}",
    "items": `;

const itemsJson = JSON.stringify(formattedItems, null, 6);
// Indent items properly
const indentedItems = itemsJson
  .split('\n')
  .map((line, i) => (i === 0 ? line : '    ' + line))
  .join('\n');

const after = `
  }
};

// 兼容旧版引用
window.CITIES = window.COLLECTIONS.cities.items;
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

const finalContent = before + gamesHeader + indentedItems + after;
fs.writeFileSync(DATA_FILE, finalContent, 'utf-8');
console.log(`Successfully updated data.js with ${formattedItems.length} game items!`);
