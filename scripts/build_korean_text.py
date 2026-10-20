# -*- coding: utf-8 -*-
"""把 Andy 直接粘贴的韩语笔记纯文本规范化为本站的 KO_NOTION 结构，并合并写进 data.js。

为什么另起一个脚本：
  之前的 build_korean_units.py 吃 Notion 导出的 HTML；但 Andy 现在想「直接粘文本」，
  文本没有 HTML 的 details/summary 结构，所以这里单独解析纯文本，复用同一套 emit/write。

文本格式（用户照抄，分块用标题行标识）：
  句子块标题：   <标号>          例：2-3   或  2-3 句子
  小故事块标题： <标号>小故事     例：2-3小故事
  笔记块标题：   <标号>笔记       例：2-3笔记
  句子：每行 "序号、韩文 中文"（韩中同行，按首个汉字切分；无序号也行）
  小故事/笔记：每行 "角色：韩文 中文" 或 "角色：中文"（旁白可无韩文）；纯中文行默认旁白
  空行分隔段落；多个单元、每个单元可有 0~3 个板块，顺序任意

合并策略（关键）：
  不是全量覆盖，而是按「总单元号」合并 —— 文本里提供的单元覆盖/新增，
  现有 KO_NOTION 里其余单元保留。所以 Andy 只粘新增的几个单元也不会丢已上线内容。
  （Notion 全量流程仍走 build_korean_units.py；文本增量走这里。）

用法：
  python scripts/build_korean_text.py                 # 只解析+打印（不写）
  python scripts/build_korean_text.py --src=路径      # 指定文本文件（默认 build/korean-notes.txt）
  python scripts/build_korean_text.py --write         # 解析并合并写进 data.js
"""
import io
import json
import os
import re
import subprocess
import sys
import glob

import build_korean_units as B  # 复用 emit_js / remove_entry / strip_strings / 常量

ROOT = B.ROOT
DATA = B.DATA
SRC = os.path.join(ROOT, "build/korean-notes.txt")

# 解析现有 KO_NOTION 需要 node（JS 对象字面量 → JSON）。探测 managed node 的最新版本。
def _find_node():
    cands = sorted(glob.glob("C:/Users/lin.qiong.ni/.workbuddy/binaries/node/versions/*/node.exe"))
    return cands[-1] if cands else "node"


NODE = _find_node()

KIND_MAP = {"小故事": "story", "笔记": "note", "句子": "sent"}
KIND_LABEL = {"story": "小故事", "note": "笔记", "sent": "句子"}
ORDER = {"sent": 0, "story": 1, "note": 2}

# 角色名：纯中文（含生僻字区间），至少 1 字；后面跟中文/英文冒号
WHO_RE = re.compile(r"^([\u3400-\u4dbf\u4e00-\u9fff]+)\s*[：:]\s*")
NO_RE = re.compile(r"^(\d+)\s*[、.．)）]\s*")


def _audio_for(ent, kind):
    return "%d-%d" % (ent["part"], ent["pno"]) + ("" if kind == "sent" else KIND_LABEL[kind]) + ".m4a"


def _block(ent, kind):
    """在当前单元内取或建一个同类型板块（避免重复创建）。"""
    for b in ent["blocks"]:
        if b["k"] == kind:
            return b
    b = {"k": kind, "t": KIND_LABEL[kind], "sub": "", "audio": _audio_for(ent, kind), "rows": []}
    ent["blocks"].append(b)
    return b


def parse_text(raw):
    """纯文本 → 与 build_korean_units 同结构的 units 列表。"""
    units = {}
    cur_ent = None
    cur = None
    for line in raw.splitlines():
        s = line.strip()
        if not s:
            continue
        m = re.match(r"^(\d+)\s*-\s*(\d+)\s*(小故事|笔记|句子)?\s*$", s)
        if m:
            part, pno = int(m.group(1)), int(m.group(2))
            kind = KIND_MAP.get(m.group(3), "sent")
            flat = B.PART_OFFSET[part] + pno
            cur_ent = units.setdefault(flat, {"unit": flat, "part": part, "pno": pno,
                                              "tag": "%d-%d" % (part, pno), "blocks": []})
            cur = _block(cur_ent, kind)
            continue
        # 单独的板块名行（句子/小故事/笔记）——板块切换标记，非内容
        if s in ("句子", "小故事", "笔记"):
            if cur_ent is not None:
                cur = _block(cur_ent, KIND_MAP[s])
            continue
        if cur_ent is None or cur is None:
            continue
        if cur["k"] == "sent":
            no, ko, zh = B.split_pair(s)
            cur["rows"].append({"no": no, "who": "", "ko": ko, "zh": zh})
        else:
            no, rest = "", s
            mm = NO_RE.match(rest)
            if mm:
                no, rest = mm.group(1), rest[mm.end():]
            wm = WHO_RE.match(rest)
            if wm:
                who, rest = wm.group(1), rest[wm.end():]
            else:
                who = "旁白"
            _, ko, zh = B.split_pair(rest)
            cur["rows"].append({"no": no, "who": who, "ko": ko, "zh": zh})

    for e in units.values():
        for blk in e["blocks"]:
            blk["rows"] = B.fix_roles(blk["rows"])
        e["blocks"] = [b for b in e["blocks"] if b["rows"]]  # 丢掉空板块（如裸 X-Y 后无句子内容）
        e["blocks"].sort(key=lambda b: ORDER[b["k"]])
    return [units[k] for k in sorted(units)]


def read_existing_notion():
    """读回 data.js 里现有的 KO_NOTION（合并时保留未覆盖的单元）。

    注意：emit_js 输出的是 JS 对象字面量（键大多无引号），不能直接 json.loads。
    这里用 node 原生 eval 成对象再序列化为 JSON，最稳。
    """
    s = io.open(DATA, encoding="utf-8").read()
    i = s.find("const KO_NOTION")
    if i < 0:
        return {}
    j = s.index("{", i)
    depth, k = 0, j
    while k < len(s):
        c = s[k]
        if c in "\"'`":
            k = B.strip_strings(s, k) + 1
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                break
        k += 1
    seg = s[j:k + 1]  # 仅对象字面量 {...}
    if not NODE or NODE == "node":
        print("!! 找不到 node，无法解析现有 KO_NOTION")
        return {}
    js = "const m=%s; process.stdout.write(JSON.stringify(m));" % seg
    r = subprocess.run([NODE, "-e", js], capture_output=True, text=True)
    if r.returncode != 0:
        print("!! 解析现有 KO_NOTION 失败：", r.stderr[:200])
        return {}
    try:
        d = json.loads(r.stdout)
    except Exception as ex:
        print("!! KO_NOTION JSON 解析失败：", ex)
        return {}
    out = {}
    for no, v in d.items():
        v["unit"] = int(no)
        out[int(no)] = v
    return out


def merge_and_write(units):
    """按「板块」增量合并：文本里提供的单元，只覆盖其中提供的板块，
    同一单元的其它板块（句子/小故事/笔记）原样保留。这样单独补一段
    小故事或刷新一段笔记，不会丢同单元的其它内容。"""
    existing = read_existing_notion()
    newmap = {u["unit"]: u for u in units}
    for no, v in newmap.items():
        if no in existing:
            e = existing[no]
            incoming = {b["k"]: b for b in v["blocks"]}
            # 保留未被本次覆盖的板块，再并入本次提供的板块
            kept = [b for b in e["blocks"] if b["k"] not in incoming]
            e["blocks"] = kept + list(incoming.values())
            e["blocks"].sort(key=lambda b: ORDER[b["k"]])
            e["tag"] = v.get("tag", e.get("tag"))
        else:
            existing[no] = v  # 新增单元
    s = io.open(DATA, encoding="utf-8").read()
    # 砍掉旧的 KO_NOTION 段（连同前面的注释块）
    ni = s.find("/* 已并入的 Notion 单元")
    if ni < 0:
        ni = s.find("const KO_NOTION")
    if ni >= 0:
        s = s[:ni].rstrip() + "\n"
    # 删 KO_CONTENT 里被本次覆盖的单元（增量不会误删其它）
    for no in newmap:
        s = B.remove_entry(s, no)
    merged = [existing[k] for k in sorted(existing)]
    s = s.rstrip() + "\n\n" + B.emit_js(merged) + "\n"
    io.open(DATA, "w", encoding="utf-8", newline="\n").write(s)
    print("已合并写入 %d 个单元（按板块增量，保留同单元其它板块）" % len(merged))
    return merged


def main():
    global SRC
    for a in sys.argv:
        if a.startswith("--src="):
            SRC = a.split("=", 1)[1]
    if not os.path.exists(SRC):
        sys.exit("!! 找不到笔记文本：%s\n   把笔记文本存成该文件（或 --src=实际路径）。格式见 korean-notes-ops.md 第四节。" % SRC)
    raw = io.open(SRC, encoding="utf-8").read()
    units = parse_text(raw)
    if not units:
        sys.exit("!! 没解析到任何单元，检查标题行是否为「X-Y」/「X-Y小故事」/「X-Y笔记」格式。")

    adir = os.path.join(ROOT, "public/korean/assets/audio")
    have = set(os.listdir(adir)) if os.path.isdir(adir) else set()
    for e in units:
        for b in e["blocks"]:
            ok = b["audio"] in have
            print("总第 %3d 单元 · %s · [%s] %s rows=%d  audio=%s%s" % (
                e["unit"], e["tag"], b["k"], b["t"], len(b["rows"]), b["audio"],
                "" if ok else "  (缺)"))
            if not ok:
                print("    !! 缺音频文件：assets/audio/%s" % b["audio"])

    print("\n解析到 %d 个单元、%d 个板块。" % (
        len(units), sum(len(e["blocks"]) for e in units)))
    if "--write" in sys.argv:
        merge_and_write(units)
        print("提示：别忘了 bump index.html 的 ?v= 缓存版本号，否则线上不刷新。")


if __name__ == "__main__":
    main()
