import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { TabType } from '../types';

interface HeroProps {
  onScrollToContent: () => void;
  onExploreTab: (tab: TabType) => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToContent, onExploreTab }) => {
  return (
    <section
      id="hero-section"
      className="relative min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 pt-20 overflow-hidden bg-[#FDFCF9] dark:bg-[#1C1C1E] transition-colors duration-300"
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
          className="text-base sm:text-xl md:text-2xl font-normal text-[#86868B] max-w-2xl leading-relaxed mb-12"
        >
          {PERSONAL_INFO.subtitle}
        </motion.p>

        {/* Action Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 text-sm"
        >
          <button
            id="hero-cases-btn"
            onClick={() => onExploreTab('cases')}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1D1D1F] text-[#FDFCF9] dark:bg-[#F5F5F7] dark:text-[#1D1D1F] font-medium transition-all hover:bg-[#B89F6B] dark:hover:bg-[#B89F6B] dark:hover:text-white shadow-sm hover:translate-y-[-1px]"
          >
            <span>探索实战案例</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
          
          <button
            id="hero-about-btn"
            onClick={() => onExploreTab('about')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#E8E8E6] dark:border-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] hover:border-[#B89F6B] hover:text-[#B89F6B] transition-all duration-300"
          >
            <span>了解执业背景</span>
          </button>
        </motion.div>
      </div>

      {/* Bottom Minimalist Gold Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center cursor-pointer group"
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
