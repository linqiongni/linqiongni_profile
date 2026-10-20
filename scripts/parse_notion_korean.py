# -*- coding: utf-8 -*-
"""解析 Notion 导出的 KOREAN.html，输出 单元 → 子块(句子/小故事/笔记) 的结构。

用法：
  python scripts/parse_notion_korean.py                  # 打印结构树
  python scripts/parse_notion_korean.py --json <path>    # 另存 JSON
"""
import io
import json
import os
import sys
from html.parser import HTMLParser

SRC = "public/korean/KOREAN 3ffe4ed8619480f78515f6ad3976447f.html"


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


def all_text(n):
    out = list(n.texts)
    for c in n.children:
        out.append(all_text(c))
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
    """返回 [{'kind':'text','items':[...]} | {'kind':'detail','title':..,'blocks':[...]}]"""
    out = []
    for c in container.children:
        if c.tag == "details":
            title = ""
            for s in c.children:
                if s.tag == "summary":
                    title = all_text(s).strip()
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
    # 合并相邻 text
    merged = []
    for b in out:
        if b["kind"] == "text" and merged and merged[-1]["kind"] == "text":
            merged[-1]["items"].extend(b["items"])
        else:
            merged.append(b)
    return merged


def leaf(n):
    if n.tag == "p":
        t = all_text(n).strip()
        return [{"kind": "text", "items": [t]}] if t else []
    if n.tag in ("ol", "ul"):
        items = []
        for li in find_all(n, "li"):
            t = all_text(li).strip()
            if t:
                items.append(t)
        return [{"kind": "text", "items": items}] if items else []
    return []


def main():
    raw = io.open(SRC, encoding="utf-8").read()
    t = Tree()
    t.feed(raw)
    arts = find_all(t.root, "article")
    body = arts[0] if arts else t.root
    blocks = walk(body)

    units = []
    for b in blocks:
        if b["kind"] == "detail":
            # 顶层「单元」容器
            for sub in b["blocks"]:
                if sub["kind"] == "detail":
                    units.append(sub)

    print("顶层 detail：", [b["title"] for b in blocks if b["kind"] == "detail"])
    print("单元数：", len(units))
    for u in units:
        kinds = []
        for b in u["blocks"]:
            if b["kind"] == "text":
                kinds.append("句子(%d)" % len(b["items"]))
            else:
                kinds.append("块[%s](%d 段)" % (b["title"], len([x for x in b["blocks"] if x["kind"] == "text"])))
        print(" -", u["title"], "=>", " + ".join(kinds))

    if "--json" in sys.argv:
        out = sys.argv[sys.argv.index("--json") + 1]
        os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
        io.open(out, "w", encoding="utf-8").write(json.dumps(units, ensure_ascii=False, indent=1))
        print("written", out)


if __name__ == "__main__":
    main()
