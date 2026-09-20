/* 新零售与广告合规 · 零售与广告全场景合规审查操作指引 —— 站点脚本
   （顶栏 + 左侧固定目录栏 + 主区 + 右侧本页目录）
   数据源：下方 STATIONS 数组。正文页只需 <body data-station="...">。
   保留：主题同步（postMessage + localStorage + 切换按钮）、data-fold 折叠控件、cp() 复制。 */
(function () {
  "use strict";

  var BASE = "";
  var PAGE_V = "20260920a";
  function withV(f) {
    if (!f) return f;
    if (f.indexOf("?") >= 0) return f;
    return f + "?v=" + PAGE_V;
  }

  var STATIONS = [
    { id: "index", file: "index.html", no: "总纲", t: "总纲 · 全场景合规审查地图", part: "开始", kw: "目录 怎么用 脱敏 立场 法源 六大模块 终审 风险地图 品牌方 市场部 零售终端" },
    { id: "ch01", file: "ch01-general-rules.html", no: "01", t: "通用合规底层准则", part: "第一卷 · 底层准则与物料", kw: "广告法 消保法 反不正当竞争法 价格法 知识产权 绝对化用语 虚假宣传 误导 侵权 违禁 实质重于形式 事前审核 事后复盘" },
    { id: "ch02", file: "ch02-ad-material.html", no: "02", t: "广告物料合规审查（全渠道）", part: "第一卷 · 底层准则与物料", kw: "海报 图文 短视频 户外 门店POP 电商详情页 朋友圈投放 极限词 功能宣称 数据引用 图片 字体 音乐 肖像 版权 商用授权 代言人 达人 价格宣传 划线价 原价 折扣 对比宣传" },
    { id: "ch03", file: "ch03-livestream.html", no: "03", t: "直播脚本与直播电商合规审查", part: "第二卷 · 新场景", kw: "直播 脚本 前置审核 主播话术 弹窗 背景 刷单炒信 虚假销量 饥饿营销 录屏 存档 口误补救 追责 数字人 虚拟主播 直播电商监督管理办法" },
    { id: "ch04", file: "ch04-ip-collab.html", no: "04", t: "IP 合作与联名营销合规审查", part: "第二卷 · 新场景", kw: "IP 联名 授权链条 权属 授权层级 地域 期限 品类 渠道 联名标识 衍生品 库存 销毁 清仓 近似IP 超范围 终止善后 物料下架" },
    { id: "ch05", file: "ch05-retail-promo.html", no: "05", t: "零售终端宣传与促销合规审查", part: "第三卷 · 终端与善后", kw: "门店 POP 展架 价签 吊旗 促销规则 最终解释权 兑奖 有奖销售 会员 储值 预付卡 导购话术 承诺式销售 户外广告 备案 城管 市监" },
    { id: "ch06", file: "ch06-cases.html", no: "06", t: "案例实务与高频争议焦点", part: "第三卷 · 终端与善后", kw: "案例 争议焦点 处罚 抗辩 整改 举报 职业打假 舆情 复盘 台账" },
    { id: "ch07", file: "ch07-sop.html", no: "07", t: "合规审核流程 SOP 与责任划分", part: "第四卷 · 机制", kw: "SOP 初审 复核 终审 节点 时限 责任划分 法务 市场 零售 决策权 升级 台账 归档" },
    { id: "ch08", file: "ch08-appendix.html", no: "附录", t: "终审 Checklist · 极限词表 · 法源索引", part: "附录", kw: "checklist 速查 极限词 红线 法源 条号 检索路径 术语 复核" }
  ];

  var PARTS = [
    { key: "开始", name: "总纲", desc: "立场 · 读法 · 全站地图" },
    { key: "第一卷 · 底层准则与物料", name: "PART I · 底层准则与物料", desc: "通用红线 · 广告物料全渠道" },
    { key: "第二卷 · 新场景", name: "PART II · 新场景", desc: "直播电商 · IP 联名" },
    { key: "第三卷 · 终端与善后", name: "PART III · 终端 · 案例", desc: "零售终端促销 · 高频争议" },
    { key: "第四卷 · 机制", name: "PART IV · 机制", desc: "审核流程 SOP · 责任划分" },
    { key: "附录", name: "APPENDIX 附录", desc: "终审清单 · 极限词表 · 法源索引" }
  ];

  var cur = (document.body.getAttribute("data-station") || "index").trim();
  var idx = -1;
  for (var i = 0; i < STATIONS.length; i++) { if (STATIONS[i].id === cur) { idx = i; break; } }
  if (idx < 0) idx = 0;
  var me = STATIONS[idx];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* ---------- 复制按钮 ---------- */
  window.cp = function (btn) {
    var box = btn.parentNode;
    var txt = box.getAttribute("data-cp");
    if (txt == null) {
      var pre = box.querySelector("pre");
      txt = pre ? pre.innerText : box.innerText;
    }
    txt = txt.replace(/^\s*复制\s*\n?/, "");
    function done() {
      var old = btn.textContent;
      btn.textContent = "已复制";
      setTimeout(function () { btn.textContent = old; }, 1200);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = txt; ta.style.position = "fixed"; ta.style.left = "-9999px";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
  };

  /* ---------- 主题 ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("retail-ad-theme", t); } catch (e) {}
    var b = document.getElementById("themeBtn");
    if (b) b.textContent = t === "dark" ? "☀" : "☾";
  }
  window.addEventListener("message", function (e) {
    var d = e.data || {};
    if (d.type === "theme" && (d.mode === "dark" || d.mode === "light")) applyTheme(d.mode);
  });

  /* ---------- 重构 DOM ---------- */
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
  var brand = el("a", "brand", '<span class="seal">零</span><span class="txt">新零售与广告合规 · 审查操作指引</span>');
  brand.href = withV(BASE + "index.html");
  topbar.appendChild(brand);

  var searchWrap = el("div", "searchwrap");
  var search = el("input");
  search.id = "search"; search.type = "search"; search.autocomplete = "off";
  search.placeholder = "搜索：极限词 / 划线价 / 直播 / 联名 / 储值 / 终审…";
  searchWrap.appendChild(search);
  var searchCount = el("span", "scount");
  searchWrap.appendChild(searchCount);
  topbar.appendChild(searchWrap);

  topbar.appendChild(el("span", "cur-chip", (me.no === "总纲" || me.no === "附录") ? me.t : "第 " + me.no + " 章 · " + me.t));

  var fsBtn = el("button", "fs-btn", "全屏");
  fsBtn.id = "fsBtn";
  function isFs() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
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
  collapseBtn.setAttribute("aria-label", "收起目录");
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

  var savedTheme = null;
  try { savedTheme = localStorage.getItem("retail-ad-theme"); } catch (e) {}
  if (!savedTheme) {
    savedTheme = (window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)").matches : false) ? "dark" : "light";
  }
  applyTheme(savedTheme);
  themeBtn.addEventListener("click", function () {
    applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  function isWide() {
    if (window.matchMedia) return window.matchMedia("(min-width: 1001px)").matches;
    return (window.innerWidth || 1024) >= 1001;
  }
  function fitHeight() {
    var h = topbar.offsetHeight || 56;
    if (isWide()) { layout.style.height = "calc(100vh - " + h + "px)"; side.style.top = ""; side.style.height = ""; }
    else { layout.style.height = ""; side.style.top = h + "px"; side.style.height = "calc(100vh - " + h + "px)"; }
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
      var isCover = s.no === "总纲" || s.no === "附录";
      var label = isCover ? s.t : '<span class="no">' + s.no + "</span>" + s.t;
      var a = el("a", s.id === cur ? "on" : "", label);
      a.href = withV(s.file); a.title = s.t;
      linkMap[s.id] = a; g.appendChild(a);
    });
    side.appendChild(g);
  });

  var foot = el("div", "sidefoot");
  foot.appendChild(el("div", "badge", "法源基准"));
  foot.appendChild(el("div", "lv", "<b>·</b>《广告法》（2021 第二次修正）"));
  foot.appendChild(el("div", "lv", "<b>·</b>《反不正当竞争法》（2025-06-27 修订，2025-10-01 施行）"));
  foot.appendChild(el("div", "lv", "<b>·</b>《直播电商监督管理办法》（令第 117 号，2026-02-01 施行）"));
  foot.appendChild(el("div", "lv", "<b>·</b>《互联网广告管理办法》（令第 72 号，2023-05-01 施行）"));
  foot.appendChild(el("div", "lv", "<b>·</b>《明码标价和禁止价格欺诈规定》（令第 56 号）"));
  foot.appendChild(el("div", "lv", "<b>·</b>全文脱敏；条号引用前对照现行文本复核"));
  side.appendChild(foot);

  var fab = el("button", "side-fab", "⟩ 目录");
  body.appendChild(fab);
  function setCollapsed(on) {
    document.body.classList.toggle("side-collapsed", on);
    try { localStorage.setItem("retail_ad_side_collapsed", on ? "1" : "0"); } catch (e) {}
  }
  collapseBtn.addEventListener("click", function () { setCollapsed(true); });
  fab.addEventListener("click", function () { setCollapsed(false); });
  try { if (localStorage.getItem("retail_ad_side_collapsed") === "1" && isWide()) setCollapsed(true); } catch (e) {}

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

  /* ---------- 本页目录 ---------- */
  var heads = [].slice.call(content.querySelectorAll("h2, h3"));
  heads.forEach(function (h, i) { if (!h.id) h.id = "sec-" + (i + 1); });
  function scrollToHead(h) {
    if (main.scrollHeight - main.clientHeight > 4) {
      var mr = main.getBoundingClientRect(), hr = h.getBoundingClientRect();
      main.scrollTo({ top: main.scrollTop + hr.top - mr.top - 16, behavior: "smooth" });
    } else { h.scrollIntoView({ behavior: "smooth", block: "start" }); }
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
      var mr = main.getBoundingClientRect(), active = null;
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
      ph += '<a href="' + withV(p.file) + '"><div class="dir">← 上一站</div><div class="ttl">' + (p.no === "总纲" || p.no === "附录" ? p.t : p.no + " " + p.t) + "</div></a>";
    }
    if (idx < STATIONS.length - 1) {
      var nx = STATIONS[idx + 1];
      ph += '<a href="' + withV(nx.file) + '" style="text-align:right"><div class="dir">下一站 →</div><div class="ttl">' + nx.no + " " + nx.t + "</div></a>";
    }
    pagerEl.className = "pager";
    pagerEl.innerHTML = ph;
  }

  updProgress();

  if (location.hash && location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(function () { scrollToHead(target); }, 60);
  }

  /* ---------- 折叠控件 ---------- */
  [].slice.call(document.querySelectorAll("[data-fold]")).forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("data-fold") === "open";
      var kind = btn.getAttribute("data-fold-kind") || "all";
      var root = document;
      var sel = kind === "all" ? "details.tpl, details.peek, details.dlg" : "details." + kind;
      [].slice.call(root.querySelectorAll(sel)).forEach(function (d) { d.open = open; });
    });
  });
})();
