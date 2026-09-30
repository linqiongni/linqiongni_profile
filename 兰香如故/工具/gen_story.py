# -*- coding: utf-8 -*-
"""
《兰香如故》英文有声剧集 · 通用生成器（接手方唯一允许的 TTS/HTML 生成入口）

★ 音色硬锁（禁止任何修改，否则音色会漂移）：
    VOICE = "en-US-AriaNeural"   # 温暖母语女声
    RATE  = "-4%"                # 略缓，更像讲故事
    流程  = 逐段 edge-tts 合成 -> ffmpeg concat 拼接 -> 算偏移 -> 生成 HTML
    —— 不要整集一次性合成，不要换 voice，不要用别的引擎。

★ HTML 金标准（2026-09-30 固化）：
    直接以已上线的 `EP08.html` 为模板源（主题桥接 + 双栈字体 + 嵌入透明 +
    aquatic 鱼影脚本 + 删原生播放器 + 第一段钩子 blockquote.seg.live），
    只 regex 替换动态段（集数/段数/音频名/正文/ OFF 偏移），不再产出旧模板再重镀。
    改模板只需改 EP08.html 一处，全 37 集同步。

用法（在仓库根目录的「工具/」下执行）：
    python3 gen_story.py EP09                 # 读 EP09_英文剧集介绍.md -> 生成 html + mp3
    python3 gen_story.py EP09 --audio-only    # 只重做音频（md 不变）
    python3 gen_story.py EP09 --html-only     # 只重做 HTML（用已有 mp3）
    python3 gen_story.py EP09 EP10 EP11 EP12 EP13 EP14 EP15   # 批量

依赖：
    沙箱：托管 venv 装 `edge-tts` + `imageio-ffmpeg`（自带 ffmpeg 二进制）
    本机：pip install edge-tts ；系统装 ffmpeg（含 ffprobe）
    脚本自动优先用系统二进制，缺失时回落 venv / imageio-ffmpeg。
标准源格式见同目录「制作规范.md」第二节。
"""
import os, re, html, subprocess, json, sys, shutil

# ---- 路径 ----
HERE = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.dirname(HERE)          # 兰香如故/（markdown 与产物所在）
TMP = os.path.join(HERE, "tts_cache")
os.makedirs(TMP, exist_ok=True)

# ★★★ 音色硬锁 —— 接手方禁止修改 ★★★
VOICE = "en-US-AriaNeural"
RATE = "-4%"

# ---------------------------------------------------------------------------
# 二进制解析：系统优先，缺失回落 venv / imageio-ffmpeg（沙箱可跑）
# ---------------------------------------------------------------------------
def _which(cmd):
    return shutil.which(cmd)

def _ffmpeg_exe():
    p = _which("ffmpeg")
    if p:
        return p
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return "ffmpeg"

def _ffprobe_exe():
    p = _which("ffprobe")
    return p  # 可能为 None，下面用 ffmpeg 兜底

def _edge_tts_args():
    """返回可执行的 edge-tts 调用参数列表（前段）。"""
    e = _which("edge-tts")
    if e:
        return [e]
    return [sys.executable, "-m", "edge_tts"]

FFMPEG = _ffmpeg_exe()
FFPROBE = _ffprobe_exe()

# ---------------------------------------------------------------------------
# 1) 解析「标准源 markdown」：逐段英文 + 紧跟的中文 <details> 配对
# ---------------------------------------------------------------------------
def parse_md(path):
    text = open(path, encoding="utf-8").read()
    parts = re.split(r'(<details>.*?</details>)', text, flags=re.S)
    paras, en_buf = [], []
    for p in parts:
        p = p.strip()
        if not p:
            continue
        if p.lower().startswith("<details"):
            en = clean_en("\n".join(en_buf))
            en_buf = []
            if not en:
                continue  # 连续两个 details，跳过
            zh = clean_zh(p)
            paras.append((en, zh))
        else:
            for line in p.splitlines():
                line = line.strip()
                if not line or line.startswith("#") or line in ("---", "***"):
                    continue
                en_buf.append(line)
    if en_buf:  # 末尾还有英文无配对（格式错误）
        raise ValueError(f"格式错误：末尾存在未被 <details> 配对的英文段。请检查 {os.path.basename(path)}")
    if not paras:
        raise ValueError(f"未解析到任何段落对：{os.path.basename(path)}")
    return paras

def clean_en(block):
    return " ".join(block.split()).strip()

def clean_zh(block):
    m = re.search(r"<details>.*?</summary>(.*)</details>", block, re.S | re.I)
    inner = m.group(1) if m else block
    inner = re.sub(r"</?p>", "", inner, flags=re.S | re.I)
    inner = re.sub(r"<[^>]+>", "", inner)        # 去其余标签
    return " ".join(inner.split()).strip()

# ---------------------------------------------------------------------------
# 2) TTS + 拼接 + 偏移（音色锁死）
# ---------------------------------------------------------------------------
def tts_one(text, out_mp3):
    txt = os.path.join(TMP, "seg.txt")
    with open(txt, "w", encoding="utf-8") as f:
        f.write(text)
    for attempt in range(3):
        r = subprocess.run(_edge_tts_args() + ["--voice", VOICE, f"--rate={RATE}",
                            "--file", txt, "--write-media", out_mp3],
                           capture_output=True, text=True)
        if r.returncode == 0 and os.path.exists(out_mp3) and os.path.getsize(out_mp3) > 1000:
            return True
        print(f"  [TTS retry {attempt+1}] {r.stderr[-200:]}", file=sys.stderr)
    return False

def dur_of(mp3):
    if FFPROBE:
        r = subprocess.run([FFPROBE, "-v", "error", "-show_entries", "format=duration",
                            "-of", "default=noprint_wrappers=1:nokey=1", mp3],
                           capture_output=True, text=True)
        try:
            return float(r.stdout.strip())
        except Exception:
            pass
    # 兜底：ffmpeg -i 解析 Duration
    r = subprocess.run([FFMPEG, "-i", mp3], capture_output=True, text=True)
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", r.stderr)
    if m:
        h, mi, s = int(m.group(1)), int(m.group(2)), float(m.group(3))
        return h * 3600 + mi * 60 + s
    return 0.0

def build_audio(num, paras, skip=False):
    out_mp3 = os.path.join(SRC_DIR, f"EP{num:02d}_audio.mp3")
    if skip and os.path.exists(out_mp3):
        print(f"  [audio skip] 使用已有 {os.path.basename(out_mp3)}")
        seg_files = [os.path.join(TMP, f"ep{num}_seg{i}.mp3") for i in range(len(paras))]
        if all(os.path.exists(s) for s in seg_files):
            offsets = []
            t = 0.0
            for s in seg_files:
                d = dur_of(s); offsets.append([round(t, 3), round(t + d, 3)]); t += d
            return offsets, out_mp3
        print("  [warn] 无分段缓存，偏移按整文件估算，建议重跑不带 --html-only")
        total = dur_of(out_mp3)
        seg = total / len(paras)
        offsets = [[round(i * seg, 3), round((i + 1) * seg, 3)] for i in range(len(paras))]
        return offsets, out_mp3
    seg_files = []
    for i, (en, zh) in enumerate(paras):
        seg = os.path.join(TMP, f"ep{num}_seg{i}.mp3")
        if not tts_one(en, seg):
            raise RuntimeError(f"EP{num:02d} 段 {i} TTS 失败")
        seg_files.append(seg)
    lst = os.path.join(TMP, f"ep{num}_list.txt")
    with open(lst, "w", encoding="utf-8") as f:
        for s in seg_files:
            f.write(f"file '{s}'\n")
    subprocess.run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", lst,
                    "-c", "copy", out_mp3], capture_output=True)
    offsets, t = [], 0.0
    for s in seg_files:
        d = dur_of(s); offsets.append([round(t, 3), round(t + d, 3)]); t += d
    print(f"  音频 {os.path.basename(out_mp3)} 总时长 {t:.1f}s")
    return offsets, out_mp3

# ---------------------------------------------------------------------------
# 3) HTML 生成：以已上线 EP08.html 为金标准模板，只替换动态段
#    （主题桥接 + 双栈字体 + 嵌入透明 + aquatic 鱼影 + 首段钩子 一应保持）
# ---------------------------------------------------------------------------
def gold_template_path():
    # 优先用最新已上线的黄金参照；EP08 为已验证金标准
    for cand in ["EP08.html", "EP01.html"]:
        p = os.path.join(SRC_DIR, cand)
        if os.path.exists(p):
            return p
    raise FileNotFoundError("缺少金标准模板 EP08.html（请在 兰香如故/ 下保留它作为模板源）")

def gen_html(num, paras, offsets):
    tmpl = open(gold_template_path(), encoding="utf-8").read()
    # 正文段：首段为钩子 blockquote.seg.live，其余 <p class="seg">
    body = ""
    for i, (en, zh) in enumerate(paras):
        s0, s1 = offsets[i]
        if i == 0:
            body += (f'<blockquote class="seg live" data-i="0" data-start="{s0}" '
                     f'data-end="{s1}">{html.escape(en)}</blockquote>\n')
        else:
            body += (f'<p class="seg" data-i="{i}" data-start="{s0}" data-end="{s1}">'
                     f'{html.escape(en)}</p>\n')
        body += (f'<details class="zhfold"><summary>🇨🇳 中文翻译</summary>'
                 f'<p>{html.escape(zh)}</p></details>\n\n')
    out = tmpl
    out = out.replace("EPISODE 08 · TOLD LIKE A STORY · 有声版",
                      f"EPISODE {num:02d} · TOLD LIKE A STORY · 有声版")
    out = out.replace("全篇 10 段", f"全篇 {len(paras)} 段")
    out = out.replace("EP08_audio.mp3", f"EP{num:02d}_audio.mp3")
    out = out.replace("第 08 集", f"第 {num:02d} 集")
    # 替换正文故事区（<div class="story"> ... </div> 直到 footer 前）
    out = re.sub(r'<div class="story">.*?</div>\n\n  <footer>',
                 f'<div class="story">\n{body}\n  </div>\n\n  <footer>',
                 out, flags=re.S)
    # 替换 OFF 偏移数组
    out = re.sub(r'const OFF = \[.*?\];', f'const OFF = {json.dumps(offsets)};',
                 out, flags=re.S)
    with open(os.path.join(SRC_DIR, f"EP{num:02d}.html"), "w", encoding="utf-8") as f:
        f.write(out)
    print(f"  生成 EP{num}.html（{len(paras)} 段）")

# ---------------------------------------------------------------------------
# 主流程
# ---------------------------------------------------------------------------
def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    flags = [a for a in sys.argv[1:] if a.startswith("--")]
    if not args:
        print(__doc__)
        sys.exit(1)
    audio_only = "--audio-only" in flags
    html_only = "--html-only" in flags
    for arg in args:
        m = re.match(r"^EP(\d{1,2})$", arg, re.I)
        if not m:
            print(f"跳过非法参数：{arg}（应为 EP09 形式）"); continue
        num = int(m.group(1))
        md_path = os.path.join(SRC_DIR, f"EP{num:02d}_英文剧集介绍.md")
        if not os.path.exists(md_path):
            print(f"缺少源文件：{md_path}，请先写标准源 markdown"); continue
        print(f"\n=== EP{num} ===")
        paras = parse_md(md_path)
        print(f"  解析 {len(paras)} 段（英文/中文配对）")
        offsets, _ = build_audio(num, paras, skip=html_only)
        if len(offsets) != len(paras):
            raise RuntimeError(f"偏移数 {len(offsets)} != 段数 {len(paras)}，校验失败")
        if not audio_only:
            gen_html(num, paras, offsets)
        # 校验
        html_path = os.path.join(SRC_DIR, f"EP{num:02d}.html")
        if os.path.exists(html_path):
            t = open(html_path, encoding="utf-8").read()
            assert f"EP{num:02d}_audio.mp3" in t, "HTML 音频引用错误"
            assert len(re.findall(r'class="seg"', t)) == len(paras), "HTML 段数不符"
            assert f"const OFF = {json.dumps(offsets)}" in t, "OFF 偏移未写入"
            assert 'class="native"' not in t, "残留原生播放器！"
            assert 'class="seg live"' in t, "首段钩子缺失！"
            assert "profile-bg.js" in t, "鱼影脚本缺失！"
            print("  ✅ 校验通过：段数=OFF长度=md段数，音频引用正确，金标准主题齐全")
    print("\n全部完成。")

if __name__ == "__main__":
    main()
