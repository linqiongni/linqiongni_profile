import React, { useEffect, useRef } from 'react';
import './aquatic-luxury-background.css';

type Fish = {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
  direction: 1 | -1;
  phase: number;
  depth: number;
  tone: 'gold' | 'silver' | 'blue';
};

type Ripple = { x: number; y: number; radius: number; life: number; strength: number };

type Palette = {
  /** 鱼身渐变（前段 → 中段 → 尾段） */
  body: [string, string, string, string];
  /** 鱼眼高光 */
  eye: string;
  /** 涟漪外圈 / 亮圈 / 内圈 */
  ripple: [string, string, string];
  /** 涟漪混合模式：screen 在亮底会消失，浅色档必须 source-over */
  comp: GlobalCompositeOperation;
  /** 整体亮度系数（站点是深浅双模式） */
  gain: number;
};

const DARK_PALETTE: Palette = {
  body: [
    'rgba(87,108,128,.25)',
    'rgba(164,151,122,.76)',
    'rgba(208,175,108,.62)',
    'rgba(96,122,147,.18)',
  ],
  eye: 'rgba(235,210,156,.9)',
  ripple: ['rgba(110,145,178,', 'rgba(218,188,127,', 'rgba(102,139,173,'],
  comp: 'screen',
  gain: 1,
};

/** 浅色档：深墨金/墨蓝的"水下剪影"落在米白底上，仍保持层次但压得住 */
const LIGHT_PALETTE: Palette = {
  body: [
    'rgba(58,74,92,.20)',
    'rgba(96,104,116,.52)',
    'rgba(150,116,58,.44)',
    'rgba(70,88,108,.14)',
  ],
  eye: 'rgba(120,96,48,.55)',
  ripple: ['rgba(140,150,164,', 'rgba(176,140,70,', 'rgba(150,160,172,'],
  comp: 'source-over',
  gain: 0.82,
};

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
  const fishCanvasRef = useRef<HTMLCanvasElement>(null);
  const rippleCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fishCanvas = fishCanvasRef.current;
    const rippleCanvas = rippleCanvasRef.current;
    if (!fishCanvas || !rippleCanvas) return;
    const fishCtx = fishCanvas.getContext('2d');
    const rippleCtx = rippleCanvas.getContext('2d');
    if (!fishCtx || !rippleCtx) return;

    const P: Palette = darkMode ? DARK_PALETTE : LIGHT_PALETTE;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const total = mobile ? Math.min(3, fishCount) : fishCount;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let previous = performance.now();
    let lastPointerAt = 0;
    let lastAmbientAt = 0;
    const mouse = { x: -9999, y: -9999 };
    const ripples: Ripple[] = [];
    const tones: Fish['tone'][] = ['gold', 'blue', 'silver'];

    const fish: Fish[] = Array.from({ length: total }, (_, index) => ({
      x: index % 2 === 0 ? -0.12 + index * 0.17 : 1.12 - index * 0.13,
      y: 0.51 + (index % 4) * 0.09,
      size: mobile ? 20 + (index % 3) * 7 : 23 + (index % 4) * 10,
      speed: 0.000012 + (index % 4) * 0.000003,
      alpha: (0.16 + (index % 3) * 0.045) * P.gain,
      direction: index % 2 === 0 ? 1 : -1,
      phase: index * 1.37,
      depth: 0.48 + (index % 4) * 0.12,
      tone: tones[index % tones.length],
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const canvas of [fishCanvas, rippleCanvas]) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
      fishCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rippleCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const addRipple = (x: number, y: number, strength = 0.56) => {
      if (ripples.length > 18) ripples.shift();
      ripples.push({ x, y, radius: 5, life: 1, strength });
    };

    const drawFish = (item: Fish, time: number) => {
      let x = item.x * width;
      let y = item.y * height + Math.sin(time * 0.00032 + item.phase) * 20 * item.depth;
      const dx = mouse.x - x;
      const dy = mouse.y - y;
      // 鼠标靠近时鱼轻微偏离（克制：只在 170px 内、位移很小）
      if (Math.hypot(dx, dy) < 170) {
        x -= dx * 0.032;
        y -= dy * 0.045;
      }

      const swim = Math.sin(time * 0.0032 + item.phase);
      const bend = swim * item.size * 0.1;
      fishCtx.save();
      fishCtx.translate(x, y);
      if (item.direction < 0) fishCtx.scale(-1, 1);
      fishCtx.rotate(Math.sin(time * 0.00055 + item.phase) * 0.035);
      fishCtx.scale(1, 0.72);
      fishCtx.globalAlpha = item.alpha;
      // 深度越浅 → 越模糊（水下层次），明暗由 alpha 控制
      fishCtx.filter = `blur(${(1 - item.depth) * 2.1}px) drop-shadow(0 4px 8px rgba(0,0,0,.22))`;

      const gradient = fishCtx.createLinearGradient(-item.size, 0, item.size, 0);
      gradient.addColorStop(0, P.body[0]);
      gradient.addColorStop(0.42, P.body[1]);
      gradient.addColorStop(0.72, P.body[2]);
      gradient.addColorStop(1, P.body[3]);
      fishCtx.fillStyle = gradient;

      // 流线型鱼身
      fishCtx.beginPath();
      fishCtx.moveTo(-item.size * 0.72, bend * 0.18);
      fishCtx.bezierCurveTo(
        -item.size * 0.42, -item.size * 0.34,
        item.size * 0.34, -item.size * 0.3,
        item.size * 0.8, -item.size * 0.05,
      );
      fishCtx.quadraticCurveTo(item.size * 0.95, 0, item.size * 0.8, item.size * 0.07);
      fishCtx.bezierCurveTo(
        item.size * 0.34, item.size * 0.3,
        -item.size * 0.42, item.size * 0.34,
        -item.size * 0.72, bend * 0.18,
      );
      fishCtx.closePath();
      fishCtx.fill();

      // 独立摆动的尾鳍
      fishCtx.save();
      fishCtx.translate(-item.size * 0.68, bend * 0.18);
      fishCtx.rotate(swim * 0.24);
      fishCtx.beginPath();
      fishCtx.moveTo(0, 0);
      fishCtx.bezierCurveTo(
        -item.size * 0.3, -item.size * 0.08,
        -item.size * 0.62, -item.size * 0.42,
        -item.size * 0.78, -item.size * 0.32,
      );
      fishCtx.quadraticCurveTo(-item.size * 0.55, 0, -item.size * 0.78, item.size * 0.32);
      fishCtx.bezierCurveTo(
        -item.size * 0.62, item.size * 0.42,
        -item.size * 0.3, item.size * 0.08,
        0, 0,
      );
      fishCtx.fill();
      fishCtx.restore();

      // 背鳍 + 腹鳍
      fishCtx.globalAlpha = item.alpha * 0.72;
      fishCtx.beginPath();
      fishCtx.moveTo(-item.size * 0.1, -item.size * 0.25);
      fishCtx.quadraticCurveTo(item.size * 0.05, -item.size * 0.52, item.size * 0.28, -item.size * 0.22);
      fishCtx.closePath();
      fishCtx.fill();
      fishCtx.beginPath();
      fishCtx.moveTo(item.size * 0.12, item.size * 0.2);
      fishCtx.quadraticCurveTo(item.size * 0.28, item.size * 0.43, item.size * 0.4, item.size * 0.14);
      fishCtx.closePath();
      fishCtx.fill();

      // 鱼眼
      fishCtx.globalAlpha = Math.min(0.42, item.alpha * 1.5);
      fishCtx.fillStyle = P.eye;
      fishCtx.beginPath();
      fishCtx.arc(item.size * 0.68, -item.size * 0.055, Math.max(1.15, item.size * 0.032), 0, Math.PI * 2);
      fishCtx.fill();
      fishCtx.restore();
    };

    const drawRipple = (ripple: Ripple) => {
      rippleCtx.save();
      rippleCtx.translate(ripple.x, ripple.y);
      rippleCtx.scale(1, 0.36); // 椭圆 = 俯视水面的透视
      rippleCtx.globalCompositeOperation = P.comp;
      for (let index = 0; index < 4; index += 1) {
        const radius = ripple.radius + index * 13;
        const alpha = ripple.life * ripple.strength * (1 - index / 4.8);
        const gradient = rippleCtx.createLinearGradient(-radius, 0, radius, 0);
        gradient.addColorStop(0, `${P.ripple[0]}0)`);
        gradient.addColorStop(0.28, `${P.ripple[0]}${(alpha * 0.22).toFixed(3)})`);
        gradient.addColorStop(0.56, `${P.ripple[1]}${(alpha * 0.48).toFixed(3)})`);
        gradient.addColorStop(0.82, `${P.ripple[2]}${(alpha * 0.18).toFixed(3)})`);
        gradient.addColorStop(1, `${P.ripple[0]}0)`);
        rippleCtx.beginPath();
        rippleCtx.ellipse(0, 0, radius, radius, 0, 0, Math.PI * 2);
        rippleCtx.strokeStyle = gradient;
        rippleCtx.lineWidth = index === 0 ? 1.25 : 0.72;
        rippleCtx.shadowColor = 'rgba(201,168,106,.25)';
        rippleCtx.shadowBlur = index === 0 ? 7 : 3;
        rippleCtx.stroke();
      }
      rippleCtx.restore();
    };

    const onPointerMove = (event: PointerEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      const now = performance.now();
      if (now - lastPointerAt > 170) {
        lastPointerAt = now;
        addRipple(event.clientX, event.clientY);
      }
    };
    const onPointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        previous = performance.now();
        raf = requestAnimationFrame(animate);
      }
    };

    const animate = (time: number) => {
      const delta = Math.min(40, time - previous);
      previous = time;
      fishCtx.clearRect(0, 0, width, height);
      if (!reduceMotion) {
        for (const item of fish) {
          item.x += item.speed * delta * item.direction;
          if (item.direction > 0 && item.x > 1.18) item.x = -0.18;
          if (item.direction < 0 && item.x < -0.18) item.x = 1.18;
        }
      }
      [...fish].sort((a, b) => a.depth - b.depth).forEach((item) => drawFish(item, time));

      rippleCtx.clearRect(0, 0, width, height);
      if (!reduceMotion && time - lastAmbientAt > 4400) {
        lastAmbientAt = time;
        addRipple(width * (0.56 + Math.random() * 0.3), height * (0.46 + Math.random() * 0.26), 0.23);
      }
      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        const ripple = ripples[index];
        drawRipple(ripple);
        ripple.radius += reduceMotion ? 0 : 0.62;
        ripple.life -= reduceMotion ? 0.02 : 0.0065;
        if (ripple.life <= 0) ripples.splice(index, 1);
      }
      raf = requestAnimationFrame(animate);
    };

    resize();
    addRipple(window.innerWidth * 0.72, window.innerHeight * 0.58, 0.27);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('mouseleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [fishCount, darkMode]);

  return (
    <div className={`aquatic-luxury-background ${className}`} aria-hidden="true">
      <div className="aquatic-luxury-gradient" />
      <div className="aquatic-luxury-grain" />
      <div className="aquatic-luxury-water" />
      <canvas ref={fishCanvasRef} className="aquatic-luxury-fish" />
      <canvas ref={rippleCanvasRef} className="aquatic-luxury-ripples" />
    </div>
  );
};
