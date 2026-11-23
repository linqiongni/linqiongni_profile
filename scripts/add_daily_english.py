#!/usr/bin/env python3
"""把「日常英语」同格式的 Word 文档转成一条课文，追加进 日常英语/lessons.js。

Word 约定（与 Cleaning Routine 那份一致）：
  第 1 段 = 标题「English | 中文」
  第 2 段 = 小节标题（Heading 1）
  之后每 4 段一组：EN n 英文 / 中 中文 / 重点词句：... / 重难点：...
  「常用表达替换」标题后：英文 / 中文 成对交替

用法：
  python3 scripts/add_daily_english.py "C:/path/to/Cleaning Routine  清洁.docx"
  python3 scripts/add_daily_english.py "<docx>" --id custom-id      # 指定 id
  python3 scripts/add_daily_english.py "<docx>" --tag "日常生活 · xx"
  python3 scripts/add_daily_english.py "<docx>" --dry-run           # 只打印不写入
写入后：npm run sync:daily-english → npx tsc --noEmit → commit 即上线。
"""
import argparse
import html
import json
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LESSONS = ROOT / "日常英语" / "lessons.js"


def paragraphs(docx: Path):
    with zipfile.ZipFile(docx) as z:
        xml = z.read("word/document.xml").decode("utf-8")
    out = []
    for p in re.findall(r"<w:p[ >].*?</w:p>", xml, re.S):
        txt = "".join(re.findall(r"<w:t[^>]*>(.*?)</w:t>", p, re.S))
        txt = html.unescape(txt).strip()
        if txt:
            out.append(txt)
    return out


def split_title(line: str):
    if "|" in line:
        a, b = line.split("|", 1)
        return a.strip(), b.strip()
    return line.strip(), ""


def slug(title: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return s or "lesson"


def parse(docx: Path, tag: str, force_id: str):
    lines = paragraphs(docx)
    if not lines:
        raise SystemExit("文档没有可读取的正文段落")

    en_title, zh_title = split_title(lines[0])
    lesson = {
        "id": force_id or slug(en_title),
        "title": en_title,
        "zh": zh_title,
        "tag": tag,
        "section": lines[1] if len(lines) > 1 else "",
        "blocks": [],
        "replacements": [],
    }

    i = 2
    # 正文分段：EN n / 中 / 重点词句 / 重难点
    while i < len(lines) and lines[i] != "常用表达替换":
        line = lines[i]
        m = re.match(r"^EN\s*\d+\s+(.*)$", line)
        if m:
            block = {"en": m.group(1).strip(), "zh": "", "words": "", "note": ""}
            i += 1
            if i < len(lines) and lines[i].startswith("中"):
                block["zh"] = re.sub(r"^中\s*", "", lines[i]).strip()
                i += 1
            if i < len(lines) and lines[i].startswith("重点词句"):
                block["words"] = re.sub(r"^重点词句[：:]\s*", "", lines[i]).strip()
                i += 1
            if i < len(lines) and lines[i].startswith("重难点"):
                block["note"] = re.sub(r"^重难点[：:]\s*", "", lines[i]).strip()
                i += 1
            lesson["blocks"].append(block)
            continue
        i += 1

    # 常用表达替换：英文 / 中文 交替
    if i < len(lines) and lines[i] == "常用表达替换":
        i += 1
        while i + 1 < len(lines):
            lesson["replacements"].append({"en": lines[i], "zh": lines[i + 1]})
            i += 2

    if not lesson["blocks"]:
        raise SystemExit("未识别到 EN n 段落，请检查 Word 格式是否符合约定")
    return lesson


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("docx")
    ap.add_argument("--id", default="")
    ap.add_argument("--tag", default="日常生活")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    docx = Path(args.docx).expanduser()
    if not docx.is_file():
        raise SystemExit(f"找不到文件: {docx}")

    lesson = parse(docx, args.tag, args.id)
    block = json.dumps(lesson, ensure_ascii=False, indent=2)
    block = "\n".join("  " + ln for ln in block.splitlines())

    if args.dry_run:
        print(block)
        return

    src = LESSONS.read_text(encoding="utf-8")
    # 复用同一 id 时先删除旧条目，避免重复（幂等，方便重跑）
    src = re.sub(
        r'\n  \{\n    "id": "' + re.escape(lesson["id"]) + r'".*?\n  \},\n](?=\s*;)',
        "\n]",
        src,
        flags=re.S,
    )
    idx = src.rfind("\n];")
    if idx == -1:
        raise SystemExit("lessons.js 结构异常：找不到数组结尾 ];")
    new = src[:idx] + ",\n" + block + src[idx:]
    LESSONS.write_text(new, encoding="utf-8")
    print(f"已追加课文：{lesson['title']} | {lesson['zh']}  (id={lesson['id']}, {len(lesson['blocks'])} 段)")
    print("下一步：npm run sync:daily-english → npx tsc --noEmit → git commit")


if __name__ == "__main__":
    main()
