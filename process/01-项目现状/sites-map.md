# 项目现状 · 站点对照表

> 权威来源是 `src/navConfig.ts`。本表 2026-09-27 与该文件核对过一次；**两边不一致时以 `navConfig.ts` 为准，并回来改这张表。**

## 三组一览

| 分组 | 包含 |
|---|---|
| 法务实务 `legal` | 商业运营法务 / 新零售与广告合规 / IP / 融资法务 / 加盟经销法务 / 跨境物流法务 / 涉外合同学习 / AI+法律 |
| 律师实务 `practice` | 婚姻家事与遗产继承 / 刑事辩护 / 经济犯罪辩护 / 商事仲裁 / 保险·法律维权 / 双视角劳动实务 |
| 影视法律 `film` | 第一季 S1 ~ 第四季 S4 / ENGLISH |

## 逐个站点

| tab | 中文名 | 加载方式 | 源目录 | 线上地址 |
|---|---|---|---|---|
| `commercial-ops` | 商业运营法务 | iframe | `商业运营法务/`（源） | `/commercial-ops/index.html` |
| `retail-ad` | 新零售与广告合规 | iframe | `新零售与广告合规/`（源） | `/retail-ad/index.html` |
| `ip` | IP | iframe | 待核实 | `/ip/index.html` |
| `financing` | 融资法务 | iframe | `融资法务/`（源） | `/financing-legal/index.html` |
| `catering` | 加盟经销法务 | **React 内嵌** | `src/components/CateringLegalTab.tsx` | 无（在主站内） |
| `logistics` | 跨境物流法务 | iframe | `跨境物流法务/`（源） | `/logistics/index.html` |
| `foreign-contracts` | 涉外合同学习 | iframe | 待核实 | `/foreign-contracts/index.html` |
| `ai-law` | AI+法律 | iframe | 待核实 | `/ai-law/index.html` |
| `family-law` | 婚姻家事与遗产继承 | iframe | `婚姻家事与遗产继承/`（源） | `/family-law/index.html` |
| `criminal` | 刑事辩护 | iframe | `public/criminal/`（**副本即源**） | `/criminal/index.html` |
| `econ-crime` | 经济犯罪辩护 | iframe | `经济犯罪辩护/`（源） | `/econ-crime/index.html` |
| `arbitration` | 商事仲裁 | iframe | `商事仲裁/`（源） | `/arbitration/index.html` |
| `insurance` | 保险·法律维权 | iframe | 待核实 | `/insurance/index.html` |
| `labor` | 双视角劳动实务 | iframe | 源文件在 `~/Downloads/知识产权/劳动用工实务/` | `/labor/index.html` |
| `film-law` ~ `s4` | 影视法律四季 | iframe | `public/film-law*/` | `/film-law*/index.html` |
| `english` | ENGLISH | iframe | `身边的英语/`（源） | `/english/index.html` |

## 三个易错点

1. **`MEMORY.md` 里对商事仲裁、婚姻家事的分组描述已过时**（写的是「法务实务分组第 10 个子板块」），实际都在律师实务组。本表是 2026-09-27 按 `navConfig.ts` 重校的。
2. **`catering` 不加载 iframe**，是 React 组件直接渲染——它和别的子站不同源。
3. **`ip` / `foreign-contracts` / `ai-law` / `insurance` 四个没有中文源目录**，只有 `public/` 副本，`package.json` 里也没有对应的 `sync:` 脚本。改它们只能直接改 `public/`，代价是没有重跑同步的能力。详见 `../03-问题台账/OPEN.md` #03。
