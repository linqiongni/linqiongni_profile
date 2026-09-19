/* 劳动用工实务 · 站点脚本（左侧固定目录栏 + 主区 + 右侧本页目录 + 左折叠）
   数据源：下方 STATIONS 数组。正文页只需 <body data-station="...">。
   正文配色沿用各页内联 CSS 的 --bg/--panel/--line/--gold/--tx 等变量（暗色）。
   移除旧顶栏（class="topbar"），由本脚本重建顶栏（品牌 + 搜索 + 菜单）。 */
(function () {
  "use strict";

  var BASE = "";

  var STATIONS = [
    { id: "index", file: BASE + "index.html", no: "总纲", t: "总纲 · 劳动用工实务地图", part: "开始", kw: "目录 怎么用 双视角 法源 劳动者 用人单位 导学" },
    { id: "base", file: BASE + "base.html", no: "01", t: "通用底座：劳动关系与用工形态", part: "PART I · 基础底座", kw: "劳动关系 用工形态 劳动合同 劳务派遣 外包 实习 退休返聘 事实劳动关系" },
    { id: "clash", file: BASE + "clash.html", no: "02", t: "攻防对照：高频争议焦点", part: "PART I · 基础底座", kw: "攻防 争议 加班 工资 社保 解除 经济补偿金 二倍工资 竞业限制" },
    { id: "employee", file: BASE + "employee.html", no: "03", t: "劳动者视角 · 维权", part: "PART II · 双视角实务", kw: "劳动者 维权 仲裁 诉讼 证据 被迫解除 工伤 职业病 投诉" },
    { id: "employer", file: BASE + "employer.html", no: "04", t: "用人单位视角 · 合规", part: "PART II · 双视角实务", kw: "用人单位 合规 规章制度 民主程序 解除合规 风险 用工管理" },
    { id: "law", file: BASE + "law.html", no: "05", t: "法条库与术语表", part: "PART III · 法条 · 路线 · 工具", kw: "法条 劳动合同法 术语 司法解释 社保法 劳动争议调解仲裁法" },
    { id: "route", file: BASE + "route.html", no: "06", t: "28 天导学路线", part: "PART III · 法条 · 路线 · 工具", kw: "导学 28天 计划 学习路线 训练 复盘" },
    { id: "templates", file: BASE + "templates.html", no: "07", t: "文书模板库", part: "PART III · 法条 · 路线 · 工具", kw: "文书 模板 劳动合同 解除通知 仲裁申请书 竞业限制 保密" },
    { id: "tools", file: BASE + "tools.html", no: "08", t: "计算器 · 实务小工具", part: "PART III · 法条 · 路线 · 工具", kw: "计算器 经济补偿 加班费 年休假 工资 赔偿 工具" }
  ];

  var PARTS = [
    { key: "开始", name: "总纲", desc: "全站结构与双视角说明" },
    { key: "PART I · 基础底座", name: "PART I · 基础底座", desc: "劳动关系认定 · 高频争议攻防对照" },
    { key: "PART II · 双视角实务", name: "PART II · 双视角实务", desc: "劳动者维权 · 用人单位合规" },
    { key: "PART III · 法条 · 路线 · 工具", name: "PART III · 法条 · 路线 · 工具", desc: "法条术语 · 28 天导学 · 文书模板 · 计算器" }
  ];

  var cur = (document.body.getAttribute("data-station") || "index").trim();
  var idx = -1;
  for (var k = 0; k < STATIONS.length; k++) { if (STATIONS[k].id === cur) { idx = k; break; } }
  if (idx < 0) idx = 0;
  var me = STATIONS[idx];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function hrefOf(s) { return s.file; }

  /* ---------- 主题（监听主站 postMessage；本手册仅暗色，浅色回退仍为暗色） ---------- */
  function applyTheme(t) { document.documentElement.setAttribute("data-theme", t); }
  window.addEventListener("message", function (e) {
    var d = e.data || {};
    if (d.type === "theme" && (d.mode === "dark" || d.mode === "light")) applyTheme(d.mode);
  });

  /* ---------- 重构 DOM：顶栏 + 左侧目录栏 + 主区 + 右侧本页目录 ---------- */
  var body = document.body;
  var orig = [].slice.call(body.childNodes).filter(function (n) {
    if (n.nodeType === 1 && n.tagName === "SCRIPT") return false;
    if (n.nodeType === 1 && n.classList && n.classList.contains("topbar")) return false; // 旧顶栏，已被新顶栏取代
    return true;
  });
  // 物理移除 HTML 中的旧顶栏占位（避免与新顶栏 class 同名冲突）
  var oldTops = [].slice.call(body.querySelectorAll(".topbar"));
  oldTops.forEach(function (t) { if (t.parentNode) t.parentNode.removeChild(t); });

  var topbar = el("header", "topbar");
  topbar.id = "topbar";
  var brand = el("a", "brand", '<span class="seal">劳</span><span class="txt">劳动用工实务 · 双视角</span>');
  brand.href = BASE + "index.html";
  topbar.appendChild(brand);

  var searchWrap = el("div", "searchwrap");
  var search = el("input");
  search.id = "search"; search.type = "search"; search.autocomplete = "off";
  search.placeholder = "搜索：加班费 / 二倍工资 / 竞业限制 / 解除 / 工伤…";
  searchWrap.appendChild(search);
  var searchCount = el("span", "scount");
  searchWrap.appendChild(searchCount);
  topbar.appendChild(searchWrap);

  topbar.appendChild(el("span", "cur-chip", me.no === "总纲" ? me.t : "第 " + me.no + " 篇 · " + me.t));
  var menuBtn = el("button", "menu-btn", "目录");
  menuBtn.setAttribute("aria-label", "打开目录");
  topbar.appendChild(menuBtn);

  var layout = el("div", "layout");
  var side = el("aside", "side"); side.id = "side";
  var sideHd = el("div", "side-hd");
  sideHd.appendChild(el("span", "t", "目录"));
  var collapseBtn = el("button", "collapse-btn", "⟨");
  collapseBtn.setAttribute("aria-label", "收起目录");
  collapseBtn.title = "收起目录（左折叠）";
  sideHd.appendChild(collapseBtn); side.appendChild(sideHd);

  var main = el("div", "main"); main.id = "main";
  var bodywrap = el("div", "bodywrap");
  var content = el("div", "content");
  orig.forEach(function (n) { content.appendChild(n); });
  var tocBox = el("aside", "pagetoc"); tocBox.id = "pagetoc";
  bodywrap.appendChild(content); bodywrap.appendChild(tocBox);
  main.appendChild(bodywrap);
  layout.appendChild(side); layout.appendChild(main);

  body.appendChild(topbar);
  body.appendChild(layout);

  function isWide() {
    if (window.matchMedia) return window.matchMedia("(min-width: 1001px)").matches;
    return (window.innerWidth || 1024) >= 1001;
  }
  function fitHeight() {
    var h = topbar.offsetHeight || 56;
    if (isWide()) {
      layout.style.height = "calc(100vh - " + h + "px)";
      side.style.top = ""; side.style.height = "";
    } else {
      layout.style.height = "";
      side.style.top = h + "px"; side.style.height = "calc(100vh - " + h + "px)";
    }
  }
  fitHeight();
  window.addEventListener("resize", fitHeight);

  /* ---------- 左侧目录栏 ---------- */
  var linkMap = {};
  PARTS.forEach(function (p) {
    var items = STATIONS.filter(function (s) { return s.part === p.key; });
    if (!items.length) return;
    var g = el("div", "grp");
    g.appendChild(el("div", "grp-h", p.name));
    g.appendChild(el("div", "grp-d", p.desc));
    items.forEach(function (s) {
      var label = s.id === "index" ? s.t : '<span class="no">' + s.no + "</span>" + s.t;
      var a = el("a", s.id === cur ? "on" : "", label);
      a.href = hrefOf(s); a.title = s.t;
      linkMap[s.id] = a; g.appendChild(a);
    });
    side.appendChild(g);
  });

  var foot = el("div", "sidefoot");
  foot.appendChild(el("div", "badge", "法源基准"));
  foot.appendChild(el("div", "lv", "<b>·</b>《劳动合同法》2008-01-01 施行<br>2012 修正本"));
  foot.appendChild(el("div", "lv", "<b>·</b>《劳动争议调解仲裁法》<br>2008-05-01 施行"));
  foot.appendChild(el("div", "lv", "<b>·</b>《社会保险法》2011-07-01 施行<br>《工伤保险条例》"));
  foot.appendChild(el("div", "lv", "<b>·</b>最高法劳动争议司法解释<br>（一）（二）（三）（四）"));
  side.appendChild(foot);

  /* ---------- 侧栏折叠（左折叠收起，可记忆） ---------- */
  var fab = el("button", "side-fab", "⟩ 目录");
  fab.setAttribute("aria-label", "展开目录");
  body.appendChild(fab);
  function setCollapsed(on) {
    document.body.classList.toggle("side-collapsed", on);
    try { localStorage.setItem("labor_side_collapsed", on ? "1" : "0"); } catch (e) {}
  }
  collapseBtn.addEventListener("click", function () { setCollapsed(true); });
  fab.addEventListener("click", function () { setCollapsed(false); });
  try {
    if (localStorage.getItem("labor_side_collapsed") === "1" && isWide()) setCollapsed(true);
  } catch (e) {}

  var onLink = linkMap[cur];
  if (onLink && side.scrollHeight > side.clientHeight) {
    var t = onLink.offsetTop;
    if (t > side.scrollTop + side.clientHeight - 80 || t < side.scrollTop) side.scrollTop = Math.max(0, t - 120);
  }

  menuBtn.addEventListener("click", function () { side.classList.toggle("open"); });
  Object.keys(linkMap).forEach(function (k) {
    linkMap[k].addEventListener("click", function () { side.classList.remove("open"); });
  });

  // 搜索过滤
  search.addEventListener("input", function () {
    var q = (search.value || "").trim().toLowerCase();
    var n = 0;
    STATIONS.forEach(function (s) {
      var a = linkMap[s.id]; if (!a) return;
      if (!q) { a.classList.remove("hide"); return; }
      var hay = (s.no + " " + s.t + " " + s.part + " " + (s.kw || "")).toLowerCase();
      if (hay.indexOf(q) >= 0) { a.classList.remove("hide"); n++; } else { a.classList.add("hide"); }
    });
    [].slice.call(side.querySelectorAll(".grp")).forEach(function (g) {
      g.style.display = g.querySelectorAll("a:not(.hide)").length ? "" : "none";
    });
    searchCount.textContent = !q ? "" : (n ? n + " 篇命中" : "无命中");
  });

  /* ---------- 阅读进度条 ---------- */
  var pg = el("div"); pg.id = "progress"; body.appendChild(pg);
  function scroller() {
    var inner = main.scrollHeight - main.clientHeight;
    if (inner > 4) return { top: main.scrollTop, max: inner };
    var de = document.documentElement;
    return { top: window.scrollY || de.scrollTop, max: de.scrollHeight - de.clientHeight };
  }
  var ticking = false;
  function updProgress() {
    var s = scroller();
    pg.style.width = (s.max > 0 ? (s.top / s.max) * 100 : 0) + "%";
    ticking = false;
  }
  function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(updProgress); } }
  main.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 本页目录：宽屏右侧栏 + 窄屏页内块 ---------- */
  var heads = [].slice.call(content.querySelectorAll("h2, h3"));
  heads.forEach(function (h, i) { if (!h.id) h.id = "sec-" + (i + 1); });

  function scrollToHead(h) {
    if (main.scrollHeight - main.clientHeight > 4) {
      var mr = main.getBoundingClientRect();
      var hr = h.getBoundingClientRect();
      main.scrollTo({ top: main.scrollTop + hr.top - mr.top - 16, behavior: "smooth" });
    } else {
      h.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (heads.length >= 3) {
    tocBox.appendChild(el("div", "toc-h", "本页目录"));
    heads.forEach(function (h) {
      var a = el("a", h.tagName === "H3" ? "lv3" : "", h.textContent);
      a.setAttribute("data-sec", h.id);
      a.addEventListener("click", function (e) { e.preventDefault(); scrollToHead(h); });
      tocBox.appendChild(a);
    });
    tocBox.classList.add("show");

    var inline = el("div", "toc");
    inline.appendChild(el("div", "h", "本页目录"));
    var ol = el("ol");
    heads.forEach(function (h) {
      var li = el("li");
      var a = el("a", null, h.textContent);
      a.href = "#" + h.id;
      a.addEventListener("click", function (e) { e.preventDefault(); scrollToHead(h); });
      li.appendChild(a); ol.appendChild(li);
    });
    inline.appendChild(ol);
    var hero = content.querySelector(".hero");
    if (hero) hero.parentNode.insertBefore(inline, hero.nextSibling);
    else content.insertBefore(inline, content.firstChild);

    var tocLinks = [].slice.call(tocBox.querySelectorAll("a"));
    var spy = false;
    function updSpy() {
      var mr = main.getBoundingClientRect();
      var active = null;
      heads.forEach(function (h) { if (h.getBoundingClientRect().top - mr.top <= 90) active = h; });
      if (!active) active = heads[0];
      tocLinks.forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-sec") === active.id); });
      spy = false;
    }
    main.addEventListener("scroll", function () { if (!spy) { spy = true; window.requestAnimationFrame(updSpy); } }, { passive: true });
    updSpy();
  }

  /* ---------- 上下篇 ---------- */
  var wrap = content.querySelector(".wrap") || content;
  var pager = el("div", "pager");
  if (idx > 0) {
    var p = STATIONS[idx - 1];
    var a1 = el("a", "prev", "<span class=\"dir\">上一篇</span><span class=\"tt\">" + (p.id === "index" ? p.t : p.no + " " + p.t) + "</span>");
    a1.href = hrefOf(p); pager.appendChild(a1);
  }
  if (idx < STATIONS.length - 1) {
    var nx = STATIONS[idx + 1];
    var a2 = el("a", "next", "<span class=\"dir\">下一篇</span><span class=\"tt\">" + nx.no + " " + nx.t + "</span>");
    a2.href = hrefOf(nx); pager.appendChild(a2);
  }
  wrap.appendChild(pager);

  updProgress();

  if (location.hash && location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(function () { scrollToHead(target); }, 60);
  }
})();
