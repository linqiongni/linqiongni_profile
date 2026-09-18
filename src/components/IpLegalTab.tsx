import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 知识产权法务专家养成计划。
 * 内容为 public/ip/ 下的独立静态站，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 */
export const IpLegalTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe src="/ip/index.html" title="知识产权法务专家养成计划" darkMode={darkMode} />
);
