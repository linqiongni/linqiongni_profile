import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { DarkLuxuryBackground } from './DarkLuxuryBackground';
import { WaterRippleBackdrop } from './WaterRippleBackdrop';
import { GoldParticleRibbon } from './GoldParticleRibbon';

/** 深海军蓝豪华风首屏（无人物肖像，纯文字排版） */
export const HeroDark: React.FC = () => {
  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero-section" className="luxury-hero relative min-h-screen overflow-hidden pt-24 md:pt-36">
      <DarkLuxuryBackground />
      {/* 动态水面背景：低频金波 + 鼠标互动涟漪（背景之上、正文之下） */}
      <WaterRippleBackdrop />
      {/* 金色粒子丝带：斜贯首屏，亮部落在右上（水波之上、正文之下） */}
      <GoldParticleRibbon />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-6 pb-12 sm:px-12 md:min-h-[calc(100vh-9rem)]">
        <div className="max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.23em] text-[#C9A86A] sm:text-xs">
            <span className="h-px w-10 bg-[#C9A86A]" /> Corporate Legal · Retail · Business
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 }} className="font-serif text-3xl font-normal tracking-[.05em] text-[#F4EFE4] sm:text-5xl">{PERSONAL_INFO.name}</motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }} className="mt-2 text-[11px] tracking-[.24em] text-[#C9A86A] sm:text-sm sm:tracking-[.28em]">QIONGNI LIN</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .14, duration: .8 }} className="mt-8 max-w-3xl text-balance font-serif text-[2.5rem] font-normal leading-[1.08] tracking-[-.04em] text-[#F4EFE4] sm:mt-10 sm:text-6xl lg:text-[5.15rem]">懂商业的<span className="text-[#D0AA62]">企业法务</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .22 }} className="mt-7 max-w-2xl text-base leading-8 text-[#B8C3CF] sm:text-lg">不只指出风险，更为业务找到可执行的路径。<br className="hidden sm:block" />以合同、合规与争议解决经验，支持复杂商业合作安全落地。</motion.p>
          <p className="mt-7 text-[10px] font-medium uppercase tracking-[.24em] text-[#C9A86A] sm:text-xs">Legal · Business · Growth</p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }} className="mt-10 flex flex-wrap gap-4">
            <button onClick={() => goTo('main-content-section')} className="luxury-btn luxury-btn-gold"><span>查看专业经历</span><ArrowRight size={15} /></button>
            <button onClick={() => goTo('main-content-section')} className="luxury-btn luxury-btn-outline"><span>阅读专业观点</span><ArrowRight size={15} /></button>
          </motion.div>
          <div className="mt-16 hidden max-w-sm border-t border-[#C9A86A]/65 pt-5 text-[9px] uppercase tracking-[.2em] text-[#728195] sm:block">Contract · Compliance · Dispute</div>
        </div>
      </div>
    </section>
  );
};
