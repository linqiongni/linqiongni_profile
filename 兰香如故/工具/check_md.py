# -*- coding: utf-8 -*-
"""Compliance checker for 兰香如故 episode markdown sources.
Usage: python3 check_md.py EP16 EP17 ...   (run from 兰香如故/ 根)
Checks: 8-14 segments, >=1400 words total, 150-260 words/seg, zero CJK in audio segments,
         each English segment paired with exactly one <details> 中文翻译, no stray word leakage.
"""
import re, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)

def check(num):
    p = os.path.join(SRC, f"EP{num:02d}_英文剧集介绍.md")
    if not os.path.exists(p):
        print(f"EP{num}: MISSING {p}"); return False
    t = open(p, encoding="utf-8").read()
    parts = re.split(r'(<details>.*?</details>)', t, flags=re.S)
    paras = []; en_buf = []
    for x in parts:
        x = x.strip()
        if not x:
            continue
        if x.lower().startswith("<details"):
            paras.append(" ".join(en_buf)); en_buf = []
        else:
            for l in x.splitlines():
                l = l.strip()
                if l and not l.startswith("#") and l not in ("---", "***"):
                    en_buf.append(l)
    if en_buf:
        print(f"EP{num}: FAIL format (trailing English without <details>)"); return False
    words = [len(e.split()) for e in paras]
    total = sum(words)
    cjk = len(re.findall(r'[\u4e00-\u9fff]', " ".join(paras)))
    details = len(re.findall(r'<details>.*?</details>', t, flags=re.S))
    ok = (8 <= len(paras) <= 14 and total >= 1400 and min(words) >= 150
          and max(words) <= 260 and cjk == 0 and details == len(paras))
    print(f"EP{num}: segs={len(paras)} total={total} per_min={min(words)} "
          f"per_max={max(words)} cjk={cjk} details={details} -> {'OK' if ok else 'FAIL'}")
    return ok

if __name__ == "__main__":
    nums = [int(a.replace('EP','')) for a in sys.argv[1:]]
    res = [check(n) for n in nums]
    print("ALL OK" if all(res) else "SOME FAIL")
    sys.exit(0 if all(res) else 1)
