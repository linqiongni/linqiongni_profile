(function () {
  'use strict';
  var STATIONS = [{"id": "index", "no": "导览", "t": "全书导览", "part": "导览", "kw": "目录 摘要 结构 框架 开篇 虚构"}, {"id": "ch01", "no": "01", "t": "深夜烧烤店的最后一拳", "part": "第一卷 · 人身边界", "kw": "正当防卫 互殴 防卫过当 因果关系 伤情鉴定 监控"}, {"id": "ch02", "no": "02", "t": "出租屋里无人看见的死亡", "part": "第一卷 · 人身边界", "kw": "故意杀人 故意伤害致死 过失致人死亡 存疑不起诉 尸体检验 排除合理怀疑"}, {"id": "ch03", "no": "03", "t": "失控的方向盘", "part": "第一卷 · 人身边界", "kw": "过失致人死亡 意外事件 因果关系 车辆故障 侦查实验"}, {"id": "ch04", "no": "04", "t": "接孩子时发生的冲突", "part": "第一卷 · 人身边界", "kw": "非法拘禁 故意伤害 探望权 家庭矛盾 刑事拘留"}, {"id": "ch05", "no": "05", "t": "十四岁少年的秘密", "part": "第一卷 · 人身边界", "kw": "抢劫罪 刑事责任年龄 共同犯罪 从犯 附条件不起诉 记录封存"}, {"id": "ch06", "no": "06", "t": "中山一路的手机", "part": "第二卷 · 财物迷局", "kw": "抢劫罪 折叠刀 辨认笔录 扣押 坦白 自首 退赃"}, {"id": "ch07", "no": "07", "t": "便利店门口的苹果手机", "part": "第二卷 · 财物迷局", "kw": "盗窃 抢夺 转化型抢劫 时空连续性 伤情鉴定"}, {"id": "ch08", "no": "08", "t": "酒店遗落的手表", "part": "第二卷 · 财物迷局", "kw": "盗窃 侵占 遗忘物 管理占有 告诉才处理 自诉"}, {"id": "ch09", "no": "09", "t": "借来的汽车没有归还", "part": "第二卷 · 财物迷局", "kw": "诈骗 侵占 民事违约 非法占有目的 刑民交叉 电子数据"}, {"id": "ch10", "no": "10", "t": "仓库里少掉的二十箱货", "part": "第二卷 · 财物迷局", "kw": "职务侵占 盗窃 单位财物 职务便利 共同犯罪"}, {"id": "ch11", "no": "11", "t": "兼职刷单群", "part": "第三卷 · 屏幕背后的犯罪", "kw": "电信网络诈骗 主观明知 共同犯罪 从犯 犯罪金额"}, {"id": "ch12", "no": "12", "t": "银行卡里的三百万元流水", "part": "第三卷 · 屏幕背后的犯罪", "kw": "帮信罪 掩饰隐瞒犯罪所得 主观明知 上游犯罪 资金流水"}, {"id": "ch13", "no": "13", "t": "直播间里的投资导师", "part": "第三卷 · 屏幕背后的犯罪", "kw": "诈骗 非法经营 刑民交叉 交易对价 平台电子数据"}, {"id": "ch14", "no": "14", "t": "被删掉的聊天记录", "part": "第三卷 · 屏幕背后的犯罪", "kw": "敲诈勒索 权利行使 威胁 电子数据真实性 司法鉴定"}, {"id": "ch15", "no": "15", "t": "游戏账号交易骗局", "part": "第三卷 · 屏幕背后的犯罪", "kw": "虚拟财产 诈骗 盗窃 计算机犯罪 平台数据 价格认定"}, {"id": "ch16", "no": "16", "t": "凌晨两点的代驾订单", "part": "第四卷 · 危险现场", "kw": "危险驾驶 道路概念 醉酒标准 血样鉴定 行政刑事边界"}, {"id": "ch17", "no": "17", "t": "暴雨中的货车事故", "part": "第四卷 · 危险现场", "kw": "交通肇事 因果关系 事故责任认定 电子数据 被害人过错"}, {"id": "ch18", "no": "18", "t": "仓库里的烟花", "part": "第四卷 · 危险现场", "kw": "非法储存爆炸物 非法经营 行政犯 鉴定取样 罪刑法定"}, {"id": "ch19", "no": "19", "t": "楼道里蔓延的火", "part": "第四卷 · 危险现场", "kw": "放火 失火 间接故意 危险犯 火灾鉴定 财产损失"}, {"id": "ch20", "no": "20", "t": "包厢里的违禁物品", "part": "第四卷 · 危险现场", "kw": "容留他人吸毒 主观明知 场所控制 证人证言 经营者责任"}, {"id": "ch21", "no": "21", "t": "老板拿走的项目款", "part": "第五卷 · 公司与权力", "kw": "挪用资金 职务侵占 单位财产 非法占有目的 公司人格"}, {"id": "ch22", "no": "22", "t": "无法交付的五百台设备", "part": "第五卷 · 公司与权力", "kw": "合同诈骗 非法占有目的 刑民交叉 企业合规 审计"}, {"id": "ch23", "no": "23", "t": "虚开的发票", "part": "第五卷 · 公司与权力", "kw": "虚开增值税专用发票 单位犯罪 主观目的 审计 责任人员"}, {"id": "ch24", "no": "24", "t": "招标前的一只信封", "part": "第五卷 · 公司与权力", "kw": "行贿 受贿 谋取利益 言词证据 翻供 对合型犯罪"}, {"id": "ch25", "no": "25", "t": "执法记录仪缺失的六分钟", "part": "第五卷 · 公司与权力", "kw": "滥用职权 玩忽职守 非法拘禁 电子数据缺失 国家工作人员"}, {"id": "ch26", "no": "26", "t": "照片墙上的第六个人", "part": "第六卷 · 程序本身就是辩护", "kw": "辨认规则 孤证 证明标准 不在场证明 无罪辩护"}, {"id": "ch27", "no": "27", "t": "凌晨四点的讯问笔录", "part": "第六卷 · 程序本身就是辩护", "kw": "非法证据排除 疲劳审讯 同步录音录像 翻供 口供补强"}, {"id": "ch28", "no": "28", "t": "检察院作出的不起诉决定", "part": "第六卷 · 程序本身就是辩护", "kw": "不批准逮捕 补充侦查 不起诉 刑民交叉 审查起诉"}, {"id": "ch29", "no": "29", "t": "一份已经生效的判决", "part": "第六卷 · 程序本身就是辩护", "kw": "刑事申诉 审判监督 再审 新证据 错案救济 国家赔偿"}, {"id": "ch30", "no": "30", "t": "铁门打开以后", "part": "第六卷 · 程序本身就是辩护", "kw": "刑罚执行 减刑 假释 申诉 刑满释放 社会回归"}, {"id": "docs-ch01", "no": "文书", "t": "第一章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch02", "no": "文书", "t": "第二章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch16", "no": "文书", "t": "第十六章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch17", "no": "文书", "t": "第十七章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch18", "no": "文书", "t": "第十八章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch19", "no": "文书", "t": "第十九章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch20", "no": "文书", "t": "第二十章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch21", "no": "文书", "t": "第二十一章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch22", "no": "文书", "t": "第二十二章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch23", "no": "文书", "t": "第二十三章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch24", "no": "文书", "t": "第二十四章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch25", "no": "文书", "t": "第二十五章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch26", "no": "文书", "t": "第二十六章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch27", "no": "文书", "t": "第二十七章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch28", "no": "文书", "t": "第二十八章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch29", "no": "文书", "t": "第二十九章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}, {"id": "docs-ch30", "no": "文书", "t": "第三十章配套文书全集", "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"}];
  var PARTS = [{"key": "导览", "name": "导览", "desc": "全书摘要 / 结构 / 框架 / 目录"}, {"key": "第一卷 · 人身边界", "name": "第一卷 · 人身边界", "desc": "故意伤害 · 过失致死 · 非法拘禁"}, {"key": "第二卷 · 财物迷局", "name": "第二卷 · 财物迷局", "desc": "盗窃 · 抢劫 · 诈骗 · 侵占"}, {"key": "第三卷 · 屏幕背后的犯罪", "name": "第三卷 · 屏幕背后的犯罪", "desc": "电诈 · 帮信 · 网络虚拟财产"}, {"key": "第四卷 · 危险现场", "name": "第四卷 · 危险现场", "desc": "危险驾驶 · 交通肇事 · 放火 · 危险物品"}, {"key": "第五卷 · 公司与权力", "name": "第五卷 · 公司与权力", "desc": "挪用资金 · 合同诈骗 · 虚开 · 贿赂"}, {"key": "第六卷 · 程序本身就是辩护", "name": "第六卷 · 程序本身就是辩护", "desc": "辨认 · 讯问 · 不起诉 · 申诉 · 执行"}, {"key": "配套文书（虚构示例）", "name": "配套文书（虚构示例）", "desc": "接待 / 会见 / 辩护词 / 申请书模板"}];
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

  var body = document.body;
  var orig = [].slice.call(body.childNodes).filter(function (n) {
    return !(n.nodeType === 1 && n.tagName === 'SCRIPT');
  });

  var topbar = el('header', 'topbar');
  topbar.appendChild(el('div', 'brand', '刑事辩护实录<small>30 CRIMINAL CASES</small>'));
  var searchWrap = el('div', 'searchwrap');
  var search = el('input');
  search.id = 'search';
  search.type = 'search';
  search.autocomplete = 'off';
  search.placeholder = '搜索案件：正当防卫 / 诈骗 / 非法证据 / 辨认笔录 / 侵占 / 不起诉…';
  searchWrap.appendChild(search);
  var searchCount = el('span', 'scount');
  searchWrap.appendChild(searchCount);
  topbar.appendChild(searchWrap);
  topbar.appendChild(el('span', 'cur-chip', me.no === '导览' ? me.t : '第 ' + me.no + ' 章 · ' + me.t));
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
    } else {
      layout.style.height = '';
      side.style.top = h + 'px';
      side.style.height = 'calc(100vh - ' + h + 'px)';
    }
  }
  fitHeight();
  window.addEventListener('resize', fitHeight);

  var linkMap = {};
  PARTS.forEach(function (p) {
    var items = STATIONS.filter(function (s) { return s.part === p.key; });
    if (!items.length) return;
    var g = el('div', 'grp');
    g.appendChild(el('div', 'grp-h', p.name));
    if (p.desc) g.appendChild(el('div', 'grp-d', p.desc));
    items.forEach(function (s) {
      if (s.disabled) {
        var d = el('a', 'pending', '<span class="no">' + s.no + '</span>' + s.t + '<span class="tag">待续</span>');
        d.setAttribute('title', s.t + '（待续）');
        g.appendChild(d);
        return;
      }
      var a = el('a', s.id === cur ? 'on' : '', '<span class="no">' + s.no + '</span>' + s.t);
      a.href = hrefOf(s);
      a.title = s.t;
      linkMap[s.id] = a;
      g.appendChild(a);
    });
    side.appendChild(g);
  });

  var foot = el('div', 'sidefoot');
  foot.appendChild(el('div', 'badge', '内容性质'));
  foot.appendChild(el('div', 'lv', '<b>·</b>全部人物、地点、金额、案情与诉讼结果均为虚构'));
  foot.appendChild(el('div', 'lv', '<b>·</b>用于展示刑事辩护的事实判断、证据审查、程序控制与庭审策略'));
  foot.appendChild(el('div', 'lv', '<b>·</b>不构成对任何具体案件的法律意见'));
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

  var fab = el('button', 'side-fab', '⟩ 目录');
  fab.setAttribute('aria-label', '展开目录');
  body.appendChild(fab);
  function setCollapsed(on) {
    document.body.classList.toggle('side-collapsed', on);
    try { localStorage.setItem('crimrec_side_collapsed', on ? '1' : '0'); } catch (e) {}
  }
  collapseBtn.addEventListener('click', function () { setCollapsed(true); });
  fab.addEventListener('click', function () { setCollapsed(false); });
  try {
    if (localStorage.getItem('crimrec_side_collapsed') === '1' && isWide()) setCollapsed(true);
  } catch (e) {}

  search.addEventListener('input', function () {
    var q = (search.value || '').trim().toLowerCase();
    var n = 0;
    STATIONS.forEach(function (s) {
      if (s.disabled) return;
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
  function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(updProgress); } }
  main.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  var heads = [].slice.call(content.querySelectorAll('h2, h3'));
  heads.forEach(function (h, i) { if (!h.id) h.id = 'sec-' + (i + 1); });
  function scrollToHead(h) {
    if (main.scrollHeight - main.clientHeight > 4) {
      var mr = main.getBoundingClientRect();
      var hr = h.getBoundingClientRect();
      main.scrollTo({ top: main.scrollTop + hr.top - mr.top - 16, behavior: 'smooth' });
    } else { h.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
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
      li.appendChild(a); ol.appendChild(li);
    });
    inline.appendChild(ol);
    if (host) host.parentNode.insertBefore(inline, host.nextSibling);
    else content.insertBefore(inline, content.firstChild);
    var tocLinks = [].slice.call(tocBox.querySelectorAll('a'));
    var spy = false;
    function updSpy() {
      var mr = main.getBoundingClientRect();
      var active = null;
      heads.forEach(function (h) { if (h.getBoundingClientRect().top - mr.top <= 90) active = h; });
      if (!active) active = heads[0];
      tocLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-sec') === active.id); });
      spy = false;
    }
    main.addEventListener('scroll', function () { if (!spy) { spy = true; window.requestAnimationFrame(updSpy); } }, { passive: true });
    updSpy();
  }

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

  var liveStations = STATIONS.filter(function (s) { return !s.disabled; });
  var li = liveStations.findIndex(function (s) { return s.id === cur; });
  var wrap = content.querySelector('.wrap') || content;
  var pager = el('div', 'pager');
  if (li > 0) {
    var p = liveStations[li - 1];
    var a1 = el('a', 'prev', '<span class="dir">上一篇</span><span class="tt">' + p.no + ' ' + p.t + '</span>');
    a1.href = hrefOf(p);
    pager.appendChild(a1);
  }
  if (li >= 0 && li < liveStations.length - 1) {
    var nx = liveStations[li + 1];
    var a2 = el('a', 'next', '<span class="dir">下一篇</span><span class="tt">' + nx.no + ' ' + nx.t + '</span>');
    a2.href = hrefOf(nx);
    pager.appendChild(a2);
  }
  wrap.appendChild(pager);
  wrap.appendChild(el('div', 'site-foot',
    '《刑事辩护实录：三十宗虚拟案件的完整诉讼》为虚构案例作品集，全部人物姓名、单位名称、案发地点、金额、案件事实及诉讼结果均为虚构，不对应任何特定真实案件。本作品旨在展示刑事案件中事实认定、证据审查、程序保障与辩护方法，不构成对任何具体案件的法律意见。案件处理应以当时有效的法律、司法解释、证据材料及有权机关的依法认定为准。'));

  updProgress();
  if (location.hash && location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(function () { scrollToHead(target); }, 60);
  }
})();
