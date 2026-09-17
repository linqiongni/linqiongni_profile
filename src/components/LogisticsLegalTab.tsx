import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

const PLAN_URL = '/logistics/';

export const LogisticsLegalTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  return (
    <div className="relative w-full">
      {/* 铺满整屏的养成计划：点 tab 即铺满整个视口，不再有边框/圆角/工具条包裹 */}
      <div className="relative w-full bg-white dark:bg-[#1C1C1E]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white dark:bg-[#1C1C1E]">
            <div className="flex items-center gap-2 text-xs text-[#86868B]">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#B89F6B] border-t-transparent animate-spin" />
              正在载入养成计划…
            </div>
          </div>
        )}
        <iframe
          key={nonce}
          src={PLAN_URL}
          title="跨境物流法务总监养成计划"
          onLoad={() => setLoading(false)}
          className="block w-full border-0 bg-white dark:bg-[#1C1C1E]"
          style={{ height: 'calc(100vh - 80px)' }}
          loading="eager"
        />
      </div>

      {/* 极简浮层：独立大屏打开（不破坏大页面整体感，位置在 Navbar 下方右侧） */}
      <a
        href={PLAN_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setNonce((n) => n + 1)}
        className="fixed top-24 right-5 z-40 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#B89F6B] text-white text-xs font-medium shadow-lg hover:bg-[#A8905C] transition-colors"
      >
        <ExternalLink size={12} />
        新窗口打开
      </a>
    </div>
  );
};
