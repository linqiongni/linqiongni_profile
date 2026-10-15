import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 韩语课程对照本 · 目录 = 多邻国 App 的单元编号（第 N 单元）。
 * 内容为 public/korean/ 下的独立静态站：index.html(布局) + assets/{data.js,app.js,style.css}，
 * 零外部依赖，用全宽 iframe 嵌入。源文件即 public/korean/，改内容直接改 assets/data.js 即可。
 * 每个单元预填中文讲解 + 韩文 + 罗马音，另有「App 原句记录」和「我的笔记」两个框（localStorage）。
 */
const IFRAME_V = new Date().toISOString().slice(0, 16).replace(/[-T:]/g, '');

export const KoreanTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/korean/index.html?v=${IFRAME_V}`}
    title="韩语课程对照本 · 对齐多邻国韩语单元"
    darkMode={darkMode}
    mobileFullscreen
  />
);
