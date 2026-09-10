import React, { useState, useEffect, useRef } from 'react';
import { TabType } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutTab } from './components/AboutTab';
import { ExpertiseTab } from './components/ExpertiseTab';
import { CasesTab } from './components/CasesTab';
import { InsightsTab } from './components/InsightsTab';
import { NotesTab } from './components/NotesTab';
import { CateringLegalTab } from './components/CateringLegalTab';
import { DevelopmentPlanTab } from './components/DevelopmentPlanTab';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('about');
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
    setActiveTab(tab);
    if (contentSectionRef.current) {
      const topOffset = contentSectionRef.current.offsetTop - 80;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  const handleScrollToContent = () => {
    if (contentSectionRef.current) {
      const topOffset = contentSectionRef.current.offsetTop - 80;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF9] dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-300 antialiased selection:bg-[#B89F6B] selection:text-white">
      {/* Top Fixed Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenContact={() => setContactModalOpen(true)}
      />

      {/* Hero Section (100vh Apple style) */}
      <Hero
        onScrollToContent={handleScrollToContent}
        onExploreTab={handleSelectTab}
      />

      {/* Main Content Area */}
      <main
        ref={contentSectionRef}
        id="main-content-section"
        className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-16"
      >
        {/* Tab switcher secondary bar for quick in-page navigation */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-[#E8E8E6] dark:border-[#2C2C2E]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B89F6B]" />
            <span className="text-xs uppercase tracking-widest text-[#86868B]">
              Current View / 当前视图
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'about', label: '关于我' },
              { id: 'expertise', label: '专业技能' },
              { id: 'cases', label: '案例展示' },
              { id: 'insights', label: '思考观点' },
              { id: 'notes', label: '日常分享' },
              { id: 'catering', label: '餐饮法务' },
              { id: 'plan', label: '养成计划' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id as TabType)}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F] font-medium'
                    : 'text-[#86868B] hover:text-[#B89F6B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

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

            {activeTab === 'plan' && <DevelopmentPlanTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onOpenContact={() => setContactModalOpen(true)} />

      {/* Contact & WeChat Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
}
