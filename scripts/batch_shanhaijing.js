const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../images/shanhaijing');
const TMP_DIR = '/tmp/shanhaijing_gen';

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

const ITEMS = [
  {
    id: 1,
    file: "01_九尾狐.png",
    name: "九尾狐",
    theme: "Nine-Tailed Fox (Jiuweihu) from Classic of Mountains and Seas",
    silhouette: "a graceful mythical nine-tailed fox sitting in profile with nine arched voluminous fluffy tails, subtle curling auspicious mist ribbons",
    colors: "cinnabar vermilion red, warm apricot ochre, and soot black"
  },
  {
    id: 2,
    file: "02_烛九阴.png",
    name: "烛九阴",
    theme: "Torch Dragon (Zhu Jiuyin / Zhulong) from Classic of Mountains and Seas",
    silhouette: "a colossal mythical serpent dragon coiled majestically around a jagged mountain peak, holding a glowing celestial sun-torch stone in its jaws, with subtle curling night cloud wisps",
    colors: "temple cinnabar red, cosmic indigo blue, and antique gold"
  },
  {
    id: 3,
    file: "03_帝江.png",
    name: "帝江",
    theme: "Sacred Being Dijiang from Classic of Mountains and Seas",
    silhouette: "a plump round celestial sacred creature like a glowing cinnabar pouch, with six slender bird feet and four divine feathered wings spread in mid-air dancing joy, faceless and mystical",
    colors: "cinnabar flame red, warm turmeric ochre, and charcoal ink"
  },
  {
    id: 4,
    file: "04_白泽.png",
    name: "白泽",
    theme: "Auspicious Divine Beast Baize from Classic of Mountains and Seas",
    silhouette: "a noble horned celestial beast standing serenely on a jagged cliff overlook, framed by a delicate gnarled pine branch and subtle swirling cloud ribbons",
    colors: "mineral malachite green, jade turquoise, and warm terracotta ochre"
  },
  {
    id: 5,
    file: "05_毕方.png",
    name: "毕方",
    theme: "Divine Fire Bird Bifang from Classic of Mountains and Seas",
    silhouette: "an elegant mythical crane standing proudly on a single long slender leg, with bold patterned wings, holding a flaming spark, framed by curling smoke wisps",
    colors: "vibrant cyan blue, fiery cinnabar red, and charcoal black"
  },
  {
    id: 6,
    file: "06_鲲鹏.png",
    name: "鲲鹏",
    theme: "Kunpeng Metamorphosis from Classic of Mountains and Seas",
    silhouette: "a massive mythical sea whale leaping upwards from gentle water ripples and transforming into a titanic roc bird with majestic spread wings rising into mist",
    colors: "deep ocean indigo blue, wave foam cream, and warm amber gold"
  },
  {
    id: 7,
    file: "07_饕餮.png",
    name: "饕餮",
    theme: "Archaic Mythical Beast Taotie from Classic of Mountains and Seas",
    silhouette: "a powerful ritual beast with iconic archaic bronze-ware totemic mask patterns, piercing divine eyes, and bold crouching claws framed by subtle spiral cloud scrolls",
    colors: "patinated bronze verdigris green, cinnabar red, and antique lamp black"
  },
  {
    id: 8,
    file: "08_穷奇.png",
    name: "穷奇",
    theme: "Winged Tiger Beast Qiongqi from Classic of Mountains and Seas",
    silhouette: "a muscular mythical tiger with grand feathered eagle wings leaping dynamically in profile across a stylized mountain ridge line",
    colors: "burnt tiger sienna, ink black stripes, and stony slate grey"
  },
  {
    id: 9,
    file: "09_陆吾.png",
    name: "陆吾",
    theme: "Kunlun Mountain Guardian God Luwu from Classic of Mountains and Seas",
    silhouette: "a noble divine tiger with nine fan-shaped feline tails arching upward like a grand halo, sitting vigilantly before a minimalist mountain arch gate",
    colors: "imperial ochre gold, terracotta cinnabar, and jade green"
  },
  {
    id: 10,
    file: "10_夫诸.png",
    name: "夫诸",
    theme: "Ethereal Four-Horned Water Deer Fuzhu from Classic of Mountains and Seas",
    silhouette: "a slender graceful white stag with four majestic branched crystalline antlers, lightly treading upon subtle concentric water ripples with lotus motifs",
    colors: "celestial misty blue, delicate rose ochre, and soot grey"
  }
];

function buildPrompt(item) {
  return `A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Theme: ${item.theme}. Extremely simplified iconic silhouette of ${item.silhouette}. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: ${item.colors}. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark.`;
}

console.log('Script ready with 10 prompts.');
