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
  python3 scripts/add_daily_english.py "<docx>" --before cleaning-routine  # 插到指定课文前面
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
    # 容错：没写 "|" 但英文标题和中文标题连在一起（如 "Getting Dressed穿好衣服"），
    # 按第一个中文字符切开；纯中文或纯英文则原样返回。
    m = re.search(r"[\u4e00-\u9fff]", line)
    if m and m.start() > 0:
        return line[:m.start()].strip(), line[m.start():].strip()
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
    ap.add_argument("--before", default="", help="插到指定 id 的课文前面；默认追加到末尾")
    ap.add_argument("--after", default="", help="插到指定 id 的课文后面；默认追加到末尾")
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
    # 用 JSON 解析整个数组：先按 id 去重（幂等），再按 --before 决定插入位置。
    # 旧版用正则删条目 + 盲加逗号，遇到文件已有尾逗号会产生空元素、且只认双引号格式。
    m = re.search(r"(window\.DAILY_LESSONS\s*=\s*)(\[.*?\])(\s*;)", src, re.S)
    if not m:
        raise SystemExit("lessons.js 结构异常：找不到 window.DAILY_LESSONS 数组")
    try:
        arr = json.loads(m.group(2))
    except Exception as e:
        raise SystemExit(f"lessons.js 数组不是合法 JSON，无法安全写入：{e}")
    arr = [x for x in arr if isinstance(x, dict) and x.get("id") != lesson["id"]]
    where = "末尾"
    if args.before and args.after:
        raise SystemExit("--before 与 --after 不能同时用")
    if args.before:
        pos = next((i for i, x in enumerate(arr) if x.get("id") == args.before), -1)
        if pos < 0:
            raise SystemExit(f"--before 指定的 id 不存在: {args.before}")
        arr.insert(pos, lesson)
        where = f"{args.before} 前面"
    elif args.after:
        pos = next((i for i, x in enumerate(arr) if x.get("id") == args.after), -1)
        if pos < 0:
            raise SystemExit(f"--after 指定的 id 不存在: {args.after}")
        arr.insert(pos + 1, lesson)
        where = f"{args.after} 后面"
    else:
        arr.append(lesson)
    pretty = json.dumps(arr, ensure_ascii=False, indent=2)
    new = src[:m.start(2)] + pretty + src[m.end(2):]
    LESSONS.write_text(new, encoding="utf-8")
    print(f"已写入课文：{lesson['title']} | {lesson['zh']}  (id={lesson['id']}, {len(lesson['blocks'])} 段, 位置={where})")
    print("下一步：python3 scripts/sync_daily_english.py → npx tsc --noEmit → git commit")


if __name__ == "__main__":
    main()
