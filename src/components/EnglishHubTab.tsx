import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Languages, ChevronRight } from 'lucide-react';

interface Props {
  darkMode?: boolean;
  onSelectTab: (tab: 'english' | 'daily-english') => void;
}

const CARDS: {
  tab: 'english' | 'daily-english';
  label: string;
  en: string;
  tag: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    tab: 'english',
    label: '身边的英语',
    en: 'English Around You',
    tag: '场景短文 · 逐句朗读',
    desc: '以一位上班族的一天为主线，把通勤、会议、购物等真实场景写成连贯短文，配中文对照与逐句朗读。',
    icon: <BookOpen size={26} />,
  },
  {
    tab: 'daily-english',
    label: '日常英语',
    en: 'Daily English',
    tag: '短文精读 · 词句拆解',
    desc: '按主题精读日常英语短文：逐段中英对照、重点词句与语法重难点拆解，左目录随时跳转到想读的一篇。',
    icon: <Languages size={26} />,
  },
];

/**
 * 「身边的英语」统一入口页：外语分组下露出一个 tab，
 * 点进来再二选一进入「身边的英语（场景短文）」或「日常英语（精读笔记）」两个子站。
 * 结构与 CriminalHubTab 一致。
 */
export const EnglishHubTab: React.FC<Props> = ({ darkMode = false, onSelectTab }) => (
  <div className="max-w-4xl mx-auto px-2 py-4">
    <header className="mb-8">
      <div className="text-[11px] uppercase tracking-[0.2em] text-[#B89F6B] mb-3">外语 · 身边的英语</div>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F4EFE4]">
        身边的英语
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[#5F5F63] dark:text-[#A1A1A6]">
        两套英语内容：一套把真实场景连成短文，边听边读；一套逐段精读、拆词句与语法。先选你想看的方向。
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
