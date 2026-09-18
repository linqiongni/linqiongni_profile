import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

const PLAN_URL = '/financing-legal/index.html';

/**
 * 融资法务 · 从 0 到 1（十二站）。
 * 内容为 public/financing-legal/ 下的独立静态站，此处用全宽 iframe 嵌入。
 * 源站文件在仓库根目录的「融资法务/」，改动后执行 `npm run sync:financing` 同步。
 */
export const FinancingLegalTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  return (
    <div className="relative w-full">
      <div className="relative w-full bg-white dark:bg-[#1C1C1E]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white dark:bg-[#1C1C1E]">
            <div className="flex items-center gap-2 text-xs text-[#86868B]">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#B89F6B] border-t-transparent animate-spin" />
              正在载入融资法务知识库…
            </div>
          </div>
        )}
        <iframe
          key={nonce}
          src={PLAN_URL}
          title="融资法务 · 从 0 到 1"
          onLoad={() => setLoading(false)}
          className="block w-full border-0 bg-white dark:bg-[#1C1C1E] h-[calc(100vh-80px)] md:h-[calc(100vh-128px)]"
          loading="eager"
        />
      </div>

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
