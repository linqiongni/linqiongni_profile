import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 韩语笔记 · 对齐多邻国韩语课程(经典技能树)。
 * 内容为 public/korean/ 下的独立静态站:index.html(布局)+ assets/{data.js,app.js,style.css},
 * 零外部依赖,用全宽 iframe 嵌入。源文件即 public/korean/,改内容直接改 assets/data.js 即可。
 * 每课预填中文+韩文+罗马音的语法讲解当底稿,底部「我的笔记」存 localStorage。
 */
const IFRAME_V = new Date().toISOString().slice(0, 16).replace(/[-T:]/g, '');

export const KoreanTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/korean/index.html?v=${IFRAME_V}`}
    title="韩语笔记 · 对齐多邻国韩语课程"
    darkMode={darkMode}
    mobileFullscreen
  />
);
