import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 韩语课程对照本 · 目录 = 多邻国 App 的单元编号（第 N 单元）。
 * 内容为 public/korean/ 下的独立静态站：index.html(布局) + assets/{data.js,app.js,style.css}，
 * 零外部依赖，用全宽 iframe 嵌入。源文件即 public/korean/，改内容直接改 assets/data.js 即可。
 * 每个单元预填中文讲解 + 韩文 + 罗马音，另有「App 原句记录」和「我的笔记」两个框（localStorage）。
 */
/**
 * 子站入口带 cache-buster：这里用「本次页面打开的时刻」而不是构建时间。
 * 原因：GitHub Pages 对 HTML 发 Cache-Control: max-age=600，用固定值的话
 * 你更新笔记后 10 分钟内打开仍会拿到旧 index.html（旧 ?v= 资源），看起来像没生效。
 * 每次加载都换一个 v，浏览器就必须重新取 index.html，永远拿到最新部署。
 */
const IFRAME_V = String(Date.now());

export const KoreanTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/korean/index.html?v=${IFRAME_V}`}
    title="韩语课程对照本 · 对齐多邻国韩语单元"
    darkMode={darkMode}
    mobileFullscreen
  />
);
