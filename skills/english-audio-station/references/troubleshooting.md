# 完整排障决策树

> 用户反馈一律先进这一节定位，别凭感觉改代码。前 10 分钟能定案的路径都写死了。

## 0. 通用前置

- **强刷**：改过 `public/` 的 JS/CSS 必须 bump `index.html` 里的 `?v=`；GitHub Pages 有 CDN 缓存，
  连续 FAIL 先 cache-bust。
- **从主页 tab 进 vs 直开**：子站嵌在 iframe 里，`behavior:"smooth"`、`autoplay`、媒体时钟表现都不同。
  **排障时让用户直开 `https://linqiongni.top/english/index.html?diag=1`**，所见即所测；
  但用户日常就是从 tab 进，所以**嵌入态的坑要单独测**（临时 harness iframe 页，用完删）。

## 1. 用户说「没声音 / 按钮显示暂停播放却无声」

1. 让用户直开 `?diag=1` 点播放，截**左上角 DIAG 条 + 底部状态行**。
2. 判读：
   - 状态行「已回落 / 系统语音」→ 旧看门狗代码还在（该逻辑已于 2026-10-01 删除，看到就是缓存/回退版本）。
   - 状态行停在「加载 X%」→ 弱网/文件 404（查 `curl -o /dev/null -w "%{http_code}"` 句文件与 `audio/index.js`）。
   - 状态行在走「播放 Xs」→ 在播但用户端无声（本机音频输出设备 / Safari 静音键 / 输出选到别的设备）。
3. 历史上三版「无声」都不是同一个根因：① 整篇 1MB 弱网加载无反馈（加预加载 + 加载中态解决）；
   ② 同样是整篇 + 4s 看门狗切系统语音、之后 MP3 自己又响，两套声音抢喇叭（改句级 + 删看门狗解决）；
   ③ 本机媒体时钟坏的假象。**别把三者当成一回事。**

## 2. 用户说「等一会才有声 / 不够顺滑」

唯一判据：**点播到出声要多久**。
- 出现整篇文件名（`audio/s20.mp3`）→ 还在整篇方案/旧缓存，回到句级 + 双缓冲。
- 已经是句文件但还慢 → `audio/index.js` 没加载成功 / `var AV` 没 bump（缓存旧索引配新文件）。

## 3. 用户说「播放出来的音频和文字不对应」

1. **证伪数据层**（1 分钟）：比对 `.tts_cache/<sid>_<i>.txt` 与页面句序 —— 应 28 篇 820 句零错位。
   有错位 → 生成脚本/切句规则问题；零错位 → 进运行时层。
2. 运行时三查（详见 SKILL.md 第三节）：点句连播 / 高亮滚出视野 / 定时推进抢跑。
3. 问用户两句话即可锁定：「现在声音在第几句、亮的第几句」—— 对不上就按上面走。

## 4. 卡在第一句不动

- `ended` 没触发（本机必现，iOS Safari 偶发）→ 看 `audStepT` 定时推进有没有设上；
  没设上说明 `audPlay` 提前 return（索引句数 ≠ 页面句数 → 走兜底旧链路）。
- 兜底规则：`seg.length` 与句数不符时播放器**回落旧链路而不是静音**，所以卡住 = 兜底也在应用层之外断掉。

## 5. 句数/文件自检脚本（收工前跑）

```python
d = json.loads(open("身边的英语/audio/index.js", encoding="utf-8").read().strip()[6:].rstrip(";"))
for k, v in d.items():
    assert len(v["seg"]) == len(v["len"]), k
    assert abs(v["d"] - sum(v["len"])) < 3, (k, "总长对不上")
    for x in v["seg"]:
        assert os.path.exists(os.path.join("身边的英语", x)), (k, "缺文件 " + x)
```
句数对齐另用 `load_scenes()` 的句列表（`from gen_english_audio import load_scenes`）逐篇比对 `seg.length`。

## 6. 环境坑速查（本机）

| 坑 | 后果 | 正解 |
|---|---|---|
| `os.remove` / `rm` 删自己生成的中间产物 | safe-delete 批量保护打断生成进程 | `shutil.move` 进 `.tts_cache/` |
| 后台 `nohup ... &` | stdout 块缓冲吞日志、进程被收走 | 前台 `python3 -u` + 显式 timeout |
| 本机无 ffmpeg CLI | 脚本找不到 exe | 托管 venv 的 imageio-ffmpeg（脚本已自回退） |
| 本机无头 Chrome 媒体时钟坏 | `currentTime` 不推进、`ended` 不来 | 自测改看日志链 + 状态行 |
| `grep -c "a|b"` | BSD grep 需 `-E` | 用 `-E`，或 `grep -cF` 固定串 |
| 查含 `!!` 的代码（如 `playFrom(i, !!one)`） | zsh 历史展开吃掉 `!` | 单引号 + `-F` |
| 同文件多处 Edit | 报成功但只落盘一处 | 用脚本一次性写完再 `grep -cF` 复核 |
