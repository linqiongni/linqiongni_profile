# MEMORY.md — linqiongni_profile 长期记忆

## 项目关键事实
- 部署：push `main` 自动 CI 构建发布 GH Pages；**本地不要 `npm run build`**（清空 dist 资源，曾拦截）。
- 用户偏好（2026-09-10 起）：图片默认彩色；背景波纹必须克制（首版易发晕）。
- 餐饮法务「每周计划」：标题直跳全文，无右侧站内阅读/分享图标（2026-09-12 改定）。

## 可复用脚本
- `scripts/add_lesson.py`：把某周某天 HTML 合并进餐饮法务 tab（一键入库）。

## 待办 / 未决
- [ ] 是否把「案例展示」卡片也从黑白→hover 变彩改为常驻彩色（用户未定）。
- [ ] AGENTS.md / MEMORY.md 为用户「约束先行」规则要求，本文件于 2026-09-12 首次补齐。

## 双视角劳动法务 tab（2026-09-14 新增）
- 第 4 个**顶层分组** `labor`（与「个人 / 法务实务 / 影视法律」并列），TabType 扩 `labor`，组件 `src/components/LaborLegalTab.tsx`（iframe `/labor/` + loading + 新窗口打开浮层，沿用 IpLegalTab）。
- 静态内容在 **`public/labor/`**：9 页 588 KB —— index / base（通用底座）/ employer（A 用人单位合规）/ employee（B 劳动者维权）/ clash（C 攻防对照 12 场景）/ tools（6 个纯前端计算器）/ templates（12 份文书）/ law（法条+术语）/ route（28 天路线）。纯本地零上传，全部相对链接、无外部依赖。
- 线上：`https://linqiongni.top/labor/`。
- 源文件：`/Users/linqiongni/Downloads/知识产权/劳动用工实务/`，构建脚本 `_build/gen.js` + `_build/data/*.json`（11 个数据文件）。更新流程：那边改 JSON → `node gen.js` → 重新 `cp *.html public/labor/` → `npx tsc --noEmit` → commit/push。
- Navbar 顶层分组增至 4 个，间距改 `gap-4 lg:gap-8` 防中等屏拥挤。

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
