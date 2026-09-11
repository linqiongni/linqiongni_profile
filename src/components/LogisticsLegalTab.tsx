import React, { useState } from 'react';
import { ExternalLink, RotateCw, Compass } from 'lucide-react';

const PLAN_URL = '/logistics/';

export const LogisticsLegalTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  return (
    <div id="tab-logistics-content" className="space-y-4">
      {/* 极窄工具条：只做归属与出口，不抢内容 */}
      <div className="flex items-center justify-between gap-4 flex-wrap px-1">
        <div className="flex items-center gap-3 min-w-0">
          <Compass size={16} className="text-[#B89F6B] shrink-0" />
          <div className="min-w-0">
            <h2 className="text-base font-medium text-[#1D1D1F] dark:text-[#F5F5F7] leading-tight">
              跨境物流法务总监养成计划
            </h2>
            <p className="text-[11px] text-[#86868B] mt-0.5 truncate">
              24 周 · 120 天 · 24 场周末实战 · 238 条术语 · 已跑出的天可直接点开内容
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setLoading(true);
              setNonce((n) => n + 1);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8E8E6] dark:border-[#2C2C2E] text-xs text-[#6E6E73] dark:text-[#98989D] hover:border-[#B89F6B] hover:text-[#B89F6B] transition-colors"
          >
            <RotateCw size={12} />
            重新加载
          </button>
          <a
            href={PLAN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#B89F6B] text-white text-xs font-medium hover:bg-[#A8905C] transition-colors"
          >
            <ExternalLink size={12} />
            新窗口打开
          </a>
        </div>
      </div>

      {/* 计划本体内嵌：点 tab 即见，无需二次跳转 */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white dark:bg-[#1C1C1E]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-[#1C1C1E]/70">
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
          style={{ height: 'calc(100vh - 190px)', minHeight: '720px' }}
          loading="eager"
        />
      </div>

      <p className="text-[11px] text-[#86868B] px-1">
        * 计划内已跑出内容的天（当前为第 1 周）去掉了指令块，改为「在本页打开 / 新窗口打开」直达内容页；
        未跑出的天仍保留可一键复制的完整指令。每跑完一周，在主计划里加一行映射即可自动切换。
      </p>
    </div>
  );
};
