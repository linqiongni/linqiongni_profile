import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';

/** 首屏数据条：用体量证明内容丰富度（数字与 public/ 静态页实际数量级一致） */
const HERO_STATS: { num: string; label: string }[] = [
  { num: '11', label: '大法务领域' },
  { num: '470+', label: '篇实战笔记与课程' },
  { num: '3', label: '季影视律政拆解' },
];

export const Hero: React.FC = () => {
  return (
    <section
      id="hero-section"
      className="relative min-h-screen flex flex-col pt-24 md:pt-36 pb-1 overflow-hidden bg-[#FDFCF9] dark:bg-[#1C1C1E] transition-colors duration-300"
    >
      {/* Background Subtle Geometric / Grain Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 flex items-center justify-center">
        <div className="w-[760px] h-[760px] rounded-full border border-[#E8E8E6] dark:border-[#2C2C2E] blur-2xl" />
      </div>

      {/* 与正文共用同一栅格（max-w-7xl + px-6/12），使左侧内容与下方各板块严格对齐 */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 flex-1 min-h-0 flex flex-col">
        {/* 主视觉区：占据首屏绝大部分高度 */}
        <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center text-center">
          {/* Top Eyebrow / Small Meta Text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 flex items-center gap-2"
          >
            <span className="hidden sm:block h-[1px] w-6 bg-[#B89F6B]" />
            <p className="text-[10px] sm:text-sm uppercase tracking-[0.14em] sm:tracking-[0.2em] text-[#86868B] font-medium whitespace-nowrap">
              {PERSONAL_INFO.title}
            </p>
            <span className="hidden sm:block h-[1px] w-6 bg-[#B89F6B]" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[3.25rem] sm:text-8xl md:text-[6.5rem] lg:text-[7rem] font-light tracking-[-0.025em] text-[#1D1D1F] dark:text-[#F5F5F7] leading-[1.05] mb-[3.5rem] max-w-7xl text-balance"
          >
            “{PERSONAL_INFO.heroHeadline}”
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl md:text-3xl font-normal text-[#86868B] max-w-2xl leading-relaxed mb-[5rem]"
          >
            {PERSONAL_INFO.subtitle}
          </motion.p>

          {/* 数据条：一眼看到站点体量 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-6 sm:gap-28"
          >
            {HERO_STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <span className="h-16 w-[1px] bg-[#E8E8E6] dark:bg-[#2C2C2E]" aria-hidden="true" />}
                <div className="flex flex-col items-center">
                  <span className="text-5xl sm:text-7xl font-light tracking-tight text-[#B89F6B]">{s.num}</span>
                  <span className="text-[10px] sm:text-[11px] text-[#86868B] mt-2.5 tracking-wide whitespace-nowrap">
                    {s.label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};
