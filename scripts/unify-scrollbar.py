#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""统一全站暗色滚动条为灰黑基线（用户反馈：律师实务组滚动条发蓝，与别站不统一）。

普查结论（scrollbar-color 暗色值）：
- 灰派基线（不动）：ai-law/commercial-ops/english/film-law*/financing-legal/ip/logistics/retail-ad
  = thumb #2C2C2E / track #1C1C1E / hover #3A3A3C
- 蓝派（改）：arbitration/criminal/econ-crime/family-law/insurance = thumb #1B2E45(描边蓝)/track #091A2E
- 缺规则（补齐）：labor（律师实务组，无任何 scrollbar 规则=UA 默认浅色条）

只动 scrollbar 规则内的色值，#091A2E 在别处作背景色使用不受影响。逐行精确替换。
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BLUE_TRACK = 'html[data-theme="dark"] ::-webkit-scrollbar-track { background: #091A2E; }'
GREY_TRACK = 'html[data-theme="dark"] ::-webkit-scrollbar-track { background: #1C1C1E; }'
BLUE_THUMB = 'html[data-theme="dark"] ::-webkit-scrollbar-thumb { background: #1B2E45; border-radius: 5px; border: 2px solid #091A2E; }'
GREY_THUMB = 'html[data-theme="dark"] ::-webkit-scrollbar-thumb { background: #2C2C2E; border-radius: 5px; border: 2px solid #1C1C1E; }'
BLUE_HOVER = 'html[data-theme="dark"] ::-webkit-scrollbar-thumb:hover { background: #2A3E52; }'
GREY_HOVER = 'html[data-theme="dark"] ::-webkit-scrollbar-thumb:hover { background: #3A3A3C; }'
BLUE_COLOR = "scrollbar-color: #1B2E45 #091A2E"
GREY_COLOR = "scrollbar-color: #2C2C2E #1C1C1E"

LABOR_BLOCK = """
/* 暗色滚动条（2026-09-28 全站统一灰黑基线，与其余子站一致） */
html[data-theme="dark"] ::-webkit-scrollbar { width: 10px; height: 10px; }
html[data-theme="dark"] ::-webkit-scrollbar-track { background: #1C1C1E; }
html[data-theme="dark"] ::-webkit-scrollbar-thumb { background: #2C2C2E; border-radius: 5px; border: 2px solid #1C1C1E; }
html[data-theme="dark"] ::-webkit-scrollbar-thumb:hover { background: #3A3A3C; }
html[data-theme="dark"] { scrollbar-width: thin; scrollbar-color: #2C2C2E #1C1C1E; }
"""

# 各站含 scrollbar 规则的 css 文件（蓝派 5 站）
BLUE_SITES = {
    "arbitration": "public/arbitration/assets/style.css",
    "criminal": "public/criminal/assets/crim-style.css",
    "econ-crime": "public/econ-crime/assets/style.css",
    "family-law": "public/family-law/assets/style.css",
    "insurance": "public/insurance/styles.css",
}

# 版本号 bump：css 文件改了必须同步 bump index.html 的 ?v=（真机缓存教训）
BUMP = {
    "arbitration": [("public/arbitration/index.html", ".css?v=3", ".css?v=4")],
    "criminal": [("public/criminal/index.html", ".css?v=3", ".css?v=4")],
    "econ-crime": [("public/econ-crime/index.html", ".css?v=3", ".css?v=4")],
    "family-law": [("public/family-law/index.html", "style.css?v=20260919b", "style.css?v=20260928b")],
    "insurance": [("public/insurance/index.html", ".css?v=3", ".css?v=4")],
    "labor": [("public/labor/index.html", "layout.css?v=3", "layout.css?v=4")],
}

for site, css_rel in BLUE_SITES.items():
    p = os.path.join(ROOT, css_rel)
    s = open(p, encoding="utf-8").read()
    for old, new in [(BLUE_TRACK, GREY_TRACK), (BLUE_THUMB, GREY_THUMB), (BLUE_HOVER, GREY_HOVER), (BLUE_COLOR, GREY_COLOR)]:
        cnt = s.count(old)
        if cnt == 0:
            print("WARN: %s 无此规则（跳过）: %s" % (css_rel, old[:60]))
            continue
        s = s.replace(old, new)
    open(p, "w", encoding="utf-8").write(s)
    print("OK css:", css_rel)

# labor：补齐暗色滚动条规则
labor_css = os.path.join(ROOT, "public/labor/assets/layout.css")
s = open(labor_css, encoding="utf-8").read()
if "scrollbar-color" not in s:
    open(labor_css, "w", encoding="utf-8").write(s.rstrip() + "\n" + LABOR_BLOCK)
    print("OK labor 追加滚动条规则")
else:
    print("  (labor 已有 scrollbar-color，跳过)")

# 版本号 bump
for site, pairs in BUMP.items():
    for html_rel, old, new in pairs:
        p = os.path.join(ROOT, html_rel)
        h = open(p, encoding="utf-8").read()
        n = h.count(old)
        if n == 0:
            print("ERROR: %s 未找到 %s" % (html_rel, old))
            sys.exit(1)
        open(p, "w", encoding="utf-8").write(h.replace(old, new))
        print("OK bump: %s  %s -> %s (x%d)" % (site, old, new, n))

print("全部完成")
