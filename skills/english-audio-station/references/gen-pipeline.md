# 生成管线内部（scripts/gen_english_audio.py）

> 只在通读代码或要改生成器时才看这里。日常改课文只需 SKILL.md 第二节的两条命令。

## 数据流

```
scenes.js (SCENES[].paras[].p)
   └─ load_scenes() 用正则抽 id + paras 区块里的 p:"..."
        └─ split_sents(p) 切句（与页面 splitSents() 同规则，必须一致）
             ├─ tts_one(text, .tts_cache/<sid>_<i>.mp3)   edge-tts 并发 6，失败串行补做 3 次
             │     └─ 同时写 .tts_cache/<sid>_<i>.txt（★ 送进 TTS 的原文，排障的金标准）
             ├─ silence_for(220ms)                         念不出的句子占位
             └─ ffmpeg concat [句 mp3 + 静音] -c copy  → audio/<sid>/uNNN.mp3
                  └─ 写 audio/index.js {seg, len, d} + bump 页面 var AV
```

## 关键常量（改之前先想清楚影响）

| 常量 | 值 | 为什么这么定 |
|---|---|---|
| `VOICE` | `en-US-AriaNeural` | 与《兰香如故》同支，跨栏目音色统一；**硬锁，改了就是漂移** |
| `RATE` | `-4%` | 略缓，像讲故事，适合跟读 |
| `GAP_MS` | `220` | 句级方案必须留静音：盖住双缓冲切换间隙（<50ms），让听感连续；`--gap 0` 可关 |
| `MIN_BYTES` | `400` | 极短句（`"Thanks."` 只有 7 字节文本，MP3 几百字节）会被 1000 阈值误判失败 |

## 缓存键与复用

- 缓存 = `.tts_cache/<sid>_<i>.mp3` + 同名 `.txt`；**改了某篇的句子 → 该篇 `__only <sid>` 重跑**，
  同篇其余句直接复用，不重新合成。
- `--force` 忽略缓存全量重做；`--only s01 s02` 只做指定篇。
- 页面 `var AV = "va<时间戳>"` 是 `audio/index.js` 的缓存版本号，每轮生成都换号，
  **否则老访客拿缓存的旧偏移表配新 MP3 → 高亮整体错位**。手改 index.js 时必须自己 bump。

## 坑（都踩过）

1. **safe-delete 批量保护打断生成**：`os.remove()` 累积 50 次抛
   `[SAFE_DELETE_BULK_CONFIRM_REQUIRED]` 并让进程退出（旧整篇 MP3 清理那次直接把全量生成打断在半路）。
   → 一律 `shutil.move` 旧产物进 `.tts_cache/`（同样离开 audio/、不入库、不被 rsync 同步）。
2. **后台 nohup 吃日志 + 收走进程** → 前台 `python3 -u`，配显式 timeout（全量约 8 分钟，Bash 给 540s）。
3. **本机没有 ffmpeg CLI**（只有托管 venv 的 imageio-ffmpeg）：脚本 `ffmpeg_exe()` 先找 PATH 再回退 imageio，
   直接跑托管 venv 的 python 最稳。
4. **`build_scene` 内串行复用一个 concat list 文件**（`<sid>_list.txt`），不要为 800 句各建一个；
   list 文件留在 CACHE 里不清（清了更可能撞删除保护，且下轮还能用）。
5. **切句规则必须与页面 `splitSents()` 完全一致**，否则索引句数与渲染句数不符 → 播放器走兜底旧链路。
   改了任意一侧的切句逻辑，两边都要改，然后跑全量句数自检。
6. **纯中文句子（如「团圆.」）edge-tts 会 `NoAudioReceived`**：`no_latin()` 判定（整句无拉丁字母）才静音占位，
   夹一个中文词的英文长句照常合成。
