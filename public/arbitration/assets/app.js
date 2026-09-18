/* 商事仲裁实务全流程手册 · 站点脚本
   数据源：下方 STATIONS 数组。正文页只需 <body data-ch="ch01">。 */
(function () {
  'use strict';

  var STATIONS = [
    { id: 'index', no: '总纲', t: '手册总纲与使用说明', part: '首页' },

    { id: 'ch01', no: '01', t: '仲裁协议与仲裁条款拟定', part: '第一部分 · 通用流程' },
    { id: 'ch02', no: '02', t: '仲裁前：主管异议、时效、保全与证据固定', part: '第一部分 · 通用流程' },
    { id: 'ch03', no: '03', t: '立案申请：申请书、仲裁费与保全', part: '第一部分 · 通用流程' },
    { id: 'ch04', no: '04', t: '组庭：仲裁员选定、披露与回避', part: '第一部分 · 通用流程' },
    { id: 'ch05', no: '05', t: '答辩、管辖权异议与反请求', part: '第一部分 · 通用流程' },
    { id: 'ch06', no: '06', t: '举证、质证、鉴定与专家辅助', part: '第一部分 · 通用流程' },
    { id: 'ch07', no: '07', t: '开庭审理：流程、辩论与庭后工作', part: '第一部分 · 通用流程' },
    { id: 'ch08', no: '08', t: '裁决、调解与一裁终局', part: '第一部分 · 通用流程' },
    { id: 'ch09', no: '09', t: '仲裁与民事诉讼：规则差异全对照', part: '第一部分 · 通用流程' },

    { id: 'ch10', no: '10', t: '买卖合同仲裁实务', part: '第二部分 · 分合同类型' },
    { id: 'ch11', no: '11', t: '建设工程施工合同仲裁实务', part: '第二部分 · 分合同类型' },
    { id: 'ch12', no: '12', t: '租赁合同仲裁实务', part: '第二部分 · 分合同类型' },
    { id: 'ch13', no: '13', t: '服务 / 委托合同仲裁实务', part: '第二部分 · 分合同类型' },
    { id: 'ch14', no: '14', t: '特许经营合同仲裁实务', part: '第二部分 · 分合同类型' },
    { id: 'ch15', no: '15', t: '借款合同仲裁实务', part: '第二部分 · 分合同类型' },
    { id: 'ch16', no: '16', t: '货物进出口（国际贸易）合同仲裁实务', part: '第二部分 · 分合同类型' },

    { id: 'ch17', no: '17', t: '申请执行仲裁裁决', part: '第三部分 · 裁决后续程序' },
    { id: 'ch18', no: '18', t: '申请撤销仲裁裁决', part: '第三部分 · 裁决后续程序' },
    { id: 'ch19', no: '19', t: '不予执行仲裁裁决', part: '第三部分 · 裁决后续程序' },
    { id: 'ch20', no: '20', t: '附录：文书模板、清单与法条索引', part: '第三部分 · 裁决后续程序' }
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

  /* 顶部站条 */
  var bar = el('div', 'site-bar');
  var inner = el('div', 'inner');
  inner.appendChild(el('div', 'brand', '商事仲裁实务全流程手册<small>COMMERCIAL ARBITRATION PRACTICE</small>'));
  inner.appendChild(el('span', 'part-chip', me.part));
  var chips = el('nav', 'chips');
  STATIONS.forEach(function (s) {
    var a = el('a', s.id === cur ? 'on' : '', s.no + ' ' + s.t);
    a.href = s.id === 'index' ? 'index.html' : s.id + '.html';
    a.title = s.t;
    chips.appendChild(a);
  });
  inner.appendChild(chips);
  bar.appendChild(inner);
  document.body.insertBefore(bar, document.body.firstChild);

  /* 阅读进度条 */
  var pg = el('div');
  pg.id = 'progress';
  document.body.appendChild(pg);
  var ticking = false;
  function upd() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    pg.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(upd); }
  }, { passive: true });
  upd();

  /* 页内目录（自动收集 h2） */
  var host = document.querySelector('header.page-head');
  var h2s = document.querySelectorAll('.wrap h2');
  if (host && h2s.length > 3) {
    var toc = el('div', 'toc');
    toc.appendChild(el('div', 'h', '本页目录'));
    var ol = el('ol');
    h2s.forEach(function (h, i) {
      if (!h.id) h.id = 'sec-' + (i + 1);
      var li = el('li');
      li.appendChild(el('a', null, h.textContent)).href = '#' + h.id;
      ol.appendChild(li);
    });
    toc.appendChild(ol);
    host.parentNode.insertBefore(toc, host.nextSibling);
  }

  /* 折叠控件条 */
  document.querySelectorAll('.tplbar button[data-fold]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('data-fold') === 'open';
      var kind = btn.getAttribute('data-fold-kind');
      var scope = btn.getAttribute('data-fold-scope');
      var root = scope ? document.getElementById(scope) : document;
      if (!root) return;
      root.querySelectorAll('details.' + kind).forEach(function (d) { d.open = open; });
    });
  });

  /* 上下篇 */
  var wrap = document.querySelector('.wrap');
  if (wrap) {
    var pager = el('div', 'pager');
    if (idx > 0) {
      var p = STATIONS[idx - 1];
      var a1 = el('a', 'prev', '<span class="dir">上一篇</span><span class="tt">' + p.no + ' ' + p.t + '</span>');
      a1.href = p.id === 'index' ? 'index.html' : p.id + '.html';
      pager.appendChild(a1);
    }
    if (idx < STATIONS.length - 1) {
      var n = STATIONS[idx + 1];
      var a2 = el('a', 'next', '<span class="dir">下一篇</span><span class="tt">' + n.no + ' ' + n.t + '</span>');
      a2.href = n.id === 'index' ? 'index.html' : n.id + '.html';
      pager.appendChild(a2);
    }
    wrap.appendChild(pager);

    var foot = el('div', 'site-foot',
      '商事仲裁实务全流程手册 · 法源基准：2025 年 9 月 12 日修订、2026 年 3 月 1 日起施行的《中华人民共和国仲裁法》（8 章 96 条）、《民法典》、《民事诉讼法》（2023 年修正）及配套司法解释。<br>本站为实务操作参考，不构成具体案件的法律意见；条文以官方文本为准，办案前请核对现行有效版本与受理机构的现行仲裁规则。');
    wrap.appendChild(foot);
  }
})();
