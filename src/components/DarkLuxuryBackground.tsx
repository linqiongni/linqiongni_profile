import React, { useEffect, useRef } from 'react';

export const DarkLuxuryBackground: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (e: PointerEvent) => {
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
    <div className="dark-luxury-bg" aria-hidden="true">
      <div className="dark-luxury-noise" />
      <div className="dark-luxury-orbit" />
      <div className="dark-luxury-flow flow-one" />
      <div className="dark-luxury-flow flow-two" />
      <div ref={glowRef} className="dark-luxury-pointer" />
    </div>
  );
};
