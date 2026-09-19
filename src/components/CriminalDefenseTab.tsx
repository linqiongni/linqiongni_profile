import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 刑事辩护 · 30 天训练计划（直接嵌入 iframe）。
 * 完整 13 页实务手册位于 public/criminal/ 独立静态站，右下角按钮可新窗口打开完整手册。
 * 主站 darkMode 同步进 iframe（criminal 页已引入 /theme-toggle.js 监听消息）。
 */
// 缓存穿透：iframe src 挂版本号，src 一变浏览器必定重新拉取静态站（精度到小时，
// 静态站 HTML 缓存 10 分钟，按天生成会导致同日改完仍命中旧 HTML）。
const IFRAME_V = new Date().toISOString().slice(0, 13).replace(/[-T]/g, '');

export const CriminalDefenseTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/criminal/index.html?v=${IFRAME_V}`}
    title="刑事辩护全流程实务手册"
    darkMode={darkMode}
    openUrl="/criminal/index.html"
    openLabel="新窗口打开完整手册"
  />
);
