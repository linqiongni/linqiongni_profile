import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 身边的英语 · 一个广州上班族完整的一天（地道口语学习站）。
 * 内容为 public/english/ 下的独立单文件静态站（HTML+CSS+JS 全内嵌，无外部依赖），
 * 此处用全宽 iframe 嵌入。源站在仓库根目录的「身边的英语/」，改动后执行 `npm run sync:english` 同步。
 */
export const EnglishTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe src="/english/index.html" title="身边的英语 · 一个上班族完整的一天" darkMode={darkMode} />
);
