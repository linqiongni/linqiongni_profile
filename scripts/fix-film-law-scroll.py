#!/usr/bin/env python3
"""film-law 四季页面：内容独立滚动容器改造（对齐主站导航条方案）。

病根：.topbar 是 position:sticky，嵌入主站 iframe 时玻璃化脚本把它的
不透明深色 background-color 清成透明（该分支无尺寸保护）→ 滚动时内容
从 sticky 顶栏底下穿过 → 叠字。

改法（与主站 Navbar 同机制）：页面本身不滚（body 100dvh overflow:hidden），
main+footer 包进 .page-scroll 独立滚动容器，内容永不进顶栏区。
app.js 的 window.scrollTo(0,0) 同步改为作用于容器。
"""
import re
import sys

ROOT = "/Users/linqiongni/Downloads/linqiongni_profile"
DIRS = ["film-law", "film-law-s2", "film-law-s3", "film-law-s4"]
V = "20260928scroll"

CSS_BODY_OLD = "body{background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.65;font-size:16px}"
CSS_BODY_NEW = ("body{background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.65;font-size:16px;"
                "display:flex;flex-direction:column;height:100vh;height:100dvh;overflow:hidden}")
CSS_HTMLBODY_OLD = "html,body{margin:0;padding:0}"
CSS_HTMLBODY_NEW = "html,body{margin:0;padding:0;height:100%}"
CSS_TOPBAR_OLD = "position:sticky;top:0;z-index:20"
CSS_TOPBAR_NEW = "position:relative;z-index:20"
CSS_SCROLL_RULE = (".page-scroll{flex:1;min-height:0;overflow-y:auto;"
                   "-webkit-overflow-scrolling:touch;scroll-behavior:auto}")

HELPER = ("function __filmTop(){var el=document.querySelector('.page-scroll');"
          "if(el){el.scrollTop=0;return;}window.scrollTo(0,0);}\n")

fail = 0

def sub_once(text, old, new, label, path, count=1):
    n = text.count(old)
    if n != count:
        print(f"  FAIL {label}: 期望 {count} 处，实际 {n} 处 — {path}")
        return None
    return text.replace(old, new)

for d in DIRS:
    print(f"== {d} ==")
    # ---------- index.html ----------
    p = f"{ROOT}/public/{d}/index.html"
    s = open(p, encoding="utf-8").read()
    s2 = sub_once(s, "</header>", '</header>\n\n  <div class="page-scroll">', "html:开容器", p)
    if s2 is None: fail = 1; continue
    s3 = sub_once(s2, '  <script src="data.js"></script>',
                  '  </div><!-- /.page-scroll -->\n\n  <script src="data.js"></script>',
                  "html:闭容器", p)
    if s3 is None: fail = 1; continue
    # JS/CSS 引用加版本号（防 GH Pages 缓存旧 bundle）
    s4 = sub_once(s3, 'styles.css"', f'styles.css?v={V}"', "html:css版本号", p)
    if s4 is None: fail = 1; continue
    s5 = sub_once(s4, '<script src="app.js"></script>', f'<script src="app.js?v={V}"></script>', "html:js版本号", p)
    if s5 is None: fail = 1; continue
    open(p, "w", encoding="utf-8").write(s5)
    print("  index.html ok")

    # ---------- styles.css ----------
    p = f"{ROOT}/public/{d}/styles.css"
    s = open(p, encoding="utf-8").read()
    s2 = sub_once(s, CSS_HTMLBODY_OLD, CSS_HTMLBODY_NEW, "css:html,body", p)
    if s2 is None: fail = 1; continue
    s3 = sub_once(s2, CSS_BODY_OLD, CSS_BODY_NEW, "css:body", p)
    if s3 is None: fail = 1; continue
    s4 = sub_once(s3, CSS_TOPBAR_OLD, CSS_TOPBAR_NEW, "css:topbar", p)
    if s4 is None: fail = 1; continue
    # .page-scroll 规则插在 #app 规则前
    s5 = sub_once(s4, "#app{", CSS_SCROLL_RULE + "\n#app{", "css:page-scroll", p)
    if s5 is None: fail = 1; continue
    open(p, "w", encoding="utf-8").write(s5)
    print("  styles.css ok")

    # ---------- app.js ----------
    p = f"{ROOT}/public/{d}/app.js"
    s = open(p, encoding="utf-8").read()
    n = s.count("window.scrollTo(0,0);")
    if n != 3:
        print(f"  FAIL app.js: scrollTo 期望 3 处，实际 {n} 处 — {p}"); fail = 1; continue
    s = s.replace("window.scrollTo(0,0);", "__filmTop();")
    open(p, "w", encoding="utf-8").write(HELPER + s)
    print("  app.js ok (3 处 scrollTo 已改)")

print("DONE", "FAIL" if fail else "OK")
sys.exit(fail)
