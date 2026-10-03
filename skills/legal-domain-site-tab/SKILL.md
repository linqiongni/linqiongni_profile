---
name: legal-domain-site-tab
description: 当 Andy 要求「系统学习某个法律领域 → 输出 HTML → 在 linqiongni.top 建一个 tab 部署上去」时使用。固化了 linqiongni_profile 站点的接入配方（public/<slug>/ 自包含静态站 + iframe tab + types/navConfig/App 三处改点）、git 踩坑、以及内容骨架的搭建顺序。已用于 labor / ai-law / criminal 等模块。
agent_created: true
---

# 法律领域知识站 → 个人主页 tab

一句话流程：**写 `public/<slug>/` 自包含静态站 → 加一个 iframe tab → tsc 校验 → 只 commit 自己的文件 → push 触发 CI。**

## 一、决策先于动手

开工前先问清（或按默认推断）：
- **slug**：URL 目录名，小写英文，如 `criminal`、`labor`、`insurance`。
- **放哪个顶层分组**：`profile`(个人) / `legal`(法务实务) / `film`(影视法律) / `labor`(双视角劳动法务)。法律实务类默认挂 `legal`。
- **是否通栏铺满**：内容是多页知识站 → 通栏（iframe 铺满，无 Hero / Footer）；单页小工具 → 普通容器。
- **是否要「每天的详细指令」**：要 → 单开一个 `plan.html`，每天 = 学习目标 / 精读 / 实操 / 可复制 AI 指令 / 自检 / 当日交付物，并配一个**贯穿全程的虚拟案卷**，否则每天的任务是散的。

## 二、内容骨架（按这个顺序写，不要跳）

1. **先联网核实权威骨架**，不要凭记忆编章节。做法：搜索该领域最权威的行业规范/官方文件目录（例如刑事辩护 → 中华全国律师协会《律师办理刑事案件规范》2017-08-27 通过，十八章；劳动 → 人社部文件；物流 → 海商法/公约体系），按它的章节切分页面。
2. **总纲页 `index.html`**：本课程体系、12 个模块卡片、底层逻辑（3-5 条）、十条铁律、常见错误表、**版本与免责声明**（写明所依法律文本的版本与「条号以现行有效文本为准」）。
3. **流程/期限页**：一张全流程图 + 法定期间速查大表 + 各阶段「能做什么/不能做什么」对照表。**这类页面是整站最常被查的，值得花最多力气。**
4. **分阶段实务页**：每页固定结构 —— 法律依据框 → 操作步骤 → 表格 → 文书模板 → 红线清单。
5. **文书模板页**：统一 `<div class="doc">` + 右上角复制按钮（`onclick="cp(this)"`），模板要给完整正文而非骨架。
6. **工具页**：纯前端计算器 + 可勾选清单（localStorage 持久化）。勾选清单比计算器更常用。
7. **计划页**：`<details>` 折叠每天，指令块 `<div class="pbox">` 带复制按钮。
8. **法条/术语页**：按主题组织的条文导览表（务必写清「条号依××年修正本，以现行文本为准」）。

**页面必须自包含**：内联 `<style>` + 内联 `<script>`，全相对链接，零外部依赖（不用 CDN）。这样整目录可直接拷到阿里云/任何静态主机。

## 三、站点接入四步（linqiongni_profile）

1. `src/types.ts`：`TabType` union 加一个成员。
2. `src/navConfig.ts`：`NAV_GROUPS` 目标分组 `subTabs` 加一行 + `SUB_TAB_META` 加 `{ label:'中文名', enLabel:'English' }`。
3. `src/components/XxxTab.tsx`：**用公共组件 `ThemeIframe`（2026-09-18 起统一，不再照抄 LaborLegalTab）**：
   ```tsx
   import { ThemeIframe } from './ThemeIframe';
   export const XxxTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
     <ThemeIframe src="/<slug>/index.html" title="…" darkMode={darkMode} />
   );
   ```
   iframe 地址**必须写显式 `index.html`**（写目录 URL 在 vite dev 下会被 SPA 兜底成首页，本地验证失真）。
   静态页接 `/theme-toggle.js` 即可跟随主站深浅色。
4. `src/App.tsx`：四处 —— `import`；`handleSelectTab` 的「直接回顶部」条件加该 tab；`isFullBleed` 条件加该 tab；渲染分支加一行（传 `darkMode={darkMode}`）。

**大站（10 页以上）的源文件约定（2026-09-18 定型，照 `融资法务/` 与 `商事仲裁/` 的做法）**：
- 源站放**仓库根目录的中文目录**（`融资法务/`、`商事仲裁/`），`public/<slug>/` 只是同步出的副本；
- `package.json` 加 `"sync:<name>": "rsync -a \"<中文目录>/\" \"public/<slug>/\" --exclude .DS_Store"`，并把新脚本串进 `sync:all-static`；
- **改内容流程**：改中文目录源文件 → `npm run sync:<name>` → `npx tsc --noEmit` → commit/push。**只改 public 副本会被下次同步覆盖。**

**多页站省模板的做法**：写 `assets/style.css` + `assets/app.js`，app.js 里维护一个 `STATIONS` 数组（id / no / 标题 / 分部），
由它注入顶部章节条、阅读进度、页内目录、上下篇、页脚免责；正文页只需 `<body data-ch="chNN">`，
新增或改章节名只动 app.js 一处。20 页手册整体约 440 KB，单页 15–30 KB，维护成本远低于每页内联导航。

跑 `npx tsc --noEmit` 通过后再提交。

### 3.45 内容读物站（非法律手册）：人文历史站已验证的写法（2026-10-03）
非实务手册类子站（人物志、读书笔记、专栏）不要照抄法律手册那套「法源基准 + 法条索引 + 红线清单」，
直接用「目录页 + 每篇独立页」：

- **配色自己带**：`assets/style.css` 里写全 `:root`（浅）+ `html[data-theme="dark"]`（暗）两套变量，
  **不走 `apply-theme-kit.py`**（那是给「改主站暗黑配色补丁」用的；新站要的是跟主站观感一致，
  变量表抄一个既有子站即可，如 `商事仲裁/assets/style.css`：金 #B89F6B / 浅底 #FDFCF9 / 暗底 #1C1C1E）。
  相应地 `sync:<name>` 脚本末尾**不要**串 `apply-theme-kit.py`，`theme:check` 那几个目录里也不需要加它。
- **布局 B 的简化骨架（推荐给内容站）**：`.layout{height:100dvh;display:flex;flex-direction:column;overflow:hidden}`
  + `header.topbar(flex:0 0 auto)` + `.row{flex:1;display:flex;min-height:0}` 里放
  `<aside id="side">` 与 `<div id="mainwrap">`。顶栏是 flex 首项就**不需要 JS 实测高度注入**。
- **app.js 只 `layout.insertBefore(topbar, layout.firstChild)`**，绝不 `body.innerHTML=''` 重建——
  会把 `<script src="/theme-toggle.js">` 抹掉，主题切换静默失效（这个坑很隐蔽，页面看着正常）。
- **`#side` 用 HTML 骨架里已有的那个 `<aside id="side">`**，JS 里再 `el('aside')` 新建的节点插不进 DOM，
  冒烟时 `#side a` 数为 0 却看不出别的问题。
- **目录页与文章页共用 app.js**：`body[data-p]` 有值 = 文章页（左栏 + 进度条 + 上下篇），
  无值 = 目录页（只注入顶栏 + 搜索过滤 `.cell`）。搜索过滤**只改元素自身 `display`**，
  改 `parentNode` 会在目录页把整个 `.grid` 藏掉。
- **jsdom 冒烟断言**：`#side a` = 人物总数、`#side a.on` = 1、`#pager a` 1~2、`#topbar` 存在、
  目录页 `.cell` = 总数。jsdom 里 `file:///theme-toggle.js` 报 Could not load script 属正常，线上有。
- **内容源里最容易脏的是英文残词**（`moral / Runnable / ideas / literally / Salt March / Emancipation` 之类），
  生成脚本里跑一条 `[A-Za-z]{3,}` 自检，白名单只留 `BBC` 这类允许混排的专有名词。

### 3.5 静态站布局选型（2026-09-19 定型）

两种模式，新建站默认选 **B**：

- **A · 顶部横向章节条**：页面随窗口滚动，顶部一排胶囊导航。章节 > 12 个就挤，已弃用。
- **B · 左侧固定目录栏（推荐，与保险站一致）**：顶栏 + 左侧目录栏（独立滚动）+ 主区（独立滚动）+ 右侧本页目录。
  - 骨架：`html,body{height:100%}` + `body{overflow:hidden}`；`.layout{display:flex;height:calc(100vh - 顶栏高)}`；
    左栏 `flex:0 0 280px;overflow-y:auto`，主区 `.main{flex:1;overflow-y:auto}`。
  - 顶栏高度**用 JS 实测后注入** `layout.style.height`，不要写死；`resize` 时重算。
  - 左栏按分部（PART I/II/III）分组，当前页高亮并 `scrollTop` 滚入可视区；底部可放「法源基准 / 可信度」小卡。
  - 左侧搜索框过滤章节：`STATIONS` 里要加 `kw` 关键词字段，否则简称（「撤裁」）搜不到全称章节（「申请撤销仲裁裁决」）。
  - 右侧本页目录：收集 `h2,h3` 自动生成 + 滚动高亮，`position:sticky`，≥1181px 显示；窄屏回落为页内目录块。**两种都生成，用 CSS 媒体查询切换，不要用 JS 判断**（JS 判断在 resize 后不会重排）。
  - `<1001px`：左栏变抽屉（`position:fixed;transform:translateX(-100%)` + 顶栏「目录」按钮），`body` 恢复 `overflow:visible`。
  - **滚动相关代码要同时监听 `main` 与 `window`**（宽屏滚 main、窄屏滚 window），否则窄屏进度条/scrollspy 失效。
- 多页站（每章一个 HTML）与 SPA（保险站 data.js 全量内嵌）都能用 B。多页站优点：直链可分享、单页 15–30 KB；SPA 优点：切章无刷新。**内容 ≥10 章且总量 >500 KB 时优先多页。**

**冒烟方式（无浏览器也能验）**：`npm i jsdom` 到 `~/.workbuddy/binaries/node/workspace`，脚本用
`JSDOM.fromFile(file,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true})` 断言侧栏链接数 /
当前高亮 / 右侧目录条目数 / 搜索命中数。注意 **jsdom 没有 `window.matchMedia`**，代码里必须写
`window.matchMedia ? window.matchMedia(q).matches : innerWidth >= N` 兜底，否则整页脚本直接崩。

## 四、git 踩坑（本仓库特有，必读）

- **本地禁止 `npm run build`**：会清空 `dist/`（含已发布资源）。只做 `tsc --noEmit`，构建交给 GitHub Actions。
- **`.git/*.lock` 在沙箱里删不掉**：每次 git 前先
  `python3 -c "import os;[os.remove(os.path.join(r,f)) for r,_,fs in os.walk('.git') for f in fs if f.endswith('.lock')]"`，add/commit/push 之间各清一次。
- **多会话并发改写（高优先级，已踩两次大坑）**：本站常有其他 WorkBuddy 会话同时改 `types.ts` / `navConfig.ts` / `App.tsx`。
  → **每次 Edit 前先 Read 最新内容**；改完 `grep -n "<slug>" src/types.ts src/navConfig.ts src/App.tsx` 逐处校验；Edit 返回成功不等于落盘（本次就遇到 import 编辑"成功"但实际没写进去，靠 tsc 才抓到）。
  → **致命模式**：并发会话若基于旧版这三个文件提交（如它只加了它自己的 tab），会把你的 `criminal`/`ai-law` 等**从 TabType 联合类型、subTabs、SUB_TAB_META、组件 import、isFullBleed、渲染条件全部删掉**。后果是：你的源码里有该 tab，但**线上从它那个 commit 构建的 bundle 根本没有这个 tab**（而 `public/<slug>/` 静态文件仍正常更新，造成"页面有内容、导航 tab 消失"的割裂观感）。**这不是缓存，是配置被冲掉。**
  → **恢复 SOP**：`git fetch` → 看 `git log a0..origin/main` 找到覆盖提交 → `git rebase origin/main`（纯静态文件改动不会冲突）→ 把被删的 slug 重新加回 types/navConfig/App 三处 → `npx tsc --noEmit` 零错误 → commit + push。
- **只 commit 自己的文件**：`git add src/... public/<slug>/`，不要把别的会话半成品一起提交。
- push：`git -c http.proxy= -c https.proxy= -c http.version=HTTP/1.1 push origin main`，443 连不上就重试或让用户自推。

## 五、验证上线（不要只看 push 成功）

```bash
BUNDLE=$(curl -s https://linqiongni.top/ | grep -o '/assets/[^"]*\.js' | head -1)
curl -s "https://linqiongni.top$BUNDLE" | grep -o 'id:"legal"[^]]*]'   # 数 subTabs 里有没有新 slug
curl -s "https://linqiongni.top$BUNDLE" | grep -o 'label:"中文名"'
curl -s -o /dev/null -w "%{http_code}\n" https://linqiongni.top/<slug>/
```
**必须查 `NAV_GROUPS` 数组里有没有该 slug**，只 grep 名字会命中 `SUB_TAB_META` 文案而误判。
线上看不到改版 = 缓存（`cache-control: max-age=600`），让用户硬刷或加 `?v=<时间戳>`。
**关键反例**：若本地源码三处都有 `<slug>`、tsc 也过，但**线上 bundle 里 grep 不到该 tab 的中文 label** → 不是缓存，是**被并发提交覆盖了**（见四节致命模式），按四节的 rebase+re-add 恢复 SOP 处理，不要只在本地反复改。

## 六、法律内容的硬规则

- **事实有据、法条可查、不确定即标注**。条号拿不准就写「××程序相关规定」并在页首声明「条号以现行有效官方文本为准」，绝不编条号。
- **开工第一件事：确认该领域现行法律文本版本**（2026-09-18 教训）。凭记忆写条号会整站作废——本次《仲裁法》已于 2025-09-12 修订通过、2026-03-01 施行（8 章 96 条），
  **撤销裁决期限由 6 个月改为 3 个月**（第 72 条），若按旧法写就是硬错。
  核实路径：`npc.gov.cn`（人大网公布文本）→ `gov.cn` / 司法部 → 人民网《人民日报》版面刊载的全文（可 WebFetch 整篇拿到逐条原文）→ 最高法官网核司法解释文号。
  同一领域的配套司法解释若已宣布将修订，页首与附录都要写「不抵触部分继续适用，引用前核对现行文本」。
- 修法在途的领域（如刑诉法第四次修改已列入立法规划）必须在总纲显著位置提示。
- 每个模块末尾放「红线清单 / 自检清单」——Andy 最认可这类可直接对照自查的产出。
- 站在 Andy 的身份（港企珠宝法务、非执业刑辩律师）补一段「给你的定位建议」，把通用知识落到他的真实场景。

## 七、静态页布局排错（血泪，2026-09-17 实测）

- **复制按钮必须闭合**：正确写法 `<button class="cp" onclick="cp(this)">复制</button>【正文…】`。
  批量生成 HTML 时极易漏 `</button>`，此时整段正文被塞进 `.cp`（`position:absolute` 的小按钮）→
  正文溢出、压住其他元素、`.pbox` 高度塌陷 → 用户看到「界面很乱、指令布局乱来乱去」。
  批量修法：`re.sub(r'(onclick="cp\(this\)">)(?!复制</button>)', r'\1复制</button>', s)`；
  然后用 `grep -c 'onclick="cp(this)">复制</button>'` 与总 pbox 数比对。
- **复制按钮会压住首行文字**：`.cp` 绝对定位在右上角时，首行末几字会被盖住 → 给 `.pbox` 预留
  `padding-top`（≈30px）或把按钮移到框外沿。
- **sticky 叠加**：页面已有 sticky 顶栏（`top:0;z-index:50`）时，别在内容区再放
  `position:sticky;top:52px` 的二级导航条——顶栏一换行变高就重叠。需要二级导航就让它普通定位。
- **本机没法截图验证**：Chrome `--headless` 被系统 SIGTERM（exit 137），`qlmanage` 报
  `sandbox initialization failed`。**改用结构自检代替截图**：核对 `div/details/summary/button`
  开闭标签数量是否相等、关键 class 计数、抽查片段；再让用户截图，Read 进来人工判读。
- **用户截图常是斜拍电脑屏**，左右的"截断"可能只是拍摄角度，别误判成横向溢出；先找结构性证据。

## 八、「跑出来」= 执行指令后的产出，不是指令本身（2026-09-17 澄清，踩了两次）

Andy 说「把第 X 天的指令跑出来」时，**不是**要你把指令文本显示出来，而是**要把那条 AI 指令真正执行一遍，把产出（答案 / 文书全文 / 填好的表格）嵌进页面**。
只显示指令（prompt）他会认为「没有内容」。这是本类"训练计划页"的核心交付物。

正确结构（每天一个 `<details>`）：
```
<details id="dNN">
  <summary>Day NN　标题</summary>
  <div class="meta">目标 / 精读 / 实操</div>
  <details class="ins"><summary>给 AI 的指令（点开复制）</summary><div class="pbox">…prompt…</div></details>
  <div class="out"> …跑出来的内容（默认可见）… </div>
  <div class="meta">自检 / 当日交付物</div>
</details>
```
- 指令折叠（`.ins` 子折叠，默认收起），产出（`.out`）直接可见 —— 同时满足「指令折叠」与「我要跑出来的内容」两个诉求。
- 用 `<details>` 天然实现「点击标题 → 当前页内展开，无需跳转」；再配一条吸顶日次导航 + 展开/收起全部。

**批量注入的两个坑（实测）：**
1. 给 pbox 包一层 `.ins` 用 `re.sub(r'<div class="pbox">(.*?)</div>', wrap, s, flags=re.S)` —— 非贪婪且 pbox 内无嵌套 div，安全；不会误伤 `.doc`/`.box`。
2. 嵌套后每天有**两个** `</details>`（.ins 的 + 天的）。插入 `.out` 必须锚定**该天的第一个 `</details>`（.ins 闭合）之后**；用 `s.index('</details>', start)` 会插错位置。用 `find` 取第一个即可。
3. 每批做完必做标签配对自检：`div/details/summary/table/tr/td/th/h4/h5/p/ul/li/button` 开闭数必须相等。

**术语统一**：内容块标题用「▶ 跑出来的内容」，与指令块「给 AI 的指令」明确区分，Andy 一眼就知道哪个是要读的、哪个是要投喂给 AI 的。

## 九、复制框与自检（2026-09-20 补，retail-ad 站实测）

- **style.css 不含 `.pbox` / `.cp` / `.dlg-note` / `.dmeta` 的样式**（融资法务、商业运营法务两站都没用复制框，故未定义）。
  从这两站复制 style.css 建新站、又要用「可复制条款框」时，**必须自行追加**。可用片段（已放进 `新零售与广告合规/assets/style.css` 末尾）：
  ```css
  .pbox { position:relative; margin:12px 0; padding:30px 16px 14px; border:1px solid var(--line);
    border-radius:10px; background:var(--bg-alt); font-size:14px; line-height:1.9; white-space:pre-wrap; }
  .pbox .cp, button.cp { position:absolute; top:6px; right:8px; font-size:11.5px; padding:5px 10px;
    border:1px solid var(--line); border-radius:999px; background:var(--card); color:var(--ink-2); cursor:pointer; }
  ```
  同时 app.js 需提供 `window.cp = function(btn){...}`（取 `parentNode` 文本去首行「复制」，clipboard 优先、execCommand 兜底）。
- **复制按钮笔误高发**：写成 `</button">`（多一个引号）时，后续正文被吞进按钮、button 标签数 3/2。
  正确写法只有一种：`<button class="cp" onclick="cp(this)">复制</button>`。

### 三件套自检（建站收尾必跑）
1. **标签配平**：`div/details/summary/table/thead/tbody/tr/td/th/ul/ol/li/button/p/h2/h3/h4/span` 开闭数必须相等（Python 正则统计，几十个文件也秒出）。
2. **脱敏扫描**：把任务里点名禁止的真实品牌 / IP / 产品名做成黑名单，`for w in words: if w in s` 全量扫一遍。
3. **jsdom 冒烟**：`NODE_PATH=~/.workbuddy/binaries/node/workspace/node_modules node smoke.cjs`，
   `JSDOM.fromFile(f,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true})`，
   断言 `#side a` 数量 = STATIONS 数、`#side a.on` = 1、`#pagetoc a` > 0、`#pager a` 1~2、`#topbar`/`#main` 存在。
   （jsdom 无 `matchMedia`，app.js 必须写 `window.matchMedia ? ... : innerWidth >= N` 兜底。）

## 十、广告 / 零售合规领域的法源版本（2026-09-20 核实）

这个领域法规更新极快，**写之前必须先核版本**，否则整站条号作废：
- 《反不正当竞争法》**2025-06-27 第二次修订、2025-10-01 施行**：虚假宣传第 9 条（罚则第 25 条）、商业诋毁第 12 条（第 28 条）、有奖销售第 11 条（第 27 条）、混淆第 7 条（含搜索关键词 / 新媒体账号名 / APP 图标）。**旧条号全变。**
- 《直播电商监督管理办法》**总局、网信办令第 117 号，2025-12-18 公布、2026-02-01 施行**（首部专门规章）：四类主体；第 16 条回放保存≥3 年、第 30 条事前合规审核、第 32 条价格促销、第 34 条禁虚假宣传与 AI 造假、第 37 条 AI 生成人物**持续**标识、第 44 条禁 MCN 组织虚假交易评价、第 63 条职务行为由单位担责。
- 《广告引证内容执法指南》（2026 年发布）：「大字吸睛小字免责」「萝卜坑赛道冠军」——地域<省级、行业<国标分类、无对应国标行标的「第一 / 最佳」**不适用豁免**。
- 《广告绝对化用语执法指南》（总局公告 2023 年第 6 号）第 4/5/6/7/9/11 条。
- 《广告法》仍是 **2021-04-29 第二次修正**版（无 2025 修订）；《互联网广告管理办法》令第 72 号（2023-05-01）；《明码标价和禁止价格欺诈规定》令第 56 号（2022-07-01，划线价规则在第 16、17 条）；《消保法实施条例》国务院令第 778 号（2024-07-01）。
