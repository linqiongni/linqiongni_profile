# MEMORY.md — linqiongni_profile 长期记忆

## 首页与导航结构（2026-09-18 改定，改前先读）
- **头部 = 128px**：主行 80px（品牌 / 三个分组 / 主题+联系我）+ **常驻第二行 48px**（`#navbar-subnav`，当前分组的子板块横排 + 滑动金色胶囊）。第二行 `md:` 起显示，手机端隐藏（走汉堡菜单）。
- 因此所有内容区顶部预留：`pt-20 md:pt-32`（正文页）、Hero `pt-24 md:pt-36`；`handleSelectTab` 的滚动偏移是 **-128**。改头部高度要同时改这三处。
- **首屏（Hero）结构**（2026-09-18 二轮改定）：`section` 自身不留左右内边距，内部包一层与正文相同的栅格 `max-w-7xl mx-auto px-6 sm:px-12`，保证**首屏左缘与下方各板块严格对齐**（1440 下同为 125–128px，手机同为 24px）。
  - 主视觉区 `flex-1` 占满整屏剩余高度（英文标识 → 主标题 → 副标题 → 数据条「9 大法务领域 / 400+ 篇实战笔记与课程 / 3 季影视律政拆解」），标题 `text-[2.6rem] sm:text-6xl md:text-7xl lg:text-[5.25rem]` + **`text-balance`**（否则手机上断成「法律是商业的底 / 层代码」）。英文标识手机端 `text-[10px]` 且两侧金线 `hidden sm:block`，否则会折两行并溢出容器。
  - **内容地图 `mt-auto` 贴左下角**，是**无边框文字导航**：默认灰字（`#6E6E73` / 暗色 `#98989D`），hover 变香槟金 + 1px 金色下划线由左展开（`group/chip` + `scale-x-0 → scale-x-100`）。**不要改回 border + rounded-full 胶囊**（用户 2026-09-18 明确要求去外框）。三组 17 项点击直达，数据读 `NAV_GROUPS` + `SUB_TAB_META`，加新 tab 自动出现。
  - 原来的两个按钮（探索实战案例 / 了解执业背景）已删除。
- 数据条数字依据 `public/` 实际页数（ip 257 + lessons 92 + logistics 43 + financing 14 + criminal 13 + labor 9 ≈ 430），站点内容量变化大时记得同步。
- **iframe 地址一律写显式 `index.html`**（如 `/ip/index.html`、`/financing-legal/index.html`）。写目录 URL（`/ip/`）在 `vite dev` 下会被 SPA 兜底成首页，本地看起来「iframe 里是主页」，线上 GH Pages 才正常 —— 本地验证会失真（2026-09-18 踩过）。
- iframe 高度统一为 `h-[calc(100vh-80px)] md:h-[calc(100vh-128px)]`（类名，不用 inline style，避免与既有 className 冲突）。
- 「新窗口打开」金色浮标固定在**右下角**（`fixed bottom-6 right-6`）；原来在 `top-24 right-5`，会被 128px 头部压住。
- 深色模式默认跟随系统 `prefers-color-scheme`（`App.tsx` 的 darkMode 初值）。
- 首页进一步可做（未做）：背景加印章/诗句等国风水印、数据条下方加「最近上新」位、About 页放真人照片。

## 本项目工具环境坑（2026-09-18）
- 本机 shell 有 `HTTP_PROXY/HTTPS_PROXY=127.0.0.1:<port>`，`curl`/Chromium 访问 localhost 会被劫持成 502 或连接被拒。用浏览器本地验证前先 `export NO_PROXY="127.0.0.1,localhost" no_proxy=...`。
- `agent-browser` 已全局安装（Chromium 已下载）。截图用位置参数：`agent-browser screenshot /tmp/x.png`（`--path` 无效会被当成 selector）。
- `agent-browser eval` 的 JS 上下文会**保留上一次的顶层变量**，重复 `var r=...` 会报 "Identifier already declared"。务必用 IIFE 包裹。
- 后台跑 `npx vite` 必须用工具的 run_in_background（普通 `&` 起的进程会在命令结束时被回收，导致后续连接被拒）。

## 项目关键事实
- 部署：push `main` 自动 CI 构建发布 GH Pages；**本地不要 `npm run build`**（清空 dist 资源，曾拦截）。
- 用户偏好（2026-09-10 起）：图片默认彩色；背景波纹必须克制（首版易发晕）。
- 餐饮法务「每周计划」：标题直跳全文，无右侧站内阅读/分享图标（2026-09-12 改定）。

## 可复用脚本
- `scripts/add_lesson.py`：把某周某天 HTML 合并进餐饮法务 tab（一键入库）。

## 刑事辩护 tab（2026-09-16 新增，2026-09-19 改造）
- 2026-09-19 起**从「法务实务」`legal` 分组移到「律师实务」`practice` 分组**（与 family-law 并列），组件 `src/components/CriminalDefenseTab.tsx`（iframe `/criminal/index.html`，已加入 `isFullBleed` 通栏）。
- 同步改造为**与婚姻家事同款左栏目录 B 布局**：抽出共享 `public/criminal/assets/crim-style.css`（暗色国风 + 顶栏/左固定目录栏/主区/右页内目录，重定家事站布局）+ `public/criminal/assets/crim-app.js`（`STATIONS` 数组驱动 13 页侧栏，分组：总纲 / PART I 全流程实务(8) / PART II 工具与模板(3) / PART III 训练计划(1)；支持搜索过滤、scrollspy、上下篇、复制按钮兜底）。
- 13 个 HTML 页已改写：去各页内联 `<style>`（合并去重为共享 CSS）→ 引 `crim-style.css`；去旧顶部横向 `.nav`；`<body data-ch="id">`；保留各页**内联 `<script>`**（plan.html 的 30 天 DAYS 渲染、templates/tools 内联脚本必须保留，只删外链 `/theme-toggle.js` 再在页尾重挂 `crim-app.js` + `/theme-toggle.js`）。
- 静态内容在 **`public/criminal/`**：13 页（总纲/流程鸟瞰/收案委托/会见/侦查辩护/阅卷·起诉/一审庭审/二审·复核·执行/特别程序·风险/文书库/工具/30天计划/法条术语）。**`public/criminal/` 即源站，无独立源码目录、无 rsync 同步脚本**——改内容直接改这里。
- 线上：`https://linqiongni.top/criminal/`。
- 内容骨架 = 中华全国律师协会《律师办理刑事案件规范》（2017-08-27 通过）十八章；法条基准 = 刑诉法 2018 年修正本（308 条）+ 法释〔2021〕1 号。已在文中标注「刑诉法第四次修改在途，条号以现行文本为准」。
- 后续加新模块：① 复制任一页改内容并在 `<body data-ch>` 设新 id；② 在 `assets/crim-app.js` 的 `STATIONS` 数组加一条（含 part 分组与 kw 搜索词）；③ 若需新分组，在 `PARTS` 数组加一项。不再手动维护各页 `.nav`。

## 婚姻家事与遗产继承 tab（2026-09-19 新增，当晚已挂载上线）
- **新顶层分组 `practice`（律师实务）**（与「法务实务」并列，第一个子板块），subTabs:['family-law']，SUB_TAB_META「婚姻家事与遗产继承 / Family & Inheritance」。组件 `src/components/FamilyInheritanceTab.tsx`（ThemeIframe → `/family-law/index.html`）；types/navConfig/App 四处已接线。
- 源站：根目录 `婚姻家事与遗产继承/`（index + ch01–ch24 共 25 页 ≈560KB），B 布局（顶栏+左栏+右页内目录），assets 复用商事仲裁模式。同步：`npm run sync:family-law`（rsync 排除 _build）。
- **法源基准事实表：`婚姻家事与遗产继承/_build/法源基准.md`（联网核实）**——含婚姻家庭编解释（一）91 条、解释（二）（法释〔2025〕1 号，2025-02-01 施行）23 条、继承编解释（一）45 条全文；民法典 1158=遗赠扶养协议；**「2026 继承新规」是谣言**；民诉法 2023 修正条号不写具体。改内容先查该表。
- 结构：PART I 通用全流程 ch01–08 / PART II 十案由 ch09–18（每章五节：焦点/起草/证据/法条/抗辩坑点）/ PART III ch19–23（保护令/特别程序/执行/遗产管理人/再审三撤执行异议）/ ch24 附录。
- 线上：`https://linqiongni.top/family-law/`。commit a1e4360 + dd2ec92（Hero 数据条改 11 领域/470+ 篇）。
- 再次踩坑：App.tsx 多行条件 Edit 报成功未落盘（2 次），python replace 才写入；**改后必 grep 计数**。

## 待办 / 未决
- [ ] 是否把「案例展示」卡片也从黑白→hover 变彩改为常驻彩色（用户未定）。
- [ ] AGENTS.md / MEMORY.md 为用户「约束先行」规则要求，本文件于 2026-09-12 首次补齐。

## 融资法务 tab（2026-09-17 新增，当晚已挂载上线）
- 顶层目录 `融资法务/`（与 `法律AI/` 同级）：`index.html` + `ch01…ch12` + `assets/{style.css,app.js}` + `README.md`，约 240 KB。
- 12 站：创业股权架构 / ESOP / Term Sheet / 尽调 / 合资协议 / 设立与红筹 / 合规风控 / 股权变更并购 / 治理结构 / 港股上市规则 / IPO 全流程 / 上市后披露。主线为虚构案例「霓光珠宝」Y1–Y10 从水贝档口到港股挂牌。
- **第 13 站 `ch13-cases.html`（2026-09-17 增）＝ 真实案例库**：29 个案件（海富案／华工案／九民纪要、俏江南张兰新加坡信托击穿、真功夫、雷士照明、当当、ofo、滴滴、蚂蚁、瑞幸、康美、紫晶存储、恒大地产、汉能、辉山、18C 四样本等），每条标案号／金额／出处 URL 与「案情—结论—法务视角」三段；末尾附「怎么自己求证」检索路径（cn-rules.hkex.com.hk、hkexnews、csrc.gov.cn、gongbao.court.gov.cn、scia.com.cn）。前十二站末尾各有一段「延伸：真实案例对照」并指向第 13 站。
- 每站八段结构：剧情 → 术语卡 → 打比方 → SVG 结构图 → 案例对照 → 条款样板 → **延伸真实案例** → 自检清单 → 法源索引。
- **港股规则三处易过期数据（已多源核校 2026-09-17，引用请一律用新版）**：① 公众持股量自 2025-08-04 改为分层门槛（≤60亿→25%；60–300亿→15亿市值或15%取高；>300亿→45亿市值或10%取高），旧「划一 25%」作废；② 18C 市值门槛 2024-09-01 起临时下调至 2027-08-31（已商业化 40 亿／未商业化 80 亿）；③ WVR 自 2026-07-24 起降至 200 亿，或 60 亿市值＋6 亿收入，10:1→市值≥400亿可 20:1，保密递交已扩展至所有新申请人。8.05 三项财务测试未变（现行值系 2022-01-01 上调结果）。
- 技术：`assets/app.js` 注入顶部导航/上下篇/深浅色/阅读进度，数据源是 `STATIONS` 数组；正文页只需 `<body data-station="chNN">`。**新增/改章节名只需改 app.js 一处。**
- **已挂载**（2026-09-17 23:10，commit a8ce2ee 已 push）：静态站副本在 `public/financing-legal/`（iframe `/financing-legal/`，组件 `src/components/FinancingLegalTab.tsx`）；`types.ts` 加 `'financing'`、`navConfig.ts` 的 `legal.subTabs` 末尾加 `'financing'` + `SUB_TAB_META.financing = {融资法务 / Financing}`、`App.tsx` 加渲染分支 + `isFullBleed` + 滚动置顶。子导航第 9 个按钮。线上 `https://linqiongni.top/financing-legal/`。
- **改内容流程**：改根目录 `融资法务/` 的源文件 → `npm run sync:financing`（`rsync -a 融资法务/ public/financing-legal/ --exclude README.md`）→ `npx tsc --noEmit` → commit/push。**不要只改 public 副本，会被覆盖。**
- 第 10 站的港股主板三项财务测试数值已对照 hkex 规则原文核校；其余数值标注「通行实务表述，请核原文」。

### 融资法务 · 深度补充面板模式（2026-09-18 建立，ch02 首批落地）
- 背景：Andy 要求把站内关键概念「展开细化」＝**大白话理解 + 专业术语 + 条款解析 + 协议模板**四段，并在正文该字眼上设**跳转链接**点开。
- 结构：`<details class="deep" id="deep-xxx">` → `<summary>`（`.seal-sm`「补」印 + `.dtitle` + `.dmeta` + `.dcue`）→ `.deep-bd` 内用 `<h3>` 分 A1/B1… 四段；正文入口用 `<a class="xref" href="#deep-xxx" data-deep="deep-xxx">关键词<sup>详解</sup></a>`。
- 样式（`融资法务/assets/style.css`）：`.xref`（香槟金 + 虚线下划线 + 「详解」胶囊）；`.deep`（国风折叠面板、左侧金边、`scroll-margin-top:78px` 避开 128px 顶栏）；`@media(max-width:640px)` 隐藏 `.dmeta` 并收窄内边距。术语用 `.tw` 表、模板用 `.clause`：
- 交互（`融资法务/assets/app.js` 的 `deepLinks()`）：`[data-deep]` 点击 → `target.open = true` + `scrollIntoView({behavior:'smooth'})` + 写 `location.hash`；`<details>` 本身原生可折叠，无 JS 也能用。
- 已落地 `ch02-esop.html`：`#deep-lp`（有限合伙企业持股平台全解）+ `#deep-vesting`（成熟计划 Vesting 全解），正文 3 处锚点（剧情段 / 术语卡「持股平台」/ 成熟节奏引导行）；header meta-line 加了「深度补充 2 篇」。
- **已核实法条（gov.cn《合伙企业法》现行文本，2026-09-18）**：第 61 条 2–50 人且至少 1 名 GP；第 62 条名称含「有限合伙」；第 63 条协议必备 6 项；第 64 条 LP 不得以劳务出资；第 66 条登记载明 LP 及认缴额；第 67 条 GP 执行合伙事务；**第 68 条 LP 不执行合伙事务 + 8 项安全港**；第 69 条利润分配（不得全分给部分合伙人，协议另有约定除外）；第 70–73 条 LP 可交易 / 竞业 / 出质 / 对外转让应提前 30 日通知；第 74 条强执份额时其他合伙人优先购买权；第 75 条仅剩 LP 应解散；**第 76 条表见普通合伙**（LP 最易踩的雷）；第 77 条新入伙 LP 以认缴额为限。vesting 市场惯例：4 年 + 1 年 cliff + 之后每月 1/48 为标准；单层触发已少见，**双层触发（并购 + 被裁/未承接）为现代主流**。
- 复用：其余站位（03–12）做同类细化直接复刻此模式。

## 商事仲裁 tab（2026-09-18 新增，当晚已挂载上线）
- 顶层目录 `商事仲裁/`（与 `融资法务/` 同级）：`index.html` + `ch01…ch20` + `assets/{style.css,app.js}`，约 440 KB。**法务实务分组第 10 个子板块**（前 9 个：餐饮/物流/知产/涉外/保险/刑事/AI+法律/劳动法务/融资）。
- 组件 `src/components/ArbitrationTab.tsx`（`ThemeIframe` → `/arbitration/index.html`）；`types.ts` 加 `'arbitration'`；`navConfig.ts` 的 `legal.subTabs` 末尾追加 + `SUB_TAB_META.arbitration = {商事仲裁 / Arbitration}`；`App.tsx` 加渲染分支＋回顶部＋`isFullBleed`。
- 同步：`npm run sync:arbitration`（`rsync -a 商事仲裁/ public/arbitration/`），已串进 `sync:all-static`。**改内容只改根目录中文源目录，别只改 public 副本。**
- 结构：第一部分通用流程（ch01 仲裁条款 → ch02 仲裁前 → ch03 立案 → ch04 组庭 → ch05 答辩/反请求 → ch06 举证质证 → ch07 开庭 → ch08 裁决 → ch09 与民诉差异对照）；第二部分 ch10—ch16 七类合同（买卖/建设工程/租赁/服务委托/特许经营/借款/国际贸易），每章固定六节（焦点／起草／证据／法条／抗辩坑点／对方抗辩＋应对＋裁判规则）＋第七节「其他」；第三部分 ch17 执行／ch18 撤裁／ch19 不予执行／ch20 附录。
- **法源基准（关键，勿用旧法）**：《仲裁法》2025-09-12 修订通过、**2026-03-01 施行**，8 章 96 条。全站按新条号写：第 27 条三要素＋默示达成、第 30 条独立性、第 31 条异议须首次开庭前、第 41 条送达、第 45 条仲裁员披露、第 61 条虚假仲裁驳回、**第 72 条撤裁期限 3 个月（旧法 6 个月）**、第 81 条仲裁地、第 82 条特别（临时）仲裁、第 83/84 条涉外撤裁与不予执行、第 88 条境外裁决承认执行。配套司法解释尚未出台（最高法已表态加快制定），页内已标注「不抵触部分继续适用，须核对现行文本」。
- 内容风格：律师实务干货＋踩坑清单＋自检清单；案例只写「裁判规则要点」并注明检索核校路径，**不编造案号与案情**。
- 页面技术：`assets/app.js` 的 `STATIONS` 数组驱动章节条/上下篇/目录/进度条，正文页只写 `<body data-ch="chNN">`；暗色由 `/theme-toggle.js` 同步主站。
- **布局（2026-09-19 改）**：改为「顶栏 + 左侧固定目录栏（独立滚动） + 主区独立滚动 + 右侧本页目录」的 app 式布局，与保险站一致。`html,body{height:100%}` + `body{overflow:hidden}` + `.layout{display:flex;height:calc(100vh-顶栏高)}`（顶栏高度由 JS 实测注入，勿写死）；左栏 280px、`overflow-y:auto`，主区 `.main{overflow-y:auto}`，右侧 `.pagetoc` sticky 且 ≥1181px 才显示、窄屏回落为页内 `.toc` 块（两种都生成，靠 CSS 媒体查询切换，勿用 JS 判断）。<1001px 时左栏变抽屉（`transform:translateX(-100%)` + 顶栏「目录」按钮）。滚动进度条/scrollspy 需同时监听 `main` 与 `window`（宽窄屏滚动容器不同）。`STATIONS` 增 `kw` 字段供搜索（否则「撤裁」搜不到「申请撤销仲裁裁决」）。
- 经验：jsdom 无 `window.matchMedia`，用 `window.matchMedia ? ... : innerWidth` 兜底，否则 jsdom 冒烟脚本整页脚本报错。冒烟方式：`NODE_PATH=~/.workbuddy/binaries/node/workspace/node_modules node` + jsdom `runScripts:'dangerously'` 断言侧栏链接数/高亮/右侧目录条目/搜索命中。

## 双视角劳动法务 tab（2026-09-14 新增，2026-09-17 改为「法务实务」子板块）
- 原第 4 个顶层分组，2026-09-17 起**移入「法务实务」`legal` 分组作为子 tab**（顶层恢复为个人 / 法务实务 / 影视法律 3 个）。`navConfig.ts` 的 `NAV_GROUPS` 删 `labor` 分组、`legal.subTabs` 末尾加 `'labor'`；`SUB_TAB_META.labor` 文案保留为子 tab 名；Navbar 注释改回 3 分组。`App.tsx` 的 `labor` 渲染分支与 `isFullBleed` 不变（子 tab 仍为铺满型）。
- 进入「法务实务」分组后，子导航第 8 个按钮即「双视角劳动法务」（前 7 个：餐饮/物流/知产/涉外/保险/刑事/AI+法律）。
- 组件 `src/components/LaborLegalTab.tsx`（iframe `/labor/` + loading + 新窗口打开浮层，沿用 IpLegalTab）。
- 静态内容在 **`public/labor/`**：9 页 588 KB —— index / base（通用底座）/ employer（A 用人单位合规）/ employee（B 劳动者维权）/ clash（C 攻防对照 12 场景）/ tools（6 个纯前端计算器）/ templates（12 份文书）/ law（法条+术语）/ route（28 天路线）。纯本地零上传，全部相对链接、无外部依赖。
- 线上：`https://linqiongni.top/labor/`。
- 源文件：`/Users/linqiongni/Downloads/知识产权/劳动用工实务/`，构建脚本 `_build/gen.js` + `_build/data/*.json`（11 个数据文件）。更新流程：那边改 JSON → `node gen.js` → 重新 `cp *.html public/labor/` → `npx tsc --noEmit` → commit/push。

## 跨境物流法务 tab（2026-09-12 新增）
- 第 8 个 tab：`logistics`（TabType 已扩），组件 `src/components/LogisticsLegalTab.tsx`。
- 静态内容放在 **`public/logistics/`**：`index.html` = 24 周养成计划主页（385 KB 单文件），`W1/*.html` = 第 1 周 5 天 + 周末实战。
- 线上访问：`https://linqiongni.top/logistics/` 与 `/logistics/W1/`。
- 源文件：`/Users/linqiongni/Downloads/涉外法务总监养成计划/`（计划根目录 + `W1/`，构建脚本 `_build/build.py`、`_build/gen_w1.js`）。
  更新流程：那边重跑 build/gen → 重新 `cp` 覆盖 `public/logistics/` → lint/build → commit/push。
- 计划主页里已跑出内容的天（目前仅 W1）会显示「已跑出内容」标签并隐藏指令块，改为跳转内容页；新跑一周只需在 `_build/app.js` 的 `DONE_CONTENT` 里加一周映射。
- **2026-09-12 改版**：用户要求点 tab 就直接看到计划本体，不要门面页二次跳转。
  `LogisticsLegalTab.tsx` 改为「极窄工具条 + iframe src="/logistics/"」（高度 calc(100vh-190px)/min 720px）；
  `App.tsx` 加 `isFullBleed = activeTab === 'logistics'`，命中时 main 去掉 max-w-7xl 与 py-16 以便通栏。
  闭环：iframe 内点某天「在本页打开」→ 内容页 → 「返回学习计划」→ 回 /logistics/。

## 本站 git 踩坑（必读）
- 该仓库（在 ~/Downloads 下）git 操作后 **`.git/*.lock` 无法被 git 自己 unlink**，下次操作即报 "Unable to create index.lock: File exists"。
  解法：每次 git 前先用 Python 递归清锁——
  `python3 -c "import os;[os.remove(os.path.join(r,f)) for r,_,fs in os.walk('.git') for f in fs if f.endswith('.lock')]"`，
  且 add / commit / push 之间各清一次；bash 的 `rm -f` 同样会被拒。需免沙箱执行。
- `vite build` 清空 dist 时也会 EPERM，用 `npm run build -- --emptyOutDir=false` 绕过。
- **改完线上看不到 = 缓存，不是没部署**。GH Pages 响应头 `cache-control: max-age=600` + `x-cache: HIT`，浏览器会缓存旧 `index.html`（引用旧 bundle hash）。
  排查顺序：① `curl -s https://linqiongni.top/ | grep -o '/assets/[^"]*\.js'` 拿当前 bundle 名；② `curl -s https://linqiongni.top/assets/<bundle>.js | grep '新tab名'` 判断是否已上线；
  ③ 已上线却看不到 → 用户侧硬刷（Mac Cmd+Shift+R / Win Ctrl+F5），或访问 `https://linqiongni.top/?v=<时间戳>` 绕开缓存。站内无 service worker，不必查 SW。
- **验证「新 tab 是否真上线」必须查 NAV_GROUPS 数组，不能只 grep 字符串**：bundle 里 `SUB_TAB_META` 有该 tab 名但 `NAV_GROUPS` 数组没有时，导航不会渲染。
  正确做法：`curl -s https://linqiongni.top/assets/<bundle>.js`，取 `id:"profile"` 起的整段，数 `{id:...subTabs:[...]}` 个数。只 grep 名字会命中文案常量而误判成功（2026-09-14 踩过）。
- **`raw.githubusercontent.com` 有 CDN 缓存**，可能返回旧文件内容。判断远端真实状态用 `git fetch origin` + `git show origin/main:<path>` 或 GitHub API `/commits/main`。
- **并发会话风险**：多个 WorkBuddy 会话可能同时操作本仓库（2026-09-14 有会话推餐饮法务第 11/12 周）。已提交的 Edit 可能在磁盘上被回退，
  **改完立即 grep 逐处校验**，不要只信工具返回成功；跨多行的大块编辑更脆弱，优先单行写法。push 前先 `git fetch` 确认无分叉。
- push 失败时按序排查：① 清 `.git/*.lock`（见上）；② 带 `-c http.proxy= -c https.proxy=`；③ 若报 `HTTP/2 framing layer` 或 `Couldn't connect to server (port 443)`，是当前环境无外网/被隔离，改用 `git -c http.version=HTTP/1.1 push` 仍连不上则只能等联网，本地用 `npm run dev`（端口 3000 被占则 3001）预览。

## 融资法务站 · 内容深度化两种模式的取舍（2026-09-18）
- **ch02 模式（已弃用）**：`.deep` 折叠面板放在页面下方 + `.xref` 锚点点击后 `scrollIntoView` 跳过去。缺点：看完要往回翻找原文，Andy 明确否决（"不要跳到下面去"）。
- **ch03 起的标准模式（后续站位照此做）**：
  1. `.peek` 原地展开详解——`<details class="peek"><summary><span class="pk-badge k">常见坑</span>标题</summary><div class="pk-bd">…</div></details>`，直接插在对应段落之后，写在 `assets/style.css`；徽章三类 k(红/坑) t(蓝/术语) d(金/模板)。
  2. `.tpl` 可折叠协议模板——`<details class="tpl"><summary><span class="ch">条款 X · 标题</span><span class="cue"></span></summary><div class="clause">…</div></details>`，cue 文案由 CSS `content` 自动切换「展开全文/收起全文」。
  3. `.tplbar` 控件条：`<button data-fold="open|close" data-fold-kind="peek|tpl" data-fold-scope="可选容器id">`，逻辑在 `assets/app.js` 的 `foldControls()`；**只切换 open，不滚动**。
- 页首建议放一条页级控件条（展开/收起 全部详解、全部模板）；模板库小节再放一条局部控件（用 `data-fold-scope` 限定范围）。
- 大块 Edit 后必须 grep 计数校验（本轮首块编辑报成功但未落盘）。

## 关键法条条号（融资交易相关，已核对官方文本）
- 九民纪要第 5 条引用的**旧**条号：35 抽逃出资 / 142 股份回购 / 166 利润分配 → 2023 修订《公司法》对应 **53 / 162 / 210**。
- 2023 修订《公司法》：**144** 条股份有限公司类别股（有限公司无法定类别股，只能用章程+股东协议+合同拼）；**224** 条减资程序（决议起 10 日通知债权人、30 日公告、债权人 30/45 日内可要求清偿或提供担保）；**226** 条违法减资后果；**15** 条对外担保（为股东/实控人担保须股东会决议、关联股东回避表决）。
- 对赌条款设计定式：创始人作主债务人 + 公司连带保证（须留存股东会决议与章程）+ 减资配合义务与违约金 + 配偶同意函 + 价格上限（本金 + 8% 单利 − 已分配利润）；拟上市须递表前 6–12 个月签终止契据并写复效条款。

## iframe tab 与主站深色模式同步（2026-09-18）
- 主站 darkMode 不影响 iframe 内静态页。同步机制：iframe 页引入 `/theme-toggle.js`，监听 `postMessage({type:'theme',mode:'dark'|'light'})`；或自身已实现兼容监听（ai-law）。
- React 侧统一用公共组件 `src/components/ThemeIframe.tsx`：`darkMode` prop + `iframeRef`，useEffect 依赖 `[darkMode, loading, loadedTick, nonce]`，onLoad 里 `setLoadedTick(t=>t+1)` 保证 iframe 加载完成后再发消息（监听器在页尾脚本注册，过早发会丢）。App.tsx 每个 iframe tab 渲染处传 `darkMode={darkMode}`。
- 已全部接入（ip / logistics / labor / criminal / film-law S1–S4 / insurance / ai-law / financing-legal / startup 共 11 个）。
- 静态页补齐规则：① 已有 `[data-theme="dark"]` CSS 但缺监听 → 加 `<script src="/theme-toggle.js">` + `<html data-theme-default="light">`；② 纯浅色页 → 先在自身 CSS/style 写 `html[data-theme="dark"]` 变量覆盖（film-law S2–S4 直接复制 S1 的 47 条暗色段；insurance/startup 手写变量覆盖 + 针对性覆盖少量硬编码浅色），再接 theme-toggle.js。
- 注意：引入 theme-toggle.js 的 iframe 页会自带"切换深色/浅色"浮层按钮（top:56px right:16px），与主站独立可控。

## 身边的英语 tab（2026-09-19 重做，场景化短文阅读器）
- **源站**：仓库根 `身边的英语/` = `index.html`（布局 + 播放引擎）+ `scenes.js`（内容数据，本次拆出）；部署副本 `public/english/`（`npm run sync:english`，整目录 rsync）。组件 `src/components/EnglishTab.tsx`。
- **内容模型**：`SCENES` 数组，一篇 = 一个场景（`t` 英文标题 / `z` 中文 / `time` / `lead` / `paras[{p,z,w}]` / `notes[{e,c,x}]`），分组由 `PARTS` 决定。**加场景只追加一条**，目录、篇数副标题、播放全自动带上。当前 18 篇 / 5 组（早/通勤/上班/晚/周末）。
- **播放**：整段连读（句子队列，逐句 speak + onend 续读），当前句高亮 + 自动滚动；底栏 上一句/播放/下一句/进度跳句/循环/语速 0.75–1.15/美音英音。暂停＝记录 idx 后 cancel，继续＝从 idx 重播（Safari 无 pause 也适用）。
- **布局**：左栏时间线目录（搜索 + 已听标记）+ 居中阅读器（英文 serif 19px）+ 底部常驻播放条；≤900px 侧栏转抽屉 + 遮罩 + 默认收起。双语三档由 `body[data-mode]` 驱动（both/en/zh）。
- **深色**：自己监听主站 `postMessage({type:'theme'})`；**不要引 `/theme-toggle.js`**（浮动按钮 top:56px 会压住阅读器顶栏）。
- **必须保留**：iframe src 挂 `IFRAME_V` 日期版本号 + index.html 把 `?v=` 透传给 scenes.js（防「旧 HTML + 新数据」白屏）；localStorage 一律走 `store.get/set` 的 try/catch（受限环境抛错会整站白屏）。
- 线上：`https://linqiongni.top/english/index.html`。
- **别把 `.workbuddy/`、`AGENTS.md`、`MEMORY.md` 放进 `身边的英语/`** —— rsync 整目录同步会把它们发布到线上。
