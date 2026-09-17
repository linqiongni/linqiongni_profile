/* =========================================================================
 * The Good Wife — Legal English Study · app logic (vanilla JS, hash router)
 * Depends on: data.js (window.TERMS,
 *             window.EPISODES, window.SITE_NOTE)
 * ========================================================================= */
(function(){
  "use strict";
  var EPISODES = window.EPISODES || [];
  var TERMS = window.TERMS || {};
  var SITE_NOTE = window.SITE_NOTE || "";

  var byId = {};
  var episodesByTerm = {};
  EPISODES.forEach(function(e){ byId[e.id] = e; (e.terms||[]).forEach(function(k){ (episodesByTerm[k]=episodesByTerm[k]||[]).push(e.id); }); });

  var CATS = [];
  Object.keys(TERMS).forEach(function(k){ var c=TERMS[k].cat; if(CATS.indexOf(c)<0) CATS.push(c); });

  /* ---------- helpers ---------- */
  function escapeHtml(s){ return String(s).replace(/[&<>]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]; }); }
  function escapeRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function makeHighlighter(keys){
    var map = {}, phrases = [];
    (keys||[]).forEach(function(k){
      var t = TERMS[k]; if(!t) return;
      (t.m || [t.term]).forEach(function(p){ map[p.toLowerCase()] = k; phrases.push(p); });
    });
    if(!phrases.length) return null;
    phrases.sort(function(a,b){ return b.length - a.length; });
    var re = new RegExp('\\b(' + phrases.map(escapeRe).join('|') + ')\\b', 'gi');
    return function(text){
      return escapeHtml(text).replace(re, function(m){
        var k = map[m.toLowerCase()];
        return '<a class="term" data-key="'+k+'" href="#term-'+k+'">'+m+'</a>';
      });
    };
  }

  function termCard(k){
    var t = TERMS[k]; if(!t) return '';
    var used = episodesByTerm[k] || [];
    var usedHtml = used.length ? ('<div class="tc-used">出现于 / appears in: ' +
        used.map(function(id){ return '<a href="#/ep/'+id+'">S'+byId[id].ep+'</a>'; }).join(' · ') + '</div>') : '';
    return '<div class="term-card" id="term-'+k+'">' +
      '<div class="tc-top"><span class="tc-term">'+escapeHtml(t.term)+'</span>' +
      (t.ipa ? '<span class="tc-ipa">'+escapeHtml(t.ipa)+'</span>' : '') +
      '<span class="tc-cat">'+escapeHtml(t.cat)+'</span></div>' +
      '<div class="tc-en">'+escapeHtml(t.en)+'</div>' +
      '<div class="tc-zh">'+escapeHtml(t.zh)+'</div>' +
      '<div class="tc-ex">&ldquo;'+escapeHtml(t.ex)+'&rdquo;</div>' +
      usedHtml + '</div>';
  }

  /* ---------- views ---------- */
  function renderHome(){
    var cards = EPISODES.map(function(e){
      var tags = (e.themes||[]).map(function(t){ return '<span class="tag">'+escapeHtml(t.zh)+'</span>'; }).join('');
      return '<a class="ep-card" href="#/ep/'+e.id+'">' +
        '<div class="ep-no">SEASON 2 · EPISODE '+e.ep+'</div>' +
        '<div class="ep-title">'+escapeHtml(e.title)+'</div>' +
        '<div class="ep-zh">'+escapeHtml(e.zhTitle)+'</div>' +
        '<div class="ep-sum">'+escapeHtml(e.summary.en)+'</div>' +
        '<div class="ep-tags">'+tags+'</div>' +
        '<div class="ep-meta">'+(e.terms?e.terms.length:0)+' legal terms · '+(e.scenes?e.scenes.length:0)+' scene lines · 点击查看本集要点</div>' +
      '</a>';
    }).join('');
    document.getElementById('app').innerHTML =
      '<div class="hero"><h1>The Good Wife · Legal English Study</h1>' +
      '<p><span class="pill">Season 2</span>用《傲骨贤妻》第二季（1–23 集）系统学习英美法律英语。每集含：真实场景台词短句引用（法律术语高亮可点击）、术语卡（英文释义 + 中文对应）、中文概览、英美制度对照。</p>' +
      '<p>点击任意高亮术语 <span class="term" style="pointer-events:none">term</span> 即可跳转到对应术语卡。共 '+EPISODES.length+' 集 · '+Object.keys(TERMS).length+' 个术语。</p></div>' +
      '<div class="map-grid">'+cards+'</div>';
  }

  function renderEpisode(id, focus){
    var e = byId[id];
    if(!e){ renderHome(); return; }
    var hi = makeHighlighter(e.terms);
    var scenes = (e.scenes||[]).map(function(s){
      return '<div class="scene-line"><div class="sp">'+escapeHtml(s.sp)+'</div>' +
        '<div class="tx'+(hi?' lead':'')+'">'+(hi?hi(s.t):escapeHtml(s.t))+'</div></div>';
    }).join('');
    var cards = (e.terms||[]).map(termCard).join('');
    var uk = e.uk ? ('<div class="uk-note"><div class="uk-h">⚖ UK / 英国对照</div>' +
        '<div class="uk-en">'+escapeHtml(e.uk.en)+'</div>' +
        '<div class="uk-zh">'+escapeHtml(e.uk.zh)+'</div></div>') : '';

    document.getElementById('app').innerHTML =
      '<div class="crumbs"><a href="#/">课程地图</a> › S2E'+e.ep+' · '+escapeHtml(e.title)+'</div>' +
      '<div class="ep-head"><h1>'+escapeHtml(e.title)+'</h1><div class="ep-zh">S1E'+e.ep+' · '+escapeHtml(e.zhTitle)+'</div>' +
        '<div class="summary"><div class="en">'+escapeHtml(e.summary.en)+'</div><div class="zh">'+escapeHtml(e.summary.zh)+'</div></div>' +
        '<div class="themes">'+ (e.themes||[]).map(function(t){ return '<span class="tag">'+escapeHtml(t.en)+' / '+escapeHtml(t.zh)+'</span>'; }).join('') +'</div>' +
      '</div>' +

      '<div class="section"><h2><span class="en">Scene dialogue</span> · 场景台词</h2>' +
        '<p class="sec-sub">精选自本集真实台词，高亮术语可点击跳转。Source: The Good Wife S2E'+e.ep+'.</p>' +
        scenes +
        (e.sceneNote ? '<div class="scene-note"><div class="sn-h">中文概览 · What these lines show</div>' +
          '<div class="sn-zh">'+escapeHtml(e.sceneNote.zh)+'</div>' +
          '<div class="sn-en">'+escapeHtml(e.sceneNote.en)+'</div></div>' : '') +
      '</div>' +

      '<div class="section"><h2><span class="en">Legal terms</span> · 术语卡</h2>' +
        '<p class="sec-sub">英文释义 + 中文对应；点击场景台词中的高亮词可回到此处。</p>' +
        '<div class="term-grid">'+cards+'</div></div>' +

      '<div class="section"><h2><span class="en">Anglo-American contrast</span> · 英美制度对照</h2>' +
        uk + '</div>';


    if(focus && document.getElementById('term-'+focus)){
      var el = document.getElementById('term-'+focus);
      setTimeout(function(){ el.scrollIntoView({behavior:'smooth',block:'center'}); el.classList.add('flash'); setTimeout(function(){ el.classList.remove('flash'); }, 1200); }, 60);
    } else {
      window.scrollTo(0,0);
    }
  }

  function renderGlossary(){
    var chips = '<span class="chip active" data-cat="__all">全部</span>' +
      CATS.map(function(c){ return '<span class="chip" data-cat="'+escapeHtml(c)+'">'+escapeHtml(c)+'</span>'; }).join('');
    document.getElementById('app').innerHTML =
      '<div class="hero"><h1>Legal Glossary · 术语表</h1>' +
      '<p>全部 '+Object.keys(TERMS).length+' 个法律英语术语，按类别筛选 / 搜索。点击卡片底部的「剧集」链接可跳回出现该术语的剧情。</p></div>' +
      '<div class="gloss-controls"><input id="glossSearch" placeholder="搜索术语 / search term, EN or 中文…" />' +
      '<div class="chips" id="glossChips">'+chips+'</div></div>' +
      '<div id="glossList"></div>';

    var activeCat = '__all', query = '';
    function draw(){
      var keys = Object.keys(TERMS).filter(function(k){
        var t = TERMS[k];
        if(activeCat !== '__all' && t.cat !== activeCat) return false;
        if(query){
          var q = query.toLowerCase();
          if((t.term+' '+t.en+' '+t.zh+' '+t.cat).toLowerCase().indexOf(q) < 0) return false;
        }
        return true;
      });
      var groups = {};
      keys.forEach(function(k){ (groups[TERMS[k].cat]=groups[TERMS[k].cat]||[]).push(k); });
      var html = '';
      Object.keys(groups).sort().forEach(function(cat){
        html += '<div class="gloss-group"><h3>'+escapeHtml(cat)+'</h3><div class="term-grid">' +
          groups[cat].map(termCard).join('') + '</div></div>';
      });
      document.getElementById('glossList').innerHTML = html || '<p class="sec-sub">无匹配术语。</p>';
    }
    draw();

    document.getElementById('glossSearch').addEventListener('input', function(e){ query = e.target.value.trim(); draw(); });
    document.getElementById('glossChips').addEventListener('click', function(e){
      var chip = e.target.closest('.chip'); if(!chip) return;
      activeCat = chip.dataset.cat;
      Array.prototype.forEach.call(this.children, function(c){ c.classList.toggle('active', c===chip); });
      draw();
    });
    window.scrollTo(0,0);
  }

  function renderAbout(){
    document.getElementById('app').innerHTML =
      '<div class="hero"><h1>方法 & 版权 · Method & Copyright</h1>' +
      '<p>这个站点怎么用、内容从哪来、以及版权边界。</p></div>' +
      '<div class="about section">' +
      '<h2><span class="en">How to study</span> · 学习方法</h2>' +
      '<ul>' +
      '<li>每集先看 <b>Scene dialogue</b>：台词里<b>高亮的词就是法律英语术语</b>，点一下直接跳到术语卡。</li>' +
      '<li><b>Legal terms</b> 每张卡都有英文释义 + 中文对应 + 例句 + 类别，建议先读英文、再对照中文。</li>' +
      '<li><b>Anglo-American contrast</b>：以剧中美国法（伊利诺伊／库克县）为锚，补一段英国法对照，建立「英美体系」双视角。</li>' +
      '<li><b>关于字幕</b>：本站<b>不提供整集字幕／剧本原文</b>，仅引用少量短句台词用于讲解与评论；如需通读，请配合正版片源（流媒体／DVD）观看。</li>' +
      '</ul>' +
      '<h2><span class="en">Content sources</span> · 内容来源</h2>' +
      '<p>'+escapeHtml(SITE_NOTE)+' 术语释义为原创学习笔记，参考 DOJ / U.S. Courts / 教科书通说。</p>' +
      '<h2><span class="en">Copyright</span> · 版权边界</h2>' +
      '<div class="warn">⚠ 本站点为<b>个人学习用途</b>。剧中剧本与字幕受版权保护，本站<b>不提供整集字幕或剧本原文</b>；仅<b>引用极少量短句台词</b>用于语言教学与法律评论，并逐处标注出处（The Good Wife S2E__）。术语释义、中文概览、英美制度对照均为<b>原创学习笔记</b>。如权利人认为引用不当，请联系删除。</div>' +
      '<h2><span class="en">Extend it</span> · 如何扩展</h2>' +
      '<p>所有内容都在 <span class="kbd">data.js</span>（不再包含整集字幕）。往 <span class="kbd">EPISODES</span> 数组追加一个剧集对象即可新增一集；新术语加到 <span class="kbd">TERMS</span> 并写入该剧集的 <span class="kbd">terms</span> 列表。无需构建步骤，刷新即生效。</p>' +
      '</div>';
    window.scrollTo(0,0);
  }

  /* ---------- router ---------- */
  function parseHash(){
    var h = location.hash.replace(/^#/, '') || '/';
    var parts = h.split('?');
    var path = parts[0] || '/';
    var q = {};
    if(parts[1]) parts[1].split('&').forEach(function(kv){ var a = kv.split('='); q[a[0]] = decodeURIComponent(a[1]||''); });
    return { path: path, q: q };
  }
  function setActiveNav(route){
    Array.prototype.forEach.call(document.querySelectorAll('.nav a'), function(a){
      var nav = a.getAttribute('data-nav');
      a.classList.toggle('active', nav === route);
    });
  }
  function route(){
    var p = parseHash();
    if(p.path === '/' || p.path === ''){ renderHome(); setActiveNav('home'); }
    else if(p.path === '/glossary'){ renderGlossary(); setActiveNav('glossary'); }
    else if(p.path === '/about'){ renderAbout(); setActiveNav('about'); }
    else if(p.path.indexOf('/ep/') === 0){ renderEpisode(p.path.slice(4), p.q.focus); setActiveNav('home'); }
    else { renderHome(); setActiveNav('home'); }
  }

  /* term click -> jump + flash (delegated) */
  document.addEventListener('click', function(ev){
    var a = ev.target.closest('a.term'); if(!a) return;
    ev.preventDefault();
    var key = a.getAttribute('data-key');
    var el = document.getElementById('term-'+key);
    if(el){
      el.scrollIntoView({behavior:'smooth', block:'center'});
      el.classList.add('flash');
      setTimeout(function(){ el.classList.remove('flash'); }, 1200);
    } else {
      var first = (episodesByTerm[key] || [])[0];
      if(first) location.hash = '#/ep/'+first+'?focus='+key;
    }
  });

  window.addEventListener('hashchange', route);
  route();
})();
