import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * AI+法律 · 港资珠宝集团法律 AI 从 0 搭建总纲。
 * 内容为 public/ai-law/ 下的独立静态页（单文件 HTML，自带国风样式与明暗主题），
 * 此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe（其自身已监听 theme 消息）。
 */
export const AiLawTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe src="/ai-law/index.html" title="港资珠宝集团法律 AI 从 0 搭建总纲" darkMode={darkMode} />
);
