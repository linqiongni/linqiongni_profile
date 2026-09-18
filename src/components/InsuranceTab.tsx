import React from 'react';

/**
 * 保险 · 法律维权 —— 中国大陆保险纠纷实务知识体系（以广东判例为锚）。
 * 内容为 public/insurance/ 下的独立静态站，此处用全宽 iframe 嵌入，
 * 挂在「法务实务」分组下。
 */
export const InsuranceTab: React.FC = () => {
  return (
    <div id="tab-insurance-content" className="w-full h-[calc(100vh-80px)] md:h-[calc(100vh-128px)]">
      <iframe
        src="/insurance/index.html"
        title="保险 · 法律维权"
        className="block w-full h-full border-0"
      />
    </div>
  );
};
