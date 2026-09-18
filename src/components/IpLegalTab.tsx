import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

const PLAN_URL = '/ip/index.html';

export const IpLegalTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => {
  const [loading, setLoading] = useState(true);
  const [loadedTick, setLoadedTick] = useState(0);
  const [nonce, setNonce] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // 把主站主题同步进 iframe（/ip/index.html 内的 theme-toggle.js 监听该消息）
  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      win.postMessage({ type: 'theme', mode: darkMode ? 'dark' : 'light' }, '*');
    } catch (e) {
      /* 跨域等场景忽略 */
    }
  }, [darkMode, loading, loadedTick, nonce]);

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
          ref={iframeRef}
          src={PLAN_URL}
          title="知识产权法务专家养成计划"
          onLoad={() => {
            setLoading(false);
            setLoadedTick((t) => t + 1);
          }}
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
