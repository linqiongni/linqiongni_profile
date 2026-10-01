---
name: english-audio-station
description: 「身边的英语 / ENGLISH」子站（linqiongni.top/english）的音频活儿全流程图：离线 TTS 切句预生成、句级 MP3 + 双缓冲播放器、音频与文字对齐、同步上线与线上验证。当用户说「英语音频」「ENGLISH 配音」「身边的英语」「给英语文章/课文配音」「逐句跟读/点句朗读」「英语朗读很卡/没声音/念的和文字对不上」，或要新增/改写了英语课文要重新配音时使用。配套生成器 scripts/gen_english_audio.py、播放器 身边的英语/index.html。通用播放器骨架与本机环境坑见技能 static-site-audio-player。
agent_created: true
---

# 身边的英语（ENGLISH）音频：改一句 = 重跑一条链

> **本技能是「这个子站」的活儿清单**（路径/命令/坑都写死在这里，跟着 git 走）。
> 通用架构（为什么选句级小文件 + 双缓冲、播放器骨架代码、本机环境坑）在技能
> `static-site-audio-player`；**两者是同一条链的两半，动手前都过一遍** —— 本技能只补本仓库专属部分。

## 一、这个子站长什么样

| 项 | 值 |
|---|---|
| 线上 | `https://linqiongni.top/english/index.html` |
| 源站目录（中文） | `身边的英语/` → 发布副本 `public/english/`（Vite 原样复制，改 `public/` = 改线上） |
| 课文内容 | `身边的英语/scenes.js`（`SCENES=[{id, paras:[{p}], …}]`，28 篇 820 句） |
| 音频产物 | `身边的英语/audio/<sid>/uNNN.mp3`（一句一个）+ `audio/index.js`（索引：seg/len/d） |
| 中间缓存 | `身边的英语/.tts_cache/`（**已 gitignore，不入仓库**，别手工提交） |
| 生成器 | `scripts/gen_english_audio.py` |
| 播放器 | `身边的英语/index.html`（内联 JS，无构建） |
| 音色（硬锁） | `en-US-AriaNeural @ -4%`，句间静音 220ms —— **与《兰香如故》同一支，禁止漂移** |

索引结构（2026-10-01 定型）：`{seg:["audio/s01/u001.mp3",…], len:[每句时长], d:总时长}`
**没有 `off` 字段了**（`off` 是整篇方案的偏移表，已废弃；老代码里看到 off 就是旧链路）。

## 二、改课文 → 重新配音（最常用路径）

```bash
# 1) 改 身边的英语/scenes.js 的 p:"..."（正文只认 paras 里的 p，标题/导语不朗读）
# 2) 只重跑受影响的篇（缓存里已有的句子会跳过 TTS，秒级）
/Users/linqiongni/.workbuddy/binaries/python/envs/default/bin/python -u scripts/gen_english_audio.py --only s01

# 3) 同步 + 注入主题金本 + bump AV（bump 由生成器自动做，别手改 var AV）
npm run sync:english          # = rsync + python3 scripts/apply-theme-kit.py public/english

# 4) 提交（hook 自动推 main / 发布）
git add 身边的英语 public/english scripts && git commit -m "english: ..."
```

- **必须前台 `-u` 跑**（`'python3 -u'`，不是后台 nohup）：后台 stdout 被块缓冲吞掉、进程还会被收走，等于盲跑。
- **清理只 move 不 remove**：`os.remove`/`rm` 累积 50 次会触发 safe-delete 批量保护，直接把生成进程打死。
- 全量重生成约 8 分钟（820 句，并发 6，失败自动串行补做）。

## 三、三处「音频/文字对不上」的死穴（用户反馈过两次，直接查）

按这个顺序，一分钟定位，别乱试：

1. **先证伪数据层**：`.tts_cache/<sid>_<i>.txt` 是真正送进 edge-tts 的原文，跟页面
   `splitSents()` 切出的句子逐句比对；句数/文本都对得上 → 与生成脚本无关，问题在运行时。
2. **点句是不是连播了**：`playFrom(i)` 里 `audPlay(i, false)` 的 `false` 被写死 = 点第 2 句一路念到篇尾。
   页脚写「点任意一句可从该句跟读」就必须真只念一句：`playFrom(i, one)` 透传，点句走 `playFrom(i, true)`；
   底部 ▶ / 「播放这一篇」才保持整篇连播。
3. **高亮有没有滚出视野**：本子站嵌在主页 tab 的 iframe 里，父容器 `.page-scroll` 会把
   `scrollTo({behavior:"smooth"})` 搅断 → 观感「文字停在开头、声音在念后面」。
   **铁律：跟随播放的滚动一律 `behavior:"auto"`**（`ensureVisible()` 越界瞬时滚 + 260ms 二次复核）；
   平滑只留给明显的人为交互。

其余细节（播放器骨架代码、`audNext` 定时推进兜底、`?diag=1` 诊断）见 `static-site-audio-player`。

## 四、自证与上线

本机无头 Chrome **媒体时钟是坏的**（`currentTime` 不推进、`ended` 不触发），所以：

- **自测看日志链，不看 t 值**：起播路径名（`audPlay: 起播 句1/30 audio/s01/u001.mp3`）
  + 定时推进 + 底部状态行走进（「第 3 句 / 共 30 句」）→ 链路通。真实听感必须问用户。
- 起本地静态服务器 + CDP 采样 `main.scrollTop` 与高亮句 `getBoundingClientRect().top`：
  每个采样点高亮句 top 都留在 `0 < top < innerHeight` 内 = 字没跑丢。
- 线上验收：`bash scripts/verify-online.sh english "function ensureVisible" --wait 240`，
  再 `curl -o /dev/null -w "%{http_code}"` 抽查句文件 200、索引 200、**旧整篇 `audio/s01.mp3` 404**
  （确认旧产物已下线、仓库没涨体积）。

## 五、排障速查

| 现象 | 第一查 |
|---|---|
| 点了没声 / 按钮显示「暂停播放」却无声 | 状态行是否「已回落」（回落系统语音那套已删，若还在就是旧缓存）→ 强刷 `?v=`；看 `?diag=1` 诊断条 |
| 等一会才有声、不够顺滑 | 架构问题：整篇 MP3 + seek。现方案起播只需下一句数据，仍这样就是 `audio/index.js` 没加载/AV 没 bump |
| 念的和文字对不上 | 上面第三节三点 |
| 卡在第一句不动 | `ended` 没来 → 看 `audStepT` 定时推进有没有设上（iOS Safari 必挂这道兜底） |
| 某句念不出来（中文词混在英文句里） | 生成脚本 `no_latin()`：完全不含拉丁字母才静音占位；极少数如「团圆.」会 `NoAudioReceived`，删掉那句或改成英文即可 |

## 六、验证清单（收工前照着走）

- 索引自检：篇数 / 句文件数 / `seg.length == len.length` / 总长对得上 / 每个 seg 文件存在 → 0 问题。
- 句序自检：`load_scenes()` 的句列表 vs `audio/index.js` 的 `seg.length` 逐篇比对。
- `public/english/` 副本 grep 复核（同文件多处 Edit 报成功 ≠ 落盘，必须复核）。
- 删掉索引一格，确认播放器回落旧链路而不是静音。
- 推完两远端：`git rev-list --left-right --count origin/main...HEAD` 应为 `0  0`。

## 详见

- `references/gen-pipeline.md` —— 生成器内部（缓存键、静音、失败重试、bump AV）
- `references/player-alignment.md` —— 播放器与文字对齐（双缓冲、`ensureVisible`、状态行）
- `references/troubleshooting.md` —— 完整排障决策树（含 CDP 探针脚本要点）

## 变更记录

- 2026-10-01 定稿：由「整篇 MP3 + 位偏移 seek」重构为「句级小文件 + 双缓冲」（提交 `aca4c14`），
  同日修「音频/文字对不上」（`playFrom(i, one)` 透传 + `ensureVisible()` 瞬时滚动，提交 `97545e5`）。
