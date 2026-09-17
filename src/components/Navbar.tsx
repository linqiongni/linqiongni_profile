import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TabType } from '../types';
import { NAV_GROUPS, SUB_TAB_META } from '../navConfig';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Moon, Sun, Menu, X, Mail, ChevronDown } from 'lucide-react';

interface NavbarProps {
  activeGroup: string;
  activeTab: TabType;
  onSelectGroup: (id: string) => void;
  onSelectTab: (tab: TabType) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenContact: () => void;
}

// 统一的键盘焦点环：香槟金，仅键盘聚焦时显示（鼠标/触摸不显示）
const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F6B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFCF9] dark:focus-visible:ring-offset-[#1C1C1E]';

export const Navbar: React.FC<NavbarProps> = ({
  activeGroup,
  activeTab,
  onSelectGroup,
  onSelectTab,
  darkMode,
  onToggleDarkMode,
  onOpenContact,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // 当前展开的顶层分组（悬停触发）。null = 全部收起。
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  // 关闭延时：鼠标从分组按钮斜向移到面板时留一点容错，避免闪现。
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = (id: string) => {
    cancelClose();
    setOpenGroup(id);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      setOpenGroup(null);
      closeTimer.current = null;
    }, 140);
  };

  const closeMenu = () => {
    cancelClose();
    setOpenGroup(null);
  };

  // 键盘：Esc 收起面板；组件卸载时清理定时器
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelClose();
        setOpenGroup(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    };
  }, []);

  /** 下拉面板里的一个子板块条目 */
  const renderItem = (t: TabType) => {
    const isCurrent = activeTab === t;
    return (
      <button
        key={t}
        id={`nav-dropdown-${t}`}
        role="menuitem"
        onClick={() => {
          onSelectTab(t);
          closeMenu();
        }}
        className={`w-full flex items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm text-left transition-colors ${FOCUS_RING} ${
          isCurrent
            ? 'bg-[#B89F6B]/10 text-[#1D1D1F] dark:text-[#F5F5F7] font-medium'
            : 'text-[#5F5F63] dark:text-[#A1A1A6] hover:bg-[#F5F2EA] dark:hover:bg-[#2C2C2E] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]'
        }`}
      >
        <span className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              isCurrent ? 'bg-[#B89F6B]' : 'bg-transparent'
            }`}
          />
          {SUB_TAB_META[t].label}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-[#B89F6B]/70 whitespace-nowrap">
          {SUB_TAB_META[t].enLabel}
        </span>
      </button>
    );
  };

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
          className={`flex items-center gap-3 text-left group transition-opacity hover:opacity-80 ${FOCUS_RING}`}
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

        {/* Center/Right: 顶层分组 Tabs (Desktop)。
            交互：鼠标悬停（无需点击）即在条目正下方展开该分组的子板块面板；
            点击分组名仍直接进入该分组第一个子板块（触屏设备因此也可用）。 */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8" aria-label="Main Navigation">
          {NAV_GROUPS.map((g) => {
            const isActive = activeGroup === g.id;
            const isOpen = openGroup === g.id;
            const menuTabs: TabType[] = g.sections
              ? g.sections.reduce<TabType[]>((acc, s) => acc.concat(s.tabs), [])
              : g.subTabs;
            // 只有一个子板块的分组不展开面板（没有可选的第二项，展开纯属噪音）
            const hasMenu = menuTabs.length > 1;

            return (
              <div
                key={g.id}
                className="relative"
                onMouseEnter={() => openMenu(g.id)}
                onMouseLeave={scheduleClose}
                onFocus={() => openMenu(g.id)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeMenu();
                }}
              >
                <button
                  id={`nav-group-${g.id}`}
                  onClick={() => {
                    // 触屏（无悬停）：首次点击先展开面板；面板已开时点击才跳转。
                    // 鼠标用户悬停时面板已开，点击即跳转，行为符合直觉。
                    if (hasMenu && openGroup !== g.id) {
                      openMenu(g.id);
                    } else {
                      onSelectGroup(g.id);
                      closeMenu();
                    }
                  }}
                  aria-haspopup={hasMenu ? 'menu' : undefined}
                  aria-expanded={hasMenu ? isOpen : undefined}
                  className={`relative flex items-center gap-1.5 py-2 text-[15px] font-normal transition-colors group ${FOCUS_RING}`}
                >
                  <span
                    className={`${
                      isActive || isOpen
                        ? 'text-[#1D1D1F] dark:text-[#F5F5F7] font-medium'
                        : 'text-[#86868B] group-hover:text-[#B89F6B] dark:text-[#8E8E93] dark:group-hover:text-[#B89F6B]'
                    } transition-colors`}
                  >
                    {g.label}
                  </span>

                  {hasMenu && (
                    <ChevronDown
                      size={14}
                      strokeWidth={2}
                      className={`transition-all duration-300 ${
                        isOpen ? 'rotate-180 text-[#B89F6B]' : 'text-[#86868B] group-hover:text-[#B89F6B]'
                      }`}
                    />
                  )}

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

                {/* 悬停下拉面板：锚在分组条目正下方；pt-3 作为「桥接区」，
                    鼠标从按钮移到面板途中不会因空隙断掉 hover。 */}
                <AnimatePresence>
                  {hasMenu && isOpen && (
                    <motion.div
                      key={`nav-group-dropdown-${g.id}`}
                      id="nav-group-dropdown"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-1/2 -translate-x-1/2 top-full z-40 pt-3"
                    >
                      <div
                        id="nav-group-dropdown-card"
                        role="menu"
                        aria-label={`${g.label} 子菜单`}
                        className="relative w-max min-w-[216px] rounded-2xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-[#FDFCF9]/95 dark:bg-[#232325]/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.10)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.45)] p-2"
                      >
                        {/* 小尖角：指向当前分组，强化归属 */}
                        <span className="absolute -top-[5px] left-1/2 -translate-x-1/2 h-2.5 w-2.5 rotate-45 rounded-[2px] bg-[#FDFCF9] dark:bg-[#232325] border-l border-t border-[#E8E8E6] dark:border-[#2C2C2E]" />

                        <div className="px-3 pt-1 pb-1.5 text-[10px] uppercase tracking-widest text-[#B89F6B]">
                          {g.label} · {g.enLabel}
                        </div>

                        {g.sections
                          ? g.sections.map((sec) => (
                              <div key={sec.id} className="mb-0.5 last:mb-0">
                                <div className="px-3 pt-1.5 pb-1 text-[10px] uppercase tracking-widest text-[#86868B]">
                                  {sec.label}
                                </div>
                                {sec.tabs.map((t) => renderItem(t))}
                              </div>
                            ))
                          : g.subTabs.map((t) => renderItem(t))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Right Utility Buttons: Dark Mode & Contact */}
        <div className="hidden md:flex items-center gap-4">
          <button
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            aria-label="Toggle Theme"
            className={`p-2 rounded-full text-[#86868B] hover:text-[#B89F6B] hover:bg-[#E8E8E6]/40 dark:hover:bg-[#2C2C2E]/60 transition-all ${FOCUS_RING}`}
            title={darkMode ? '切换至明亮模式' : '切换至暗夜模式'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            id="nav-contact-btn"
            onClick={onOpenContact}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium text-[#1D1D1F] dark:text-[#F5F5F7] border border-[#E8E8E6] dark:border-[#2C2C2E] rounded-full hover:border-[#B89F6B] hover:text-[#B89F6B] transition-all duration-300 ${FOCUS_RING}`}
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
            className={`p-2 text-[#86868B] hover:text-[#B89F6B] ${FOCUS_RING}`}
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 text-[#1D1D1F] dark:text-[#F5F5F7] hover:text-[#B89F6B] ${FOCUS_RING}`}
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
            <div className="flex flex-col space-y-5">
              {NAV_GROUPS.map((g) => (
                <div key={g.id}>
                  <button
                    id={`mobile-group-${g.id}`}
                    onClick={() => {
                      onSelectGroup(g.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left py-2 flex items-center justify-between w-full text-base ${FOCUS_RING} ${
                      activeGroup === g.id
                        ? 'text-[#B89F6B] font-medium'
                        : 'text-[#1D1D1F] dark:text-[#F5F5F7]'
                    }`}
                  >
                    <span>{g.label}</span>
                    <span className="text-xs text-[#86868B]">{g.enLabel}</span>
                  </button>
                  <div className="ml-1 mt-1 flex flex-col space-y-1 border-l border-[#E8E8E6] dark:border-[#2C2C2E] pl-3">
                    {g.sections
                      ? g.sections.map((sec) => (
                          <React.Fragment key={sec.id}>
                            <div className="pt-1.5 text-[11px] uppercase tracking-widest text-[#B89F6B]">
                              {sec.label}
                            </div>
                            {sec.tabs.map((t) => (
                              <button
                                key={t}
                                id={`mobile-nav-${t}`}
                                onClick={() => {
                                  onSelectTab(t);
                                  setMobileMenuOpen(false);
                                }}
                                className={`text-left py-1.5 text-sm ${FOCUS_RING} ${
                                  activeTab === t
                                    ? 'text-[#B89F6B] font-medium'
                                    : 'text-[#86868B]'
                                }`}
                              >
                                {SUB_TAB_META[t].label}
                              </button>
                            ))}
                          </React.Fragment>
                        ))
                      : g.subTabs.map((t) => (
                          <button
                            key={t}
                            id={`mobile-nav-${t}`}
                            onClick={() => {
                              onSelectTab(t);
                              setMobileMenuOpen(false);
                            }}
                            className={`text-left py-1.5 text-sm ${FOCUS_RING} ${
                              activeTab === t
                                ? 'text-[#B89F6B] font-medium'
                                : 'text-[#86868B]'
                            }`}
                          >
                            {SUB_TAB_META[t].label}
                          </button>
                        ))}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-[#E8E8E6] dark:border-[#2C2C2E] flex justify-between items-center">
                <button
                  id="mobile-contact-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenContact();
                  }}
                  className={`w-full py-2.5 text-center text-sm font-medium border border-[#B89F6B] text-[#B89F6B] rounded-lg hover:bg-[#B89F6B] hover:text-white transition-all ${FOCUS_RING}`}
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
