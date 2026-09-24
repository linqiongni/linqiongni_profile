/* 水下鱼影 + 鼠标涟漪 + 水面波纹 —— vanilla 移植（对齐主页 AquaticLuxuryBackground / WaterRippleBackground）
   两条 rAF 合并为单循环；跟随 <html data-theme> 切换深浅色；尊重 prefers-reduced-motion。 */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.matchMedia('(max-width: 768px)').matches;

  var darkRef = { current: document.documentElement.getAttribute('data-theme') !== 'light' };
  if (window.MutationObserver) {
    new MutationObserver(function () {
      darkRef.current = document.documentElement.getAttribute('data-theme') !== 'light';
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  /* 动态注入效果层 DOM（必须在 app.js 重构 DOM 之后执行，否则会被折进正文） */
  var bgHost = document.createElement('div');
  bgHost.className = 'aquatic-luxury-background';
  bgHost.setAttribute('aria-hidden', 'true');
  bgHost.innerHTML =
    '<div class="aquatic-luxury-vignette"></div>' +
    '<div class="aquatic-luxury-grain"></div>' +
    '<div class="aquatic-luxury-water"></div>' +
    '<canvas class="aquatic-luxury-scene"></canvas>';
  var rippleCanvas = document.createElement('canvas');
  rippleCanvas.className = 'water-ripple-canvas';
  rippleCanvas.setAttribute('aria-hidden', 'true');
  if (document.body.firstChild) document.body.insertBefore(bgHost, document.body.firstChild);
  else document.body.appendChild(bgHost);
  document.body.appendChild(rippleCanvas);

  /* ============================================================
   * 一、鱼影 + 鼠标涟漪（AquaticLuxuryBackground 移植）
   * ============================================================ */
  var scene = bgHost.querySelector('.aquatic-luxury-scene');
  if (scene) {
    var sctx = scene.getContext('2d');
    var PHASES = 8, MAX_RIPPLES = 12, TARGET_FPS = 30, STEP = 1000 / TARGET_FPS;
    var TONES = [
      ['rgba(46,62,80,.16)', 'rgba(88,98,110,.52)', 'rgba(158,124,62,.46)', 'rgba(58,74,92,.12)'],
      ['rgba(40,58,76,.15)', 'rgba(78,96,112,.50)', 'rgba(132,114,70,.42)', 'rgba(52,70,88,.10)'],
      ['rgba(50,66,84,.14)', 'rgba(96,110,124,.48)', 'rgba(164,132,70,.40)', 'rgba(60,78,96,.10)']
    ];
    var EYE = 'rgba(226,201,148,.9)';

    function paintFish(ctx, size, tone, bend, tailRot) {
      var grad = ctx.createLinearGradient(-size, 0, size, 0);
      grad.addColorStop(0, tone[0]); grad.addColorStop(0.42, tone[1]);
      grad.addColorStop(0.72, tone[2]); grad.addColorStop(1, tone[3]);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-size * 0.72, bend * 0.18);
      ctx.bezierCurveTo(-size * 0.42, -size * 0.34, size * 0.34, -size * 0.3, size * 0.8, -size * 0.05);
      ctx.quadraticCurveTo(size * 0.95, 0, size * 0.8, size * 0.07);
      ctx.bezierCurveTo(size * 0.34, size * 0.3, -size * 0.42, size * 0.34, -size * 0.72, bend * 0.18);
      ctx.closePath(); ctx.fill();
      ctx.save();
      ctx.translate(-size * 0.68, bend * 0.18); ctx.rotate(tailRot);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-size * 0.3, -size * 0.08, -size * 0.62, -size * 0.42, -size * 0.78, -size * 0.32);
      ctx.quadraticCurveTo(-size * 0.55, 0, -size * 0.78, size * 0.32);
      ctx.bezierCurveTo(-size * 0.62, size * 0.42, -size * 0.3, size * 0.08, 0, 0);
      ctx.fill(); ctx.restore();
      ctx.beginPath();
      ctx.moveTo(-size * 0.1, -size * 0.25);
      ctx.quadraticCurveTo(size * 0.05, -size * 0.52, size * 0.28, -size * 0.22);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(size * 0.12, size * 0.2);
      ctx.quadraticCurveTo(size * 0.28, size * 0.43, size * 0.4, size * 0.14);
      ctx.closePath(); ctx.fill();
    }

    function buildSprites(size, depth, tone, dpr) {
      var blur = (1 - depth) * 2.1;
      var padW = size * 2.2 + blur * 8, padH = size * 1.3 + blur * 8, out = [];
      for (var i = 0; i < PHASES; i++) {
        var swim = Math.sin((i / PHASES) * Math.PI * 2);
        var c = document.createElement('canvas');
        c.width = Math.max(1, Math.ceil(padW * dpr));
        c.height = Math.max(1, Math.ceil(padH * dpr));
        var g = c.getContext('2d'); if (!g) break;
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.translate(padW / 2, padH / 2); g.scale(1, 0.72);
        if (blur > 0.05) g.filter = 'blur(' + blur + 'px)';
        paintFish(g, size, tone, swim * size * 0.1, swim * 0.24);
        g.filter = 'none';
        g.fillStyle = EYE; g.globalAlpha = 0.5;
        g.beginPath(); g.arc(size * 0.68, -size * 0.055, Math.max(1.15, size * 0.032), 0, Math.PI * 2); g.fill();
        out.push({ img: c, w: padW, h: padH });
      }
      return out;
    }

    function angDiff(a, b) {
      var d = a - b;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      return d;
    }

    var fishCount = mobile ? 3 : 6;
    var fish = [], ripples = [], sprites = [], sw = 0, sh = 0, dpr = 1, raf = 0, last = 0, elapsed = 0;
    var lastPointerAt = 0, lastAmbientAt = 0, running = true;
    var mouse = { x: -9999, y: -9999 };

    for (var k = 0; k < fishCount; k++) {
      fish.push({
        x: k % 2 === 0 ? -0.12 + k * 0.17 : 1.12 - k * 0.13,
        y: 0.51 + (k % 4) * 0.09,
        size: mobile ? 20 + (k % 3) * 7 : 23 + (k % 4) * 10,
        speed: 0.000012 + (k % 4) * 0.000003,
        alpha: 0.18 + (k % 3) * 0.05,
        direction: (k % 2 === 0 ? 1 : -1),
        phase: k * 1.37, depth: 0.48 + (k % 4) * 0.12, tone: k % TONES.length,
        vx: 0, vy: 0, face: k % 2 === 0 ? 0 : Math.PI
      });
    }

    function sResize() {
      sw = window.innerWidth; sh = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      scene.width = Math.max(1, Math.floor(sw * dpr));
      scene.height = Math.max(1, Math.floor(sh * dpr));
      scene.style.width = sw + 'px'; scene.style.height = sh + 'px';
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sprites = fish.map(function (f) { return buildSprites(f.size, f.depth, TONES[f.tone], Math.min(dpr, 1.5)); });
    }
    function addRipple(x, y, s) {
      if (ripples.length >= MAX_RIPPLES) ripples.shift();
      ripples.push({ x: x, y: y, r: 5, life: 1, s: s || 0.52 });
    }
    function drawRipple(rp) {
      var base = rp.life * rp.s; if (base <= 0.004) return;
      var R = rp.r + 26;
      sctx.save(); sctx.translate(rp.x, rp.y); sctx.scale(1, 0.36);
      var grad = sctx.createLinearGradient(-R, 0, R, 0);
      grad.addColorStop(0, 'rgba(150,170,196,0)');
      grad.addColorStop(0.3, 'rgba(150,170,196,.55)');
      grad.addColorStop(0.58, 'rgba(214,182,122,1)');
      grad.addColorStop(1, 'rgba(150,170,196,0)');
      sctx.strokeStyle = grad;
      for (var i = 0; i < 3; i++) {
        sctx.globalAlpha = base * (1 - i / 3.4) * (darkRef.current ? 0.5 : 0.4);
        sctx.beginPath(); sctx.ellipse(0, 0, rp.r + i * 12, rp.r + i * 12, 0, 0, Math.PI * 2);
        sctx.lineWidth = i === 0 ? 1.2 : 0.7; sctx.stroke();
      }
      sctx.restore();
    }
    function sRender(time) {
      if (!sw || !sh) return;
      sctx.clearRect(0, 0, sw, sh);
      for (var i = 0; i < ripples.length; i++) drawRipple(ripples[i]);
      var gain = darkRef.current ? 1 : 0.8;
      var order = fish.slice().sort(function (a, b) { return a.depth - b.depth; });
      for (var n = 0; n < order.length; n++) {
        var f = order[n], frames = sprites[fish.indexOf(f)];
        if (!frames || !frames.length) continue;
        var x = f.x * sw, y = f.y * sh + Math.sin(time * 0.00032 + f.phase) * 14 * f.depth;
        var idx = Math.floor(((time * 0.0032 + f.phase) / (Math.PI * 2)) * PHASES) % PHASES;
        var sp = frames[((idx % PHASES) + PHASES) % PHASES]; if (!sp) continue;
        sctx.save(); sctx.globalAlpha = f.alpha * gain; sctx.translate(x, y);
        sctx.rotate(f.face + Math.sin(time * 0.00055 + f.phase) * 0.05);
        sctx.drawImage(sp.img, -sp.w / 2, -sp.h / 2, sp.w, sp.h);
        sctx.restore();
      }
    }
    function sStep() {
      if (reduce) return;
      var mouseActive = mouse.x > -9000;
      for (var i = 0; i < fish.length; i++) {
        var f = fish[i];
        var tx, ty;
        if (mouseActive) {
          var mx = mouse.x / sw, my = mouse.y / sh;
          var ddx = mx - f.x, ddy = my - f.y, dist = Math.hypot(ddx, ddy) || 1;
          var pull = Math.min(0.0024, 0.0005 + dist * 0.02), swirl = 0.0007 * (1 - f.depth);
          tx = f.x + (ddx / dist) * pull + (-ddy / dist) * swirl;
          ty = f.y + (ddy / dist) * pull + (ddx / dist) * swirl;
        } else {
          tx = f.x + f.speed * STEP * f.direction; ty = f.y;
        }
        f.vx += (tx - f.x) * 0.12; f.vy += (ty - f.y) * 0.12;
        var vmag = Math.hypot(f.vx, f.vy);
        if (vmag > 0.0045) { f.vx = (f.vx / vmag) * 0.0045; f.vy = (f.vy / vmag) * 0.0045; }
        f.x += f.vx; f.y += f.vy;
        var vlen = Math.hypot(f.vx, f.vy);
        var faceTarget = vlen > 1e-5 ? Math.atan2(f.vy, f.vx) : f.face;
        f.face += angDiff(faceTarget, f.face) * 0.14;
        if (f.x > 1.16) f.x = -0.16; else if (f.x < -0.16) f.x = 1.16;
        if (f.y > 1.12) f.y = -0.12; else if (f.y < -0.12) f.y = 1.12;
      }
      if (elapsed - lastAmbientAt > 4400) {
        lastAmbientAt = elapsed;
        addRipple(sw * (0.56 + Math.random() * 0.3), sh * (0.46 + Math.random() * 0.26), 0.22);
      }
      for (var j = ripples.length - 1; j >= 0; j--) {
        ripples[j].r += 1.1; ripples[j].life -= 0.0116;
        if (ripples[j].life <= 0) ripples.splice(j, 1);
      }
    }
    function onPointerMove(e) {
      mouse.x = e.clientX; mouse.y = e.clientY;
      var now = performance.now();
      if (now - lastPointerAt > 190) { lastPointerAt = now; addRipple(e.clientX, e.clientY); }
    }
    function onPointerLeave() { mouse.x = -9999; mouse.y = -9999; }
    function onVis() { running = !document.hidden; if (running) { last = performance.now(); raf = requestAnimationFrame(loop); } else { cancelAnimationFrame(raf); } }

    sResize();
    addRipple(sw * 0.72, sh * 0.58, 0.26);
    sRender(0);
    window.addEventListener('resize', function () { clearTimeout(sResize._t); sResize._t = setTimeout(sResize, 160); });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVis);
  }

  /* ============================================================
   * 二、水面波纹（WaterRippleBackground 移植，高度场波动方程）
   * ============================================================ */
  var rc = rippleCanvas;
  if (rc) {
    var rctx = rc.getContext('2d');
    var CELL = 10, DAMPING = 0.955, POINTER_STRENGTH = 0.18, POINTER_RADIUS = 2;
    var POINTER_MIN_DIST = 4.5, POINTER_MIN_INTERVAL = 220, AMBIENT_STRENGTH = 0.07;
    var AMBIENT_RADIUS = 4, AMBIENT_INTERVAL = 4.2, LIGHT_GAIN = 1.0, MAX_ALPHA = 0.055;
    var rw = 0, rh = 0, cols = 0, rows = 0, curr, prev, grid, gridCtx, imgData, buf32;
    var ambientAcc = 0, hasPointer = false, lastDropAt = 0, lastGx = -1, lastGy = -1;

    function rResize() {
      rw = window.innerWidth; rh = window.innerHeight;
      rc.width = rw; rc.height = rh; rc.style.width = rw + 'px'; rc.style.height = rh + 'px';
      cols = Math.max(8, Math.ceil(rw / CELL)); rows = Math.max(8, Math.ceil(rh / CELL));
      curr = new Float32Array(cols * rows); prev = new Float32Array(cols * rows);
      if (!grid) { grid = document.createElement('canvas'); gridCtx = grid.getContext('2d'); }
      grid.width = cols; grid.height = rows;
      imgData = gridCtx.createImageData(cols, rows);
      buf32 = new Uint32Array(imgData.data.buffer);
      rctx.imageSmoothingEnabled = true; rctx.imageSmoothingQuality = 'high';
    }
    function drop(gx, gy, strength, radius) {
      var cx = Math.round(gx), cy = Math.round(gy);
      for (var dy = -radius; dy <= radius; dy++) for (var dx = -radius; dx <= radius; dx++) {
        var x = cx + dx, y = cy + dy;
        if (x < 1 || y < 1 || x >= cols - 1 || y >= rows - 1) continue;
        var d = Math.sqrt(dx * dx + dy * dy); if (d > radius) continue;
        var falloff = 1 - d / (radius + 1), i = y * cols + x, next = curr[i] + strength * falloff;
        curr[i] = next > 1.2 ? 1.2 : next < -1.2 ? -1.2 : next;
      }
    }
    function rStep() {
      for (var y = 1; y < rows - 1; y++) {
        var row = y * cols;
        for (var x = 1; x < cols - 1; x++) {
          var i = row + x;
          var v = (curr[i - 1] + curr[i + 1] + curr[i - cols] + curr[i + cols]) * 0.5 - prev[i];
          prev[i] = v * DAMPING;
        }
      }
      var t = curr; curr = prev; prev = t;
    }
    function rRender() {
      if (!gridCtx || !imgData || !buf32) return;
      var isDark = darkRef.current;
      var warmR = isDark ? 16 : 14, warmG = isDark ? 10 : 8, warmB = isDark ? -18 : -20;
      buf32.fill(0);
      for (var y = 1; y < rows - 1; y++) {
        var row = y * cols;
        for (var x = 1; x < cols - 1; x++) {
          var i = row + x, dx = curr[i + 1] - curr[i - 1], dy = curr[i + cols] - curr[i - cols];
          var vv = (dx + dy) * LIGHT_GAIN;
          if (vv > 1) vv = 1; else if (vv < -1) vv = -1;
          var mag = vv < 0 ? -vv : vv; if (mag < 0.012) continue;
          var alpha = (mag > MAX_ALPHA ? MAX_ALPHA : mag) * 255;
          var base = 128 + vv * 127;
          var r = base + warmR * (vv > 0 ? 1 : -0.4);
          var g = base + warmG * (vv > 0 ? 1 : -0.4);
          var b = base + warmB * (vv > 0 ? 1 : -0.4);
          buf32[i] = ((alpha & 0xff) << 24) | (((b < 0 ? 0 : b > 255 ? 255 : b) | 0) << 16) |
            (((g < 0 ? 0 : g > 255 ? 255 : g) | 0) << 8) | ((r < 0 ? 0 : r > 255 ? 255 : r) | 0);
        }
      }
      gridCtx.putImageData(imgData, 0, 0);
      rctx.clearRect(0, 0, rw, rh);
      rctx.drawImage(grid, 0, 0, cols, rows, 0, 0, rw, rh);
    }
    function rOnPointerMove(e) {
      var gx = (e.clientX / window.innerWidth) * cols, gy = (e.clientY / window.innerHeight) * rows;
      var now = performance.now();
      var dist = hasPointer ? Math.hypot(gx - lastGx, gy - lastGy) : Infinity;
      if (dist >= POINTER_MIN_DIST && now - lastDropAt >= POINTER_MIN_INTERVAL) {
        drop(gx, gy, POINTER_STRENGTH, POINTER_RADIUS); lastDropAt = now; lastGx = gx; lastGy = gy; hasPointer = true;
      } else if (!hasPointer) {
        drop(gx, gy, POINTER_STRENGTH, POINTER_RADIUS); lastDropAt = now; lastGx = gx; lastGy = gy; hasPointer = true;
      }
    }
    function rOnLeave() { hasPointer = false; }
    function rOnVis() { running = !document.hidden; if (running) { last = performance.now(); raf = requestAnimationFrame(loop); } else { cancelAnimationFrame(raf); } }

    rResize();
    window.addEventListener('resize', function () { clearTimeout(rResize._t); rResize._t = setTimeout(rResize, 160); });
    window.addEventListener('pointermove', rOnPointerMove, { passive: true });
    window.addEventListener('pointerdown', rOnPointerMove, { passive: true });
    document.addEventListener('pointerleave', rOnLeave);
    document.addEventListener('visibilitychange', rOnVis);
  }

  /* ============================================================
   * 三、单 rAF 循环驱动两套效果；切后台暂停
   * ============================================================ */
  var raf = 0, last = 0;
  function loop(time) {
    if (!running) return;
    var dt = last ? Math.min((time - last) / 1000, 0.05) : 0.016;
    last = time;
    ambientAcc += dt;
    if (ambientAcc >= AMBIENT_INTERVAL) {
      ambientAcc = 0;
      drop(Math.random() * (cols - 2) + 1, Math.random() * (rows - 2) + 1, (Math.random() * 0.6 + 0.7) * AMBIENT_STRENGTH, AMBIENT_RADIUS);
    }
    sStep && sStep();
    if (rc) { rStep(); rRender(); }
    if (scene) sRender(elapsed);
    elapsed += STEP;
    raf = requestAnimationFrame(loop);
  }
  var running = true;
  function start() { if (reduce || raf) return; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  if (reduce) {
    // 仅静态渲染一帧
    sRender && sRender(0);
    if (rc) { rRender(); }
  } else {
    start();
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
})();
