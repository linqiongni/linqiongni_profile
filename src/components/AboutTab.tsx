import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO, TIMELINE_DATA } from '../data/portfolioData';
import { Award, Briefcase, GraduationCap, ArrowUpRight } from 'lucide-react';

interface AboutTabProps {
  onExploreCases: () => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({ onExploreCases }) => {
  return (
    <div id="tab-about-content" className="space-y-24 py-6">
      {/* Top Main About Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: 4:5 Vertical Portrait with 1px Gold Fine Frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative"
        >
          {/* 1px Champagne Gold Frame */}
          <div className="relative p-3 sm:p-4 rounded-xl border border-[#B89F6B]/60 dark:border-[#B89F6B]/40 bg-[#FDFCF9] dark:bg-[#1C1C1E] shadow-[0_12px_36px_rgba(0,0,0,0.04)]">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#E8E8E6] dark:bg-[#2C2C2E]">
              <img
                src={PERSONAL_INFO.avatarUrl}
                alt={PERSONAL_INFO.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter grayscale contrast-105 transition-all duration-700 hover:grayscale-0 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              {/* Bottom Subtle Overlay Label */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-sm font-medium tracking-wide">
                  {PERSONAL_INFO.name} · {PERSONAL_INFO.englishName}
                </div>
                <div className="text-xs text-white/80 font-light">
                  {PERSONAL_INFO.title}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Highlight Stats Card */}
          <div className="mt-6 grid grid-cols-3 gap-3 p-4 rounded-xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/60 dark:bg-[#242426]/60 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-xl font-light text-[#B89F6B]">多年</div>
              <div className="text-[11px] text-[#86868B]">港企实战经验</div>
            </div>
            <div className="text-center border-x border-[#E8E8E6] dark:border-[#2C2C2E]">
              <div className="text-xl font-light text-[#B89F6B]">300+</div>
              <div className="text-[11px] text-[#86868B]">年审重大合同</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-light text-[#B89F6B]">0</div>
              <div className="text-[11px] text-[#86868B]">行政处罚记录</div>
            </div>
          </div>
        </motion.div>

        {/* Right: Narrative Bio & Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col justify-between space-y-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-[1px] w-4 bg-[#B89F6B]" />
              <span className="text-xs uppercase tracking-widest text-[#86868B]">
                About Me / 个人简介
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
              关于我
            </h2>
          </div>

          {/* Narrative Body: Two paragraphs */}
          <div className="space-y-5 text-[17px] leading-[1.8] text-[#1D1D1F]/90 dark:text-[#F5F5F7]/90 font-normal">
            <p>{PERSONAL_INFO.bio.introParagraph1}</p>
            <p className="border-l-2 border-[#B89F6B] pl-4 italic text-[#1D1D1F] dark:text-[#F5F5F7]">
              “{PERSONAL_INFO.bio.introParagraph2}”
            </p>
          </div>

          {/* 3 Minimalist Tags with hover gold effect */}
          <div className="flex flex-wrap gap-2 pt-2">
            {PERSONAL_INFO.bio.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 text-xs font-normal text-[#86868B] dark:text-[#8E8E93] border border-[#E8E8E6] dark:border-[#2C2C2E] rounded-full hover:border-[#B89F6B] hover:text-[#B89F6B] transition-colors duration-300 cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Core Philosophy Callout */}
          <div className="p-6 rounded-xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/40 dark:bg-[#242426]/40">
            <div className="text-xs font-medium uppercase tracking-wider text-[#86868B] mb-2">
              法务实战信条 (Core Creed)
            </div>
            <div className="text-base text-[#1D1D1F] dark:text-[#F5F5F7] font-light leading-relaxed">
              把法律从“事后阻断的围墙”转化为“事前布局的跑道”。理解每一份合同背后的真实商业诉求，用严密的条款逻辑兑现企业的战略愿景。
            </div>
          </div>
        </motion.div>
      </div>

      {/* Minimalist Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pt-10 border-t border-[#E8E8E6] dark:border-[#2C2C2E]"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#86868B] mb-2">
              Milestones & Career Journey
            </div>
            <h3 className="text-2xl sm:text-3xl font-light text-[#1D1D1F] dark:text-[#F5F5F7]">
              履历与关键里程碑
            </h3>
          </div>
          <div className="text-xs text-[#86868B] mt-2 sm:mt-0 font-normal">
            多年专注商业合同 · 合规风控 · 争议解决
          </div>
        </div>

        {/* Timeline Items (Minimalist Vertical Line + Gold Dot) */}
        <div className="relative pl-6 sm:pl-8 border-l border-[#E8E8E6] dark:border-[#2C2C2E] space-y-10">
          {TIMELINE_DATA.map((item, index) => (
            <div key={index} className="relative group">
              {/* Champagne Gold Dot on the line */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3 h-3 rounded-full bg-[#FDFCF9] dark:bg-[#1C1C1E] border-2 border-[#B89F6B] group-hover:bg-[#B89F6B] transition-colors duration-300 shadow-sm" />

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className="text-sm font-semibold tracking-wider text-[#B89F6B]">
                  {item.year}
                </span>
                <h4 className="text-lg font-medium text-[#1D1D1F] dark:text-[#F5F5F7] group-hover:text-[#B89F6B] transition-colors">
                  {item.title}
                </h4>
              </div>

              <div className="text-xs text-[#86868B] font-medium mt-0.5 mb-2">
                {item.organization}
              </div>

              <p className="text-sm text-[#86868B] dark:text-[#8E8E93] leading-relaxed max-w-3xl">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
