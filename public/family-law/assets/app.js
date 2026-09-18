/* 婚姻家事与遗产继承律师实务全流程手册 · 站点脚本
   布局：顶栏 + 左侧固定目录栏 + 主区（独立滚动） + 右侧本页目录
   数据源：下方 STATIONS 数组。正文页只需 <body data-ch="ch01">。 */
(function () {
  'use strict';

  var STATIONS = [
    { id: 'index', no: '总纲', t: '手册总纲与使用说明', part: '开始', kw: '目录 法源 民法典 司法解释 怎么用 免责' },

    { id: 'ch01', no: '01', t: '首次接待与咨询', part: '第一部分 · 通用全流程', kw: '接待 咨询 事实梳理 诉求预判 接案风险评估 报价 收费 风险代理 冲突检索' },
    { id: 'ch02', no: '02', t: '诉前准备：管辖、主体与财产线索摸排', part: '第一部分 · 通用全流程', kw: '管辖 专属管辖 经常居住地 户籍 当事人主体 财产线索 财产申报 调解前置 离婚冷静期' },
    { id: 'ch03', no: '03', t: '立案与保全', part: '第一部分 · 通用全流程', kw: '立案 诉状 财产保全 诉前保全 行为保全 证据保全 担保费 保全错误 诉责险' },
    { id: 'ch04', no: '04', t: '举证、质证与调查取证', part: '第一部分 · 通用全流程', kw: '举证 质证 调查令 法院调查 转移财产 追查 银行流水 不动产 公积金 保险 股权 电子证据 取证边界' },
    { id: 'ch05', no: '05', t: '家事调解', part: '第一部分 · 通用全流程', kw: '调解 调解优先 调解方案 调解协议 司法确认 调解书 强制执行 风险' },
    { id: 'ch06', no: '06', t: '开庭审理', part: '第一部分 · 通用全流程', kw: '开庭 庭审 法庭调查 辩论 最后陈述 本人出庭 离婚案件 不公开审理 情绪管理' },
    { id: 'ch07', no: '07', t: '判决与调解书的生效、履行与强制执行', part: '第一部分 · 通用全流程', kw: '生效 上诉期 履行 强制执行 执行申请 过户 抚养费 拒执罪' },
    { id: 'ch08', no: '08', t: '家事案件与商事案件的核心差异', part: '第一部分 · 通用全流程', kw: '差异 对照 不公开审理 人身属性 本人到庭 调解前置 证据标准 情感财产交织 职权探知' },

    { id: 'ch09', no: '09', t: '婚约财产纠纷（彩礼返还）实务', part: '第二部分 · 分案由专项', kw: '彩礼 婚约财产 三金 改口费 返还 2024 规定 同居 未登记 证据' },
    { id: 'ch10', no: '10', t: '诉讼离婚纠纷实务', part: '第二部分 · 分案由专项', kw: '诉讼离婚 感情破裂 判离标准 分居 家暴 赌博 吸毒 判不准离婚 六个月 再次起诉' },
    { id: 'ch11', no: '11', t: '离婚后财产纠纷实务', part: '第二部分 · 分案由专项', kw: '离婚后财产 隐匿转移 房产 存款 股权 公积金 保险 再分割 少分不分 诉讼时效' },
    { id: 'ch12', no: '12', t: '夫妻财产约定纠纷实务', part: '第二部分 · 分案由专项', kw: '婚前协议 婚内财产协议 忠诚协议 效力 AA制 过户 公序良俗 起草' },
    { id: 'ch13', no: '13', t: '抚养权、抚养费与探望权纠纷实务', part: '第二部分 · 分案由专项', kw: '抚养权 抚养费 探望权 变更抚养 增加抚养费 最有利于未成年子女 八周岁 两周岁 抢夺藏匿' },
    { id: 'ch14', no: '14', t: '同居关系纠纷实务', part: '第二部分 · 分案由专项', kw: '同居 同居析产 非婚生子女 解除同居 抚养 财产分割 补办结婚登记 事实婚姻' },
    { id: 'ch15', no: '15', t: '法定继承纠纷实务', part: '第二部分 · 分案由专项', kw: '法定继承 继承人范围 第一顺序 第二顺序 代位继承 转继承 遗产范围 遗产债务 析产 兄弟姐妹' },
    { id: 'ch16', no: '16', t: '遗嘱继承纠纷实务', part: '第二部分 · 分案由专项', kw: '遗嘱 自书 代书 打印 录音录像 公证 口头 见证人 必留份 遗嘱能力 撤回 变更 真实性 鉴定' },
    { id: 'ch17', no: '17', t: '遗赠与遗赠扶养协议纠纷实务', part: '第二部分 · 分案由专项', kw: '遗赠 受遗赠 六十日 接受放弃 遗赠扶养协议 解除 违约 遗嘱信托' },
    { id: 'ch18', no: '18', t: '涉外、涉港澳台婚姻家事与继承纠纷实务', part: '第二部分 · 分案由专项', kw: '涉外 港澳台 涉台 管辖 法律适用 涉外民事关系法律适用法 域外证据 公证认证 送达 判决承认执行' },

    { id: 'ch19', no: '19', t: '人身安全保护令申请实务', part: '第三部分 · 特殊程序与收尾', kw: '人身安全保护令 反家暴法 家庭暴力 恐吓跟踪骚扰 72小时 24小时 紧急 六个月 违反后果 法释2022-17' },
    { id: 'ch20', no: '20', t: '特别程序：宣告失踪、宣告死亡与行为能力认定', part: '第三部分 · 特殊程序与收尾', kw: '特别程序 宣告失踪 宣告死亡 无民事行为能力 限制民事行为能力 鉴定 指定财产代管人 监护' },
    { id: 'ch21', no: '21', t: '家事案件执行难点实务', part: '第三部分 · 特殊程序与收尾', kw: '执行 抚养费 探望权 强制执行 房产过户 交付财产 腾退 行为执行 迟延履行 信用惩戒' },
    { id: 'ch22', no: '22', t: '遗产管理人制度实务', part: '第三部分 · 特殊程序与收尾', kw: '遗产管理人 遗嘱执行人 指定 职责 责任 报酬 民事责任 特别程序 1145 1146 1147' },
    { id: 'ch23', no: '23', t: '再审、第三人撤销之诉与案外人执行异议', part: '第三部分 · 特殊程序与收尾', kw: '再审 第三人撤销之诉 案外人执行异议 虚假诉讼 假离婚 债权人 撤销权 六个月' },
    { id: 'ch24', no: '24', t: '附录：法条索引、期限速查与文书清单', part: '第三部分 · 特殊程序与收尾', kw: '附录 法条索引 期限 速查 文书 清单 诉讼费 检索路径' }
  ];

  var PARTS = [
    { key: '开始', name: '总纲', desc: '手册结构与法源基准' },
    { key: '第一部分 · 通用全流程', name: 'PART I · 通用全流程', desc: '接待 → 诉前 → 保全 → 举证 → 调解 → 庭审 → 生效执行' },
    { key: '第二部分 · 分案由专项', name: 'PART II · 分案由专项', desc: '10 类案由 · 每章统一五节' },
    { key: '第三部分 · 特殊程序与收尾', name: 'PART III · 特殊程序与收尾', desc: '保护令 / 特别程序 / 执行难点 / 遗产管理人 / 救济程序 / 附录' }
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
  topbar.appendChild(el('div', 'brand', '婚姻家事与遗产继承律师实务全流程手册<small>FAMILY &amp; SUCCESSION PRACTICE</small>'));
  var searchWrap = el('div', 'searchwrap');
  var search = el('input');
  search.id = 'search';
  search.type = 'search';
  search.autocomplete = 'off';
  search.placeholder = '搜索章节：彩礼 / 抚养权 / 遗嘱效力 / 保护令 / 涉外…';
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
  foot.appendChild(el('div', 'lv', '<b>·</b>《民法典》（2021-01-01 施行）<br>婚姻家庭编 / 继承编'));
  foot.appendChild(el('div', 'lv', '<b>·</b>婚姻家庭编解释（二）<br>法释〔2025〕1 号 · 2025-02-01 施行'));
  foot.appendChild(el('div', 'lv', '<b>·</b>婚姻家庭编解释（一）法释〔2020〕22 号<br>继承编解释（一）法释〔2020〕23 号'));
  foot.appendChild(el('div', 'lv', '<b>·</b>《反家庭暴力法》<br>保护令司法解释 法释〔2022〕17 号'));
  side.appendChild(foot);

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
    '婚姻家事与遗产继承律师实务全流程手册 · 法源基准：《中华人民共和国民法典》（2021 年 1 月 1 日施行，婚姻家庭编第 1042—1118 条、继承编第 1119—1163 条）、《最高人民法院关于适用〈中华人民共和国民法典〉婚姻家庭编的解释（一）》（法释〔2020〕22 号）与解释（二）（法释〔2025〕1 号，2025 年 2 月 1 日施行）、《最高人民法院关于适用〈中华人民共和国民法典〉继承编的解释（一）》（法释〔2020〕23 号）、《中华人民共和国反家庭暴力法》、《最高人民法院关于办理人身安全保护令案件适用法律若干问题的规定》（法释〔2022〕17 号）、《中华人民共和国涉外民事关系法律适用法》、《民事诉讼法》（2023 年修正）。<br>本站为实务操作参考，不构成具体案件的法律意见；司法解释条文序号以官方发布文本为准，办案前请核对现行有效版本。'));

  updProgress();

  // 支持 #锚点 直达小节
  if (location.hash && location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(function () { scrollToHead(target); }, 60);
  }
})();
