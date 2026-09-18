import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 影视法律 · 基于《傲骨贤战》(The Good Wife) 的法律英语学习站。
 * 内容为 public/film-law/ 下的独立静态 SPA，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 */
export const FilmLawTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src="/film-law/index.html"
    title="影视法律 · The Good Wife 法律英语学习"
    darkMode={darkMode}
    id="tab-film-law-content"
    openUrl={null}
  />
);
