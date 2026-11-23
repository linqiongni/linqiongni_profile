/* 日常英语 · 阅读器逻辑：左目录 / 搜索 / 双语切换 / 主题同步 / 上下篇 */
(function () {
  var ALL = window.DAILY_LESSONS || [];
  var cur = 0;
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  function groups() {
    var g = [], map = {};
    ALL.forEach(function (l, i) {
      var key = l.tag || '其他';
      if (!map[key]) { map[key] = []; g.push(key); }
      map[key].push(i);
    });
    return g.map(function (k) { return { name: k, items: map[k] }; });
  }

  function renderDir(filter) {
    var q = (filter || '').trim().toLowerCase();
    var dir = $('#dir');
    var html = '';
    groups().forEach(function (grp) {
      var items = grp.items.filter(function (i) {
        if (!q) return true;
        var l = ALL[i];
        var hay = [l.title, l.zh, l.tag, l.section].concat(
          l.blocks.map(function (b) { return b.en + ' ' + b.zh + ' ' + b.words + ' ' + b.note; })
        ).join(' ').toLowerCase();
        return hay.indexOf(q) !== -1;
      });
      if (!items.length) return;
      html += '<div class="dir-group">' + esc(grp.name) + '</div>';
      items.forEach(function (i) {
        var l = ALL[i];
        html += '<button class="dir-item' + (i === cur ? ' on' : '') + '" data-i="' + i + '">' +
          '<span class="en">' + esc(l.title) + '<span class="sep">|</span>' + esc(l.zh) + '</span>' +
          '<span class="zh">' + esc(l.tag) + '</span></button>';
      });
    });
    dir.innerHTML = html || '<div class="dir-group">未找到匹配课文</div>';
    Array.prototype.forEach.call(dir.querySelectorAll('.dir-item'), function (b) {
      b.addEventListener('click', function () { select(+b.getAttribute('data-i')); closeDrawer(); });
    });
  }

  function renderArticle() {
    var l = ALL[cur];
    if (!l) { $('#article').innerHTML = '<p>暂无内容。</p>'; return; }
    var h = '<div class="a-label">' + esc(l.tag) + '</div>' +
      '<h1 class="a-title">' + esc(l.title) + '</h1>' +
      '<p class="a-zh">' + esc(l.zh) + '</p>' +
      '<div class="a-rule"></div>' +
      '<h2 class="section-h">' + esc(l.section) + '</h2>';
    (l.blocks || []).forEach(function (b, i) {
      h += '<section class="block" data-n="' + (i + 1) + '">' +
        '<p class="p-en">' + esc(b.en) + '</p>' +
        '<p class="p-zh">' + esc(b.zh) + '</p>' +
        '<div class="words"><b>重点词句</b>' + esc(b.words) + '</div>' +
        (b.note ? '<p class="note"><b>重难点</b>' + esc(b.note) + '</p>' : '') +
        '</section>';
    });
    if (l.replacements && l.replacements.length) {
      h += '<div class="repl"><h3>常用表达替换</h3>';
      l.replacements.forEach(function (r) {
        h += '<div class="repl-row"><div class="en">' + esc(r.en) + '</div>' +
          '<div class="zh">' + esc(r.zh) + '</div></div>';
      });
      h += '</div>';
    }
    $('#article').innerHTML = h;
    $('#count').textContent = ALL.length;
    $('#prevBtn').disabled = cur <= 0;
    $('#nextBtn').disabled = cur >= ALL.length - 1;
    $('#reader').scrollTop = 0;
  }

  function select(i) {
    if (i < 0 || i >= ALL.length) return;
    cur = i;
    try { location.hash = ALL[cur].id; } catch (e) {}
    renderDir($('#search').value);
    renderArticle();
  }

  // 目录抽屉（手机）
  function openDrawer() { $('#sidebar').classList.add('open'); $('#mask').hidden = false; }
  function closeDrawer() { $('#sidebar').classList.remove('open'); $('#mask').hidden = true; }

  // 主题：跟随主站 postMessage，同时也接受自身 data-theme
  function applyTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#0C1B2B' : '#FBF9F4');
  }
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (d && d.type === 'theme' && (d.mode === 'dark' || d.mode === 'light')) applyTheme(d.mode);
  });

  function init() {
    // 深链：#id → 对应序号
    var id = (location.hash || '').replace(/^#/, '');
    var found = -1;
    ALL.forEach(function (l, i) { if (l.id === id) found = i; });
    if (found >= 0) cur = found;

    $('#count').textContent = ALL.length;
    renderDir('');
    renderArticle();

    $('#search').addEventListener('input', function () { renderDir(this.value); });
    $('#prevBtn').addEventListener('click', function () { select(cur - 1); });
    $('#nextBtn').addEventListener('click', function () { select(cur + 1); });
    $('#dirBtn').addEventListener('click', openDrawer);
    $('#mask').addEventListener('click', closeDrawer);

    Array.prototype.forEach.call(document.querySelectorAll('.mode button'), function (b) {
      b.addEventListener('click', function () {
        document.body.setAttribute('data-mode', b.getAttribute('data-mode'));
        Array.prototype.forEach.call(document.querySelectorAll('.mode button'), function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      });
    });
    document.body.setAttribute('data-mode', 'both');
    applyTheme(document.documentElement.getAttribute('data-theme-default') || 'dark');

    window.addEventListener('hashchange', function () {
      var hid = (location.hash || '').replace(/^#/, '');
      ALL.forEach(function (l, i) { if (l.id === hid && i !== cur) { cur = i; renderDir($('#search').value); renderArticle(); } });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
