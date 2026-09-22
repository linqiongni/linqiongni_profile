import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Scale, Compass, Layers3 } from 'lucide-react';
import { PERSONAL_INFO, PROFILE_FACTS, TIMELINE_DATA } from '../data/portfolioData';

interface AboutTabProps { onExploreCases: () => void; }

const PRINCIPLES = [
  { icon: Compass, title: '先理解生意', text: '先看交易目标、资源约束与真实诉求，再设计法律路径。' },
  { icon: Scale, title: '把风险说清', text: '不放大焦虑，用分级判断帮助管理层看清代价与选择。' },
  { icon: Layers3, title: '让方案落地', text: '把结论转化为条款、流程、证据和可执行的责任分工。' },
];

export const AboutTab: React.FC<AboutTabProps> = ({ onExploreCases }) => (
  <div id="tab-about-content" className="lux-page py-5 sm:py-10">
    <section className="grid gap-12 border-b border-[#D8D0C2] pb-16 dark:border-white/10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-md">
        <div className="absolute -left-4 -top-4 h-20 w-20 border-l border-t border-[#B89F6B]/70" />
        <div className="aspect-[4/5] overflow-hidden bg-[#E5DED2] shadow-[0_28px_70px_rgba(28,31,38,.14)] dark:bg-[#292D35]">
          <img src={PERSONAL_INFO.avatarUrl} alt="职业肖像" className="h-full w-full object-cover" />
        </div>
        <div className="mt-5 flex items-end justify-between border-b border-[#B89F6B]/50 pb-4">
          <div><p className="font-serif text-xl">{PERSONAL_INFO.name}</p><p className="mt-1 text-[10px] uppercase tracking-[.18em] text-[#8A857C]">{PERSONAL_INFO.englishName}</p></div>
          <span className="text-xs text-[#8D754B] dark:text-[#C9A86A]">Legal Counsel</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="flex flex-col justify-center">
        <p className="lux-kicker">About · Professional Profile</p>
        <h2 className="lux-title mt-5">在法律判断之外，<br /><span className="text-[#987B47] dark:text-[#C9A86A]">理解商业如何运转。</span></h2>
        <p className="mt-8 max-w-3xl text-base leading-8 text-[#68655F] dark:text-[#AAA69F]">{PERSONAL_INFO.bio.introParagraph1}</p>
        <blockquote className="mt-8 border-l border-[#B89F6B] pl-6 font-serif text-lg leading-8 text-[#343C50] dark:text-[#DDD5C7]">“我不只判断什么不能做，更关注业务怎样可以稳妥地做成。”</blockquote>
        <div className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {PROFILE_FACTS.filter(f => f.label !== '政治面貌').map(f => <div key={f.label} className="border-t border-[#D8D0C2] pt-3 dark:border-white/10"><p className="text-[10px] uppercase tracking-[.16em] text-[#9A948A]">{f.label}</p><p className="mt-1.5 text-sm leading-6">{f.value}</p></div>)}
        </div>
        <button onClick={onExploreCases} className="mt-10 inline-flex w-fit items-center gap-2 border-b border-[#8D754B] pb-1 text-sm text-[#705E3D] transition-colors hover:text-[#B89F6B] dark:text-[#D5BC87]">查看代表项目 <ArrowUpRight size={15} /></button>
      </motion.div>
    </section>

    <section className="py-16">
      <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
        <div><p className="lux-kicker">Working Method</p><h3 className="mt-4 font-serif text-3xl font-normal">我的工作方法</h3><p className="mt-4 max-w-sm text-sm leading-7 text-[#77736B] dark:text-[#99958D]">专业不是复杂术语的堆叠，而是把复杂问题处理得清楚、稳妥、可执行。</p></div>
        <div className="grid gap-px bg-[#D8D0C2] dark:bg-white/10 md:grid-cols-3">{PRINCIPLES.map(({icon: Icon,title,text},i)=><article key={title} className="bg-[#FDFCF9] p-7 dark:bg-[#1C1C1E]"><div className="flex items-center justify-between"><Icon size={20} strokeWidth={1.4} className="text-[#9B7B42]"/><span className="font-serif text-xs text-[#AAA296]">0{i+1}</span></div><h4 className="mt-8 text-base font-medium">{title}</h4><p className="mt-3 text-sm leading-7 text-[#77736B] dark:text-[#99958D]">{text}</p></article>)}</div>
      </div>
    </section>

    <section className="border-t border-[#D8D0C2] pt-14 dark:border-white/10">
      <div className="mb-10 flex items-end justify-between"><div><p className="lux-kicker">Foundation</p><h3 className="mt-3 font-serif text-3xl">专业基础与实践轨迹</h3></div><p className="hidden text-xs uppercase tracking-[.16em] text-[#99948B] sm:block">Education · Practice · Growth</p></div>
      <div className="grid gap-0 lg:grid-cols-3">{TIMELINE_DATA.map((item,i)=><article key={`${item.title}-${i}`} className="relative border-l border-[#CBB98E] py-1 pl-7 pr-7 pb-10"><span className="absolute -left-[4px] top-1 h-[7px] w-[7px] rounded-full bg-[#B89F6B]"/><p className="text-[10px] uppercase tracking-[.16em] text-[#9B7B42]">{item.year || `0${i+1}`}</p><h4 className="mt-3 text-base font-medium leading-6">{item.title}</h4><p className="mt-3 text-sm leading-7 text-[#77736B] dark:text-[#99958D]">{item.description}</p></article>)}</div>
    </section>
  </div>
);
