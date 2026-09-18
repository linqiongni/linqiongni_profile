import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TabType } from '../types';
import { NAV_GROUPS, SUB_TAB_META, tabsOfGroup } from '../navConfig';
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
  /** 强制实色（iframe 类 tab：主页面不滚动，isScrolled 永远 false，需手动置实色避免「看着像没固定」） */
  solid?: boolean;
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
  solid = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  // 主站页面滚动过 或 处于 iframe 类 tab（主页面不滚动）→ 均显示实色钉条
  const scrolled = isScrolled || solid;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // 当前展开的顶层分组（悬停触发）。null = 全部收起。
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  // 下拉面板相对 header 的坐标（由悬停按钮实时测量）
  const [dropdownX, setDropdownX] = useState(0);
  const [dropdownTop, setDropdownTop] = useState(80);
  // 关闭延时：鼠标从分组按钮移入面板的换手间隙留容错，避免闪退。
  const closeTimer = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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
    const g = NAV_GROUPS.find((x) => x.id === id);
    const menuTabs: TabType[] = g
      ? g.sections
        ? g.sections.reduce<TabType[]>((a, s) => a.concat(s.tabs), [])
        : g.subTabs
      : [];
    // 只有一个子板块的分组不展开面板（没有可选的第二项，展开纯属噪音）
    if (menuTabs.length <= 1) return;
    setOpenGroup(id);
    const btn = btnRefs.current[id];
    const header = headerRef.current;
    if (btn && header) {
      const b = btn.getBoundingClientRect();
      const h = header.getBoundingClientRect();
      let x = b.left + b.width / 2 - h.left;
      x = Math.max(140, Math.min(x, window.innerWidth - 140));
      setDropdownX(x);
      // 紧贴悬停按钮正下方展开（而非整个头部底部），鼠标从按钮直接落进面板
      setDropdownTop(b.bottom - h.top);
    }
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

  const activeGroupObj = NAV_GROUPS.find((g) => g.id === activeGroup);
  const subTabsFlat: TabType[] = activeGroupObj ? tabsOfGroup(activeGroupObj) : [];

  return (
    <header
      id="main-navbar"
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
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
            交互：鼠标悬停（无需点击）即在分组正下方展开该分组的子板块下拉面板；
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
                onMouseEnter={hasMenu ? () => openMenu(g.id) : undefined}
                onMouseLeave={scheduleClose}
                onFocus={hasMenu ? () => openMenu(g.id) : undefined}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeMenu();
                }}
              >
                <button
                  id={`nav-group-${g.id}`}
                  ref={(el) => {
                    btnRefs.current[g.id] = el;
                  }}
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

      {/* 常驻第二行：当前分组的子板块（桌面显示，移动端在汉堡菜单内按 section 分组）。
          同时充当 hover 桥接区——鼠标从分组按钮经本行移到下拉面板途中不会因空隙断掉 hover。 */}
      {activeGroupObj && subTabsFlat.length > 1 && (
        <div
          id="navbar-subnav"
          onMouseEnter={cancelClose}
          className="hidden md:flex h-12 items-center border-t border-[#E8E8E6] dark:border-[#2C2C2E]"
        >
          <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#B89F6B] mr-2 whitespace-nowrap">
              {activeGroupObj.label} · {activeGroupObj.enLabel}
            </span>
            {subTabsFlat.map((t) => {
              const isCurrent = activeTab === t;
              return (
                <button
                  key={t}
                  id={`subnav-${t}`}
                  onClick={() => onSelectTab(t)}
                  className={`relative inline-flex items-center px-3 py-1.5 rounded-full text-[13px] transition-colors ${FOCUS_RING} ${
                    isCurrent
                      ? 'font-medium text-[#1D1D1F] dark:text-[#1D1D1F]'
                      : 'text-[#5F5F63] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] hover:bg-[#F5F2EA] dark:hover:bg-[#2C2C2E]'
                  }`}
                >
                  {isCurrent && (
                    <motion.span
                      layoutId="subnav-active-pill"
                      className="absolute inset-0 rounded-full bg-[#B89F6B]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{SUB_TAB_META[t].label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 悬停下拉面板：单例，紧贴悬停按钮正下方展开（覆盖常驻第二行），按按钮水平居中对齐。 */}
      <AnimatePresence>
        {openGroup &&
          (() => {
            const g = NAV_GROUPS.find((x) => x.id === openGroup);
            if (!g) return null;
            return (
              <motion.div
                key="nav-group-dropdown"
                id="nav-group-dropdown"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
                className="hidden md:block absolute z-40 pt-2"
                style={{ top: dropdownTop, left: dropdownX }}
              >
                <div
                  id="nav-group-dropdown-card"
                  role="menu"
                  aria-label={`${g.label} 子菜单`}
                  className="relative -translate-x-1/2 w-max min-w-[216px] rounded-2xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-[#FDFCF9]/95 dark:bg-[#232325]/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.10)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.45)] p-2"
                >
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
            );
          })()}
      </AnimatePresence>

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
