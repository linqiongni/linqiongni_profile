import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 双视角劳动法务 · 劳动用工实务知识库。
 * 内容为 public/labor/ 下的独立静态站，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 */
export const LaborLegalTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe src="/labor/index.html" title="双视角劳动法务 · 劳动用工实务知识库" darkMode={darkMode} />
);
