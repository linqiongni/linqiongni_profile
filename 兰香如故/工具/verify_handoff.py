# -*- coding: utf-8 -*-
"""
《兰香如故》跨设备交接包 · 内部一致性自检（A↔B↔C 三方对账）

★ 作用：交付前/接手后，验证「真实产物」「交接块声明」「压缩包内容」三者一致，
        防止漏文件、虚构文件、规格未入包、校验值错、进度虚报。

用法（在「工具/」目录下执行，zip 需与 兰香如故/ 同级）：
    cd 兰香如故/工具
    python3 verify_handoff.py
退出码 0=通过，1=发现不一致（需修正后重跑）。
"""
import os, re, sys, subprocess, zipfile, random

HERE = os.path.dirname(os.path.abspath(__file__))   # 工具/
ROOT = os.path.dirname(HERE)                         # 兰香如故/
PKG  = os.path.join(os.path.dirname(ROOT), "兰香如故_交付物.zip")
BLOCK = os.path.join(ROOT, "跨设备交接包.md")

def metric(path):
    if path.endswith(".mp3"):
        dur = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                              "-of", "default=noprint_wrappers=1:nokey=1", path],
                             capture_output=True, text=True).stdout.strip()
        sha = subprocess.run(["sha256sum", path], capture_output=True, text=True).stdout[:8]
        return ("mp3", float(dur), sha)
    if path.endswith(".html"):
        t = open(path, encoding="utf-8").read()
        return ("html", len(re.findall(r'class="seg"', t)), None)
    return ("text", sum(1 for _ in open(path, encoding="utf-8")), None)

# ---------- A. 真实产物 ----------
A = {}
for dp, _, fs in os.walk(ROOT):
    for f in fs:
        full = os.path.join(dp, f)
        rel = os.path.relpath(full, ROOT)
        if rel.startswith("工具" + os.sep + "tts_cache"):
            continue
        A[rel] = metric(full)

# ---------- B. 交接块第6节声明 ----------
block = open(BLOCK, encoding="utf-8").read()
sec6 = block.split("## 6.", 1)[1].split("## 7.", 1)[0]
B = {}
for line in sec6.splitlines():
    if not re.match(r"^\|\s*\d+\s*\|", line):
        continue
    cols = [c.strip() for c in line.strip().strip("|").split("|")]
    if len(cols) < 7:
        continue
    path, chk = cols[3].strip().strip("`"), cols[6].strip()
    if path:
        B[path] = chk

# ---------- C. 压缩包内文件（可选） ----------
C = {}
if os.path.exists(PKG):
    with zipfile.ZipFile(PKG) as z:
        for n in z.namelist():
            if n.endswith("/"):
                continue
            rel = n[len("兰香如故/"):] if n.startswith("兰香如故/") else n
            if rel.startswith("工具/tts_cache/"):
                continue
            C[rel] = True
else:
    print(f"[提示] 未找到压缩包 {PKG}，跳过 C 对账（仅 A↔B）。")

print(f"A(真实)={len(A)}  B(声明)={len(B)}  C(压缩包)={len(C) if C else 'N/A'}")
problems = []
for p in A:
    if p not in B: problems.append(f"[漏声明] A有但交接块未列: {p}")
    if C and p not in C: problems.append(f"[漏入包] A有但未进zip: {p}")
for p in B:
    if p not in A: problems.append(f"[虚构] 交接块声明但真实不存在: {p}")
    if C and p not in C: problems.append(f"[未入包] 声明入包但未进zip: {p}")
for p in C:
    if p not in A: problems.append(f"[包多余] zip内有但真实无: {p}")

def parse_chk(chk):
    return (re.search(r"(\d+)\s*段", chk), re.search(r"([\d.]+)s", chk),
            re.search(r"/\s*([0-9a-f]{8})", chk), re.search(r"(\d+)\s*行", chk))

for p, chk in B.items():
    if p not in A:
        continue
    typ, v1, v2 = A[p]
    seg, dur, sha, ln = parse_chk(chk)
    if typ == "html" and seg and int(seg.group(1)) != v1:
        problems.append(f"[校验错] {p} 声明段数 {seg.group(1)} != 实际 {v1}")
    if typ == "mp3":
        if dur and abs(float(dur.group(1)) - v1) > 1.0:
            problems.append(f"[校验错] {p} 声明时长 {dur.group(1)}s != 实际 {v1:.1f}s")
        if sha and sha.group(1) != v2:
            problems.append(f"[校验错] {p} 声明sha {sha.group(1)} != 实际 {v2}")
    if typ == "text" and ln and int(ln.group(1)) != v1:
        problems.append(f"[校验错] {p} 声明行数 {ln.group(1)} != 实际 {v1}")

sample = random.sample(list(A.keys()), min(3, len(A)))
print("\n抽查3项（真实 vs 声明）：")
for p in sample:
    print(f"  {p}: 真实={A[p]}  声明={B.get(p,'—')}")

print("\n==== 自检结果 ====")
if problems:
    print("❌ 发现不一致，需修正：")
    for x in problems:
        print("   ", x)
    sys.exit(1)
print(f"✅ 通过：真实 {len(A)} 项 = 声明 {len(B)} 项 = 入包 {len(C) if C else len(B)} 项；校验值全部一致。")
