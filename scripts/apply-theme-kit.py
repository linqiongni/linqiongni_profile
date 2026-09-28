#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""子站主题补丁注入器（幂等 / 可校验）。

为什么需要它：
    public/<slug>/ 下的页面曾经靠手工往 HTML 里塞四块补丁（DARK_UNIFY / SUB_THEME_KIT /
    AQUATIC_BG_KIT / SUB_THEME_BRIDGE）。手工的东西必然会被漏掉，而且这些补丁只存在于
    public/，中文源目录里没有——改完中文目录跑 sync，补丁照样丢（问题台账 #21）。

本脚本把补丁变成"可重放、可校验"的东西：
    python3 scripts/apply-theme-kit.py public/retail-ad public/arbitration   # 补齐缺失
    python3 scripts/apply-theme-kit.py --fix public/retail-ad                # 顺带刷新旧版
    python3 scripts/apply-theme-kit.py --check public/retail-ad              # 只体检，退出码非 0 即不干净

四块的注入位置：
    DARK_UNIFY / SUB_THEME_KIT  -> </head> 前
    AQUATIC_BG_KIT / BRIDGE     -> </body> 前（print 类页面跳过，不打无用的鱼影层）
"""
import argparse
import os
import re
import sys

KIT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "theme-kit")

# 标记 -> (kit 文件, 注入位置, 文件过滤)
BLOCKS = [
    # EMBEDDED_KIT 必须放在 headtop：嵌入检测脚本要尽可能早执行，避免首帧闪一下白/深色底
    ("EMBEDDED_KIT", "embedded_kit.txt", "headtop", "all"),
    ("DARK_UNIFY", "dark_unify.navy.txt", "head", "all"),
    ("SUB_THEME_KIT", "sub_theme_kit.txt", "head", "all"),
    ("AQUATIC_BG_KIT", "aquatic-bg-kit.txt", "body", "screen"),
    ("SUB_THEME_BRIDGE", "sub_theme_bridge.txt", "body", "screen"),
]

# 注意：后缀必须拼进每个交替项里，写成 "%s_START" 只会挂到最后一项上（这个坑实测过一次）。
START_RE = re.compile(
    r"<!--\s*(%s)(?: v\d+)?\s*-->" % "|".join(b[0] + "_START" for b in BLOCKS)
)


def load_kit(tag, name):
    with open(os.path.join(KIT_DIR, name), encoding="utf-8") as fh:
        body = fh.read().strip("\n")
    return "<!-- %s_START -->\n%s\n<!-- %s_END -->" % (tag, body, tag)


def payload_body(payload):
    """取载荷里面的正文（不含 START/END 注释行），用于判断是否已经是最新版。"""
    return payload.split("\n", 1)[1].rsplit("\n", 1)[0]


def block_present(text, tag):
    """返回 (是否已有块, 块内容或 None)"""
    m = START_RE.search(text)
    while m:
        name = m.group(1).rsplit("_START", 1)[0]
        if name == tag:
            en = text.find("<!-- %s_END -->" % tag, m.start())
            if en >= 0:
                body = text[m.end():en].strip("\n")
                return True, body
        m = START_RE.search(text, m.end())
    return False, None


def strip_legacy_embedded(text):
    """清掉手工注入过的 embedded 三件套（无 START/END 注释包裹的旧版本）。

    为什么必须：EMBEDDED_KIT 早期是靠手改塞进 17 个 index.html 的，injector 认不出它们；
    不清就直接说我一块已经存在——结果是同一份脚本出现两次（玻璃化跑两遍，MutationObserver 翻倍）。
    """
    pats = [
        r'<script>try\{if\(window\.parent&&window\.parent!==window\)\{[^<]*\}\s*</script>\n?',
        r'<style id="embedded-transparent">.*?</style>\n?',
        r'<script id="embedded-glassify">.*?</script>\n?',
    ]
    for p in pats:
        text = re.sub(p, "", text, flags=re.S)
    return text


HEAD_RE = re.compile(r"<head[^>]*>", re.I)


def inject(text, tag, pbody, payload, where, force):
    has, body = block_present(text, tag)
    if has and not force:
        return text, "skip"
    if has and body == pbody:
        return text, "same"
    # 移除旧块。只删到 END 注释的 "-->" 为止；仅当 END 独占一行时才连换行一起删。
    # （否则会吞掉与 END 同行的后续内容：labor 的 <meta>/<title>/<style> 开标签就是这么没的，
    #   CSS 裸奔成正文——2026-09-28 实锤，见 process/03-问题台账。）
    if has:
        m = START_RE.search(text)
        while m:
            name = m.group(1).rsplit("_START", 1)[0]
            endmark = "<!-- %s_END -->" % name
            en = text.find(endmark, m.start())
            if name == tag and en >= 0:
                cut = en + len(endmark)
                nl = text.find("\n", cut)
                rest = text[cut:nl if nl >= 0 else len(text)]
                if rest.strip() == "":
                    cut = (nl + 1) if nl >= 0 else len(text)
                text = text[:m.start()] + text[cut:]
                break
            m = START_RE.search(text, m.end())
    if tag == "EMBEDDED_KIT":
        text = strip_legacy_embedded(text)
    # 插入新块
    if where == "headtop":
        m = HEAD_RE.search(text)
        if not m:
            return text, "noanchor"
        text = text[: m.end()] + "\n" + payload + "\n" + text[m.end():]
        return text, "replace" if has else "add"
    anchor = "</head>" if where == "head" else "</body>"
    idx = text.rfind(anchor)
    if idx < 0:
        return text, "noanchor"
    text = text[:idx] + payload + "\n" + text[idx:]
    return text, "replace" if has else "add"


def is_screen_page(path):
    return "print" not in os.path.basename(path).lower()


def process(path, kits, force, apply_changes):
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    orig = text
    report = []
    for tag, kitfile, where, scope in BLOCKS:
        if scope == "screen" and not is_screen_page(path):
            continue
        payload = load_kit(tag, kitfile)
        text, act = inject(text, tag, payload_body(payload), payload, where, force)
        if act in ("add", "replace"):
            report.append((tag, act))
    if text != orig and apply_changes:
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(text)
    return report


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dirs", nargs="+", help="要处理的目录（如 public/retail-ad）")
    ap.add_argument("--fix", action="store_true", help="同时把内容过时的旧块刷新为最新版")
    ap.add_argument("--check", action="store_true", help="只体检不改动；不干净时退出码为 1")
    ap.add_argument("--print-plan", action="store_true", help="打印将要改动的内容并跳过写盘")
    args = ap.parse_args()

    apply_changes = not (args.check or args.print_plan)
    total_files = total_blocks = 0
    bad = 0

    for d in args.dirs:
        if not os.path.isdir(d):
            print("目录不存在: %s" % d)
            bad += 1
            continue
        for root, _, files in os.walk(d):
            for fn in sorted(files):
                if not fn.endswith(".html"):
                    continue
                path = os.path.join(root, fn)
                total_files += 1
                report = process(path, None, args.fix, apply_changes)
                if report:
                    total_blocks += len(report)
                    acts = ",".join("%s:%s" % (t, a) for t, a in report)
                    print("[%s] %s" % ("PLAN" if not apply_changes else "WRITE", path))
                    print("        %s" % acts)
                    if args.check or args.print_plan:
                        bad += 1

    if args.check:
        if bad:
            print("\n体检不通过：%d 个文件缺少或使用了过时的主题补丁" % bad)
            return 1
        print("体检通过：%d 个 HTML 均已带最新主题补丁" % total_files)
        return 0

    print("完成：处理 %d 个 HTML，%d 处补丁变更%s" % (
        total_files, total_blocks, "（计划模式，未写盘）" if not apply_changes else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
