---
name: korean-notes-merge
description: 把 Andy 的韩语笔记并入 linqiongni.top 的「个人·韩语笔记」tab，或新增对应的音频文件。支持两种输入：Notion HTML 导出，或直接粘贴的纯文本笔记。当用户说「韩语笔记更新/并入/新增」「韩语音频」「韩语 Notion 导出」「韩语纯文本/粘文本」「韩语第X部分第Y单元」「把我的韩语笔记弄上去」时触发。详细运维手册见 process/01-项目现状/korean-notes-ops.md（换电脑/账户后照做）。
agent_created: true
---

# korean-notes-merge — 韩语笔记（Notion）并入

## 这是什么
`public/korean/` 是 Andy 的韩语学习对照本静态子站（嵌在主站「个人」分组）。内容真源是 Andy 的 **Notion 韩语页**，不镜像多邻国官方题库。本技能负责把 Notion 导出并入站点、或补对应的音频。

## 触发
- 「韩语笔记更新 / 并入 / 新增」「韩语音频」「韩语 Notion 导出」「韩语纯文本 / 粘文本」「韩语第 X 部分第 Y 单元」「把我的韩语笔记弄上去」
- 用户把 Notion 导出 html、纯文本笔记或音频放进仓库时

## 第一性动作（必读手册）
**完整、可复用的 8 步流程、映射规则、命名约定、已知坑都在 `process/01-项目现状/korean-notes-ops.md`。** 动手前先读它，不要凭记忆重写逻辑。

## 关键事实（速记）
- **映射**：「第X部分第Y单元」→ 总单元号 = PART_OFFSET[X] + Y（一:1–10 / 二:11–40 / 三:41–80 / 四:81–130）。
- **数据真源**：`public/korean/assets/data.js` 的 `KO_NOTION`（已并入原文）+ `KO_CONTENT`（其余单元通用参考版）。两者都进 git，换电脑 clone 即有。
- **脚本（二选一）**：`scripts/build_korean_text.py`（**纯文本输入 / 增量合并**，--src=build/korean-notes.txt，--write 合并写，**保留其它已上线单元**，安全）；`scripts/build_korean_units.py`（**Notion HTML 输入 / 全量重写**，--src= 指定导出，--write 写入；已幂等）。
- **输入（不入库）**：`build/korean-notes.txt`（纯文本笔记）/ `build/korean-source.html`（Notion 导出），都在 `build/`（`.gitignore` 忽略，不公开）。⚠️ 原始导出/笔记**绝不进 `public/`**（隐私红线，会随站点公开）。
- **音频**：`public/korean/assets/audio/<标号><后缀>.m4a`，后缀只认「小故事」「笔记」，句子即标号本身。缺文件播放器自动隐藏。
- **呈现约定**：替换单元不显示「App 原句记录 / 我的笔记」框；标号带「小故事/笔记」才有对应板块 + 右侧固定目录；板块顺序 句子→小故事→笔记。
- **验证**：`scripts/smoke-korean.cjs`（jsdom 冒烟，node_modules 在 `~/.workbuddy/binaries/node/workspace/node_modules`）。

## 收工动作（本仓库硬性）
1. bump `index.html` 里 data.js/app.js/style.css 的 `?v=` 当天串破缓存。
2. `git -c core.hooksPath=/dev/null commit` + `git -c http.proxy= -c https.proxy= -c http.version=HTTP/1.1 push origin main`（MinGit；排障见 `process/MIGRATION.md`）。**不要 amend 已推提交。**
3. 写 `process/04-每日日志/当天.md` + 更新 `process/README.md` 今日索引。

## 已知坑（别再踩）
- 嵌入态白天模式字色：`html.embedded` 必须按主站主题分浅/暗两套（浅底=暖墨深字+淡白玻璃+金色压深；暗底=浅米字），只设一套浅色字 = 浅底浅字全隐形。
- 角色名中韩混写（艾디/奥斯卡）→ 脚本 `fix_roles` 已合并，新混写检查该函数。
- 文本输入的板块标题行：单独的「句子」二字（在 `X-Y` 之后）是板块切换标记，**会被忽略而非当一句句子**——已修；用户照手册模板写即可。
- 纯文本脚本是**增量合并**：只覆盖/新增文本里提供的单元，不会丢已上线内容；若要全量刷新用 Notion 导出脚本（整页全量）。
- `emit_js` 用 `.get()` 读 row 字段，兼容「读回已上线数据再写回」；改它务必保持键值齐全（`ko/zh/who/no`）。
