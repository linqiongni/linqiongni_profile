# 播放器与文字对齐（身边的英语/index.html）

> 播放器骨架（`audBufGet` / `audWarm` / `audPlay` / `audNext` 定时器）在通用技能
> `static-site-audio-player` 第三节，这里只记本子站跟「对齐」有关的专项。

## 一、双缓冲怎么用

- 两个 `<audio>` 交替：k 号只播「句号 % 2 == k」的句子。
- **切句 = 换一个已预热的缓冲直接 `play()`**；绝不在同一元素上 seek（seek 是起播卡顿的根源）。
- 备用缓冲永远预载下一句（`audPlay` 里 `audWarm(a, i+1)`；单句跟读只预热当前句）。
- 打开篇目就预热头两句，点播放时数据已在手。
- 打断令牌 `audTok`：暂停 / 切篇时 `++audTok`，让等着的 `canplay` 回调失效，不会串台。
- `stopAll()` 清 `audStepT` + 两个缓冲 + 取消系统语音。

## 二、三处「念的和文字对不上」的死穴

### 1. 点句连播（文案与行为相反）

页脚写着「点任意一句可从该句跟读」，代码却是 `playFrom(i)` → `audPlay(i, false)`（false = 连播到篇尾）。
点第 2 句，声音和高亮一路跑过去，用户感受就是「音频和文字对不上」。

```js
function playFrom(i, one){ … audPlay(i, !!one) … }   // 透传 oneShot
// 点句：playFrom(i, true)   → 念完一句就停
// 底部 ▶ / 「播放这一篇」：playFrom(i, false) → 整篇连播
```

### 2. 高亮滚出视野（最常见）

子站嵌在主页 tab 的 iframe 里，父容器（主站 `.page-scroll` 是独立滚动容器）会把
`scrollTo({behavior:"smooth"})` 吃掉/搅断 → 高亮句停在视野外，观感「文字没动、声音在走」。

```js
function ensureVisible(el){                       // 越界即瞬时滚 + 260ms 二次复核
  var b = el.getBoundingClientRect(), m = main.getBoundingClientRect();
  if(b.top >= m.top + 60 && b.bottom <= m.bottom - 30) return;
  var to = Math.max(0, Math.min(main.scrollTop + b.top - m.top - m.height * 0.38,
                                main.scrollHeight - main.clientHeight));
  try { main.scrollTo({ top: to, behavior: "auto" }); } catch(e){ main.scrollTop = to; }
  setTimeout(function(){ /* 再查一次，父容器重排把它拽回去就补一次 */ }, 260);
}
```

**铁律：跟随播放的实时滚动一律瞬时；平滑只留给明显的人为交互（本项目基本没有）。**
切篇滚顶那两处 `smooth` 也一并换成 `auto`（embed 里同样会失效）。
`highlight()` 里改 `ensureVisible()` 后必须 `grep -cF 'behavior: "smooth"'` 复核为 0。

### 3. 定时推进把高亮抢在声音前面

本机媒体时钟坏时 `ended` 不触发，靠 `audStepT` 按 `len[i]` 猜时长推进；
估短了高亮就先跑 → 宁可 +120ms 容差也别减。

## 三、自测三连（本机 t 值不可信）

1. CDP 点 `#play`（底部 ▶），读诊断 DOM：起播行必须是句文件路径
   `audPlay: 起播 句1/30 audio/s01/u001.mp3`（出现整篇 `audio/s20.mp3` = 旧链路/缓存）。
2. 采样若干次：读 `main.scrollTop` 与高亮句 `getBoundingClientRect().top`，
   **每个采样点 `0 < top < innerHeight`** 才说明字没跑丢（实测 30 秒 main 滚量 0→394、top 全程 275~627）。
3. 底部状态行（「第 N 句 / 共 M 句」）跟着连播走到第 3 句以上 = 推进链路通。

## 四、留给用户端的取证工具

- 页面带 `?diag=1`：左上角 DIAG 诊断条 + 状态行（加载 % / 播放 s / 已回落）。
- **为什么要留**：本机无头 Chrome 媒体时钟坏，无法自证「声音实际在念哪句」，
  只能请用户截这两行回来定位是「加载慢 / 在播但无声 / 已回落」哪一类。
