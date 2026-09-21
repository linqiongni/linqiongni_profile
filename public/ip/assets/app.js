/* 知识产权 · 从 0 到 1 —— 站点脚本（顶栏 + 左侧固定目录栏 + 主区 + 右侧本页目录）
   数据源：下方 STATIONS 数组。正文页只需 <body data-station="...">。
   复用融资法务布局系统：原主题同步（postMessage + localStorage + 切换按钮）、data-deep 知识锚点、data-fold 折叠控件。 */
(function () {
  "use strict";

  var BASE = "";

  var STATIONS = [
    { id: "index", file: BASE + "index.html?v=20260921", no: "总纲", t: "总纲 · 九站地图", part: "开始", kw: "目录 法源 怎么用 主线 权利地图 九站 术语速查 知识产权" },
    { id: "ch01", file: BASE + "ch01-overview.html?v=20260921", no: "01", t: "总论 · 权利谱系与取得方式", part: "第一卷 · 权利与四大部门法", kw: "知识产权 客体 权利谱系 自动取得 确权 使用产生 权能 保护期 法律渊源 巴黎公约 伯尔尼 TRIPS" },
    { id: "ch02", file: BASE + "ch02-trademark.html?v=20260921", no: "02", t: "商标 · 从起名到拿证到维权", part: "第一卷 · 权利与四大部门法", kw: "商标 显著性 禁用 禁注 尼斯分类 注册流程 异议 撤销 侵权 驰名商标 马德里" },
    { id: "ch03", file: BASE + "ch03-patent.html?v=20260921", no: "03", t: "专利 · 技术方案变权利", part: "第一卷 · 权利与四大部门法", kw: "专利 发明 实用新型 外观设计 三性 新颖性 创造性 实用性 审查 权利要求 侵权" },
    { id: "ch04", file: BASE + "ch04-copyright.html?v=20260921", no: "04", t: "著作权 · 作品与表达", part: "第一卷 · 权利与四大部门法", kw: "著作权 作品 人身权 财产权 自动保护 署名 改编 剽窃 实用艺术品 职务作品" },
    { id: "ch05", file: BASE + "ch05-trade-secret.html?v=20260921", no: "05", t: "商业秘密与不正当竞争", part: "第一卷 · 权利与四大部门法", kw: "商业秘密 保密措施 竞业限制 仿冒 混淆 虚假宣传 反法 有一定影响" },
    { id: "ch06", file: BASE + "ch06-remedy.html?v=20260921", no: "06", t: "侵权救济与损害赔偿", part: "第二卷 · 救济与程序", kw: "侵权 四要件 归责 停止侵害 赔偿 惩罚性 法定赔偿 禁令 合理开支" },
    { id: "ch07", file: BASE + "ch07-procedure.html?v=20260921", no: "07", t: "程序与证据地图", part: "第二卷 · 救济与程序", kw: "行政 民事 刑事 管辖 知识产权法院 公证购买 时间戳 区块链 举证 保全" },
    { id: "ch08", file: BASE + "ch08-portfolio.html?v=20260921", no: "08", t: "IP 布局与组合策略", part: "第三卷 · 布局与行业", kw: "布局 权利地图 组合 跨境 马德里 PCT 巴黎公约 海牙 优先权" },
    { id: "ch09", file: BASE + "ch09-industry.html?v=20260921", no: "09", t: "行业专精 · 珠宝时尚 + 案例库", part: "第三卷 · 布局与行业", kw: "珠宝 时尚 消费品 款式被抄 代工泄密 电商仿店 代言图 案例" }
  ];

  var PARTS = [
    { key: "开始", name: "总纲", desc: "全站结构与法源基准" },
    { key: "第一卷 · 权利与四大部门法", name: "PART I · 权利与四大部门法", desc: "总论 · 商标 · 专利 · 著作权 · 商业秘密" },
    { key: "第二卷 · 救济与程序", name: "PART II · 救济与程序", desc: "侵权赔偿 · 程序证据" },
    { key: "第三卷 · 布局与行业", name: "PART III · 布局与行业", desc: "组合策略 · 珠宝时尚专精 · 案例库" }
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

  /* ---------- 主题（保留原有 postMessage + localStorage 同步） ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("ip-legal-theme", t); } catch (e) {}
    var b = document.getElementById("themeBtn");
    if (b) b.textContent = t === "dark" ? "☀" : "☾";
  }
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("ip-legal-theme"); } catch (e) {}
    if (!saved) {
      saved = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    applyTheme(saved);
    var b = document.getElementById("themeBtn");
    if (b) b.addEventListener("click", function () {
      var c = document.documentElement.getAttribute("data-theme");
      applyTheme(c === "dark" ? "light" : "dark");
    });
  }
  window.addEventListener("message", function (e) {
    var d = e.data || {};
    if (d.type === "theme" && (d.mode === "dark" || d.mode === "light")) applyTheme(d.mode);
  });

  /* ---------- 重构 DOM：顶栏 + 左侧目录栏 + 主区 + 右侧本页目录 ---------- */
  var body = document.body;
  var orig = [].slice.call(body.childNodes).filter(function (n) {
    if (n.nodeType === 1 && n.tagName === "SCRIPT") return false;
    if (n.nodeType === 1 && n.id === "topbar") return false;
    return true;
  });
  var oldTop = document.getElementById("topbar");
  if (oldTop && oldTop.parentNode) oldTop.parentNode.removeChild(oldTop);

  var topbar = el("header", "topbar");
  topbar.id = "topbar";
  var brand = el("a", "brand", '<span class="seal">知</span><span class="txt">知识产权 · 从 0 到 1</span>');
  brand.href = BASE + "index.html?v=20260921";
  topbar.appendChild(brand);

  var searchWrap = el("div", "searchwrap");
  var search = el("input");
  search.id = "search"; search.type = "search"; search.autocomplete = "off";
  search.placeholder = "搜索章节：商标 / 专利 / 著作权 / 商业秘密 / 侵权 / 马德里…";
  searchWrap.appendChild(search);
  var searchCount = el("span", "scount");
  searchWrap.appendChild(searchCount);
  topbar.appendChild(searchWrap);

  topbar.appendChild(el("span", "cur-chip", me.no === "总纲" ? me.t : "第 " + me.no + " 站 · " + me.t));

  var fsBtn = el("button", "fs-btn", "全屏");
  fsBtn.id = "fsBtn";
  fsBtn.title = "全屏显示（不跳新页面，Esc 退出）";
  fsBtn.setAttribute("aria-label", "全屏显示");
  function isFs() {
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
  document.addEventListener("fullscreenchange", syncFsBtn);
  document.addEventListener("webkitfullscreenchange", syncFsBtn);
  topbar.appendChild(fsBtn);

  var themeBtn = el("button", "theme-btn", "☾");
  themeBtn.id = "themeBtn"; themeBtn.title = "切换深浅色";
  topbar.appendChild(themeBtn);
  var menuBtn = el("button", "menu-btn", "目录");
  menuBtn.setAttribute("aria-label", "打开目录");
  topbar.appendChild(menuBtn);

  var layout = el("div", "layout");
  var side = el("aside", "side"); side.id = "side";
  var sideHd = el("div", "side-hd");
  sideHd.appendChild(el("span", "t", "目录"));
  var collapseBtn = el("button", "collapse-btn", "⟨");
  collapseBtn.setAttribute("aria-label", "收起目录"); collapseBtn.title = "收起目录（左折叠）";
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
  initTheme();

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
  foot.appendChild(el("div", "lv", "<b>·</b>《专利法》（2020 修正，2021-06-01 施行）"));
  foot.appendChild(el("div", "lv", "<b>·</b>《商标法》（2019 修正）；《著作权法》（2020 修正，2021-06-01 施行）"));
  foot.appendChild(el("div", "lv", "<b>·</b>《反不正当竞争法》（2019 修正）；《民法典》第 123 条"));
  foot.appendChild(el("div", "lv", "<b>·</b>主线案例「栖梧珠宝」为教学虚构；规则以现行为准复核"));
  side.appendChild(foot);

  /* ---------- 侧栏折叠（左折叠收起，可记忆） ---------- */
  var fab = el("button", "side-fab", "⟩ 目录");
  fab.setAttribute("aria-label", "展开目录");
  body.appendChild(fab);
  function setCollapsed(on) {
    document.body.classList.toggle("side-collapsed", on);
    try { localStorage.setItem("ip_side_collapsed", on ? "1" : "0"); } catch (e) {}
  }
  collapseBtn.addEventListener("click", function () { setCollapsed(true); });
  fab.addEventListener("click", function () { setCollapsed(false); });
  try {
    if (localStorage.getItem("ip_side_collapsed") === "1" && isWide()) setCollapsed(true);
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
  var pagerEl = document.getElementById("pager");
  if (pagerEl) {
    var ph = "";
    if (idx > 0) {
      var p = STATIONS[idx - 1];
      ph += '<a href="' + p.file + '"><div class="dir">← 上一站</div><div class="ttl">' + (p.id === "index" ? p.t : p.no + " " + p.t) + "</div></a>";
    }
    if (idx < STATIONS.length - 1) {
      var nx = STATIONS[idx + 1];
      ph += '<a href="' + nx.file + '" style="text-align:right"><div class="dir">下一站 →</div><div class="ttl">' + nx.no + " " + nx.t + "</div></a>";
    }
    pagerEl.className = "pager";
    pagerEl.innerHTML = ph;
  }

  updProgress();

  if (location.hash && location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(function () { scrollToHead(target); }, 60);
  }

  /* ---------- 保留：知识锚点（data-deep） ---------- */
  [].slice.call(document.querySelectorAll("[data-deep]")).forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("data-deep");
      var d = document.getElementById(id);
      if (!d) return;
      e.preventDefault();
      if (d.tagName === "DETAILS" && !d.open) d.open = true;
      setTimeout(function () { d.scrollIntoView({ behavior: "smooth", block: "start" }); }, 40);
      if (history.replaceState) history.replaceState(null, "", "#" + id);
    });
  });

  /* ---------- 保留：折叠控件（data-fold） ---------- */
  [].slice.call(document.querySelectorAll("[data-fold]")).forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("data-fold") === "open";
      var kind = btn.getAttribute("data-fold-kind") || "all";
      var scopeId = btn.getAttribute("data-fold-scope");
      var root = scopeId ? (document.getElementById(scopeId) || document) : document;
      var sel = kind === "all" ? "details.tpl, details.peek" : "details." + kind;
      [].slice.call(root.querySelectorAll(sel)).forEach(function (d) { d.open = open; });
    });
  });
})();
