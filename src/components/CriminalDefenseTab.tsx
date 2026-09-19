import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 刑事辩护 · 30 天训练计划（直接嵌入 iframe）。
 * 完整 13 页实务手册位于 public/criminal/ 独立静态站，右下角按钮可新窗口打开完整手册。
 * 主站 darkMode 同步进 iframe（criminal 页已引入 /theme-toggle.js 监听消息）。
 */
export const CriminalDefenseTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src="/criminal/index.html"
    title="刑事辩护全流程实务手册"
    darkMode={darkMode}
    openUrl="/criminal/index.html"
    openLabel="新窗口打开完整手册"
  />
);
