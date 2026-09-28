/* 个人主页背景效果 · vanilla 移植版（鱼影 + 涟漪 + 水纹 + 金粒子丝带）
   来源：src/components/AquaticLuxuryBackground.tsx + GoldParticleRibbon.tsx
   原则：所有行为参数与主站逐字节一致（速度 / 聚拢 / 互斥 / 阻尼 / 摆尾 / 涟漪节奏）。
   主题判定：子站用 html[data-theme="dark"]；切换时整体重建（与主站 useEffect 重挂等价）。 */
(function () {
  if (window.__profileBgKit) return;
  window.__profileBgKit = 1;

  window.__profileBgErr = [];
  window.addEventListener('error', function (e) {
    window.__profileBgErr.push(String(e.message) + ' @' + String(e.filename).split('/').pop() + ':' + e.lineno);
  });
  window.addEventListener('unhandledrejection', function (e) {
    window.__profileBgErr.push('rejection: ' + String(e.reason));
  });

  /* ============ 嵌入模式：主站 iframe 内不画背景，透出主站固定背景板 ============
     独立打开（新窗口 / 手机全屏）时照常自绘鱼影；嵌入时只把指针转发给主站，
     让主站的涟漪与鱼群聚拢跨 iframe 连续。 */
  var EMBEDDED = false;
  try { EMBEDDED = !!(window.parent && window.parent !== window); } catch (e) { EMBEDDED = false; }

  if (EMBEDDED) {
    var lastFwd = 0;
    document.addEventListener('pointermove', function (e) {
      var now = Date.now();
      if (now - lastFwd < 16) return;
      lastFwd = now;
      try {
        window.parent.postMessage({ type: 'aquatic-pointer', x: e.clientX, y: e.clientY }, '*');
      } catch (_) { /* 忽略 */ }
    }, { passive: true });
    return;
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.matchMedia('(max-width: 768px)').matches;

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  /* ============ 自带样式（2026-09-28 起不再依赖页面里的 v4-profile 块 / econ-crime aquatic.css） ============
     效果层样式原样搬自主站 src/components/aquatic-luxury-background.css（.dark 前缀换为 html[data-theme="dark"]）；
     深色底追加主站同款「深海黑洞」渐变（index.css body::before）与 #04070B 底色，独立打开时与个人页逐像素同源。 */
  function injectStyles() {
    if (document.getElementById('profile-bg-styles')) return;
    var st = document.createElement('style');
    st.id = 'profile-bg-styles';
    st.textContent = [
      '.aq-bg{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}',
      '.aq-bg canvas{position:absolute;inset:0;width:100%;height:100%}',
      'body>.aq-bg~*{position:relative;z-index:1}',
      '#gold-ribbon-wrap{position:absolute;top:0;left:0;width:100%;height:100vh;z-index:0;pointer-events:none;overflow:hidden}',
      '#gold-ribbon-wrap .gold-particle-ribbon{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;opacity:.66;mix-blend-mode:screen;-webkit-mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.45) 14%,#000 44%,#000 97%,transparent 100%);mask-image:linear-gradient(to right,transparent 0%,rgba(0,0,0,.45) 14%,#000 44%,#000 97%,transparent 100%)}',
      '@media (max-width:768px){#gold-ribbon-wrap .gold-particle-ribbon{opacity:.44}}',
      '.aquatic-luxury-vignette,.aquatic-luxury-grain,.aquatic-luxury-water,.aquatic-luxury-scene{position:absolute;inset:0;width:100%;height:100%}',
      '.aquatic-luxury-vignette{background:radial-gradient(ellipse at 66% 38%,rgba(255,255,255,.045),transparent 62%)}',
      'html[data-theme="dark"] .aquatic-luxury-vignette{background:radial-gradient(ellipse at 66% 38%,rgba(198,210,228,.05),transparent 62%)}',
      '.aquatic-luxury-grain{opacity:.018;background-image:url("data:image/svg+xml,%3Csvg viewBox=\'0 0 180 180\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.8\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.4\'/%3E%3C/svg%3E")}',
      'html[data-theme="dark"] .aquatic-luxury-grain{opacity:.035}',
      '.aquatic-luxury-water{inset:28% -18% -38%;width:auto;height:auto;opacity:.18;background:repeating-radial-gradient(ellipse at 72% 60%,rgba(150,120,60,.06) 0 1px,rgba(120,140,160,.045) 2px 3px,transparent 5px 21px);transform:perspective(900px) rotateX(61deg) scale(1.42);transform-origin:center bottom;-webkit-mask-image:linear-gradient(to bottom,transparent,#000 30%);mask-image:linear-gradient(to bottom,transparent,#000 30%);animation:aquatic-water-breathe 10s ease-in-out infinite alternate}',
      'html[data-theme="dark"] .aquatic-luxury-water{opacity:.3;background:repeating-radial-gradient(ellipse at 72% 60%,rgba(211,180,117,.075) 0 1px,rgba(150,175,200,.055) 2px 3px,transparent 5px 21px)}',
      '@keyframes aquatic-water-breathe{to{transform:perspective(900px) rotateX(61deg) scale(1.49)}}',
      '@media (max-width:768px){.aquatic-luxury-water{opacity:.12;transform:perspective(800px) rotateX(64deg) scale(1.75)}html[data-theme="dark"] .aquatic-luxury-water{opacity:.22}}',
      '@media (prefers-reduced-motion:reduce){.aquatic-luxury-water{animation:none}}',
      /* 深海黑洞：底色与主站 --bg-main 一致，渐变与主站 body::before 逐字节一致 */
      'html[data-theme="dark"] body{background-color:#04070B!important}',
      'html[data-theme="dark"] .aq-bg{background:radial-gradient(120% 68% at 50% -12%,rgba(38,80,140,.42),transparent 62%),radial-gradient(88% 62% at 50% 44%,rgba(22,54,96,.34),transparent 72%),linear-gradient(to bottom,transparent 50%,rgba(2,5,10,.6) 100%),radial-gradient(145% 125% at 50% 45%,transparent 40%,rgba(0,1,3,.72) 100%)}',
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
  }

  injectStyles();

  /* ============ DOM 注入 ============ */
  var ribbonWrap = document.createElement('div');
  ribbonWrap.id = 'gold-ribbon-wrap';
  ribbonWrap.setAttribute('aria-hidden', 'true');
  var ribbonCanvas = document.createElement('canvas');
  ribbonCanvas.className = 'gold-particle-ribbon';
  ribbonWrap.appendChild(ribbonCanvas);

  var bg = document.createElement('div');
  bg.className = 'aq-bg aquatic-luxury-background';
  bg.id = 'aq-bg';
  bg.setAttribute('aria-hidden', 'true');
  bg.innerHTML =
    '<div class="aquatic-luxury-vignette"></div>' +
    '<div class="aquatic-luxury-grain"></div>' +
    '<div class="aquatic-luxury-water"></div>' +
    '<canvas class="aquatic-luxury-scene"></canvas>';

  document.body.insertBefore(ribbonWrap, document.body.firstChild);
  document.body.insertBefore(bg, document.body.firstChild);

  /* ============ 鱼影 + 涟漪（与主站一致） ============ */
  var PHASES = 8;
  var MAX_RIPPLES = 12;
  var STEP = 1000 / 30;

  var IDLE_MS = 650;
  var ACCEL = 0.06;
  var VMAX = 0.0018;
  var SEP_R = 0.17;
  var SEP_FORCE = 0.0016;
  var DAMP = 0.95;
  var DISPERSE_DRIFT = 0.18;

  /* 浅色模式鱼影（与个人页 TONES 逐字节一致） */
  var TONES = [
    ['rgba(46,62,80,.16)', 'rgba(88,98,110,.52)', 'rgba(158,124,62,.46)', 'rgba(58,74,92,.12)'],
    ['rgba(40,58,76,.15)', 'rgba(78,96,112,.50)', 'rgba(132,114,70,.42)', 'rgba(52,70,88,.10)'],
    ['rgba(50,66,84,.14)', 'rgba(96,110,124,.48)', 'rgba(164,132,70,.40)', 'rgba(60,78,96,.10)'],
  ];
  /* 暗色模式专属鱼影（2026-09-27 与个人页 DARK_TONES 逐字节一致）：
     深海底色 #04070B 之后，原深色剪影完全隐身，改为「月光下的鱼」——浅蓝灰身体 + 更实的金脊。 */
  var DARK_TONES = [
    ['rgba(120,152,188,.26)', 'rgba(152,178,206,.58)', 'rgba(218,186,124,.62)', 'rgba(104,136,172,.20)'],
    ['rgba(110,144,182,.24)', 'rgba(142,168,198,.55)', 'rgba(196,164,112,.56)', 'rgba(96,128,164,.18)'],
    ['rgba(128,158,192,.24)', 'rgba(160,184,210,.52)', 'rgba(228,196,132,.54)', 'rgba(112,144,178,.18)'],
  ];
  var EYE = 'rgba(226,201,148,.9)';

  function paintFish(ctx, size, tone, bend, tailRot) {
    var grad = ctx.createLinearGradient(-size, 0, size, 0);
    grad.addColorStop(0, tone[0]);
    grad.addColorStop(0.42, tone[1]);
    grad.addColorStop(0.72, tone[2]);
    grad.addColorStop(1, tone[3]);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-size * 0.72, bend * 0.18);
    ctx.bezierCurveTo(-size * 0.42, -size * 0.34, size * 0.34, -size * 0.3, size * 0.8, -size * 0.05);
    ctx.quadraticCurveTo(size * 0.95, 0, size * 0.8, size * 0.07);
    ctx.bezierCurveTo(size * 0.34, size * 0.3, -size * 0.42, size * 0.34, -size * 0.72, bend * 0.18);
    ctx.closePath();
    ctx.fill();
    ctx.save();
    ctx.translate(-size * 0.68, bend * 0.18);
    ctx.rotate(tailRot);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-size * 0.3, -size * 0.08, -size * 0.62, -size * 0.42, -size * 0.78, -size * 0.32);
    ctx.quadraticCurveTo(-size * 0.55, 0, -size * 0.78, size * 0.32);
    ctx.bezierCurveTo(-size * 0.62, size * 0.42, -size * 0.3, size * 0.08, 0, 0);
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(-size * 0.1, -size * 0.25);
    ctx.quadraticCurveTo(size * 0.05, -size * 0.52, size * 0.28, -size * 0.22);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size * 0.12, size * 0.2);
    ctx.quadraticCurveTo(size * 0.28, size * 0.43, size * 0.4, size * 0.14);
    ctx.closePath();
    ctx.fill();
  }

  function angDiff(a, b) {
    var d = a - b;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  }

  var fishState = null; // { canvas, ctx, width, height, dprUsed, raf, last, elapsed, lastPointerAt, lastAmbientAt, lastMoveAt, resizeTimer, sprites, mouse, ripples, fish }

  function initFish() {
    var canvas = bg.querySelector('.aquatic-luxury-scene');
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var dark = isDark();
    var gain = dark ? 1 : 0.8;
    // 主题随 data-theme 动态判定；暗底用月光鱼（DARK_TONES），浅底用墨金剪影（TONES）
    var tones = dark ? DARK_TONES : TONES;
    // 与个人页 AquaticLuxuryBackground fishCount={9} 一致：桌面 9 条，移动端封顶 3 条
    var fishCount = 9;
    var total = mobile ? Math.min(3, fishCount) : fishCount;

    var st = {
      canvas: canvas,
      ctx: ctx,
      width: 0,
      height: 0,
      dprUsed: 1,
      raf: 0,
      last: 0,
      elapsed: 0,
      lastPointerAt: 0,
      lastAmbientAt: 0,
      lastMoveAt: 0,
      resizeTimer: 0,
      sprites: [],
      mouse: { x: -9999, y: -9999 },
      ripples: [],
      fish: [],
      gain: gain,
    };

    for (var index = 0; index < total; index += 1) {
      st.fish.push({
        x: index % 2 === 0 ? -0.12 + index * 0.17 : 1.12 - index * 0.13,
        y: 0.51 + (index % 4) * 0.09,
        size: mobile ? 20 + (index % 3) * 7 : 23 + (index % 4) * 10,
        speed: 0.000006 + (index % 4) * 0.0000015,
        alpha: (0.24 + (index % 3) * 0.06) * gain,
        direction: index % 2 === 0 ? 1 : -1,
        phase: index * 1.37,
        depth: 0.48 + (index % 4) * 0.12,
        tone: index % TONES.length,
        vx: 0,
        vy: 0,
        face: index % 2 === 0 ? 0 : Math.PI,
      });
    }

    function buildSprites(size, depth, tone, dpr) {
      var blur = (1 - depth) * 2.1;
      var padW = size * 2.2 + blur * 8;
      var padH = size * 1.3 + blur * 8;
      var out = [];
      for (var i = 0; i < PHASES; i += 1) {
        var swim = Math.sin((i / PHASES) * Math.PI * 2);
        var c = document.createElement('canvas');
        c.width = Math.max(1, Math.ceil(padW * dpr));
        c.height = Math.max(1, Math.ceil(padH * dpr));
        var g = c.getContext('2d');
        if (!g) break;
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.translate(padW / 2, padH / 2);
        g.scale(1, 0.72);
        if (blur > 0.05) g.filter = 'blur(' + blur + 'px)';
        paintFish(g, size, tone, swim * size * 0.1, swim * 0.24);
        g.filter = 'none';
        g.fillStyle = EYE;
        g.globalAlpha = 0.5;
        g.beginPath();
        g.arc(size * 0.68, -size * 0.055, Math.max(1.15, size * 0.032), 0, Math.PI * 2);
        g.fill();
        out.push({ img: c, w: padW, h: padH });
      }
      return out;
    }

    function resize() {
      st.width = window.innerWidth;
      st.height = window.innerHeight;
      st.dprUsed = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(st.width * st.dprUsed));
      canvas.height = Math.max(1, Math.floor(st.height * st.dprUsed));
      canvas.style.width = st.width + 'px';
      canvas.style.height = st.height + 'px';
      ctx.setTransform(st.dprUsed, 0, 0, st.dprUsed, 0, 0);
      st.sprites = st.fish.map(function (f) {
        return buildSprites(f.size, f.depth, tones[f.tone], Math.min(st.dprUsed, 1.5));
      });
    }

    function addRipple(x, y, s) {
      if (st.ripples.length >= MAX_RIPPLES) st.ripples.shift();
      st.ripples.push({ x: x, y: y, r: 5, life: 1, s: s || 0.52 });
    }

    function drawRipple(ripple) {
      var base = ripple.life * ripple.s;
      if (base <= 0.004) return;
      var R = ripple.r + 26;
      ctx.save();
      ctx.translate(ripple.x, ripple.y);
      ctx.scale(1, 0.36);
      var grad = ctx.createLinearGradient(-R, 0, R, 0);
      grad.addColorStop(0, 'rgba(150,170,196,0)');
      grad.addColorStop(0.3, 'rgba(150,170,196,.55)');
      grad.addColorStop(0.58, 'rgba(214,182,122,1)');
      grad.addColorStop(1, 'rgba(150,170,196,0)');
      ctx.strokeStyle = grad;
      for (var i = 0; i < 3; i += 1) {
        ctx.globalAlpha = base * (1 - i / 3.4) * (isDark() ? 0.5 : 0.4);
        ctx.beginPath();
        ctx.ellipse(0, 0, ripple.r + i * 12, ripple.r + i * 12, 0, 0, Math.PI * 2);
        ctx.lineWidth = i === 0 ? 1.2 : 0.7;
        ctx.stroke();
      }
      ctx.restore();
    }

    function render(time) {
      if (!st.width || !st.height) return;
      ctx.clearRect(0, 0, st.width, st.height);
      for (var i = 0; i < st.ripples.length; i += 1) drawRipple(st.ripples[i]);
      var order = st.fish.slice().sort(function (a, b) { return a.depth - b.depth; });
      for (var k = 0; k < order.length; k += 1) {
        var f = order[k];
        var frames = st.sprites[st.fish.indexOf(f)];
        if (!frames || !frames.length) continue;
        var x = f.x * st.width;
        var y = f.y * st.height + Math.sin(time * 0.00032 + f.phase) * 14 * f.depth;
        var idx = Math.floor(((time * 0.0021 + f.phase) / (Math.PI * 2)) * PHASES) % PHASES;
        var sp = frames[(idx + PHASES) % PHASES];
        if (!sp) continue;
        ctx.save();
        ctx.globalAlpha = f.alpha;
        ctx.translate(x, y);
        ctx.rotate(f.face + Math.sin(time * 0.00055 + f.phase) * 0.05);
        ctx.drawImage(sp.img, -sp.w / 2, -sp.h / 2, sp.w, sp.h);
        ctx.restore();
      }
    }

    function step() {
      if (!reduce) {
        var mouseActive = st.mouse.x > -9000;
        var gathering = mouseActive && performance.now() - st.lastMoveAt < IDLE_MS;
        for (var i = 0; i < st.fish.length; i += 1) {
          var f = st.fish[i];
          if (gathering) {
            var mx = st.mouse.x / st.width;
            var my = st.mouse.y / st.height;
            var tx = mx - f.x;
            var ty = my - f.y;
            var dist = Math.hypot(tx, ty) || 1;
            var pull = Math.min(0.0009, 0.00018 + dist * 0.008);
            var swirl = 0.0003 * (1 - f.depth);
            var targetX = f.x + (tx / dist) * pull + (-ty / dist) * swirl;
            var targetY = f.y + (ty / dist) * pull + (tx / dist) * swirl;
            f.vx += (targetX - f.x) * ACCEL;
            f.vy += (targetY - f.y) * ACCEL;
          } else {
            for (var j = 0; j < st.fish.length; j += 1) {
              if (j === i) continue;
              var g = st.fish[j];
              var dx = f.x - g.x;
              var dy = f.y - g.y;
              var d = Math.hypot(dx, dy) || 0.0001;
              if (d < SEP_R) {
                var push = (1 - d / SEP_R) * SEP_FORCE;
                f.vx += (dx / d) * push * ACCEL;
                f.vy += (dy / d) * push * ACCEL;
              }
            }
            f.vx += f.speed * STEP * f.direction * DISPERSE_DRIFT;
          }
          f.vx *= DAMP;
          f.vy *= DAMP;
          var vmag = Math.hypot(f.vx, f.vy);
          if (vmag > VMAX) {
            f.vx = (f.vx / vmag) * VMAX;
            f.vy = (f.vy / vmag) * VMAX;
          }
          f.x += f.vx;
          f.y += f.vy;
          var vlen = Math.hypot(f.vx, f.vy);
          var faceTarget = vlen > 1e-5 ? Math.atan2(f.vy, f.vx) : f.face;
          f.face += angDiff(faceTarget, f.face) * 0.14;
          if (f.x > 1.16) f.x = -0.16;
          else if (f.x < -0.16) f.x = 1.16;
          if (f.y > 1.12) f.y = -0.12;
          else if (f.y < -0.12) f.y = 1.12;
        }
        if (st.elapsed - st.lastAmbientAt > 4400) {
          st.lastAmbientAt = st.elapsed;
          addRipple(st.width * (0.56 + Math.random() * 0.3), st.height * (0.46 + Math.random() * 0.26), 0.22);
        }
        for (var r = st.ripples.length - 1; r >= 0; r -= 1) {
          st.ripples[r].r += 1.1;
          st.ripples[r].life -= 0.0116;
          if (st.ripples[r].life <= 0) st.ripples.splice(r, 1);
        }
      }
      render(st.elapsed);
    }

    function tick(now) {
      st.raf = requestAnimationFrame(tick);
      var delta = now - st.last;
      if (delta < STEP) return;
      st.last = now - (delta % STEP);
      st.elapsed += STEP;
      step();
    }

    st.onPointerMove = function (event) {
      st.mouse.x = event.clientX;
      st.mouse.y = event.clientY;
      var now = performance.now();
      st.lastMoveAt = now;
      if (now - st.lastPointerAt > 190) {
        st.lastPointerAt = now;
        addRipple(event.clientX, event.clientY);
        if (reduce) render(st.elapsed);
      }
    };
    st.onPointerLeave = function () {
      st.mouse.x = -9999;
      st.mouse.y = -9999;
    };
    st.onResize = function () {
      window.clearTimeout(st.resizeTimer);
      st.resizeTimer = window.setTimeout(function () {
        resize();
        render(st.elapsed);
      }, 160);
    };
    st.stop = function () {
      if (st.raf) cancelAnimationFrame(st.raf);
      st.raf = 0;
    };
    st.start = function () {
      if (reduce || st.raf) return;
      st.last = performance.now();
      st.raf = requestAnimationFrame(tick);
    };
    st.onVisibility = function () {
      if (document.hidden) st.stop();
      else st.start();
    };
    st.destroy = function () {
      st.stop();
      window.clearTimeout(st.resizeTimer);
      window.removeEventListener('resize', st.onResize);
      window.removeEventListener('pointermove', st.onPointerMove);
      document.documentElement.removeEventListener('mouseleave', st.onPointerLeave);
      document.removeEventListener('visibilitychange', st.onVisibility);
    };

    resize();
    addRipple(window.innerWidth * 0.72, window.innerHeight * 0.58, 0.26);
    render(0);
    window.addEventListener('resize', st.onResize);
    window.addEventListener('pointermove', st.onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', st.onPointerLeave);
    document.addEventListener('visibilitychange', st.onVisibility);
    st.start();

    fishState = st;
  }

  /* ============ 金粒子丝带（与主站一致） ============ */
  var ribbonState = null;

  function initRibbon() {
    var canvas = ribbonCanvas;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var host = ribbonWrap;

    var DARK = { comp: 'screen', core: '248,222,164', edge: '201,168,106', halo: '211,175,103' };
    var LIGHT = { comp: 'source-over', core: '176,146,86', edge: '184,159,107', halo: '184,159,107' };

    var COUNT = mobile ? 110 : 220;
    var BAND = mobile ? 0.052 : 0.078;

    var st = {
      W: 0, H: 0, dpr: 1, t: 0, elapsed: 0, raf: 0, last: 0, resizeTimer: 0, layer: null,
      P: isDark() ? DARK : LIGHT,
      grains: [],
    };

    function rnd(a, b) { return a + Math.random() * (b - a); }
    for (var gi = 0; gi < COUNT; gi += 1) {
      st.grains.push({
        p: (Math.random() + Math.random()) / 2,
        o: (Math.random() + Math.random() + Math.random() - 1.5) / 1.5,
        r: rnd(0.00055, 0.0021),
        s: rnd(0.00012, 0.00048),
        a: rnd(0.12, 0.58),
        tw: rnd(0, Math.PI * 2),
        tws: rnd(0.5, 1.9),
        spark: Math.random() < 0.06,
      });
    }

    function unit() { return Math.min(st.W, st.H) || 1; }
    function band() { return unit() * BAND; }

    function pointAt(p, off) {
      var x = st.W * (-0.07 + p * 1.15);
      var y = st.H * (0.92 - p * 0.82) + Math.sin(p * Math.PI * 1.05 - 0.42) * st.H * 0.11 + off;
      return { x: x, y: y };
    }

    function buildLayer() {
      if (st.W <= 0 || st.H <= 0) return;
      var c = document.createElement('canvas');
      c.width = Math.max(1, Math.floor(st.W * st.dpr));
      c.height = Math.max(1, Math.floor(st.H * st.dpr));
      var g = c.getContext('2d');
      if (!g) return;
      var P = st.P;
      g.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      g.globalCompositeOperation = P.comp;

      function gradient(ctx2, strength) {
        var grd = ctx2.createLinearGradient(st.W * -0.07, 0, st.W * 1.08, 0);
        grd.addColorStop(0, 'rgba(' + P.edge + ',0)');
        grd.addColorStop(0.16, 'rgba(' + P.edge + ',' + (strength * 0.2).toFixed(3) + ')');
        grd.addColorStop(0.42, 'rgba(' + P.core + ',' + (strength * 0.55).toFixed(3) + ')');
        grd.addColorStop(0.66, 'rgba(' + P.core + ',' + strength.toFixed(3) + ')');
        grd.addColorStop(0.87, 'rgba(' + P.edge + ',' + (strength * 0.6).toFixed(3) + ')');
        grd.addColorStop(1, 'rgba(' + P.edge + ',' + (strength * 0.05).toFixed(3) + ')');
        return grd;
      }

      function stroke(off, strength, lw, blur, steps) {
        steps = steps || 190;
        g.beginPath();
        for (var i = 0; i <= steps; i += 1) {
          var pt = pointAt(i / steps, off);
          if (i === 0) g.moveTo(pt.x, pt.y);
          else g.lineTo(pt.x, pt.y);
        }
        g.strokeStyle = gradient(g, strength);
        g.lineWidth = Math.max(0.6, lw);
        g.shadowColor = 'rgba(' + P.core + ',.34)';
        g.shadowBlur = blur;
        g.stroke();
      }

      g.shadowBlur = 0;
      for (var i = 0; i < 5; i += 1) {
        var p = 0.34 + i * 0.11;
        var pt = pointAt(p, 0);
        var rad = unit() * (0.2 + i * 0.045);
        var grd = g.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, rad);
        grd.addColorStop(0, 'rgba(' + P.halo + ',' + (0.05 + i * 0.008).toFixed(3) + ')');
        grd.addColorStop(1, 'rgba(' + P.halo + ',0)');
        g.fillStyle = grd;
        g.fillRect(pt.x - rad, pt.y - rad, rad * 2, rad * 2);
      }

      var b = band();
      g.shadowColor = 'rgba(' + P.core + ',.34)';
      stroke(-b * 0.92, 0.1, unit() * 0.0022, 22);
      stroke(b * 0.9, 0.09, unit() * 0.0022, 22);
      stroke(-b * 0.34, 0.28, unit() * 0.0018, 12);
      stroke(0, 0.5, unit() * 0.0014, 9);
      stroke(b * 0.4, 0.24, unit() * 0.0018, 12);
      stroke(-b * 0.1, 0.42, unit() * 0.0009, 6, 150);
      stroke(b * 0.16, 0.3, unit() * 0.0008, 6, 150);

      st.layer = c;
    }

    function drawGrains() {
      var b = band();
      var P = st.P;
      ctx.globalCompositeOperation = P.comp;
      for (var i = 0; i < st.grains.length; i += 1) {
        var gr = st.grains[i];
        var fade = Math.pow(Math.sin(gr.p * Math.PI), 0.8);
        var twinkle = 0.72 + 0.28 * Math.sin(st.t * gr.tws * 2 + gr.tw);
        var alpha = fade * gr.a * twinkle;
        if (alpha <= 0.004) continue;
        var pt = pointAt(gr.p, gr.o * b * fade + Math.sin(st.t * 1.35 + gr.p * 8.5) * unit() * 0.003);
        var rad = Math.max(0.35, gr.r * unit() * (gr.spark ? 1.7 : 1));
        ctx.fillStyle = 'rgba(' + P.core + ',' + alpha.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, rad, 0, Math.PI * 2);
        ctx.fill();
        if (gr.spark) {
          ctx.fillStyle = 'rgba(' + P.core + ',' + (alpha * 0.22).toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, rad * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function render() {
      if (st.W <= 0 || st.H <= 0) return;
      ctx.clearRect(0, 0, st.W, st.H);
      ctx.save();
      ctx.globalCompositeOperation = st.P.comp;
      if (st.layer) {
        var dx = Math.sin(st.elapsed * 0.00016) * st.W * 0.004;
        var dy = Math.cos(st.elapsed * 0.00021) * st.H * 0.006;
        ctx.drawImage(st.layer, dx, dy, st.W, st.H);
      }
      drawGrains();
      ctx.restore();
    }

    function tick(now) {
      st.raf = requestAnimationFrame(tick);
      var delta = now - st.last;
      if (delta < STEP) return;
      st.last = now - (delta % STEP);
      st.elapsed += STEP;
      st.t += 0.012 * (STEP / 16.7);
      for (var i = 0; i < st.grains.length; i += 1) {
        var gr = st.grains[i];
        gr.p += gr.s * (STEP / 16.7);
        if (gr.p > 1) {
          gr.p = 0;
          gr.o = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
        }
      }
      render();
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      st.W = rect.width || host.clientWidth;
      st.H = rect.height || host.clientHeight;
      st.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(st.W * st.dpr));
      canvas.height = Math.max(1, Math.floor(st.H * st.dpr));
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      buildLayer();
      render();
    }

    st.onResize = function () {
      window.clearTimeout(st.resizeTimer);
      st.resizeTimer = window.setTimeout(resize, 160);
    };
    st.onVisibility = function () {
      if (document.hidden) { if (st.raf) { cancelAnimationFrame(st.raf); st.raf = 0; } }
      else if (!reduce && !st.raf) { st.last = performance.now(); st.raf = requestAnimationFrame(tick); }
    };
    st.destroy = function () {
      if (st.raf) cancelAnimationFrame(st.raf);
      st.raf = 0;
      window.clearTimeout(st.resizeTimer);
      window.removeEventListener('resize', st.onResize);
      document.removeEventListener('visibilitychange', st.onVisibility);
      if (st.ro) st.ro.disconnect();
    };

    resize();
    window.addEventListener('resize', st.onResize);
    st.ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(st.onResize) : null;
    if (st.ro) st.ro.observe(host);
    document.addEventListener('visibilitychange', st.onVisibility);
    if (!reduce) { st.last = performance.now(); st.raf = requestAnimationFrame(tick); }

    ribbonState = st;
  }

  /* ============ 主题切换 → 整体重建（等价主站 useEffect 重挂） ============ */
  var themeTimer = 0;
  var themeObserver = new MutationObserver(function () {
    window.clearTimeout(themeTimer);
    themeTimer = window.setTimeout(function () {
      if (fishState) { fishState.destroy(); fishState = null; }
      if (ribbonState) { ribbonState.destroy(); ribbonState = null; }
      initFish();
      initRibbon();
    }, 120);
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  initFish();
  initRibbon();

  /* 调试钩子（仅供自动化对齐巡检 page.evaluate 读取，不影响渲染）：返回当前鱼数与主题态 */
  window.__profileBgDebug = function () {
    return {
      kit: !!window.__profileBgKit,
      embedded: EMBEDDED,
      fish: fishState ? fishState.fish.length : 0,
      dark: isDark(),
      total: fishState ? (mobile ? Math.min(3, 9) : 9) : 0,
    };
  };
})();
