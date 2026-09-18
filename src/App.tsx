import React, { useState, useEffect, useRef } from 'react';

import { TabType } from './types';

import { NAV_GROUPS, groupOfTab } from './navConfig';

import { Navbar } from './components/Navbar';

import { Hero } from './components/Hero';

import { AboutTab } from './components/AboutTab';

import { ExpertiseTab } from './components/ExpertiseTab';

import { CasesTab } from './components/CasesTab';

import { InsightsTab } from './components/InsightsTab';

import { NotesTab } from './components/NotesTab';

import { CateringLegalTab } from './components/CateringLegalTab';

import { LogisticsLegalTab } from './components/LogisticsLegalTab';

import { IpLegalTab } from './components/IpLegalTab';

import { ForeignContractTab } from './components/ForeignContractTab';

import { FilmLawTab } from './components/FilmLawTab';

import { FilmLawS2Tab } from './components/FilmLawS2Tab';
import { FilmLawS3Tab } from './components/FilmLawS3Tab';
import { FilmLawS4Tab } from './components/FilmLawS4Tab';

import { LaborLegalTab } from './components/LaborLegalTab';
import { InsuranceTab } from './components/InsuranceTab';
import { CriminalDefenseTab } from './components/CriminalDefenseTab';
import { AiLawTab } from './components/AiLawTab';
import { FinancingLegalTab } from './components/FinancingLegalTab';
import { StartupTab } from './components/StartupTab';

import { Footer } from './components/Footer';

import { ContactModal } from './components/ContactModal';

import { WaterRippleBackground } from './components/WaterRippleBackground';

import { motion, AnimatePresence } from 'motion/react';

import { Sparkles, ArrowRight } from 'lucide-react';



export default function App() {

  const [activeTab, setActiveTab] = useState<TabType>('about');

  const [activeGroup, setActiveGroup] = useState<string>(groupOfTab('about'));

  const [darkMode, setDarkMode] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

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



  const handleSelectTab = (tab: TabType) => {

    setActiveGroup(groupOfTab(tab));

    setActiveTab(tab);

    // 跨境物流法务、知识产权、双视角劳动法务为铺满大页面：直接回到顶部，避免被 Navbar 计算偏移

    if (tab === 'logistics' || tab === 'ip' || tab === 'labor' || tab === 'financing' || tab === 'startup') {

      window.scrollTo({ top: 0, behavior: 'auto' });

      return;

    }

    if (contentSectionRef.current) {

      const topOffset = contentSectionRef.current.offsetTop - 128;

      window.scrollTo({ top: topOffset, behavior: 'smooth' });

    }

  };



  // 点击顶层分组：进入该分组第一个子板块

  const handleSelectGroup = (groupId: string) => {

    const group = NAV_GROUPS.find((g) => g.id === groupId);

    if (!group) return;

    setActiveGroup(groupId);

    setActiveTab(group.subTabs[0]);

    if (contentSectionRef.current) {

      const topOffset = contentSectionRef.current.offsetTop - 128;

      window.scrollTo({ top: topOffset, behavior: 'smooth' });

    }

  };



  // 跨境物流法务、知识产权、影视法律、双视角劳动法务 tab 内嵌完整计划 HTML，需要通栏铺满（不受 7xl 容器、Hero、副导航条限制）

  const isFullBleed = activeTab === 'logistics' || activeTab === 'ip' || activeTab === 'film-law' || activeTab === 'film-law-s2' || activeTab === 'film-law-s3' || activeTab === 'labor' || activeTab === 'insurance' || activeTab === 'financing' || activeTab === 'film-law-s4' || activeTab === 'startup';



  // 主页 Hero 大图只在「个人」分组展示。

  // 之前点击「法务实务」会先渲染整屏主页再进内容，观感像“闪回主页”，故按分组收敛。

  const showHero = activeGroup === 'profile';

  // iframe 类 tab（主页面不滚动，isScrolled 永远 false）：强制主站 header 显示实色钉条，
  // 避免透明 header 浮在 iframe 上方被误认为「没固定」。isFullBleed 已含融资/保险/物流/IP/劳动/影视，
  // 补上 criminal / ai-law 这两个同样内嵌 iframe 但不在 isFullBleed 列表里的 tab。
  const headerSolid = isFullBleed || activeTab === 'criminal' || activeTab === 'ai-law';



  const handleScrollToContent = () => {

    if (contentSectionRef.current) {

      const topOffset = contentSectionRef.current.offsetTop - 128;

      window.scrollTo({ top: topOffset, behavior: 'smooth' });

    }

  };



  return (

    <div className="min-h-screen flex flex-col bg-[#FDFCF9] dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-300 antialiased selection:bg-[#B89F6B] selection:text-white">

      {/* 全屏水面波纹背景（跟随鼠标，不拦截交互） */}

      <WaterRippleBackground darkMode={darkMode} />



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



      {/* Hero Section 仅「个人」分组显示；其余分组直接进内容，不再出现主页大图 */}

      {showHero && (

        <Hero

          onScrollToContent={handleScrollToContent}

          onExploreTab={handleSelectTab}

        />

      )}



      {/* Main Content Area */}

      <main

        ref={contentSectionRef}

        id="main-content-section"

        className={

          isFullBleed

            ? 'flex-1 w-full px-0 pt-20 md:pt-32'

            : showHero

              ? 'flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-16'

              : 'flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 pt-20 md:pt-32 pb-16'

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



            {activeTab === 'logistics' && <LogisticsLegalTab />}



            {activeTab === 'ip' && <IpLegalTab darkMode={darkMode} />}



            {activeTab === 'foreign-contracts' && <ForeignContractTab />}



            {activeTab === 'film-law' && <FilmLawTab />}



            {activeTab === 'film-law-s2' && <FilmLawS2Tab darkMode={darkMode} />}

            {activeTab === 'film-law-s3' && <FilmLawS3Tab />}

            {activeTab === 'film-law-s4' && <FilmLawS4Tab />}



            {activeTab === 'labor' && <LaborLegalTab />}

            {activeTab === 'insurance' && <InsuranceTab />}
            {activeTab === 'criminal' && <CriminalDefenseTab />}
            {activeTab === 'ai-law' && <AiLawTab />}
            {activeTab === 'financing' && <FinancingLegalTab />}

            {activeTab === 'startup' && <StartupTab darkMode={darkMode} />}

          </motion.div>

        </AnimatePresence>

      </main>



      {/* Footer 仅非全屏 tab 显示 */}

      {!isFullBleed && <Footer onOpenContact={() => setContactModalOpen(true)} />}



      {/* Contact & WeChat Modal */}

      <ContactModal

        isOpen={contactModalOpen}

        onClose={() => setContactModalOpen(false)}

      />

    </div>

  );

}

