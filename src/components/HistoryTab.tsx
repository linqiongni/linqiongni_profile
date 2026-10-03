import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 人文历史 · 人物志（静态站 /humanities/）
 * 多页站：index.html 为人物目录，每篇人物一个独立页面（如 p01-kongzi.html），
 * 子站内互跳是普通导航，不需要向主站发 site-tab-navigate 消息。
 */
export const HistoryTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = true }) => (
  <ThemeIframe src="/humanities/index.html" title="人文历史 · 人物志" darkMode={darkMode} />
);
