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
      className="relative min-h-screen flex flex-col px-6 sm:px-12 pt-24 md:pt-36 pb-8 overflow-hidden bg-[#FDFCF9] dark:bg-[#1C1C1E] transition-colors duration-300"
    >
      {/* Background Subtle Geometric / Grain Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 flex items-center justify-center">
        <div className="w-[680px] h-[680px] rounded-full border border-[#E8E8E6] dark:border-[#2C2C2E] blur-2xl" />
      </div>

      {/* 上区（约 3/4）：职业标识 + 主标题 + 副标题 + 数据条 */}
      <div className="relative z-10 flex-[3] min-h-0 w-full flex flex-col items-center justify-center text-center">
        {/* Top Eyebrow / Small Meta Text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex items-center gap-2"
        >
          <span className="h-[1px] w-6 bg-[#B89F6B]" />
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#86868B] font-medium">
            {PERSONAL_INFO.title}
          </p>
          <span className="h-[1px] w-6 bg-[#B89F6B]" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.6rem] sm:text-6xl md:text-7xl font-light tracking-[-0.025em] text-[#1D1D1F] dark:text-[#F5F5F7] leading-[1.12] mb-9 max-w-4xl"
        >
          “{PERSONAL_INFO.heroHeadline}”
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl md:text-2xl font-normal text-[#86868B] max-w-2xl leading-relaxed mb-12"
        >
          {PERSONAL_INFO.subtitle}
        </motion.p>

        {/* 数据条：一眼看到站点体量 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-5 sm:gap-12"
        >
          {HERO_STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <span className="h-9 w-[1px] bg-[#E8E8E6] dark:bg-[#2C2C2E]" aria-hidden="true" />}
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl font-light tracking-tight text-[#B89F6B]">{s.num}</span>
                <span className="text-[11px] sm:text-xs text-[#86868B] mt-1.5 tracking-wide whitespace-nowrap">
                  {s.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* 下区（约 1/4）：全站内容地图，紧凑版 */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex-[1] min-h-0 w-full flex flex-col items-center justify-end gap-2"
      >
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-1.5 sm:gap-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.id} className="flex items-center gap-2 justify-start">
              <span className="shrink-0 w-11 sm:w-14 text-right text-[10px] uppercase tracking-[0.12em] text-[#B89F6B] whitespace-nowrap">
                {group.label}
              </span>
              <div className="flex flex-wrap gap-1.5 justify-start">
                {group.subTabs.map((tab) => (
                  <button
                    key={tab}
                    id={`hero-map-${tab}`}
                    onClick={() => onExploreTab(tab)}
                    className="px-2.5 py-[3px] sm:py-1 rounded-full text-[11px] border border-[#E8E8E6] dark:border-[#2C2C2E] text-[#5A5A5E] dark:text-[#A1A1A6] hover:border-[#B89F6B] hover:text-[#B89F6B] active:scale-[0.97] transition-all duration-200"
                  >
                    {SUB_TAB_META[tab].label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onScrollToContent}
          className="group inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-wide text-[#86868B] hover:text-[#B89F6B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F6B] rounded-full px-2 py-1"
        >
          <span>点击任意板块直达 · 顶部导航常驻，可随时切换</span>
          <ChevronDown
            size={13}
            strokeWidth={1.8}
            className="text-[#B89F6B] transition-transform group-hover:translate-y-0.5"
          />
        </button>
      </motion.div>
    </section>
  );
};
