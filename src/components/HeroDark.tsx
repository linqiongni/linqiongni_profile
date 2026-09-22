import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import portraitTransparent from '../assets/images/lin_qiongni_portrait_transparent.png';
import { DarkLuxuryBackground } from './DarkLuxuryBackground';

export const HeroDark: React.FC = () => {
  const portraitRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = portraitRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 7;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.012)`;
    };
    const reset = () => { el.style.transform = 'translate3d(0,0,0) scale(1)'; };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', reset);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('mouseleave', reset);
    };
  }, []);

  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero-section" className="luxury-hero relative min-h-screen overflow-hidden pt-24 md:pt-36">
      <DarkLuxuryBackground />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-7xl items-center gap-10 px-6 pb-10 sm:px-12 md:min-h-[calc(100vh-9rem)] lg:grid-cols-[1fr_.92fr]">
        <div className="pb-8 lg:pb-0">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.23em] text-[#C9A86A] sm:text-xs">
            <span className="h-px w-10 bg-[#C9A86A]" /> Corporate Legal · Retail · Business
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 }} className="font-serif text-4xl font-normal tracking-[.05em] text-[#F4EFE4] sm:text-5xl">{PERSONAL_INFO.name}</motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }} className="mt-2 text-sm tracking-[.28em] text-[#C9A86A]">QIONGNI LIN</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .14, duration: .8 }} className="mt-10 max-w-3xl text-balance font-serif text-[3.15rem] font-normal leading-[1.06] tracking-[-.04em] text-[#F4EFE4] sm:text-7xl lg:text-[5.15rem]">懂商业的<span className="text-[#D0AA62]">企业法务</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .22 }} className="mt-7 max-w-2xl text-base leading-8 text-[#B8C3CF] sm:text-lg">不只指出风险，更为业务找到可执行的路径。<br className="hidden sm:block" />以合同、合规与争议解决经验，支持复杂商业合作安全落地。</motion.p>
          <p className="mt-7 text-[10px] font-medium uppercase tracking-[.24em] text-[#C9A86A] sm:text-xs">Legal · Business · Growth</p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }} className="mt-10 flex flex-wrap gap-4">
            <button onClick={() => goTo('main-content-section')} className="luxury-btn luxury-btn-gold"><span>查看专业经历</span><ArrowRight size={15} /></button>
            <button onClick={() => goTo('main-content-section')} className="luxury-btn luxury-btn-outline"><span>阅读专业观点</span><ArrowRight size={15} /></button>
          </motion.div>
          <div className="mt-20 hidden max-w-sm border-t border-[#C9A86A]/65 pt-5 text-[9px] uppercase tracking-[.2em] text-[#728195] sm:block">Contract · Compliance · Dispute</div>
        </div>

        <motion.div initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .95, delay: .12 }} className="relative flex min-h-[520px] items-end justify-center lg:min-h-[720px]">
          <div className="portrait-halo" />
          <img ref={portraitRef} src={portraitTransparent} alt="职业肖像" className="luxury-portrait relative z-10 max-h-[78vh] w-auto max-w-full object-contain object-bottom" />
          <div className="absolute bottom-[7%] left-[8%] z-20 border-l border-[#C9A86A] pl-4"><p className="text-[9px] uppercase tracking-[.22em] text-[#D7BA7F]">Legal Counsel</p><p className="mt-2 text-xs text-[#CFD7DF]">合同 · 合规 · 争议解决</p></div>
        </motion.div>
      </div>
    </section>
  );
};
