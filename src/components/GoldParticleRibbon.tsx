import React, { useEffect, useRef } from 'react';

/**
 * 主页首屏的金色粒子丝带（斜贯整屏，亮部落在右上）。
 *
 * 颜色：不铺底色，只画丝带本身 —— 页面底色由站点提供。
 *
 * 性能（2026-09-23 重写，之前每帧要重算 7 条带 shadowBlur 的长描边 + 340 个粒子，是首屏卡顿主因）：
 * - 丝带本体（柔光 / 三股主体 / 内芯 / 金色尘雾）**离屏预渲染一次**，之后每帧只 drawImage + 缓慢漂移。
 * - 每帧真正重画的只有沿丝带前进的粒子；去掉了逐粒子 shadowBlur。
 * - DPR 封顶 1.5、帧率封顶 30fps、粒子数下调、resize 去抖、切后台暂停 rAF。
 * - prefers-reduced-motion：只渲染静态一帧。
 */

type Palette = {
  comp: GlobalCompositeOperation;
  core: string;
  edge: string;
  halo: string;
};

const DARK: Palette = {
  comp: 'screen',
  core: '248,222,164',
  edge: '201,168,106',
  halo: '211,175,103',
};

const LIGHT: Palette = {
  comp: 'source-over',
  core: '176,146,86',
  edge: '184,159,107',
  halo: '184,159,107',
};

type Grain = {
  p: number;
  o: number;
  r: number;
  s: number;
  a: number;
  tw: number;
  tws: number;
  spark: boolean;
};

const TARGET_FPS = 30;
const STEP = 1000 / TARGET_FPS;

export const GoldParticleRibbon: React.FC = () => {
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

    const COUNT = mobile ? 110 : 220;
    const BAND = mobile ? 0.052 : 0.078;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let t = 0;
    let elapsed = 0;
    let raf = 0;
    let last = 0;
    let resizeTimer = 0;
    let layer: HTMLCanvasElement | null = null;
    let P: Palette = document.documentElement.classList.contains('dark') ? DARK : LIGHT;

    const rnd = (a: number, b: number): number => a + Math.random() * (b - a);

    const grains: Grain[] = Array.from({ length: COUNT }, () => ({
      p: (Math.random() + Math.random()) / 2,
      o: (Math.random() + Math.random() + Math.random() - 1.5) / 1.5,
      r: rnd(0.00055, 0.0021),
      s: rnd(0.00012, 0.00048),
      a: rnd(0.12, 0.58),
      tw: rnd(0, Math.PI * 2),
      tws: rnd(0.5, 1.9),
      spark: Math.random() < 0.06,
    }));

    const unit = (): number => Math.min(W, H) || 1;
    const band = (): number => unit() * BAND;

    /** 丝带中心线：自左下 (-7%, 88%) 斜向右上 (108%, 13%)，带轻微 S 起伏 */
    const pointAt = (p: number, off: number) => {
      const x = W * (-0.07 + p * 1.15);
      const y =
        H * (0.92 - p * 0.82) +
        Math.sin(p * Math.PI * 1.05 - 0.42) * H * 0.11 +
        off;
      return { x, y };
    };

    /** 把静态丝带画到离屏 once */
    const buildLayer = (): void => {
      if (W <= 0 || H <= 0) return;
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.floor(W * dpr));
      c.height = Math.max(1, Math.floor(H * dpr));
      const g = c.getContext('2d');
      if (!g) return;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.globalCompositeOperation = P.comp;

      const gradient = (ctx2: CanvasRenderingContext2D, strength: number) => {
        const grd = ctx2.createLinearGradient(W * -0.07, 0, W * 1.08, 0);
        grd.addColorStop(0, `rgba(${P.edge},0)`);
        grd.addColorStop(0.16, `rgba(${P.edge},${(strength * 0.2).toFixed(3)})`);
        grd.addColorStop(0.42, `rgba(${P.core},${(strength * 0.55).toFixed(3)})`);
        grd.addColorStop(0.66, `rgba(${P.core},${strength.toFixed(3)})`);
        grd.addColorStop(0.87, `rgba(${P.edge},${(strength * 0.6).toFixed(3)})`);
        grd.addColorStop(1, `rgba(${P.edge},${(strength * 0.05).toFixed(3)})`);
        return grd;
      };

      const stroke = (off: number, strength: number, lw: number, blur: number, steps = 190): void => {
        g.beginPath();
        for (let i = 0; i <= steps; i += 1) {
          const pt = pointAt(i / steps, off);
          if (i === 0) g.moveTo(pt.x, pt.y);
          else g.lineTo(pt.x, pt.y);
        }
        g.strokeStyle = gradient(g, strength);
        g.lineWidth = Math.max(0.6, lw);
        g.shadowColor = `rgba(${P.core},.34)`;
        g.shadowBlur = blur;
        g.stroke();
      };

      // 金色尘雾
      g.shadowBlur = 0;
      for (let i = 0; i < 5; i += 1) {
        const p = 0.34 + i * 0.11;
        const pt = pointAt(p, 0);
        const rad = unit() * (0.2 + i * 0.045);
        const grd = g.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, rad);
        grd.addColorStop(0, `rgba(${P.halo},${(0.05 + i * 0.008).toFixed(3)})`);
        grd.addColorStop(1, `rgba(${P.halo},0)`);
        g.fillStyle = grd;
        g.fillRect(pt.x - rad, pt.y - rad, rad * 2, rad * 2);
      }

      const b = band();
      g.shadowColor = `rgba(${P.core},.34)`;
      stroke(-b * 0.92, 0.1, unit() * 0.0022, 22);
      stroke(b * 0.9, 0.09, unit() * 0.0022, 22);
      stroke(-b * 0.34, 0.28, unit() * 0.0018, 12);
      stroke(0, 0.5, unit() * 0.0014, 9);
      stroke(b * 0.4, 0.24, unit() * 0.0018, 12);
      stroke(-b * 0.1, 0.42, unit() * 0.0009, 6, 150);
      stroke(b * 0.16, 0.3, unit() * 0.0008, 6, 150);

      layer = c;
    };

    const drawGrains = (): void => {
      const b = band();
      ctx.globalCompositeOperation = P.comp;
      for (let i = 0; i < grains.length; i += 1) {
        const gr = grains[i];
        const fade = Math.pow(Math.sin(gr.p * Math.PI), 0.8);
        const twinkle = 0.72 + 0.28 * Math.sin(t * gr.tws * 2 + gr.tw);
        const alpha = fade * gr.a * twinkle;
        if (alpha <= 0.004) continue;
        const pt = pointAt(
          gr.p,
          gr.o * b * fade + Math.sin(t * 1.35 + gr.p * 8.5) * unit() * 0.003,
        );
        const rad = Math.max(0.35, gr.r * unit() * (gr.spark ? 1.7 : 1));
        ctx.fillStyle = `rgba(${P.core},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, rad, 0, Math.PI * 2);
        ctx.fill();
        if (gr.spark) {
          // 亮星：两圈同心弧代替 shadowBlur
          ctx.fillStyle = `rgba(${P.core},${(alpha * 0.22).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, rad * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const render = (): void => {
      if (W <= 0 || H <= 0) return;
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.globalCompositeOperation = P.comp;
      if (layer) {
        // 极缓漂移，让静止的丝带层仍有呼吸感
        const dx = Math.sin(elapsed * 0.00016) * W * 0.004;
        const dy = Math.cos(elapsed * 0.00021) * H * 0.006;
        ctx.drawImage(layer, dx, dy, W, H);
      }
      drawGrains();
      ctx.restore();
    };

    const tick = (now: number): void => {
      raf = requestAnimationFrame(tick);
      const delta = now - last;
      if (delta < STEP) return;
      last = now - (delta % STEP);
      elapsed += STEP;
      t += 0.012 * (STEP / 16.7);
      for (let i = 0; i < grains.length; i += 1) {
        const gr = grains[i];
        gr.p += gr.s * (STEP / 16.7);
        if (gr.p > 1) {
          gr.p = 0;
          gr.o = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
        }
      }
      render();
    };

    const resize = (): void => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width || host.clientWidth;
      H = rect.height || host.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildLayer();
      render();
    };

    const onResize = (): void => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 160);
    };

    const stop = (): void => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const start = (): void => {
      if (reduce || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = (): void => {
      if (document.hidden) stop();
      else start();
    };

    resize();
    window.addEventListener('resize', onResize);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(host);
    document.addEventListener('visibilitychange', onVisibility);

    const mo = new MutationObserver(() => {
      P = document.documentElement.classList.contains('dark') ? DARK : LIGHT;
      buildLayer();
      render();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    start();

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (ro) ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="gold-particle-ribbon" aria-hidden="true" />;
};
