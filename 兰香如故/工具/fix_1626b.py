# -*- coding: utf-8 -*-
"""Delta fix: only the segments missed/under by the first pass.
Run from 兰香如故/ 根."""
import re, os
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)

APPENDS = {
    30: {5: " The name, once taken, returns by the same hand that erred."},
    31: {
        1: " The loyalty the throne did not earn sits heaviest on the man who gave it without being asked.",
        6: " What the capital demanded, Jinling returns without demanding, and the smallness proves lighter than the rank.",
        7: " It is the marriage the edict could never grant, given now by choice and not by command.",
    },
}
CJK_FIX = {"the合卺酒 they drank so late": "the hejin cup they drank so late"}

def rebuild(num):
    p = os.path.join(SRC, f"EP{num:02d}_英文剧集介绍.md")
    t = open(p, encoding="utf-8").read()
    blocks = re.split(r'(<details>.*?</details>)', t, flags=re.S)
    for segidx, app in APPENDS.get(num, {}).items():
        bi = 0 if segidx == 0 else 2 * segidx
        blocks[bi] = blocks[bi].rstrip() + " " + app + "\n\n"
    t2 = "".join(blocks)
    for old, new in CJK_FIX.items():
        if old in t2:
            t2 = t2.replace(old, new)
    open(p, "w", encoding="utf-8").write(t2)
    print(f"EP{num}: delta rebuilt")

if __name__ == "__main__":
    for n in APPENDS:
        rebuild(n)
    # EP35 CJK separate
    p = os.path.join(SRC, "EP35_英文剧集介绍.md")
    t = open(p, encoding="utf-8").read()
    if "the合卺酒" in t:
        t = t.replace("the合卺酒 they drank so late", "the hejin cup they drank so late")
        open(p, "w", encoding="utf-8").write(t)
        print("EP35: CJK fixed")
    else:
        print("EP35: CJK already gone")
    print("done")
