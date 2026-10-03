/* 人文历史 · 人物志 —— 站点脚本
   两种页面：
   - 文章页 <body data-p="p01-kongzi">：顶栏 + 左侧目录栏（独立滚动） + 主区（独立滚动）
   - 目录页 index.html：全宽人物卡片网格，顶栏带「全部人物」返回按钮 + 搜索过滤
   数据来自 assets/people.js（window.HISTORY_PEOPLE） */
(function () {
  'use strict';

  var P = window.HISTORY_PEOPLE || [];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var cur = document.body.getAttribute('data-p') || '';
  var isArticle = !!cur;

  /* ---------- 顶栏（两种页面共用） ---------- */
  var topbar = el('header', 'topbar');
  topbar.id = 'topbar';
  var brand = el('div', 'brand');
  brand.innerHTML = '人文历史<small>HUMANITIES</small>';
  var spacer = el('div', 'spacer');
  var toggle = el('button', 'btn side-toggle', '目录');
  toggle.type = 'button';
  var search = el('div', 'search');
  var input = document.createElement('input');
  input.type = 'search';
  input.placeholder = '搜人物 / 朝代';
  input.setAttribute('aria-label', '搜索人物');
  search.appendChild(input);
  var backBtn = el('a', 'btn', '全部人物');
  backBtn.setAttribute('href', 'index.html');

  topbar.appendChild(brand);
  topbar.appendChild(spacer);
  topbar.appendChild(toggle);
  topbar.appendChild(search);
  topbar.appendChild(backBtn);

  toggle.addEventListener('click', function () {
    var side = document.getElementById('side');
    if (side) side.classList.toggle('open');
  });

  /* ---------- 文章页：左栏目录 ---------- */
  var side = null;
  var groups = [];
  if (isArticle) {
    var order = [];
    var map = {};
    P.forEach(function (p) {
      if (!map[p.era]) { map[p.era] = []; order.push(p.era); }
      map[p.era].push(p);
    });

    // 复用 HTML 骨架里的 <aside id="side">，避免重复插入
    side = document.getElementById('side');
    if (!side) {
      side = el('aside');
      side.id = 'side';
      var row0 = document.querySelector('.row');
      if (row0) row0.insertBefore(side, row0.firstChild);
    }
    side.innerHTML = '';
    side.appendChild(el('div', 'side-group', '人物目录'));
    var ul = el('ul', 'side-list');

    var meIndex = -1;
    P.forEach(function (p, i) { if (p.id === cur) meIndex = i; });

    order.forEach(function (era) {
      ul.appendChild(el('li', '', ''));
      ul.lastChild.appendChild(el('div', 'side-group', esc(era)));
      var inner = el('ul', 'side-list');
      map[era].forEach(function (p) {
        var li = el('li', '', '');
        var a = el('a', p.id === cur ? 'on' : '', '');
        a.setAttribute('href', p.file);
        a.innerHTML = '<span class="no">' + esc(p.no) + '</span>' + esc(p.name);
        li.appendChild(a);
        inner.appendChild(li);
      });
      ul.appendChild(inner);
    });
    side.appendChild(ul);

    // 当前项滚入可视
    var onLink = side.querySelector('.on');
    if (onLink && onLink.scrollIntoView) {
      try { onLink.scrollIntoView({ block: 'center' }); } catch (e) { /* jsdom 兜底 */ }
    }

    // 上下篇
    var pager = document.getElementById('pager');
    if (pager) {
      var prev = meIndex > 0 ? P[meIndex - 1] : null;
      var next = meIndex >= 0 && meIndex < P.length - 1 ? P[meIndex + 1] : null;
      if (prev) {
        var pb = el('a', 'pbtn prev', '');
        pb.setAttribute('href', prev.file);
        pb.innerHTML = '<span class="dir">← 上一篇</span><span class="ttl">' + esc(prev.name) + '</span>';
        pager.appendChild(pb);
      }
      if (next) {
        var nb = el('a', 'pbtn next', '');
        nb.setAttribute('href', next.file);
        nb.innerHTML = '<span class="dir">下一篇 →</span><span class="ttl">' + esc(next.name) + '</span>';
        pager.appendChild(nb);
      }
    }
  }

  /* ---------- 组装布局（只注入顶栏，不重建 body，避免清掉 /theme-toggle.js） ---------- */
  var layout = document.querySelector('.layout');
  if (layout && topbar.parentNode !== layout) {
    layout.insertBefore(topbar, layout.firstChild);
  }

  /* ---------- 进度条（文章页） ---------- */
  if (isArticle) {
    var scroller = document.getElementById('mainwrap') || window;
    function updateProgress() {
      var box = document.getElementById('mainwrap');
      var h = box ? box.scrollHeight - box.clientHeight : 0;
      var bar = document.getElementById('progress');
      if (!bar) return;
      if (h > 0) {
        var ratio = box.scrollTop / h;
        bar.style.width = Math.min(100, Math.max(0, ratio * 100)) + '%';
      }
    }
    if (scroller && scroller.addEventListener) {
      scroller.addEventListener('scroll', updateProgress, { passive: true });
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- 搜索过滤 ---------- */
  function filter(q) {
    q = (q || '').trim().toLowerCase();
    var targets = isArticle
      ? document.querySelectorAll('#side a')
      : document.querySelectorAll('.cell');
    var hit = 0;
    for (var i = 0; i < targets.length; i++) {
      var t = targets[i];
      var text = (t.textContent || '') + ' ' + (t.getAttribute('data-kw') || '');
      var ok = !q || text.toLowerCase().indexOf(q) !== -1;
      if (ok) hit++;
      t.style.display = ok ? '' : 'none';
    }
    return hit;
  }
  input.addEventListener('input', function () { filter(input.value); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { input.value = ''; filter(''); }
  });
  filter('');
})();
