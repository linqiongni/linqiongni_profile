/* 商事仲裁实务全流程手册 · 站点脚本
   布局：顶栏 + 左侧固定目录栏 + 主区（独立滚动） + 右侧本页目录
   数据源：下方 STATIONS 数组。正文页只需 <body data-ch="ch01">。 */
(function () {
  'use strict';

  var STATIONS = [
    { id: 'index', no: '总纲', t: '手册总纲与使用说明', part: '开始', kw: '目录 法源 仲裁法 修订 怎么用' },

    { id: 'ch01', no: '01', t: '仲裁协议与仲裁条款拟定', part: '第一部分 · 通用流程', kw: '仲裁条款 仲裁协议 管辖权 主管 仲裁机构 约定不明 示范条款' },
    { id: 'ch02', no: '02', t: '仲裁前：主管异议、时效、保全与证据固定', part: '第一部分 · 通用流程', kw: '主管异议 诉讼时效 仲裁时效 财产保全 行为保全 证据固定 公证' },
    { id: 'ch03', no: '03', t: '立案申请：申请书、仲裁费与保全', part: '第一部分 · 通用流程', kw: '立案 申请书 仲裁请求 仲裁费 受理' },
    { id: 'ch04', no: '04', t: '组庭：仲裁员选定、披露与回避', part: '第一部分 · 通用流程', kw: '组庭 仲裁员 选定 披露 回避 独任 三人庭' },
    { id: 'ch05', no: '05', t: '答辩、管辖权异议与反请求', part: '第一部分 · 通用流程', kw: '答辩 答辩书 管辖权异议 反请求 抵销' },
    { id: 'ch06', no: '06', t: '举证、质证、鉴定与专家辅助', part: '第一部分 · 通用流程', kw: '举证 质证 鉴定 专家辅助人 证据清单 逾期举证' },
    { id: 'ch07', no: '07', t: '开庭审理：流程、辩论与庭后工作', part: '第一部分 · 通用流程', kw: '开庭 庭审 辩论 代理意见 庭后 调解' },
    { id: 'ch08', no: '08', t: '裁决、调解与一裁终局', part: '第一部分 · 通用流程', kw: '裁决 调解书 一裁终局 终局裁决 生效 补正' },
    { id: 'ch09', no: '09', t: '仲裁与民事诉讼：规则差异全对照', part: '第一部分 · 通用流程', kw: '民诉 差异 对照 第三人 上诉 再审 报核 司法审查' },

    { id: 'ch10', no: '10', t: '买卖合同仲裁实务', part: '第二部分 · 分合同类型', kw: '买卖 质量 检验期 异议期 违约金 交付 风险转移 所有权保留' },
    { id: 'ch11', no: '11', t: '建设工程施工合同仲裁实务', part: '第二部分 · 分合同类型', kw: '建设工程 施工 造价 结算 工期 签证 索赔 质量 保修 优先受偿' },
    { id: 'ch12', no: '12', t: '租赁合同仲裁实务', part: '第二部分 · 分合同类型', kw: '租赁 房屋租赁 租金 押金 装修 转租 解除 腾退' },
    { id: 'ch13', no: '13', t: '服务 / 委托合同仲裁实务', part: '第二部分 · 分合同类型', kw: '服务 委托 居间 中介 顾问 成果验收 任意解除 报酬' },
    { id: 'ch14', no: '14', t: '特许经营合同仲裁实务', part: '第二部分 · 分合同类型', kw: '特许经营 加盟 商业特许经营管理条例 信息披露 冷静期 加盟费' },
    { id: 'ch15', no: '15', t: '借款合同仲裁实务', part: '第二部分 · 分合同类型', kw: '借款 民间借贷 利息 LPR 复利 逾期利息 保证 担保 让与担保' },
    { id: 'ch16', no: '16', t: '货物进出口（国际贸易）合同仲裁实务', part: '第二部分 · 分合同类型', kw: '国际贸易 进出口 信用证 提单 CISG 联合国国际货物销售合同公约 不可抗力 汇率 关税 域外裁决' },

    { id: 'ch17', no: '17', t: '申请执行仲裁裁决', part: '第三部分 · 裁决后续程序', kw: '执行 申请执行 强制执行 管辖法院 执行时效 二年' },
    { id: 'ch18', no: '18', t: '申请撤销仲裁裁决', part: '第三部分 · 裁决后续程序', kw: '撤裁 撤销裁决 撤销仲裁裁决 三个月 法定事由 重新仲裁 报核' },
    { id: 'ch19', no: '19', t: '不予执行仲裁裁决', part: '第三部分 · 裁决后续程序', kw: '不予执行 民事诉讼法 248 条 涉外 公共利益 同时申请' },
    { id: 'ch20', no: '20', t: '附录：文书模板、清单与法条索引', part: '第三部分 · 裁决后续程序', kw: '附录 模板 范本 清单 法条索引 期限 费用 检索路径' }
  ];

  var PARTS = [
    { key: '开始', name: '总纲', desc: '手册结构与法源基准' },
    { key: '第一部分 · 通用流程', name: 'PART I · 通用流程', desc: '签约前 → 立案 → 组庭 → 开庭 → 裁决' },
    { key: '第二部分 · 分合同类型', name: 'PART II · 分合同类型', desc: '七类合同 · 每章统一六节' },
    { key: '第三部分 · 裁决后续程序', name: 'PART III · 裁决后续', desc: '执行 / 撤销 / 不予执行 / 附录' }
  ];

  var cur = document.body.getAttribute('data-ch') || 'index';
  var idx = STATIONS.findIndex(function (s) { return s.id === cur; });
  if (idx < 0) idx = 0;
  var me = STATIONS[idx];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function hrefOf(s) { return s.id === 'index' ? 'index.html' : s.id + '.html'; }

  /* ---------- 重构 DOM：顶栏 + 左侧目录栏 + 主区 ---------- */
  var body = document.body;
  var orig = [].slice.call(body.childNodes).filter(function (n) {
    return !(n.nodeType === 1 && n.tagName === 'SCRIPT');
  });

  var topbar = el('header', 'topbar');
  topbar.appendChild(el('div', 'brand', '商事仲裁实务全流程手册<small>COMMERCIAL ARBITRATION PRACTICE</small>'));
  var searchWrap = el('div', 'searchwrap');
  var search = el('input');
  search.id = 'search';
  search.type = 'search';
  search.autocomplete = 'off';
  search.placeholder = '搜索章节：仲裁条款 / 管辖权 / 撤裁 / 建设工程…';
  searchWrap.appendChild(search);
  var searchCount = el('span', 'scount');
  searchWrap.appendChild(searchCount);
  topbar.appendChild(searchWrap);
  topbar.appendChild(el('span', 'cur-chip', me.no === '总纲' ? me.t : '第 ' + me.no + ' 章 · ' + me.t));
  var menuBtn = el('button', 'menu-btn', '目录');
  menuBtn.setAttribute('aria-label', '打开目录');
  topbar.appendChild(menuBtn);

  var layout = el('div', 'layout');
  var side = el('aside', 'side');
  side.id = 'side';
  // 侧栏折叠：头部 + 折叠控件
  var sideHd = el('div', 'side-hd');
  sideHd.appendChild(el('span', 't', '目录'));
  var collapseBtn = el('button', 'collapse-btn', '⟨');
  collapseBtn.setAttribute('aria-label', '收起目录');
  collapseBtn.title = '收起目录（左折叠）';
  sideHd.appendChild(collapseBtn);
  side.appendChild(sideHd);
  var main = el('div', 'main');
  main.id = 'main';
  var bodywrap = el('div', 'bodywrap');
  var content = el('div', 'content');
  orig.forEach(function (n) { content.appendChild(n); });
  var tocBox = el('aside', 'pagetoc');
  tocBox.id = 'pagetoc';
  bodywrap.appendChild(content);
  bodywrap.appendChild(tocBox);
  main.appendChild(bodywrap);
  layout.appendChild(side);
  layout.appendChild(main);

  body.appendChild(topbar);
  body.appendChild(layout);

  // 顶栏高度实测后校准：宽屏主区独立滚动；窄屏侧栏变抽屉，按实测顶栏高度定位
  function isWide() {
    if (window.matchMedia) return window.matchMedia('(min-width: 1001px)').matches;
    return (window.innerWidth || 1024) >= 1001;
  }
  function fitHeight() {
    var h = topbar.offsetHeight || 56;
    if (isWide()) {
      layout.style.height = 'calc(100vh - ' + h + 'px)';
      side.style.top = '';
      side.style.height = '';
    } else {
      layout.style.height = '';
      side.style.top = h + 'px';
      side.style.height = 'calc(100vh - ' + h + 'px)';
    }
  }
  fitHeight();
  window.addEventListener('resize', fitHeight);

  /* ---------- 左侧目录栏 ---------- */
  var linkMap = {};
  PARTS.forEach(function (p) {
    var items = STATIONS.filter(function (s) { return s.part === p.key; });
    if (!items.length) return;
    var g = el('div', 'grp');
    g.appendChild(el('div', 'grp-h', p.name));
    g.appendChild(el('div', 'grp-d', p.desc));
    items.forEach(function (s) {
      var a = el('a', s.id === cur ? 'on' : '', '<span class="no">' + s.no + '</span>' + s.t);
      a.href = hrefOf(s);
      a.title = s.t;
      linkMap[s.id] = a;
      g.appendChild(a);
    });
    side.appendChild(g);
  });

  var foot = el('div', 'sidefoot');
  foot.appendChild(el('div', 'badge', '法源基准'));
  foot.appendChild(el('div', 'lv', '<b>·</b>《仲裁法》2025 修订<br>2026-03-01 施行'));
  foot.appendChild(el('div', 'lv', '<b>·</b>撤裁期限：收到裁决书<br>之日起 3 个月内'));
  foot.appendChild(el('div', 'lv', '<b>·</b>《民法典》《民事诉讼法》<br>（2023 修正）及配套司法解释'));
  side.appendChild(foot);

  /* ---------- 侧栏折叠（左折叠收起，可记忆） ---------- */
  var fab = el('button', 'side-fab', '⟩ 目录');
  fab.setAttribute('aria-label', '展开目录');
  body.appendChild(fab);
  function setCollapsed(on) {
    document.body.classList.toggle('side-collapsed', on);
    try { localStorage.setItem('arb_side_collapsed', on ? '1' : '0'); } catch (e) {}
  }
  collapseBtn.addEventListener('click', function () { setCollapsed(true); });
  fab.addEventListener('click', function () { setCollapsed(false); });
  try {
    if (localStorage.getItem('arb_side_collapsed') === '1' && isWide()) setCollapsed(true);
  } catch (e) {}

  // 当前项滚入可视区
  var onLink = linkMap[cur];
  if (onLink && side.scrollHeight > side.clientHeight) {
    var t = onLink.offsetTop;
    if (t > side.scrollTop + side.clientHeight - 80 || t < side.scrollTop) {
      side.scrollTop = Math.max(0, t - 120);
    }
  }

  // 抽屉（窄屏）
  menuBtn.addEventListener('click', function () { side.classList.toggle('open'); });
  Object.keys(linkMap).forEach(function (k) {
    linkMap[k].addEventListener('click', function () { side.classList.remove('open'); });
  });

  // 搜索过滤
  search.addEventListener('input', function () {
    var q = (search.value || '').trim().toLowerCase();
    var n = 0;
    STATIONS.forEach(function (s) {
      var a = linkMap[s.id];
      if (!a) return;
      if (!q) { a.classList.remove('hide'); return; }
      var hay = (s.no + ' ' + s.t + ' ' + s.part + ' ' + (s.kw || '')).toLowerCase();
      if (hay.indexOf(q) >= 0) { a.classList.remove('hide'); n++; }
      else { a.classList.add('hide'); }
    });
    [].slice.call(side.querySelectorAll('.grp')).forEach(function (g) {
      g.style.display = g.querySelectorAll('a:not(.hide)').length ? '' : 'none';
    });
    searchCount.textContent = !q ? '' : (n ? n + ' 篇命中' : '无命中');
  });

  /* ---------- 阅读进度条（主区滚动） ---------- */
  var pg = el('div');
  pg.id = 'progress';
  body.appendChild(pg);
  // 宽屏：主区独立滚动；窄屏：整页滚动。两种都取到正确进度
  function scroller() {
    var inner = main.scrollHeight - main.clientHeight;
    if (inner > 4) return { top: main.scrollTop, max: inner };
    var de = document.documentElement;
    return { top: window.scrollY || de.scrollTop, max: de.scrollHeight - de.clientHeight };
  }
  var ticking = false;
  function updProgress() {
    var s = scroller();
    pg.style.width = (s.max > 0 ? (s.top / s.max) * 100 : 0) + '%';
    ticking = false;
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updProgress); }
  }
  main.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 本页目录：宽屏右侧栏 + 窄屏页内块 ---------- */
  var heads = [].slice.call(content.querySelectorAll('h2, h3'));
  heads.forEach(function (h, i) { if (!h.id) h.id = 'sec-' + (i + 1); });

  function scrollToHead(h) {
    if (main.scrollHeight - main.clientHeight > 4) {
      var mr = main.getBoundingClientRect();
      var hr = h.getBoundingClientRect();
      main.scrollTo({ top: main.scrollTop + hr.top - mr.top - 16, behavior: 'smooth' });
    } else {
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  if (heads.length >= 3) {
    // 右侧栏
    tocBox.appendChild(el('div', 'toc-h', '本页目录'));
    heads.forEach(function (h) {
      var a = el('a', h.tagName === 'H3' ? 'lv3' : '', h.textContent);
      a.setAttribute('data-sec', h.id);
      a.addEventListener('click', function (e) { e.preventDefault(); scrollToHead(h); });
      tocBox.appendChild(a);
    });
    tocBox.classList.add('show');

    // 页内块（窄屏回落）
    var host = content.querySelector('header.page-head');
    var inline = el('div', 'toc');
    inline.appendChild(el('div', 'h', '本页目录'));
    var ol = el('ol');
    heads.forEach(function (h) {
      var li = el('li');
      var a = el('a', null, h.textContent);
      a.href = '#' + h.id;
      a.addEventListener('click', function (e) { e.preventDefault(); scrollToHead(h); });
      li.appendChild(a);
      ol.appendChild(li);
    });
    inline.appendChild(ol);
    if (host) host.parentNode.insertBefore(inline, host.nextSibling);
    else content.insertBefore(inline, content.firstChild);

    // 滚动高亮
    var tocLinks = [].slice.call(tocBox.querySelectorAll('a'));
    var spy = false;
    function updSpy() {
      var mr = main.getBoundingClientRect();
      var active = null;
      heads.forEach(function (h) {
        if (h.getBoundingClientRect().top - mr.top <= 90) active = h;
      });
      if (!active) active = heads[0];
      tocLinks.forEach(function (a) {
        a.classList.toggle('on', a.getAttribute('data-sec') === active.id);
      });
      spy = false;
    }
    main.addEventListener('scroll', function () {
      if (!spy) { spy = true; window.requestAnimationFrame(updSpy); }
    }, { passive: true });
    updSpy();
  }

  /* ---------- 折叠控件条 ---------- */
  [].slice.call(document.querySelectorAll('.tplbar button[data-fold]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('data-fold') === 'open';
      var kind = btn.getAttribute('data-fold-kind');
      var scope = btn.getAttribute('data-fold-scope');
      var root = scope ? document.getElementById(scope) : document;
      if (!root) return;
      [].slice.call(root.querySelectorAll('details.' + kind)).forEach(function (d) { d.open = open; });
    });
  });

  /* ---------- 上下篇 + 页脚 ---------- */
  var wrap = content.querySelector('.wrap') || content;
  var pager = el('div', 'pager');
  if (idx > 0) {
    var p = STATIONS[idx - 1];
    var a1 = el('a', 'prev', '<span class="dir">上一篇</span><span class="tt">' + p.no + ' ' + p.t + '</span>');
    a1.href = hrefOf(p);
    pager.appendChild(a1);
  }
  if (idx < STATIONS.length - 1) {
    var n = STATIONS[idx + 1];
    var a2 = el('a', 'next', '<span class="dir">下一篇</span><span class="tt">' + n.no + ' ' + n.t + '</span>');
    a2.href = hrefOf(n);
    pager.appendChild(a2);
  }
  wrap.appendChild(pager);

  wrap.appendChild(el('div', 'site-foot',
    '商事仲裁实务全流程手册 · 法源基准：2025 年 9 月 12 日修订、2026 年 3 月 1 日起施行的《中华人民共和国仲裁法》（8 章 96 条）、《民法典》、《民事诉讼法》（2023 年修正）及配套司法解释。<br>本站为实务操作参考，不构成具体案件的法律意见；条文以官方文本为准，办案前请核对现行有效版本与受理机构的现行仲裁规则。'));

  updProgress();

  // 支持 #锚点 直达小节
  if (location.hash && location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(function () { scrollToHead(target); }, 60);
  }
})();
