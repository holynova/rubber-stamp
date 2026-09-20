# Rubber Stamp Art Skill (`rubber-stamp-art`)

用于生成传统手工刻版橡皮图章（Rubber Stamp Art）与木刻版画风格艺术品的 Agent 技能包。

支持**文字输入模式**（根据地标、诗词名句、节气瑞兽等生成印章提示词）与**图片输入模式**（将用户上传的照片、线稿、Logo 转写为具有宣纸纤维与矿物印泥质感的手工刻印版画）。

---

## 快速安装方式

### 方式 1: 使用 `npx skills`（推荐，跨平台通用）

在任意 Agent 项目终端中运行：

```bash
npx skills add holynova/rubber-stamp-world-cities --skill rubber-stamp-art
```

或指定 GitHub 完整路径：

```bash
npx skills add https://github.com/holynova/rubber-stamp-world-cities/tree/master/skills/rubber-stamp-art
```

---

### 方式 2: Claude Code

在 Claude Code 项目中直接添加：

```bash
# 全局安装到 Claude Code
mkdir -p ~/.claude/skills/rubber-stamp-art
curl -fsSL https://raw.githubusercontent.com/holynova/rubber-stamp-world-cities/master/skills/rubber-stamp-art/SKILL.md -o ~/.claude/skills/rubber-stamp-art/SKILL.md

# 或安装到当前项目
mkdir -p .claude/skills/rubber-stamp-art
curl -fsSL https://raw.githubusercontent.com/holynova/rubber-stamp-world-cities/master/skills/rubber-stamp-art/SKILL.md -o .claude/skills/rubber-stamp-art/SKILL.md
```

---

### 方式 3: Antigravity / Agent Skills 规范

```bash
mkdir -p .agents/skills/rubber-stamp-art
curl -fsSL https://raw.githubusercontent.com/holynova/rubber-stamp-world-cities/master/skills/rubber-stamp-art/SKILL.md -o .agents/skills/rubber-stamp-art/SKILL.md
```

---

### 方式 4: Cursor / Windsurf / VS Code

将 `SKILL.md` 复制到项目的 `.cursor/rules/` 或对应技能目录：

```bash
mkdir -p .cursor/skills/rubber-stamp-art
curl -fsSL https://raw.githubusercontent.com/holynova/rubber-stamp-world-cities/master/skills/rubber-stamp-art/SKILL.md -o .cursor/skills/rubber-stamp-art/SKILL.md
```

---

## 核心特性

- **4:5 黄金宣纸比例**：标准米白色做旧熟宣纸底纸，带有自然植物纤维与微颗粒肌理。
- **68%~72% 版心占比**：印章艺术主体居中，四周预留 **28%~32% 纯净留白**，杜绝触底或满版喧杂。
- **传统矿物印泥配色**：内置故宫朱砂红、松烟墨黑、琉璃金黄、苍松石绿、浅水苍青、古砖赤褐等纯正配方。
- **真实手工刻痕**：刀口缺角、受压不均、飞白断墨、阳刻/阴刻质感，绝非生硬扁平矢量图。
- **双模式一键触发**：
  - 文字模式：输入 `"滕王阁序"`、`"罗马斗兽场"` 或 `"冬日柴犬"`，自动构建标准化高精度 Prompt。
  - 图片模式：上传风景照或爱宠照片，自动提取骨骼线条与特征色，输出图转印章指令。
