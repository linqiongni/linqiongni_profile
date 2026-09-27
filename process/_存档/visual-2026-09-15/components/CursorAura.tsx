import React, { useEffect, useRef } from 'react';

/**
 * 鼠标跟随柔光：极大模糊、极低透明度的香槟金径向光晕，跟随光标缓慢流动。
 * 非涟漪、不晃，mix-blend 柔化，营造「低调奢华」的动态感。
 * 置于内容之下（z-[2]），只在透明背景区透出，不盖文字。尊重 prefers-reduced-motion。
 */
export const CursorAura: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[2] h-[460px] w-[460px] rounded-full opacity-60 blur-[28px] mix-blend-soft-light dark:opacity-90 dark:mix-blend-screen"
      style={{
        background:
          'radial-gradient(circle, rgba(184,159,107,0.18) 0%, rgba(184,159,107,0.06) 35%, transparent 62%)',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    />
  );
};
