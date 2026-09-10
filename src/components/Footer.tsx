import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Mail, Linkedin, MessageSquare, ArrowUp, QrCode } from 'lucide-react';

interface FooterProps {
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      className="bg-[#F5F5F3] dark:bg-[#161618] border-t border-[#E8E8E6] dark:border-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] py-16 px-6 sm:px-12 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top 3-Column Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pb-12 border-b border-[#E8E8E6] dark:border-[#2C2C2E]">
          {/* Left: Email */}
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-[#86868B]">
              Direct Contact / 邮箱联系
            </div>
            <a
              id="footer-email-link"
              href={`mailto:${PERSONAL_INFO.email}`}
              className="text-base sm:text-lg font-normal text-[#1D1D1F] dark:text-[#F5F5F7] hover:text-[#B89F6B] transition-colors inline-flex items-center gap-2"
            >
              <Mail size={16} className="text-[#86868B]" />
              <span>{PERSONAL_INFO.email}</span>
            </a>
          </div>

          {/* Center: Social Icons */}
          <div className="flex flex-col items-start md:items-center space-y-2">
            <div className="text-xs uppercase tracking-widest text-[#86868B]">
              Connect & Channels / 专业社交
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onOpenContact}
                className="p-2.5 rounded-full border border-[#E8E8E6] dark:border-[#2C2C2E] text-[#86868B] hover:border-[#B89F6B] hover:text-[#B89F6B] transition-colors flex items-center gap-1.5 text-xs"
                title="微信名片 / 扫码联系"
              >
                <QrCode size={15} />
                <span>微信名片</span>
              </button>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full border border-[#E8E8E6] dark:border-[#2C2C2E] text-[#86868B] hover:border-[#B89F6B] hover:text-[#B89F6B] transition-colors flex items-center gap-1.5 text-xs"
                title="LinkedIn 职业档案"
              >
                <Linkedin size={15} />
                <span>领英档案</span>
              </a>
            </div>
          </div>

          {/* Right: Motto Quote */}
          <div className="md:text-right space-y-1">
            <div className="text-xs uppercase tracking-widest text-[#86868B]">
              Legal Creed / 执业信条
            </div>
            <p className="text-sm italic font-light text-[#1D1D1F] dark:text-[#F5F5F7]">
              “{PERSONAL_INFO.quote}”
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#86868B]">
          <div>
            © {new Date().getFullYear()} {PERSONAL_INFO.name} ({PERSONAL_INFO.englishName}). All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>周生生集团（大中华区）法务实战派</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-[#B89F6B] transition-colors group"
            >
              <span>回到顶部</span>
              <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
