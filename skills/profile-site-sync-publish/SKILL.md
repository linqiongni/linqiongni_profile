---
name: profile-site-sync-publish
description: linqiongni_profile 仓库里静态站点（融资法务/商事仲裁/婚姻家事/身边的英语/劳动法务）改完源文件后，同步到 public/<slug>/ 副本并推 GitHub Pages 上线。当用户说「改了页面看不到」「同步一下」「发布到主页/上线」或改完某个静态站源文件时使用。
agent_created: true
---

# 静态站点三层同步与上线

## 为什么需要这个 skill
Andy 会存在**改了源文件却"看不到"**的情况。原因几乎从来不是缓存，而是这个站有三层，漏掉任意一层就看不到：

```
源站Downloads/linqiongni_profile/<站点中文名>/   ← 在这里改
  ↓ npm run sync:<slug>
部署副本  linqiongni_profile/public/<slug>/        ← least mentioned，最容易漏
  ↓ git commit + push main
线上      https://linqiongni.top/<slug>/           ← GitHub Actions 自动构建，1–2 分钟
```

**排查顺序（用户说"没看到"时按这个走）**：
1. `ls -la` 源文件，确认大小/时间真的变了；
2. `ls -la public/<slug>/` 同名文件，大小不一致 → 没跑 sync；
3. 两者都变了 → 没 push（或 Actions 还在跑）；
4. **线上 curl 已能 grep 到新内容，用户还是说看不到** → 进入下面《缓存与折叠》一节，这是第 4 层，比前三层更常被漏。

## 缓存与折叠（第 4 层，最容易反复踩）
三层都对但用户仍看不到，只可能是这两个原因：

**A. 资源没加版本号 → 浏览器命中旧 CSS/JS。**
融资法务站曾全部页面裸引 `assets/style.css`，新增样式类（`.sim`）在旧 CSS 里不存在，视觉上等于没改。
- 静态站每个 HTML 的引用要带版本：`href="assets/style.css?v=20260919b"`、`src="assets/app.js?v=20260919b"`（婚姻家事站已采用同样做法，改版号时整批替换）。
- **iframe 里嵌的静态站（主页 tab）还要给 iframe src 加穿透参数**，否则主站重新构建后 iframe 仍用旧内容。做法（已用于 `src/components/FinancingLegalTab.tsx`，日期粒度即可，不必手改）：
  ```tsx
  const IFRAME_V = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  <ThemeIframe src={`/financing-legal/index.html?v=${IFRAME_V}`} ... />
  ```
- GitHub Pages 对 HTML/CSS 发 `cache-control: max-age=600`，只对 10 分钟内有效；加版本号才是根治。

**B. 新增内容全在 `<details>` 里且默认收起 → 页面表面看不出任何变化。**
用户看到的是"页面和以前一样"，因为新东西都折叠着。新增重要内容时，把**第一块**设成默认展开（`<details ... open>`）作示范，其余保持收起并在页首说明"点顶部「展开全部」按钮"。ch03 已按此处理（黑话对照表 + 对话 01 默认展开）。

排查命令：
```bash
grep -c '<details class="dlg" open>' <file>     # 默认展开几块
grep -o 'style.css?v=[0-9a-z]*' <file>          # 有没有版本号
curl -s https://linqiongni.top/<slug>/<file> | grep -c '关键字'   # 线上内容层确认
```
告诉用户时用**硬刷新**：Cmd+Shift+R（Mac）。

## 站点 → 同步命令对照

| 源目录 | 部署副本 | 命令 |
|---|---|---|
| `融资法务/` | `public/financing-legal/` | `npm run sync:financing` |
| `商事仲裁/` | `public/arbitration/` | `npm run sync:arbitration` |
| `婚姻家事与遗产继承/` | `public/family-law/` | `npm run sync:family-law` |
| `身边的英语/` | `public/english/` | `npm run sync:english` |
| — | `public/labor/` | 无源目录，直接改 public 副本 |

全部同步：`npm run sync:all-static`。命令都在 `linqiongni_profile/package.json`，工作目录必须是仓库根。

## 英语站（`身边的英语/`）的特殊之处：内容与壳分离

它比别的站多一层，改内容时只动一个文件：

```
身边的英语/index.html   ← 布局 + 播放引擎（改样式/交互才动）
身边的英语/scenes.js    ← 内容数据（PARTS 分组 + SCENES 短文数组）；加一篇只追加一条
```

**版本号必须透传，否则出现「新 HTML + 旧 scenes.js」→ 白屏。** `EnglishTab.tsx` 给 iframe src 挂 `?v=YYYYMMDD`；站内 index.html 里的加载器再把 `?v=` 原样加到 `scenes.js` 上：

```js
var m = location.search.match(/[?&]v=([^&]+)/);
s.src = "scenes.js" + (m ? "?v=" + m[1] : "");
```

加新站点走同一模式时照抄这段。`scenes.js` 加载失败要有可见提示（`s.onerror`），不要静默白屏。

### 逐批追加内容时先跑 `npm run check:english`
`scenes.js` 的 `SCENES` 是**手写追加**的，最易出的两类错都「不显眼」：批次块**漏/多逗号**（整个站白屏），以及 **`place` 用了 `GROUPS` 里没登记的 id**（页面看不出异常，只是少了一个地点分组）。写内容批次前后各跑一次：

```bash
npm run check:english   # = node scripts/check-english-scenes.cjs，非 0 退出即有问题
```
它顺带打印两个视角的分组计数，可直接和页面目录对照。
**另一条铁律**：新写一条 `place` 必须同时在 `GROUPS` 里加一个 `by:"place"` 的组；加「重阳」这类新类型必须加到对应组的 `kids` 里。

## 改完怎么自测（静态站没有构建步骤，最容易「改了没验」）

纯静态站 `npm run build` 只能证明主站能编译，证明不了子站能跑。三层验证：

1. **jsdom 冒烟**（抓运行时白屏/报错，比肉眼可靠）：起 `python3 -m http.server 8899`（在 `public/` 下），用 jsdom 加载页面，断言元素数量 + 点击交互 + 收集 `alert`/`error`：
   ```bash
   NO_PROXY=127.0.0.1,localhost NODE_PATH=~/.workbuddy/binaries/node/workspace/node_modules \
     node smoke.js     # jsdom 装在 managed node workspace
   ```
   注意 jsdom 没有 `speechSynthesis` / `Element.scrollTo`，要打桩，否则误报。
2. **agent-browser 截图**：`agent-browser open <url>` + `agent-browser screenshot /tmp/x.png`，然后 **Read 这张图亲眼看**（浅色 + 深色各一张；深色用 `document.documentElement.setAttribute('data-theme','dark')` 切换）。
3. **窄屏**：agent-browser **没有 resize 命令**。在 `public/` 下临时放一个 `_mobtest.html`，里面塞 `<iframe style="width:390px;height:820px" src="/slug/index.html">`，打开它截图即可模拟窄屏；**测完必须删掉这个临时文件**。

## rsync 临时文件会污染 public/

rsync 在写入时会在目标目录留 `.index.html.XXXXXX` 这类点开头的临时文件，`git add public/<slug>` 会把它们一起提交（历史上真的发生过）。sync 后固定清一遍：

```bash
python3 -c "import os;d='public/<slug>';[os.remove(os.path.join(d,f)) for f in os.listdir(d) if f.startswith('.') and len(f)>1]"
```

## 铁律
1. **永远改源站 `Download/linqiongni_profile/<站点中文名>/`，不要直接改 `public/` 副本** —— 下次 sync 会被覆盖。例外：`public/labor/` 无源目录，直接改。
2. **`AGENTS.md` / `MEMORY.md` / `.workbuddy/` 不得发布到公网**。`sync:financing` 已加 exclude；给新站点写 sync 脚本时务必带上同样的 exclude。检查方法：
   `ls public/<slug>/ | grep -E "AGENTS|MEMORY|workbuddy"` → 应无输出。
3. **push = 对外公开发布**，属于需要 Andy 确认的外部动作。改完源文件都应先跑 sync + 本地预览，再问「要不要推上线」，不要顺手 commit。**例外：Andy 当次明确说了「不用问、直接跑/直接上线」时，按他的话直接改完就推**（本次英语站重做即如此）。
4. 仓库里常有**其他会话遗留的 staged改动**（labor、family-law 等未提交历史）。push 会把它们一起发出去，提交前先 `git status --short` 看一眼，必要时只 add 本次相关文件。
5. **这个仓库常有并发会话在改**（同一天多个 WorkBuddy 会话）。你编辑期间别的会话可能执行全量 `git add .` 并 push，把你的改动一起带走 —— 内容通常不会丢，但 commit 归属会乱，也可能把你没写完的中间状态提交上去。因此：commit 前先 `git log --oneline -3` 看有没有新提交；只 `git add` 自己改的路径；push 后必须 `git show origin/main:<file> | grep '关键字'` 确认线上版本含你的最新改动（本次英语站就出现过「我的改动被别的会话随它的 commit 一起推走」）。

## push 前必须做的两件事

**1. 查暂存区有没有大文件。** GitHub 单文件硬上限 100MB，超过会直接拒收。
踩过：`视频号策划与运营/06-资产素材/` 里混进 148MB mp4 + 65MB mov。
```bash
git diff --cached --name-only | while read -r f; do
  sz=$(git cat-file -s ":$f" 2>/dev/null || echo 0)
  [ "$sz" -gt 1000000 ] && echo "$((sz/1048576))MB  $f"
done
```
发现有视频/压缩包/导出文件：先 `git rm -r --cached <dir>`，再把该目录或 `*.mp4` `*.mov` 写进 `.gitignore`。仓库根目录 `.gitignore` 已加这两条 + `*.kdtmp`。

**2. 处理 git 残留锁。** 这个仓库里 git 写操作会留下 `.git/index.lock` 和 `.git/refs/remotes/origin/main.lock`，之后所有命令报「Unable to create index.lock / File exists」。
解法：`rm -f .git/index.lock .git/refs/remotes/origin/main.lock` 再重试；git 命令要在**解除沙箱**下执行（`ps` 在沙箱里也被禁，无法确认残留进程，但通常无进程在用）。

## 上线后的确认
- **GitHub 会间歇性连不上（2026-09-19 实测）**：`git push` 报 `Failed to connect to github.com port 443 ... after 75001 ms`，但同一时刻 `curl -s -o /dev/null -w "%{http_code}" https://github.com` 可能返回 200 —— 不是代理问题（`git config --list | grep proxy` 为空、`scutil --proxies` 无系统代理），是到 github.com 的网络本身时通时断。**不要改代理配置，也不要放弃**，用循环重试（每轮之间隔 10s）：
  ```bash
  for i in 1 2 3 4 5 6; do
    git push origin main && break
    [ "$(git rev-parse --short HEAD)" = "$(git rev-parse --short origin/main)" ] && break
    sleep 10
  done
  ```
  实测第 3 轮成功。**同一时段 agent-browser 打不开 linqiongni.top（页面标题变成 `linqiongni.top`、元素查询全 0，就是浏览器的代理错误页）**——此时别把「浏览器打不开」当成部署失败，改用 `curl` 验内容层，两者走不同的网络路径。
- push 后 Actions 构建约 1–2 分钟。`.github/workflows/deploy.yml`：push main → `npm ci` → `npm run build`（vite，输出到 dist）→ Pages。
- 机器没有 `gh` CLI，用 `git ls-remote origin main` 确认远端已到目标 commit；内容层用
  `curl -s https://linqiongni.top/<slug>/<file> | grep -c '关键字'` 验证。
- 线上地址走自定义域 `https://linqiongni.top/<slug>/`。用户反馈看不到时，先问清楚他看的是**本地预览**还是**线上**。
- 按用户偏好：不要说「内容已上线」，直接陈述「已 push（commit xxx），linqiongni.top/<slug>/ 返回 200，文件 N 字节」。

### 改的是 React 组件（不是静态站）时，怎么证明确实生效
静态站可以 grep HTML；**改了 `src/` 下的组件要验 bundle，而且很容易误报**。踩过：为确认融资法务 tab 关掉了「新窗口打开」浮标，在线上 bundle 里 grep `openUrl:null` → 命中，但那是**别的 tab（FilmLaw/Insurance/Startup）本来就写的同样的值**，旧 bundle 一样命中，等于什么都没证明。

正确姿势两步：
1. **先看 bundle 哈希变没变**（哈希不变 = Actions 还没跑完或没部署，此时任何 grep 都无意义）：
   ```bash
   curl -s "https://linqiongni.top/?ts=$(date +%s)" | grep -o '/assets/index-[A-Za-z0-9_-]*\.js' | head -1
   ```
   轮询到哈希与改动前不同再继续（约 20–60 秒一变，最长 2 分钟）。
2. **再在包里定位目标字符串，取上下文判断 props**（不要只数出现次数）：
   ```bash
   curl -s https://linqiongni.top/assets/index-<hash>.js | python3 -c "
   import sys; s=sys.stdin.read(); i=s.find('financing-legal/index.html')
   print(s[max(0,i-120):i+220] if i>=0 else 'NOT FOUND')"
   ```
   期望看到 `{src:\`/financing-legal/index.html?v=...\`,title:\"融资法务 · 从 0 到 1\",darkMode:i,openUrl:null}`。

### iframe 内静态站的「全屏 / 交互按钮」该放哪一层
**结论：能放静态站自己就别放父级**（2026-09-19 融资法务「全屏」按钮）。理由三条：
1. `ThemeIframe` 的浮层是**绝对定位在内容区右上**，会**压住静态站自己的顶栏按钮**（融资法务是深浅色 ☾ 与「目录」）；
2. 放在静态站里，**直接访问 `linqiongni.top/<slug>/` 也有这个按钮**，父级方案只在 iframe 内存在；
3. 改一处 `assets/app.js`（顶栏是脚本注入的）就全站 14 页都有，不用碰 React。

配套两点，漏一个就不生效：
- 父级 iframe 必须加 `allow="fullscreen"`，否则 iframe 内 `requestFullscreen()` 被拒；
- 静态页每次改 `assets/*.css|js`，必须把**所有 HTML 的 `?v=xxxx` 升位**（脚本批量替换），否则旧 HTML 会继续引用旧 assets。

**iframe src 版本号取到小时**：`slice(0,13)`（原按天 `slice(0,10)`）。同一天改完静态站，src 不变 → 浏览器命中旧正文 HTML → 旧 HTML 引用旧 `assets/app.js` → 新功能"看不到"。这是改 iframe tab 时最隐蔽的一层缓存。

### 冒烟自测：jsdom 起本地服务（静态站改共享 assets 时必做）
改了 `app.js` / `style.css` 这种**全站共用**文件，jsdom 比肉眼可靠：
```bash
cd public && python3 -m http.server 8891 >/dev/null 2>&1 &   # 端口避开别人占用的 8899
NODE_PATH=~/.workbuddy/binaries/node/workspace/node_modules node /tmp/smoke_fs.js
```
脚本要点：`JSDOM.fromURL(..., {runScripts:'dangerously', resources:'usable', pretendToBeVisual:true})` + `VirtualConsole` 收集 `jsdomError`；断言注入元素存在、父节点/顺序正确、`dispatchEvent(new MouseEvent('click'))` 后无报错。jsdom 没有 `requestFullscreen`，点击会走"此浏览器不支持全屏"分支——**这是预期的，不代表线上有问题**。

**浮层按钮归属速查**（用户说「正文多了个按钮」时先分清是哪一个）：
- 右下角金色胶囊「新窗口打开」= `src/components/ThemeIframe.tsx`，去掉方法：该 tab 传 `openUrl={null}`（默认 undefined 时显示，地址=src 且点击重载 iframe）。
- 正文**右上角**（`top:56px right:16px`）深浅色小浮标 = iframe 页引了 `/theme-toggle.js`；去掉它别顺手删 `postMessage` 监听，否则主站主题同步失效。

用户侧永远要**硬刷新**（Cmd+Shift+R）才拿得到新 bundle。

**「我这边改完了，用户说没看到」的最后一层原因（2026-09-19 实测）**：改 React 组件后，旧 bundle 会被清空（旧 `index-xMs0fYoa.js` 现在 **404**，新 `index-8Ni7Mvxs.js` 200，`index.html` 已指向新包）。但用户的浏览器若**同时缓存了旧 index.html 和旧 bundle**，页面**不会报错也不会白屏**——它会照旧跑旧代码，用户看到的就是"什么都没变"。只有硬刷或走带参数的 URL（`https://linqiongni.top/?v=<时间戳>`）才会绕开。
判断顺序：
```bash
curl -s https://linqiongni.top/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1   # index.html 指到哪
curl -s -o /dev/null -w "%{http_code}\n" https://linqiongni.top/assets/<旧bundle>  # 404 = 新包已上线
```
两条都对却仍"没看到" → 100% 是用户侧缓存，别再回头改代码。

**agent-browser 在多会话并行时会串台**：本仓库常有另一个会话开着本地预览（如 `127.0.0.1:8899/english/`），`tab new` + `open <线上URL>` 后 `tab list` 可能仍显示别人的 localhost 页，`eval` 会打到错误的 frame（表现：上一句还能列出导航按钮，下一句 `querySelectorAll` 返回空）。浏览器验证不了就别硬撑，直接用 curl 验 bundle（更可靠）。
