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
      className="relative min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 pt-24 pb-28 overflow-hidden bg-[#FDFCF9] dark:bg-[#1C1C1E] transition-colors duration-300"
    >
      {/* Background Subtle Geometric / Grain Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 flex items-center justify-center">
        <div className="w-[680px] h-[680px] rounded-full border border-[#E8E8E6] dark:border-[#2C2C2E] blur-2xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Top Eyebrow / Small Meta Text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center gap-2"
        >
          <span className="h-[1px] w-6 bg-[#B89F6B]" />
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#86868B] font-medium">
            {PERSONAL_INFO.title}
          </p>
          <span className="h-[1px] w-6 bg-[#B89F6B]" />
        </motion.div>

        {/* Main Headline (Apple Light 64px) */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-light tracking-[-0.025em] text-[#1D1D1F] dark:text-[#F5F5F7] leading-[1.15] mb-8 max-w-4xl"
        >
          “{PERSONAL_INFO.heroHeadline}”
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-xl md:text-2xl font-normal text-[#86868B] max-w-2xl leading-relaxed mb-8"
        >
          {PERSONAL_INFO.subtitle}
        </motion.p>

        {/* 数据条：一眼看到站点体量 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-6 sm:gap-10 mb-8"
        >
          {HERO_STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <span className="h-8 w-[1px] bg-[#E8E8E6] dark:bg-[#2C2C2E]" aria-hidden="true" />}
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-light tracking-tight text-[#B89F6B]">{s.num}</span>
                <span className="text-[11px] sm:text-xs text-[#86868B] mt-1 tracking-wide">{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </motion.div>

        {/* 站点地图：17 个板块全部直达，替代原来的两个按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl flex flex-col gap-3 sm:gap-3.5"
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.id} className="flex items-start gap-3 justify-center">
              <span className="shrink-0 mt-[5px] text-[11px] sm:text-xs uppercase tracking-[0.15em] text-[#B89F6B] whitespace-nowrap">
                {group.label}
              </span>
              <div className="flex flex-wrap gap-2 justify-center">
                {group.subTabs.map((tab) => (
                  <button
                    key={tab}
                    id={`hero-map-${tab}`}
                    onClick={() => onExploreTab(tab)}
                    className="px-3 py-1.5 rounded-full text-xs sm:text-[13px] border border-[#E8E8E6] dark:border-[#2C2C2E] text-[#5A5A5E] dark:text-[#A1A1A6] hover:border-[#B89F6B] hover:text-[#B89F6B] active:scale-[0.97] transition-all duration-200"
                  >
                    {SUB_TAB_META[tab].label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="text-[11px] sm:text-xs text-[#86868B] tracking-wide mt-1">
            点击任意板块直达 · 右上角菜单可随时切换
          </p>
        </motion.div>
      </div>

      {/* Bottom Minimalist Gold Scroll Indicator（小屏首屏内容较长，仅桌面端展示） */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="absolute bottom-8 left-0 right-0 hidden md:flex flex-col items-center justify-center cursor-pointer group"
        onClick={onScrollToContent}
      >
        <span className="text-[11px] uppercase tracking-widest text-[#86868B] mb-2 group-hover:text-[#B89F6B] transition-colors">
          向下滚动探索
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[#B89F6B]"
        >
          <ChevronDown size={22} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
};
