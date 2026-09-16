const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../images/games');
const TMP_DIR = '/tmp/games_gen';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

const ITEMS = [
  {
    id: 1,
    file: "01_黑神话_黄风岭.png",
    game: "黑神话：悟空",
    name: "黄风岭",
    title: "黑神话 · 黄风落日抚琴",
    features: "黄风大漠、持棍天命人、无头抚琴僧、残阳落日、苍茫苍凉",
    keywords: ["黑神话", "悟空", "黄风岭", "天命人", "无头僧"],
    colors: "赭石棕 · 姜黄 · 焦黑",
    theme: "Black Myth Wukong, Yellow Wind Ridge",
    silhouette: "the Destined One monkey warrior standing in profile on a desert cliff holding his black iron staff, facing the seated headless monk playing a Chinese ruan lute on an ancient stone altar, swirling yellow sand winds and a distant silhouetted stupa under a pale sun",
    colorPrompt: "ochre brown, warm sand ochre, and soot black"
  },
  {
    id: 2,
    file: "02_黑神话_小西天.png",
    game: "黑神话：悟空",
    name: "小西天",
    title: "黑神话 · 照鉴寒湖盘龙",
    features: "小西天覆雪冰湖、踏雪天命人、亢金龙俯冲、万仞雪峰、肃穆孤寂",
    keywords: ["黑神话", "小西天", "亢金龙", "冰湖", "雪山"],
    colors: "靛青蓝 · 铅白 · 浓墨",
    theme: "Black Myth Wukong, New Thunderclap Temple Snow Lake",
    silhouette: "the Destined One monkey warrior standing firmly with his staff upon a vast frozen ice lake, looking up at the colossal dragon Kangjin Long coiling down from jagged snow-capped mountain peaks and ancient gnarled frost pines",
    colorPrompt: "frozen indigo blue, mineral white, and ink black"
  },
  {
    id: 3,
    file: "03_艾尔登法环_黄金树.png",
    game: "艾尔登法环",
    name: "黄金树",
    title: "法环 · 宁姆格福望神树",
    features: "宁姆格福断崖、褪色者策马、灵马托雷特、通天黄金树、史诗宏伟",
    keywords: ["艾尔登法环", "黄金树", "褪色者", "灵马", "交界地"],
    colors: "秋香金 · 暮山紫 · 焦墨",
    theme: "Elden Ring, Lands Between Limgrave",
    silhouette: "the heroic Tarnished warrior mounted on the spectral steed Torrent atop a towering windy cliff, cape billowing, looking toward the titanic luminous Erdtree glowing majestically in the sky with vast sprawling golden branches",
    colorPrompt: "autumnal luminous gold, twilight purple, and dark charcoal"
  },
  {
    id: 4,
    file: "04_艾尔登法环_菈妮满月.png",
    game: "艾尔登法环",
    name: "菈妮满月",
    title: "法环 · 菈妮满月之契",
    features: "四手魔女菈妮、大檐法师帽、清冷巨大满月、雷亚卢卡利亚尖塔、神秘唯美",
    keywords: ["艾尔登法环", "菈妮", "满月", "利耶尼亚", "群星律法"],
    colors: "群青蓝 · 霁蓝 · 宣纸暖米",
    theme: "Elden Ring, Ranni the Witch under the Full Moon",
    silhouette: "the four-armed doll witch Ranni wearing her iconic oversized pointed witch hat, sitting serenely on a gothic stone balcony chair, framed by a gigantic glowing full moon in a starry night sky above mist-veiled Liurnia spires",
    colorPrompt: "celestial ultramarine blue, glintstone teal, and soft ivory"
  },
  {
    id: 5,
    file: "05_塞尔达传说_双子山.png",
    game: "塞尔达传说",
    name: "初始台地",
    title: "塞尔达 · 初始台地遥望",
    features: "初始台地岩峰、英杰服林克、背负猎弓、远眺双子山、纯净旷野",
    keywords: ["塞尔达传说", "林克", "初始台地", "双子山", "海拉鲁"],
    colors: "天青蓝 · 竹绿 · 赭石",
    theme: "The Legend of Zelda Breath of the Wild, Great Plateau",
    silhouette: "Link in his blue Champion tunic with traveler bow and shield on his back, standing upon an iconic promontory rock ledge, gazing out across Hyrule fields toward the distant cleft Dueling Peaks mountain",
    colorPrompt: "cerulean blue, meadow green, and warm earthen ochre"
  },
  {
    id: 6,
    file: "06_塞尔达传说_时之神殿.png",
    game: "塞尔达传说",
    name: "空岛神殿",
    title: "塞尔达 · 空岛云端飞跃",
    features: "空岛云海、林克自由落体俯冲、金色银杏浮空石、时之神殿、天际奇观",
    keywords: ["塞尔达传说", "王国之泪", "空岛", "时之神殿", "林克俯冲"],
    colors: "明黄赭 · 晴山蓝 · 铁线黑",
    theme: "The Legend of Zelda Tears of the Kingdom, Sky Islands",
    silhouette: "Link skydiving in a dynamic freefall posture with arms spread, surrounded by drifting golden ginkgo autumn leaves and floating sky rocks, above the mystical Temple of Time perched on a floating island among soft clouds",
    colorPrompt: "ginkgo yellow-gold, sky cerulean, and linocut iron black"
  },
  {
    id: 7,
    file: "07_荒野大镖客_夕阳断崖.png",
    game: "荒野大镖客2",
    name: "大地之心",
    title: "大镖客 · 荒原残阳勒马",
    features: "荒原断崖、宽檐帽亚瑟、勒马停步、赤红巨轮落日、西部挽歌",
    keywords: ["荒野大镖客", "亚瑟摩根", "夕阳", "西部荒野", "大地之心"],
    colors: "焦茶褐 · 暖驼黄 · 炭黑",
    theme: "Red Dead Redemption 2, The Heartlands Sunset",
    silhouette: "outlaw Arthur Morgan in cowboy hat and duster jacket reins in his loyal horse upon a rugged prairie ridge, silhouetted against a gigantic fiery crimson setting sun and the distant snowy Rocky Mountain horizon",
    colorPrompt: "burnt leather sienna, dusty sunset amber, and deep ink black"
  },
  {
    id: 8,
    file: "08_荒野大镖客_圣丹尼斯.png",
    game: "荒野大镖客2",
    name: "圣丹尼斯",
    title: "大镖客 · 雾夜煤气街灯",
    features: "圣丹尼斯青石板街、斜长孤影亚瑟、维多利亚煤气路灯、雾夜电车、工业时代",
    keywords: ["荒野大镖客", "圣丹尼斯", "雾夜", "煤气灯", "亚瑟摩根"],
    colors: "铁锈红 · 铁线黑 · 宣纸灰",
    theme: "Red Dead Redemption 2, Foggy Saint Denis Street",
    silhouette: "Arthur Morgan walking with a rifle slung over his shoulder on wet cobblestone streets beneath an ornate Victorian gas streetlight, casting a long diagonal shadow towards a foggy trolley car and brick industrial smokestacks",
    colorPrompt: "iron rust red, smoky slate grey, and lamp black"
  },
  {
    id: 9,
    file: "09_原神_望舒客栈.png",
    game: "原神",
    name: "望舒客栈",
    title: "原神 · 荻花水榭听风",
    features: "荻花洲水畔木桥、玄衣钟离品茗、金黄芦苇丛、望舒客栈巨树、东方风骨",
    keywords: ["原神", "钟离", "璃月", "望舒客栈", "荻花洲"],
    colors: "琥珀金 · 赭石褐 · 浅黛黑",
    theme: "Genshin Impact, Liyue Dihua Marsh",
    silhouette: "Zhongli (Morax) in his iconic elegant coat standing gracefully at the wooden pier overlook, holding a teacup, gazing across water ripples and swaying golden reed wetlands toward the towering ancient Wangshu Inn tree pagoda",
    colorPrompt: "amber gold, terracotta brown, and ink black"
  },
  {
    id: 10,
    file: "10_原神_鸣神大社.png",
    game: "原神",
    name: "鸣神大社",
    title: "原神 · 鸣神神樱落影",
    features: "影向山顶千本鸟居、手持长枪雷电将军、狐形粉紫神樱树、落樱纷飞、神威肃然",
    keywords: ["原神", "雷电将军", "稻妻", "神樱大社", "鸟居"],
    colors: "紫罗兰 · 朱砂红 · 墨黑",
    theme: "Genshin Impact, Inazuma Grand Narukami Shrine",
    silhouette: "Raiden Shogun (Ei) holding her signature polearm weapon standing poised before a grand vermilion Torii gate atop Mt. Yougou, under the majestic sprawling fox-shaped Sacred Sakura tree blooming with swirling purple-pink petals",
    colorPrompt: "sakura violet-pink, vermilion red, and lacquer black"
  },
  {
    id: 11,
    file: "11_巫师3_吊人树.png",
    game: "巫师3",
    name: "威伦吊人树",
    title: "巫师 · 威伦孤骑归途",
    features: "威伦荒野泥径、白发杰洛特策马萝卜、枯朽巨树、盘旋群鸦、暗黑奇幻",
    keywords: ["巫师3", "杰洛特", "萝卜", "威伦", "吊人树"],
    colors: "藤黄 · 赭石 · 浓墨",
    theme: "The Witcher 3, Velen Hanged Man's Tree",
    silhouette: "witcher Geralt of Rivia with two swords on his back and white hair riding his horse Roach along a rutted dirt road past a colossal gnarled barren tree with ravens circling beneath a dramatic golden dusk sky",
    colorPrompt: "harvest gold, earthy umber, and charcoal ink"
  },
  {
    id: 12,
    file: "12_巫师3_陶森特.png",
    game: "巫师3",
    name: "陶森特庄园",
    title: "巫师 · 陶森特暖阳小憩",
    features: "陶森特阳光露台、杰洛特与希里并肩小憩、连绵葡萄梯田、鲍克兰白石宫殿、温馨宁静",
    keywords: ["巫师3", "杰洛特", "希里", "陶森特", "鲍克兰"],
    colors: "孔雀绿 · 浅赤金 · 霁蓝",
    theme: "The Witcher 3, Toussaint Vineyard Sunset",
    silhouette: "Geralt and Ciri resting side by side on a stone terrace bench beside a small wine table, overlooking terraced lush green vineyards rolling toward the fairytale spires of Beauclair Palace bathed in warm golden sunlight",
    colorPrompt: "vineyard olive green, warm champagne gold, and royal azure"
  },
  {
    id: 13,
    file: "13_赛博朋克_夜之城.png",
    game: "赛博朋克2077",
    name: "夜之城天桥",
    title: "赛博朋克 · 霓虹双影俯瞰",
    features: "高架立交跑车、V与强尼银手倚车抽烟、荒坂巨塔天际线、浮空车穿梭、霓虹赛博",
    keywords: ["赛博朋克2077", "夜之城", "强尼银手", "V", "荒坂塔"],
    colors: "霓虹品红 · 靛青 · 炭黑",
    theme: "Cyberpunk 2077, Night City Overpass",
    silhouette: "protagonist V leaning against the hood of a sleek retro-futuristic Quadra supercar on an elevated highway, beside the ghostly silhouette of Johnny Silverhand smoking in aviator shades, facing the towering Arasaka skyscraper skyline and flying AV aerodynes",
    colorPrompt: "neon magenta, cyan indigo, and matte carbon black"
  },
  {
    id: 14,
    file: "14_赛博朋克_恶土.png",
    game: "赛博朋克2077",
    name: "恶土公路",
    title: "赛博朋克 · 恶土落日狙影",
    features: "改装皮卡车顶、盘腿持枪帕南与V、茫茫戈壁沙丘、锈蚀通讯铁塔、公路落日",
    keywords: ["赛博朋克2077", "恶土", "帕南", "流浪者", "落日"],
    colors: "雄黄 · 铁锈红 · 焦褐",
    theme: "Cyberpunk 2077, Badlands Highway Sunset",
    silhouette: "nomad Panam Palmer holding a heavy sniper rifle sitting cross-legged on the roof of a rugged customized pickup truck beside V, looking toward a fiery desert sunset over barren dunes and a giant rusted transmission tower",
    colorPrompt: "desert ochre, rusted iron red, and deep twilight brown"
  },
  {
    id: 15,
    file: "15_最终幻想7_魔晄炉.png",
    game: "最终幻想7",
    name: "壹号魔晄炉",
    title: "最终幻想 · 钢铁魔晄凝望",
    features: "钢铁镂空高架、刺猬头克劳德背负大剑、庞大圆柱形魔晄炉、幽绿魔晄光晕、重工朋克",
    keywords: ["最终幻想7", "克劳德", "破坏剑", "魔晄炉", "米德加"],
    colors: "苍绿 · 铁灰 · 浓黑",
    theme: "Final Fantasy VII Remake, Mako Reactor 1",
    silhouette: "Cloud Strife with his spiky hair and iconic gigantic Buster Sword strapped across his back, standing on an industrial metal gantry catwalk, overlooking the massive brutalist Mako Reactor emitting a subtle eerie greenish mako energy glow",
    colorPrompt: "mako emerald green, industrial steel grey, and pitch black"
  },
  {
    id: 16,
    file: "16_最终幻想7_教堂花田.png",
    game: "最终幻想7",
    name: "废弃教堂",
    title: "最终幻想 · 废墟花语晨光",
    features: "废弃教堂断壁、透顶温暖阳光束、抚花爱丽丝、守候克劳德、破败中的生机",
    keywords: ["最终幻想7", "爱丽丝", "克劳德", "废弃教堂", "黄色花田"],
    colors: "淡黄 · 胭脂粉 · 暖灰墨",
    theme: "Final Fantasy VII Remake, Sector 5 Slums Church",
    silhouette: "Aerith Gainsborough in her pink dress kneeling gently beside a basket in a patch of delicate yellow flowers growing through the broken wooden floorboards, bathed in a dramatic diagonal beam of sunlight through the ruined church roof, while Cloud watches from a shadowy timber pillar",
    colorPrompt: "flower petal yellow, soft blossom pink, and antique charcoal"
  }
];

function buildPrompt(item) {
  return `A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Theme: ${item.theme}. Extremely simplified iconic silhouette of ${item.silhouette}. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: ${item.colorPrompt}. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark.`;
}

module.exports = { ITEMS, buildPrompt };
