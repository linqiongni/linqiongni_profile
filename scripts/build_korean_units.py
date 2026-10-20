# -*- coding: utf-8 -*-
"""把 Notion 导出的 KOREAN.html 规范化为本站的单元数据结构，并写进 data.js。

规范：
  「1-8」          → 第一部分 第 8 单元（总第 8 单元）→ 板块：句子
  「2-1 小故事」    → 板块：小故事
  「2-3笔记」       → 板块：笔记
  音频名 = 原标号 + 后缀，例：2-3小故事.m4a

用法：
  python scripts/build_korean_units.py            # 只打印结果
  python scripts/build_korean_units.py --write    # 写入 public/korean/assets/data.js
"""
import io
import json
import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Notion 导出（隐私：不放进 public/）。build/ 已被 .gitignore 忽略 → 不入库、不随站点公开。
# 默认读 build/korean-source.html；可用 --src=路径 覆盖（换电脑/不同导出位置时）。
SRC = os.path.join(ROOT, "build/korean-source.html")
DATA = os.path.join(ROOT, "public/korean/assets/data.js")
OUT = os.path.join(ROOT, "build/korean_units.json")

CJK = re.compile(r"[\u3400-\u4dbf\u4e00-\u9fff\u3007]")
HANGUL = re.compile(r"[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]")
# 部分 → 起始单元前的偏移（第 1 部分 10 个单元、第 2 部分 30 个、第 3 部分 40 个）
PART_OFFSET = {1: 0, 2: 10, 3: 40, 4: 80}
PART_NAME = {1: "第一部分", 2: "第二部分", 3: "第三部分", 4: "第四部分"}


class Node:
    def __init__(self, tag, attrs=None, parent=None):
        self.tag = tag
        self.attrs = dict(attrs or [])
        self.parent = parent
        self.children = []
        self.texts = []


class Tree(HTMLParser):
    VOID = {"br", "img", "meta", "link", "hr", "input", "source"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("root")
        self.cur = self.root
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur)
        self.cur.children.append(n)
        if tag not in self.VOID:
            self.cur = n
            self.stack.append(n)

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, attrs, self.cur))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                self.cur = self.stack[-1]
                return

    def handle_data(self, data):
        if data.strip():
            self.cur.texts.append(data)


def text(n):
    out = list(n.texts)
    for c in n.children:
        out.append(text(c))
    return "".join(out)


def find_all(n, tag, acc=None):
    if acc is None:
        acc = []
    for c in n.children:
        if c.tag == tag:
            acc.append(c)
        find_all(c, tag, acc)
    return acc


def walk(container):
    """→ [{'kind':'text','items':[...]} | {'kind':'table','rows':[[..]]} | {'kind':'detail',...}]"""
    out = []
    for c in container.children:
        if c.tag == "details":
            title = ""
            for s in c.children:
                if s.tag == "summary":
                    title = text(s).strip()
            blocks = []
            for x in c.children:
                if x.tag == "summary":
                    continue
                blocks.extend(walk(x) if x.tag in ("div", "article") else leaf(x))
            out.append({"kind": "detail", "title": title, "blocks": blocks})
        elif c.tag in ("div", "article", "body", "section"):
            out.extend(walk(c))
        else:
            out.extend(leaf(c))
    merged = []
    for b in out:
        if b["kind"] == "text" and merged and merged[-1]["kind"] == "text":
            merged[-1]["items"].extend(b["items"])
        else:
            merged.append(b)
    return merged


def leaf(n):
    if n.tag == "p":
        t = text(n).strip()
        return [{"kind": "text", "items": [t]}] if t else []
    if n.tag in ("ol", "ul"):
        items = []
        for li in find_all(n, "li"):
            t = text(li).strip()
            if t:
                items.append(t)
        return [{"kind": "text", "items": items}] if items else []
    if n.tag == "table":
        rows = []
        for tr in find_all(n, "tr"):
            cells = [text(td).strip() for td in tr.children if td.tag in ("td", "th")]
            if any(cells):
                rows.append(cells)
        return [{"kind": "table", "rows": rows}] if rows else []
    return []


def split_pair(s):
    """'1、이것은 제 핸드폰이 아니에요. 这不是我的手机。' → (no, ko, zh)"""
    no = ""
    s = re.sub(r"[\s\u00a0]+", " ", s).strip()
    m = re.match(r"^(\d+)\s*[、.．)）]\s*", s)
    if m:
        no = m.group(1)
        s = s[m.end():]
    ko_i = HANGUL.search(s)
    cjk_i = CJK.search(s)
    if ko_i and cjk_i and ko_i.start() < cjk_i.start():
        return no, s[:cjk_i.start()].strip(), s[cjk_i.start():].strip()
    if ko_i and not cjk_i:
        return no, s.strip(), ""
    if cjk_i and not ko_i:
        return no, "", s.strip()
    return no, s.strip(), ""


def fix_roles(rows):
    """角色名里混进韩文字（艾디 / 奥斯카）→ 并回同一场里唯一的纯中文写法。"""
    pure = []
    for r in rows:
        w = r["who"]
        if w and not HANGUL.search(w) and CJK.search(w) and w not in pure:
            pure.append(w)
    for r in rows:
        w = r["who"]
        if w and HANGUL.search(w):
            prefix = "".join(CJK.findall(w))
            cand = [p for p in pure if p.startswith(prefix)]
            if len(cand) == 1:
                r["who"] = cand[0]
    return rows


def is_ko_only(s):
    return bool(HANGUL.search(s)) and not CJK.search(s) and not re.search(r"[\u3000-\u303f\uff00-\uffef]", s)


def is_zh_only(s):
    return bool(CJK.search(s)) and not HANGUL.search(s)


def normalize_block(kind, title, sub, raw_lines, raw_table, audio):
    rows = []
    if raw_table:
        head = raw_table[0]
        # 期望表头：# / 角色 / 韩语 / 中文翻译
        idx = {}
        for i, h in enumerate(head):
            if "角色" in h:
                idx["who"] = i
            elif "韩" in h:
                idx["ko"] = i
            elif "中" in h:
                idx["zh"] = i
            elif h.strip() in ("#", "序号"):
                idx["no"] = i
        for cells in raw_table[1:]:
            def g(k):
                i = idx.get(k)
                return re.sub(r"\s+", " ", cells[i]).strip() if i is not None and i < len(cells) else ""
            ko, zh, who, no = g("ko"), g("zh"), g("who"), g("no")
            if not (ko or zh):
                continue
            # 旁白行：韩语列其实是中文（无韩文）
            if ko and not HANGUL.search(ko) and CJK.search(ko) and not zh:
                zh, ko = ko, ""
            rows.append({"no": no, "who": who, "ko": ko, "zh": zh})
    else:
        lines = [x for x in raw_lines if x.strip()]
        n = len(lines)
        if n and n % 2 == 0:
            half = n // 2
            if all(is_ko_only(x) for x in lines[:half]) and all(is_zh_only(x) for x in lines[half:]):
                for a, b in zip(lines[:half], lines[half:]):
                    no, ko, _ = split_pair(a)
                    rows.append({"no": no, "who": "", "ko": ko, "zh": b.strip()})
        if not rows:
            for x in lines:
                no, ko, zh = split_pair(x)
                rows.append({"no": no, "who": "", "ko": ko, "zh": zh})
    return {"k": kind, "t": title, "sub": sub, "audio": audio, "rows": fix_roles(rows)}


KEYMAP = [
    ("小故事", "story", "小故事"),
    ("笔记", "note", "笔记"),
]


def js_str(s):
    return json.dumps(s, ensure_ascii=False)


def emit_js(units):
    """生成 data.js 里的 KO_NOTION 片段。"""
    out = []
    out.append("/* 已并入的 Notion 单元（原文照录，不改写）。键 = 总单元号（与 App 第 N 单元一致）。")
    out.append(" * 每个单元 = 2~3 个板块：句子 / 小故事 / 笔记；板块的音频 = assets/audio/<tag><后缀>.m4a")
    out.append(" * rows: { ko, zh, who, no } —— who = 台词角色，no = 原文序号，缺省为空。 */")
    out.append("const KO_NOTION = {")
    for e in units:
        out.append("  %d: { tag: %s, part: %d, pno: %d, blocks: [" % (e["unit"], js_str(e["tag"]), e["part"], e["pno"]))
        for b in e["blocks"]:
            out.append("    { k: %s, t: %s, sub: %s, audio: %s, rows: [" % (
                js_str(b["k"]), js_str(b["t"]), js_str(b["sub"]), js_str(b["audio"])))
            for r in b["rows"]:
                parts = []
                if r["ko"]:
                    parts.append("ko: " + js_str(r["ko"]))
                if r["zh"]:
                    parts.append("zh: " + js_str(r["zh"]))
                if r["who"]:
                    parts.append("who: " + js_str(r["who"]))
                if r["no"]:
                    parts.append("no: " + js_str(r["no"]))
                out.append("      { " + ", ".join(parts) + " },")
            out.append("    ] },")
        out.append("  ],")
        out.append("  },")
    out.append("};")
    return "\n".join(out)


def strip_strings(s, i):
    """从 i 起跳过字符串/模板串，返回跳过的末位置（用于粗略括号匹配）。"""
    q = s[i]
    i += 1
    while i < len(s):
        if s[i] == "\\":
            i += 2
            continue
        if s[i] == q:
            return i
        i += 1
    return i


def remove_entry(s, no):
    """删除 KO_CONTENT 里 `  {no}: { ... },` 这一段。"""
    pat = "\n  %d: {" % no
    i = s.find(pat)
    if i < 0:
        print("  (已无 %d 条目，跳过)" % no)
        return s
    j = s.index("{", i)
    depth = 0
    k = j
    while k < len(s):
        c = s[k]
        if c in "\"'`":
            k = strip_strings(s, k) + 1
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                break
        k += 1
    end = s.index("\n", k)  # 到「  },」行末
    return s[:i] + s[end:]


def write_data(units):
    s = io.open(DATA, encoding="utf-8").read()
    # 幂等：先砍掉上次生成的 KO_NOTION（连它前面的注释块一起截，避免 emit_js 重复叠加）
    ni = s.find("/* 已并入的 Notion 单元")
    if ni < 0:
        ni = s.find("const KO_NOTION")
    if ni >= 0:
        s = s[:ni].rstrip() + "\n"
    # 动态删除 KO_CONTENT 里所有被 Notion 覆盖的单元——新增单元无需改脚本。
    # 前提：Notion 导出为整页全量（每次重生成全量 KO_NOTION）。
    for no in [e["unit"] for e in units]:
        s = remove_entry(s, no)
    # 旧散句已并入 2-3 笔记，删掉 KO_MISC 整段
    mi = s.find("const KO_MISC")
    if mi >= 0:
        s = s[:mi].rstrip() + "\n"
    # 幂等：仅当该注释还不存在时才插入，避免每次复跑重复叠加
    if "已并入的单元不写在这里，见文件末尾的 KO_NOTION" not in s:
        s = s.replace(
            " *   sent:    [[韩文, 中文], ...]            ← 该单元典型句型\n",
            " *   sent:    [[韩文, 中文], ...]            ← 该单元典型句型\n"
            " *\n"
            " * 已并入的单元不写在这里，见文件末尾的 KO_NOTION（原文照录 Notion 笔记）。\n",
        )
    s = s.rstrip() + "\n\n" + emit_js(units) + "\n"
    io.open(DATA, "w", encoding="utf-8", newline="\n").write(s)
    print("已写入", DATA)


def main():
    global SRC
    for a in sys.argv:
        if a.startswith("--src="):
            SRC = a.split("=", 1)[1]
    if not os.path.exists(SRC):
        sys.exit("!! 找不到 Notion 导出：%s\n   把 Notion 韩语页整页导出为 HTML，放到该路径（或 --src=实际路径）" % SRC)
    raw = io.open(SRC, encoding="utf-8").read()
    t = Tree()
    t.feed(raw)
    body = find_all(t.root, "article")[0]
    blocks = walk(body)

    units_raw = []
    for b in blocks:
        if b["kind"] == "detail":
            for sub in b["blocks"]:
                if sub["kind"] == "detail" and sub["title"].strip():
                    units_raw.append(sub)

    units = {}
    for u in units_raw:
        title = re.sub(r"\s+", " ", u["title"]).strip()
        m = re.match(r"^(\d+)\s*-\s*(\d+)\s*(.*)$", title)
        if not m:
            print("!! 跳过（非 部分-单元 格式）：", repr(title))
            continue
        part, no, rest = int(m.group(1)), int(m.group(2)), m.group(3).strip()
        kind, label, sub = "sent", "句子", ""
        for kw, k, lab in KEYMAP:
            if rest.startswith(kw):
                kind, label = k, lab
                sub = rest[len(kw):].strip()
                break
        if kind == "sent":
            sub = ""  # 「2-2 讨论你的家乡」里的主题名与单元标题重复，不重复显示

        lines, table = [], None
        for b in u["blocks"]:
            if b["kind"] == "text":
                lines.extend(b["items"])
            elif b["kind"] == "table":
                table = b["rows"]

        audio_base = "%d-%d" % (part, no)
        audio = audio_base + ("小故事" if kind == "story" else "笔记" if kind == "note" else "") + ".m4a"
        flat = PART_OFFSET[part] + no
        ent = units.setdefault(flat, {"unit": flat, "part": part, "pno": no, "tag": "%d-%d" % (part, no), "blocks": []})
        ent["blocks"].append(normalize_block(kind, label, sub, lines, table, audio))

    order = {"sent": 0, "story": 1, "note": 2}
    for e in units.values():
        e["blocks"].sort(key=lambda b: order[b["k"]])

    # 校验音频
    adir = os.path.join(ROOT, "public/korean/assets/audio")
    have = set(os.listdir(adir))
    for e in units.values():
        for b in e["blocks"]:
            b["audioOk"] = b["audio"] in have
            if not b["audioOk"]:
                print("!! 缺音频：", b["audio"])

    res = [units[k] for k in sorted(units)]
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    io.open(OUT, "w", encoding="utf-8").write(json.dumps(res, ensure_ascii=False, indent=1))

    for e in res:
        print("总第 %3d 单元 · %s · %s" % (e["unit"], e["tag"], PART_NAME[e["part"]]))
        for b in e["blocks"]:
            print("    [%s] %s %s  rows=%d  audio=%s%s" % (b["k"], b["t"], ("· " + b["sub"]) if b["sub"] else "", len(b["rows"]), b["audio"], "" if b["audioOk"] else "  (缺)"))
            for r in b["rows"][:2]:
                print("        ", r)

    if "--write" in sys.argv:
        write_data(res)


if __name__ == "__main__":
    main()
