# 项目现状 · 技术栈与目录职责

## 技术栈

| 层 | 用什么 | 备注 |
|---|---|---|
| 构建 | Vite 6 | 本地 `npm run dev` 起在 3000（被占则 3001） |
| 主应用 | React 19 + TypeScript 5.8 | 主站 UI 全部在这里 |
| 样式 | Tailwind CSS v4（`@tailwindcss/vite`） | 主站用原子类 |
| 动效 | framer-motion v12（`motion`） | 页面转场、Hero |
| 图标 | lucide-react | |
| 发布 | GitHub Pages | CI 在 `.github/workflows/deploy.yml`，push main 触发 |

**本机没有后端。** 子站全部是纯静态 HTML + 原生 JS，零上传、零依赖（这是刻意的选择，见 `../05-想法池/ideas.md`）。

## 目录职责

| 路径 | 是什么 | 能不能直接改 |
|---|---|---|
| `src/` | 主站 React 源码 | 能，改完要 `npx tsc --noEmit` |
| `src/navConfig.ts` | **导航的唯一真相**：`NAV_GROUPS` 分组 + `SUB_TAB_META` 标签 | 改这里 = 改导航，见 `workflows.md` |
| `public/` | 发布副本，**各子站 iframe 的目标** | **能改，但改了会被覆盖** |
| 根目录中文目录 | 子站源站（商业运营法务/、融资法务/、商事仲裁/……） | 能，**这是正道** |
| `scripts/` | `add_lesson.py`、`check-english-scenes.cjs` 等辅助脚本 | 能 |
| `dist/` | 构建产物 | **不入库，且本地 build 会清空它** |
| `process/` | 项目过程档案库 | 能，见 `../README.md` |

## 子站的两类来源

**容易搞混，先分清楚：**

- **有中文源目录的**：改中文目录 → `npm run sync:<slug>` → 副本进 `public/`
  融资法务 / 商业运营法务 / 新零售与广告合规 / 商事仲裁 / 婚姻家事与遗产继承 / 经济犯罪辩护 / 跨境物流法务 / 身边的英语
- **只有 `public/` 副本的**：**改 `public/` 就是改源站**，没有别的出处
  刑事辩护 / 双视角劳动实务 / IP / 涉外合同 / AI+法律 / 保险 / 物流

判断方法：看 `package.json` 里有没有 `sync:` 脚本指向它。有就是第一类，没有就是第二类。

## 几个反直觉的地方

- **`.workbuddy/` 被 `.gitignore` 排除**，git 里 0 个文件。历史教训见 `../03-问题台账/SOLVED.md`
- **`npm run build` 在本机是禁的**：它会清空 `dist/`，而 `dist/` 里有 356 个已发布的 HTML。构建交给 CI
- **`public/` 里的文件是副本不是源**。只改副本，下次 sync 就白改了
