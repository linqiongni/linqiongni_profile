import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SKILLS_DATA } from '../data/portfolioData';
import { TabType } from '../types';

interface ExpertiseTabProps { onSelectTab: (tab: TabType) => void; }
const FILTERS = [{id:'all',label:'全部能力'},{id:'contract',label:'合同与交易'},{id:'compliance',label:'合规与治理'},{id:'dispute',label:'争议解决'}] as const;
const LINKS: Partial<Record<string, TabType>> = { contract:'commercial-ops', compliance:'retail-ad', dispute:'arbitration' };

export const ExpertiseTab: React.FC<ExpertiseTabProps> = ({ onSelectTab }) => {
  const [filter,setFilter]=useState<(typeof FILTERS)[number]['id']>('all');
  const items=filter==='all'?SKILLS_DATA:SKILLS_DATA.filter(x=>x.category===filter);
  return <div className="lux-page py-5 sm:py-10">
    <header className="grid gap-8 border-b border-[#D8D0C2] pb-12 dark:border-white/10 lg:grid-cols-[1fr_.72fr] lg:items-end">
      <div><p className="lux-kicker">Expertise · Capability System</p><h2 className="lux-title mt-5">专业能力，不止是知识，<br/><span className="text-[#987B47] dark:text-[#C9A86A]">更是解决问题的系统。</span></h2></div>
      <p className="max-w-xl text-sm leading-7 text-[#77736B] dark:text-[#99958D]">从交易设计、合同谈判到运营合规与争议处置，能力最终体现为三个结果：风险可识别、选择可比较、方案可执行。</p>
    </header>
    <nav className="my-10 flex flex-wrap gap-x-7 gap-y-3" aria-label="能力筛选">{FILTERS.map(f=><button key={f.id} onClick={()=>setFilter(f.id)} className={`border-b pb-2 text-sm transition-colors ${filter===f.id?'border-[#9B7B42] text-[#705E3D] dark:text-[#D7BE8A]':'border-transparent text-[#8D8982] hover:text-[#9B7B42]'}`}>{f.label}</button>)}</nav>
    <div className="grid gap-px overflow-hidden border border-[#D8D0C2] bg-[#D8D0C2] dark:border-white/10 dark:bg-white/10 md:grid-cols-2">
      {items.map((s,i)=><motion.article layout key={s.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*.04}} className="group bg-[#FDFCF9] p-7 dark:bg-[#091A2E] sm:p-9">
        <div className="flex items-start justify-between"><span className="font-serif text-xs text-[#A88E5E]">0{i+1}</span><span className="text-[10px] uppercase tracking-[.15em] text-[#9A958D]">{s.categoryName}</span></div>
        <h3 className="mt-9 font-serif text-2xl font-normal group-hover:text-[#987B47]">{s.title}</h3><p className="mt-4 text-sm leading-7 text-[#716E67] dark:text-[#9F9B93]">{s.description}</p>
        <div className="mt-7 flex flex-wrap gap-2">{s.tags.map(t=><span key={t} className="border border-[#DDD5C8] px-3 py-1.5 text-[10px] tracking-wide text-[#77736B] dark:border-white/10 dark:text-[#99958D]">{t}</span>)}</div>
        {LINKS[s.category]&&<button onClick={()=>onSelectTab(LINKS[s.category]!)} className="mt-8 inline-flex items-center gap-2 text-xs text-[#8D754B] opacity-80 transition-all group-hover:opacity-100">进入专题实务 <ArrowUpRight size={14}/></button>}
      </motion.article>)}
    </div>
    <section className="mt-14 grid gap-px bg-[#D8D0C2] dark:bg-white/10 lg:grid-cols-3">{[['识别','把复杂事实转化为清晰的风险地图'],['权衡','把法律风险放回商业目标中比较'],['落地','把判断写成条款、流程与证据闭环']].map((x,i)=><div key={x[0]} className="bg-[#F6F1E7] p-7 dark:bg-[#171A20]"><span className="font-serif text-xs text-[#A88E5E]">0{i+1}</span><h4 className="mt-5 text-base font-medium">{x[0]}</h4><p className="mt-2 text-sm text-[#77736B] dark:text-[#99958D]">{x[1]}</p></div>)}</section>
  </div>;
};
