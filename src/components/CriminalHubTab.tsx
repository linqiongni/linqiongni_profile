import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, FileText, ChevronRight } from 'lucide-react';

interface Props {
  darkMode?: boolean;
  onSelectTab: (tab: 'criminal' | 'criminal-record') => void;
}

const CARDS: {
  tab: 'criminal' | 'criminal-record';
  label: string;
  en: string;
  tag: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    tab: 'criminal',
    label: '刑事辩护全流程实务手册',
    en: 'Full-Cycle Criminal Defense',
    tag: '实务方法 · 工具清单',
    desc: '从接待、会见、阅卷、证据审查到庭审辩护，按刑事辩护全流程梳理可复用的实务方法与清单。',
    icon: <BookOpen size={26} />,
  },
  {
    tab: 'criminal-record',
    label: '刑事辩护实录（三十宗）',
    en: 'Criminal Defense Cases (30)',
    tag: '案例式法律小说',
    desc: '三十宗虚构案件的完整诉讼，从案发现场到刑满释放，逐案呈现事实判断、证据审查与辩护策略。',
    icon: <FileText size={26} />,
  },
];

/**
 * 「刑事辩护」统一入口页：律师实务分组下只露出这一个 tab，
 * 点进来再二选一进入「全流程实务手册」或「辩护实录（三十宗）」两个子站。
 */
export const CriminalHubTab: React.FC<Props> = ({ darkMode = false, onSelectTab }) => (
  <div className="max-w-4xl mx-auto px-2 py-4">
    <header className="mb-8">
      <div className="text-[11px] uppercase tracking-[0.2em] text-[#B89F6B] mb-3">律师实务 · 刑事辩护</div>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F4EFE4]">
        刑事辩护
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[#5F5F63] dark:text-[#A1A1A6]">
        同一领域的两套内容：一套讲「怎么做」的实务方法，一套讲「案怎么辩」的虚构实录。先选你想看的方向。
      </p>
    </header>

    <div className="grid sm:grid-cols-2 gap-5">
      {CARDS.map((c, i) => (
        <motion.button
          key={c.tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => onSelectTab(c.tab)}
          className="group relative text-left rounded-2xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-[#FDFCF9]/70 dark:bg-[#232325]/70 backdrop-blur-sm p-6 transition-all hover:border-[#B89F6B] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:[text-shadow:0_0_12px_rgba(184,159,107,1)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B89F6B]/12 text-[#B89F6B] group-hover:bg-[#B89F6B] group-hover:text-white transition-colors">
              {c.icon}
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#B89F6B]/80">{c.en}</span>
          </div>
          <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F4EFE4] mb-1">{c.label}</h2>
          <span className="inline-block text-[11px] text-[#86868B] mb-3">{c.tag}</span>
          <p className="text-[14px] leading-relaxed text-[#5F5F63] dark:text-[#A1A1A6]">{c.desc}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-[#B89F6B]">
            进入
            <ChevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </motion.button>
      ))}
    </div>
  </div>
);
