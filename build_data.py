import json
from pathlib import Path

BASE = Path(__file__).resolve().parent

def load_json(filename):
    p = BASE / filename
    if p.exists():
        try:
            return json.loads(p.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"Error reading {filename}: {e}")
            return []
    return []

# 1. World Cities (30)
cities_items = load_json("prompts.json")

# 2. Scenic Spots (50)
scenic_items = load_json("prompts_scenic_spots.json")

# 3. Classical Chinese Poetry (50)
poetry_raw = load_json("prompts_poetry.json")
poetry_items = []
for p in poetry_raw:
    item = dict(p)
    if "title" not in item:
        item["title"] = f"「{p.get('name','')}」· {p.get('author','')}{p.get('work','')}"
    if "features" in item and "verse" in item and not item["features"].startswith("「"):
        item["features"] = f"「{p['verse']}」 {p['features']}"
    poetry_items.append(item)

# 4. Rare Wildlife (20)
wildlife_items = load_json("prompts_wildlife.json")

# 5. Marine Life (20)
marine_items = load_json("prompts_marine.json")

# 6. Atmospheric Phenomena (20)
atmosphere_items = load_json("prompts_atmosphere.json")

# 7. Chinese Zodiac (12)
zodiac_items = load_json("prompts_zodiac.json")
for z in zodiac_items:
    if "title" not in z:
        z["title"] = f"{z.get('name','')} · {z.get('animal','')}"

# 8. 24 Solar Terms (24)
solar_items = load_json("prompts_solar_terms.json")

# 9. Shan Hai Jing (10)
shanhaijing_items = load_json("prompts_shanhaijing.json")

collections = {
    "scenic_spots": {
        "id": "scenic_spots",
        "title": "名胜风景",
        "titleEn": "5A Scenic Spots",
        "count": len(scenic_items),
        "kicker": "china national scenic heritage / rubber stamp collection / 2026",
        "headline": "橡胶戳华夏胜景<br>中国 5A 级景区名胜",
        "desc": "精选 50 处中国最具代表性的 5A 级风景名胜与世界文化遗产。以极简手工线刻橡胶印章凝固华夏山河的壮丽画卷。",
        "tagPrefix": "胜景",
        "badgeFormat": "胜景 {id}",
        "items": scenic_items
    },
    "poetry": {
        "id": "poetry",
        "title": "古诗名句",
        "titleEn": "Classical Poetry",
        "count": len(poetry_items),
        "kicker": "classical chinese poetry / visual stamp prints / 2026",
        "headline": "橡胶戳诗意画境<br>古诗名句",
        "desc": "50 句极具画面感的中国经典古诗词，50 帧纯粹的手工多色线刻橡胶印章。以意入境、留白成趣，图章之下铭刻千古名句。",
        "tagPrefix": "诗词",
        "badgeFormat": "诗词 {id}",
        "items": poetry_items
    },
    "cities": {
        "id": "cities",
        "title": "世界城市",
        "titleEn": "World Cities",
        "count": len(cities_items),
        "kicker": "field notes / rubber stamp travel posters / 2026",
        "headline": "橡胶戳旅行实地笔记<br>世界城市",
        "desc": "30 座城市，30 枚低调的多色橡胶戳。每一张只留下一个地点最易辨认的轮廓：建筑、山脉、海岸线与城市的呼吸。",
        "tagPrefix": "NO.",
        "badgeFormat": "NO. {id}",
        "items": cities_items
    },
    "wildlife": {
        "id": "wildlife",
        "title": "珍稀动物",
        "titleEn": "Rare Wildlife",
        "count": len(wildlife_items),
        "kicker": "endangered wildlife heritage / stamp prints / 2026",
        "headline": "橡胶戳生灵之境<br>珍稀动物",
        "desc": "20 种珍稀物种与大自然生灵。以极简多色手工版画印章捕捉国宝大熊猫、金丝猴、雪豹、朱鹮等野生动物的灵性神韵。",
        "tagPrefix": "物种",
        "badgeFormat": "物种 {id}",
        "items": wildlife_items
    },
    "marine": {
        "id": "marine",
        "title": "海洋生物",
        "titleEn": "Marine Life",
        "count": len(marine_items),
        "kicker": "ocean creatures / marine biodiversity prints / 2026",
        "headline": "橡胶戳深蓝幻境<br>海洋生物",
        "desc": "20 尊深海巨灵与蔚蓝生灵。从万顷碧波的蓝鲸、虎鲸、蝠鲼，到发光水母与鹦鹉螺，以手工套印印章呈现深海的空灵与壮阔。",
        "tagPrefix": "海灵",
        "badgeFormat": "海灵 {id}",
        "items": marine_items
    },
    "atmosphere": {
        "id": "atmosphere",
        "title": "大气现象",
        "titleEn": "Atmospheric Phenomena",
        "count": len(atmosphere_items),
        "kicker": "celestial wonders / atmospheric optics & weather / 2026",
        "headline": "橡胶戳穹苍奇观<br>大气现象",
        "desc": "20 种壮丽奇绝的大气与天象奇观。极光、双彩虹、日全食、龙卷风、海市蜃楼、丁达尔光……以极简木刻橡胶印章凝固天空的神奇时刻。",
        "tagPrefix": "天象",
        "badgeFormat": "天象 {id}",
        "items": atmosphere_items
    },
    "zodiac": {
        "id": "zodiac",
        "title": "十二生肖",
        "titleEn": "Chinese Zodiac",
        "count": len(zodiac_items),
        "kicker": "chinese zodiac / rubber stamp series / 2026",
        "headline": "橡胶戳印灵兽志<br>十二生肖",
        "desc": "12 种生肖瑞兽，12 幅质朴的纯粹手工橡胶戳印。剥离所有文字与排版干扰，仅以多色印章木版雕刻质感呈现动物的灵动神韵。",
        "tagPrefix": "生肖",
        "badgeFormat": "生肖 {id}",
        "items": zodiac_items
    },
    "solar_terms": {
        "id": "solar_terms",
        "title": "二十四节气",
        "titleEn": "24 Solar Terms",
        "count": len(solar_items),
        "kicker": "24 solar terms / seasonal stamp prints / 2026",
        "headline": "橡胶戳时序物候<br>二十四节气",
        "desc": "春生、夏长、秋收、冬藏。24 个节气，24 帧凝结于陈旧米白宣纸上的时序物候印记。去尽铅华文字，唯留四时风物之美。",
        "tagPrefix": "节气",
        "badgeFormat": "节气 {id}",
        "items": solar_items
    },
    "shanhaijing": {
        "id": "shanhaijing",
        "title": "山海神异",
        "titleEn": "Classic of Mountains & Seas",
        "count": len(shanhaijing_items),
        "kicker": "classic of mountains and seas / mythical beasts / 2026",
        "headline": "橡胶戳上古神祇<br>山海神异",
        "desc": "10 尊中国上古神话异兽与司天神祇。取材于《山海经》大荒经与海内经，以纯粹无文字的多色木刻雕版印章，重现九尾狐、烛九阴、帝江、白泽等上古神灵的奇崛神韵。",
        "tagPrefix": "神兽",
        "badgeFormat": "山海 {id}",
        "items": shanhaijing_items
    }
}

total_count = sum(len(c["items"]) for c in collections.values())

output_js = f"""// 橡胶戳艺术画廊数据集：名胜风景 (50) · 古诗名句 (50) · 世界城市 (30) · 珍稀动物 (20) · 海洋生物 (20) · 大气现象 (20) · 十二生肖 (12) · 二十四节气 (24) · 山海神异 (10) -> 共 {total_count} 枚
window.COLLECTIONS = {json.dumps(collections, ensure_ascii=False, indent=2)};

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
"""

(BASE / "data.js").write_text(output_js, encoding="utf-8")
print(f"data.js updated successfully! Total {len(collections)} collections -> Total {total_count} stamps with full prompts.")
