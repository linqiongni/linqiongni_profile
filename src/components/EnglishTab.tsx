import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 身边的英语 · 场景化英语短文（阅读器 + 整段朗读）。
 * 内容为 public/english/ 下的独立静态站：index.html（布局 + 播放引擎）+ scenes.js（内容数据），
 * 零外部依赖，此处用全宽 iframe 嵌入。源站在仓库根目录的「身边的英语/」，改动后执行 `npm run sync:english` 同步。
 * 新增场景只需往 scenes.js 的 SCENES 数组追加一条，目录与播放会自动带上。
 */
export const EnglishTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe src="/english/index.html" title="身边的英语 · 一个上班族完整的一天" darkMode={darkMode} />
);
