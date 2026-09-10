import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SKILLS_DATA } from '../data/portfolioData';
import {
  FileText,
  Handshake,
  ShieldCheck,
  SearchCheck,
  Scale,
  AlertOctagon,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TabType } from '../types';

interface ExpertiseTabProps {
  onSelectTab?: (tab: TabType) => void;
}

export const ExpertiseTab: React.FC<ExpertiseTabProps> = ({ onSelectTab }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'contract' | 'compliance' | 'dispute'>('all');

  const filteredSkills = selectedFilter === 'all'
    ? SKILLS_DATA
    : SKILLS_DATA.filter((s) => s.category === selectedFilter);

  // Icon mapping
  const renderIcon = (iconName: string) => {
    const props = { size: 22, strokeWidth: 1.5, className: 'transition-colors duration-300' };
    switch (iconName) {
      case 'FileText':
        return <FileText {...props} />;
      case 'Handshake':
        return <Handshake {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'SearchCheck':
        return <SearchCheck {...props} />;
      case 'Scale':
        return <Scale {...props} />;
      case 'AlertOctagon':
        return <AlertOctagon {...props} />;
      default:
        return <Layers {...props} />;
    }
  };

  return (
    <div id="tab-expertise-content" className="space-y-12 py-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8E8E6] dark:border-[#2C2C2E]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-[1px] w-4 bg-[#B89F6B]" />
            <span className="text-xs uppercase tracking-widest text-[#86868B]">
              Core Competencies / 专业领域
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            专业技能与执业领域
          </h2>
          <p className="text-sm text-[#86868B] mt-2 max-w-2xl font-normal">
            立足 8 年知名港企大中华区法务中枢，构建“事前模板防范、事中高效谈判、事后维权止损”的商业法务闭环。
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'all', label: '全部领域' },
            { id: 'contract', label: '合同与商事交易' },
            { id: 'compliance', label: '合规与风控' },
            { id: 'dispute', label: '争议解决与应对' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
                selectedFilter === cat.id
                  ? 'border-[#B89F6B] bg-[#B89F6B]/10 text-[#B89F6B] font-medium'
                  : 'border-[#E8E8E6] dark:border-[#2C2C2E] text-[#86868B] hover:border-[#B89F6B] hover:text-[#B89F6B]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col justify-between p-7 rounded-xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/30 dark:bg-[#242426]/30 hover:border-[#B89F6B] dark:hover:border-[#B89F6B] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all duration-300"
          >
            <div>
              {/* Category Badge & Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="text-[#86868B] group-hover:text-[#B89F6B] transition-colors">
                  {renderIcon(skill.icon)}
                </div>
                <span className="text-[11px] uppercase tracking-wider text-[#86868B] group-hover:text-[#B89F6B] transition-colors">
                  {skill.categoryName}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-normal text-[#1D1D1F] dark:text-[#F5F5F7] group-hover:text-[#B89F6B] transition-colors mb-3">
                {skill.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#86868B] dark:text-[#8E8E93] leading-relaxed mb-6 font-normal">
                {skill.description}
              </p>
            </div>

            {/* Bottom Tags */}
            <div className="pt-4 border-t border-[#E8E8E6]/60 dark:border-[#2C2C2E]/60 flex flex-wrap gap-1.5">
              {skill.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="text-[11px] text-[#86868B] group-hover:text-[#1D1D1F] dark:group-hover:text-[#F5F5F7] bg-[#E8E8E6]/30 dark:bg-[#2C2C2E]/40 px-2 py-0.5 rounded transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Practical Capabilities Matrix Callout */}
      <div className="mt-12 p-8 rounded-2xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/40 dark:bg-[#242426]/40 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#86868B] mb-2 font-medium">
              01 / 商业敏锐度
            </div>
            <div className="text-base font-medium text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
              理解业务逻辑胜过死抠法条
            </div>
            <p className="text-xs text-[#86868B] leading-relaxed">
              站在CEO与业务线负责人的视角审视商业模型，确保风控建议不牺牲商业机会。
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-[#86868B] mb-2 font-medium">
              02 / 全链路穿透力
            </div>
            <div className="text-base font-medium text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
              从顶层架构到末端执行
            </div>
            <p className="text-xs text-[#86868B] leading-relaxed">
              既能执笔跨国涉外协议谈判，也能将合规指引转化为一线销售与运营的一目了然清单。
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-[#86868B] mb-2 font-medium">
              03 / 极致确定性
            </div>
            <div className="text-base font-medium text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
              高压危机下的定海神针
            </div>
            <p className="text-xs text-[#86868B] leading-relaxed">
              在面临供应链违约或监管抽检等突发危机时，迅速锁定证据链与筹码，化被动为主动。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
