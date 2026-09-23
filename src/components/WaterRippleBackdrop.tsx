import React, { useEffect, useRef } from 'react';

/**
 * 首屏动态水面背景：低频自动水波 + 鼠标互动金色涟漪。
 *
 * 设计约束（与站点风格一致）：
 * - 强度克制：涟漪透明度、发光、密度均取低档，只做氛围，不抢正文。
 * - 浅色/深色双档配色：浅色底用 source-over（screen 在亮底会消失），深色底用 screen。
 * - 不拦截交互：canvas pointer-events:none（由 .water-ripple-backdrop 控制）。
 * - 性能：DPR 上限 2、涟漪数量封顶、页面隐藏时暂停、prefers-reduced-motion 降级为静态水波。
 */
type Ripple = {
  x: number;
  y: number;
  born: number;
  life: number;
  maxR: number;
  amp: number;
  rings: number;
  drop: boolean;
};

type Palette = {
  core: string;
  edge: string;
  drop: string;
  halo: string;
  glow: string;
  comp: GlobalCompositeOperation;
  shadow: string;
};

const DARK_PALETTE: Palette = {
  core: '248,222,164',
  edge: '201,168,106',
  drop: '255,244,214',
  halo: '248,222,164',
  glow: '201,168,106',
  comp: 'screen',
  shadow: 'rgba(211,175,103,.26)',
};

const LIGHT_PALETTE: Palette = {
  core: '184,159,107',
  edge: '184,159,107',
  drop: '201,168,106',
  halo: '184,159,107',
  glow: '184,159,107',
  comp: 'source-over',
  shadow: 'rgba(184,159,107,.16)',
};

const readPalette = (): Palette =>
  document.documentElement.classList.contains('dark') ? DARK_PALETTE : LIGHT_PALETTE;

export const WaterRippleBackdrop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    if (!host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 768px)').matches;

    // 低强度参数（移动端再降一档）
    const k = mobile ? 0.62 : 1;
    const AMP_MOVE = 0.3 * k;
    const AMP_CLICK = 0.46 * k;
    const AMP_AUTO = 0.16 * k;
    const GLOW_BASE = 0.03 * k;
    const MOUSE_HALO = 0.045 * k;
    const SHADOW_BLUR = 7;
    const AUTO_GAP = mobile ? 3200 : 2400;
    const MAX = reduce ? 0 : mobile ? 22 : 54;

    let P = readPalette();
    let W = 0;
    let H = 0;
    let ripples: Ripple[] = [];
    let raf = 0;
    let autoRaf = 0;
    let lastAuto = 0;
    const mouse = { x: -9999, y: -9999, active: false, lastSpawn: 0 };

    const surfaceY = () => H * 0.66;

    const spawn = (x: number, y: number, opts?: Partial<Ripple>) => {
      if (ripples.length >= MAX) ripples.shift();
      ripples.push({
        x,
        y,
        born: performance.now(),
        life: opts?.life ?? (mobile ? 2200 : 2900),
        maxR: opts?.maxR ?? 40 + Math.random() * 62,
        amp: opts?.amp ?? AMP_AUTO,
        rings: opts?.rings ?? (Math.random() < 0.5 ? 1 : 2),
        drop: opts?.drop !== false,
      });
    };

    const drawRipple = (rp: Ripple, now: number) => {
      const p = (now - rp.born) / rp.life;
      if (p >= 1) return;
      const ease = Math.pow(p, 0.55);
      const fade = (1 - p) * (1 - p);

      for (let i = 0; i < rp.rings; i++) {
        const r = ease * rp.maxR * (1 - i * 0.3);
        if (r <= 1) continue;
        const alpha = fade * rp.amp * (i === 0 ? 1 : 0.34);
        const grad = ctx.createLinearGradient(rp.x - r, rp.y, rp.x + r, rp.y);
        grad.addColorStop(0, `rgba(${P.edge},0)`);
        grad.addColorStop(0.5, `rgba(${P.core},${alpha.toFixed(3)})`);
        grad.addColorStop(1, `rgba(${P.edge},0)`);
        ctx.beginPath();
        // 椭圆 = 俯视水面的透视感
        ctx.ellipse(rp.x, rp.y, r, r * 0.34, 0, 0, Math.PI * 2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(0.5, (1 - p) * 1.25 * (i === 0 ? 1 : 0.55));
        ctx.stroke();
      }

      // 落点高光水珠
      if (rp.drop && p < 0.24) {
        const da = (1 - p / 0.24) * rp.amp * 0.62;
        const dg = ctx.createRadialGradient(rp.x, rp.y, 0, rp.x, rp.y, 7);
        dg.addColorStop(0, `rgba(${P.drop},${da.toFixed(3)})`);
        dg.addColorStop(1, `rgba(${P.drop},0)`);
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = dg;
        ctx.fill();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const now = performance.now();

      // 水面地平线附近的金色氛围光
      const sy = surfaceY();
      const glow = ctx.createRadialGradient(W * 0.62, sy, 0, W * 0.62, sy, Math.max(W, H) * 0.42);
      glow.addColorStop(0, `rgba(${P.glow},${GLOW_BASE.toFixed(3)})`);
      glow.addColorStop(1, `rgba(${P.glow},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.globalCompositeOperation = P.comp;
      ctx.shadowColor = P.shadow;
      ctx.shadowBlur = SHADOW_BLUR;
      ripples.forEach((rp) => drawRipple(rp, now));

      if (mouse.active) {
        const mg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
        mg.addColorStop(0, `rgba(${P.halo},${MOUSE_HALO.toFixed(3)})`);
        mg.addColorStop(1, `rgba(${P.halo},0)`);
        ctx.fillStyle = mg;
        ctx.fillRect(mouse.x - 80, mouse.y - 80, 160, 160);
      }
      ctx.restore();

      ripples = ripples.filter((rp) => now - rp.born < rp.life);
      raf = requestAnimationFrame(draw);
    };

    const autoRipple = (now: number) => {
      if (now - lastAuto > AUTO_GAP + Math.random() * 1200) {
        lastAuto = now;
        const x = W * (0.12 + Math.random() * 0.76);
        const y = surfaceY() + (Math.random() - 0.5) * H * 0.16;
        spawn(x, y, {
          amp: AMP_AUTO * (0.8 + Math.random() * 0.5),
          maxR: 54 + Math.random() * 74,
          rings: 1,
        });
      }
      autoRaf = requestAnimationFrame(autoRipple);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.globalCompositeOperation = P.comp;
      ctx.shadowColor = P.shadow;
      ctx.shadowBlur = SHADOW_BLUR;
      for (let i = 0; i < 4; i++) {
        const cx = W * (0.25 + i * 0.16);
        const cy = surfaceY() + (i % 2 ? 20 : -14);
        for (let j = 1; j <= 4; j++) {
          ctx.beginPath();
          ctx.ellipse(cx, cy, j * 32, j * 32 * 0.34, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${P.edge},${(0.13 / j).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      ctx.restore();
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
      const now = performance.now();
      if (now - mouse.lastSpawn > 90) {
        mouse.lastSpawn = now;
        spawn(mouse.x, mouse.y, {
          amp: AMP_MOVE,
          maxR: 36 + Math.random() * 34,
          rings: 2,
          life: 2400,
        });
      }
    };
    const onLeave = () => {
      mouse.active = false;
    };
    const onClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      spawn(e.clientX - r.left, e.clientY - r.top, {
        amp: AMP_CLICK,
        maxR: 126,
        rings: 3,
        life: 3100,
      });
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) drawStatic();
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(autoRaf);
      raf = 0;
      autoRaf = 0;
    };
    const start = () => {
      if (reduce || raf || autoRaf) return;
      raf = requestAnimationFrame(draw);
      autoRaf = requestAnimationFrame(autoRipple);
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    if (reduce) {
      drawStatic();
    } else {
      host.addEventListener('mousemove', onMove);
      host.addEventListener('mouseleave', onLeave);
      host.addEventListener('click', onClick);
      start();
    }

    // 主题切换时重取配色（站点是 light/dark 双模式）
    const mo = new MutationObserver(() => {
      P = readPalette();
      if (reduce) drawStatic();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      host.removeEventListener('mousemove', onMove);
      host.removeEventListener('mouseleave', onLeave);
      host.removeEventListener('click', onClick);
      mo.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="water-ripple-backdrop" aria-hidden="true" />;
};
