# MIGRATION.md — 换机器 / 换账号怎么用

> 适用三种情形：换电脑（账号在）、换账号（机器在）、全换。
> 核心事实：**档案库在 git 里，所以 clone 就能带走。前提是——它已经被 push 过了。**

---

## 〇、先说当前状态（2026-09-27）

`process/` 已经在 git 跟踪内，但**尚未 push 到远端**（仓库现有的 push 都在等你点头才发）。

**这意味着现在换机器，档案库会丢。** 这是本文件的第一条行动项：**在换机器之前，先把 `process/` push 一次。**

自查：`git log origin/main -1` 能看到最近一次 push 的痕迹。看不到，说明还没推上去。

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

1. 确认 git 能推：`git push` 打个空包测试（没改动会报 "Everything up-to-date"，**不是错**，说明通了）。
2. 跑一次 `01-项目现状/workflows.md` 里的红线自检。
3. 读 `03-问题台账/OPEN.md`，挑一条认领。**别一次认领全部。**

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

症状统一是：`git push` 报错，但 `curl https://github.com` 正常。
**根因从来不是网络。** 三种不同的坑，症状长得一样，所以按顺序排查，别跳。

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

- 前者 `000`、后者 `200` → **本地代理（通常是 `127.0.0.1:<端口>`）挂了，直连是好的。**

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
| 2026-09-27 | 初版。含 git 推送排障四步（本仓库已踩三次）、冷启动验收、换账号的远端改写法 |
