import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INSIGHTS_DATA, PERSONAL_INFO } from '../data/portfolioData';
import { InsightArticle } from '../types';
import { ArrowLeft, Clock, Calendar, Bookmark, Share2, Check, ArrowUpRight } from 'lucide-react';

export const InsightsTab: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<InsightArticle | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div id="tab-insights-content" className="py-6">
      <AnimatePresence mode="wait">
        {!selectedArticle ? (
          /* ================= Magazine TOC List View (Max Width 720px) ================= */
          <motion.div
            key="insights-toc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-[720px] mx-auto space-y-10"
          >
            {/* Header */}
            <div className="pb-8 border-b border-[#E8E8E6] dark:border-[#2C2C2E]">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-[1px] w-4 bg-[#B89F6B]" />
                <span className="text-xs uppercase tracking-widest text-[#86868B]">
                  Insights & Essays / 思考随笔
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                思考观点
              </h2>
              <p className="text-sm text-[#86868B] mt-2 font-normal">
                多年企业法务沉淀的商业观察、合规思辨与实战手记。
              </p>
            </div>

            {/* Magazine Index / TOC Table */}
            <div className="divide-y divide-[#E8E8E6] dark:divide-[#2C2C2E]">
              {INSIGHTS_DATA.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    setSelectedArticle(article);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="group py-7 cursor-pointer flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 transition-all hover:bg-[#B89F6B]/[0.02]"
                >
                  <div className="space-y-2 flex-1 pr-4">
                    <div className="flex items-center gap-3 text-xs text-[#86868B]">
                      <span className="font-mono">{article.date}</span>
                      <span>·</span>
                      <div className="flex gap-2">
                        {article.tags.slice(0, 2).map((t, idx) => (
                          <span key={idx}>#{t}</span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-normal text-[#1D1D1F] dark:text-[#F5F5F7] group-hover:text-[#B89F6B] transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#86868B] dark:text-[#8E8E93] line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  {/* Read Time & Arrow */}
                  <div className="flex items-center gap-2 text-xs text-[#86868B] group-hover:text-[#B89F6B] shrink-0 font-mono">
                    <Clock size={13} />
                    <span>{article.readTime}</span>
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ================= Magazine Article Reader (Max Width 720px) ================= */
          <motion.article
            key="insight-detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[720px] mx-auto space-y-12"
          >
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
              <button
                id="insight-back-btn"
                onClick={() => {
                  setSelectedArticle(null);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-sm text-[#86868B] hover:text-[#B89F6B] transition-colors py-2 group"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                <span>返回观点目录 (Back to Insights)</span>
              </button>

              <div className="flex items-center gap-3 text-[#86868B]">
                <button
                  onClick={() => handleToggleBookmark(selectedArticle.id)}
                  className={`p-2 rounded-full hover:text-[#B89F6B] transition-colors ${
                    bookmarkedIds.includes(selectedArticle.id) ? 'text-[#B89F6B]' : ''
                  }`}
                  title="收藏文章"
                >
                  <Bookmark size={17} />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-full hover:text-[#B89F6B] transition-colors flex items-center gap-1 text-xs"
                  title="复制链接"
                >
                  {copiedId ? <Check size={16} className="text-green-600" /> : <Share2 size={17} />}
                </button>
              </div>
            </div>

            {/* Article Header */}
            <div className="space-y-4 pb-6 border-b border-[#E8E8E6] dark:border-[#2C2C2E]">
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#86868B]">
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> {selectedArticle.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={13} /> 阅读需 {selectedArticle.readTime}
                </span>
                <span>•</span>
                <span>作者：{PERSONAL_INFO.name} ({PERSONAL_INFO.englishName})</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-light text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-tight">
                {selectedArticle.title}
              </h1>

              <div className="flex flex-wrap gap-2 pt-2">
                {selectedArticle.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 text-xs text-[#86868B] bg-[#E8E8E6]/40 dark:bg-[#2C2C2E]/60 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Article Content */}
            <div className="space-y-8 text-[#1D1D1F] dark:text-[#F5F5F7]">
              {/* Lead Paragraph (24px Thin) */}
              <p className="text-xl sm:text-2xl font-light leading-relaxed text-[#1D1D1F]/90 dark:text-[#F5F5F7]/90">
                {selectedArticle.lead}
              </p>

              {/* Body Paragraphs (17px with 1.7 line-height) */}
              {selectedArticle.contentParagraphs.map((para, pIdx) => (
                <p
                  key={pIdx}
                  className="text-[17px] leading-[1.8] text-[#1D1D1F]/85 dark:text-[#F5F5F7]/85 font-normal"
                >
                  {para}
                </p>
              ))}

              {/* Quote Block with Gold Left Bar */}
              {selectedArticle.quote && (
                <div className="my-10 border-l-[3px] border-[#B89F6B] pl-6 py-4 bg-[#F5F5F3] dark:bg-[#242426] rounded-r-xl">
                  <p className="text-lg font-light italic text-[#1D1D1F] dark:text-[#F5F5F7] leading-relaxed">
                    “{selectedArticle.quote.text}”
                  </p>
                  {selectedArticle.quote.author && (
                    <div className="text-xs text-[#86868B] mt-2 font-normal">
                      —— {selectedArticle.quote.author}
                    </div>
                  )}
                </div>
              )}

              {/* Monospace Clause Example (Engineering Mindset) */}
              {selectedArticle.clauseExample && (
                <div className="my-8 rounded-lg border border-[#E8E8E6] dark:border-[#2C2C2E] overflow-hidden">
                  <div className="px-4 py-2 bg-[#E8E8E6]/50 dark:bg-[#2C2C2E] text-xs font-medium text-[#86868B] flex items-center justify-between">
                    <span>{selectedArticle.clauseExample.title}</span>
                    <span className="font-mono text-[11px]">CLAUSE COMPARISON</span>
                  </div>
                  <pre className="p-4 bg-[#F5F5F3] dark:bg-[#1C1C1E] text-xs sm:text-sm font-mono text-[#1D1D1F] dark:text-[#E5E5EA] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    <code>{selectedArticle.clauseExample.code}</code>
                  </pre>
                  <div className="p-3.5 bg-white/40 dark:bg-[#242426]/40 border-t border-[#E8E8E6] dark:border-[#2C2C2E] text-xs text-[#86868B]">
                    💡 <span className="text-[#1D1D1F] dark:text-[#F5F5F7] font-medium">实操解析：</span>
                    {selectedArticle.clauseExample.explanation}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Section */}
            <div className="pt-10 border-t border-[#E8E8E6] dark:border-[#2C2C2E] flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-sm text-[#86868B] hover:text-[#B89F6B] transition-colors"
              >
                <ArrowLeft size={16} />
                <span>返回观点目录</span>
              </button>

              <div className="text-xs text-[#86868B]">
                感谢阅读 · 欢迎就相关观点进行专业探讨
              </div>
            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </div>
  );
};
