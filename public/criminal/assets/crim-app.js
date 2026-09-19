/* 刑事辩护全流程实务手册 · 站点脚本
   布局：顶栏 + 左侧固定目录栏（独立滚动） + 主区（独立滚动） + 右侧本页目录
   与「婚姻家事与遗产继承」手册同源（STATIONS 数组驱动）。正文页只需 <body data-ch="id">。 */
(function () {
  'use strict';

  var STATIONS = [
    { id: 'index', no: '总纲', t: '手册总纲与全流程地图', part: '总纲', kw: '目录 法源 刑诉法 全流程 怎么用 免责 版本' },

    { id: 'flow', no: '01', t: '流程鸟瞰：公检法执行全链条', part: 'PART I · 全流程实务', kw: '立案 侦查 审查逮捕 审查起诉 退补 一审 二审 死刑复核 执行 期间 流程 阶段' },
    { id: 'intake', no: '02', t: '收案与委托：接待、利益冲突、委托手续', part: 'PART I · 全流程实务', kw: '收案 委托 接待 利益冲突 风险告知 委托协议 收费 会见手续 亲属委托' },
    { id: 'meeting', no: '03', t: '会见：看守所会见全流程与风险', part: 'PART I · 全流程实务', kw: '会见 看守所 羁押 通信 传递物品 违规 禁止 笔录 核实 串供' },
    { id: 'investigation', no: '04', t: '侦查阶段辩护：取保、意见、核证', part: 'PART I · 全流程实务', kw: '侦查 取保候审 羁押必要性 辩护意见 证据核实 非法证据 讯问 撤销案件' },
    { id: 'review', no: '05', t: '阅卷与审查起诉：摘卷、证据审查、不起诉', part: 'PART I · 全流程实务', kw: '阅卷 案卷 证据审查 非法证据排除 不起诉 认罪认罚 量刑建议 退补' },
    { id: 'trial', no: '06', t: '一审庭审：发问、质证、辩论、最后陈述', part: 'PART I · 全流程实务', kw: '庭审 法庭调查 发问 质证 辩论 最后陈述 证人 鉴定人 非法证据 辩护词' },
    { id: 'post', no: '07', t: '二审、死刑复核与执行阶段辩护', part: 'PART I · 全流程实务', kw: '二审 上诉 死刑复核 发回重审 执行 申诉 减刑 假释 再审' },
    { id: 'special', no: '08', t: '特别程序与执业风险防范', part: 'PART I · 全流程实务', kw: '特别程序 未成年人 刑事和解 缺席审判 违法所得没收 强制医疗 执业风险 底线 规范' },

    { id: 'templates', no: '09', t: '文书库：会见笔录、辩护词、申请书模板', part: 'PART II · 工具与模板', kw: '文书 模板 会见笔录 辩护词 取保候审申请书 法律意见书 格式 起草' },
    { id: 'tools', no: '10', t: '工具：期间计算、法条检索、清单', part: 'PART II · 工具与模板', kw: '工具 期间计算 量刑 检索 checklist 清单 计算器 台账' },
    { id: 'law', no: '12', t: '法条与术语速查', part: 'PART II · 工具与模板', kw: '法条 术语 刑诉法 解释 条文 缩略语 2021' },

    { id: 'plan', no: '11', t: '30 天训练计划（跟练版）', part: 'PART III · 训练计划', kw: '30天 训练计划 每日 实操 陪练 指令 模块 跟练' }
  ];

  var PARTS = [
    { key: '总纲', name: '总纲', desc: '手册结构与法源基准' },
    { key: 'PART I · 全流程实务', name: 'PART I · 全流程实务', desc: '收案 → 会见 → 侦查 → 阅卷 → 庭审 → 二审执行' },
    { key: 'PART II · 工具与模板', name: 'PART II · 工具与模板', desc: '文书模板 / 计算工具 / 法条术语' },
    { key: 'PART III · 训练计划', name: 'PART III · 训练计划', desc: '30 天跟练，每日一模块' }
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
  topbar.appendChild(el('div', 'brand', '刑事辩护全流程实务手册<small>CRIMINAL DEFENSE</small>'));
  var searchWrap = el('div', 'searchwrap');
  var search = el('input');
  search.id = 'search';
  search.type = 'search';
  search.autocomplete = 'off';
  search.placeholder = '搜索章节：会见 / 取保候审 / 阅卷 / 质证 / 二审 / 死刑复核…';
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
  foot.appendChild(el('div', 'lv', '<b>·</b>《刑事诉讼法》<br>2018 年修正本 · 308 条'));
  foot.appendChild(el('div', 'lv', '<b>·</b>法释〔2021〕1 号<br>刑诉法解释 · 655 条（2021-03-01 施行）'));
  foot.appendChild(el('div', 'lv', '<b>·</b>刑诉法第四次修改在途<br>条号以现行文本为准'));
  foot.appendChild(el('div', 'lv', '<b>·</b>《律师办理刑事案件规范》<br>全国律协 2017-08-27'));
  side.appendChild(foot);

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

  /* ---------- 阅读进度条（主区滚动） ---------- */
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
    tocBox.appendChild(el('div', 'toc-h', '本页目录'));
    heads.forEach(function (h) {
      var a = el('a', h.tagName === 'H3' ? 'lv3' : '', h.textContent);
      a.setAttribute('data-sec', h.id);
      a.addEventListener('click', function (e) { e.preventDefault(); scrollToHead(h); });
      tocBox.appendChild(a);
    });
    tocBox.classList.add('show');

    var host = content.querySelector('header.page-head') || content.querySelector('.sub');
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

  /* ---------- 折叠控件条（如有 .tplbar） ---------- */
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

  /* 复制按钮（plan 页 .cp 用） */
  window.cp = function (btn) {
    var box = btn.closest('.pbox') || btn.parentElement;
    var txt = box ? box.innerText : '';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () {
        var o = btn.textContent; btn.textContent = '已复制';
        setTimeout(function () { btn.textContent = o; }, 1200);
      }).catch(function () {});
    }
  };

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
    '刑事辩护全流程实务手册 · 法源基准：《中华人民共和国刑事诉讼法》（2018 年 10 月 26 日第三次修正，共 308 条）、《最高人民法院关于适用〈中华人民共和国刑事诉讼法〉的解释》（法释〔2021〕1 号，2021 年 3 月 1 日施行，共 655 条）、中华全国律师协会《律师办理刑事案件规范》（2017 年 8 月 27 日第九届全国律协常务理事会第八次会议通过）。<br>刑事诉讼法第四次修改已列入立法规划（在途），条文序号可能随修法变动；本手册为学习训练材料，不构成对具体案件的法律意见，办案前请核对现行有效官方文本与所在地高院／省检实施细则。'));

  updProgress();

  if (location.hash && location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(function () { scrollToHead(target); }, 60);
  }
})();
