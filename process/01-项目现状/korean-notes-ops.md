# 韩语笔记（Notion 并入）运维手册

> **换电脑 / 换账户后接手，只读这一份。** 它把「怎么把 Andy 的 Notion 韩语笔记弄上 linqiongni.top 的『个人·韩语笔记』tab」全流程固化了。
> 原始过程记录在 `process/04-每日日志/2026-10-20.md`，本文件只留**可复用的结论与动作**。

---

## 一、这是什么

- 站点 `public/korean/`（纯静态子站，经 `KoreanTab` 全宽 iframe 嵌进主站「个人」分组）。
- **内容真源 = Andy 的 Notion 韩语学习页**，不镜像多邻国官方题库（官方不公开逐单元词表/句子，版权受保护）。
- `public/korean/assets/data.js` 里两套数据：
  - `KO_NOTION`：已并入的 Notion 原文（键 = 总单元号，与多邻国 App 第 N 单元一致）。**这是已写笔记的真源，已进 git。**
  - `KO_CONTENT`：其余单元（未写笔记的）的**通用参考版**（按单元主题重构，非官方题库；首页有诚实声明）。

## 二、映射规则（部分 — 单元 → 总单元号）

Notion 标号「第X部分第Y单元」→ 站点总单元号 = `PART_OFFSET[X] + Y`：

| 部分 | 单元范围 | 偏移 |
|---|---|---|
| 第一部分 | 1–10 | +0 |
| 第二部分 | 11–40 | +10 |
| 第三部分 | 41–80 | +40 |
| 第四部分 | 81–130 | +80 |

例：`2-3`（第二部分第3单元）→ 总第 13 单元；`3-1` → 总第 41 单元。
偏移表写死在 `scripts/build_korean_units.py` 的 `PART_OFFSET`。

## 三、真源与脚本位置（哪份进 git、哪份不进）

| 文件 | 作用 | 进 git? |
|---|---|---|
| `public/korean/assets/data.js`（`KO_NOTION` + `KO_CONTENT`） | 线上真源 | ✅ 进（这是接手后直接能跑的东西） |
| `scripts/build_korean_units.py` | 重新生成的手段 | ✅ 进 |
| `scripts/smoke-korean.cjs` | jsdom 渲染冒烟测试 | ✅ 进 |
| `scripts/check-korean-data.cjs` | 数据层校验 | ✅ 进 |
| `build/korean-source.html` | Notion 导出（脚本输入，老办法） | ❌ 不进（`.gitignore` 忽略 `build/`） |
| `build/korean-notes.txt` | **直接粘贴的纯文本笔记**（脚本输入，新入口） | ❌ 不进（同 `build/`） |
| `build/korean_units.json` | 解析中间产物 | ❌ 不进 |
| 原始导出留底（如 `D:/lins/korean_notion_backup.html`） | 备份 | ❌ 仓库外 |

> ⚠️ **隐私红线**：Notion 导出含 Andy 私人笔记，**绝不能放进 `public/`**（会随 GitHub Pages 公开）。放 `build/`（被忽略）或仓库外。

## 四、用户怎么给新笔记 / 音频（告诉他照做）

两种输入任选其一（Andy 选 **B 直接粘文本**）：

**A. Notion 整页导出 HTML**（老办法，保留）
1. Notion 韩语页 → 整页导出为 **HTML**（**全量**，含所有已写单元；不要只导一部分）。
2. 放两份：`build/korean-source.html`（给脚本读，不入库不公开）+ 仓库外留底备份（如 `D:/lins/korean_notion_backup.html`）。

**B. 直接粘纯文本**（新办法）
1. 把笔记文本按下面「格式模板」整理，存成 `build/korean-notes.txt`（或对话里直接发给我，我帮你存）。
2. 文本格式（分块用标题行标识；多单元、每单元 0~3 板块、顺序任意）：

   ```
   2-3
   句子
   1、이것은 제 핸드폰이 아니에요. 这不是我的手机。
   2、제 학생증 주세요. 请给我我的学生证。

   2-3小故事
   1、艾迪：오스카, 화장실이 어디에 있어요? 奥斯卡，洗手间在哪里？
   2、奥斯卡：제가 알아요. 我知道。
   旁白：奥斯卡自信满满地走进一条长长的走廊。

   2-3笔记
   这里记我的易错点……
   ```

   - 标题行：`X-Y`（句子块）/ `X-Y小故事` / `X-Y笔记`；也可在 `X-Y` 后单独写一行「句子 / 小故事 / 笔记」作板块切换标记（会被忽略，不当内容，已踩坑：单独「句子」二字曾被误当一句句子）。
   - 句子行：`序号、韩文 中文`（韩中同行，按首个汉字切分；无序号也行）。
   - **小故事**行：`角色：韩文 中文` 或 `角色：中文`（旁白可无韩文）；纯中文行默认旁白。
   - **笔记**行：只写 `韩文 中文`，**不写角色、不显示序号**——脚本会把粘贴带过来的 `1.` 编号和「旁白：」自动剥掉，保证 2-4 与 2-3 等笔记板块排版一致（2026-10-20 按 Andy 要求定）。
   - 标号「第X部分第Y单元」→ 总单元号（同映射表），脚本自动推导 part / pno / audio 文件名。

**音频（两种输入通用）**：每个板块一个 `.m4a`，文件名 = 标号 + 后缀，放 `public/korean/assets/audio/`：
- 后缀只认「小故事」「笔记」，句子本身即标号。
- 例：`1-8.m4a` / `2-3小故事.m4a` / `2-3笔记.m4a`
- 有文件才有播放器；缺文件自动隐藏，不留坏控件。（命名规则详见 `public/korean/assets/audio/.gitkeep`）

### 补充 / 更新一个板块（重点，照这做）

合并脚本是**板块级增量**：你这次给的标题行（如 `2-3小故事`）只覆盖同单元的同名板块，句子 / 笔记原样保留。所以补内容**不用改文件名、不用加「2」「新」后缀**。

- **标题行永远用固定标号**，不要写 `2-3 笔记2` / `2-3小故事新` 之类：
  - 句子：`X-Y`（或 `X-Y句子`）　小故事：`X-Y小故事`　笔记：`X-Y笔记`
- **覆盖 ≠ 追加**：要往已有板块加行，必须把「旧行 + 新行」一起粘过来（同一标题行）。只给新行 = 旧行被替换掉。
- **音频同名覆盖上传**：更新某段录音，文件名不变直接覆盖即可，不用改名。
  - 例：补 2-3 小故事 → 标题写 `2-3小故事`，内容 = 旧小故事行 + 新小故事行；录音覆盖 `2-3小故事.m4a`。
  - 例：2-4 先给了 `2-4笔记`+`2-4笔记.m4a`；日后补句子、并刷新笔记录音 → 标题写 `2-4句子`（全句）+ `2-4笔记`（旧笔记+新笔记），音频分别传 `2-4句子.m4a`(新)、`2-4笔记.m4a`(覆盖)。
  - ⚠️ 文件名**无空格**：`2-3小故事.m4a` 对，`2-3 小故事.m4a` 不对（匹配不上，播放器隐藏）。

## 五、AI 怎么重新并入（照这 8 步）

> 两种输入对应两个脚本：**文本** → `scripts/build_korean_text.py`（**板块级增量合并**，只覆盖文本里提供的板块，同单元其它板块保留，安全）；**Notion 导出** → `scripts/build_korean_units.py`（全量重写 KO_NOTION）。

### B. 文本输入（Andy 常用）

```bash
# 1) 先只解析+打印核对（映射/板块/行数/缺音频），不动 data.js
python scripts/build_korean_text.py --src=build/korean-notes.txt
# 2) 确认无误后增量合并写进 data.js（保留其它已上线单元，不会丢）
python scripts/build_korean_text.py --src=build/korean-notes.txt --write
```

### A. Notion 导出输入（老办法）

```bash
# 0) 确认 build/korean-source.html 已就位（或让用户给新导出；也可用 --src= 指定）
# 1) 解析预览（看映射、板块、缺音频），不写文件
python scripts/build_korean_units.py --src=build/korean-source.html
# 2) 确认无误后写入 data.js（动态删除 KO_CONTENT 里被覆盖的单元，再写全量 KO_NOTION）
python scripts/build_korean_units.py --src=build/korean-source.html --write
```

### 通用收工步骤（两种输入都一样）

```bash
# 3) 语法 + 渲染冒烟（jsdom 在 ~/.workbuddy/binaries/node/workspace/node_modules）
NODE_PATH="C:/Users/lin.qiong.ni/.workbuddy/binaries/node/workspace/node_modules" \
  node scripts/smoke-korean.cjs
# 冒烟核对：板块/行数/右侧目录一致；替换单元无「App 原句记录 / 我的笔记」框；
#           非替换单元（如单元 1）记录框保留；无「语法要点 / 词汇表」等旧生成内容；音频文件都存在。
node --check public/korean/assets/data.js

# 4) 破缓存：index.html 里 data.js / app.js / style.css 的 ?v= 改成当天串（如 ?v=20261020g）
#    注：子站入口 src/components/KoreanTab.tsx 的 IFRAME_V 已改成「每次打开页面的时间戳」，
#    所以 index.html 本身不会再被浏览器缓存 10 分钟（GitHub Pages HTML = max-age:600）。
#    但 iframe 内部的 assets/*.js 仍按 ?v= 缓存，数据变了还是要 bump，否则用户看到旧 data.js。
# 5) 收工（本仓库用 MinGit + 绕过 rebase hook；push 走 MIGRATION.md 的代理/HTTP1.1 排障）
#    git -c core.hooksPath=/dev/null commit -m "..."  &&  git -c http.proxy= -c https.proxy= -c http.version=HTTP/1.1 push origin main
# 6) 写 process/04-每日日志/当天.md + 更新 process/README.md 今日索引
```

> Notion 脚本已做成**幂等 + 零改码可复用**：`write_data` 的删除列表从解析结果动态推导（新增单元不用改脚本），复跑不会重复叠加注释块。前提 = Notion 导出是**整页全量**。文本脚本是**板块级增量合并**，只覆盖文本里提供的板块，同单元其它板块原样保留，不会丢已上线内容（2026-10-20 已把合并从「单元级」改成「板块级」，之前只给一个板块会把同单元其它板块冲掉）。

## 六、已固化的呈现约定（给 Andy 的笔记长这样）

- 替换过的单元**不显示**「App 原句记录 / 我的笔记」两个框（只有未替换的 KO_CONTENT 单元保留）。
- 标号后带「小故事」「笔记」才有对应板块；右侧固定本页目录自动随板块生成（`renderNotion` + `buildToc`）。
- 板块顺序固定：句子 → 小故事 → 笔记。
- 小故事带角色列（艾迪 / 奥斯卡 / 旁白），脚本 `fix_roles` 已自动合并中韩混写角色名（艾디→艾迪）。
- KO_CONTENT 首页有诚实声明：句/词表为按主题重构的通用参考，非多邻国官方题库。

## 七、已知坑（别再踩）

1. **白天模式字色**：嵌入态 `html.embedded` 必须按主站主题分**浅/暗两套字色**——
   浅底给暖墨深字（`#23201B`）+ 淡白玻璃卡片 + 金色压深（`#86703C`）；暗底沿用浅米字。
   只设一套浅色字 = 浅底浅字全隐形（2026-10-20 已踩已修）。改 `style.css` 切记。
2. **隐私**：原始导出绝不进 `public/`；并入后移出仓库或留仓库外。
3. **角色名混写**（艾디/奥斯카）→ 已 `fix_roles` 合并；若导出又出现新混写，检查该函数。
4. **首屏闪白**：`index.html` 行内脚本在嵌入时先读父页主题；`app.js` 嵌入分支不再无条件 `setTheme('light')` 覆盖。
5. **改了却看不见（缓存时间窗）**：GitHub Pages 的 HTML 是 `cache-control: max-age=600`。以前 iframe 用「构建时间」当 v，
   更新后 10 分钟内打开仍会命中旧 `index.html`（里面是旧 `?v=`，指向旧 data.js），表现为「明明改了线上还是旧内容」。
   2026-10-20 已把 `KoreanTab.tsx` 的 `IFRAME_V` 改成 `String(Date.now())`（每次开页面都变），入口不再进缓存。
   **核对是否真没生效，别靠肉眼刷页面**：直接抓 `https://linqiongni.top/korean/assets/data.js` 看内容，或看 `index.html` 里的 `?v=` 是否为新值。
6. **笔记不该有角色/序号**：笔记板块按「词句清单」处理，`parse_text` 的 note 分支已剥掉 `1.` 编号与「旁白：」，勿再加回。

## 八、待 Andy 确认 / 后续

- **第 9 单元 App 标题**：侧栏现写「问路」，笔记里是指代物品类，是否改？
- 第 3/4 部分笔记可按同方式并入（同样的 `--src` + `--write` 流程，脚本零改）。
- 长期：若想免手动导出，可接 Notion API（integration token + 共享页面），届时替换脚本输入源即可。

## 九、关联

- 文本解析脚本：`scripts/build_korean_text.py`（纯文本输入 / 增量合并）
- Notion 解析脚本：`scripts/build_korean_units.py`（HTML 输入 / 全量重写）
- 技能：`skills/korean-notes-merge/SKILL.md`（触发词见其 `description`）
- 完整过程：`process/04-每日日志/2026-10-20.md`
- 用户级记忆：`~/.workbuddy/MEMORY.md` 的「Notion 是 Andy 的韩语笔记真源」条目
