---
name: fixed-bg-fish-bug
description: linqiongni.top（linqiongni_profile 仓库）固定背景+鱼影被挡住 / 莫名蓝底黑底 / 滚动条发蓝 类 bug 的排查与修复。当用户说「蓝色背景」「背景挡住了鱼」「鱼看不见」「怎么又有一层黑板」「下拉条是蓝色的」「不是要透明底吗」「滚动条和其他站不统一」，或截图里某块区域不是主站深海军蓝底+鱼影时，立即加载本技能，按决策树定位，不要凭猜测改颜色。
agent_created: true
---

# 固定背景 + 鱼影被挡：定位与修复

## 用户铁律（2026-09-28 Andy 拍板，永久有效）

> **一切新做/改造的 iframe、容器、子页，默认 `bg-transparent`，绝不垫深色背板。**
> 主站固定背景 + 鱼影是全站固定底，**任何不透明背景挡住它都按 bug 处理**。
> 怕 iframe 加载瞬间白闪 → 用加载态骨架，不用不透明底色。
> 只有明确不需要透鱼影的场合才允许用 `#0C1B2B` 这类卡片色。

**这条是默认，不是选项。** 做新容器时先写 `bg-transparent`，需要理由才能加底色。

---

## 一、用户该怎么说（写进任何提示都管用的一句话）

最有效的描述 = **截图 + 一句「这里应该是透明底，要看到固定的背景和鱼」**。

三个必备要素，缺一个我就会猜错：

| 要素 | 为什么必须有 | 例子 |
|---|---|---|
| **① 位置** | 「蓝」可能来自 6 个不同来源，位置决定走哪条分支 | 「课程阅读层整片」「顶栏一条」「上下边缘」 |
| **② 什么时候出现** | 静态还是滚动/全屏时才出现 | 「一点开就有」「只有滚动时」「全屏后才有」 |
| **③ 期望** | 明确说要透出什么 | 「要透明底，看到鱼」「要和其他站一样的灰色滚动条」 |

### 可直接复制的模板

```
[截图] 这里（<位置>）出现 <蓝色/黑色/白边>，<什么时候出现>。
应该是透明底，要能看见固定的背景和鱼。
```

进阶：给我**两张截图对比**（有 bug 的站 vs 观感正确的站），我定位速度翻倍——
09-28 几次都是靠「蓝派 vs 灰派」对比一眼定位到 CSS 变量差异。

### 什么描述会让我走弯路
- ❌「有点不对，你看看」 —— 没有位置，只能全站扫，慢且容易改错地方
- ❌「颜色不对」 —— 蓝/黑/白的成因完全不同，见下方决策树
- ❌ 只截内容区不截边缘 —— 边缘才暴露画布级填色（color-scheme / 回弹）

---

## 二、决策树：按症状直接跳到根因

| 症状 | 根因 | 修法 |
|---|---|---|
| **整片海军蓝 / 深蓝**（`#0C1B2B` `#091A2E`） | 容器元素**自身**的 `dark:bg-*` class 垫底（最常见！09-28 课程阅读层实锤） | 改 `bg-transparent`，**先查 iframe 元素自身 class 再查子页 CSS** |
| **怎么改都有一层黑板**（≈`#1C1C1E`） | 透明 iframe 的 UA 画布填色：子站根是 `color-scheme:dark` | 嵌入态根节点加 `color-scheme:light` |
| **顶栏一条磨砂带 / 半透明带** | `backdrop-filter:blur()` 在透明 iframe 上糊出可见磨砂 | 嵌入态一律剥离 backdrop-filter |
| **滚动时内容从顶栏底下穿过（叠字）** | sticky/fixed 顶栏被玻璃化剥掉底色（**纯色分支无尺寸保护**，渐变分支有 200×120 保护） | 改「页面不滚 + 内容独立滚动容器」机制，别加回底色 |
| **全屏/滚动后上下白边（iOS 真机）** | 透明 body 成为滚动容器后，iOS 弹性回弹露出边界外区域，`color-scheme:light` 下画白 | `overscroll-behavior-y:none`（iOS 16+） |
| **下拉条发蓝** | 该站 scrollbar 用了 `#1B2E45`（描边蓝）而非灰黑基线 | 统一 `thumb #2C2C2E / track #1C1C1E / hover #3A3A3C` |
| **局部蓝块（侧栏/卡片/弹层）** | 该元素自己的 `background-color` 或 `background-image` 渐变 | 玻璃化 / 改 transparent |
| **小控件（胶囊/按钮/表头）样式异常、选中态丢失**（09-29 课程胶囊金底实锤） | glassify load 时把它当时的深底清成 transparent + inline `!important` 永久压制，之后 JS 切 class 也救不回；且透明后 alpha<0.85 复查分支永不命中 = **清色死锁无法自愈** | 尺寸保护已废除；金本 `scripts/theme-kit/embedded_kit.txt` 改后跑 `apply-theme-kit.py --fix` 全量刷新，凡「初始态 A、交互后变样式 B」的元素都要复验交互态 |
| **白天/浅色模式下背景 + 鱼影整体消失，只剩一片米白**（09-30 retail-ad 实锤，暗色正常） | 两处叠加：①玻璃化判据 `dark()` 只清**深色**，而子站白天模式的表面色 `--bg #FDFCF9 / --card #FFFFFF / --bg-alt #F7F4EC` 亮度都很高、一条都不命中 → 整页不透明（实测旧版残留 52 块，含 `DIV.content` 686×7740 整块）；②属性观察器只听 `class`/`style`，主题桥切的是 `<html data-theme>` → 深→浅切换后不重扫，已打标元素又被非强制 `run()` 跳过 | 判据换 `surface()`：**中性（通道极差 <32）一律清、彩色且亮度 ≥56 保留**（保住白字金底控件与金色进度条）；观察器 `attributeFilter` 补 `data-theme` 且命中即 `run(true)` 强制重扫。改金本 `embedded_kit.txt` 后必须 `--fix` 全量刷新 |
| **切 tab 后新面板整块深底裸露**（09-29 课程页 tab ②③④ 实锤） | 隐藏面板 display:none 加载时 0 尺寸被旧尺寸保护跳过（不清色不打标），切 tab 变可见后深底露出；而 glassify 的 MutationObserver 只听 childList，class 切换不触发补扫 | glassify 加 class/style 属性 MutationObserver（防抖 120ms 后 `run()` 非强制补扫，已标记跳过，无死循环）——09-29 已进金本 |
| **顶栏/侧栏/搜索框等又出现深蓝底**（09-29 两次实锤） | 尺寸保护线划到哪，哪批元素就保留深底：第一轮「宽≥200且高≥120」漏了 61px 顶栏，第二轮「宽≥400或高≥120」又把侧栏条目/搜索框/表头全保留——**按尺寸豁免这条路本身不通** | 尺寸保护彻底废除：除交互态胶囊外一律清透明（=用户认可的全透明基准）。豁免=死锁准入（见下） |

### 玻璃化改动回归清单（每次动 embedded_kit.txt 必跑，缺一项就等于埋雷）

用 harness（iframe 子站页 + postMessage 暗色）+ eval 探针逐项断言，**先确认 iframe 里跑的是新脚本**（`d.getElementById('embedded-glassify').textContent.includes('新标记')`，否则缓存会给你假结果）：

| 元素 | 期望 |
|---|---|
| 子站顶栏 `HEADER.topbar`（保险/商业运营） | **透明** |
| 搜索框 `#search`（input） | **透明** |
| 侧栏条目 + 选中项 `a.on` | **透明**（全透明基准，不留底色） |
| 课程页胶囊 `.tab` 选中/未选中 | **保留**（金底 / card2 深底）——豁免类 |
| 涉外合同指南页 `nav.tabs button.active`（us-office-lease-guide，胶囊类名不叫 tab） | **保留**（深金渐变 + 金字，09-29d 实锤被清后选中态拉不开） |
| 表头 `th`、指标小卡 | **透明** |
| 大内容卡 `.card` / `blockquote` | **透明** |
| 隐藏 tab 面板切换后 800ms | 观察器补扫清透 |
| 切 tab 滚动位置 | 停在 tabs 上缘，不回顶 |
| **浅色模式**（postMessage `{type:'theme',mode:'light'}` 后 2s）上述同一批元素 | **同样全透明**（白天模式曾整片漏网，见决策树） |
| 强调色控件（金色进度条 `.readbar`、白字金底按钮 `.stations a.on`、印章 `.seal`） | **保留**（被清 = 白字隐形 / 进度条消失） |

改完顺序：金本 → `apply-theme-kit.py --fix` 全量 → `node --check` 抽查 → **上表逐项探针** → commit。
**豁免白名单只允许通过「交互态死锁」准入**：只有当某元素的底色会随用户交互切换、且被 inline 透明压制后无法自愈时，才允许加豁免；纯静态元素一律清透明，不许因为「小」「像控件」就豁免。当前白名单：① class 含 `tab` 的元素；② `nav.tabs` 容器内的按钮（涉外合同指南页用 `nav.tabs button.active`，类名不含 tab，09-29d 补进金本，条件写法 `el.classList.contains("tab")||(el.closest&&el.closest("nav.tabs"))`）。新页面接入前先 grep 该页胶囊/选中态的类名，凡是「选中态底色随 class 切换」的都要核对是否落在白名单内，不在就先补金本再刷新。

**四处来源必查**（漏一处就会反复复活）：`background-color` → `background-image` 渐变 → iframe UA 画布（`color-scheme`）→ `backdrop-filter`。

---

## 三、排查手法（别空想，量化）

1. **先复现，别先改。** 桌面模拟复现不了的（iOS 回弹），要承认复现不了，标注「待真机复验」，不能谎报修好。
2. **扫描不透明元素**（iframe 内）：遍历 `getComputedStyle` 的 `backgroundColor`，取 alpha > 0.3 且尺寸 > 250×100 的，输出 tag/class/inline style。
3. **对比高度**：`iframe.clientHeight` vs `document.documentElement.scrollHeight` —— 差值就是露白/露底区。
4. **二分法定位画布级填色**：藏 iframe → 看像素变不变；藏 iframe 文档内容（`visibility:hidden`）→ 像素仍不变即画布级（元素审计查不到）。
5. **grep 全站对比**（`grep -rhoE "scrollbar-color: *#[0-9A-Fa-f]{6} *#[0-9A-Fa-f]{6}" public/*/`）——找出与其他站不一致的"另一派"。
6. **探针页 + 对照组**（09-30 定型，判据类改动必须先跑）：
   ① 在 `public/` 放一次性 `_probe.html`：iframe 载入子站页 → postMessage 切主题 → 遍历 `getComputedStyle`
   统计「不透明中性底」元素数与大块清单 → 结果写进 `<pre id="out">`；
   ② `python3 -m http.server 8899`（**必须和 Chrome 同一条命令里起**，上一条 Bash 结束服务就死）；
   ③ `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-sandbox --virtual-time-budget=25000 --dump-dom http://127.0.0.1:8899/_probe.html` 取 `<pre>` 内容；
   ④ **对照组**：`git show HEAD:public/<站>/index.html > public/<站>/_probe_old.html` 跑同一探针 ——
   没有对照组时「0 残留」既可能是修好了，也可能是探针写错了。用完删探针文件。

---

## 四、修复后的硬动作（漏了 = 白改）

1. **bump `?v=` 版本号**：改了 `public/<站>/assets/*.js|css` 必须同步 bump 该站 index.html 里的引用版本号。
   **09-28 血案**：改了 app.js 没 bump → iOS Safari 吃旧 JS → 用户真机上 bug 依旧，我却在 dev 里报"已修复"（假阴性）。
   labor 这类原本无版本号的要补上（`layout.css?v=4`）。
   补丁块改的是**金本**（`scripts/theme-kit/*.txt`），改完必须跑 `apply-theme-kit.py --fix <所有目录>` 全量刷新已注入页面，
   再抽查 `node --check` 提取的 script——金本改了页面没刷 = 等于没改。
2. **机器复核**：grep 关键值命中数 / `node --check` 改过的 JS / 花括号平衡检查（本项目 CSS 常见"最后一条声明不带分号"，追加属性会黏成一条失效）。
3. **提交**：Bash 显式给 `timeout`（commit hook 推送可能超 120s 默认超时被 SIGTERM）。
4. **上线核验**：`bash scripts/verify-online.sh <slug|URL> "关键文本" --wait 300`。改的是 JS/CSS 就打资源文件 URL，别打 index.html。

---

## 五、相关脚本（在本项目仓库内）

- `scripts/unify-scrollbar.py` — 全站滚动条色值统一基线
- `scripts/fix-mobile-fullscreen.py` — 手机端全屏改 CSS 沉浸式
- `scripts/fix-film-law-scroll.py` — sticky 顶栏叠字改独立滚动容器
- `scripts/apply-theme-kit.py` + `scripts/theme-kit/` — 主题补丁注入（改配色改 golden copy 再 unify）

**改配色只改 golden copy，别直接改 public/**：rsync 从中文源目录覆盖时会被抹掉（不报错、线上 200 只是配色回退）。
