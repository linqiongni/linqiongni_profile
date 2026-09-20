import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 知识产权法务 · 从 0 到 1。
 * 内容为 public/ip/ 下的独立静态站，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 * ?v= 用于打破 GitHub Pages 静态资源缓存（assets 同样带版本号）。
 */
export const IpLegalTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe src="/ip/index.html?v=20260920a" title="知识产权法务从 0 到 1" darkMode={darkMode} />
);
