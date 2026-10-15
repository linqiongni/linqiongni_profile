import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, PenLine, ChevronRight } from 'lucide-react';

interface Props {
  darkMode?: boolean;
  onSelectTab: (tab: 'korean-notes' | 'korean-ref') => void;
}

const CARDS: {
  tab: 'korean-notes' | 'korean-ref';
  label: string;
  en: string;
  tag: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    tab: 'korean-notes',
    label: '学习笔记',
    en: 'Study Notes',
    tag: '你自己的多邻国笔记位',
    desc: '按单元排的填空卡：新单词、语法点、我的例句、易错点。点开就能写，自动存在本机浏览器，也能导出。',
    icon: <PenLine size={26} />,
  },
  {
    tab: 'korean-ref',
    label: '韩语速查',
    en: 'Quick Reference',
    tag: '可直接看的书面材料',
    desc: '字母表、发音规则、核心语法、场景常用语——一套公共领域的韩语入门速查手册，随时翻。',
    icon: <BookOpen size={26} />,
  },
];

/**
 * 「韩语学习」统一入口页：个人分组下只露出这一个 tab，
 * 点进来再二选一进入「学习笔记」或「韩语速查」两个子站。对标刑事辩护 hub。
 */
export const KoreanHubTab: React.FC<Props> = ({ darkMode = false, onSelectTab }) => (
  <div className="max-w-4xl mx-auto px-2 py-4">
    <header className="mb-8">
      <div className="text-[11px] uppercase tracking-[0.2em] text-[#B89F6B] mb-3">个人 · 韩语学习</div>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F4EFE4]">
        韩语学习
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[#5F5F63] dark:text-[#A1A1A6]">
        在 app 上学，想做书面笔记就记在这里。一套是你自己的笔记位，一套是随时翻的速查手册。先选方向。
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
