import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ChevronDown } from 'lucide-react';
import { TabType } from '../types';
import { NAV_GROUPS, SUB_TAB_META } from '../navConfig';

interface HeroProps {
  onScrollToContent: () => void;
  onExploreTab: (tab: TabType) => void;
}

/** 首屏数据条：用体量证明内容丰富度（数字与 public/ 静态页实际数量级一致） */
const HERO_STATS: { num: string; label: string }[] = [
  { num: '9', label: '大法务领域' },
  { num: '400+', label: '篇实战笔记与课程' },
  { num: '3', label: '季影视律政拆解' },
];

export const Hero: React.FC<HeroProps> = ({ onScrollToContent, onExploreTab }) => {
  return (
    <section
      id="hero-section"
      className="relative min-h-screen flex flex-col pt-24 md:pt-36 pb-0.5 overflow-hidden bg-[#FDFCF9] dark:bg-[#1C1C1E] transition-colors duration-300"
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
            className="mb-11 flex items-center gap-3"
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
            className="text-[3.5rem] sm:text-8xl md:text-[7rem] lg:text-[7.5rem] font-light tracking-[-0.025em] text-[#1D1D1F] dark:text-[#F5F5F7] leading-[1.04] mb-[3.75rem] max-w-7xl text-balance"
          >
            “{PERSONAL_INFO.heroHeadline}”
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl md:text-[2rem] font-normal text-[#86868B] max-w-2xl leading-relaxed mb-[5.5rem]"
          >
            {PERSONAL_INFO.subtitle}
          </motion.p>

          {/* 数据条：一眼看到站点体量 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-7 sm:gap-32"
          >
            {HERO_STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <span className="h-20 w-[1px] bg-[#E8E8E6] dark:bg-[#2C2C2E]" aria-hidden="true" />}
                <div className="flex flex-col items-center">
                  <span className="text-5xl sm:text-[5rem] font-light tracking-tight text-[#B89F6B]">{s.num}</span>
                  <span className="text-[11px] sm:text-xs text-[#86868B] mt-3 tracking-wide whitespace-nowrap">
                    {s.label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* 内容地图：贴左下角，无边框文字导航 */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-auto w-full flex flex-col items-start gap-0.5 sm:gap-1"
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.id} className="flex items-start gap-2 sm:gap-3">
              <span className="shrink-0 w-8 sm:w-9 pt-[1px] sm:pt-0 text-left text-[7px] sm:text-[8px] tracking-[0.14em] text-[#B89F6B] whitespace-nowrap opacity-60">
                {group.label}
              </span>
              <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3.5 gap-y-0.5">
                {group.subTabs.map((tab) => (
                  <button
                    key={tab}
                    id={`hero-map-${tab}`}
                    onClick={() => onExploreTab(tab)}
                    className="group/chip relative py-0.5 text-[8px] sm:text-[9px] text-[#6E6E73] dark:text-[#98989D] hover:text-[#B89F6B] active:text-[#B89F6B] transition-colors duration-200"
                  >
                    {SUB_TAB_META[tab].label}
                    <span
                      className="pointer-events-none absolute left-0 right-0 bottom-0 h-[1px] origin-left scale-x-0 bg-[#B89F6B] transition-transform duration-300 group-hover/chip:scale-x-100"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={onScrollToContent}
            className="group mt-0.5 inline-flex items-center gap-1.5 text-[7px] sm:text-[8px] tracking-wide text-[#86868B] hover:text-[#B89F6B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F6B] rounded-full px-0.5 py-0.5"
          >
            <span>点击任意板块直达 · 顶部导航常驻，可随时切换</span>
            <ChevronDown
              size={13}
              strokeWidth={1.8}
              className="text-[#B89F6B] transition-transform group-hover:translate-y-0.5"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
