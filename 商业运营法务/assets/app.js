/* 商业运营法务 · 商业综合体租赁合同审核 —— 站点脚本（顶栏 + 左侧固定目录栏 + 主区 + 右侧本页目录）
   数据源：下方 STATIONS 数组。正文页只需 <body data-station="...">。
   保留：原主题同步（postMessage + localStorage + 切换按钮）、data-deep 知识锚点、data-fold 折叠控件。 */
(function () {
  "use strict";

  var BASE = "";

  var STATIONS = [
    { id: "index", file: BASE + "index.html", no: "总纲", t: "总纲 · 审核指引地图", part: "开始", kw: "目录 怎么用 脱敏 立场 法源 八大模块 终审 风险地图 出租方 商场" },
    { id: "ch01", file: BASE + "ch01-lease-core.html", no: "01", t: "基础租赁核心条款审核", part: "第一卷 · 合同本体", kw: "主体资质 产权人 签约主体 收款主体 授权托管 转租权限 交付标准 面积确权 规划用途 配套点位 租期 免租期 开业节点 租金 递增 计价基数 抽成租金 欠费止损" },
    { id: "ch02", file: BASE + "ch02-pos-settlement.html", no: "02", t: "收银系统与 POS 专项（核心风控）", part: "第一卷 · 合同本体", kw: "统一收银 POS MPOS mPOS 私收 私账 系统权属 终端 改装 破解 数据同步 三级核查 日检 月对账 季度审计 分账 结算周期 T+1 T+2 备付金 二清 抵扣 对账异议 发票 瞒报 舞弊 罚则 根本违约" },
    { id: "ch03", file: BASE + "ch03-property-service.html", no: "03", t: "商场维护与物业服务审核", part: "第二卷 · 运营场景", kw: "物业服务 基础服务 商业专项服务 物业费不含项 水电 空调 计量 空调时段 延时 加班 有偿 欠费 停供 装修 报备 违规改造 施工安全 维保 公共区域 公共设备 责任划分" },
    { id: "ch04", file: BASE + "ch04-fire-safety.html", no: "04", t: "消防安全合规审核（一票否决）", part: "第二卷 · 运营场景", kw: "消防 验收 备案 特殊建设工程 公众聚集场所 二次装修 图纸报审 二消 合格证 联动 器材 巡查 隐患整改 禁止行为 封堵通道 遮挡 用火用电 事故追责 处罚 连带 一票否决" },
    { id: "ch05", file: BASE + "ch05-operations-brand.html", no: "05", t: "经营规范与品牌管控审核", part: "第二卷 · 运营场景", kw: "品牌 业态 换牌 杂牌 水货 营业时间 开闭店 空铺 停业 营销 店庆 促销 外摆 报备 价格 统一价格 价格欺诈 低价内卷 明码标价" },
    { id: "ch06", file: BASE + "ch06-fees-deposit.html", no: "06", t: "费用与保证金体系审核", part: "第三卷 · 钱与退出", kw: "保证金 租赁保证金 物业保证金 履约保证金 消防保证金 抵扣 物业费 能耗费 系统使用费 推广费 支付节点 逾期 滞纳金 日息 解约条件" },
    { id: "ch07", file: BASE + "ch07-transfer-renewal-exit.html", no: "07", t: "转租、续租与撤场审核", part: "第三卷 · 钱与退出", kw: "转租 分租 转让 联营 挂靠 书面同意 续租 优先承租权 优先续租 申请时限 调价 撤场 复原 逾期复原 违约金 遗留物品 处置 占有使用费" },
    { id: "ch08", file: BASE + "ch08-breach-dispute.html", no: "08", t: "违约与争议解决", part: "第三卷 · 钱与退出", kw: "违约梯度 轻微 一般 根本违约 解除 违约金 管辖 不动产专属管辖 送达 司法送达地址 变更 不可抗力 情势变更 疫情 政策 市政施工 免责 保证金没收" },
    { id: "ch09", file: BASE + "ch09-appendix.html", no: "附录", t: "终审清单 · 让步底线 · 法源索引", part: "附录", kw: "checklist 审核清单 底线 速查 让步 术语 法源 条号 检索路径 判例索引 复核" }
  ];

  var PARTS = [
    { key: "开始", name: "总纲", desc: "立场 · 读法 · 全站地图" },
    { key: "第一卷 · 合同本体", name: "PART I · 合同本体", desc: "基础租赁条款 · 收银与 POS 专项" },
    { key: "第二卷 · 运营场景", name: "PART II · 运营场景", desc: "物业 · 消防 · 经营与品牌" },
    { key: "第三卷 · 钱与退出", name: "PART III · 费用 · 退出 · 争议", desc: "费用保证金 · 转租续租撤场 · 违约争议" },
    { key: "附录", name: "APPENDIX 附录", desc: "终审清单 · 让步底线 · 法源索引" }
  ];

  var base0 = (document.body.getAttribute("data-station") || "index").trim();
  var isTenant = /^t/.test(base0);
  function tenantFile(f) { var b = f.replace(BASE, ""); if (b === "index.html") return BASE + "tindex.html"; return BASE + "t" + b; }
  function landlordFile(f) { var b = f.replace(BASE, ""); if (b === "tindex.html") return BASE + "index.html"; return BASE + b.replace(/^t/, ""); }
  var TSTATIONS = STATIONS.map(function (s) { var o = {}; for (var k in s) o[k] = s[k]; o.id = "t" + s.id; o.file = tenantFile(s.file); return o; });
  var STATIONS_ACTIVE = isTenant ? TSTATIONS : STATIONS;
  var cur = base0;
  var idx = -1;
  for (var k = 0; k < STATIONS_ACTIVE.length; k++) { if (STATIONS_ACTIVE[k].id === cur) { idx = k; break; } }
  if (idx < 0) idx = 0;
  var me = STATIONS_ACTIVE[idx];

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
    try { localStorage.setItem("busop-legal-theme", t); } catch (e) {}
    var b = document.getElementById("themeBtn");
    if (b) b.textContent = t === "dark" ? "☀" : "☾";
  }
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("busop-legal-theme"); } catch (e) {}
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
  var brand = el("a", "brand", '<span class="seal">商</span><span class="txt">商业运营法务 · 租赁合同审核</span>');
  brand.href = isTenant ? tenantFile(BASE + "index.html") : BASE + "index.html";
  topbar.appendChild(brand);

  var searchWrap = el("div", "searchwrap");
  var search = el("input");
  search.id = "search"; search.type = "search"; search.autocomplete = "off";
  search.placeholder = "搜索章节：统一收银 / 免租期 / 消防 / 保证金 / 撤场…";
  searchWrap.appendChild(search);
  var searchCount = el("span", "scount");
  searchWrap.appendChild(searchCount);
  topbar.appendChild(searchWrap);

  topbar.appendChild(el("span", "cur-chip", (isTenant ? "承租人视角 · " : "出租人视角 · ") + ((me.no === "总纲" || me.no === "附录") ? me.t : "第 " + me.no + " 章 · " + me.t)));

  /* ---------- 双视角切换：出租人视角 / 承租人视角（紧邻「全屏」） ---------- */
  var views = el("div", "views");
  var vsLandlord = el("button", "vs", "出租人视角");
  vsLandlord.type = "button";
  vsLandlord.title = "切换到出租人视角（甲方）";
  vsLandlord.setAttribute("aria-label", "出租人视角（甲方）");
  var vsTenant = el("button", "vs", "承租人视角");
  vsTenant.type = "button";
  vsTenant.title = "切换到承租人视角（乙方）";
  vsTenant.setAttribute("aria-label", "承租人视角（乙方）");
  if (isTenant) { vsTenant.classList.add("on"); } else { vsLandlord.classList.add("on"); }
  vsLandlord.addEventListener("click", function () {
    if (!isTenant) return;                 // 已在出租人视角，无需跳转
    location.href = landlordFile(me.file);
  });
  vsTenant.addEventListener("click", function () {
    if (isTenant) return;                  // 已在承租人视角，无需跳转
    location.href = tenantFile(me.file);
  });
  views.appendChild(vsLandlord);
  views.appendChild(vsTenant);
  topbar.appendChild(views);

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
  foot.appendChild(el("div", "lv", "<b>·</b>《民法典》合同编 · 租赁合同章（第 703—734 条）"));
  foot.appendChild(el("div", "lv", "<b>·</b>城镇房屋租赁合同司法解释（法释〔2009〕11 号，2020 修正）"));
  foot.appendChild(el("div", "lv", "<b>·</b>《消防法》（2021 修正）+ 住建部令第 51 号（2023 修正）"));
  foot.appendChild(el("div", "lv", "<b>·</b>支付受理终端管理：银发〔2021〕259 号"));
  foot.appendChild(el("div", "lv", "<b>·</b>全文脱敏；条号引用前对照现行文本复核"));
  side.appendChild(foot);

  /* ---------- 侧栏折叠（左折叠收起，可记忆） ---------- */
  var fab = el("button", "side-fab", "⟩ 目录");
  fab.setAttribute("aria-label", "展开目录");
  body.appendChild(fab);
  function setCollapsed(on) {
    document.body.classList.toggle("side-collapsed", on);
    try { localStorage.setItem("busop_side_collapsed", on ? "1" : "0"); } catch (e) {}
  }
  collapseBtn.addEventListener("click", function () { setCollapsed(true); });
  fab.addEventListener("click", function () { setCollapsed(false); });
  try {
    if (localStorage.getItem("busop_side_collapsed") === "1" && isWide()) setCollapsed(true);
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
    STATIONS_ACTIVE.forEach(function (s) {
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
