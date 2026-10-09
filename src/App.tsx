import React, { useState, useEffect, useRef } from 'react';

import { TabType } from './types';

import { NAV_GROUPS, groupOfTab } from './navConfig';

import { Navbar } from './components/Navbar';

import { Hero } from './components/Hero';

import { HeroDark } from './components/HeroDark';

import { AboutTab } from './components/AboutTab';

import { ExpertiseTab } from './components/ExpertiseTab';

import { CasesTab } from './components/CasesTab';

import { InsightsTab } from './components/InsightsTab';

import { NotesTab } from './components/NotesTab';

import { CateringLegalTab } from './components/CateringLegalTab';

import { LogisticsLegalTab } from './components/LogisticsLegalTab';

import { IpLegalTab } from './components/IpLegalTab';

import { ForeignContractTab } from './components/ForeignContractTab';

import { GoodWifeTab } from './components/GoodWifeTab';

import { FilmLawS2Tab } from './components/FilmLawS2Tab';
import { FilmLawS3Tab } from './components/FilmLawS3Tab';
import { FilmLawS4Tab } from './components/FilmLawS4Tab';

import { LaborLegalTab } from './components/LaborLegalTab';
import { InsuranceTab } from './components/InsuranceTab';
import { CriminalDefenseTab } from './components/CriminalDefenseTab';
import { CriminalRecordTab } from './components/CriminalRecordTab';
import { EconCrimeTab } from './components/EconCrimeTab';
import { AiLawTab } from './components/AiLawTab';
import { FinancingLegalTab } from './components/FinancingLegalTab';
import { CommercialOpsLegalTab } from './components/CommercialOpsLegalTab';
import { RetailAdLegalTab } from './components/RetailAdLegalTab';
import { ArbitrationTab } from './components/ArbitrationTab';
import { FamilyInheritanceTab } from './components/FamilyInheritanceTab';
import { EnglishTab } from './components/EnglishTab';
import { LanxiangTab } from './components/LanxiangTab';
import { HistoryTab } from './components/HistoryTab';

import { Footer } from './components/Footer';

import { ContactModal } from './components/ContactModal';

import { AquaticLuxuryBackground } from './components/AquaticLuxuryBackground';

import { motion, AnimatePresence } from 'motion/react';

import { Sparkles, ArrowRight } from 'lucide-react';



export default function App() {

  const [activeTab, setActiveTab] = useState<TabType>('home');

  const [activeGroup, setActiveGroup] = useState<string>(groupOfTab('home'));

  const [darkMode, setDarkMode] = useState<boolean>(true);

  const [contactModalOpen, setContactModalOpen] = useState(false);

  const contentSectionRef = useRef<HTMLDivElement>(null);



  // Sync dark mode class on html

  useEffect(() => {

    if (darkMode) {

      document.documentElement.classList.add('dark');

    } else {

      document.documentElement.classList.remove('dark');

    }

  }, [darkMode]);



  // 内容在 #app-scroll 容器内滚动（主页面不滚），所有滚动操作都作用于该容器
  const scrollMain = (top: number, behavior: ScrollBehavior = 'smooth') => {
    const el = document.getElementById('app-scroll');
    if (el) el.scrollTo({ top, behavior });
    else window.scrollTo({ top, behavior });
  };

  const handleSelectTab = (tab: TabType) => {

    setActiveGroup(groupOfTab(tab));

    setActiveTab(tab);

    // 「个人」分组（home/about/expertise/cases/insights/notes）带 Hero：回到页面顶部，
    // 让 Hero 首屏完整露出（定位到子标签条 + Hero 大字），而不是跳过 Hero 直达正文
    if (groupOfTab(tab) === 'profile') {

      scrollMain(0, 'smooth');

      return;

    }

    // 跨境物流法务、知识产权、双视角劳动实务为铺满大页面：直接回到顶部，避免被 Navbar 计算偏移

    if (tab === 'logistics' || tab === 'ip' || tab === 'labor' || tab === 'financing' || tab === 'arbitration' || tab === 'family-law' || tab === 'english' || tab === 'commercial-ops' || tab === 'retail-ad' || tab === 'econ-crime' || tab === 'lanxiang' || tab === 'humanities') {

      scrollMain(0, 'auto');

      return;

    }

    if (contentSectionRef.current) {

      // 容器内滚动：用可视位置 + 容器当前 scrollTop 换算目标位置（window.scrollY 恒为 0）
      const el = document.getElementById('app-scroll');
      const topOffset =
        contentSectionRef.current.getBoundingClientRect().top +
        (el ? el.scrollTop : window.scrollY) -
        128;

      scrollMain(Math.max(0, topOffset), 'smooth');

    }

  };

  // 子站（影视法律四季、兰香如故）内部互跳时，iframe 里的页面会发消息通知主站同步菜单。
  // 傲骨贤妻已是 hub：四季收在 GoodWifeTab 内部左侧栏，切季消息转成 CustomEvent 让 hub
  // 同步选中态、全局 tab 始终停在 film-law（不再整页换到 film-law-s2/3/4）。
  useEffect(() => {
    const onSiteNav = (e: MessageEvent) => {
      const d = e.data as { type?: string; tab?: string } | null;
      if (!d || d.type !== 'site-tab-navigate' || !d.tab) return;
      const allowed: string[] = ['film-law', 'film-law-s2', 'film-law-s3', 'film-law-s4'];
      if (allowed.indexOf(d.tab) === -1) return;
      if (d.tab !== 'film-law') {
        window.dispatchEvent(new CustomEvent('goodwife-season', { detail: d.tab }));
      }
    };
    window.addEventListener('message', onSiteNav);
    return () => window.removeEventListener('message', onSiteNav);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  // 点击顶层分组：进入该分组第一个子板块

  const handleSelectGroup = (groupId: string) => {

    const group = NAV_GROUPS.find((g) => g.id === groupId);

    if (!group) return;

    setActiveGroup(groupId);

    setActiveTab(group.subTabs[0]);

    if (contentSectionRef.current) {

      const el = document.getElementById('app-scroll');
      const topOffset =
        contentSectionRef.current.getBoundingClientRect().top +
        (el ? el.scrollTop : window.scrollY) -
        128;

      scrollMain(Math.max(0, topOffset), 'smooth');

    }

  };



  // 跨境物流法务、知识产权、影视法律、双视角劳动实务 tab 内嵌完整计划 HTML，需要通栏铺满（不受 7xl 容器、Hero、副导航条限制）

  const isFullBleed = activeTab === 'logistics' || activeTab === 'ip' || activeTab === 'film-law' || activeTab === 'film-law-s2' || activeTab === 'film-law-s3' || activeTab === 'labor' || activeTab === 'insurance' || activeTab === 'financing' || activeTab === 'film-law-s4' || activeTab === 'arbitration' || activeTab === 'family-law' || activeTab === 'criminal' || activeTab === 'criminal-record' || activeTab === 'english' || activeTab === 'commercial-ops' || activeTab === 'retail-ad' || activeTab === 'econ-crime' || activeTab === 'lanxiang' || activeTab === 'humanities';



  // 主页 Hero 大图只在「个人」分组展示。

  // 之前点击「法务实务」会先渲染整屏主页再进内容，观感像“闪回主页”，故按分组收敛。

  // Hero 仅「关于我」显示（Andy 2026-09-28：专业技能/案例展示/思考观点/日常分享不放 Hero，直接进正文）；
  // home 是初始态，与 about 渲染同一内容，一并保留 Hero
  const showHero = activeTab === 'home' || activeTab === 'about';

  // iframe 类 tab 的 header 实色钉条（2026-09-28 废除）：Andy 拍板顶部要与「个人」页一致——
  // 透明、能看见深渊板和鱼影（鼠标靠近菜单鱼会聚拢）。滚动后的玻璃钉条仍由 isScrolled 控制，行为与个人页相同。
  // 原 headerSolid 强制逻辑（isFullBleed / criminal / ai-law）保留变量名但恒为 false，便于回滚。
  const headerSolid = false;



  return (

    <div className="h-[100dvh] overflow-hidden flex flex-col bg-transparent dark:bg-transparent text-[#1D1D1F] dark:text-[#F4EFE4] transition-colors duration-300 antialiased selection:bg-[#B89F6B] selection:text-white">

      {/* 全站水下背景：深海军蓝渐变 + 水面呼吸 + 自然鱼影 + 鼠标涟漪（不拦截交互） */}

      <AquaticLuxuryBackground fishCount={9} darkMode={darkMode} />



      {/* Top Fixed Navbar（内含第二 / 第三层子板块导航条） */}

      <Navbar

        activeGroup={activeGroup}

        activeTab={activeTab}

        onSelectGroup={handleSelectGroup}

        onSelectTab={handleSelectTab}

        darkMode={darkMode}

        onToggleDarkMode={() => setDarkMode(!darkMode)}

        onOpenContact={() => setContactModalOpen(true)}

        solid={headerSolid}

      />

      {/* 内容滚动容器：顶部留出导航条高度（移动端 80 / 桌面 128），主页面本身不滚动。
          这样内容与固定导航永不重叠 —— 导航可以一直钉在顶部且保持完全透明，
          固定背景与鱼影完整透出（与 iframe 类 tab 的观感一致）。 */}

      <div id="app-scroll" className="relative flex-1 min-h-0 overflow-y-auto mt-20 md:mt-32">


      {/* Hero Section 仅「个人」分组显示；其余分组直接进内容，不再出现主页大图。
          暗黑模式用深海军蓝豪华版 HeroDark，浅色模式用原浅色首屏 Hero */}

      {showHero && (

        darkMode ? <HeroDark /> : <Hero />

      )}



      {/* Main Content Area */}

      <main

        ref={contentSectionRef}

        id="main-content-section"

        className={

          isFullBleed

            ? 'flex-1 w-full px-0'

            : showHero

              ? 'flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-16'

              : 'flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 pb-16'

        }

      >

        {/* 第二层子板块：悬停下拉面板（nav-group-dropdown-card）+ 常驻第二行（navbar-subnav）。

            Navbar 头部为 128px（主行 80px + 第二行 48px），故上边距为 pt-20 md:pt-32 */}



        {/* Tab Content with Page-Turn Fade Transition (0.3s) */}

        <AnimatePresence mode="wait">

          <motion.div

            key={activeTab}

            initial={{ opacity: 0, y: 10 }}

            animate={{ opacity: 1, y: 0 }}

            exit={{ opacity: 0, y: -10 }}

            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}

          >

            {activeTab === 'home' && (
              <AboutTab onExploreCases={() => handleSelectTab('cases')} />
            )}

            {activeTab === 'about' && (

              <AboutTab onExploreCases={() => handleSelectTab('cases')} />

            )}



            {activeTab === 'expertise' && (

              <ExpertiseTab onSelectTab={handleSelectTab} />

            )}



            {activeTab === 'cases' && <CasesTab />}



            {activeTab === 'insights' && <InsightsTab />}



            {activeTab === 'notes' && <NotesTab />}



            {activeTab === 'catering' && <CateringLegalTab />}



            {activeTab === 'logistics' && <LogisticsLegalTab darkMode={darkMode} />}



            {activeTab === 'ip' && <IpLegalTab darkMode={darkMode} />}



            {activeTab === 'foreign-contracts' && <ForeignContractTab />}



            {activeTab === 'film-law' && <GoodWifeTab darkMode={darkMode} />}



            {activeTab === 'film-law-s2' && <FilmLawS2Tab darkMode={darkMode} />}

            {activeTab === 'film-law-s3' && <FilmLawS3Tab darkMode={darkMode} />}

            {activeTab === 'film-law-s4' && <FilmLawS4Tab darkMode={darkMode} />}



            {activeTab === 'labor' && <LaborLegalTab darkMode={darkMode} />}

            {activeTab === 'insurance' && <InsuranceTab darkMode={darkMode} />}
            {activeTab === 'criminal' && <CriminalDefenseTab darkMode={darkMode} />}
            {activeTab === 'criminal-record' && <CriminalRecordTab darkMode={darkMode} />}
            {activeTab === 'econ-crime' && <EconCrimeTab darkMode={darkMode} />}
            {activeTab === 'ai-law' && <AiLawTab darkMode={darkMode} />}
            {activeTab === 'financing' && <FinancingLegalTab darkMode={darkMode} />}

            {activeTab === 'commercial-ops' && <CommercialOpsLegalTab darkMode={darkMode} />}

            {activeTab === 'retail-ad' && <RetailAdLegalTab darkMode={darkMode} />}

            {activeTab === 'arbitration' && <ArbitrationTab darkMode={darkMode} />}
            {activeTab === 'family-law' && <FamilyInheritanceTab darkMode={darkMode} />}

            {activeTab === 'english' && <EnglishTab darkMode={darkMode} />}

            {activeTab === 'lanxiang' && <LanxiangTab darkMode={darkMode} />}

            {activeTab === 'humanities' && <HistoryTab darkMode={darkMode} />}


          </motion.div>

        </AnimatePresence>

      </main>



      {/* Footer 仅非全屏 tab 显示 */}

      {!isFullBleed && <Footer onOpenContact={() => setContactModalOpen(true)} />}

      </div>{/* /#app-scroll */}


      {/* Contact & WeChat Modal */}

      <ContactModal

        isOpen={contactModalOpen}

        onClose={() => setContactModalOpen(false)}

      />

    </div>

  );

}

