import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

const PLAN_URL = '/ai-law/index.html';

/**
 * AI+法律 · 港资珠宝集团法律 AI 从 0 搭建总纲。
 * 内容为 public/ai-law/ 下的独立静态页（单文件 HTML，自带国风样式与明暗主题），
 * 此处用全宽 iframe 嵌入，作为「法务实务」分组下与餐饮/物流/知产/涉外/保险并列的子板块。
 */
export const AiLawTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  return (
    <div className="relative w-full">
      {/* 铺满整屏的方案页：点 tab 即铺满整个视口，不再有边框/圆角/工具条包裹 */}
      <div className="relative w-full bg-white dark:bg-[#1C1C1E]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white dark:bg-[#1C1C1E]">
            <div className="flex items-center gap-2 text-xs text-[#86868B]">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#B89F6B] border-t-transparent animate-spin" />
              正在载入法律 AI 方案…
            </div>
          </div>
        )}
        <iframe
          key={nonce}
          src={PLAN_URL}
          title="港资珠宝集团法律 AI 从 0 搭建总纲"
          onLoad={() => setLoading(false)}
          className="block w-full border-0 bg-white dark:bg-[#1C1C1E] h-[calc(100vh-80px)] md:h-[calc(100vh-128px)]"
          loading="eager"
        />
      </div>

      {/* 极简浮层：独立大屏打开（不破坏大页面整体感，位置在 Navbar 下方右侧） */}
      <a
        href={PLAN_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setNonce((n) => n + 1)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#B89F6B] text-white text-xs font-medium shadow-lg hover:bg-[#A8905C] transition-colors"
      >
        <ExternalLink size={12} />
        新窗口打开
      </a>
    </div>
  );
};
