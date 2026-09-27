# 项目现状 · 标准动作与红线

改东西之前先读这份。下面的每一条都对应一个真实踩过的坑，序号与 `../03-问题台账/SOLVED.md` 一致。

## 一、改某个子站的内容（有中文源目录的）

```bash
# 1. 只改根目录中文目录，别改 public/ 副本
# 2. 同步副本
npm run sync:financing      # 各子站 slug 见 tech-stack.md
# 3. 校验
npx tsc --noEmit            # 只有改了 src/ 才需要
# 4. 上线
git add -A && git commit -m "..." && git push origin main
```

`npm run sync:all-static` 一次同步全部。

## 二、新增一个 tab（改到就要动四个地方，缺一个导航就不显示）

1. `src/types.ts` — `TabType` 加一个成员
2. `src/navConfig.ts` — `NAV_GROUPS` 对应分组的 `subTabs` 数组加一项 + `SUB_TAB_META` 补标签
3. `src/components/XxxTab.tsx` — 用公共组件 `ThemeIframe` 或写内嵌组件
4. `src/App.tsx` — `import` / `handleSelectTab` 的回顶条件 / `isFullBleed` / 渲染分支，**四处都要加**

改完必须 `npx tsc --noEmit`。老手也会漏，漏了的表现是「导航按钮没出现」而不是报错。

## 三、上线后怎么确认真的上去了

**不要只看 push 成功。** GH Pages 有 10 分钟缓存：

```bash
# ① 拿当前线上引用的 bundle
curl -s https://linqiongni.top/ | grep -o '/assets/[^"]*\.js' | head -1
# ② 在 bundle 里查内容（注意：查 NAV_GROUPS 数组，不是查字符串）
curl -s "https://linqiongni.top$BD" | grep -o 'id:"legal"[^]]*]'
# ③ 再确认站点可达
curl -s -o /dev/null -w "%{http_code}\n" https://linqiongni.top/<slug>/index.html
```

**只 grep 字符串会误判成功**——它能命中文案常量，但导航未必渲染。必须数 `subTabs` 里的项。详见 `#04`。

浏览器还是旧的 → 硬刷（Cmd+Shift+R），或访问 `https://linqiongni.top/?v=<时间戳>`。

## 四、子站样式与交互的改法

- 布局样式改 `assets/style.css`，交互改 `assets/app.js` 顶部的 `STATIONS` 数组
- **加一节只需在 `STATIONS` 加一条**，页面只要 `<body data-ch="chNN">`，侧栏目录/上下篇/进度条全自动
- 深色模式靠 `/theme-toggle.js` 与父站同步；**英语站不要引它**（浮按钮会压住阅读器）
- 手机端适配样板看 `融资法务/assets/style.css` 末尾的 `@media (max-width:640px)` 块

## 五、英语站加内容后

```bash
npm run check:english
```

手写批次追加后必跑：抓语法错（漏逗号）、缺字段、id 重复、`part`/`place` 未登记（这类错页面不报错，只是少一个分组）。

## 六、红线清单

| # | 红线 | 踩过的代价 |
|---|---|---|
| 1 | **本地禁 `npm run build`** | 清空 `dist/`，已发布资源全没（`#07`） |
| 2 | 只改 `public/` 不改中文源目录 | 下次 sync 白改 |
| 3 | iframe 地址写显式 `index.html` | 写目录 URL 在本地被 SPA 兜底成首页，**本地验证失真**（`#12`） |
| 4 | 改完用 `grep` 逐条核对，别信编辑工具回执 | Edit 报成功但未落盘，改了三次（`#08`） |
| 5 | git 前先清 `.git/*.lock` | 本仓库 `.git/*.lock` 删不掉，下次操作直接报 index.lock 存在（`#09`） |
| 6 | 别把 `.workbuddy/`、根节点文件放进中文源目录 | `npm run sync:english` 是整目录 rsync，会被发布上线（`#13`） |
| 7 | 验证新 tab 要查 `NAV_GROUPS` | grep 名字命中文案常量，误判已上线（`#11`） |
| 8 | push 前 `git fetch` 确认无分叉 | 并发会话会回退已提交的编辑 |

## 七、排障顺序（线上看不到改动时）

1. bundle 里的内容对不对（第三节）
2. 线上的文件对不对（`git fetch` + `git show origin/main:<path>`，`raw.githubusercontent.com` 有 CDN 缓存）
3. 才轮到浏览器缓存
