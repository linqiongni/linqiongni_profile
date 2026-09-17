(function () {
  var DOCS = window.DOCS || [];
  var GROUPS = window.GROUPS || [];
  var nav = document.getElementById('nav');
  var content = document.getElementById('content');
  var tocBox = document.getElementById('toc');
  var main = document.getElementById('main');
  var sidebar = document.getElementById('sidebar');
  var search = document.getElementById('search');
  var searchCount = document.getElementById('searchCount');
  var menuBtn = document.getElementById('menuBtn');
  var tocBtn = document.getElementById('tocBtn');
  var crumb = document.getElementById('crumb');

  var linkMap = {};
  var curId = null;

  function encodeId(id) { return encodeURIComponent(id); }

  function buildNav() {
    var html = '';
    GROUPS.forEach(function (g) {
      var items = DOCS.filter(function (d) { return d.groupKey === g.key; });
      if (!items.length) { return; }
      html += '<div class="grp"><div class="grp-h">' + g.name + '</div>';
      if (g.desc) { html += '<div class="grp-d">' + g.desc + '</div>'; }
      items.forEach(function (d) {
        html += '<a href="#/' + encodeId(d.id) + '" data-id="' + d.id + '">' +
          d.title.replace(/^#+\s*/, '') + '</a>';
      });
      html += '</div>';
    });
    nav.innerHTML = html;
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
      linkMap[a.getAttribute('data-id')] = a;
      a.addEventListener('click', function () {
        sidebar.classList.remove('open');
      });
    });
  }

  function mark(id) {
    Object.keys(linkMap).forEach(function (k) { linkMap[k].classList.remove('on'); });
    var a = linkMap[id];
    if (!a) { return; }
    a.classList.add('on');
    var t = a.offsetTop;
    if (t > sidebar.scrollTop + sidebar.clientHeight - 60 || t < sidebar.scrollTop) {
      sidebar.scrollTop = Math.max(0, t - 120);
    }
  }

  function buildToc(d) {
    var items = (d.toc || []).filter(function (x) { return x.lv <= 3; });
    if (items.length < 3) { tocBox.innerHTML = ''; tocBox.classList.remove('show'); return; }
    var h = '<div class="toc-h">本页目录</div>';
    items.forEach(function (x) {
      h += '<a class="lv' + x.lv + '" href="#/' + encodeId(d.id) + '" data-sec="' + x.id + '">' + x.t + '</a>';
    });
    tocBox.innerHTML = h;
    tocBox.classList.add('show');
    Array.prototype.forEach.call(tocBox.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var el = document.getElementById(a.getAttribute('data-sec'));
        if (el) {
          var top = el.getBoundingClientRect().top + main.scrollTop - 12;
          main.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  function render(id) {
    var d = null;
    for (var i = 0; i < DOCS.length; i++) { if (DOCS[i].id === id) { d = DOCS[i]; break; } }
    if (!d) {
      content.innerHTML = '<h1>保险 · 法律维权知识体系</h1>' +
        '<p class="empty">从左侧选择一篇开始。建议先读「开始这里 · 怎么用这套东西」。</p>';
      tocBox.innerHTML = ''; tocBox.classList.remove('show');
      crumb.textContent = '';
      return;
    }
    curId = d.id;
    content.innerHTML = d.html;
    buildToc(d);
    mark(d.id);
    crumb.textContent = d.group;
    main.scrollTop = 0;
    window.scrollTo(0, 0);
    document.title = d.title + ' · 保险法律维权';
  }

  function current() {
    var h = location.hash || '';
    if (h.indexOf('#/') === 0) {
      try { return decodeURIComponent(h.slice(2)); } catch (e) { return ''; }
    }
    return '';
  }

  function route() {
    var id = current();
    var sec = null;
    if (id.indexOf('#') > 0) { sec = id.split('#')[1]; id = id.split('#')[0]; }
    render(id);
    if (sec) {
      setTimeout(function () {
        var el = document.getElementById(sec);
        if (el) { main.scrollTop = el.getBoundingClientRect().top + main.scrollTop - 12; }
      }, 30);
    }
  }

  function filter(q) {
    q = (q || '').trim().toLowerCase();
    var n = 0;
    DOCS.forEach(function (d) {
      var a = linkMap[d.id];
      if (!a) { return; }
      if (!q) { a.classList.remove('hide'); return; }
      var hay = (d.title + ' ' + (d.text || '')).toLowerCase();
      if (hay.indexOf(q) >= 0) { a.classList.remove('hide'); n++; }
      else { a.classList.add('hide'); }
    });
    Array.prototype.forEach.call(nav.querySelectorAll('.grp'), function (g) {
      var vis = g.querySelectorAll('a:not(.hide)').length;
      g.style.display = vis ? '' : 'none';
    });
    if (!q) { searchCount.textContent = ''; return; }
    searchCount.textContent = n ? n + ' 篇命中' : '无命中';
  }

  buildNav();
  route();
  window.addEventListener('hashchange', route);
  search.addEventListener('input', function () { filter(search.value); });
  menuBtn.addEventListener('click', function () { sidebar.classList.toggle('open'); });
  if (tocBtn) {
    tocBtn.addEventListener('click', function () { tocBox.classList.toggle('open'); });
  }

  if (!current()) {
    var first = DOCS.filter(function (d) { return d.groupKey === 'README.md'; })[0] || DOCS[0];
    if (first) { location.hash = '#/' + encodeId(first.id); }
  }
})();
