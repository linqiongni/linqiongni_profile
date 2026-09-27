import React, { useEffect, useRef } from 'react';

interface DarkLuxuryBackgroundProps {
  /**
   * false（默认）：Hero 内 absolute 版，铺满最近定位父级。
   * true：App 根部 fixed 全屏版 —— 「关于我」同款深海军蓝背景铺到全站所有 tab。
   */
  global?: boolean;
}

export const DarkLuxuryBackground: React.FC<DarkLuxuryBackgroundProps> = ({ global = false }) => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (e: PointerEvent) => {
      // 光晕尺寸 360px（见 index.css .dark-luxury-pointer），偏移半径 180 使其居中于光标
      glow.style.transform = `translate3d(${e.clientX - 180}px, ${e.clientY - 180}px, 0)`;
      glow.style.opacity = '1';
    };
    const leave = () => { glow.style.opacity = '0'; };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <div
      className={`dark-luxury-bg${global ? ' dark-luxury-bg--global' : ''}`}
      aria-hidden="true"
    >
      <div className="dark-luxury-noise" />
      <div className="dark-luxury-orbit" />
      <div className="dark-luxury-flow flow-one" />
      <div className="dark-luxury-flow flow-two" />
      <div ref={glowRef} className="dark-luxury-pointer" />
    </div>
  );
};
