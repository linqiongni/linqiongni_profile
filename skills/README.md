# skills/ — 本仓库专属技能（跟着 git 走）

> **这里才是真源。** `~/.workbuddy/skills/` 里的同名目录是**软链**，指向本目录。
> 改技能一律改这里；不要直接编辑 `~/.workbuddy/skills/<name>/` 下的副本——它不进 git，换台电脑就没了。

**新设备**：`bash scripts/setup-device.sh` 会自动把这里的技能软链进 `~/.workbuddy/skills/`（已纳入自检）。

## 一览

| 技能 | 什么时候会触发 | 管什么 |
|---|---|---|
| `fixed-bg-fish-bug` | 「蓝色背景」「鱼看不见」「怎么又有黑板」「下拉条蓝色」 | 透明 iframe / 玻璃化脚本 / 固定背景+鱼影类 bug 的决策树与十项回归清单 |
| `inline-reading-view` | 「跟上次一样改成当前页打开」「当页展示」「不要弹窗」 | tab 内容区换出阅读视图的四步模板 + 验收 + 坑位 |
| `legal-domain-site-tab` | 「系统学某个法律领域 → 出 HTML → 在站里加个 tab」 | 静态站接入 `linqiongni.top` 的配方（`public/<slug>/` + iframe tab + 四处接线） |
| `profile-site-sync-publish` | 「改了页面看不到」「同步一下」「发布上线」 | 中文源目录 → `public/<slug>/` 副本 → GH Pages 的同步发布流程 |
| `sub-site-style-align` | 「这个站和 XX 风格不一致」「字体颜色对齐」 | 子站字体/颜色/版式对齐基准站 `commercial-ops` 的口径 |
| `weekly-plan-publish` | 「把这个合并进去」「第 X 周第 Y 天发布」 | 新课程 HTML 合并进主页餐饮法务 tab 并上线 |

## 什么该放这儿、什么不该

- **放这儿**：只对这个仓库有意义的能力（口径写死了 `linqiongni.top`、`scripts/theme-kit/`、`process/` 等具体路径）。
- **不放**：跨项目通用的能力继续放用户级 `~/.workbuddy/skills/`
  （如 `project-archive-kit`、`domain-knowledge-static-site`）——它们进任一单仓都不合适。

## 加新技能

1. 在 `skills/<name>/SKILL.md` 写好 frontmatter（`name` / `description` / `agent_created: true`），
   `description` 里写清**触发词**（用户会怎么说），否则触发不了。
2. 跑一遍 `bash scripts/setup-device.sh`，确认本机软链已建且自检全绿。
3. 在本表加一行，并在 `process/README.md` 今日索引记一笔。
