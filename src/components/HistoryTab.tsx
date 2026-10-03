import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 人文历史 · 人物志（静态站 /humanities/）
 * 多页站：index.html 为人物目录，每篇人物一个独立页面（如 p01-kongzi.html），
 * 子站内互跳是普通导航，不需要向主站发 site-tab-navigate 消息。
 */
// 与商事仲裁等 tab 一致的缓存击穿：每小时变一次，强制浏览器重新拉取 iframe 页
// （注意：站点内 app.js/style.css/people.js 的缓存击穿在 HTML 里用 ?v= 字面量处理，改了那些文件部署前要换版本号）。
const IFRAME_V = new Date().toISOString().slice(0, 13).replace(/[-T]/g, '');

export const HistoryTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = true }) => (
  <ThemeIframe src={`/humanities/index.html?v=${IFRAME_V}`} title="人文历史 · 人物志" darkMode={darkMode} />
);
