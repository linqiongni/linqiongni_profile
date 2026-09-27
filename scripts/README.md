# scripts/ 统一说明

这个目录放**不进构建、只被人手动执行**的工具。构建产物一律不入库（`public/` 里的才是发布物）。

## 主题补丁管线（2026-09-27 建立，问题台账 #21 的根治方案）

子站的暗黑配色不是写在 `style.css` 里的，是四个「补丁块」被手工塞进每个 HTML：

| 块 | 位置 | 作用 |
|---|---|---|
| `DARK_UNIFY_START` | `</head>` 前 | 强制覆盖暗黑配色变量 |
| `SUB_THEME_KIT_START` | `</head>` 前 | 引 `/theme-light.css` |
| `AQUATIC_BG_KIT_START` | `</body>` 前 | 鱼影背景层（print 类页面跳过） |
| `SUB_THEME_BRIDGE_START` | `</body>` 前 | 主题切换桥 |

**为什么必须有脚本**：这四个块只存在于 `public/`，中文源目录里没有。`rsync` 一旦用源覆盖
同名 HTML，块就被抹掉，那个子站暗黑模式当场消失——不报错、线上照样 200。

**用法**：

```bash
npm run sync:financing          # 单站同步，rsync 之后自动补打补丁
npm run sync:all-static         # 全量同步 + 收尾体检
npm run theme:apply             # 只对缺补丁的页面补齐（不动已有内容）
npm run theme:unify             # 连内容过时的旧块一起刷新为最新版
npm run theme:check             # 只体检，不写盘；不干净时退出码为 1
```

**规矩**：中文源目录保持「纯净内容」，不要手工往源目录 HTML 里塞补丁块。
补丁只由 `scripts/apply-theme-kit.py` 打进 `public/`，否则又会分叉。

**改配色时**：改 `scripts/theme-kit/dark_unify.navy.txt` 再跑 `npm run theme:unify`，
全站一次到位。`theme-kit/` 下的文件是 golden copy，别只改 `public/` 里的某一页。

## 其他脚本

| 脚本 | 干什么 | 什么时候用 |
|---|---|---|
| `install-git-hooks.sh` | 装 git 自动同步 hook（进仓库/切分支自动拉，commit 后 rebase + 推） | **新设备唯一要做的事**：`bash scripts/setup-device.sh` |
| `setup-device.sh` | 装 hook + 自检六项 | 换电脑 / 新 clone 后跑一次。hook 不进 git，clone 不带 |
| `verify-online.sh` | 验线上内容有没有真的生效 | 收工前：`bash scripts/verify-online.sh <slug或URL> "关键文本" --wait 120`；`--push` 只验推送 |
| `wip-snapshot.py` | 抓半途开发现场快照 | 配合 `wip-pack.py` |
| `apply-theme-kit.py` | 主题补丁注入/体检 | 见上 |

## 镜像远端（Gitee 备份，2026-09-27 加入）

hook 默认只推主远端（GitHub）。要**每次 commit 顺带推一个镜像远端**（例如 Gitee 私有库当备份）：

```bash
git remote add gitee https://gitee.com/<用户名>/<仓库名>.git
git config autosync.extraremote gitee     # 不想要了删掉这行即可
```

- 只用一个远端时保持这行 config 为空，hook 会跳过镜像步骤。
- 镜像用显式 refspec（`HEAD:refs/heads/<branch>`）推，不依赖镜像远端上有 upstream。
- Gitee 那类国内远端常常不吃代理，hook **第一次就绕开环境变量试**，失败才走默认。
- **主远端成、镜像挂是最危险的部分成功**，hook 会单独 warn「主远端推成功了，但 gitee 没推上去」，
  不会混进「push ok」里。报 `repository not found` 时还会提示去 Gitee 上建仓库。
- 换设备时这条 config 不会被 clone 带过来，装完 hook 要自己再配一次。

**另一个仓库是 partial clone（`blob:none`）**：本地没有完整 blob，首次推镜像远端时 git 会
回头找 GitHub 补对象。推之前先 `git fetch origin --refetch` 拿全量更稳，免得在断网边缘卡住。

## 「餐饮加盟法务」课程页流水线（问题台账 #22 的实测结论）

三个脚本是一套，产物落在 `public/lessons/`（发布目录，线上可直接打开）：

```
fetch_space_lessons.py  从 WorkBuddy 空间批量抓课程 HTML → public/lessons/{nodeId}.html
wire_lessons.py         把 nodeId 列表写进 CateringLegalTab.tsx 的 LOCAL_LESSON_IDS
add_lesson.py           单页新增课程（复制 HTML + 插条目 + 加 id + 打印后续命令）
```

- 文件名一律用空间 nodeId（唯一稳定），或 `weekNN-dayN` 形式。
- `LOCAL_LESSON_IDS` 决定哪些课程走站内文件 `/lessons/{id}.html`，其余走线上链接。
- `add_lesson.py` **不自动 commit/push**，等确认后再执行。
- 这组产物留在 `public/` 是有意设计（站内免登录阅读），**不是**误发布；不用下掉。

## 写脚本踩过的坑（别再踩）

- bash 变量名不能紧邻非 ASCII：`「$NEEDLE」` 会被读成 `NEEDLE」`。一律写 `${VAR}`。
- BSD grep 不支持 `a\|b`，一律 `grep -E "a|b"`。
- Python 里用 `%` 拼正则时，`"%s_START" % "A|B|C"` 的后缀只挂到最后一项上。
  要写成 `"|".join(x + "_START" for x in items)`。
- 改 `package.json` 这类 JSON 要用 `json.load` 复核一次合法性，别信「写入成功」。
- 调 git 一律看返回码，不看 stdout（中文 locale 下成功也往 stderr 打东西）。
- **`git rev-list --left-right --count A...B` 的输出是「A 独有 B 独有」**，不是「本地远端」。
  `origin/main...HEAD` 打印 `0 2` 意思是本地领先 2 个（左边 0 = 远端没有本地没有的东西）。
  方向反着读会得出完全相反的结论，2026-09-27 有过一次误报「本地落后 2 个提交」。
