import React, { useEffect, useRef } from 'react';

interface WaterRippleBackgroundProps {
  darkMode: boolean;
}

/**
 * 全屏水面波纹背景层（高度场波动方程模拟）
 * - 鼠标 / 手指移动时在光标处注入扰动，形成涟漪尾迹
 * - 静置时随机位置产生微弱水波，避免画面完全静止
 * - pointer-events: none，不影响任何交互；以 soft-light 叠加，不遮挡文字
 */
export const WaterRippleBackground: React.FC<WaterRippleBackgroundProps> = ({
  darkMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const darkRef = useRef(darkMode);
  darkRef.current = darkMode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // 尊重系统「减少动态效果」偏好
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // ---- 模拟参数（整体走克制路线：大格子 = 更柔，低增益 = 更淡）----
    const CELL = 14; // 每个模拟格代表的 CSS 像素（越大波纹越柔和）
    const DAMPING = 0.988; // 阻尼，越小衰减越快
    const POINTER_STRENGTH = 0.5; // 鼠标注入强度
    const POINTER_RADIUS = 4; // 鼠标注入半径（格）
    const POINTER_MIN_DIST = 2.6; // 移动超过多少格才补一滴（避免连续糊成一片）
    const POINTER_MIN_INTERVAL = 110; // 毫秒，注入节流
    const AMBIENT_STRENGTH = 0.2; // 环境水波强度
    const AMBIENT_RADIUS = 7;
    const AMBIENT_INTERVAL = 3.4; // 秒
    const LIGHT_GAIN = 1.0; // 梯度 -> 明暗
    const MAX_ALPHA = 0.16; // 单层最大不透明度

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let curr = new Float32Array(0);
    let prev = new Float32Array(0);
    let grid: HTMLCanvasElement | null = null;
    let gridCtx: CanvasRenderingContext2D | null = null;
    let imgData: ImageData | null = null;
    let buf32: Uint32Array | null = null;

    let raf = 0;
    let lastTime = 0;
    let ambientAcc = 0;
    let hasPointer = false;
    let lastDropAt = 0;
    let lastGx = -1;
    let lastGy = -1;
    let running = true;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      cols = Math.max(8, Math.ceil(width / CELL));
      rows = Math.max(8, Math.ceil(height / CELL));

      curr = new Float32Array(cols * rows);
      prev = new Float32Array(cols * rows);

      if (!grid) {
        grid = document.createElement('canvas');
        gridCtx = grid.getContext('2d', { alpha: true });
      }
      grid.width = cols;
      grid.height = rows;
      imgData = gridCtx!.createImageData(cols, rows);
      buf32 = new Uint32Array(imgData.data.buffer);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };

    /** 在网格坐标注入一滴扰动 */
    const drop = (gx: number, gy: number, strength: number, radius: number) => {
      const cx = Math.round(gx);
      const cy = Math.round(gy);
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const x = cx + dx;
          const y = cy + dy;
          if (x < 1 || y < 1 || x >= cols - 1 || y >= rows - 1) continue;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > radius) continue;
          const falloff = 1 - d / (radius + 1);
          const i = y * cols + x;
          // 限幅，防止反复划动时能量叠加失控
          const next = curr[i] + strength * falloff;
          curr[i] = next > 1.2 ? 1.2 : next < -1.2 ? -1.2 : next;
        }
      }
    };

    /** 推进一帧波动方程 */
    const step = () => {
      for (let y = 1; y < rows - 1; y++) {
        const row = y * cols;
        for (let x = 1; x < cols - 1; x++) {
          const i = row + x;
          const v =
            (curr[i - 1] + curr[i + 1] + curr[i - cols] + curr[i + cols]) * 0.5 -
            prev[i];
          prev[i] = v * DAMPING;
        }
      }
      const t = curr;
      curr = prev;
      prev = t;
    };

    /** 把高度场渲染成明暗水光 */
    const render = () => {
      if (!gridCtx || !imgData || !buf32) return;
      const isDark = darkRef.current;
      // soft-light 下 128 为中性，高于则提亮、低于则压暗
      const warmR = isDark ? 16 : 14; // 高光偏暖（香槟金）
      const warmG = isDark ? 10 : 8;
      const warmB = isDark ? -18 : -20;

      buf32.fill(0); // 边缘像素保持透明
      for (let y = 1; y < rows - 1; y++) {
        const row = y * cols;
        for (let x = 1; x < cols - 1; x++) {
          const i = row + x;
          const dx = curr[i + 1] - curr[i - 1];
          const dy = curr[i + cols] - curr[i - cols];
          let v = (dx + dy) * LIGHT_GAIN;
          if (v > 1) v = 1;
          else if (v < -1) v = -1;
          const mag = v < 0 ? -v : v;
          if (mag < 0.012) continue;

          const alpha = (mag > MAX_ALPHA ? MAX_ALPHA : mag) * 255;
          const base = 128 + v * 127;
          const r = base + warmR * (v > 0 ? 1 : -0.4);
          const g = base + warmG * (v > 0 ? 1 : -0.4);
          const b = base + warmB * (v > 0 ? 1 : -0.4);

          buf32[i] =
            ((alpha & 0xff) << 24) |
            (((b < 0 ? 0 : b > 255 ? 255 : b) | 0) << 16) |
            (((g < 0 ? 0 : g > 255 ? 255 : g) | 0) << 8) |
            ((r < 0 ? 0 : r > 255 ? 255 : r) | 0);
        }
      }
      gridCtx.putImageData(imgData, 0, 0);

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(grid!, 0, 0, cols, rows, 0, 0, width, height);
    };

    const loop = (time: number) => {
      if (!running) return;
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0.016;
      lastTime = time;

      // 静置时随机环境水波
      ambientAcc += dt;
      if (ambientAcc >= AMBIENT_INTERVAL) {
        ambientAcc = 0;
        drop(
          Math.random() * (cols - 2) + 1,
          Math.random() * (rows - 2) + 1,
          (Math.random() * 0.6 + 0.7) * AMBIENT_STRENGTH,
          AMBIENT_RADIUS
        );
      }

      step();
      render();
      raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      const gx = (e.clientX / window.innerWidth) * cols;
      const gy = (e.clientY / window.innerHeight) * rows;

      const now = performance.now();
      const dist = hasPointer ? Math.hypot(gx - lastGx, gy - lastGy) : Infinity;

      // 只在「移动够远 且 距上次注入够久」时落一滴，避免拖出连续乱纹
      if (dist >= POINTER_MIN_DIST && now - lastDropAt >= POINTER_MIN_INTERVAL) {
        drop(gx, gy, POINTER_STRENGTH, POINTER_RADIUS);
        lastDropAt = now;
        lastGx = gx;
        lastGy = gy;
        hasPointer = true;
      } else if (!hasPointer) {
        drop(gx, gy, POINTER_STRENGTH, POINTER_RADIUS);
        lastDropAt = now;
        lastGx = gx;
        lastGy = gy;
        hasPointer = true;
      }
    };

    const onPointerLeave = () => {
      hasPointer = false;
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        lastTime = 0;
        raf = requestAnimationFrame(loop);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[45] select-none"
      style={{ mixBlendMode: 'soft-light' }}
    />
  );
};
