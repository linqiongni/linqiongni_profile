import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 跨境物流法务总监养成计划。
 * 内容为 public/logistics/ 下的独立静态站，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 */
export const LogisticsLegalTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe src="/logistics/index.html" title="跨境物流法务总监养成计划" darkMode={darkMode} />
);
