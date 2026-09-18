/* 融资法务 · 导航注入 / 主题切换 / 阅读进度 —— 纯本地，无外部依赖 */
(function () {
  "use strict";

  var BASE = (function () {
    // 支持 index.html 与子目录两种摆放方式
    return "";
  })();

  var STATIONS = [
    { id: "index", file: BASE + "index.html", no: "总纲", name: "总纲 · 十二站地图" },
    { id: "ch01", file: BASE + "ch01-foundation.html", no: "01", name: "创业起步 · 股权架构" },
    { id: "ch02", file: BASE + "ch02-esop.html", no: "02", name: "股权激励 ESOP" },
    { id: "ch03", file: BASE + "ch03-deal-terms.html", no: "03", name: "融资交易 · Term Sheet" },
    { id: "ch04", file: BASE + "ch04-due-diligence.html", no: "04", name: "法律尽职调查" },
    { id: "ch05", file: BASE + "ch05-jv-agreement.html", no: "05", name: "合资协议起草" },
    { id: "ch06", file: BASE + "ch06-setup.html", no: "06", name: "公司设立 · 红筹架构" },
    { id: "ch07", file: BASE + "ch07-compliance.html", no: "07", name: "合规与风控" },
    { id: "ch08", file: BASE + "ch08-equity-change.html", no: "08", name: "股权变更 · 并购重组" },
    { id: "ch09", file: BASE + "ch09-governance.html", no: "09", name: "治理结构设计" },
    { id: "ch10", file: BASE + "ch10-hkex-rules.html", no: "10", name: "港股上市规则" },
    { id: "ch11", file: BASE + "ch11-ipo-process.html", no: "11", name: "IPO 全流程" },
    { id: "ch12", file: BASE + "ch12-post-listing.html", no: "12", name: "上市后合规 · 披露" },
    { id: "ch13", file: BASE + "ch13-cases.html", no: "13", name: "真实案例库" }
  ];

  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("fin-legal-theme", t); } catch (e) {}
    var b = document.getElementById("themeBtn");
    if (b) b.textContent = t === "dark" ? "☀" : "☾";
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("fin-legal-theme"); } catch (e) {}
    if (!saved) {
      saved = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    applyTheme(saved);
    var b = document.getElementById("themeBtn");
    if (b) b.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      applyTheme(cur === "dark" ? "light" : "dark");
    });
  }

  function buildTopbar(cur) {
    var links = STATIONS.map(function (s) {
      return '<a href="' + s.file + '"' + (s.id === cur ? ' class="on"' : "") + ">" +
        (s.id === "index" ? "总纲" : s.no) + " " + (s.id === "index" ? "" : s.name.split(" · ")[0]) +
        "</a>";
    }).join("");
    var html =
      '<div class="topbar-inner">' +
      '<a class="brand" href="' + BASE + 'index.html"><span class="seal">融</span><span class="txt">融资法务 · 从 0 到 1</span></a>' +
      '<nav class="stations">' + links + "</nav>" +
      '<button class="theme-btn" id="themeBtn" title="切换深浅色">☾</button>' +
      "</div>";
    var el = document.getElementById("topbar");
    if (el) el.innerHTML = html;
  }

  function buildPager(cur) {
    var el = document.getElementById("pager");
    if (!el) return;
    var i = -1;
    for (var k = 0; k < STATIONS.length; k++) { if (STATIONS[k].id === cur) { i = k; break; } }
    if (i < 0) return;
    var prev = i > 0 ? STATIONS[i - 1] : null;
    var next = i < STATIONS.length - 1 ? STATIONS[i + 1] : null;
    var h = "";
    if (prev) h += '<a href="' + prev.file + '"><div class="dir">← 上一站</div><div class="ttl">' + (prev.id === "index" ? "总纲 · 十二站地图" : prev.no + " " + prev.name) + "</div></a>";
    else h += '<a href="' + BASE + 'index.html"><div class="dir">← 返回</div><div class="ttl">总纲 · 十二站地图</div></a>';
    if (next) h += '<a href="' + next.file + '" style="text-align:right"><div class="dir">下一站 →</div><div class="ttl">' + next.no + " " + next.name + "</div></a>";
    el.className = "pager";
    el.innerHTML = h;
  }

  function progress() {
    var bar = document.createElement("div");
    bar.className = "readbar";
    bar.id = "readbar";
    document.body.appendChild(bar);
    function upd() {
      var h = document.documentElement;
      var pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = (isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 0) + "%";
    }
    window.addEventListener("scroll", upd, { passive: true });
    upd();
  }

  // 正文中的「知识锚点」（.xref / [data-deep]）：
  // 点击后自动展开目标 <details> 深度补充面板，并平滑滚动到该处。
  function deepLinks() {
    var links = document.querySelectorAll("[data-deep]");
    Array.prototype.forEach.call(links, function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("data-deep");
        var d = document.getElementById(id);
        if (!d) return;
        e.preventDefault();
        if (d.tagName === "DETAILS" && !d.open) d.open = true;
        // 展开会改变高度，稍等一帧再滚动，定位更准
        setTimeout(function () {
          d.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 40);
        if (history.replaceState) history.replaceState(null, "", "#" + id);
      });
    });
  }

  // 折叠控件：[data-fold] 按钮 → 就地展开/收起，不做任何滚动跳转
  function foldControls() {
    var btns = document.querySelectorAll("[data-fold]");
    Array.prototype.forEach.call(btns, function (btn) {
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("data-fold") === "open";
        var kind = btn.getAttribute("data-fold-kind") || "all";
        var scopeId = btn.getAttribute("data-fold-scope");
        var root = scopeId ? (document.getElementById(scopeId) || document) : document;
        var sel = kind === "all" ? "details.tpl, details.peek" : "details." + kind;
        var ds = root.querySelectorAll(sel);
        Array.prototype.forEach.call(ds, function (d) { d.open = open; });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var cur = (document.body.getAttribute("data-station") || "index").trim();
    buildTopbar(cur);
    buildPager(cur);
    initTheme();
    progress();
    deepLinks();
    foldControls();
  });
})();
