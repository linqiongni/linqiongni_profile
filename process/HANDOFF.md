# HANDOFF · 断点卡

> **这份文件只回答一个问题：下一个接手的人，从哪儿接着干。**
>
> 它和另外两个文件容易混，边界先定死：
>
> | 文件 | 记什么 | 生命周期 |
> |---|---|---|
> | `HANDOFF.md`（本文件） | **此刻这个半成品的状态、思路、下一步** | 一件事从开始做到做完，期间一直更新；换主题就重写 |
> | `03-问题台账/OPEN.md` | 项目级、跨主题的问题（编号 `#01`–`#20`） | 长期累积，一条一条消化 |
> | `04-每日日志/` | 按天流水 | 一天一份，翻历史用 |
>
> **判断口诀**：想问「我现在该干什么」→ 看本文件；想问「还有什么坑没填」→ 看 OPEN；想问「那天到底发生了什么」→ 看日志。

---

> **当前状态**：在做的东西 = 档案库的「半途打包」机制（2026-09-27 下午填）
> **当前分支**：`main`（打包会另开 `wip/…`，不碰 main）
> **更新规则**：开工时先读；收工时如果今天动了代码，就更新一次。**没有人更新它，它就等于不存在。**

## 一、我在做什么

给 `process/` 档案库补上「半途打包」机制——让一个做了一半的功能能被完整带走：**代码 + 当前状态 + 下一步第一步**。起因是 Andy 问「开发一半的功能怎么打包上去，换个电脑能继续干」。

现在的形态：断点卡 `HANDOFF.md`（七节）+ 快照脚本 `wip-snapshot.py` + **一键打包脚本 `wip-pack.py`**（Andy 说一句话就能打包）+ 契约第七节（红线：只推 wip）+ 换机器开场白（`MIGRATION.md` 〇节）。

## 二、现在的状态

- 分支 / 最近提交：`main` / `a4d7522`（**线上已发布的就是这一版**）
- 代码能跑吗：能。全部改动只碰 `process/` 与 `scripts/`，这两处**都不进发布路径**（`dist/` 由 CI 构建），不影响 linqiongni.top
- 这次改了哪些文件：`process/HANDOFF.md`、`scripts/wip-snapshot.py`、`scripts/wip-pack.py`（新增）、`process/CONTRACT.md`（第七节）、`process/MIGRATION.md`、`process/README.md`
- **本卡尚未推送到远端**——下面第四节第一步就是把这批打包送出去

## 三、做完了 / 还没做完

- [x] 断点卡 `HANDOFF.md`（七节；含与 OPEN 台账 / 每日日志的边界表）
- [x] 现场快照脚本 `scripts/wip-snapshot.py`（中文路径不转义、清单去重、第七节之后内容不被覆盖）
- [x] 契约第七节「半途打包」+ 红线「绝不推 main」
- [x] 换机器开场白定型（`MIGRATION.md` 〇节）
- [x] 新 AI 实测走一遍流程，三轮反馈都落到文档里了
- [x] 空卡校验：断点卡关键节没填，快照/打包脚本直接拒绝（退码 2）
- [x] **把当前这批打包推到 `wip/20260927` 分支** —— 已推（两条提交：`8f6bc8a` 机制本体、`2b9e417` 脚本修复）。**main 仍是 `a4d7522`，线上没被碰过**
- [ ] 本地两个孤儿 stash（`stash@{0}` 含 09-17 日志、`stash@{1} wip-MEMORY`）与从未推送的分支 `save-visual-f276c11` 怎么处理（Andy 定，见 `03-问题台账/OPEN.md` #20；**换机器就永久消失**）
- [ ] 长期遗留（Andy 未点头）：动 `.gitignore` 让 `.workbuddy/` 入库、把 15 份历史日志搬进 `04-每日日志/`

## 四、下一步第一步

跑一键打包，把「半途打包机制」自己打包送出去：

```bash
python3 scripts/wip-pack.py -m "档案库半途打包机制：断点卡 + 快照脚本 + 一键打包 + 换机器开场白"
```

它会做四件事：校验断点卡填了没 → 刷新第七节现场快照 → 从 main 开 `wip/20260927` 并提交 → push 到远端，最后打印新机器上的恢复命令。跑完这条，本卡的接力棒才算真的交出去。

## 五、卡住的地方与备选方案

没有阻塞。备选方案若觉得 wip 分支太重：可以直推 main 再立刻 revert，但 CI 会白跑一次、且半成品会短暂出现在线上——**不推荐**，理由已写进契约第七节红线。

## 六、别碰

- `dist/` —— 本地构建产物，已被 gitignore，改它等于改线上
- `.workbuddy/` —— 未入库，且会被 sync 脚本误带进中文源目录
- 那两个孤儿 stash（`stash@{0}` / `stash@{1}`）与 `save-visual-f276c11` 分支 —— 从未推送到远端，**换机器就永久消失**，动之前先看 `OPEN.md` #20
- 当前这批未提交的改动 —— 它们就是「做了一半」的主体，别 stash、别 clean

## 七、现场快照（脚本生成，别手改）

_由 `python3 scripts/wip-pack.py` 自动写入_

- **抓于**：2026-09-27 14:52
- **分支**：`wip/20260927`
- **最近提交**：`2b9e417 2026-09-27 fix(wip): 用返回码判 git 成败（中文 locale 下成功也往 stderr 打 create mode）+ 修文件清单拼接粘连`
- **已暂存改动**：
_（无）_
- **未暂存改动**（含未提交的中途状态，**这些才是「做了一半」的主体**）：
- `process/HANDOFF.md`
- **未跟踪的新文件**：
_（无）_
- **今天（2026-09-27）动过的文件**：
- `AGENTS.md`
- `MEMORY.md`
- `process/01-项目现状/overview.md`
- `process/01-项目现状/sites-map.md`
- `process/01-项目现状/tech-stack.md`
- `process/01-项目现状/workflows.md`
- `process/02-决策日志/DECISIONS.md`
- `process/03-问题台账/OPEN.md`
- `process/03-问题台账/SOLVED.md`
- `process/04-每日日志/2026-09-27.md`
- `process/05-想法池/ideas.md`
- `process/05-想法池/拾遗.md`
- `process/06-复盘/M09.md`
- `process/06-复盘/W39.md`
- `process/CONTRACT.md`
- `process/HANDOFF.md`
- `process/MIGRATION.md`
- `process/README.md`
- `process/_templates/决策日志.md`
- `process/_templates/每日日志.md`
- `process/_templates/问题台账.md`
- `scripts/wip-pack.py`
- `scripts/wip-snapshot.py`
- `src/components/AquaticLuxuryBackground.tsx`

---

## 怎么把「做了一半的东西」打包带走

git 只带代码，**不带「我干到哪了、下一步是什么」**。半途换机器，你丢的是后者，而且当时不知道自己丢了。所以打包是两步，缺一不可：

**第一步：把状态写成文字**（就是本文件）

**第二步：把代码推上去**，且**只能推 wip 分支**——`deploy.yml` 配的是 `on: push: branches: [main]`，推 main 会触发构建并**把半成品发布到线上**。

**这两步现在是一条命令。** 在仓库根目录：

```bash
python3 scripts/wip-pack.py -m "在做什么的一句话"
```

脚本会依次做：校验断点卡填了没（没填直接退码 2，不给你偷懒）→ 刷新第七节现场快照 → 从 main 拉 `wip/YYYYMMDD` 并提交 → push 到远端 → 打印新机器上的恢复命令。它**没有 main 的出口**，想推 main 也推不出去。

想看清每一步在干什么、不想直接推：加 `--dry-run`（只看不改）或 `--no-push`（只 commit 不 push）。

> 为什么用 commit 而不是 `git stash`：stash 推不到远端，换机器就没了。commit 是唯一能送出去的「未完工」形态。到了新机器上想拆回来接着改：
> `git reset --soft HEAD~1` —— 改动全部回到工作区，一个不丢。

**换机器那边的开场白**（在 MIGRATION.md 〇节，这里抄一遍方便对照）：

```
我换了台电脑，继续开发 linqiongni_profile。
仓库已经 clone 到 /Users/linqiongni/Downloads/linqiongni_profile。
当前有一个做了一半的东西，状态在 process/HANDOFF.md，先读它。

开工前按顺序做四件事：
1. 读 process/CONTRACT.md —— 你的行为规则，含收工动作
2. 读 process/HANDOFF.md —— 半途状态、下一步第一步
3. 读 process/03-问题台账/OPEN.md —— 挑一条认领（署 Andy 的是等他拍板，别自己动）
4. 要动代码/发布文件，先读 process/01-项目现状/workflows.md（八条红线）

现在告诉我：接着做什么，以及你今天收工前会做哪五件事。
```

**别忘了分支**。wip 分支不在默认分支上，clone 下来是 `main`，要手动切：

```bash
git checkout wip/20260927     # 换成你自己那天的分支名
git branch -a                   # 确认远端分支真的带过来了
```

---

## 变更记录

| 日期 | 动作 |
|---|---|
| 2026-09-27 | 初版。起因：Andy 问「开发一半的功能怎么打包带走」。定死与 OPEN / 日志的边界；定 WIP 只能推 wip 分支（推 main 会发布半成品）；附一键打包命令与新机器 checkout 分支 |
| 2026-09-27 | 二版。打包从「手填卡 + 手敲四行」压成 `scripts/wip-pack.py` 一条命令（空卡退码 2）；分支名统一为 `wip/YYYYMMDD`；补 `--dry-run` / `--no-push`。实测空卡校验对「整节清空」「只留标题」两种情况都正确拒绝 |
| 2026-09-27 | 三版实跑。机制本体已推 `wip/20260927`（`8f6bc8a`）。实跑抓到脚本两个自身缺陷并修：① 用 stdout 判 git 成败 —— 中文 locale 下成功也往 stderr 打 `create mode …`，会把成功报成「建分支失败」并打印错提交信息；② 文件清单用 `+` 拼接多块文本导致粘连。**教训：调 git 一律看返回码，别看输出。** |
