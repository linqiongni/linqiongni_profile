/* 跨境物流法务 · 从深圳到鹿特丹 —— 站点脚本（顶栏 + 左侧固定目录栏 + 主区 + 右侧本页目录）
   数据源：下方 STATIONS 数组。正文页只需 <body data-station="...">。
   保留：原主题同步（postMessage + localStorage + 切换按钮）、data-deep 知识锚点、data-fold 折叠控件。 */
(function () {
  "use strict";

  var BASE = "";

  var STATIONS = [
    { id: "index", file: BASE + "index.html", no: "总纲", t: "总纲 · 十三站地图", part: "开始", kw: "目录 法源 怎么用 时间轴 路线图 术语速查 十三站 主线 霓光" },
    { id: "ch01", file: BASE + "ch01-map.html", no: "01", t: "法律地图 · 一趟货谁在管你", part: "第一卷 · 认识这条链", kw: "主体 托运人 承运人 收货人 货代 NVOCC 无船承运人 实际承运人 海外仓 报关行 识别" },
    { id: "ch02", file: BASE + "ch02-contracts.html", no: "02", t: "三份合同与背靠背", part: "第一卷 · 认识这条链", kw: "合同 货代合同 运输合同 仓储合同 背靠背 委托 承揽 条款 责任期间 适用法" },
    { id: "ch03", file: BASE + "ch03-documents.html", no: "03", t: "单证 · 提单电放与电子运输记录", part: "第一卷 · 认识这条链", kw: "提单 海运单 电放 无单放货 电子运输记录 物权凭证 背书 清洁提单 批注" },
    { id: "ch04", file: BASE + "ch04-liability.html", no: "04", t: "责任与责任限制 · 能赔多少", part: "第二卷 · 责任怎么分", kw: "责任限制 SDR 海牙维斯比 汉堡规则 海商法 CMR 蒙特利尔 迟延交付 免责 举证" },
    { id: "ch05", file: BASE + "ch05-multimodal.html", no: "05", t: "多式联运与门到门", part: "第二卷 · 责任怎么分", kw: "多式联运 门到门 网状责任制 统一责任制 鹿特丹规则 区段 经营人 转运" },
    { id: "ch06", file: BASE + "ch06-forwarder.html", no: "06", t: "货运代理 · 代理人还是承运人", part: "第二卷 · 责任怎么分", kw: "货代 国际货运代理 代理人 缔约承运人 FIATA 标准条款 保证金 提单登记 身份" },
    { id: "ch07", file: BASE + "ch07-overseas-warehouse.html", no: "07", t: "海外仓与目的国产品合规", part: "第三卷 · 通关与目的国", kw: "海外仓 仓储 留置权 GPSR CE UKCA EPR WEEE 欧盟 英国 责任人 产品安全" },
    { id: "ch08", file: BASE + "ch08-customs.html", no: "08", t: "海关通关 · 归类原产地与保税", part: "第三卷 · 通关与目的国", kw: "海关 归类 HS编码 原产地 申报 查验 AEO 保税 转运 关税法 滞报金 稽查" },
    { id: "ch09", file: BASE + "ch09-export-control.html", no: "09", t: "出口管制与经济制裁", part: "第三卷 · 通关与目的国", kw: "出口管制 两用物项 制裁 EAR OFAC 清单 阻断 最终用户 转口 合规筛查" },
    { id: "ch10", file: BASE + "ch10-data.html", no: "10", t: "物流数据与跨境传输", part: "第四卷 · 救济与工具箱", kw: "数据合规 跨境传输 PIPL GDPR 报文 面单 收件人 信息 留存 系统对接" },
    { id: "ch11", file: BASE + "ch11-insurance.html", no: "11", t: "货运保险与理赔代位", part: "第四卷 · 救济与工具箱", kw: "保险 货运险 一切险 责任险 代位求偿 索赔 时效 免赔额 定值 被保险人" },
    { id: "ch12", file: BASE + "ch12-disputes.html", no: "12", t: "争议解决 · 管辖与执行", part: "第四卷 · 救济与工具箱", kw: "争议 管辖 仲裁 伦敦 香港 新加坡 纽约公约 提单管辖 扣船 海事 保全" },
    { id: "ch13", file: BASE + "ch13-toolkit.html", no: "13", t: "案例库与条款工具箱", part: "第四卷 · 救济与工具箱", kw: "案例 模板 条款 清单 自查 无单放货 货损 追偿 检查表 工具箱" }
  ];

  var PARTS = [
    { key: "开始", name: "总纲", desc: "全站结构与法源基准" },
    { key: "第一卷 · 认识这条链", name: "PART I · 认识这条链", desc: "法律地图 · 合同体系 · 运输单证" },
    { key: "第二卷 · 责任怎么分", name: "PART II · 责任怎么分", desc: "责任限制 · 多式联运 · 货运代理身份" },
    { key: "第三卷 · 通关与目的国", name: "PART III · 通关与目的国", desc: "海外仓 · 海关 · 出口管制与制裁" },
    { key: "第四卷 · 救济与工具箱", name: "PART IV · 救济与工具箱", desc: "数据 · 保险理赔 · 争议执行 · 案例模板" }
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
    try { localStorage.setItem("logi-legal-theme", t); } catch (e) {}
    var b = document.getElementById("themeBtn");
    if (b) b.textContent = t === "dark" ? "☀" : "☾";
  }
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("logi-legal-theme"); } catch (e) {}
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
    if (n.nodeType === 1 && n.id === "topbar") return false; // 旧顶栏占位，已被新顶栏取代
    return true;
  });
  // 物理移除 HTML 中的旧空顶栏占位（与新建顶栏 id 同名，避免重复元素）
  var oldTop = document.getElementById("topbar");
  if (oldTop && oldTop.parentNode) oldTop.parentNode.removeChild(oldTop);

  var topbar = el("header", "topbar");
  topbar.id = "topbar";
  var brand = el("a", "brand", '<span class="seal">运</span><span class="txt">跨境物流法务 · 从深圳到鹿特丹</span>');
  brand.href = BASE + "index.html";
  topbar.appendChild(brand);

  var searchWrap = el("div", "searchwrap");
  var search = el("input");
  search.id = "search"; search.type = "search"; search.autocomplete = "off";
  search.placeholder = "搜索章节：股权架构 / Term Sheet / 港股 / 尽调…";
  searchWrap.appendChild(search);
  var searchCount = el("span", "scount");
  searchWrap.appendChild(searchCount);
  topbar.appendChild(searchWrap);

  topbar.appendChild(el("span", "cur-chip", me.no === "总纲" ? me.t : "第 " + me.no + " 站 · " + me.t));

  /* ---------- 全屏按钮：在当前页面内铺满整屏，不跳新页面 ---------- */
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
  initTheme(); // 主题按钮已就位，初始化

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
  foot.appendChild(el("div", "lv", "<b>·</b>《海商法》2025 修订，2026-05-01 施行（16 章 310 条）"));
  foot.appendChild(el("div", "lv", "<b>·</b>《国际海运条例》《民法典》合同编 · 蒙特利尔公约 26 SDR/kg"));
  foot.appendChild(el("div", "lv", "<b>·</b>主线案例「霓光珠宝出海」为教学虚构；公约与条号以现行为准复核"));
  side.appendChild(foot);

  /* ---------- 侧栏折叠（左折叠收起，可记忆） ---------- */
  var fab = el("button", "side-fab", "⟩ 目录");
  fab.setAttribute("aria-label", "展开目录");
  body.appendChild(fab);
  function setCollapsed(on) {
    document.body.classList.toggle("side-collapsed", on);
    try { localStorage.setItem("logi_side_collapsed", on ? "1" : "0"); } catch (e) {}
  }
  collapseBtn.addEventListener("click", function () { setCollapsed(true); });
  fab.addEventListener("click", function () { setCollapsed(false); });
  try {
    if (localStorage.getItem("logi_side_collapsed") === "1" && isWide()) setCollapsed(true);
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
