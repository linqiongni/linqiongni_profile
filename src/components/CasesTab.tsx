import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CASES_DATA } from '../data/portfolioData';
import { CaseStudy } from '../types';
import { ArrowLeft, ArrowUpRight, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export const CasesTab: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  const handleSelectCase = (caseItem: CaseStudy) => {
    setSelectedCase(caseItem);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedCase(null);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div id="tab-cases-content" className="py-6">
      <AnimatePresence mode="wait">
        {!selectedCase ? (
          /* ================= Case Study List View (2-Column Grid) ================= */
          <motion.div
            key="cases-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-10"
          >
            {/* Header */}
            <div className="pb-6 border-b border-[#E8E8E6] dark:border-[#2C2C2E]">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-[1px] w-4 bg-[#B89F6B]" />
                <span className="text-xs uppercase tracking-widest text-[#86868B]">
                  Selected Case Studies / 核心实战案例
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                案例展示
              </h2>
              <p className="text-sm text-[#86868B] mt-2 max-w-2xl font-normal">
                像讲述产品故事一样复盘商业与法律交织的真实战场。（注：所有涉密商业信息与敏感主体均已做脱敏化处理）
              </p>
            </div>

            {/* 2-Column Grid of Cover Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {CASES_DATA.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => handleSelectCase(item)}
                  className="group cursor-pointer flex flex-col rounded-2xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/40 dark:bg-[#242426]/40 overflow-hidden hover:border-[#B89F6B] transition-all duration-500 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
                >
                  {/* Cover Image with Grayscale & Zoom on hover */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8E8E6] dark:bg-[#2C2C2E]">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter grayscale contrast-105 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-md">
                      {item.year} · {item.industry}
                    </div>

                    <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/90 dark:bg-[#1C1C1E]/90 flex items-center justify-center text-[#1D1D1F] dark:text-[#F5F5F7] opacity-0 group-hover:opacity-100 group-hover:text-[#B89F6B] transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-7 flex flex-col justify-between flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-normal text-[#1D1D1F] dark:text-[#F5F5F7] group-hover:text-[#B89F6B] transition-colors leading-snug mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#86868B] tracking-wide mb-3">
                        {item.subtitle}
                      </p>
                      <p className="text-sm text-[#86868B] dark:text-[#8E8E93] line-clamp-2 leading-relaxed font-normal">
                        {item.summary}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="pt-4 border-t border-[#E8E8E6]/60 dark:border-[#2C2C2E]/60 flex flex-wrap gap-1.5 items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] text-[#86868B] bg-[#E8E8E6]/40 dark:bg-[#2C2C2E]/50 px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-[#B89F6B] font-medium inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        查看深度复盘 <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ================= Apple-Style Case Study Detail View ================= */
          <motion.div
            key="case-detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-16 max-w-4xl mx-auto"
          >
            {/* Top Navigation: Return to list */}
            <div>
              <button
                id="case-back-btn"
                onClick={handleBackToList}
                className="inline-flex items-center gap-2 text-sm text-[#86868B] hover:text-[#B89F6B] transition-colors py-2 group"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                <span>返回案例列表 (Back to Cases)</span>
              </button>
            </div>

            {/* Case Header & Hero Banner */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#86868B] uppercase tracking-wider">
                <span>{selectedCase.industry}</span>
                <span>•</span>
                <span>{selectedCase.type}</span>
                <span>•</span>
                <span>{selectedCase.year} 年度实录</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-light text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-tight">
                {selectedCase.title}
              </h1>

              <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden border border-[#E8E8E6] dark:border-[#2C2C2E] bg-[#E8E8E6] dark:bg-[#2C2C2E]">
                <img
                  src={selectedCase.coverImage}
                  alt={selectedCase.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter contrast-105"
                />
              </div>
            </div>

            {/* Structured Content Sections in Apple Narrative Style */}
            <div className="space-y-16">
              {/* 1. Background / 场景背景 */}
              <div className="space-y-4">
                <div className="text-xs uppercase tracking-widest text-[#86868B] font-medium">
                  01 / 商业与业务场景 (Background)
                </div>
                <h3 className="text-2xl font-light text-[#1D1D1F] dark:text-[#F5F5F7]">
                  危机突发与业务前瞻
                </h3>
                <p className="text-base sm:text-[17px] leading-[1.8] text-[#1D1D1F]/90 dark:text-[#F5F5F7]/90 font-normal">
                  {selectedCase.background}
                </p>
              </div>

              {/* 2. Challenge / 难点剖析 (Blockquote with Gold Left Bar) */}
              <div className="space-y-4">
                <div className="text-xs uppercase tracking-widest text-[#86868B] font-medium">
                  02 / 核心冲突与风控挑战 (The Challenge)
                </div>
                <div className="border-l-[3px] border-[#B89F6B] pl-6 py-3 bg-[#FDFCF9] dark:bg-[#242426] rounded-r-xl border-y border-r border-[#E8E8E6]/60 dark:border-[#2C2C2E]">
                  <p className="text-lg sm:text-xl font-light italic text-[#1D1D1F] dark:text-[#F5F5F7] leading-relaxed">
                    “{selectedCase.challenge}”
                  </p>
                </div>
              </div>

              {/* 3. Actions / 法务策略与实战行动 (Product specs style) */}
              <div className="space-y-6">
                <div className="text-xs uppercase tracking-widest text-[#86868B] font-medium">
                  03 / 实操推演与破局路径 (Legal Actions)
                </div>
                <h3 className="text-2xl font-light text-[#1D1D1F] dark:text-[#F5F5F7]">
                  精细化动作分解
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {selectedCase.actions.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/40 dark:bg-[#242426]/40 flex items-start gap-4"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#B89F6B]/15 text-[#B89F6B] flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="text-[15px] text-[#1D1D1F] dark:text-[#F5F5F7] leading-relaxed font-normal">
                        {act}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Results / 核心商业与风控成果 (Large Champagne Gold Numbers) */}
              <div className="p-8 sm:p-10 rounded-2xl border border-[#B89F6B]/30 bg-[#FDFCF9] dark:bg-[#242426] space-y-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#86868B] font-medium mb-1">
                    04 / 交付结果与复盘 (Key Business Impact)
                  </div>
                  <h3 className="text-2xl font-light text-[#1D1D1F] dark:text-[#F5F5F7]">
                    关键量化成效
                  </h3>
                </div>

                {/* Big Metric Numbers in Champagne Gold */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                  {selectedCase.results.map((res, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-4 rounded-xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/60 dark:bg-[#1C1C1E]/60 text-center flex flex-col justify-center"
                    >
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#B89F6B] tracking-tight mb-2">
                        {res.value}
                      </div>
                      <div className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                        {res.label}
                      </div>
                      {res.subtext && (
                        <div className="text-xs text-[#86868B] mt-1">
                          {res.subtext}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Footer Return Action */}
            <div className="pt-8 border-t border-[#E8E8E6] dark:border-[#2C2C2E] flex justify-between items-center">
              <button
                onClick={handleBackToList}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#E8E8E6] dark:border-[#2C2C2E] text-sm text-[#1D1D1F] dark:text-[#F5F5F7] hover:border-[#B89F6B] hover:text-[#B89F6B] transition-colors"
              >
                <ArrowLeft size={16} />
                <span>返回案例列表</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
