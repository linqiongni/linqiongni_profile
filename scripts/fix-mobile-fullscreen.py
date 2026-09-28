#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""法务实务 iframe 子站：手机端「全屏」按钮改为 CSS 沉浸式，绕过 iOS Safari 原生全屏的「上滑退出」痛点。

根因：子站顶栏的「全屏」按钮调用 document.documentElement.requestFullscreen（原生 Fullscreen API）。
iOS Safari 进入原生全屏后，向上滑动会触发系统级退出手势，且 JS 无法拦截 —— 体感很差。

修复：
1. 手机端（innerWidth <= 1000px，与子站移动适配断点一致）不调用原生全屏，改为切换
   <html class="fs-immersive">，配套 CSS 隐藏 #topbar，内容原生滚动（上滑只是正常阅读滚动）。
2. 宽屏（>1000px）行为完全不变：仍用原生 requestFullscreen。
3. 旋转/拉伸到宽屏时清除可能残留的沉浸式，避免顶栏被永久隐藏。

逐个文件精确替换（每个 old_string 在文件内唯一），失败即报错不静默。
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGETS = [
    "public/commercial-ops/assets/app.js",
    "public/financing-legal/assets/app.js",
    "public/ip/assets/app.js",
    "public/logistics/assets/app.js",
    "public/retail-ad/assets/app.js",
]

# 四个站（commercial-ops / financing-legal / ip / logistics）的 handler 完全一致
OLD_COMMON = '''  function isFs() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }
  function syncFsBtn() {
    var on = isFs();
    fsBtn.textContent = on ? "退出全屏" : "全屏";
    fsBtn.title = on ? "退出全屏（Esc）" : "全屏显示（不跳新页面，Esc 退出）";
    fsBtn.classList.toggle("on", on);
  }
  fsBtn.addEventListener("click", function () {
    var d = document, r = d.documentElement;
    try {
      if (isFs()) {
        var ex = d.exitFullscreen || d.webkitExitFullscreen;
        if (ex) { var p = ex.call(d); if (p && p["catch"]) p["catch"](function () {}); }
        return;
      }
      var rq = r.requestFullscreen || r.webkitRequestFullscreen;
      if (!rq) { fsBtn.title = "此浏览器不支持全屏"; return; }
      var q = rq.call(r);
      if (q && q["catch"]) q["catch"](function () { fsBtn.title = "浏览器拒绝全屏（直接访问本站可正常全屏）"; });
    } catch (e) {
      fsBtn.title = "全屏被浏览器拒绝（Esc 可退出）";
    }
  });
  document.addEventListener("fullscreenchange", syncFsBtn);'''

NEW_COMMON = '''  function isFs() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }
  // 手机端（<=1000px）不调用原生 Fullscreen API：iOS Safari 全屏态上滑必退出，JS 拦不住。
  // 改用 CSS 沉浸式（隐藏顶栏），内容原生滚动，上滑只是正常阅读不会退出。
  function isImmersive() { return document.documentElement.classList.contains("fs-immersive"); }
  function syncFsBtn() {
    var on = isFs() || isImmersive();
    fsBtn.textContent = on ? "退出全屏" : "全屏";
    fsBtn.title = on ? "退出全屏（Esc）" : "全屏显示（不跳新页面，Esc 退出）";
    fsBtn.classList.toggle("on", on);
  }
  fsBtn.addEventListener("click", function () {
    // 手机端：切换 CSS 沉浸式，绕过原生全屏的「上滑退出」痛点
    if (window.innerWidth <= 1000) {
      var willOn = !isImmersive();
      document.documentElement.classList.toggle("fs-immersive");
      if (willOn) { try { window.scrollTo(0, 0); } catch (e) {} }
      syncFsBtn();
      return;
    }
    var d = document, r = d.documentElement;
    try {
      if (isFs()) {
        var ex = d.exitFullscreen || d.webkitExitFullscreen;
        if (ex) { var p = ex.call(d); if (p && p["catch"]) p["catch"](function () {}); }
        return;
      }
      var rq = r.requestFullscreen || r.webkitRequestFullscreen;
      if (!rq) { fsBtn.title = "此浏览器不支持全屏"; return; }
      var q = rq.call(r);
      if (q && q["catch"]) q["catch"](function () { fsBtn.title = "浏览器拒绝全屏（直接访问本站可正常全屏）"; });
    } catch (e) {
      fsBtn.title = "全屏被浏览器拒绝（Esc 可退出）";
    }
  });
  // 旋转/拉伸到宽屏时清除可能残留的沉浸式，避免顶栏被永久隐藏
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1000 && isImmersive()) {
      document.documentElement.classList.remove("fs-immersive");
      syncFsBtn();
    }
  });
  document.addEventListener("fullscreenchange", syncFsBtn);'''

# retail-ad 是紧凑单行版
OLD_RETAIL = '''  function isFs() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function syncFsBtn() {
    var on = isFs();
    fsBtn.textContent = on ? "退出全屏" : "全屏";
    fsBtn.classList.toggle("on", on);
  }
  fsBtn.addEventListener("click", function () {
    var d = document, r = d.documentElement;
    try {
      if (isFs()) { var ex = d.exitFullscreen || d.webkitExitFullscreen; if (ex) { var p = ex.call(d); if (p && p["catch"]) p["catch"](function () {}); } return; }
      var rq = r.requestFullscreen || r.webkitRequestFullscreen;
      if (!rq) return;
      var q = rq.call(r); if (q && q["catch"]) q["catch"](function () {});
    } catch (e) {}
  });
  document.addEventListener("fullscreenchange", syncFsBtn);
  document.addEventListener("webkitfullscreenchange", syncFsBtn);'''

NEW_RETAIL = '''  function isFs() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function isImmersive() { return document.documentElement.classList.contains("fs-immersive"); }
  function syncFsBtn() {
    var on = isFs() || isImmersive();
    fsBtn.textContent = on ? "退出全屏" : "全屏";
    fsBtn.classList.toggle("on", on);
  }
  fsBtn.addEventListener("click", function () {
    if (window.innerWidth <= 1000) {
      var willOn = !isImmersive();
      document.documentElement.classList.toggle("fs-immersive");
      if (willOn) { try { window.scrollTo(0, 0); } catch (e) {} }
      syncFsBtn();
      return;
    }
    var d = document, r = d.documentElement;
    try {
      if (isFs()) { var ex = d.exitFullscreen || d.webkitExitFullscreen; if (ex) { var p = ex.call(d); if (p && p["catch"]) p["catch"](function () {}); } return; }
      var rq = r.requestFullscreen || r.webkitRequestFullscreen;
      if (!rq) return;
      var q = rq.call(r); if (q && q["catch"]) q["catch"](function () {});
    } catch (e) {}
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1000 && isImmersive()) {
      document.documentElement.classList.remove("fs-immersive");
      syncFsBtn();
    }
  });
  document.addEventListener("fullscreenchange", syncFsBtn);
  document.addEventListener("webkitfullscreenchange", syncFsBtn);'''

CSS_BLOCK = '''
/* 手机端「全屏」按钮 → CSS 沉浸式（隐藏顶栏），不调用原生 Fullscreen API
   原因：iOS Safari 进入原生全屏后，向上滑动会触发系统退出手势，体感很差。
   改为隐藏顶栏、内容原生滚动，上滑是正常阅读滚动而非退出。仅在 <=1000px 生效。 */
@media (max-width: 1000px) {
  html.fs-immersive #topbar { display: none !important; }
  html.fs-immersive body { overflow: visible; }
}
'''

changed = 0
for rel in TARGETS:
    p = os.path.join(ROOT, rel)
    with open(p, encoding="utf-8") as f:
        s = f.read()
    if rel == "public/retail-ad/assets/app.js":
        old, new = OLD_RETAIL, NEW_RETAIL
    else:
        old, new = OLD_COMMON, NEW_COMMON
    cnt = s.count(old)
    if cnt != 1:
        print("ERROR: %s 命中 %d 次（期望 1），跳过" % (rel, cnt))
        sys.exit(1)
    s = s.replace(old, new, 1)

    # 追加 CSS 到对应 style.css（幂等：已有标记则跳过）
    css_p = os.path.join(ROOT, rel.replace("assets/app.js", "assets/style.css"))
    with open(css_p, encoding="utf-8") as f:
        css = f.read()
    if "fs-immersive" not in css:
        css = css.rstrip() + "\n" + CSS_BLOCK
        with open(css_p, "w", encoding="utf-8") as f:
            f.write(css)
    else:
        print("  (style.css 已含 fs-immersive，跳过追加)")

    with open(p, "w", encoding="utf-8") as f:
        f.write(s)
    changed += 1
    print("OK: %s" % rel)

print("已处理 %d 个文件" % changed)
