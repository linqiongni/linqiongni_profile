import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

const PLAN_URL = '/criminal/plan.html';
const MANUAL_URL = '/criminal/';

/**
 * 刑事辩护 · 30 天训练计划（直接嵌入）。
 * 完整 13 页实务手册位于 public/criminal/ 独立静态站，
 * 与双视角劳动法务（labor）一致，用全宽 iframe 嵌入 30 天计划页。
 * 右上角按钮可新窗口打开完整手册（含总纲 / 流程鸟瞰 / 收案 / 会见 / 阅卷 / 庭审 / 文书库 / 工具 / 法条术语）。
 */
export const CriminalDefenseTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  return (
    <div className="relative w-full">
      <div className="relative w-full bg-white dark:bg-[#1C1C1E]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white dark:bg-[#1C1C1E]">
            <div className="flex items-center gap-2 text-xs text-[#86868B]">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#B89F6B] border-t-transparent animate-spin" />
              正在载入刑事辩护 · 30 天训练计划…
            </div>
          </div>
        )}
        <iframe
          key={nonce}
          src={PLAN_URL}
          title="刑事辩护 · 30 天训练计划"
          onLoad={() => setLoading(false)}
          className="block w-full border-0 bg-white dark:bg-[#1C1C1E]"
          style={{ height: 'calc(100vh - 80px)' }}
          loading="eager"
        />
      </div>

      <a
        href={MANUAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-24 right-5 z-40 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#B89F6B] text-white text-xs font-medium shadow-lg hover:bg-[#A8905C] transition-colors"
      >
        <ExternalLink size={12} />
        完整手册（新窗口）
      </a>
    </div>
  );
};
