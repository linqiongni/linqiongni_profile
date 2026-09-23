import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 经济犯罪辩护 · 全流程实务手册（16 章静态站，public/econ-crime/，源目录 经济犯罪辩护/）。
 * 与商事仲裁站同构：左侧目录栏布局，直接 iframe 内嵌；darkMode 经 /theme-toggle.js 同步。
 */
const IFRAME_V = new Date().toISOString().slice(0, 13).replace(/[-T]/g, '');

export const EconCrimeTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/econ-crime/index.html?v=${IFRAME_V}`}
    title="经济犯罪刑事辩护全流程实务手册"
    darkMode={darkMode}
    openUrl="/econ-crime/index.html"
    openLabel="新窗口打开完整手册"
  />
);
