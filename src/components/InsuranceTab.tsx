import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 保险 · 法律维权 —— 中国大陆保险纠纷实务知识体系（以广东判例为锚）。
 * 内容为 public/insurance/ 下的独立静态站，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 */
export const InsuranceTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src="/insurance/index.html"
    title="保险 · 法律维权"
    darkMode={darkMode}
    id="tab-insurance-content"
    openUrl={null}
  />
);
