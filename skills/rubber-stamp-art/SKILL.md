---
name: rubber-stamp-art
description: Create minimalist traditional hand-carved rubber stamp and woodblock relief art on warm aged Xuan paper. Supports both Text-to-Stamp (generating prompts from text, poetry, landmarks, or concepts) and Image-to-Stamp (converting photos or sketches into carved relief stamp art).
---

# Rubber Stamp Art (橡皮图章与木刻版画美学 Skill)

This skill enables agents and users to generate authentic, minimalist, hand-carved rubber stamp art on warm textured aged Xuan paper (宣纸). It embodies traditional East Asian seal engraving (篆刻), modern linocut relief printing, and tactile printmaking craftsmanship.

---

## 1. Core Aesthetic Principles (核心美学法则)

Every generated artwork strictly adheres to these five inviolable design rules:

1. **Canvas & Paper (载体底纸)**
   - Strict **4:5 vertical portrait** aspect ratio.
   - Warm textured aged Xuan paper (`warm textured aged Xuan paper`, 米白色做旧熟宣纸) with subtle mulberry fibers, organic paper grain, tactile matte texture, and slight vintage wear.
   - Clean, elegant margins surrounding the artwork.

2. **Negative Space & Ratio (版心与黄金留白)**
   - The central carved stamp artwork occupies **65%–72% of the canvas height**.
   - Surrounded by a balanced **28%–32% clean empty negative space** (留白).
   - The artwork is vertically and horizontally balanced in the visual center. It must NEVER touch the canvas borders or bleed to the edges.
   - **Strictly NO Circular Compositions (严禁圆形构图/圆形印框)**: Never enclose the artwork in a circle, circular frame, round border, or round seal medallion. The artwork must feature an open, asymmetrical, organic silhouette following the natural contours of the architecture, landscape, or subject, allowing the paper to breathe freely.

3. **Carving & Impression Texture (雕刻痕迹与印泥肌理)**
   - Authentic hand-carved block print aesthetics (`hand-carved linocut relief lines`, `relief printing texture`).
   - Tactile debossed imprint pressure, subtle chiseled gouge marks, natural uneven line edges, delicate dry ink gaps, and faint paper fiber ink bleeding.
   - Strictly avoid smooth digital vectors, glossy 3D renders, or flat clip-art.

4. **Mineral Spot Color Palette (矿物印泥配色)**
   - **2 to 4 muted spot colors** inspired by traditional natural mineral pigments.
   - Distinct color layers with subtle 1mm registration misalignments (套印微错位).
   - Core palette dictionary:
     | Pigment Name (EN) | 中文色彩 | Hex / Visual Tone | Typical Subject |
     | :--- | :--- | :--- | :--- |
     | Imperial Cinnabar Red | 故宫朱砂红 | `#b9281e` / `#c23531` | Ancient temples, royal halls, autumn leaves, seals |
     | Forbidden City Ochre Gold | 琉璃赭黄 / 雄黄 | `#d49b38` / `#c88a35` | Glazed roof tiles, sunrise, desert dunes, tigers |
     | Mountain Pine Green | 苍松青褐 / 石绿 | `#2c5e43` / `#3a6b52` | Pine trees, misty mountains, willow, jade lakes |
     | River Indigo / Slate Blue | 浅水苍青 / 石青 | `#2b4f6e` / `#3d607a` | Rivers, lakes, night sky, ocean depths |
     | Pine Soot Black | 松烟墨黑 | `#1f2124` / `#2c2a29` | Carved contours, calligraphy, stone fortresses |
     | Blossom Pink | 桃粉浅红 | `#e5989b` / `#d97d86` | Peach blossoms, lotus petals, spring dawn |
     | Fresh Willow Green | 柳叶新绿 | `#7fa05a` / `#6f914b` | Young willow sprouts, spring tea buds, bamboo |
     | Terracotta Brick Red | 古砖赤褐 | `#9c4131` / `#a34839` | Ancient masonry, fortress battlements, earthenware |

5. **Clutter-Free Isolation (绝对克制与留白纯净度)**
   - No full-bleed background images.
   - No excessive decorative borders, photorealistic lighting, lens flare, or crowded tourist silhouettes.
   - Clean separation between stamp artwork and peripheral canvas.

---

## 2. Modes of Operation (双模式工作流)

This skill supports two primary workflows:
- **Mode 1: Text-to-Stamp (文字生印章)**
- **Mode 2: Image-to-Stamp (图片生印章 / 图片转印章)**

---

### Mode 1: Text-to-Stamp (文字输入模式)

Use this mode when the user provides text: a poem, city, landmark, season, game, animal, or abstract concept.

#### Step-by-Step Agent Workflow:
1. **Semantic Extraction**:
   - Extract the 1–2 most recognizable iconic features (e.g. for "故宫" -> *sweeping curved eaves of the Hall of Supreme Harmony + red palace wall*; for "竹外桃花三两枝" -> *slender bamboo stalks + blooming pink peach blossom twigs + swimming duck*).
2. **Composition Framing**:
   - Decide the stamp silhouette (ALWAYS open and unconstrained, NEVER circular):
     - *Open Architectural & Landmark Silhouette* (e.g. sweeping eaves, pagoda tiers, bridge arches extending naturally).
     - *Tiered Landscape / Skyline* (e.g. mountain ridges, fortress battlements, riverside pavilions).
     - *Freeform Organic Silhouette* (e.g. dynamic wildlife, mythical creatures, flora).
   - **Crucial Rule**: NEVER enclose the artwork in a circular frame, circular branch arch, or round seal boundary. Allow the silhouette to end naturally with open rice paper borders.
3. **Select 2–3 Mineral Inks**:
   - Choose harmonious spot colors from the mineral pigment table.
4. **Assemble the English Generation Prompt**:
   Use the project's standardized prompt formula:

```text
A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: [Subject / Landmark / Poem Concept]. Extremely simplified iconic silhouette of [Iconic subject details with bold linocut contours]. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: [Color 1], [Color 2], and [Color 3]. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark.
```

#### Example 1 (Landmark): "京都金阁寺"
```text
A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: Kinkaku-ji (Golden Pavilion) in Kyoto. Extremely simplified iconic silhouette of the three-tiered pavilion with delicate phoenix finial, reflected in minimalist calm pond water ripples, accompanied by a single gnarled Japanese pine bough on one side. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: antique leaf gold, deep pine soot black, and tranquil pond indigo. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark.
```

#### Example 2 (Poetry): "孤舟蓑笠翁，独钓寒江雪" (柳宗元)
```text
A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: River Snow by Liu Zongyuan (独钓寒江雪). Extremely simplified iconic silhouette of an old fisherman in a bamboo straw hat and reed cape sitting quietly on a tiny flat skiff, holding a fishing rod over desolate frosty winter river ripples, backed by faint distant chiseled snowy mountain peaks. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: pine soot ink black, frosty slate grey, and warm aged rice paper cream. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark.
```

---

### Mode 2: Image-to-Stamp (图片输入模式)

Use this mode when the user provides an image: a photograph, scenery snapshot, architectural photo, pet picture, hand drawing, or logo.

#### Step-by-Step Agent Workflow:
1. **Visual Deconstruction (视觉解构)**:
   - Identify the primary visual subject (e.g. a cat sitting by a window, the Eiffel tower, an espresso cup).
   - Separate foreground essence from background noise (discard passersby, cars, power lines, photographic lighting flares, and complex gradients).
2. **Relief & Linocut Translation (版画转写)**:
   - Convert continuous photographic tones into bold, graphic woodcut/linocut relief lines (阴阳刻组合).
   - Identify which contours should be carved away (revealing Xuan paper background) vs. which surfaces receive stamp ink.
3. **Color Quantization (色彩降维提取)**:
   - Reduce the photo's palette to **2 or 3 traditional mineral spot colors**.
4. **Dual Output (双轨生成指令)**:
   - **Track A (Img2Img / Vision Model Prompt)**: If executing via Midjourney (`--iw 1.5 - 2.0`), DALL-E image editing, or Stable Diffusion (ControlNet Lineart/Scribble):
     Provide the structural guidance prompt instructing the model to treat the input image as a compositional silhouette while forcing the rubber stamp medium.
   - **Track B (Descriptive Stamp Prompt)**: Provide the stand-alone standardized text prompt derived from the image features so the user can also generate it in text-to-image engines without needing image uploads.

#### Prompt Template for Image Conversion (Track A):
```text
Transform the key subject of the reference image into a clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. Strip away photographic realism, background clutter, and continuous gradients. Retain only the iconic silhouette and primary lines of [Identified Subject from image]. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Render in bold linocut relief carving style with 2-3 muted mineral spot colors: [Extracted Color 1], [Extracted Color 2]. Authentic rough dry carved stamp impression, subtle chiseled gouges, delicate ink gaps, stamped on fibrous textured rice paper with 30% clean empty negative space surrounding it. Pure isolated seal artwork, NO full-bleed photo background, absolutely NO text, no watermark.
```

#### Example Conversion (User uploads a photo of their orange cat stretching):
- **Agent Analysis**: Subject = Tabby cat stretching paws forward. Primary lines = Arched back curve, striped tail, paw contours, whisker notches.
- **Color Selection**: Terracotta ochre orange (`#d47e38`), pine soot ink black (`#202124`), subtle blossom pink paw pad accent (`#d9828b`).
- **Prompt Output**:
```text
A clean minimalist hand-carved rubber stamp artwork centered on 4:5 vertical warm textured aged Xuan paper. The stamp artwork occupies about 65-70% of the canvas height, surrounded by a balanced 30% clean empty negative space with elegant margins. Open natural asymmetrical silhouette, freeform organic contour, absolutely NO circular frame, NO round border, NO circular enclosure. Theme: Stretching domestic ginger tabby cat. Extremely simplified iconic silhouette of a cat performing a graceful morning stretch with elongated front paws, curved back ridge, upright curling tail, and bold carved fur stripe notches. Minimalist bold carved linocut relief lines, uncluttered composition, 2-3 muted spot colors: warm terracotta ochre, pine soot black, and delicate pale blossom pink. Rough dry rubber stamp texture with subtle carved imperfections on fibrous paper. Pure isolated stamp artwork with clean negative space around it, NO full-bleed background, NO full scenery clutter, absolutely NO text, NO letters, NO words, NO characters, NO typography, no watermark.
```

---

## 3. Negative Prompt & Quality Guardrails (负向提示词与质量准则)

When generating with engines that accept negative prompts (such as Stable Diffusion, Midjourney `--no`, or OpenCLI system parameters), always apply:

```text
Negative Prompt:
circular frame, round seal, circular composition, circle boundary, round border, round frame, circular medallion, circle enclosure, round vignette, full-bleed background, full canvas scenery, photographic, photorealistic, 3D render, digital vector illustration, shiny smooth plastic, glossy gradients, lens flare, modern sticker, crowded details, small cluttered objects, messy lines, blurry edges, low resolution, typography, words, text, letters, watermarks, signature, border frames, stamps perforations.
```

---

## 4. Execution with Tools (工具执行调用)

If running in an environment equipped with image generation tools (e.g. `opencli chatgpt image` or `generate_image`):
1. Format prompt cleanly in quotation marks.
2. Set aspect ratio to **4:5** (or vertical 1122x1402 / 896x1152).
3. Ensure background is warm aged Xuan paper `#f5efe4` to `#ede3d2` with ample 30% negative space around the stamp.
4. Save resulting image to the project gallery and generate thumbnails (WebP 400px width) and detail views.
