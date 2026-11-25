(function () {
  "use strict";
  var items = (window.SCRAPS || []).slice();
  var state = {
    q: "",
    tag: "",
    id: null,
    mode: "both",
    theme: null
  };

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }

  var $ = function (id) { return document.getElementById(id); };
  var search = $("search"), dir = $("dir"), tagsEl = $("tags"), countEl = $("count");
  var article = $("article"), empty = $("empty");
  var sidebar = $("sidebar"), mask = $("mask");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function hi(s) {
    var out = esc(s);
    var q = state.q.trim();
    if (!q) return out;
    var parts = q.split(/\s+/).filter(Boolean).map(function (p) {
      return p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    });
    if (!parts.length) return out;
    return out.replace(new RegExp("(" + parts.join("|") + ")", "gi"), "<mark>$1</mark>");
  }

  function textOf(it) {
    return [it.title, it.titleZh, (it.tags || []).join(" "),
      (it.en || []).join(" "), (it.zh || []).join(" "),
      (it.notes || []).map(function (n) { return n.en + " " + n.zh + " " + (n.note || ""); }).join(" ")
    ].join(" ").toLowerCase();
  }
  function matched(it) {
    var q = state.q.trim().toLowerCase();
    if (state.tag && (it.tags || []).indexOf(state.tag) < 0) return false;
    if (!q) return true;
    return q.split(/\s+/).filter(Boolean).every(function (w) { return textOf(it).indexOf(w) >= 0; });
  }

  function allTags() {
    var seen = {};
    items.forEach(function (it) { (it.tags || []).forEach(function (t) { seen[t] = 1; }); });
    return Object.keys(seen);
  }

  function renderTags() {
    var ts = allTags();
    if (!ts.length) { tagsEl.innerHTML = ""; return; }
    var html = '<button class="tag' + (state.tag ? "" : " on") + '" data-tag="">全部</button>';
    ts.forEach(function (t) {
      html += '<button class="tag' + (state.tag === t ? " on" : "") + '" data-tag="' + esc(t) + '">' + esc(t) + "</button>";
    });
    tagsEl.innerHTML = html;
    Array.prototype.forEach.call(tagsEl.querySelectorAll(".tag"), function (b) {
      b.addEventListener("click", function () { state.tag = b.getAttribute("data-tag"); render(); });
    });
  }

  function renderList() {
    var list = items.filter(matched);
    countEl.textContent = list.length;
    if (!list.length) {
      dir.innerHTML = '<div class="no-hit">没有找到。换个词试试——搜英文、中文或单词片段都行。</div>';
      return;
    }
    var html = "";
    list.forEach(function (it) {
      html += '<button class="dir-item' + (state.id === it.id ? " on" : "") + '" data-id="' + esc(it.id) + '">' +
        '<span class="dt">' + esc(it.date || "") + "</span>" +
        '<span class="en">' + hi(it.title) + "</span>" +
        '<span class="zh">' + hi(it.titleZh) + "</span>" +
        "</button>";
    });
    dir.innerHTML = html;
    Array.prototype.forEach.call(dir.querySelectorAll(".dir-item"), function (b) {
      b.addEventListener("click", function () {
        state.id = b.getAttribute("data-id");
        store("scraps:last", state.id);
        render();
        closeDrawer();
        $("reader").scrollTop = 0;
      });
    });
  }

  function renderDetail() {
    var it = null;
    items.forEach(function (x) { if (x.id === state.id) it = x; });
    if (!it) {
      article.hidden = true; empty.hidden = false;
      if (items.length) empty.textContent = "从左侧选一条开始读。";
      return;
    }
    article.hidden = false; empty.hidden = true;
    $("aLabel").textContent = it.date || "";
    $("aTitle").innerHTML = hi(it.title);
    $("aTitleZh").innerHTML = hi(it.titleZh);
    var meta = (it.tags || []).map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("");
    $("aMeta").innerHTML = meta;

    var en = it.en || [], zh = it.zh || [], n = Math.max(en.length, zh.length);
    var pairs = "";
    for (var i = 0; i < n; i++) {
      var block = "";
      if (en[i]) block += '<p class="p-en">' + hi(en[i]) + "</p>";
      if (zh[i]) block += '<p class="p-zh">' + hi(zh[i]) + "</p>";
      if (block) pairs += '<div class="pair">' + block + "</div>";
    }
    $("pairs").innerHTML = pairs;

    var notes = it.notes || [];
    if (notes.length) {
      $("notesWrap").hidden = false;
      $("notes").innerHTML = notes.map(function (nt) {
        return '<div class="note-card"><span class="n-en">' + hi(nt.en) + "</span>" +
          '<span class="n-zh">' + hi(nt.zh) + "</span>" +
          (nt.note ? '<span class="n-note">' + esc(nt.note) + "</span>" : "") + "</div>";
      }).join("");
    } else {
      $("notesWrap").hidden = true;
    }
  }

  function render() { renderTags(); renderList(); renderDetail(); }

  function applyMode(m) {
    state.mode = m;
    document.body.setAttribute("data-bi", m);
    Array.prototype.forEach.call(document.querySelectorAll(".mode button"), function (b) {
      b.classList.toggle("on", b.getAttribute("data-mode") === m);
    });
    store("scraps:mode", m);
  }
  function applyTheme(t, silent) {
    state.theme = t;
    document.documentElement.setAttribute("data-theme", t);
    store("scraps:theme", t);
    // 同步给主题桥（独立态下本页有 #themeBtn，桥不会另加按钮，但要让 state 一致）
    if (!silent) { try { window.dispatchEvent(new CustomEvent("site-theme", { detail: t })); } catch (e) {} }
  }
  // 主站切主题 → 主题桥改 data-theme 并派发 site-theme → 同步本页内部状态
  window.addEventListener("site-theme", function (e) {
    var m = e && e.detail;
    if (m === "dark" || m === "light") { state.theme = m; store("scraps:theme", m); }
  });
  function openDrawer() { sidebar.classList.add("open"); mask.hidden = false; }
  function closeDrawer() { sidebar.classList.remove("open"); mask.hidden = true; }

  search.addEventListener("input", function () { state.q = search.value; renderList(); renderDetail(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== search) { e.preventDefault(); search.focus(); }
    if (e.key === "Escape" && document.activeElement === search) { search.value = ""; state.q = ""; render(); search.blur(); }
  });
  Array.prototype.forEach.call(document.querySelectorAll(".mode button"), function (b) {
    b.addEventListener("click", function () { applyMode(b.getAttribute("data-mode")); });
  });
  $("themeBtn").addEventListener("click", function () { applyTheme(state.theme === "dark" ? "light" : "dark"); });
  $("dirBtn").addEventListener("click", openDrawer);
  mask.addEventListener("click", closeDrawer);

  var savedTheme = store("scraps:theme");
  if (!savedTheme) savedTheme = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  applyTheme(savedTheme);
  applyMode(store("scraps:mode") || "both");
  render();
  // 每次打开默认显示最新一条，让新收录的内容立刻可见（收纳页按「最近学的」用）
  if (items.length) { state.id = items[0].id; renderList(); renderDetail(); }
})();
