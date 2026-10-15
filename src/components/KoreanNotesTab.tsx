import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 韩语 · 学习笔记（直接嵌入 iframe）。
 * 完整静态站位于 public/korean-notes/，按多邻国单元排的填空笔记卡，
 * 浏览器 localStorage 自动保存 + 可导出。
 * 主站 darkMode 同步进 iframe（页内监听 {type:'theme',mode} 消息）。
 */
// 缓存穿透：iframe src 挂版本号，src 一变浏览器必定重新拉取静态站（精度到小时）。
const IFRAME_V = new Date().toISOString().slice(0, 13).replace(/[-T]/g, '');

export const KoreanNotesTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/korean-notes/index.html?v=${IFRAME_V}`}
    title="韩语学习笔记"
    darkMode={darkMode}
    openUrl="/korean-notes/index.html"
    openLabel="新窗口打开笔记"
  />
);
