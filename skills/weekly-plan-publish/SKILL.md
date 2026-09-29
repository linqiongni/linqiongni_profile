---
name: weekly-plan-publish
description: 把新生成的「第 N 周第 M 天」HTML 课程合并进个人主页 linqiongni_profile 的「餐饮法务」tab 并推送上线（linqiongni.top）。当用户说「把这个合并进去 / 加到养成计划 / 第 X 周第 Y 天发布 / 同步到主页」，或给一个 HTML 路径 / conversationId 要求合并时使用。
agent_created: true
---

# 周课程 HTML → 个人主页发布

把在任意对话里生成的单篇课程 HTML，合并进个人主页的「餐饮法务」tab，并推到 GitHub Pages 上线。
目标：**用户只说"合并进去"，其余全自动**。

## 关键路径（常量，直接用）

| 项 | 值 |
|---|---|
| 本地仓库 | `/Users/linqiongni/Downloads/linqiongni_profile` |
| 远程 | `https://github.com/linqiongni/linqiongni_profile.git`（main） |
| 线上 | `https://linqiongni.top`（GitHub Pages，Source=GitHub Actions，push 即自动部署 1–2 分钟） |
| tab 组件 | `src/components/CateringLegalTab.tsx`（餐饮法务 / 第 7 个 tab） |
| 第 8 个 tab | `src/components/LogisticsLegalTab.tsx`（跨境物流法务），静态内容在 `public/logistics/`：`index.html` = 24 周养成计划，`W1/*.html` = 第 1 周 6 篇。源目录 `/Users/linqiongni/Downloads/涉外法务总监养成计划/` |
| 课程存放 | `public/lessons/{nodeId}.html`（**文件名必须用 ASCII**，中文路径在 Pages 上有编码坑） |
| 另一个 tab | 「养成计划」= `public/development-plan.html` 的 iframe，别混淆 |
| 批量抓取脚本 | `scripts/fetch_space_lessons.py`（抓 WorkBuddy 空间全部课程） |
| 接入脚本 | `scripts/wire_lessons.py`（把已抓 id 写入 LOCAL_LESSON_IDS） |
| npm | `/Users/linqiongni/.workbuddy/binaries/node/versions/22.22.2-3/bin/npm`（**node 版本目录是 `22.22.2-3`，不是 `22.22.2`**；写错会 `no such file or directory`。node 同理为 `.../22.22.2-3/bin/node`） |
| 构建 | 沙箱下 `npm run build` 可能静默无输出 → 改跑 `node node_modules/vite/bin/vite.js build` 拿真实输出；lint 用上面的 npm 路径跑 `npm run lint` |
| Python | `/Users/linqiongni/.workbuddy/binaries/python/versions/3.13.12/bin/python3` |
| 内容产出目录 | `/Users/linqiongni/Desktop/AI agent/餐饮加盟/`（新生成的 HTML 通常在这） |

## 🚀 一键合并（首选）

用户给了 HTML 后，直接跑脚本，它会完成复制 + 加 Set + 加周条目（自动按周序）：

```bash
cd /Users/linqiongni/Downloads/linqiongni_profile
<python3> scripts/add_lesson.py \
  --src "/Users/linqiongni/Desktop/AI agent/餐饮加盟/xxx.html" \
  --week 10 --day 2 --title "供应链食安条款设计" [--theme "该周主题"] [--id 自定义id]
```
- 周已存在 → 追加到该周 lessons 末尾；周不存在 → 新建周并按周序插入（不会插到末尾）。
- 脚本**不自动 commit/push**，跑完后按它打印的命令执行校验与推送。
- 周末实战用 `--day 6`。

## 标准流程（手动，脚本异常时用）

### 1. 定位内容
- 用户直接给 HTML 路径 → 直接用。
- 用户给 `conversationId` / traceId → `grep -rn "<conversationId>" ~/Desktop/AI\ agent/mac-泥行文习惯知识库/04-每日日志/*.md -B5 -A10`，日志里会写明该会话产出了哪个文件。
- 若该会话被 429 限流打断（日志里会出现"使用量已超出频率限制"），产出可能不完整，先确认文件已生成。

### 2. 复制到 public/lessons/
```bash
cp "<源 HTML>" /Users/linqiongni/Downloads/linqiongni_profile/public/lessons/<nodeId>.html
```
- 该天**已有 nodeId**（周表里存在）→ 用原 id 覆盖。
- **新增的天** → 起一个语义 id，如 `week10-day2`，两周以内不会和空间 22 位 nodeId 冲突。

### 3. 改 `CateringLegalTab.tsx`（三处）
```ts
// a) 周数据：把该天加进对应周（没有该周就新建）
{ title: '第 10 周第 2 天 · <主题>', id: 'week10-day2' },

// b) 加进本地课程集合（决定能否站内免登录阅读）
const LOCAL_LESSON_IDS = new Set([ ...原有..., 'week10-day2' ]);
```
- **新增整周时，必须按周序插入**（第 9 周插在第 8 周之后、第 13 周之前）。追加到数组末尾会导致顺序错乱、用户找不到——这是踩过的坑。
- 渲染不用改：`hasLocalLesson(l.id)` 为 true 就自动渲染成「站内阅读」按钮 + ↗ 新窗口直链。

### 4. 校验（必做）
```bash
cd /Users/linqiongni/Downloads/linqiongni_profile
<npm> run lint     # tsc --noEmit
<npm> run build    # 确认 dist/lessons/<id>.html 存在
```
本地 dev server 在 3000 端口；若没跑：`cd 仓库 && <npm> run dev`（后台）。

### 5. 提交并推送
```bash
git add -A && git commit -q -m "feat: 新增第 N 周第 M 天（<主题>）"
git -c http.proxy= -c https.proxy= push origin main
```
**必须带 `-c http.proxy= -c https.proxy=`**（本地 127.0.0.1:1082 代理对 git 会返回 502）。
踩坑：传大文件（课程总量已 4.7MB）会 75s 超时。处理：
```bash
git config http.postBuffer 524288000
for i in 1 2 3 4; do git -c http.proxy= -c https.proxy= push origin main && break; sleep 5; done
```
github.com 直连偶发 8 秒失败（api.github.com 正常），重试即可成功，不是仓库问题。

### 6. 验证上线
```bash
curl -sI https://linqiongni.top/lessons/<id>.html | grep -i "HTTP/\|content-type"
```
线上首页引用的 JS 必须是最新 hash（与本地 `dist/assets/index-*.js` 一致）。

## 必踩的坑（务必遵守）

1. **新周插错位置** → 用户"找不到/打不开"。按周序插，不追加末尾。
2. **阅读面板在周表上方**，点击后必须滚动（已用 `readerRef` + `scrollIntoView` 实现，别删）。
3. **中文文件名** → 一律转 ASCII（`week09-day1.html` 这种）。
4. **TypeScript**：`WEEKS` 已显式标注 `Week[]` / `Lesson`，新增字段要同步类型，否则 `l.localHtml` 之类会因部分元素缺字段而报错。
5. **用户说"点了没反应/打不开"** → 先怀疑**浏览器缓存旧版 JS**。判据：若每条课程右侧有金色「站内阅读」标签 = 新版；只有箭头 = 旧版。让用户 `Cmd+Shift+R` 硬刷新。别一上来就改代码。
6. **iframe 显示空白**的排查顺序：Content-Type 是否 `text/html` → 是否有 frame-busting（`top.location`）→ 抓取的 HTML 是否含可见正文（去掉 script 后 body 文本长度）。

## 批量抓取 WorkBuddy 空间课程（补充能力）

空间的课程页本身需登录，但**静态产物在公开 CDN**，免登录可下载：
```
https://workbuddy-space-static.codebuddy.work/page/{nodeId}/{version}/{path}
```
流程：`connect_open_platform` 取 `op_` token → `page/list_page_artifacts.py --node-id` 取 path → curl 下载到 `public/lessons/{nodeId}.html` → 用 `scripts/wire_lessons.py` 写入 LOCAL_LESSON_IDS。
已验证：61 篇全部成功、零外部依赖、正文完整（唯一缺失的 `/page/page_comm/inject.js` 不影响显示）。

## 验收清单
- [ ] `npm run lint` 通过、`npm run build` 通过
- [ ] `dist/lessons/<id>.html` 存在
- [ ] 本地 `curl -o /dev/null -w "%{http_code}" http://localhost:3000/lessons/<id>.html` → 200
- [ ] 已 push 到 main，线上 `https://linqiongni.top/lessons/<id>.html` → 200
- [ ] 周表里该条显示「站内阅读」标签，位置在正确的周序上

## 新增一个「课程站」tab 的标准做法（跨境物流法务，2026-09-12 已验证）
1. `src/types.ts` 的 `TabType` 加联合类型；`src/components/Navbar.tsx` 的 `TABS` 加 `{id,label,enLabel}`；
   `src/App.tsx` 加 import + 页内 tab 条一项 + `{activeTab === 'xxx' && <XxxTab />}`。
2. 大份静态 HTML 放 `public/<slug>/index.html`（Vite 原样拷贝，线上即 `https://linqiongni.top/<slug>/`），
   子页面放 `public/<slug>/W1/` 等子目录；**文件名一律 ASCII**（`W1-weekend.html`，不要写「周末实战」）。
3. **Tab 组件直接内嵌计划本体（用户明确要求：点 tab 即见，不要门面页二次跳转）**：
   - 组件 = 「极窄工具条 + iframe」：工具条只放标题、一行副标题、重新加载、新窗口打开；
     iframe `src="/<slug>/"`，`height: calc(100vh - 190px)`、`minHeight: 720px`、`w-full`、圆角边框，带 loading 遮罩。
   - `App.tsx` 加 `const isFullBleed = activeTab === '<slug>'`，命中时 main 去掉 `max-w-7xl` 与 `py-16`，
     改 `px-4 sm:px-6 pt-10 pb-8`，让 iframe 通栏。
   - 闭环：iframe 内点某天「在本页打开」→ 框架内进内容页 → 内容页「← 返回学习计划」指向 `../index.html` → 回到 `/<slug>/`。
   - 不要在 Tab 里再堆统计卡 / 路线图 / 卡片墙——计划主页本身已有，重复即冗余。
4. `npm run lint`（tsc --noEmit）→ `npm run build` → 确认 `dist/<slug>/...` 存在 → commit → push（带 `-c http.proxy= -c https.proxy=`）。
5. 验证：`curl -s https://linqiongni.top/<slug>/ | grep -o "<title>..."`；首页 JS 里 grep 新 tab 文案确认已上线；
   GitHub Pages 不发 X-Frame-Options，同源 iframe 可直接嵌套（可用 python urllib 查响应头确认）。
6. 踩坑（linqiongni_profile 仓库在 ~/Downloads 下，git 锁无法自清）：
   `rm -f .git/index.lock` 与 git 自身的 unlink 都会被拒，必须用 Python 递归删 `.git` 下所有 `*.lock`，
   且 add / commit / push 之间**各清一次**；整段需免沙箱执行。
   `vite build` 清 dist 会 EPERM → 用 `npm run build -- --emptyOutDir=false`。
7. 踩坑：沙箱下 `npm run build` 可能**静默无输出**（看似 exit 0 实际没跑，dist 未更新），改用
   `node node_modules/vite/bin/vite.js build` 直跑（必要时免沙箱）拿到真实输出，
   再 `ls dist/<slug>/` 确认产物真实存在后再 commit。
