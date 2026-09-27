# MIGRATION.md — 多设备共用 / 换机器 / 换账号怎么用

> 主场景是 **Andy 两台设备来回用**（2026-09-27 澄清），换机器只是其中一瞬。
> 核心事实：**档案库在 git 里，所以 clone 就能带走。前提是——它已经被 push 过了。**
> **这套配置只有一条命令要装**：`bash scripts/setup-device.sh`——装 hook 是唯一不跟着仓库走的东西。

---

## 零、新设备上你要做的三件事（这一节是给 Andy 看的，复制即用）

仓库 clone 得走，**自动同步 hook 带不走**——它不进 git。所以下面第 2 步每条设备都要跑一次，
这是一次性动作，跑完就永久生效。

| # | 做什么 | 花多久 |
|---|---|---|
| 1 | clone 仓库 | 一次 |
| 2 | 跑 `bash scripts/setup-device.sh` | 一条命令，约 10 秒 |
| 3 | 把开场白贴给 WorkBuddy | 一次 |

### 1 · clone

```bash
git clone https://github.com/linqiongni/linqiongni_profile.git
cd linqiongni_profile
```

### 2 · 一条命令装好自动同步

```bash
bash scripts/setup-device.sh
```

它会**装完当场自检六项**（入口 hook 在不在 / 可执行 / 核心脚本语法 / 有 remote / 有上游），
有一项不过就红字指出，不糊弄你。通过之后：进目录自动拉最新、`git commit` 自动推，收工只需 `git commit`。

> 别用一个不存在的路径：`scripts/setup-device.sh` 必须**先被 push 过**，新设备才 clone 得到。
> 2026-09-27 实测踩过——新设备上报 `No such file or directory`，因为它只是本地新建、还没推。

### 3 · 开场白（直接整段复制）

> 开场白已抽成独立文件 **`process/开场白.md`**，那里是唯一维护版（含换设备要先跑的两行 clone）。
> 这里保留原段落只为向后兼容，别再改它——改就改 `开场白.md`。

```
我换了台设备，继续开发 linqiongni_profile。
仓库已经 clone 到 <新设备上的路径>。

开工前按顺序做四件事：
1. 读 process/CONTRACT.md —— 你的行为规则，含收工动作
2. 读 process/README.md —— 项目是什么、现在挂了什么没解决
3. 读 process/03-问题台账/OPEN.md —— 挑一条认领（署 Andy 的是等他拍板，别自己动）
4. 要动代码/发布相关，先读 process/01-项目现状/workflows.md（八条红线）

现在告诉我：这次接手要接着做什么，以及你今天收工前会做哪几件事。
```

最后那句「**以及你今天收工前会做哪几件事**」别删。实测：删掉它 AI 照样会做那几步——
契约本身是硬的；区别只在它会不会**主动汇报**。**那句买的是你的知情权，不是它的自觉。**

### 关于用户级记忆与技能（Andy 2026-09-27 决定：暂不纳入同步）

`~/.workbuddy/` 下的 `MEMORY.md` / `SOUL.md` / `IDENTITY.md` / `USER.md` / `skills/` **不在 git 里**，
clone 带不走。上一版这份清单要求手工 `tar` + `scp` 搬运，Andy 明确表示**先不折腾**：
习惯在两台设备上用久了本来就一样，为它单独建私密仓库反而是给自己找事。

要重新启用时，往 git 里塞一份就行（仓库位置待定，公开仓库不能直接放）：

```bash
tar czf ~/workbuddy-user.tgz ~/.workbuddy/MEMORY.md ~/.workbuddy/SOUL.md \
    ~/.workbuddy/IDENTITY.md ~/.workbuddy/USER.md ~/.workbuddy/skills
```

## 〇、先说当前状态（2026-09-27 更新）

`process/` **已经 push 到远端**（18/18 文件入库，本地与远端 tree 一致）。换机器 `git clone` 就能完整带走。

**自查**（每次迁移前跑一行）：

```bash
git diff --stat origin/main main   # 有输出 = 还有没推的
```

> 这条原本写着「尚未 push，现在换机器档案库会丢」，2026-09-27 的实锤是：push 过，但网络一度不通，本地领先一个 commit。**文档过时比没有文档更危险**——它让你以为还没保险，其实早上了。改完任何状态描述，顺手回来改这里。

---

## 一、常规迁移（换电脑，账号不变）

档案库在仓库里，不需要单独拷。真正要搬的是**凭据和环境**。

```bash
# 1. 新机器上把仓库拉下来
git clone https://github.com/<你的账号>/linqiongni_profile.git
cd linqiongni_profile

# 2. 让接手的 AI 按顺序读这三份
#    process/CONTRACT.md  → 它该怎么干活（行为规则）
#    process/README.md    → 项目是什么 + 现在挂了什么没解决
#    process/03-问题台账/OPEN.md
```

**机器搬得走，环境搬不走。** `node_modules` 不入库（`npm install` 重建），`dist/` 不入库（CI 构建，本地构建反而会清空 `dist/`，红线见 `01-项目现状/workflows.md`）。

### 新机器第一次开工的固定动作

1. **`bash scripts/setup-device.sh`** —— 装自动同步（不装就得手动 push，还会漏掉自动 rebase）。自检不通过它会红字指出是哪一项。
2. 确认 git 能推：`git push` 打个空包测试（没改动会报 "Everything up-to-date"，**不是错**，说明通了）。
3. 跑一次 `01-项目现状/workflows.md` 里的红线自检。
4. 读 `03-问题台账/OPEN.md`，挑一条认领。**别一次认领全部。**

---

## 二、换账号（机器在，人换了 / 权限换了）

只有两样东西会跟着人走：git 远端地址、GitHub 权限。

| 要换的 | 怎么换 |
|---|---|
| 远端从 A 账号换到 B 账号 | 仓库 **fork** 到 B，然后 `git remote set-url origin https://github.com/B/linqiongni_profile.git` |
| 权限回收后想留副本 | 先 `git clone --mirror` 一份备份到本地，再处理权限 |
| 想换个仓库名 | `git remote set-url origin` 改 URL，**历史不会断**，commit 只认 hash |

**注意**：`process/01-项目现状/sites-map.md` 里记的线上地址是 `linqiongni.top`，换账号不影响域名（`CNAME` 在仓库里），但**仓库的所有者**变了之后，GitHub Pages 的构建来源也要跟着改 `.github/workflows/deploy.yml` 里的 permissions。这条只在真换账号时才动，平时别碰。

---

## 三、git 推不动的排障（这个仓库已经栽过三次，按顺序查）

症状统一是：`git push` 报错。但**根因可能有五种，其中一种是真网络问题**。按顺序排查，别跳，别靠眼看 curl 的结果。

### 第一步：看有没有空的代理配置

```bash
git config --global --get-regexp proxy
```

- 输出里有 `http.https://github.com.proxy ` **后面是空的**（不是没有这一行）→ 它会覆盖环境变量里的代理，强制直连，而直连被拦。
- 修：`git config --global --unset http.https://github.com.proxy`

### 第二步：看 UA 有没有被本地代理拦

```bash
git config --global http.userAgent
curl -x $HTTPS_PROXY https://github.com && echo OK
```

- `curl` 通、`git push` 502 → 是 git 的默认 UA 被代理按 UA 规则拦了。
- 修：`git config --global http.userAgent "curl/8.7.1"`

### 第三步：看 HTTP 版本

- 症状：`CONNECT tunnel failed, response 502`，或 `Error in the HTTP2 framing layer`。
- 根因：git 默认走 HTTP/2，在某些 CONNECT 代理隧道下会被拒。
- 修：`git config --global http.version HTTP/1.1`

**现行有效组合**：`http.userAgent = curl/8.7.1` + `http.version = HTTP/1.1`。两条一起设，别只设一条。

### 第四步：本地代理挂了（2026-09-27 实际踩到，症状最迷惑）

症状：`git push` 报 `Empty reply from server`，而前三步配置全对。

判定方法（**一次判定，别靠眼看**）：

```bash
curl -s -o /dev/null -w "走代理: %{http_code}\n" https://github.com
curl -s -o /dev/null -w "绕过代理: %{http_code}\n" --noproxy '*' https://github.com
```

- 前者 `000`、后者 `200` → **本地代理（通常是 `127.0.0.1:<端口>`）挂了，直连是好的。** 用下面那行 `env -u` 绕过代理推。
- **两条都是 `000` → 网络层的问题，不是代理也不是配置。** 等一会儿重试，还是不通就让 Andy 自己在终端跑 `git push`。别在配置上瞎试。

> **2026-09-27 补充（本仓库第二次遇到）**：这种「两条都 `000`」在本仓库是**周期性**的，隔十几分钟到几十分钟会自己恢复，期间 push 一律失败。
> 前面四步的配置（HTTP/1.1、userAgent、代理）**早就验过了，是好的**，此刻再去动它们只会浪费时间。**正确动作只有两个：等一会儿重试，或者让 Andy 自己在终端跑。**
> 判断依据就上面那两行 curl——它们比 `git push` 的报错可靠，报的是同一个根因。

解法（直连是通的，直接绕过代理推）：

```bash
env -u HTTPS_PROXY -u https_proxy -u HTTP_PROXY -u http_proxy git push origin main
```

**这是真·第五种情况**：前三步都是配置错，这一步是环境问题，周期性复发。
看到 `000` 先别急着重试十分钟——先跑上面那两行 curl 分清是代理挂了还是网络断了。

> 这四条写在这里，是因为它们**换机器后大概率会复现一次**。新机器上第一次 push 失败，先回来查这张表。

---

## 四、迁移完成后的验收

搬完了别就算了，跑一遍冷启动测试——**这是检验「换人/换 AI 能不能接住」的唯一硬指标**：

1. 让新接手的 AI（或新开一个 agent）**只读 `process/README.md`**，不让它扫目录。
2. 问它五个问题：
   - 这个项目是干什么的，发布在哪？
   - 现在挂着哪些没解决的，最该先动哪个？
   - 上个月在干什么？
   - 深色配色怎么定的，为什么选那套色？
   - 要新增一个子站 tab 走哪几步？
3. 统计：几个能答、几个要跳读、几个答不出。
4. 有答不出的 → **补 README，别骂接手的人**。README 的验收记录在第 `七` 节，当时的结论是「不合格」才逼出来的月度复盘、任务路径、视觉速查三处补充。

**四次全过，才算迁移真的成功。** 只搬了文件、没跑这个测试，等于没验证。

---

## 五、常见误区

| 误区 | 事实 |
|---|---|
| 「档案库在本地，拷过去就行」 | 现在确实能（就是个文件夹），但那就没进版本控制。必须 push。 |
| 「换机器先跑 `npm run build`」 | **本地禁 build**，会清空 `dist/`（含已发布的 `lessons/`）。构建交给 CI。 |
| 「换机器要重新配 AI 的记忆」 | 不用。记忆在 `process/` 里，clone 就有了。要配的是「让 AI 先读 `process/CONTRACT.md`」这个动作。 |
| 「先 push 代码，档案库下次再说」 | 档案库是**过程**记录，落后一次就缺一天，攒着补不回来。 |

---

## 版本记录

| 日期 | 改了什么 |
|---|---|
| 2026-09-27 | 初版。含 git 推送排障四步、冷启动验收、换账号的远端改写法 |
| 2026-09-27 | 二版：〇节状态改为「已 push」（原文写「尚未 push」已过时）、排障表补「两条都 000 = 网络断」分支。起因是 13:50 推不动，实测两条 curl 均 000 |
| 2026-09-27 | 五版：排障表补「两条都 000 是周期性的，别动配置，等或自推」。本仓库第二次遇到该症状（同日 14:5x） |
| 2026-09-27 | 四版：开场白扩为五件事（插入 `HANDOFF.md`）；补 wip 分支切换说明。起因是 Andy 问「开发一半的功能怎么打包带走」——**推 main 会触发 CI 发布半成品** |
| 2026-09-27 | 七版：整份文档从「换机器」改写为**多设备共用**（Andy 明确是两台来回用，换机器只是其中一瞬）。清单定成三件事：clone / `bash scripts/setup-device.sh` / 贴开场白；新增「用户级记忆暂不同步」一节并说明理由。起因是他要「换个设备时自动 push/pull 能立马装上」——那就必须把「装」这一步做成一个自带自检的命令，而不是一段说明 |
| 2026-09-27 | 六版：换机器清单从「三件事」补成「四件事」——新增第 2 步 `bash scripts/install-git-hooks.sh`。起因是 Andy 要求「每个电脑都要自动有 pull/push」，而 hook 不进 git，clone 到新机器必然丢失，之前这份清单漏了它，照着做会漏掉整套自动同步。开场白同步改为四件事
| 2026-09-27 | 五版：补 `scripts/wip-pack.py` 一键打包（一句话完成「校验断点卡 → 刷新快照 → 开 wip 分支 → commit → push」）。起因是 Andy 问「我怎么让它把当前状态打包上去」，机制建好后最后一公里还是要手填卡 + 手敲命令——这是一条命令能解决的部分 |
| 2026-09-27 | 三版：新增〇节「换机器三件事」——用户级文件 `~/.workbuddy/` 四样（MEMORY/SOUL/IDENTITY/USER/skills）不在 git 里，clone 带不走，附 tar+scp 命令；开场白定型并附实测反馈。同批改契约开工清单补「认领判据」表 |
