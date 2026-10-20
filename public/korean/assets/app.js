/* ============================================================
 * 韩语课程对照本 · 交互
 * 纯前端，零依赖。内容来自 data.js。
 * 目录 = 多邻国 App 的单元编号（第 N 单元），App 学到哪就点哪。
 * 笔记 / 原句存 localStorage（按单元），只在本机浏览器。
 * ============================================================ */
(function () {
  if (typeof window === 'undefined') return;
  var hasMM = !!(window.matchMedia);
  function narrow() { return hasMM ? window.matchMedia('(max-width: 1000px)').matches : (window.innerWidth < 1000); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ---------- 组装单元列表 ----------
  var UNITS = [];
  KO_UNITS_RAW.forEach(function (u) {
    UNITS.push({ key: 'u' + u[0], no: u[0], sec: u[1], title: u[2], en: u[3] });
  });
  KO_EXTRA.forEach(function (e) {
    UNITS.push({ key: e.id, no: null, sec: e.sec, title: e.title, en: '' });
  });

  var byKey = {};
  var sections = {};
  KO_SECTIONS.forEach(function (s) { sections[s.id] = s; });
  var PART_NAME = { 1: '第一部分', 2: '第二部分', 3: '第三部分', 4: '第四部分' };

  UNITS.forEach(function (u) {
    u.notion = (typeof KO_NOTION !== 'undefined' && u.no && KO_NOTION[u.no]) || null;
    u.content = KO_CONTENT[u.no] || KO_CONTENT[u.key] || null;
    u.search = (u.title + ' ' + (u.en || '') + ' ' + (u.no || '') + ' ' + (u.notion ? u.notion.tag : '') + ' ' +
      (u.content ? JSON.stringify(u.content) : '') + (u.notion ? JSON.stringify(u.notion) : '')).toLowerCase();
    byKey[u.key] = u;
  });
  var order = UNITS.map(function (u) { return u.key; });

  function label(u) { return u.no ? ('第 ' + u.no + ' 单元 · ' + u.title) : u.title; }

  var side = document.getElementById('side');
  var main = document.getElementById('main');
  var mainwrap = document.getElementById('mainwrap');
  var toc = document.getElementById('toc');
  var prog = document.querySelector('#progress > i');
  var scrim = document.getElementById('scrim');
  var search = document.getElementById('search');
  var jump = document.getElementById('jump');
  var cur = null;

  // ---------- 侧栏（按「部分」分组，每条 = 一个单元） ----------
  function buildSide(filter) {
    var html = '';
    KO_SECTIONS.forEach(function (sec) {
      var list = UNITS.filter(function (u) {
        if (u.sec !== sec.id) return false;
        if (filter && u.search.indexOf(filter) === -1) return false;
        return true;
      });
      if (!list.length) return;
      html += '<div class="unit">' + esc(sec.name) + ' <span class="rng">' + esc(sec.range) + '</span></div>';
      list.forEach(function (u) {
        html += '<a href="#' + u.key + '" data-key="' + u.key + '" class="' + (u.content ? '' : 'stub') + '">' +
          '<span class="no">' + (u.no || '附') + '</span>' + esc(u.title) + '</a>';
      });
    });
    if (!html) html = '<div class="unit">无匹配</div>';
    side.innerHTML = html;
    highlightSide();
  }
  function highlightSide() {
    side.querySelectorAll('a').forEach(function (a) {
      a.classList.toggle('on', a.getAttribute('data-key') === cur);
    });
  }

  // ---------- 单篇 ----------
  function renderArticle(u) {
    if (u.notion) { renderNotion(u); return; }
    var c = u.content || {};
    var sec = sections[u.sec] || {};
    var parts = [];
    parts.push('<div class="article">');
    parts.push('<span class="unit-tag">' + esc(sec.name || '') + (u.no ? ' · 第 ' + u.no + ' 单元' : '') + '</span>');
    parts.push('<h1>' + esc(u.title) + '</h1>');
    parts.push('<div class="sub">' + (u.no ? '第 ' + u.no + ' 单元' : '附录') + (u.en ? ' · 课程内部名 ' + esc(u.en) : '') + '</div>');
    if (c.goal) parts.push('<p class="goal">' + esc(c.goal) + '</p>');
    if (!u.content) {
      parts.push('<div class="tip"><b>本单元的讲解还没写。</b><br>' +
        '目录结构已经按 App 的单元编号就位——你在 App 里学到第 ' + (u.no || '') + ' 单元时，' +
        '把语法点和生词记在下面「我的笔记」里即可。需要我把这个单元的内容写满，跟我说单元号。</div>');
    } else {
      if (c.grammar && c.grammar.length) {
        parts.push('<h2>语法要点</h2>');
        c.grammar.forEach(function (g) {
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
      }
      if (c.sent && c.sent.length) {
        parts.push('<h2>本单元典型句型</h2><div class="ex sentbox">');
        c.sent.forEach(function (e) {
          parts.push('<div class="row2"><span class="ko">' + esc(e[0]) + '</span><span class="me">' + esc(e[1]) + '</span></div>');
        });
        parts.push('</div>');
      }
      if (c.story && c.story.length) {
        parts.push('<h2>小故事</h2><div class="ex sentbox story">');
        c.story.forEach(function (e) {
          parts.push('<div class="row2"><span class="ko">' + esc(e[0]) + '</span><span class="me">' + esc(e[1]) + '</span></div>');
        });
        parts.push('</div>');
      }
      if (c.vocab && c.vocab.length) {
        parts.push('<h2>词汇表</h2><div class="vocab">');
        c.vocab.forEach(function (v) {
          parts.push('<div class="v"><div class="k">' + esc(v[0]) + '</div><div class="m">' + esc(v[1]) + ' · ' + esc(v[2]) + '</div></div>');
        });
        parts.push('</div>');
      }
      if (c.tip) parts.push('<div class="tip"><b>学习提示 · </b>' + esc(c.tip) + '</div>');
    }

    // App 原句记录
    parts.push('<div class="notes"><div class="nt-h">✎ App 原句记录 <span class="saved" id="savedS">已保存</span></div>' +
      '<textarea id="snt" class="tight" placeholder="在 App 里遇到的句子，抄这里（韩文 + 中文）。下次翻到这个单元就能对上。只存本机浏览器。"></textarea>' +
      '<div class="hint">按单元存：换到别的单元，这里就是它的句子本。</div></div>');

    // 我的笔记
    parts.push('<div class="notes"><div class="nt-h">📝 我的笔记 <span class="saved" id="savedN">已保存</span></div>' +
      '<textarea id="nta" placeholder="语法点、易错点、和 App 对不上的地方……只存本机浏览器（localStorage），不上传。"></textarea>' +
      '<div class="hint">清缓存会丢；重要内容请另存。可随时回来续写。</div></div>');

    // 上一篇 / 下一篇
    parts.push(pagerHtml(u));

    parts.push('<div class="footer-note">韩语课程对照本 · 目录与多邻国 App 的单元编号一一对应 · 讲解中文 + 韩文 + 罗马音</div>');
    parts.push('</div>');

    main.innerHTML = parts.join('');
    wireNotes(u.key);
    buildToc();
  }

  // ---------- 已并入 Notion 的单元：句子 / 小故事 / 笔记 ----------
  // 板块 = 你的笔记里实际存在的块（有「2-3笔记」才有笔记板块），每块一个音频。
  function audioSrc(name) {
    try { return encodeURI('assets/audio/' + name); } catch (e) { return 'assets/audio/' + name; }
  }

  function renderNotion(u) {
    var c = u.notion;
    var parts = [];
    parts.push('<div class="article notion">');
    parts.push('<span class="unit-tag">' + esc(PART_NAME[c.part] || '') + ' · 第 ' + c.pno + ' 单元</span>');
    parts.push('<h1>' + esc(u.title) + '</h1>');
    parts.push('<div class="sub">' + esc(c.tag) + ' · 总第 ' + u.no + ' 单元 · ' +
      c.blocks.length + ' 个板块（' + c.blocks.map(function (b) { return b.t; }).join(' / ') + '）</div>');

    c.blocks.forEach(function (b) {
      parts.push('<section class="blk" id="blk-' + b.k + '">');
      parts.push('<h2 data-toc="' + esc(b.t) + '">' + esc(b.t) + (b.sub ? '<span class="rng-h">' + esc(b.sub) + '</span>' : '') +
        '<span class="cnt">' + b.rows.length + ' 条</span></h2>');
      parts.push('<div class="audio" data-audio="' + esc(audioSrc(b.audio)) + '">' +
        '<audio controls preload="metadata" src="' + esc(audioSrc(b.audio)) + '"></audio></div>');
      parts.push('<div class="ex sentbox ' + (b.k === 'story' ? 'story' : b.k === 'note' ? 'notelist' : 'plain') + '">');
      b.rows.forEach(function (r) {
        var cls = 'row2' + (r.who ? ' has-who' : '') + (!r.ko ? ' narr' : '');
        parts.push('<div class="' + cls + '">');
        if (r.who) parts.push('<span class="who">' + esc(r.who) + '</span>');
        else if (r.no) parts.push('<span class="idx">' + esc(r.no) + '</span>');
        if (r.ko) parts.push('<span class="ko">' + esc(r.ko) + '</span>');
        if (r.zh) parts.push('<span class="me">' + esc(r.zh) + '</span>');
        parts.push('</div>');
      });
      parts.push('</div></section>');
    });

    parts.push(pagerHtml(u));
    parts.push('<div class="footer-note">原文照录自你的韩语笔记 · 句子 / 小故事 / 笔记 与音频一一对应</div>');
    parts.push('</div>');

    main.innerHTML = parts.join('');
    wireAudio();
    buildToc();
  }

  // 音频缺失时把播放器收起来，不留一个坏控件
  function wireAudio() {
    main.querySelectorAll('.audio audio').forEach(function (a) {
      a.addEventListener('error', function () {
        var box = a.parentNode;
        if (box) box.style.display = 'none';
      });
    });
  }

  function pagerHtml(u) {
    var i = order.indexOf(u.key);
    var prev = i > 0 ? byKey[order[i - 1]] : null;
    var next = i < order.length - 1 ? byKey[order[i + 1]] : null;
    var html = '<div class="pager">';
    html += prev ? '<a class="prev" href="#' + prev.key + '"><span class="lab">← 上一单元</span>' + esc(label(prev)) + '</a>' : '<a class="prev disabled"><span class="lab">← 上一单元</span>已是第一个</a>';
    html += next ? '<a class="next" href="#' + next.key + '"><span class="lab">下一单元 →</span>' + esc(label(next)) + '</a>' : '<a class="next disabled"><span class="lab">下一单元 →</span>已是最后一个</a>';
    html += '</div>';
    return html;
  }

  function renderHome() {
    var n = UNITS.filter(function (u) { return !!(u.content || u.notion); }).length;
    var nn = UNITS.filter(function (u) { return !!u.notion; }).length;
    var parts = [];
    parts.push('<div class="article">');
    parts.push('<span class="unit-tag">总览</span>');
    parts.push('<h1>韩语课程对照本</h1>');
    parts.push('<div class="sub">目录 = 多邻国 App 的单元编号 · 已并入 ' + nn + ' 个单元的原始笔记（句子 / 小故事 / 笔记 + 音频）</div>');
    parts.push('<p class="goal">用法：在 App 里看你在「第几单元」，左栏点同一个编号就行。' +
      '带「原文」标记的单元是从你的韩语笔记原样搬过来的，按笔记里实际的块分板块——只有句子、或句子+小故事、或句子+小故事+笔记。' +
      '全部 ' + n + ' / ' + UNITS.length + ' 个单元有内容。</p>');
    parts.push('<p class="note">其余单元是按「单元主题」整理的<b>通用学习参考</b>（目标 + 语法 + 词表 + 句型），' +
      '不是官方题库。你在 App 里遇到的句子，可以抄进对应单元的「App 原句记录」——等你的笔记覆盖到那一段，我再按原文替换。</p>');
    KO_SECTIONS.forEach(function (sec) {
      var list = UNITS.filter(function (u) { return u.sec === sec.id; });
      if (!list.length) return;
      parts.push('<h2>' + esc(sec.name) + ' <span class="rng-h">' + esc(sec.range) + '</span></h2>');
      parts.push('<div class="home-grid">');
      list.forEach(function (u) {
        var z = u.notion
          ? (u.notion.tag + ' · ' + u.notion.blocks.map(function (b) { return b.t; }).join(' / '))
          : (u.content && u.content.goal ? u.content.goal : (u.content ? '' : '待补'));
        parts.push('<a class="cell ' + (u.notion ? 'notion' : (u.content ? '' : 'stub')) + '" href="#' + u.key + '">' +
          '<div class="t">' + (u.no ? '<span class="no">' + u.no + '</span>' : '') + esc(u.title) +
          (u.notion ? '<span class="badge">原文</span>' : '') + '</div>' +
          '<div class="z">' + esc(z) + '</div>' +
          '</a>');
      });
      parts.push('</div>');
    });
    parts.push('</div>');
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
      html += '<a href="javascript:void(0)" data-t="' + h.id + '" class="' + (h.tagName === 'H3' ? 'h3' : '') + '">' +
        esc(h.getAttribute('data-toc') || h.textContent) + '</a>';
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

  // ---------- 两个记录框 ----------
  function bindBox(elId, badgeId, key) {
    var ta = document.getElementById(elId);
    if (!ta) return;
    try { ta.value = localStorage.getItem(key) || ''; } catch (e) {}
    var badge = document.getElementById(badgeId);
    var t;
    ta.addEventListener('input', function () {
      try { localStorage.setItem(key, ta.value); } catch (e) {}
      if (badge) { badge.classList.add('show'); clearTimeout(t); t = setTimeout(function () { badge.classList.remove('show'); }, 1200); }
    });
  }
  function wireNotes(id) {
    bindBox('snt', 'savedS', 'ko-sent-' + id);
    bindBox('nta', 'savedN', 'ko-note-' + id);
  }

  // ---------- 滚动：进度 + scrollspy ----------
  function onScroll() {
    var scrollEl = narrow() ? document.documentElement : mainwrap;
    var max = (scrollEl.scrollHeight - scrollEl.clientHeight) || 1;
    var top = scrollEl.scrollTop || document.documentElement.scrollTop || 0;
    if (prog) prog.style.width = Math.min(100, (top / max) * 100) + '%';
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
    if (!id || !byKey[id]) { cur = null; renderHome(); closeDrawer(); return; }
    cur = id;
    renderArticle(byKey[id]);
    highlightSide();
    if (!narrow()) mainwrap.scrollTop = 0; else window.scrollTo(0, 0);
    closeDrawer();
    onScroll();
  }

  // ---------- 抽屉（手机） ----------
  function openDrawer() { side.classList.add('open'); scrim.classList.add('show'); }
  function closeDrawer() { side.classList.remove('open'); scrim.classList.remove('show'); }

  // ---------- 主题 ----------
  function setTheme(mode) { document.documentElement.setAttribute('data-theme', mode === 'dark' ? 'dark' : 'light'); }
  function toggleTheme() {
    var now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = now === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('ko-theme', next); } catch (e) {}
  }

  // ---------- 跳单元 ----------
  function goUnit() {
    var v = parseInt((jump.value || '').replace(/[^0-9]/g, ''), 10);
    if (!v) return;
    var hit = byKey['u' + v];
    if (hit) location.hash = '#' + hit.key;
  }

  // ---------- 初始化 ----------
  function init() {
    buildSide('');
    var stored = null;
    try { stored = localStorage.getItem('ko-theme'); } catch (e) {}
    if (window.self !== window.top) {
      // 嵌入态：主题完全跟随主站（不再用子站 localStorage / 系统偏好）。
      // index.html 的行内脚本已先尝试从父页读出 dark/light 写进 data-theme，
      // 这里只在「没读到」时兜底 light，避免把刚推测出的暗色覆盖回去（首屏闪白字）。
      if (!document.documentElement.getAttribute('data-theme')) setTheme('light');
      // 嵌入主站：把指针坐标转发给父窗口，主站鱼影才能跟随鼠标游动（背景是有记忆的动画）
      var _koLastSent = 0;
      window.addEventListener('pointermove', function (e) {
        var t = Date.now();
        if (t - _koLastSent < 20) return;
        _koLastSent = t;
        try { window.parent.postMessage({ type: 'aquatic-pointer', x: e.clientX, y: e.clientY }, '*'); } catch (err) {}
      }, { passive: true });
      // 指针离开 iframe 文档：通知主站停止聚拢、恢复漂游
      document.addEventListener('pointerleave', function () {
        try { window.parent.postMessage({ type: 'aquatic-pointer', x: -9999, y: -9999 }, '*'); } catch (err) {}
      });
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
    if (jump) {
      jump.addEventListener('keydown', function (e) { if (e.key === 'Enter') goUnit(); });
      jump.addEventListener('change', goUnit);
    }
    window.addEventListener('hashchange', route);
    mainwrap.addEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);

    route();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
