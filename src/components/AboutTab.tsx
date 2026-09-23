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
  <div id="tab-about-content" className="bg-[#091A2E] !text-[#F4EFE4] -mx-6 sm:-mx-12 px-6 sm:px-12">
    <div className="max-w-7xl mx-auto py-5 sm:py-10">
      <section className="grid gap-8 border-b border-[#1B2E45] pb-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20 lg:pb-16">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative lg:max-w-md">
        <div className="absolute -left-4 -top-4 hidden h-20 w-20 border-l border-t border-[#C9A86A]/60 lg:block" />
        {/* 手机端：人物以紧凑头像内嵌在「关于我」内容顶部；桌面端恢复大图 + 姓名卡 */}
        <div className="flex items-start gap-4 sm:gap-5 lg:block">
          <div className="aspect-[4/5] w-28 shrink-0 overflow-hidden shadow-[0_28px_70px_rgba(0,0,0,.45)] sm:w-32 lg:w-auto lg:max-w-md">
            <img src={PERSONAL_INFO.avatarUrl} alt="职业肖像" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 lg:mt-5">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between lg:border-b lg:border-[#C9A86A]/50 lg:pb-4">
              <div>
                <p className="font-serif text-xl text-[#F4EFE4]">{PERSONAL_INFO.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[.18em] text-[#93A6BC]">{PERSONAL_INFO.englishName}</p>
              </div>
              <span className="mt-2 inline-block text-xs text-[#C9A86A] lg:mt-0">Legal Counsel</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="flex flex-col justify-center">
        <p className="lux-kicker !text-[#C9A86A]">About · Professional Profile</p>
        <h2 className="lux-title mt-5 text-[#F4EFE4]">在法律判断之外，<br /><span className="text-[#C9A86A]">理解商业如何运转。</span></h2>
        <p className="mt-8 max-w-3xl text-base leading-8 text-[#CBD5E1]">{PERSONAL_INFO.bio.introParagraph1}</p>
        <blockquote className="mt-8 border-l-2 border-[#C9A86A] pl-6 font-serif text-lg leading-8 text-[#E2E8F0]">“我不只判断什么不能做，更关注业务怎样可以稳妥地做成。”</blockquote>
        <div className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {PROFILE_FACTS.filter(f => f.label !== '政治面貌').map(f => <div key={f.label} className="border-t border-[#1B2E45] pt-3"><p className="text-[10px] uppercase tracking-[.16em] text-[#93A6BC]">{f.label}</p><p className="mt-1.5 text-sm leading-6 text-[#F4EFE4]">{f.value}</p></div>)}
        </div>
        <button onClick={onExploreCases} className="mt-10 inline-flex w-fit items-center gap-2 border-b border-[#C9A86A] pb-1 text-sm text-[#C9A86A] transition-colors hover:text-[#E2C98E]">查看代表项目 <ArrowUpRight size={15} /></button>
      </motion.div>
    </section>

    <section className="py-16">
      <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
        <div><p className="lux-kicker !text-[#C9A86A]">Working Method</p><h3 className="mt-4 font-serif text-3xl font-normal text-[#F4EFE4]">我的工作方法</h3><p className="mt-4 max-w-sm text-sm leading-7 text-[#CBD5E1]">专业不是复杂术语的堆叠，而是把复杂问题处理得清楚、稳妥、可执行。</p></div>
        <div className="grid gap-px bg-[#1B2E45] md:grid-cols-3">{PRINCIPLES.map(({icon: Icon,title,text},i)=><article key={title} className="bg-[#0C1B2B] p-7"><div className="flex items-center justify-between"><Icon size={20} strokeWidth={1.4} className="text-[#C9A86A]"/><span className="font-serif text-xs text-[#93A6BC]">0{i+1}</span></div><h4 className="mt-8 text-base font-medium text-[#F4EFE4]">{title}</h4><p className="mt-3 text-sm leading-7 text-[#CBD5E1]">{text}</p></article>)}</div>
      </div>
    </section>

    <section className="border-t border-[#1B2E45] pt-14">
      <div className="mb-10 flex items-end justify-between"><div><p className="lux-kicker !text-[#C9A86A]">Foundation</p><h3 className="mt-3 font-serif text-3xl text-[#F4EFE4]">专业基础与实践轨迹</h3></div><p className="hidden text-xs uppercase tracking-[.16em] text-[#93A6BC] sm:block">Education · Practice · Growth</p></div>
      <div className="grid gap-0 lg:grid-cols-3">{TIMELINE_DATA.map((item,i)=><article key={`${item.title}-${i}`} className="relative border-l border-[#C9A86A]/40 py-1 pl-7 pr-7 pb-10"><span className="absolute -left-[4px] top-1 h-[7px] w-[7px] rounded-full bg-[#C9A86A]"/><p className="text-[10px] uppercase tracking-[.16em] text-[#C9A86A]">{item.year || `0${i+1}`}</p><h4 className="mt-3 text-base font-medium leading-6 text-[#F4EFE4]">{item.title}</h4><p className="mt-3 text-sm leading-7 text-[#CBD5E1]">{item.description}</p></article>)}</div>
    </section>
    </div>
  </div>
);
