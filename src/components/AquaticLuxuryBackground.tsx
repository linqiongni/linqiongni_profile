import React, { useEffect, useRef } from 'react';
import './aquatic-luxury-background.css';

/**
 * 水下鱼影 + 鼠标涟漪 —— 全站背景层（**纯效果层，不铺底色**）
 *
 * 颜色决策（2026-09-23）：这一层原先自带深海军蓝渐变，把主页原本的底色盖掉了。
 * 现在不再画任何底色，页面底色完全由站点自身提供（深 #2C2C2E / 浅 #E8E8E6），
 * 这里只负责：深度晕影 + 水面细纹 + 鱼影 + 涟漪。
 *
 * 性能（之前卡顿的主因）：
 * - 每帧不再调用 ctx.filter(blur) / shadowBlur（canvas 最贵的两类操作）。
 *   改为**预渲染鱼精灵**：每条鱼按 8 个摆尾相位各生成一张离屏图，之后每帧只剩 drawImage。
 * - 双 canvas 合成 → 单 canvas；DPR 封顶 1.5；帧率封顶 30fps；resize 去抖。
 * - 切后台暂停 rAF；prefers-reduced-motion 只画静态一帧。
 */

type Fish = {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
  direction: 1 | -1;
  phase: number;
  depth: number;
  tone: number;
};

type Ripple = { x: number; y: number; r: number; life: number; s: number };

type Sprite = { img: HTMLCanvasElement; w: number; h: number };

const PHASES = 8;
const MAX_RIPPLES = 12;
const TARGET_FPS = 30;
const STEP = 1000 / TARGET_FPS;

const TONES: string[][] = [
  ['rgba(46,62,80,.16)', 'rgba(88,98,110,.52)', 'rgba(158,124,62,.46)', 'rgba(58,74,92,.12)'],
  ['rgba(40,58,76,.15)', 'rgba(78,96,112,.50)', 'rgba(132,114,70,.42)', 'rgba(52,70,88,.10)'],
  ['rgba(50,66,84,.14)', 'rgba(96,110,124,.48)', 'rgba(164,132,70,.40)', 'rgba(60,78,96,.10)'],
];

const EYE = 'rgba(226,201,148,.9)';

/** 把一条鱼在某个摆尾相位下画进 ctx（原点 = 鱼体中心，已含纵向压扁） */
function paintFish(
  ctx: CanvasRenderingContext2D,
  size: number,
  tone: string[],
  bend: number,
  tailRot: number,
): void {
  const grad = ctx.createLinearGradient(-size, 0, size, 0);
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

/** 预渲染一条鱼的 8 个摆尾相位（blur 只在这里算一次） */
function buildSprites(size: number, depth: number, tone: string[], dpr: number): Sprite[] {
  const blur = (1 - depth) * 2.1;
  const padW = size * 2.2 + blur * 8;
  const padH = size * 1.3 + blur * 8;
  const out: Sprite[] = [];
  for (let i = 0; i < PHASES; i += 1) {
    const swim = Math.sin((i / PHASES) * Math.PI * 2);
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(padW * dpr));
    c.height = Math.max(1, Math.ceil(padH * dpr));
    const g = c.getContext('2d');
    if (!g) break;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.translate(padW / 2, padH / 2);
    g.scale(1, 0.72);
    if (blur > 0.05) g.filter = `blur(${blur}px)`;
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

export interface AquaticLuxuryBackgroundProps {
  fishCount?: number;
  className?: string;
  darkMode?: boolean;
}

export const AquaticLuxuryBackground: React.FC<AquaticLuxuryBackgroundProps> = ({
  fishCount = 6,
  className = '',
  darkMode = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const total = mobile ? Math.min(3, fishCount) : fishCount;
    const gain = darkMode ? 1 : 0.8;

    let width = 0;
    let height = 0;
    let dprUsed = 1;
    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let lastPointerAt = 0;
    let lastAmbientAt = 0;
    let resizeTimer = 0;
    let sprites: Sprite[][] = [];

    const mouse = { x: -9999, y: -9999 };
    const ripples: Ripple[] = [];

    const fish: Fish[] = Array.from({ length: total }, (_, index) => ({
      x: index % 2 === 0 ? -0.12 + index * 0.17 : 1.12 - index * 0.13,
      y: 0.51 + (index % 4) * 0.09,
      size: mobile ? 20 + (index % 3) * 7 : 23 + (index % 4) * 10,
      speed: 0.000012 + (index % 4) * 0.000003,
      alpha: (0.18 + (index % 3) * 0.05) * gain,
      direction: index % 2 === 0 ? 1 : -1,
      phase: index * 1.37,
      depth: 0.48 + (index % 4) * 0.12,
      tone: index % TONES.length,
    }));

    const resize = (): void => {
      width = window.innerWidth;
      height = window.innerHeight;
      dprUsed = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(width * dprUsed));
      canvas.height = Math.max(1, Math.floor(height * dprUsed));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dprUsed, 0, 0, dprUsed, 0, 0);
      sprites = fish.map((f) => buildSprites(f.size, f.depth, TONES[f.tone], Math.min(dprUsed, 1.5)));
    };

    const addRipple = (x: number, y: number, s = 0.52): void => {
      if (ripples.length >= MAX_RIPPLES) ripples.shift();
      ripples.push({ x, y, r: 5, life: 1, s });
    };

    const drawRipple = (ripple: Ripple): void => {
      const base = ripple.life * ripple.s;
      if (base <= 0.004) return;
      const R = ripple.r + 26;
      ctx.save();
      ctx.translate(ripple.x, ripple.y);
      ctx.scale(1, 0.36); // 俯视水面的透视
      const grad = ctx.createLinearGradient(-R, 0, R, 0);
      grad.addColorStop(0, 'rgba(150,170,196,0)');
      grad.addColorStop(0.3, 'rgba(150,170,196,.55)');
      grad.addColorStop(0.58, 'rgba(214,182,122,1)');
      grad.addColorStop(1, 'rgba(150,170,196,0)');
      ctx.strokeStyle = grad;
      for (let i = 0; i < 3; i += 1) {
        ctx.globalAlpha = base * (1 - i / 3.4) * (darkMode ? 0.5 : 0.4);
        ctx.beginPath();
        ctx.ellipse(0, 0, ripple.r + i * 12, ripple.r + i * 12, 0, 0, Math.PI * 2);
        ctx.lineWidth = i === 0 ? 1.2 : 0.7;
        ctx.stroke();
      }
      ctx.restore();
    };

    const render = (time: number): void => {
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < ripples.length; i += 1) drawRipple(ripples[i]);

      const order = [...fish].sort((a, b) => a.depth - b.depth);
      for (let k = 0; k < order.length; k += 1) {
        const f = order[k];
        const frames = sprites[fish.indexOf(f)];
        if (!frames || !frames.length) continue;
        let x = f.x * width;
        let y = f.y * height + Math.sin(time * 0.00032 + f.phase) * 20 * f.depth;
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        if (dx * dx + dy * dy < 28900) {
          x -= dx * 0.032;
          y -= dy * 0.045;
        }
        const idx = Math.floor(((time * 0.0032 + f.phase) / (Math.PI * 2)) * PHASES) % PHASES;
        const sp = frames[(idx + PHASES) % PHASES];
        ctx.save();
        ctx.globalAlpha = f.alpha;
        ctx.translate(x, y);
        ctx.rotate(Math.sin(time * 0.00055 + f.phase) * 0.035);
        if (f.direction < 0) ctx.scale(-1, 1);
        ctx.drawImage(sp.img, -sp.w / 2, -sp.h / 2, sp.w, sp.h);
        ctx.restore();
      }
    };

    const step = (): void => {
      if (!reduce) {
        for (let i = 0; i < fish.length; i += 1) {
          const f = fish[i];
          f.x += f.speed * STEP * f.direction;
          if (f.direction > 0 && f.x > 1.18) f.x = -0.18;
          if (f.direction < 0 && f.x < -0.18) f.x = 1.18;
        }
        if (elapsed - lastAmbientAt > 4400) {
          lastAmbientAt = elapsed;
          addRipple(width * (0.56 + Math.random() * 0.3), height * (0.46 + Math.random() * 0.26), 0.22);
        }
        for (let i = ripples.length - 1; i >= 0; i -= 1) {
          ripples[i].r += 1.1;
          ripples[i].life -= 0.0116;
          if (ripples[i].life <= 0) ripples.splice(i, 1);
        }
      }
      render(elapsed);
    };

    const tick = (now: number): void => {
      raf = requestAnimationFrame(tick);
      const delta = now - last;
      if (delta < STEP) return;
      last = now - (delta % STEP);
      elapsed += STEP;
      step();
    };

    const onPointerMove = (event: PointerEvent): void => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      const now = performance.now();
      if (now - lastPointerAt > 190) {
        lastPointerAt = now;
        addRipple(event.clientX, event.clientY);
        if (reduce) render(elapsed);
      }
    };

    const onPointerLeave = (): void => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onResize = (): void => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        render(elapsed);
      }, 160);
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
    addRipple(window.innerWidth * 0.72, window.innerHeight * 0.58, 0.26);
    render(0);
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('mouseleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [fishCount, darkMode]);

  return (
    <div className={`aquatic-luxury-background ${className}`} aria-hidden="true">
      <div className="aquatic-luxury-vignette" />
      <div className="aquatic-luxury-grain" />
      <div className="aquatic-luxury-water" />
      <canvas ref={canvasRef} className="aquatic-luxury-scene" />
    </div>
  );
};
