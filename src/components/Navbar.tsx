import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TabType } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Moon, Sun, Menu, X, Mail, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenContact: () => void;
}

const TABS: { id: TabType; label: string; enLabel: string }[] = [
  { id: 'about', label: '关于我', enLabel: 'About' },
  { id: 'expertise', label: '专业技能', enLabel: 'Expertise' },
  { id: 'cases', label: '案例展示', enLabel: 'Cases' },
  { id: 'insights', label: '思考观点', enLabel: 'Insights' },
  { id: 'notes', label: '日常分享', enLabel: 'Notes' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  darkMode,
  onToggleDarkMode,
  onOpenContact,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FDFCF9]/85 dark:bg-[#1C1C1E]/85 backdrop-blur-xl border-b border-[#E8E8E6] dark:border-[#2C2C2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <button
          id="navbar-logo-btn"
          onClick={() => {
            onSelectTab('about');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-left group transition-opacity hover:opacity-80"
        >
          <div className="flex flex-col">
            <span className="text-lg font-medium tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] group-hover:text-[#B89F6B] transition-colors">
              {PERSONAL_INFO.name}
              <span className="ml-2 font-normal text-xs uppercase tracking-widest text-[#86868B]">
                {PERSONAL_INFO.englishName}
              </span>
            </span>
            <span className="text-xs text-[#86868B] font-normal tracking-wide">
              {PERSONAL_INFO.title}
            </span>
          </div>
        </button>

        {/* Center/Right: 5 Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className="relative py-2 text-[15px] font-normal transition-colors group focus:outline-none"
              >
                <span
                  className={`${
                    isActive
                      ? 'text-[#1D1D1F] dark:text-[#F5F5F7] font-medium'
                      : 'text-[#86868B] group-hover:text-[#B89F6B] dark:text-[#8E8E93] dark:group-hover:text-[#B89F6B]'
                  } transition-colors`}
                >
                  {tab.label}
                </span>

                {/* Champagne Gold Underline */}
                {isActive && (
                  <motion.div
                    layoutId="active-tab-underline"
                    id="navbar-active-line"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B89F6B] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Utility Buttons: Dark Mode & Contact */}
        <div className="hidden md:flex items-center gap-4">
          <button
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            aria-label="Toggle Theme"
            className="p-2 rounded-full text-[#86868B] hover:text-[#B89F6B] hover:bg-[#E8E8E6]/40 dark:hover:bg-[#2C2C2E]/60 transition-all"
            title={darkMode ? '切换至明亮模式' : '切换至暗夜模式'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            id="nav-contact-btn"
            onClick={onOpenContact}
            className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium text-[#1D1D1F] dark:text-[#F5F5F7] border border-[#E8E8E6] dark:border-[#2C2C2E] rounded-full hover:border-[#B89F6B] hover:text-[#B89F6B] transition-all duration-300"
          >
            <Mail size={14} className="text-[#86868B] group-hover:text-[#B89F6B]" />
            <span>联系我</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            id="mobile-theme-toggle-btn"
            onClick={onToggleDarkMode}
            className="p-2 text-[#86868B] hover:text-[#B89F6B]"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1D1D1F] dark:text-[#F5F5F7] hover:text-[#B89F6B]"
            aria-label="Open Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            id="mobile-dropdown-menu"
            className="md:hidden bg-[#FDFCF9] dark:bg-[#1C1C1E] border-b border-[#E8E8E6] dark:border-[#2C2C2E] px-6 py-5 shadow-xl"
          >
            <div className="flex flex-col space-y-4">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  id={`mobile-nav-${tab.id}`}
                  onClick={() => {
                    onSelectTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 flex items-center justify-between text-base ${
                    activeTab === tab.id
                      ? 'text-[#B89F6B] font-medium'
                      : 'text-[#1D1D1F] dark:text-[#F5F5F7]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-xs text-[#86868B]">{tab.enLabel}</span>
                </button>
              ))}

              <div className="pt-4 border-t border-[#E8E8E6] dark:border-[#2C2C2E] flex justify-between items-center">
                <button
                  id="mobile-contact-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenContact();
                  }}
                  className="w-full py-2.5 text-center text-sm font-medium border border-[#B89F6B] text-[#B89F6B] rounded-lg hover:bg-[#B89F6B] hover:text-white transition-all"
                >
                  联系法务顾问
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
