import { useEffect, useRef } from 'react';

/**
 * 主页首屏的金色粒子丝带（斜贯整屏，亮部落在右上）。
 *
 * 设计约束：
 * - 位置/形态：画布铺满整个 hero，丝带自左下斜向右上，中段收束、两端渐隐；
 *   亮度峰值落在画布横向约 2/3 处（设计稿里最亮的那一段）。
 * - 不抢正文：CSS 侧 pointer-events:none + 左侧 mask 渐隐，正文永远压在最上层。
 * - 深浅双档：深底用 screen（金色变加色光），浅底用 source-over + 暖金（screen 在亮底会消失）。
 * - 性能：DPR ≤ 2、粒子数封顶、页面切后台暂停 rAF、尺寸变化用 ResizeObserver。
 * - prefers-reduced-motion：只画一帧静态丝带，不起动画循环。
 */

type Palette = {
  comp: GlobalCompositeOperation;
  core: string;
  edge: string;
  halo: string;
  shadow: string;
};

const DARK: Palette = {
  comp: 'screen',
  core: '248,222,164',
  edge: '201,168,106',
  halo: '211,175,103',
  shadow: 'rgba(211,175,103,.42)',
};

const LIGHT: Palette = {
  comp: 'source-over',
  core: '176,146,86',
  edge: '184,159,107',
  halo: '184,159,107',
  shadow: 'rgba(184,159,107,.22)',
};

type Grain = {
  p: number;      // 沿丝带的进度 0..1
  o: number;      // 横向偏移 -1..1
  r: number;      // 半径（相对短边）
  s: number;      // 前进速度
  a: number;      // 基础不透明度
  tw: number;     // 闪烁相位
  tws: number;    // 闪烁频率
  spark: boolean; // 亮星
};

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

    const COUNT = mobile ? 140 : 340;
    const BAND = mobile ? 0.052 : 0.078; // 丝带半宽（相对画布短边）

    let W = 0;
    let H = 0;
    let t = 0;
    let raf = 0;
    let P: Palette = document.documentElement.classList.contains('dark') ? DARK : LIGHT;

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const grains: Grain[] = Array.from({ length: COUNT }, () => ({
      p: (Math.random() + Math.random()) / 2, // 三角分布：中段更密
      o: (Math.random() + Math.random() + Math.random() - 1.5) / 1.5, // 近似正态
      r: rnd(0.00055, 0.0021),
      s: rnd(0.00012, 0.00048),
      a: rnd(0.12, 0.58),
      tw: rnd(0, Math.PI * 2),
      tws: rnd(0.5, 1.9),
      spark: Math.random() < 0.05,
    }));

    const unit = () => Math.min(W, H) || 1;
    const band = () => unit() * BAND;

    /** 丝带中心线：自左下 (-7%, 88%) 斜向右上 (108%, 13%)，带轻微 S 起伏。 */
    const pointAt = (p: number, off = 0) => {
      const x = W * (-0.07 + p * 1.15);
      const y =
        H * (0.92 - p * 0.82) +
        Math.sin(p * Math.PI * 1.05 - 0.42) * H * 0.11 +
        Math.sin(p * Math.PI * 3.6 + t * 0.16) * H * 0.016 +
        off;
      return { x, y };
    };

    const gradient = (strength: number) => {
      const g = ctx.createLinearGradient(W * -0.07, 0, W * 1.08, 0);
      g.addColorStop(0, `rgba(${P.edge},0)`);
      g.addColorStop(0.16, `rgba(${P.edge},${(strength * 0.2).toFixed(3)})`);
      g.addColorStop(0.42, `rgba(${P.core},${(strength * 0.55).toFixed(3)})`);
      g.addColorStop(0.66, `rgba(${P.core},${strength.toFixed(3)})`);
      g.addColorStop(0.87, `rgba(${P.edge},${(strength * 0.6).toFixed(3)})`);
      g.addColorStop(1, `rgba(${P.edge},${(strength * 0.05).toFixed(3)})`);
      return g;
    };

    const stroke = (off: number, strength: number, lw: number, blur: number, steps = 190) => {
      ctx.beginPath();
      for (let i = 0; i <= steps; i += 1) {
        const pt = pointAt(i / steps, off);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = gradient(strength);
      ctx.lineWidth = Math.max(0.6, lw);
      ctx.shadowColor = P.shadow;
      ctx.shadowBlur = blur;
      ctx.stroke();
    };

    /** 丝带中段的金色尘雾（radial gradient，不用 ctx.filter，避免掉帧） */
    const haze = () => {
      ctx.shadowBlur = 0;
      for (let i = 0; i < 5; i += 1) {
        const p = 0.34 + i * 0.11;
        const pt = pointAt(p, 0);
        const rad = unit() * (0.2 + i * 0.045);
        const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, rad);
        g.addColorStop(0, `rgba(${P.halo},${(0.05 + i * 0.008).toFixed(3)})`);
        g.addColorStop(1, `rgba(${P.halo},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(pt.x - rad, pt.y - rad, rad * 2, rad * 2);
      }
    };

    const drawRibbon = () => {
      const b = band();
      ctx.shadowColor = P.shadow;
      // 外侧柔光（宽而淡）
      stroke(-b * 0.92, 0.1, unit() * 0.0022, 22);
      stroke(b * 0.9, 0.09, unit() * 0.0022, 22);
      // 主体三股
      ctx.shadowBlur = 12;
      stroke(-b * 0.34, 0.28, unit() * 0.0018, 12);
      stroke(0, 0.5, unit() * 0.0014, 9);
      stroke(b * 0.4, 0.24, unit() * 0.0018, 12);
      // 内芯亮线
      ctx.shadowBlur = 6;
      stroke(-b * 0.1, 0.42, unit() * 0.0009, 6, 150);
      stroke(b * 0.16, 0.3, unit() * 0.0008, 6, 150);
    };

    const drawGrains = () => {
      const b = band();
      ctx.shadowBlur = 0;
      grains.forEach((g) => {
        const pt = pointAt(
          g.p,
          g.o * b * Math.pow(Math.sin(g.p * Math.PI), 0.8) +
            Math.sin(t * 1.35 + g.p * 8.5) * unit() * 0.003,
        );
        const fade = Math.pow(Math.sin(g.p * Math.PI), 0.8);
        const twinkle = 0.72 + 0.28 * Math.sin(t * g.tws * 2 + g.tw);
        const alpha = fade * g.a * twinkle;
        if (alpha <= 0.004) return;
        const rad = Math.max(0.35, g.r * unit() * (g.spark ? 1.7 : 1));
        if (g.spark) {
          ctx.shadowColor = P.shadow;
          ctx.shadowBlur = 9;
        }
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${P.core},${alpha.toFixed(3)})`;
        ctx.fill();
        if (g.spark) ctx.shadowBlur = 0;
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      if (W <= 0 || H <= 0) return;
      ctx.save();
      ctx.globalCompositeOperation = P.comp;
      haze();
      drawRibbon();
      drawGrains();
      ctx.restore();
    };

    const loop = () => {
      t += 0.012;
      grains.forEach((g) => {
        g.p += g.s;
        if (g.p > 1) {
          g.p = 0;
          g.o = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
        }
      });
      render();
      raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width || host.clientWidth;
      H = rect.height || host.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    };

    const start = () => {
      if (reduce || raf) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    resize();
    window.addEventListener('resize', resize);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(host);
    document.addEventListener('visibilitychange', onVisibility);

    // 主题切换实时换色（站点是 light/dark 双模式）
    const mo = new MutationObserver(() => {
      P = document.documentElement.classList.contains('dark') ? DARK : LIGHT;
      render();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    start();

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (ro) ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="gold-particle-ribbon" aria-hidden="true" />;
};
