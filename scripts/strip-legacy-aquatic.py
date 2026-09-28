#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""一次性清理（2026-09-28）：对齐个人页鱼影真相源。

背景：public/ 下曾有三种互相打架的鱼影实现——
  1) 注入器装的 AQUATIC_BG_KIT（v3，6 条鱼、速度 2.5 倍、嵌入态也自绘 → 与主站 9 条月光鱼叠加）
  2) 手工塞的 AQUATIC_BG_KIT_START v4-profile 块（ loads profile-bg.js + 一份样式拷贝）
  3) econ-crime 专属 assets/aquatic.js + aquatic.css（又一套 6 条鱼 + 水波高度场）

本脚本做两件事（幂等，可重复跑）：
  A. 删掉所有 v4-profile 块（新 kit 自己会按需加载 profile-bg.js，样式由 profile-bg.js 自带）
  B. 删掉 econ-crime 页面里对 assets/aquatic.js / assets/aquatic.css 的引用
之后跑 apply-theme-kit.py --fix 把新版 kit（嵌入=转发指针不自绘 / 独立=加载 profile-bg.js）重放全量。
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public")

V4_RE = re.compile(
    r"[ \t]*<!--\s*(?:AQUATIC|PROFILE)_BG_KIT_START v4-profile\s*-->.*?<!--\s*(?:AQUATIC|PROFILE)_BG_KIT_END\s*-->\n?",
    re.S,
)
# print 类页面里手工塞的旧 v3 鱼影 kit（有 START/END 注释框住整套 style+div+script），整块清掉
V3_RE = re.compile(
    r"[ \t]*<!--\s*AQUATIC_BG_KIT_START v3\s*-->.*?<!--\s*AQUATIC_BG_KIT_END\s*-->\n?",
    re.S,
)
# print 类页面里手工塞的整套旧鱼影 kit（无需鱼影，整体清掉）
PRINT_KIT_RE = re.compile(
    r"[ \t]*<style id=\"aquatic-bg-kit\">.*?</style>\n?[ \t]*<div class=\"aq-bg\"[^>]*>.*?</div>\n?[ \t]*<script>\(function\(\)\{if\(window\.__aqKitV3\).*?\}\(\)\);</script>\n?",
    re.S,
)
CSS_RE = re.compile(r'[ \t]*<link rel="stylesheet" href="assets/aquatic\.css">\n?')
JS_RE = re.compile(r'[ \t]*<script src="assets/aquatic\.js"></script>\n?')

stripped_v4 = stripped_css = stripped_js = touched = 0

for root, _, files in os.walk(PUB):
    for fn in sorted(files):
        if not fn.endswith(".html"):
            continue
        path = os.path.join(root, fn)
        with open(path, encoding="utf-8") as fh:
            text = fh.read()
        orig = text
        text, n1 = V4_RE.subn("", text)
        text, n3v = V3_RE.subn("", text)
        text, n4 = PRINT_KIT_RE.subn("", text)
        text, n2 = CSS_RE.subn("", text)
        text, n3 = JS_RE.subn("", text)
        stripped_v4 += n1 + n3v + n4
        stripped_css += n2
        stripped_js += n3
        if text != orig:
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(text)
            touched += 1

print("v4-profile 块删除 %d 处；aquatic.css 引用删除 %d 处；aquatic.js 引用删除 %d 处；改写 %d 个文件"
      % (stripped_v4, stripped_css, stripped_js, touched))
