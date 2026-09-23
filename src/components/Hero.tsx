import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { WaterRippleBackdrop } from './WaterRippleBackdrop';

/** 首屏核心专长：用领域深度替代数字体量，突出港企法务实战纵深 */
const HERO_STRENGTHS: {
  category: string;
  title: string;
  desc: string;
}[] = [
  {
    category: '法务实务',
    title: '商业运营法务',
    desc: '高端商业综合体租赁、品牌运营合规与合同风控',
  },
  {
    category: '法务实务',
    title: '融资法务',
    desc: '投融资交易架构、条款谈判与退出机制设计',
  },
  {
    category: '法务实务',
    title: '知识产权',
    desc: '商标、专利、著作权保护与侵权维权布局',
  },
  {
    category: '法务实务',
    title: '加盟经销法务',
    desc: '连锁特许经营与经销网络合规、加盟风险与品牌保护',
  },
  {
    category: '律师实务',
    title: '商事仲裁',
    desc: '合同争议、股东纠纷与国际仲裁全流程实务',
  },
  {
    category: '争议解决',
    title: '法律维权',
    desc: '保险理赔、消费者权益与商事争议维权策略',
  },
];

export const Hero: React.FC = () => {
  return (
    <section
      id="hero-section"
      className="relative min-h-screen flex flex-col pt-24 md:pt-36 pb-1 overflow-hidden bg-[#FDFCF9] dark:bg-[#091A2E] transition-colors duration-300"
    >
      {/* Background Subtle Geometric / Grain Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 flex items-center justify-center">
        <div className="w-[760px] h-[760px] rounded-full border border-[#E8E8E6] dark:border-[#1B2E45] blur-2xl" />
      </div>

      {/* 动态水面背景：低频水波 + 鼠标互动涟漪（背景之上、正文之下） */}
      <WaterRippleBackdrop />

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
            className="text-[3.25rem] sm:text-8xl md:text-[6.5rem] lg:text-[7rem] font-light tracking-[-0.025em] text-[#1D1D1F] dark:text-[#F4EFE4] leading-[1.05] mb-[3.5rem] max-w-7xl text-balance"
          >
            “{PERSONAL_INFO.heroHeadline}”
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl md:text-3xl font-normal text-[#86868B] max-w-2xl leading-relaxed mb-12 sm:mb-14"
          >
            {PERSONAL_INFO.subtitle}
          </motion.p>

          {/* 核心专长：领域深度替代数字体量 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl"
          >
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#B89F6B] font-medium mb-5 sm:mb-7">
              核心专业领域 / Core Strengths
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-left">
              {HERO_STRENGTHS.map((s) => (
                <div
                  key={s.title}
                  className="group relative bg-[#FDFCF9] dark:bg-[#091A2E] border border-[#E8E8E6] dark:border-[#1B2E45] border-t-2 border-t-[#B89F6B] p-5 sm:p-6 transition-all duration-300 hover:border-[#B89F6B] dark:hover:border-[#B89F6B] hover:shadow-[0_2px_12px_rgba(184,159,107,0.08)]"
                >
                  <span className="inline-block text-[9px] sm:text-[10px] uppercase tracking-[0.14em] text-[#B89F6B] font-medium mb-2">
                    {s.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-medium text-[#1D1D1F] dark:text-[#F4EFE4] tracking-tight mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
