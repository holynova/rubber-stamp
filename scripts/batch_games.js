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
  // 1. 黑神话：悟空
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
    id: 17,
    file: "17_黑神话_观音禅院.png",
    game: "黑神话：悟空",
    name: "观音禅院",
    title: "黑神话 · 禅院焦土残钟",
    features: "残破古刹山门、持棍天命人伫立石阶、火后焦黑残柱、古钟楼、肃杀苍凉",
    keywords: ["黑神话", "悟空", "观音禅院", "黑风山", "金池长老"],
    colors: "朱砂赤 · 焦茶褐 · 墨黑",
    theme: "Black Myth Wukong, Black Wind Mountain Guanyin Temple Ruins",
    silhouette: "the Destined One monkey warrior standing resolutely on weathered stone steps holding his dark iron staff, facing the burnt grand pavilion arches and a tall ancient bell tower silhouette of a ruined Buddhist temple amidst scorched embers",
    colorPrompt: "vermilion red, burnt sienna brown, and deep soot black"
  },
  {
    id: 18,
    file: "18_黑神话_紫云山.png",
    game: "黑神话：悟空",
    name: "紫云山",
    title: "黑神话 · 紫云花落回眸",
    features: "落英幽径、提灯四妹与天命人相向、古木奇峰、漫天飘落花瓣、凄美幽邃",
    keywords: ["黑神话", "悟空", "盘丝岭", "紫云山", "四妹"],
    colors: "胭脂红 · 丁香紫 · 浅墨",
    theme: "Black Myth Wukong, Purple Cloud Mountain Falling Petals",
    silhouette: "the Destined One monkey warrior pausing on a rustic mountain stone path, glancing toward the graceful silhouette of the Fourth Sister holding a glowing paper lantern beneath ancient twisted blossoming trees with drifting fallen flower petals",
    colorPrompt: "carmine red, muted lilac purple, and soft charcoal ink"
  },
  {
    id: 19,
    file: "19_黑神话_水帘洞.png",
    game: "黑神话：悟空",
    name: "水帘洞",
    title: "黑神话 · 齐天绝顶傲苍穹",
    features: "花果山绝顶石矶、大圣披挂天命人、如意金箍棒指天、翻腾云海瀑布、霸气盖世",
    keywords: ["黑神话", "悟空", "花果山", "齐天大圣", "金箍棒"],
    colors: "帝王金 · 霞红 · 焦墨",
    theme: "Black Myth Wukong, Mount Huaguo Peak Great Sage",
    silhouette: "the monkey warrior fully adorned in majestic golden armor with fluttering crimson pheasant tail feathers atop his helmet, holding the legendary Ruyi Jingu Bang golden staff slanting upward upon an epic mountain cliff overlooking cascading waterfalls and rolling sea of clouds",
    colorPrompt: "imperial golden yellow, sunset crimson, and dense ink black"
  },

  // 2. 艾尔登法环
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
    id: 20,
    file: "20_艾尔登法环_盖利德.png",
    game: "艾尔登法环",
    name: "红狮子原野",
    title: "法环 · 碎星陨石长空",
    features: "猩红荒原插满折断巨剑、半神碎星拉塔恩跨骑小马、双持重力曲剑、长空陨石、悲壮雄浑",
    keywords: ["艾尔登法环", "拉塔恩", "碎星", "盖利德", "红狮子"],
    colors: "铁锈红 · 重力紫 · 炭黑",
    theme: "Elden Ring, Caelid Starscourge Radahn Wastes",
    silhouette: "the colossal Demigod General Radahn brandishing paired massive curved gravity greatswords while mounted on his diminutive loyal horse upon a crimson battlefield spiked with shattered swords, beneath a twilight sky pierced by falling meteors",
    colorPrompt: "rust red, gravity indigo violet, and charred black"
  },
  {
    id: 21,
    file: "21_艾尔登法环_玛莲妮亚.png",
    game: "艾尔登法环",
    name: "圣树根底",
    title: "法环 · 腐败之花绝尘",
    features: "圣树幽邃根底、女武神玛莲妮亚金甲义手持刀、背后悬空绽放的巨大猩红之花、凄美孤绝",
    keywords: ["艾尔登法环", "玛莲妮亚", "女武神", "圣树", "猩红腐败"],
    colors: "琥珀金 · 浅桃红 · 墨黑",
    theme: "Elden Ring, Malenia Blade of Miquella at the Haligtree",
    silhouette: "Malenia the Severed standing poised in winged golden helm with prosthetic blade extended gracefully, framed behind by the ethereal silhouette of an enormous blossoming Scarlet Aeonia lotus flower in an ancient underground flooded cavern",
    colorPrompt: "unalloyed amber gold, pale coral pink, and deep lacquer black"
  },
  {
    id: 22,
    file: "22_艾尔登法环_法姆亚兹拉.png",
    game: "艾尔登法环",
    name: "法姆·亚兹拉",
    title: "法环 · 龙王时空暴风",
    features: "静止崩解的浮空古神殿、褪色者手持大剑、庞大双头古龙王盘踞风暴中心、金色雷霆、神话史诗",
    keywords: ["艾尔登法环", "龙王", "普拉顿桑克斯", "法姆亚兹拉", "古龙"],
    colors: "晴山蓝 · 闪电金 · 铅灰",
    theme: "Elden Ring, Dragonlord Placidusax at Crumbling Farum Azula",
    silhouette: "the solitary Tarnished knight raising a greatsword before the titanic two-headed Dragonlord Placidusax resting coiled at the eye of a colossal timeless vortex among drifting architectural debris and streaks of golden lightning",
    colorPrompt: "pale storm blue, lightning gold, and weathered lead grey"
  },

  // 3. 塞尔达传说
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
    id: 23,
    file: "23_塞尔达传说_拔剑台.png",
    game: "塞尔达传说",
    name: "迷失森林",
    title: "塞尔达 · 迷林神剑初醒",
    features: "盘根错节古木森林、石台之上退魔之剑、小林克双手握剑、围绕跳跃克洛格、神圣灵动",
    keywords: ["塞尔达传说", "大师之剑", "迷失森林", "拔剑台", "克洛格"],
    colors: "翡翠绿 · 晨曦金 · 铁线黑",
    theme: "The Legend of Zelda Breath of the Wild, Master Sword Korok Forest",
    silhouette: "Link grasping the hilt of the sacred Master Sword embedded in an ornate stone pedestal, surrounded by curious little leaf-masked Korok spirits among giant mossy tree roots under beams of filtered woodland sunlight",
    colorPrompt: "moss emerald green, dawn sunlight gold, and woodcut black"
  },
  {
    id: 24,
    file: "24_塞尔达传说_米法雕像.png",
    game: "塞尔达传说",
    name: "卓拉领地",
    title: "塞尔达 · 灵水轻抚思念",
    features: "卓拉层叠碧蓝水榭、林克背弓伫立、手执三叉戟米法雕像、微波荡漾、深情温润",
    keywords: ["塞尔达传说", "米法", "卓拉领地", "雕像", "林克"],
    colors: "碧水蓝 · 晚霞粉 · 墨蓝",
    theme: "The Legend of Zelda Breath of the Wild, Zora's Domain Mipha Statue",
    silhouette: "Link standing quietly with bow on back at the edge of a tiered aqueduct plaza, gazing upward at the elegant stone statue of Zora princess Mipha holding her trident against luminous tiered waterfalls",
    colorPrompt: "aquamarine cyan, twilight petal pink, and deep indigo navy"
  },
  {
    id: 25,
    file: "25_塞尔达传说_海拉鲁城堡.png",
    game: "塞尔达传说",
    name: "海拉鲁城堡",
    title: "塞尔达 · 灾厄红月破晓",
    features: "悬空高耸城堡尖塔、林克与萨尔达背靠背持剑携弓、天际赤红血月、怨念黑气升腾、宿命抗争",
    keywords: ["塞尔达传说", "海拉鲁城堡", "萨尔达", "红月", "林克"],
    colors: "猩红 · 皇家靛蓝 · 浓墨",
    theme: "The Legend of Zelda, Hyrule Castle Blood Moon",
    silhouette: "Link brandishing the glowing Master Sword and Princess Zelda holding her light bow standing back-to-back atop the castle ramparts, silhouetted against a monstrous crimson Blood Moon and swirling malice tendrils around the gothic spires",
    colorPrompt: "blood crimson red, royal navy blue, and pitch ink black"
  },

  // 4. 荒野大镖客：救赎 2
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
    id: 26,
    file: "26_荒野大镖客_雪山营地.png",
    game: "荒野大镖客2",
    name: "雪山营地",
    title: "大镖客 · 飞雪围炉夜话",
    features: "漫天鹅毛大雪松林、简陋木棚与篷车、达奇与亚瑟围坐跳跃篝火、压低牛仔帽、孤胆避难",
    keywords: ["荒野大镖客", "柯尔特", "范德林德帮", "雪山", "篝火"],
    colors: "炉火橙 · 飞雪白 · 墨黑",
    theme: "Red Dead Redemption 2, Colter Snow Campfire",
    silhouette: "outlaws Arthur Morgan and Dutch van der Linde in heavy winter wool coats and hats sitting around a crackling campfire beside a canvas wagon, amidst drifting snowfall and stark pine trees in the snowy northern mountains",
    colorPrompt: "ember orange, snow white, and midnight charcoal black"
  },
  {
    id: 27,
    file: "27_荒野大镖客_瓦伦丁.png",
    game: "荒野大镖客2",
    name: "瓦伦丁小镇",
    title: "大镖客 · 泥泞长街推门",
    features: "泥泞主街木板马道、亚瑟推开酒馆双开弹簧木门、腰间左轮低垂、远处木头钟楼与山峦、原汁原味西部",
    keywords: ["荒野大镖客", "瓦伦丁", "酒馆", "亚瑟摩根", "西部小镇"],
    colors: "焦茶褐 · 驼黄 · 炭黑",
    theme: "Red Dead Redemption 2, Valentine Saloon Doors",
    silhouette: "Arthur Morgan pushing through the wooden swinging batwing doors of a rustic western saloon onto the muddy wooden boardwalk, holster at his hip, overlooking horses tied to hitching posts and wooden frontier storefronts",
    colorPrompt: "weathered timber brown, saddle tan, and iron soot black"
  },
  {
    id: 28,
    file: "28_荒野大镖客_绝壁鹿影.png",
    game: "荒野大镖客2",
    name: "山巅朝阳",
    title: "大镖客 · 绝壁长风沐日",
    features: "绝壁山巅晨曦、负伤亚瑟倚石而坐远眺日出、金色朝霞初升、雄鹿剪影在晨雾中静立、生命挽歌",
    keywords: ["荒野大镖客", "亚瑟摩根", "日出", "雄鹿", "救赎"],
    colors: "晨曦金 · 雾灰 · 焦褐",
    theme: "Red Dead Redemption 2, Arthur's Mountain Sunrise Redemption",
    silhouette: "Arthur Morgan resting peacefully against a rocky mountaintop precipice overlooking the vast golden morning horizon as the sunrise breaks, with the ethereal silhouette of a solitary majestic buck standing in the morning mist",
    colorPrompt: "radiant sunrise gold, morning mist grey, and warm chestnut brown"
  },

  // 5. 原神
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
    id: 29,
    file: "29_原神_风起地.png",
    game: "原神",
    name: "风起地",
    title: "原神 · 巨树林风抚琴",
    features: "风起地千年巨橡树、诗人温迪靠在树根拨动诗琴、旅行者仰望飞扬蒲公英、蒙德城与风神像远景、自由宁静",
    keywords: ["原神", "温迪", "蒙德", "风起地", "蒲公英"],
    colors: "苹果绿 · 澄空蓝 · 墨黑",
    theme: "Genshin Impact, Mondstadt Windrise Oak Tree",
    silhouette: "the bard Venti sitting casually against the massive trunk of the ancient Windrise oak tree strumming his wooden lyre, as the traveler watches dandelion seeds floating in the breeze toward the distant silhouette of the Cathedral of Mondstadt",
    colorPrompt: "meadow green, clear sky cyan, and ink black"
  },
  {
    id: 30,
    file: "30_原神_净善宫.png",
    game: "原神",
    name: "净善宫",
    title: "原神 · 绿蔓灵枝入梦",
    features: "须弥大树净善宫苍翠枝叶、小草神纳西妲荡着秋千、背后悬浮梦境般的世界树绿叶与神殿穹顶、智慧生机",
    keywords: ["原神", "纳西妲", "须弥", "净善宫", "世界树"],
    colors: "嫩草绿 · 荧光白 · 浅黛",
    theme: "Genshin Impact, Sumeru Sanctuary of Surasthana",
    silhouette: "the gentle young Archon Nahida swinging happily on a floral vine swing in an airy sanctuary, framed by translucent glowing emerald leaves of Irminsul and intricate organic dome architecture",
    colorPrompt: "fresh sprout green, luminous warm white, and slate ink grey"
  },
  {
    id: 31,
    file: "31_原神_欧庇克莱歌剧院.png",
    game: "原神",
    name: "欧庇克莱歌剧院",
    title: "原神 · 华幕水幕鞠躬",
    features: "华丽歌剧院舞台、聚光灯下水神芙宁娜手执手杖致意行礼、身后水流瀑布与审判裁决枢机、戏剧张力",
    keywords: ["原神", "芙宁娜", "枫丹", "欧庇克莱歌剧院", "水神"],
    colors: "宝石蓝 · 珠光白 · 曜黑",
    theme: "Genshin Impact, Fontaine Opera Epiclese",
    silhouette: "Furina in her stylish top hat and tailored coat taking a dramatic curtain call bow with her cane under stage spotlights in the grand opera house, backed by soaring neoclassical arches and graceful cascading water fountains",
    colorPrompt: "sapphire blue, pearl white, and rich velvet black"
  },

  // 6. 巫师 3：狂猎
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
    id: 32,
    file: "32_巫师3_凯尔莫罕.png",
    game: "巫师3",
    name: "凯尔莫罕",
    title: "巫师 · 狼堡雪峰伫立",
    features: "群山绝壁中的狼派残堡、杰洛特与叶奈法在城垛并肩而立、寒风吹拂银发黑袍、险峰积雪、宿命温情",
    keywords: ["巫师3", "杰洛特", "叶奈法", "凯尔莫罕", "狼堡"],
    colors: "苍雪蓝 · 石青灰 · 墨黑",
    theme: "The Witcher 3, Kaer Morhen Fortress Battlements",
    silhouette: "witcher Geralt with twin swords and sorceress Yennefer standing together on the stone battlements of the ancient mountain stronghold Kaer Morhen, looking out over snow-veiled alpine peaks and rugged pine valleys",
    colorPrompt: "frost blue, mountain stone grey, and deep raven black"
  },
  {
    id: 33,
    file: "33_巫师3_史凯利格.png",
    game: "巫师3",
    name: "大史凯利格海",
    title: "巫师 · 寒海长船破浪",
    features: "狂风巨浪中的维京龙头长船、杰洛特手把风帆立于船头、远方海面巨大的白鲸跃空翻尾、崖顶古堡、苍茫壮阔",
    keywords: ["巫师3", "史凯利格", "长船", "白鲸", "杰洛特"],
    colors: "沧海深蓝 · 浪花白 · 铁灰",
    theme: "The Witcher 3, Skellige Isles Whale and Longship",
    silhouette: "Geralt standing braced at the dragon-headed prow of a wooden Viking drakkar boat cutting through choppy ocean waves, as a colossal white whale breaches majestically on the horizon near dramatic sea cliff ruins",
    colorPrompt: "ocean deep indigo, foaming sea white, and weathered iron grey"
  },
  {
    id: 34,
    file: "34_巫师3_诺维格瑞.png",
    game: "巫师3",
    name: "诺维格瑞",
    title: "巫师 · 繁华暗巷反手拔剑",
    features: "密集的哥特式木石坡顶房屋、特莉丝披斗篷回眸疾行、杰洛特在暗巷拐角反手抽出银剑、飞鸟惊起、悬念丛生",
    keywords: ["巫师3", "诺维格瑞", "特莉丝", "杰洛特", "银剑"],
    colors: "砖石红 · 斗篷褐 · 浓墨",
    theme: "The Witcher 3, Novigrad City Alleyway",
    silhouette: "sorceress Triss Merigold in hooded cloak walking briskly through a narrow medieval cobblestone alleyway while Geralt stealthily draws his silver sword from behind a corner beneath timber-framed townhouses and spires",
    colorPrompt: "terracotta brick red, weathered cloak brown, and pitch ink black"
  },

  // 7. 赛博朋克 2077
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
    id: 35,
    file: "35_赛博朋克_来生酒吧.png",
    game: "赛博朋克2077",
    name: "来生酒吧",
    title: "赛博朋克 · 来生独酌敬传奇",
    features: "昏暗暗红的来生酒吧、罗格在吧台后擦拭酒杯、主角V独自坐在高脚凳举杯向空位致敬、冷酷传奇氛围",
    keywords: ["赛博朋克2077", "来生酒吧", "V", "罗格", "杰克威尔斯"],
    colors: "霓虹红 · 威士忌金 · 炭黑",
    theme: "Cyberpunk 2077, The Afterlife Bar",
    silhouette: "mercenary V sitting at the illuminated curved bar counter raising a cocktail glass in a toast, as queen of fixers Rogue watches thoughtfully from behind the bar beneath suspended neon signs and holographic bottle shelves",
    colorPrompt: "neon crimson red, whiskey amber gold, and carbon matte black"
  },
  {
    id: 36,
    file: "36_赛博朋克_歌舞伎町.png",
    game: "赛博朋克2077",
    name: "歌舞伎町",
    title: "赛博朋克 · 雨夜全息金鱼",
    features: "层叠逼仄的集市过街天桥、朱迪坐在潮湿台阶上调试超梦头盔、上方游弋巨大的全息发光鲤鱼、雨水反光、赛博市井",
    keywords: ["赛博朋克2077", "歌舞伎町", "朱迪", "全息金鱼", "超梦"],
    colors: "荧光青 · 霓虹紫 · 曜黑",
    theme: "Cyberpunk 2077, Kabuki Market Rainy Night",
    silhouette: "braindance technician Judy Alvarez sitting casually on wet fire escape stairs adjusting a neural headset, beneath a massive swimming holographic koi fish glowing through misty rain amidst cluttered vertical neon street signs",
    colorPrompt: "fluorescent cyan, neon violet, and wet asphalt black"
  },
  {
    id: 37,
    file: "37_赛博朋克_露西月球.png",
    game: "赛博朋克2077",
    name: "轨道航天港",
    title: "赛博朋克 · 荒坂高塔遥望明月",
    features: "高耸航天发射塔架平台、彩发露西独自伫立冷风中、仰望空中巨大清冷的月球、大卫夹克背影相伴、无尽浪漫与怅惘",
    keywords: ["赛博朋克2077", "边缘行者", "露西", "大卫", "月球"],
    colors: "冰月白 · 浅天蓝 · 极夜黑",
    theme: "Cyberpunk Edgerunners, Lucy Looking at the Moon",
    silhouette: "netrunner Lucy with multicolored hair standing alone at the observation edge of a towering spaceport gantry, looking up at the gigantic glowing pale moon hanging in the starry void, with the faint spectral memory of David's yellow jacket beside her",
    colorPrompt: "luminescent moon white, soft electric blue, and deep void black"
  },

  // 8. 最终幻想 7
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
  },
  {
    id: 38,
    file: "38_最终幻想7_第七天堂.png",
    game: "最终幻想7",
    name: "第七天堂",
    title: "最终幻想 · 贫民铁皮暖灯",
    features: "铁皮搭成的第七天堂酒吧、蒂法扎马尾在木吧台递出调酒、身后弹球机与暗门通道、贫民窟一隅的温存",
    keywords: ["最终幻想7", "蒂法", "第七天堂", "第七区贫民窟", "雪崩"],
    colors: "枫木黄 · 绯红 · 墨黑",
    theme: "Final Fantasy VII Remake, Seventh Heaven Bar",
    silhouette: "Tifa Lockhart with tied hair standing warmly behind the wooden bar counter sliding a glass forward, surrounded by rustic bar stools, vintage pinball machine, and overhead hanging warm pendant lamps in the slum hideout",
    colorPrompt: "warm maple wood, crimson accent, and soft charcoal black"
  },
  {
    id: 39,
    file: "39_最终幻想7_萨菲罗斯.png",
    game: "最终幻想7",
    name: "尼福尔海姆",
    title: "最终幻想 · 烈焰狂澜刀芒回眸",
    features: "熊熊燃烧的村庄火海、银色长发单翼萨菲罗斯拖着修长正宗武士刀、在烈火浓烟中缓缓侧首回眸、绝望压迫感",
    keywords: ["最终幻想7", "萨菲罗斯", "正宗", "火海", "尼福尔海姆"],
    colors: "烈火赤 · 银霜灰 · 焦墨",
    theme: "Final Fantasy VII, Sephiroth in Flames at Nibelheim",
    silhouette: "the menacing legendary villain Sephiroth with long flowing silver hair dragging his iconic eight-foot Masamune katana, turning his head amidst raging inferno flames and collapsing burning wooden houses",
    colorPrompt: "raging inferno scarlet, silver platinum grey, and scorched soot black"
  },
  {
    id: 40,
    file: "40_最终幻想7_忘却之都.png",
    game: "最终幻想7",
    name: "忘却之都",
    title: "最终幻想 · 幽潭祈祷命途",
    features: "幽蓝通透的水上水晶神殿、石台上双手合十闭目祈祷的爱丽丝、发光的白魔石、克劳德在水晶拱桥上奔跑守候、宿命之美",
    keywords: ["最终幻想7", "爱丽丝", "忘却之都", "白魔石", "克劳德"],
    colors: "圣洁幽蓝 · 珠白 · 墨黑",
    theme: "Final Fantasy VII, City of the Ancients Forgotten Capital",
    silhouette: "Aerith kneeling in peaceful prayer with hands clasped upon a glowing carved stone altar in a flooded spiral crystal sanctuary, as Cloud reaches forward from a curving nautilus ramp above shimmering tranquil water",
    colorPrompt: "mystic cerulean blue, luminescent pearl white, and abyssal black"
  }
];

function buildPrompt(item) {
  return `A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Theme: ${item.theme}. Extremely simplified iconic silhouette of ${item.silhouette}. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: ${item.colorPrompt}. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark.`;
}

module.exports = { ITEMS, buildPrompt };
