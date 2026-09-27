# 已解决问题 · SOLVED

目标不是"记一笔"，是**半年后有人踩同一个坑，搜到这一段就能立刻知道自己错在哪**，而不是重新排除一遍。

每条写：根因 / 解法（能照做的程度）/ 验证方式 / 同类预防。

---

### #07 · 本地 `npm run build` 会清空 dist（2026-09 之前）

- **现象**：本地跑 `npm run build`，`dist/` 里的子站 HTML 全没了（曾触发删除拦截）。
- **根因**：`vite build` 默认 `--emptyOutDir`，而 `dist/` 里有 356 个**已发布**的 HTML（不是构建产物，是手工放进去的子站）。
- **解法**：本机**永远不 build**，构建交给 GitHub Actions。本地只用 `npx tsc --noEmit` 校验类型。
- **验证**：`ls dist/ | wc -l` 应该是个不小的数；变成 0 就说明被清了。
- **预防**：见 `01-项目现状/workflows.md` 红线第 1 条。

---

### #08 · 编辑工具报「成功」但没落盘，同一天踩三次

- **现象**：用编辑工具改文件，回执是成功；`grep` 一查没变。2026-09-19 英语站 CSS 批量替换 7 处只落 3 处，App.tsx 也中过 2 次。
- **根因**：本仓库（以及并发会话）下，工具回执不可信。**多行、大块、跨行的编辑最脆弱。**
- **解法**：批量改 CSS/TSX 一律用 Python 写盘，且写盘前后断言：
  ```python
  s = io.open(p, encoding='utf-8').read()
  assert a in s
  io.open(p, 'w', encoding='utf-8').write(s.replace(a, b))
  ```
- **验证**：写完立刻 `grep -c` / `grep -n` 逐条核对，**不信工具回执**。
- **预防**：`01-项目现状/workflows.md` 红线第 4 条。

---

### #09 · 本仓库 `.git/*.lock` 删不掉，git 直接报 index.lock 存在

- **现象**：`git` 操作后残留 `.git/*.lock`，且**它无法被 git 自己 unlink**；下次任何 git 命令都报 `Unable to create index.lock: File exists`。
- **根因**：文件系统/沙箱对 `unlink` 的限制，与代码无关；bash 的 `rm -f` 同样被拒。
- **解法**：每次 git 前用 Python 递归清锁，add / commit / push 之间各清一次：
  ```bash
  python3 -c "import os;[os.remove(os.path.join(r,f)) for r,_,fs in os.walk('.git') for f in fs if f.endswith('.lock')]"
  ```
- **预防**：`01-项目现状/workflows.md` 红线第 5 条。需免沙箱执行。

---

### #10 · push 完成但线上看不到改动

- **现象**：curl 返回的 bundle 已是新的，但浏览器里还是旧页面。
- **根因**：GH Pages 响应头 `cache-control: max-age=600` + `x-cache: HIT`；浏览器缓存了旧 `index.html`，而它引用的还是旧 bundle hash。
- **解法**：按序排查，不要一上来就刷页面——
  1. 拿线上实际引用的 bundle：`curl -s https://linqiongni.top/ | grep -o '/assets/[^"]*\.js' | head -1`
  2. 查 bundle 内容是否含你的改动
  3. 已上线却看不到 → 用户侧硬刷（Cmd+Shift+R），或加 `?v=<时间戳>` 绕开
- **预防**：站内没有 service worker，不用查 SW。

---

### #11 · 验证「新 tab 上线了」时误判成功

- **现象**：在 bundle 里 grep 到新 tab 的名字，以为上线了，其实导航没渲染。
- **根因**：**`SUB_TAB_META` 里有名字，不代表 `NAV_GROUPS` 数组里也有。** grep 会命中中文案常量而误判。
- **解法**：取 bundle 中 `id:"legal"`（以及 `practice` / `film`）起的那一段，数 `{id:...subTabs:[...]}` 里的项。
- **预防**：见 `01-项目现状/workflows.md` 第三节。

---

### #12 · iframe 地址写目录路径，本地看起来"里面是主页"

- **现象**：`src="/ip/"` 在本地 dev 下被 SPA 兜底成首页，本地验证完全失真；线上 GH Pages 反而正常。
- **根因**：Vite dev 的 SPA fallback 会接管目录路径。
- **解法**：iframe 地址一律写显式 `index.html`（`/ip/index.html`）。
- **预防**：`01-项目现状/workflows.md` 红线第 3 条。

---

### #13 · 根节点文件被 rsync 发布到线上

- **现象**：`.workbuddy/`、根 `README` 之类被同步进了子站目录，发布到公网。
- **根因**：`npm run sync:english` 是**整目录 rsync**，源目录里有什么就发什么。
- **解法**：中文源目录里不放 `.workbuddy/`、`.gitignore` 之类的机器文件；`sync:financing` 已显式 `--exclude` 掉 `README.md`/`AGENTS.md`/`MEMORY.md`/`.workbuddy`，其他 `sync:*` 脚本按需补 exclude。
- **预防**：往中文源目录里放任何东西之前，先想一句"这个要不要发布"。

---

### #14 · 缩写注记里嵌缩写，扫描脚本嵌套出重复乱码

- **现象**：批量插入 `18C（……HKEX Listing Rules……）` 这类注记后，再次扫描时 HKEX 被命中，嵌套插入重复内容。
- **根因**：注记文本本身含有未注记的裸缩写，被下一次扫描当成正文。
- **解法**：注记里要么拼全称（`Hong Kong Exchanges and Clearing Limited`），要么把注记整体排除出扫描范围。
- **侧记**：插入时必须跳过 HTML 标签 / SVG text / 属性——首个非标签出现处才算正文首次出现。

---

### #15 · 鱼影"慢速漂移"实际很快，压 VMAX 没用

- **现象**：想让鱼慢慢游，把速度上限 `VMAX` 压到 1/2.5，结果毫无变化。
- **根因**：**没有阻尼。** 速度只增不衰减，几帧就顶到上限；稳态速度 ≈ 力/(1−阻尼)。没有阻尼时，`VMAX` 根本约束不住。
- **解法**：先加每步阻尼 `DAMP = 0.95`，再调力度。
- **验证**：改完观察稳态速度是否 ≈ 力/(1−DAMP)。
- **预防**：任何"我调了参数但没变化"的动效问题，先查有没有阻尼，别先压上限。

---

### #16 · 冒烟脚本在 jsdom 里整页报错

- **现象**：用 jsdom 跑静态页冒烟，所有脚本都报错。
- **根因**：jsdom 没有 `window.matchMedia`（很多响应式代码直接调它）。
- **解法**：代码里兜底 `window.matchMedia ? ... : innerWidth`；冒烟方式：
  `NODE_PATH=~/.workbuddy/binaries/node/workspace/node_modules node`，`runScripts:'dangerously'`，断言侧栏链接数 / 高亮 / 右侧目录条目 / 搜索命中。

---

### #17 · `raw.githubusercontent.com` 有 CDN 缓存

- **现象**：想通过 raw 地址确认线上文件内容，拿到的是旧的。
- **解法**：判断远端真实状态用 `git fetch origin` + `git show origin/main:<path>` 或 GitHub API `/commits/main`。

---

### #18 · 并发会话回退已提交的编辑

- **现象**：多个会话同时操作本仓库（2026-09-14 有会话在推餐饮法务第 11/12 周），已提交的编辑可能在磁盘上被回退。
- **解法**：改完**立即 grep 逐处校验**，不要只信工具返回成功；跨多行的大块编辑优先改成单行写法；push 前先 `git fetch` 确认无分叉。
- **预防**：这条与 #08 是同一个病根——**不要相信任何一次写入的回执。**

---

### #19 · git push 报 `Empty reply from server`（本地代理挂了）

- **现象**（2026-09-27 全环境都过了一遍才碰到）：`git push` 报 `Empty reply from server`，
  而 `git config` 里 proxy / userAgent / http.version 全是对的。
- **根因**：**本地代理 `HTTPS_PROXY=http://127.0.0.1:<端口>` 挂了**，不是网络、不是配置。
  环境变量里的代理指向了一个已经失效的端口。
- **解法**（一次判定，别靠眼看）：
  ```bash
  curl -s -o /dev/null -w "走代理: %{http_code}\n" https://github.com          # 000 = 代理挂了
  curl -s -o /dev/null -w "绕过代理: %{http_code}\n" --noproxy '*' https://github.com  # 200 = 直连好的
  env -u HTTPS_PROXY -u https_proxy -u HTTP_PROXY -u http_proxy git push origin main
  ```
- **教训**：`git push` 失败但 `curl` 正常，**症状只有一个，根因却有四种**（空 proxy 配置 / UA 被拦 / HTTP2 被拒 / 代理挂了）。
  排障必须走 checklist，不靠直觉。完整四步在 `MIGRATION.md` 第三节。
- **预防**：这也说明 `MIGRATION.md` 的排障表要**写实测案例、不能凭记忆写**——这张表当初漏了「代理挂了」这一条，
  才让这次多绕了一圈。

---

### #21 · 子站主题补丁只打在 public/，sync 后暗黑模式会消失 —— 已根治（2026-09-27）

- **根因**：四个主题补丁块（`DARK_UNIFY` / `SUB_THEME_KIT` / `AQUATIC_BG_KIT` / `SUB_THEME_BRIDGE`）
  只存在于 `public/<slug>/`，中文源目录里没有，且**全库没有任何注入脚本**，纯手工。
  `rsync` 用源覆盖同名 HTML 时，块连着文件内容一起被抹掉。
- **附带发现**：`public/` 里那套补丁是**旧苹果黑 v1**（`#1C1C1E` 系），与 2026-09-22 定稿的
  深海军蓝口径（`#091A2E` 系）不符——也就是说线上 8 个子站一直是旧配色，只是没人发现。
- **解法**：建立 `scripts/apply-theme-kit.py` + `scripts/theme-kit/`（golden copy），
  并接进每条 `sync:*`：`rsync ... && python3 scripts/apply-theme-kit.py public/<slug>`。
  新增 `theme:apply` / `theme:unify` / `theme:check` 三条命令。默认只补缺失，`--fix` 才刷新旧版。
- **验证**：跑 `npm run sync:arbitration` 复现——rsync 抹掉块，脚本补回 1 份（不叠加），
  块数 = 1；`npm run theme:check` 对 8 站 122 个 HTML 全部通过；标签配平自检 0 异常。
- **预防**：中文源目录保持纯净，补丁只由脚本打进 `public/`；改配色改
  `scripts/theme-kit/dark_unify.navy.txt` 后跑 `npm run theme:unify`。详见 `scripts/README.md`。

---

### #22 · public/lessons/ 92 个课程页 —— 核实为有意设计，不用下掉（2026-09-27）

- **结论**：这批页面不是误发布。它由 `fetch_space_lessons.py` → `wire_lessons.py` 整套流水线
  产生，落到 `public/lessons/{nodeId}.html`，再被 `CateringLegalTab.tsx` 的 `LOCAL_LESSON_IDS`
  引用走站内免登录阅读。没有 `navConfig.ts` 里的 tab 是因为它是**内容**，不是导航条目。
- **处置**：保留。流水线已写入 `scripts/README.md`，下次加课程照那条走，不必重新调研。
- **隐私**：已复核，命中 qq/微信/邮箱/手机的案例全在 `data-page-node-id` 随机串里，无泄露。



---

### #20 · 本地独有的未推送 git 对象 —— 已清理完毕（2026-09-27）

- **stash**：两条均已处理。`stash@{0}`（09-18 融资法务案例库 + 港股新规）内容已落地
  （`融资法务/ch13-cases.html` 存在，ch10 四个港股关键词全部命中），**丢弃**；
  `stash@{1}`（09-16 `wip-MEMORY`，视频号定位 v2 / 公司法律 AI 选型 / 香港法例数据纪律）
  是独家决策，**抢救进 `process/05-想法池/2026-09-15-视频号定位与公司法律AI搭建决策.md`**，
  原 patch 存 `process/_stash-归档/`。两条都已 `--check` 验证可重放。stash 列表现为**空**。
- **分支 `save-visual-f276c11`**：Andy 拍板不用上线（线上深海军蓝版挺好），已删除本地分支，
  内容存档在 `process/_存档/visual-2026-09-15/`（README + 三个组件原文 + 可重放补丁）。
  决策见 `02-决策日志/DECISIONS.md` #09。
- **远端始终只有 `origin/main`**，未产生新的本地独有对象。
