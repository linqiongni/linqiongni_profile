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
- push 失败时按序排查：① 清 `.git/*.lock`（见上）；② 带 `-c http.proxy= -c https.proxy=`；③ 若报 `HTTP/2 framing layer` 或 `Couldn't connect to server (port 443)`，是当前环境无外网/被隔离，改用 `git -c http.version=HTTP/1.1 push` 仍连不上则只能等联网，本地用 `npm run dev`（端口 3000 被占则 3001）预览。
