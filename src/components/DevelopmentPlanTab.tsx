import React, { useRef, useState } from 'react';

export const DevelopmentPlanTab: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1400);

  // 同源（Vite public / GitHub Pages 同域）下可读取内部文档高度，实现无缝自适应
  const handleLoad = () => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      const h = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
      if (h > 0) setHeight(h);
    } catch {
      // 跨域兜底：保持默认高度，内部自行滚动
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span className="w-1.5 h-6 rounded-full bg-[#B89F6B]" />
        <h2 className="text-2xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
          餐饮加盟法务总监养成计划
        </h2>
      </div>
      <p className="text-sm text-[#86868B] mb-6 leading-relaxed">
        16 周系统学习路线完整版。下方为原版交互页面，可内部滚动浏览；字体、配色与排版均保持原样。
      </p>

      <div className="rounded-2xl overflow-hidden border border-[#E8E8E6] dark:border-[#2C2C2E] shadow-[0_8px_30px_rgba(0,0,0,0.05)] bg-white dark:bg-[#161618]">
        <iframe
          ref={iframeRef}
          src="/development-plan.html"
          title="餐饮加盟法务总监养成计划"
          onLoad={handleLoad}
          className="block w-full"
          style={{ height, border: 'none' }}
        />
      </div>
    </div>
  );
};
