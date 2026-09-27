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

## 二、现在的状态

- 分支 / 最近提交：`main` / `bd3231f`（**线上已发布的就是这一版**；本卡里的改动都还没提交）
- 代码能跑吗：能。本次改动只碰 `process/` 与 `scripts/`，这两处**都不进发布路径**（`dist/` 由 CI 构建），不会影响 linqiongni.top
- 这次改了哪些文件：`process/HANDOFF.md`（新增）、`scripts/wip-snapshot.py`（新增）、`process/CONTRACT.md`（新增第七节）、`process/MIGRATION.md`（开场白扩为五件事 + wip 分支切换）、`process/README.md`（索引表 / 阅读路径 / 任务路径三处挂载）

## 三、做完了 / 还没做完

- [x] 断点卡 `HANDOFF.md`（七节；含与 OPEN 台账 / 每日日志的边界表）
- [x] 现场快照脚本 `scripts/wip-snapshot.py`（已跑通：中文路径不转义、清单去重、第七节之后内容不被覆盖）
- [x] 三份文档挂载完成
- [x] 新 AI 实测走一遍打包流程（发现三个问题，正在修）
- [ ] 修复落盘：脚本加「前三节还是空模板就拒绝继续」的校验、`CONTRACT.md` 第七节文案修正——**就是下面第四步**
- [ ] 本地两个孤儿 stash 与一条从未推送的分支怎么处理（Andy 定，见 `03-问题台账/OPEN.md` #20）
- [ ] 长期遗留（Andy 未点头）：动 `.gitignore` 让 `.workbuddy/` 入库、把 15 份历史日志搬进 `04-每日日志/`

## 四、下一步第一步

把上面那两条「还没做完」修完并提交：① 给 `scripts/wip-snapshot.py` 加一道校验——`HANDOFF.md` 前三节若仍是空占位符，就拒绝生成快照并提示先填（现在缺的正是这道校验，实测里新 AI 明确指出「跳过填卡照跑后面四行，没有任何东西拦得住」）；② 修正 `CONTRACT.md` 第七节「四行」与实际五行对不上；③ 重跑脚本刷新第七节快照，再按第七节打包到 wip 分支。

## 五、卡住的地方与备选方案

没有阻塞。备选方案若觉得 wip 分支太重：可以直推 main 再立刻 revert，但 CI 会白跑一次、且半成品会短暂出现在线上——**不推荐**，理由已写进契约第七节红线。

## 六、别碰

- `dist/` —— 本地构建产物，已被 gitignore，改它等于改线上
- `.workbuddy/` —— 未入库，且会被 sync 脚本误带进中文源目录
- 那两个孤儿 stash（`stash@{0}` / `stash@{1}`）与 `save-visual-f276c11` 分支 —— 从未推送到远端，**换机器就永久消失**，动之前先看 `OPEN.md` #20
- 当前这批未提交的改动 —— 它们就是「做了一半」的主体，别 stash、别 clean

## 七、现场快照（脚本生成，别手改）

_由 `python3 scripts/wip-snapshot.py` 自动写入_

- **抓于**：2026-09-27 14:41
- **分支**：`main`
- **最近提交**：`bd3231f 2026-09-27 docs(process): 换机器开场白定型 + 契约补认领判据（第三次实测反馈）`
- **已暂存改动**：
_（无）_
- **未暂存改动**（含未提交的中途状态，**这些才是「做了一半」的主体**）：
- `MEMORY.md`
- `process/03-问题台账/OPEN.md`
- `process/CONTRACT.md`
- `process/MIGRATION.md`
- `process/README.md`
- **未跟踪的新文件**：
- `process/HANDOFF.md`
- `scripts/wip-snapshot.py`
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
- `process/MIGRATION.md`
- `process/README.md`
- `process/_templates/决策日志.md`
- `process/_templates/每日日志.md`
- `process/_templates/问题台账.md`
- `src/components/AquaticLuxuryBackground.tsx`

---

## 怎么把「做了一半的东西」打包带走

git 只带代码，**不带「我干到哪了、下一步是什么」**。半途换机器，你丢的是后者，而且当时不知道自己丢了。所以打包是两步，缺一不可：

**第一步：把状态写成文字**（就是本文件）

**第二步：把代码推上去**，且**只能推 wip 分支**——`deploy.yml` 配的是 `on: push: branches: [main]`，推 main 会触发构建并**把半成品发布到线上**。

```bash
# 本次打包（在仓库根目录）
python3 scripts/wip-snapshot.py                    # 生成第七节现场快照
# 然后照 HANDOFF 前三节填完，再执行下面四行
git checkout -b wip/$(date +%Y%m%d)                # 从 main 拉一条，不碰 main
git add -A
git commit -m "wip: <一句话描述在做什么>"
git push -u origin wip/$(date +%Y%m%d)             # push 前若失败，按 MIGRATION.md 第三节排障
```

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
git checkout wip/2026-09-27     # 换成你自己那天的分支名
git branch -a                   # 确认远端分支真的带过来了
```

---

## 变更记录

| 日期 | 动作 |
|---|---|
| 2026-09-27 | 初版。起因：Andy 问「开发一半的功能怎么打包带走」。定死与 OPEN / 日志的边界；定 WIP 只能推 wip 分支（推 main 会发布半成品）；附一键打包命令与新机器 checkout 分支 |
