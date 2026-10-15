/* ============================================================
 * 韩语笔记 · 交互
 * 纯前端,零依赖。内容来自 data.js。
 * 笔记存 localStorage(按技能 id),换设备不云同步——纯本地草稿。
 * ============================================================ */
(function () {
  if (typeof window === 'undefined') return;
  var hasMM = !!(window.matchMedia);
  function narrow() { return hasMM ? window.matchMedia('(max-width: 1000px)').matches : (window.innerWidth < 1000); }

  // 合并正式技能 + 占位技能
  var skills = KO_SKILLS.map(function (s) { return s; });
  KO_STUB.forEach(function (s) {
    skills.push({ id: s[0], unit: s[1], title: s[2], titleZh: s[3], stub: true });
  });
  var byId = {};
  skills.forEach(function (s) { byId[s.id] = s; });
  var order = skills.map(function (s) { return s.id; });
  var unitNames = {};
  KO_UNITS.forEach(function (u) { unitNames[u.id] = u.name; });

  var side = document.getElementById('side');
  var main = document.getElementById('main');
  var mainwrap = document.getElementById('mainwrap');
  var toc = document.getElementById('toc');
  var prog = document.querySelector('#progress > i');
  var scrim = document.getElementById('scrim');
  var search = document.getElementById('search');
  var cur = null;

  // ---------- 侧栏 ----------
  function buildSide(filter) {
    var html = '';
    var groups = {};
    skills.forEach(function (s) {
      var t = (s.title + ' ' + s.titleZh + ' ' + (s.stub ? '待补' : '')).toLowerCase();
      if (filter && t.indexOf(filter) === -1) return;
      (groups[s.unit] = groups[s.unit] || []).push(s);
    });
    Object.keys(groups).forEach(function (uid) {
      html += '<div class="unit">' + (unitNames[uid] || ('单元 ' + uid)) + '</div>';
      groups[uid].forEach(function (s) {
        var en = s.title.split('·')[0].trim();
        html += '<a href="#' + s.id + '" data-id="' + s.id + '" class="' + (s.stub ? 'stub' : '') + '">' +
          en + ' <span class="zh">' + s.titleZh.split(':')[0] + '</span></a>';
      });
    });
    if (!html) html = '<div class="unit">无匹配</div>';
    side.innerHTML = html;
    highlightSide();
  }
  function highlightSide() {
    var links = side.querySelectorAll('a');
    links.forEach(function (a) {
      if (a.getAttribute('data-id') === cur) a.classList.add('on');
      else a.classList.remove('on');
    });
  }

  // ---------- 渲染单篇 ----------
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function renderArticle(s) {
    var parts = [];
    parts.push('<div class="article">');
    parts.push('<span class="unit-tag">' + esc(unitNames[s.unit] || ('单元 ' + s.unit)) + '</span>');
    parts.push('<h1>' + esc(s.title) + '</h1>');
    parts.push('<div class="sub">' + esc(s.titleZh) + '</div>');

    if (s.stub) {
      parts.push('<div class="tip"><b>本技能内容待补充。</b><br>这是多邻国韩语课程后续单元的导航占位。当你学到这一课时,把语法点和生词填进 <code>data.js</code> 里对应的项(加 grammar / vocab 字段),左侧目录和本页会自动更新。</div>');
    } else {
      (s.grammar || []).forEach(function (g) {
        parts.push('<div class="block"><h4>' + esc(g.h) + '</h4>');
        if (g.p) parts.push('<p>' + esc(g.p) + '</p>');
        if (g.ex && g.ex.length) {
          parts.push('<div class="ex">');
          g.ex.forEach(function (e) {
            parts.push('<div class="row2"><span class="ko">' + esc(e[0]) + '</span><span class="me">' + esc(e[1]) + '</span></div>');
          });
          parts.push('</div>');
        }
        parts.push('</div>');
      });

      if (s.vocab && s.vocab.length) {
        parts.push('<h2>词汇表</h2><div class="vocab">');
        s.vocab.forEach(function (v) {
          parts.push('<div class="v"><div class="k">' + esc(v[0]) + '</div><div class="m">' + esc(v[1]) + ' · ' + esc(v[2]) + '</div></div>');
        });
        parts.push('</div>');
      }

      if (s.tip) {
        parts.push('<div class="tip"><b>学习提示 · </b>' + esc(s.tip) + '</div>');
      }
    }

    // 个人笔记
    parts.push('<div class="notes"><div class="nt-h">📝 我的笔记 <span class="saved" id="saved">已保存</span></div>' +
      '<textarea id="nta" placeholder="在这里写你自己的笔记——例句、易错点、和 App 里对不上的地方……内容只存在本机浏览器(localStorage),不会上传。"></textarea>' +
      '<div class="hint">仅存本机浏览器,清缓存会丢;重要内容请另存。可随时回来续写。</div></div>');

    // 上一篇/下一篇
    var i = order.indexOf(s.id);
    var prev = i > 0 ? byId[order[i - 1]] : null;
    var next = i < order.length - 1 ? byId[order[i + 1]] : null;
    parts.push('<div class="pager">');
    parts.push(prev ? '<a class="prev" href="#' + prev.id + '"><span class="lab">← 上一篇</span>' + esc(prev.title.split('·')[0].trim()) + '</a>' : '<a class="prev disabled"><span class="lab">← 上一篇</span>已是第一篇</a>');
    parts.push(next ? '<a class="next" href="#' + next.id + '"><span class="lab">下一篇 →</span>' + esc(next.title.split('·')[0].trim()) + '</a>' : '<a class="next disabled"><span class="lab">下一篇 →</span>已是最后一篇</a>');
    parts.push('</div>');

    parts.push('<div class="footer-note">韩语笔记 · 对齐多邻国韩语课程(经典技能树) · 讲解为中文+韩文+罗马音,便于对照 App 做笔记</div>');
    parts.push('</div>');

    main.innerHTML = parts.join('');
    wireNotes(s.id);
    buildToc();
  }

  function renderHome() {
    var parts = [];
    parts.push('<div class="article">');
    parts.push('<span class="unit-tag">总览</span>');
    parts.push('<h1>韩语笔记</h1>');
    parts.push('<div class="sub">对齐多邻国韩语课程 · 中文讲解 + 韩文例句 + 罗马音 · 每课可写私人笔记</div>');
    parts.push('<p>左边选一課开始。每课预填了语法讲解当底稿,底部「我的笔记」区可随手记——内容只存本机浏览器。后续单元已留导航位,学到再补。</p>');
    parts.push('<div class="home-grid">');
    var groups = {};
    skills.forEach(function (s) { (groups[s.unit] = groups[s.unit] || []).push(s); });
    Object.keys(groups).forEach(function (uid) {
      groups[uid].forEach(function (s) {
        parts.push('<a class="cell ' + (s.stub ? 'stub' : '') + '" href="#' + s.id + '">' +
          '<div class="t">' + esc(s.title.split('·')[0].trim()) + '</div>' +
          '<div class="z">' + esc(s.titleZh) + '</div>' +
          '<div class="u">' + esc(unitNames[uid] || ('单元 ' + uid)) + '</div></a>');
      });
    });
    parts.push('</div></div>');
    main.innerHTML = parts.join('');
    toc.innerHTML = '';
    if (prog) prog.style.width = '0%';
  }

  // ---------- 右栏本页目录 ----------
  function buildToc() {
    var hs = main.querySelectorAll('.article h2, .article h3');
    if (!hs.length) { toc.innerHTML = ''; return; }
    var html = '<div class="tt">本页目录</div>';
    hs.forEach(function (h, idx) {
      h.id = h.id || ('h' + idx);
      html += '<a href="javascript:void(0)" data-t="' + h.id + '" class="' + (h.tagName === 'H3' ? 'h3' : '') + '">' + esc(h.textContent) + '</a>';
    });
    toc.innerHTML = html;
    toc.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        var el = document.getElementById(a.getAttribute('data-t'));
        if (el) {
          if (narrow()) el.scrollIntoView({ behavior: 'smooth' });
          else mainwrap.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
        }
      });
    });
  }

  // ---------- 笔记 ----------
  function wireNotes(id) {
    var ta = document.getElementById('nta');
    if (!ta) return;
    var key = 'ko-notes-' + id;
    try { ta.value = localStorage.getItem(key) || ''; } catch (e) {}
    var saved = document.getElementById('saved');
    var t;
    ta.addEventListener('input', function () {
      try { localStorage.setItem(key, ta.value); } catch (e) {}
      if (saved) { saved.classList.add('show'); clearTimeout(t); t = setTimeout(function () { saved.classList.remove('show'); }, 1200); }
    });
  }

  // ---------- 滚动:进度 + scrollspy ----------
  function onScroll() {
    var scrollEl = narrow() ? document.documentElement : mainwrap;
    var max = (scrollEl.scrollHeight - scrollEl.clientHeight) || 1;
    var top = scrollEl.scrollTop || document.documentElement.scrollTop || 0;
    if (prog) prog.style.width = Math.min(100, (top / max) * 100) + '%';
    // scrollspy
    var hs = main.querySelectorAll('.article h2, .article h3');
    var curH = null, best = -1;
    hs.forEach(function (h) {
      var y = (narrow() ? h.getBoundingClientRect().top : h.offsetTop) - (narrow() ? 120 : 20);
      if (y <= 0 && y > best) { best = y; curH = h.id; }
    });
    toc.querySelectorAll('a').forEach(function (a) {
      a.classList.toggle('on', a.getAttribute('data-t') === curH);
    });
  }

  // ---------- 路由 ----------
  function route() {
    var id = (location.hash || '').replace('#', '');
    if (!id || !byId[id]) { cur = null; renderHome(); closeDrawer(); return; }
    cur = id;
    renderArticle(byId[id]);
    highlightSide();
    if (!narrow()) mainwrap.scrollTop = 0; else window.scrollTo(0, 0);
    closeDrawer();
    onScroll();
  }

  // ---------- 抽屉(手机) ----------
  function openDrawer() { side.classList.add('open'); scrim.classList.add('show'); }
  function closeDrawer() { side.classList.remove('open'); scrim.classList.remove('show'); }

  // ---------- 主题 ----------
  function setTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode === 'dark' ? 'dark' : 'light');
  }
  function toggleTheme() {
    var now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = now === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('ko-theme', next); } catch (e) {}
  }

  // ---------- 初始化 ----------
  function init() {
    buildSide('');
    // 主题:嵌入主站则等父页消息;独立打开则读本地/系统偏好
    var stored = null;
    try { stored = localStorage.getItem('ko-theme'); } catch (e) {}
    if (window.self !== window.top) {
      setTheme('light'); // 默认,父页会再发一次
    } else {
      var sysDark = hasMM && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(stored || (sysDark ? 'dark' : 'light'));
    }
    window.addEventListener('message', function (e) {
      var d = e.data;
      if (d && d.type === 'theme' && (d.mode === 'dark' || d.mode === 'light')) setTheme(d.mode);
    });

    document.getElementById('themeBtn').addEventListener('click', toggleTheme);
    document.getElementById('menuBtn').addEventListener('click', openDrawer);
    scrim.addEventListener('click', closeDrawer);

    if (search) {
      search.addEventListener('input', function () { buildSide(search.value.trim().toLowerCase()); });
    }
    side.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a && a.getAttribute('data-id')) { /* hash 改变触发 route */ }
    });
    window.addEventListener('hashchange', route);
    mainwrap.addEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);

    route();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
