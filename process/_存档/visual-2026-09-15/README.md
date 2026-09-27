# visual-2026-09-15 · 「低调奢华」视觉升级（已否决，仅存档）

## 这是什么

2026-09-15 做过一版视觉升级，提交在 **`f276c11`**，分支名 `save-visual-f276c11`。
8 个文件 / 119 行，装的是：

| 能力 | 实现 |
|---|---|
| 悬浮胶囊导航 | `Navbar.tsx`：居中毛玻璃胶囊（`rounded-full` + `backdrop-blur`），滚动收缩 |
| 背景氛围光 | `LuxuryAmbience.tsx`：香槟金氛围光晕 + 颗粒质感 |
| 鼠标柔光 | `CursorAura.tsx`：极大模糊、极低透明度香槟金径向光晕跟随光标，尊重 `prefers-reduced-motion` |
| 首页实时时钟 | `LiveClock.tsx`：`Intl.DateTimeFormat` 取 `Asia/Hong_Kong` 时间，带淡脉冲金点 |
| 衬线标题 | `Hero.tsx` + `index.css`：Cormorant 系 `font-serif-display` |
| 入口 | `App.tsx` / `index.html` |

## 为什么不再上线

**2026-09-27 Andy 拍板：「分支没用了不用上线了，现在线上那套版本挺好的。」**

原因是风格冲突：这版是**香槟金**调性，而 2026-09-22 定稿的全站口径是**深海军蓝豪华风**
（`#091A2E` 系）。两者不同源，合并进 main 会与主站配色打架。

补充事实：该分支**从未合并、从未推送**（远端无 `save-visual-f276c11` 引用），
2026-09-27 已删除本地分支，内容以本文件夹形式留下。

## 怎么取回

```bash
# 方式一（推荐）：组件原文直接可用
cp process/_存档/visual-2026-09-15/components/*.tsx src/components/

# 方式二：整包补丁（需要 --3way，直接 apply 会冲突）
git apply --3way process/_存档/visual-2026-09-15/visual.patch
```

**注意**：补丁打的是 9-15 时的文件，`src/App.tsx` 与 `src/components/Hero.tsx` 后来被大改过，
普通 `git apply` 必然失败，必须 `--3way`，且这两处要手工解冲突。
`index.html` / `Navbar.tsx` / `index.css` 三个可干净套用。

## 遗留价值

`LiveClock` 的「实时香港时间」目前 main 上没有。如果哪天想在首页加时钟，
`components/LiveClock.tsx` 是现成的，但金点配色要改成深海军蓝口径。
