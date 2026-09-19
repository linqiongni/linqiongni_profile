/* 融资法务 · 从 0 到 1 —— 站点脚本（顶栏 + 左侧固定目录栏 + 主区 + 右侧本页目录）
   数据源：下方 STATIONS 数组。正文页只需 <body data-station="...">。
   保留：原主题同步（postMessage + localStorage + 切换按钮）、data-deep 知识锚点、data-fold 折叠控件。 */
(function () {
  "use strict";

  var BASE = "";

  var STATIONS = [
    { id: "index", file: BASE + "index.html", no: "总纲", t: "总纲 · 十二站地图", part: "开始", kw: "目录 法源 怎么用 时间轴 路线图 术语速查 十二站" },
    { id: "ch01", file: BASE + "ch01-foundation.html", no: "01", t: "创业起步 · 股权架构", part: "第一卷 · 创业与交易设计", kw: "股权架构 个体户 有限公司 合伙企业 注册资本 实缴 技术出资 代持 夫妻股东 壳" },
    { id: "ch02", file: BASE + "ch02-esop.html", no: "02", t: "股权激励设计（ESOP）", part: "第一卷 · 创业与交易设计", kw: "ESOP 期权 限制性股票 虚拟股 成熟 离职回购 RSU 信托 外汇 股权激励" },
    { id: "ch03", file: BASE + "ch03-deal-terms.html", no: "03", t: "融资交易方案与 Term Sheet", part: "第一卷 · 创业与交易设计", kw: "Term Sheet 估值 优先清算 反稀释 回购 领售 随售 对赌 清算优先权 投资条款" },
    { id: "ch04", file: BASE + "ch04-due-diligence.html", no: "04", t: "法律尽职调查", part: "第一卷 · 创业与交易设计", kw: "尽调 尽职调查 红黄绿灯 红旗问题 披露函 报告 卖方 买方 自查" },
    { id: "ch05", file: BASE + "ch05-jv-agreement.html", no: "05", t: "合资协议起草", part: "第一卷 · 创业与交易设计", kw: "合资 合营 JV 僵局 拖带权 非竞争 IP归属 退出 中外合资 合资合同" },
    { id: "ch06", file: BASE + "ch06-setup.html", no: "06", t: "公司设立与红筹架构", part: "第二卷 · 架构 · 合规 · 治理", kw: "设立 红筹 VIE 37号文 ODI 10号文 返程投资 WFOE SPV 备案 架构" },
    { id: "ch07", file: BASE + "ch07-compliance.html", no: "07", t: "合规审查与风险管控", part: "第二卷 · 架构 · 合规 · 治理", kw: "合规 风控 社保 税务 商标 数据 消防 反商业贿赂 风险台账 上市前" },
    { id: "ch08", file: BASE + "ch08-equity-change.html", no: "08", t: "股权变更 · 并购重组", part: "第二卷 · 架构 · 合规 · 治理", kw: "股权转让 增资 换股 合并 分立 优先购买权 并购 税负 重组" },
    { id: "ch09", file: BASE + "ch09-governance.html", no: "09", t: "治理结构设计", part: "第二卷 · 架构 · 合规 · 治理", kw: "治理 股东会 董事会 监事会 审计委员会 章程 独董 议事规则" },
    { id: "ch10", file: BASE + "ch10-hkex-rules.html", no: "10", t: "港股上市规则精讲", part: "第三卷 · 港股上市", kw: "港股 联交所 主板 GEM 财务测试 公众持股 关连交易 须予披露 WVR 18C 上市规则" },
    { id: "ch11", file: BASE + "ch11-ipo-process.html", no: "11", t: "IPO 全流程与项目经验", part: "第三卷 · 港股上市", kw: "IPO 保荐人 A1 聆讯 招股书 问询 基石 绿鞋 稳价 全球发售 递表" },
    { id: "ch12", file: BASE + "ch12-post-listing.html", no: "12", t: "上市后合规与信息披露", part: "第三卷 · 港股上市", kw: "上市后 定期报告 内幕消息 须予披露 关连交易 ESG 披露日历 合规" },
    { id: "ch13", file: BASE + "ch13-cases.html", no: "13", t: "真实案例库 · 29 案", part: "第三卷 · 港股上市", kw: "案例 真功夫 海富案 华工案 俏江南 瑞幸 康美 恒大 公报 处罚 仲裁" }
  ];

  var PARTS = [
    { key: "开始", name: "总纲", desc: "全站结构与法源基准" },
    { key: "第一卷 · 创业与交易设计", name: "PART I · 创业与交易设计", desc: "股权架构 · ESOP · Term Sheet · 尽调 · 合资" },
    { key: "第二卷 · 架构 · 合规 · 治理", name: "PART II · 架构 · 合规 · 治理", desc: "红筹设立 · 合规风控 · 股权变更 · 治理结构" },
    { key: "第三卷 · 港股上市", name: "PART III · 港股上市", desc: "上市规则 · IPO · 上市后披露 · 案例库" }
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
  var brand = el("a", "brand", '<span class="seal">融</span><span class="txt">融资法务 · 从 0 到 1</span>');
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
  foot.appendChild(el("div", "lv", "<b>·</b>《公司法》2023 修订，2024-07-01 施行"));
  foot.appendChild(el("div", "lv", "<b>·</b>《证券法》2019 修订；港股上市规则（主板 / GEM）"));
  foot.appendChild(el("div", "lv", "<b>·</b>主线案例「霓光珠宝」为教学虚构；规则以现行为准复核"));
  side.appendChild(foot);

  /* ---------- 侧栏折叠（左折叠收起，可记忆） ---------- */
  var fab = el("button", "side-fab", "⟩ 目录");
  fab.setAttribute("aria-label", "展开目录");
  body.appendChild(fab);
  function setCollapsed(on) {
    document.body.classList.toggle("side-collapsed", on);
    try { localStorage.setItem("fin_side_collapsed", on ? "1" : "0"); } catch (e) {}
  }
  collapseBtn.addEventListener("click", function () { setCollapsed(true); });
  fab.addEventListener("click", function () { setCollapsed(false); });
  try {
    if (localStorage.getItem("fin_side_collapsed") === "1" && isWide()) setCollapsed(true);
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
