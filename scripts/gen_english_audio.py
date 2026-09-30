#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ENGLISH（身边的英语）配音生成器 —— 与《兰香如故》同一套做法，音色锁死同一支。

★ 音色硬锁（与 兰香如故/工具/gen_story.py 一致，禁止漂移）：
    VOICE = "en-US-AriaNeural"   温暖母语女声（微软神经网络音）
    RATE  = "-4%"                略缓，像讲故事
    GAP   = 220ms                句间静音，便于跟读（兰香是段落级、不加；这是句子级所以加）

为什么离线预生成：页面原来整篇连读走浏览器系统语音（生硬），单句走 Kokoro WASM
（手机逐句推理会卡死 UI，代码里因此被强制退回系统语音）。预生成后页面只播一个 MP3 文件，
既地道（与兰香同音色）又不卡，且句级偏移让「上一句/下一句/进度跳句」变成真的可控。

流程：逐句 edge-tts -> 句间插静音 -> ffmpeg concat -> 算句级偏移 -> 写 audio/index.js

用法（仓库根目录执行）：
    python3 scripts/gen_english_audio.py                 # 全量（已有缓存会跳过 TTS）
    python3 scripts/gen_english_audio.py --only s01 s02  # 只做某几篇
    python3 scripts/gen_english_audio.py --force         # 忽略缓存重合成
    python3 scripts/gen_english_audio.py --gap 0         # 句间不留静音

依赖：托管 venv 的 edge-tts + imageio-ffmpeg（自带 ffmpeg 二进制）；本机有 ffmpeg 时优先用系统的。
产物：身边的英语/audio/<id>.mp3 + 身边的英语/audio/index.js（偏移表）
     中间句缓存放 身边的英语/.tts_cache/（已 gitignore，不入库）
"""
import os, re, sys, json, argparse, subprocess, shutil
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "身边的英语")
SCENES_JS = os.path.join(SRC, "scenes.js")
OUT_DIR = os.path.join(SRC, "audio")
CACHE = os.path.join(SRC, ".tts_cache")

# ★★★ 音色硬锁 —— 与兰香如故一致，接手方禁止修改 ★★★
VOICE = "en-US-AriaNeural"
RATE = "-4%"
GAP_MS = 220
# 成功判据：极短句（如 "Thanks." 7 字节）的 MP3 也只有几百字节，阈值定 1000 会误判为失败
MIN_BYTES = 400

EDGE = shutil.which("edge-tts")
EDGE_ARGS = [EDGE] if EDGE else [sys.executable, "-m", "edge_tts"]


def ffmpeg_exe():
    p = shutil.which("ffmpeg")
    if p:
        return p
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return "ffmpeg"


FFMPEG = ffmpeg_exe()


def duration(mp3):
    """取时长：优先 ffprobe，没有就用 ffmpeg -i 解析 Duration（imageio 只带 ffmpeg）。"""
    try:
        r = subprocess.run([FFMPEG, "-i", mp3], capture_output=True, text=True)
        m = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", r.stderr)
        if m:
            return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
    except Exception:
        pass
    return 0.0


def split_sents(text):
    """与页面 index.html 的 splitSents() 逐字一致（否则高亮会和音频错位）。"""
    raw = re.split(r"([.!?])\s+", text)
    out = []
    for piece in raw:
        if piece in (".", "!", "?"):
            if out:
                out[-1] += piece
        elif piece:
            out.append(piece)
    return [s for s in out if s.strip()]


def load_scenes():
    """从 scenes.js 抽出每篇的 id 与句子列表（只取正文句，标题/导语不朗读）。"""
    src = open(SCENES_JS, encoding="utf-8").read()
    m = re.search(r"const\s+SCENES\s*=\s*(\[.*?\])\s*;", src, re.S)
    if not m:
        raise SystemExit("没在 scenes.js 里找到 SCENES 数组")
    blob = m.group(1)
    out, i, n = [], 0, len(blob)
    # 浅解析：按顶层对象逐个抓 id / paras 里的 p
    for om in re.finditer(r'\{\s*id:\s*"([^"]+)"', blob):
        sid = om.group(1)
        start = om.start()
        end = blob.find('\n  }', start)
        chunk = blob[start: end if end > 0 else n]
        paras = re.findall(r'p:\s*"((?:[^"\\]|\\.)*)"', chunk)
        # 去掉可能是 notes 里的 e 字段误伤：只取 paras 区块
        pblock = re.search(r"paras:\s*\[(.*?)\]\s*,\s*notes", chunk, re.S)
        if pblock:
            paras = re.findall(r'p:\s*"((?:[^"\\]|\\.)*)"', pblock.group(1))
        sents = []
        for p in paras:
            p = p.replace('\\"', '"').replace("\\'", "'").replace("\\n", " ")
            sents.extend(split_sents(p))
        out.append((sid, sents))
    return out


def tts_one(text, out_mp3, force=False):
    if (not force) and os.path.exists(out_mp3) and os.path.getsize(out_mp3) > MIN_BYTES:
        return True
    txt = out_mp3[:-4] + ".txt"
    with open(txt, "w", encoding="utf-8") as f:
        f.write(text)
    for attempt in range(3):
        r = subprocess.run(EDGE_ARGS + ["--voice", VOICE, "--rate=%s" % RATE,
                                        "--file", txt, "--write-media", out_mp3],
                           capture_output=True, text=True)
        if r.returncode == 0 and os.path.exists(out_mp3) and os.path.getsize(out_mp3) > MIN_BYTES:
            return True
        sys.stderr.write("  [TTS retry %d] %s\n" % (attempt + 1, (r.stderr or "")[-160:]))
    return False


def no_latin(text):
    """只有完全不含拉丁字母的句子才念不出来（如整句就是「团圆.」）。
    长英文句子里夹一个中文词的情况照常合成——引擎会跳过或带口音念，好过整句静音。"""
    return not re.search(r"[A-Za-z]", text)


def silence_for(ms):
    """按毫秒缓存的静音片段：给「念不出来」的句子（如英文段落里混的中文词）占位，
    保证句数与偏移表一一对齐，不因为一句卡住整篇。"""
    path = os.path.join(CACHE, "_sil_%d.mp3" % int(ms))
    if not os.path.exists(path):
        subprocess.run([FFMPEG, "-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
                        "-t", "%.3f" % (ms / 1000.0), "-c:a", "libmp3lame", "-b:a", "48k", path],
                       capture_output=True)
    return path if os.path.exists(path) else None


def make_silence(path, ms):
    if ms <= 0:
        return None
    if not os.path.exists(path):
        subprocess.run([FFMPEG, "-y", "-f", "lavfi", "-i",
                        "anullsrc=r=24000:cl=mono", "-t", "%.3f" % (ms / 1000.0),
                        "-c:a", "libmp3lame", "-b:a", "48k", path],
                       capture_output=True)
    return path if os.path.exists(path) else None


def build_scene(sid, sents, gap_ms, force):
    os.makedirs(CACHE, exist_ok=True)
    os.makedirs(OUT_DIR, exist_ok=True)
    segs = []
    # 1) 逐句合成（并发 6，失败重试 3 次）
    jobs = []
    for i, s in enumerate(sents):
        seg = os.path.join(CACHE, "%s_%03d.mp3" % (sid, i))
        segs.append(seg)
        if no_latin(s):
            # 整句没有拉丁字母（如「团圆.」）——英文配音念不出来，用静音占位并提示改内容
            ph = silence_for(max(400, min(90 * len(s), 4000)))
            if ph:
                shutil.copyfile(ph, seg)
                sys.stderr.write("  [warn] %s 第 %d 句含中文，英文配音念不出，已用静音占位：%s\n" % (sid, i + 1, s[:40]))
                continue
        if force or not (os.path.exists(seg) and os.path.getsize(seg) > MIN_BYTES):
            jobs.append((s, seg))
    if jobs:
        with ThreadPoolExecutor(max_workers=6) as ex:
            results = list(ex.map(lambda j: tts_one(j[0], j[1], force), jobs))
        if not all(results):
            # 并发偶发被限流/网络抖动：把失败的那几句改成串行补做（并发下总失败的，串行基本都能过）
            bad = [jobs[i] for i, ok in enumerate(results) if not ok]
            sys.stderr.write("  [retry] %s 有 %d 句并发失败，串行补做\n" % (sid, len(bad)))
            still = []
            for text, seg in bad:
                import time
                time.sleep(1.5)
                if not tts_one(text, seg, True):
                    still.append(seg)
            for seg in still:
                # 个别句子怎么都合成不出来（网络/内容异常）：静音占位 + 告警，不中断整篇
                ph = silence_for(500)
                if ph:
                    shutil.copyfile(ph, seg)
            if still:
                sys.stderr.write("  [warn] %s 有 %d 句用静音占位：%s\n" % (sid, len(still), still[:3]))
    # 2) 拼接（句间插静音）
    sil = make_silence(os.path.join(CACHE, "_silence_%d.mp3" % gap_ms), gap_ms)
    lst = os.path.join(CACHE, "%s_list.txt" % sid)
    with open(lst, "w", encoding="utf-8") as f:
        for k, seg in enumerate(segs):
            f.write("file '%s'\n" % seg)
            if sil and k < len(segs) - 1:
                f.write("file '%s'\n" % sil)
    out_mp3 = os.path.join(OUT_DIR, "%s.mp3" % sid)
    r = subprocess.run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", lst,
                        "-c", "copy", out_mp3], capture_output=True, text=True)
    if not os.path.exists(out_mp3) or os.path.getsize(out_mp3) < MIN_BYTES:
        raise RuntimeError("%s 拼接失败：%s" % (sid, (r.stderr or "")[-200:]))
    # 3) 偏移：句起点 = 前面所有句时长 + 静音
    offs, t = [], 0.0
    for k, seg in enumerate(segs):
        offs.append(round(t, 2))
        t += duration(seg)
        if sil and k < len(segs) - 1:
            t += gap_ms / 1000.0
    total = round(duration(out_mp3), 2)
    return {"f": "audio/%s.mp3" % sid, "d": total, "off": offs}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*", default=None, help="只处理指定篇 id")
    ap.add_argument("--force", action="store_true", help="忽略句缓存重新合成")
    ap.add_argument("--gap", type=int, default=GAP_MS, help="句间静音毫秒，0 = 不留")
    args = ap.parse_args()

    scenes = load_scenes()
    if args.only:
        scenes = [s for s in scenes if s[0] in args.only]
    if not scenes:
        raise SystemExit("没有匹配的篇目")
    print("共 %d 篇 / %d 句，音色 %s %s，句间静音 %dms" %
          (len(scenes), sum(len(s[1]) for s in scenes), VOICE, RATE, args.gap))

    data = {}
    index_js = os.path.join(OUT_DIR, "index.js")
    if os.path.exists(index_js):
        try:
            txt = open(index_js, encoding="utf-8").read()
            data = json.loads(txt[txt.index("{"): txt.rindex("}") + 1])
        except Exception:
            data = {}
    for sid, sents in scenes:
        info = build_scene(sid, sents, args.gap, args.force)
        data[sid] = info
        print("  %s  %2d句  %6.1fs  -> audio/%s.mp3" % (sid, len(sents), info["d"], sid))
    with open(index_js, "w", encoding="utf-8") as f:
        f.write("window.EN_AUDIO=" + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print("偏移表已写入 %s（%d 篇）" % (index_js, len(data)))
    print("提示：改完记得 npm run sync:english，把 audio/ 与 index.html 同步到 public/english/")


if __name__ == "__main__":
    main()
