import React, { useState, useEffect, useRef } from 'react';
import { TabType } from './types';
import { NAV_GROUPS, SUB_TAB_META, groupOfTab } from './navConfig';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutTab } from './components/AboutTab';
import { ExpertiseTab } from './components/ExpertiseTab';
import { CasesTab } from './components/CasesTab';
import { InsightsTab } from './components/InsightsTab';
import { NotesTab } from './components/NotesTab';
import { CateringLegalTab } from './components/CateringLegalTab';
import { LogisticsLegalTab } from './components/LogisticsLegalTab';
import { ForeignContractTab } from './components/ForeignContractTab';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';
import { WaterRippleBackground } from './components/WaterRippleBackground';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [activeGroup, setActiveGroup] = useState<string>(groupOfTab('about'));
  const [darkMode, setDarkMode] = useState(false);
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
    // 跨境物流法务为铺满大页面：直接回到顶部，避免被 Navbar 计算偏移
    if (tab === 'logistics') {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    if (contentSectionRef.current) {
      const topOffset = contentSectionRef.current.offsetTop - 80;
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
      const topOffset = contentSectionRef.current.offsetTop - 80;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  // 跨境物流法务 tab 内嵌完整计划 HTML，需要通栏铺满（不受 7xl 容器、Hero、副导航条限制）
  const isFullBleed = activeTab === 'logistics';

  const handleScrollToContent = () => {
    if (contentSectionRef.current) {
      const topOffset = contentSectionRef.current.offsetTop - 80;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF9] dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-300 antialiased selection:bg-[#B89F6B] selection:text-white">
      {/* 全屏水面波纹背景（跟随鼠标，不拦截交互） */}
      <WaterRippleBackground darkMode={darkMode} />

      {/* Top Fixed Navbar */}
      <Navbar
        activeGroup={activeGroup}
        activeTab={activeTab}
        onSelectGroup={handleSelectGroup}
        onSelectTab={handleSelectTab}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenContact={() => setContactModalOpen(true)}
      />

      {/* Hero Section 仅非全屏 tab 显示；跨境物流法务、涉外合同学习直接进内容页，不显示主页 Hero */}
      {!isFullBleed && activeTab !== 'foreign-contracts' && (
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
            ? 'flex-1 w-full px-0 pt-20'
            : 'flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-16'
        }
      >
      {/* 当前视图副导航条：跨境物流法务为铺满大页面、涉外合同学习为独立内容页，均不显示，避免冗余 */}
      {!isFullBleed && activeTab !== 'foreign-contracts' && (
          <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#E8E8E6] dark:border-[#2C2C2E]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B89F6B]" />
              <span className="text-xs uppercase tracking-widest text-[#86868B]">
                Current View / 当前视图
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {NAV_GROUPS.find((g) => g.id === activeGroup)?.subTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleSelectTab(tab)}
                  className={`px-3 py-1 text-xs rounded-full transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F] font-medium'
                      : 'text-[#86868B] hover:text-[#B89F6B]'
                  }`}
                >
                  {SUB_TAB_META[tab].label}
                </button>
              ))}
            </div>
          </div>
        )}

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
            {activeTab === 'foreign-contracts' && <ForeignContractTab />}
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
