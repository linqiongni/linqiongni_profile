# -*- coding: utf-8 -*-
"""
《兰香如故》英文有声剧集 · 通用生成器（接手方唯一允许的 TTS/HTML 生成入口）

★ 音色硬锁（禁止任何修改，否则音色会漂移）：
    VOICE = "en-US-AriaNeural"   # 温暖母语女声
    RATE  = "-4%"                # 略缓，更像讲故事
    流程  = 逐段 edge-tts 合成 -> ffmpeg concat 拼接 -> ffprobe 算偏移 -> 生成 HTML
    —— 不要整集一次性合成，不要换 voice，不要用别的引擎。

用法（在仓库根目录的「工具/」下执行）：
    python3 gen_story.py EP06                 # 读 EP06_英文剧集介绍.md -> 生成 EP06.html + EP06_audio.mp3
    python3 gen_story.py EP06 --audio-only    # 只重做音频（md 不变）
    python3 gen_story.py EP06 --html-only     # 只重做 HTML（用已有 mp3）
    python3 gen_story.py EP06 EP07 EP08       # 批量

依赖：pip install edge-tts ；系统安装 ffmpeg（含 ffprobe）
标准源格式见同目录「制作规范.md」第二节。
"""
import os, re, html, subprocess, json, sys

# ---- 路径 ----
HERE = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.dirname(HERE)          # 兰香如故/（markdown 与产物所在）
TMP = os.path.join(HERE, "tts_cache")
os.makedirs(TMP, exist_ok=True)

# ★★★ 音色硬锁 —— 接手方禁止修改 ★★★
VOICE = "en-US-AriaNeural"
RATE = "-4%"

# ---------------------------------------------------------------------------
# 1) 解析「标准源 markdown」：逐段英文 + 紧跟的中文 <details> 配对
#    格式（EP02–EP05 即此格式）：
#       # 标题
#       ## 副标题
#
#       英文段1
#
#       <details><summary>🇨🇳 中文翻译</summary>
#
#       中文段1
#
#       </details>
#
#       英文段2
#
#       <details>...中文段2...</details>
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
    # 英文片段：已是纯文本行，拼成一段
    return " ".join(block.split()).strip()

def clean_zh(block):
    m = re.search(r"<details>.*?</summary>(.*)</details>", block, re.S | re.I)
    inner = m.group(1) if m else block
    inner = re.sub(r"</?p>", "", inner, flags=re.S | re.I)
    inner = re.sub(r"<[^>]+>", "", inner)        # 去其余标签
    return " ".join(inner.split()).strip()

# ---------------------------------------------------------------------------
# 2) TTS + 拼接 + 偏移（音色锁死，逻辑与已验证的 EP01–05 完全一致）
# ---------------------------------------------------------------------------
def tts_one(text, out_mp3):
    txt = os.path.join(TMP, "seg.txt")
    with open(txt, "w", encoding="utf-8") as f:
        f.write(text)
    for attempt in range(3):
        r = subprocess.run(["edge-tts", "--voice", VOICE, f"--rate={RATE}",
                            "--file", txt, "--write-media", out_mp3],
                           capture_output=True, text=True)
        if r.returncode == 0 and os.path.exists(out_mp3) and os.path.getsize(out_mp3) > 1000:
            return True
        print(f"  [TTS retry {attempt+1}] {r.stderr[-200:]}", file=sys.stderr)
    return False

def dur_of(mp3):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "default=noprint_wrappers=1:nokey=1", mp3],
                       capture_output=True, text=True)
    return float(r.stdout.strip())

def build_audio(num, paras, skip=False):
    out_mp3 = os.path.join(SRC_DIR, f"EP{num:02d}_audio.mp3")
    if skip and os.path.exists(out_mp3):
        print(f"  [audio skip] 使用已有 {os.path.basename(out_mp3)}")
        # 仍用缓存段算偏移（若存在），否则按文件探测
        seg_files = [os.path.join(TMP, f"ep{num}_seg{i}.mp3") for i in range(len(paras))]
        if all(os.path.exists(s) for s in seg_files):
            offsets = []
            t = 0.0
            for s in seg_files:
                d = dur_of(s); offsets.append([round(t,3), round(t+d,3)]); t += d
            return offsets, out_mp3
        # 无缓存：用整文件时长近似（点段可能不精准，建议重做音频）
        print("  [warn] 无分段缓存，偏移按整文件估算，建议重跑不带 --html-only")
        total = dur_of(out_mp3)
        seg = total / len(paras)
        offsets = [[round(i*seg,3), round((i+1)*seg,3)] for i in range(len(paras))]
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
    subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst,
                    "-c", "copy", out_mp3], capture_output=True)
    offsets, t = [], 0.0
    for s in seg_files:
        d = dur_of(s); offsets.append([round(t,3), round(t+d,3)]); t += d
    print(f"  音频 {os.path.basename(out_mp3)} 总时长 {t:.1f}s")
    return offsets, out_mp3

# ---------------------------------------------------------------------------
# 3) HTML 模板（与 EP01–05 同结构，点击段落播放/暂停；禁止魔改）
# ---------------------------------------------------------------------------
HTML_HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — Audio Story</title>
<style>
  :root {{ --ink:#2b2622; --gold:#a8853f; --bg:#f6f1e7; --card:#fffdf8; }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; background:var(--bg); color:var(--ink);
    font-family:"Iowan Old Style","Palatino Linotype",Georgia,"Songti SC",serif; line-height:1.85; }}
  .wrap {{ max-width:760px; margin:0 auto; padding:32px 22px 64px; }}
  h1 {{ font-size:26px; text-align:center; margin:0 0 4px; letter-spacing:.5px; }}
  .sub {{ text-align:center; color:var(--gold); font-size:14px; margin-bottom:6px; letter-spacing:2px; }}
  .hint {{ text-align:center; font-size:12px; color:#a99c82; margin-bottom:22px; }}
  .player {{ background:var(--card); border:1px solid #e7ddc7; border-radius:14px;
    padding:18px 22px; display:flex; align-items:center; gap:18px;
    box-shadow:0 6px 20px rgba(120,90,40,.08); margin-bottom:14px; }}
  .playbtn {{ flex:0 0 auto; width:58px; height:58px; border-radius:50%; border:none;
    cursor:pointer; background:var(--gold); color:#fff; font-size:22px;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 12px rgba(168,133,63,.4); }}
  .playbtn:hover {{ background:#92702f; }}
  .meta {{ flex:1 1 auto; }}
  .track {{ font-size:14px; color:#8a7c63; margin-bottom:8px; }}
  .bar {{ height:6px; background:#e7ddc7; border-radius:3px; cursor:pointer; overflow:hidden; }}
  .fill {{ height:100%; width:0%; background:var(--gold); }}
  .time {{ font-size:12px; color:#a99c82; margin-top:6px; display:flex; justify-content:space-between; }}
  .speed {{ flex:0 0 auto; font-size:12px; color:#8a7c63; border:1px solid #e0d3b8;
    border-radius:8px; padding:4px 8px; background:#fff; cursor:pointer; }}
  .err {{ display:none; background:#fdecea; color:#a33; border:1px solid #f5c6c0;
    border-radius:10px; padding:10px 14px; font-size:13px; margin-bottom:14px; }}
  .native {{ margin-bottom:30px; }}
  .seg {{ margin:0 0 6px; font-size:17px; cursor:pointer; border-radius:8px;
    padding:6px 10px; transition:background .15s; position:relative; }}
  .seg:hover {{ background:#f0e7d4; }}
  .seg::before {{ content:"\\1F50A\\00A0"; opacity:.35; font-size:13px; }}
  .seg.active {{ background:#f3e8cf; box-shadow:inset 3px 0 0 var(--gold); }}
  .seg.active::before {{ content:"\\25B6\\00A0"; opacity:1; }}
  .seg.active.paused::before {{ content:"\\23F8\\00A0"; opacity:1; }}
  details.zhfold {{ margin:0 0 22px 0; }}
  details.zhfold summary {{ cursor:pointer; color:var(--gold); font-size:13px;
    padding:4px 0 4px 10px; list-style:none; }}
  details.zhfold summary::before {{ content:"\\25B8\\00A0"; }}
  details.zhfold[open] summary::before {{ content:"\\25BE\\00A0"; }}
  details.zhfold[open] summary {{ margin-bottom:8px; }}
  details.zhfold p {{ margin:0; font-size:16px; color:#4a423a; padding-left:10px; }}
  footer {{ text-align:center; color:#b3a888; font-size:12px; margin-top:40px; }}
</style>
</head>
<body>
<div class="wrap">
  <h1>{title}</h1>
  <div class="sub">{sub}</div>
  <div class="hint">点击任意一段英文，即可从该处开始播放；正在播放时再点一次即暂停（用本机浏览器打开可正常发声）</div>

  <div class="player">
    <button class="playbtn" id="btn" aria-label="播放">▶</button>
    <div class="meta">
      <div class="track">English narration · 母语英语朗读（全篇 {nseg} 段）</div>
      <div class="bar" id="bar"><div class="fill" id="fill"></div></div>
      <div class="time"><span id="cur">0:00</span><span id="dur">0:00</span></div>
    </div>
    <div class="speed" id="spd">1.0×</div>
  </div>
  <div class="err" id="err">内嵌播放器无法在此预览面板播放（沙箱限制）。请用本机浏览器直接打开本文件，或点击下方原生控件 / 打开 EP{num}_audio.mp3。</div>
  <div class="native"><audio id="au2" controls src="EP{num}_audio.mp3" preload="metadata"></audio></div>

  <div class="story">
"""

HTML_TAIL = """  </div>

  <footer>{foot}</footer>
</div>

<audio id="au" preload="metadata" src="EP{num}_audio.mp3"></audio>
<script>
  const OFF = {offsets};
  const au=document.getElementById('au'), btn=document.getElementById('btn'),
        bar=document.getElementById('bar'), fill=document.getElementById('fill'),
        cur=document.getElementById('cur'), dur=document.getElementById('dur'),
        spd=document.getElementById('spd'), err=document.getElementById('err');
  const segs=[...document.querySelectorAll('.seg')];
  let active=-1;
  const fmt=s=>{{const m=Math.floor(s/60),x=Math.floor(s%60);return m+':'+(x<10?'0':'')+x;}};
  function setActive(i,playing){{
    segs.forEach(s=>{{ s.classList.remove('active','paused'); }});
    if(i>=0){{ segs[i].classList.add('active'); if(!playing) segs[i].classList.add('paused'); }}
    active=i;
  }}
  function playSeg(i){{
    if(active===i && !au.paused){{ au.pause(); return; }}
    au.currentTime=OFF[i][0]+0.02;
    au.play().then(()=>setActive(i,true)).catch(()=>{{err.style.display='block';}});
  }}
  segs.forEach(s=>s.addEventListener('click',()=>playSeg(+s.dataset.i)));
  au.addEventListener('loadedmetadata',()=>dur.textContent=fmt(au.duration));
  au.addEventListener('timeupdate',()=>{{
    if(au.duration){{ fill.style.width=(au.currentTime/au.duration*100)+'%'; cur.textContent=fmt(au.currentTime); }}
    const t=au.currentTime;
    let i=OFF.findIndex(o=>t>=o[0] && t<o[1]);
    if(i<0 && t>=au.duration) i=OFF.length-1;
    if(i>=0 && i!==active && !au.paused) setActive(i,true);
  }});
  au.addEventListener('play',()=>{{ btn.textContent='⏸'; if(active>=0) setActive(active,true); }});
  au.addEventListener('pause',()=>{{ btn.textContent='▶'; if(active>=0) segs[active].classList.add('paused'); }});
  au.addEventListener('ended',()=>{{ btn.textContent='▶'; setActive(-1,false); }});
  au.addEventListener('error',()=>{{ err.style.display='block'; }});
  btn.onclick=()=>{{ if(au.paused){{ if(active<0){{playSeg(0);}} else {{au.play();}} }} else {{au.pause();}} }};
  bar.onclick=e=>{{const r=bar.getBoundingClientRect(); if(au.duration) au.currentTime=((e.clientX-r.left)/r.width)*au.duration;}};
  const rates=[1,1.25,1.5,0.75]; let ri=0;
  spd.onclick=()=>{{ri=(ri+1)%rates.length;au.playbackRate=rates[ri];spd.textContent=rates[ri]+'×';}};
</script>
</body>
</html>
"""

def gen_html(num, paras, offsets):
    body = ""
    for i, (en, zh) in enumerate(paras):
        s0, s1 = offsets[i]
        body += (f'<p class="seg" data-i="{i}" data-start="{s0}" data-end="{s1}">{html.escape(en)}</p>\n'
                 f'<details class="zhfold"><summary>🇨🇳 中文翻译</summary>'
                 f'<p>{html.escape(zh)}</p></details>\n\n')
    page = (HTML_HEAD.format(title="兰香如故 · The Fragrance of Orchids Remains",
                             sub=f"EPISODE {num:02d} · TOLD LIKE A STORY · 有声版", num=f"{num:02d}", nseg=len(paras))
            + body
            + HTML_TAIL.format(foot=f"兰香如故 · 第 {num:02d} 集有声剧集介绍 · 音频由母语英语嗓音合成（en-US-AriaNeural）",
                               num=f"{num:02d}", offsets=json.dumps(offsets)))
    with open(os.path.join(SRC_DIR, f"EP{num:02d}.html"), "w", encoding="utf-8") as f:
        f.write(page)
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
            print(f"跳过非法参数：{arg}（应为 EP06 形式）"); continue
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
            print("  ✅ 校验通过：段数=OFF长度=md段数，音频引用正确")
    print("\n全部完成。")

if __name__ == "__main__":
    main()
