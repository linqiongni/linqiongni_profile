/* 经济犯罪刑事辩护全流程实务手册 · 站点脚本
   布局：顶栏 + 左侧固定目录栏 + 主区（独立滚动） + 右侧本页目录
   数据源：下方 STATIONS 数组。正文页只需 <body data-ch="ch01">。 */
(function () {
  'use strict';

  var STATIONS = [
    { id: 'index', no: '总纲', t: '手册总纲与使用说明', part: '开始', kw: '目录 法源 刑法修正案十二 立案追诉标准 怎么用 免责' },

    { id: 'ch01', no: '01', t: '接待当事人：咨询、风险告知与委托', part: '第一部分 · 通用全流程', kw: '咨询 风险告知 委托 刑事风险 民刑交叉 民事纠纷 收费 利益冲突' },
    { id: 'ch02', no: '02', t: '侦查阶段辩护：会见、意见书与取保', part: '第一部分 · 通用全流程', kw: '侦查 会见 法律意见书 取保候审 证据线索 冻结 查扣 赃款 37天 黄金救援期' },
    { id: 'ch03', no: '03', t: '审查起诉阶段：阅卷、质证与不起诉', part: '第一部分 · 通用全流程', kw: '审查起诉 阅卷 三性 审计报告 司法会计 不起诉 合规不起诉 企业合规 认罪认罚' },
    { id: 'ch04', no: '04', t: '一审审判阶段：庭前、庭审与数额辩护', part: '第一部分 · 通用全流程', kw: '一审 庭前会议 发问 质证 辩论 数额认定 非法证据排除 量刑 认罪认罚' },
    { id: 'ch05', no: '05', t: '二审、申诉、追赃挽损与涉案财物处置', part: '第一部分 · 通用全流程', kw: '二审 上诉 申诉 再审 追赃 挽损 涉案财物 违法所得 没收 执行' },
    { id: 'ch06', no: '06', t: '通用证据规则：流水、电子数据、账簿与鉴定', part: '第一部分 · 通用全流程', kw: '证据 资金流水 电子数据 会计账簿 审计 司法会计鉴定 质证 取证风险 技术侦查' },

    { id: 'ch07', no: '07', t: '合同诈骗罪', part: '第二部分 · 分罪名专项模块', kw: '合同诈骗 224条 非法占有目的 民事欺诈 履行能力 追诉标准 二万元 既遂未遂' },
    { id: 'ch08', no: '08', t: '非法吸收公众存款罪', part: '第二部分 · 分罪名专项模块', kw: '非吸 176条 法释2022 5号 四性 公开性 利诱性 社会性 资金池 P2P 退赃退赔 免予刑事处罚' },
    { id: 'ch09', no: '09', t: '集资诈骗罪', part: '第二部分 · 分罪名专项模块', kw: '集资诈骗 192条 非法占有目的 诈骗方法 10万 100万 挥霍 与非吸区分' },
    { id: 'ch10', no: '10', t: '虚开增值税专用发票罪', part: '第二部分 · 分罪名专项模块', kw: '虚开 205条 法释2024 4号 骗抵税款 10万 50万 500万 如实代开 挂靠 富余票' },
    { id: 'ch11', no: '11', t: '职务侵占罪、挪用资金罪与非国家工作人员受贿罪', part: '第二部分 · 分罪名专项模块', kw: '职务侵占 挪用资金 非国家工作人员受贿 修正案十一 修正案十二 3万 5万 单位意志 民企内部腐败' },
    { id: 'ch12', no: '12', t: '非法经营罪', part: '第二部分 · 分罪名专项模块', kw: '非法经营 225条 兜底条款 违反国家规定 专营专卖 放贷 烟草 外汇 虚拟币' },
    { id: 'ch13', no: '13', t: '掩饰、隐瞒犯罪所得、犯罪所得收益罪', part: '第二部分 · 分罪名专项模块', kw: '掩隐 312条 2025新解释 明知 帮信 洗钱 50万 500万 上游犯罪 两卡' },
    { id: 'ch14', no: '14', t: '骗取贷款、票据承兑、金融票证罪', part: '第二部分 · 分罪名专项模块', kw: '骗取贷款 175条之一 修正案十一 50万 直接经济损失 贷款诈骗 区分 过桥 转贷' },
    { id: 'ch15', no: '15', t: '走私类经济犯罪（要点）', part: '第二部分 · 分罪名专项模块', kw: '走私 153条 偷逃应缴税额 10万 50万 250万 法释2014 10号 低报价格 化整为零' },
    { id: 'ch16', no: '16', t: '证券、期货相关经济犯罪（要点）', part: '第二部分 · 分罪名专项模块', kw: '内幕交易 操纵市场 利用未公开信息 老鼠仓 法释2012 6号 法释2019 1号 期货和衍生品法' }
  ];

  var PARTS = [
    { key: '开始', name: '总纲', desc: '手册结构与法源基准' },
    { key: '第一部分 · 通用全流程', name: 'PART I · 通用全流程', desc: '接待 → 侦查 → 审查起诉 → 一审 → 二审/追赃 → 证据' },
    { key: '第二部分 · 分罪名专项模块', name: 'PART II · 分罪名模块', desc: '十类高频罪名 · 每章统一七节' }
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

  /* ---------- 复制按钮 ---------- */
  window.cp = function (btn) {
    var box = btn.parentNode;
    var clone = box.cloneNode(true);
    var b = clone.querySelector('.cp');
    if (b) b.parentNode.removeChild(b);
    var text = (clone.textContent || '').replace(/^\s*复制\s*/, '').trim();
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(fallback);
    } else { fallback(); }
    btn.textContent = '已复制';
    setTimeout(function () { btn.textContent = '复制'; }, 1600);
  };

  /* ---------- 重构 DOM：顶栏 + 左侧目录栏 + 主区 ---------- */
  var body = document.body;
  var orig = [].slice.call(body.childNodes).filter(function (n) {
    return !(n.nodeType === 1 && n.tagName === 'SCRIPT');
  });

  var topbar = el('header', 'topbar');
  topbar.appendChild(el('div', 'brand', '经济犯罪刑事辩护全流程实务手册<small>ECONOMIC CRIME DEFENSE PRACTICE</small>'));
  var searchWrap = el('div', 'searchwrap');
  var search = el('input');
  search.id = 'search';
  search.type = 'search';
  search.autocomplete = 'off';
  search.placeholder = '搜索章节：合同诈骗 / 非吸 / 虚开 / 掩隐 / 取保…';
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
  foot.appendChild(el('div', 'lv', '<b>·</b>《刑法》含修正案（十一）<br>（2021-03-01）与（十二）<br>（2024-03-01）'));
  foot.appendChild(el('div', 'lv', '<b>·</b>《立案追诉标准（二）》<br>2022 修订 2022-05-15 施行'));
  foot.appendChild(el('div', 'lv', '<b>·</b>法释〔2022〕5号 · 法释〔2024〕4号<br>掩隐两高新解释 2025-08-26'));
  side.appendChild(foot);

  /* ---------- 侧栏折叠 ---------- */
  var fab = el('button', 'side-fab', '⟩ 目录');
  fab.setAttribute('aria-label', '展开目录');
  body.appendChild(fab);
  function setCollapsed(on) {
    document.body.classList.toggle('side-collapsed', on);
    try { localStorage.setItem('econ_side_collapsed', on ? '1' : '0'); } catch (e) {}
  }
  collapseBtn.addEventListener('click', function () { setCollapsed(true); });
  fab.addEventListener('click', function () { setCollapsed(false); });
  try {
    if (localStorage.getItem('econ_side_collapsed') === '1' && isWide()) setCollapsed(true);
  } catch (e) {}

  var onLink = linkMap[cur];
  if (onLink && side.scrollHeight > side.clientHeight) {
    var t = onLink.offsetTop;
    if (t > side.scrollTop + side.clientHeight - 80 || t < side.scrollTop) {
      side.scrollTop = Math.max(0, t - 120);
    }
  }

  menuBtn.addEventListener('click', function () { side.classList.toggle('open'); });
  Object.keys(linkMap).forEach(function (k) {
    linkMap[k].addEventListener('click', function () { side.classList.remove('open'); });
  });

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

  /* ---------- 阅读进度条 ---------- */
  var pg = el('div');
  pg.id = 'progress';
  body.appendChild(pg);
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

  /* ---------- 本页目录 ---------- */
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
    tocBox.appendChild(el('div', 'toc-h', '本页目录'));
    heads.forEach(function (h) {
      var a = el('a', h.tagName === 'H3' ? 'lv3' : '', h.textContent);
      a.setAttribute('data-sec', h.id);
      a.addEventListener('click', function (e) { e.preventDefault(); scrollToHead(h); });
      tocBox.appendChild(a);
    });
    tocBox.classList.add('show');

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
    '经济犯罪刑事辩护全流程实务手册 · 法源基准：《刑法》（含修正案十一 2021-03-01、修正案十二 2024-03-01）、《刑事诉讼法》（2018 修正）、最高检公安部《立案追诉标准（二）》（2022 修订）、法释〔2022〕5 号、法释〔2024〕4 号、掩饰隐瞒两高新解释（2025-08-26 施行）等现行有效文本。<br>本站为律师同行实务参考，不构成具体案件的法律意见；条文与数额标准以官方现行文本为准，办案引用前请逐条核对。'));

  updProgress();

  if (location.hash && location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(function () { scrollToHead(target); }, 60);
  }
})();
