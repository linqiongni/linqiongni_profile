import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 影视法律 · 第二季：《傲骨贤妻》(The Good Wife) S2 法律英语学习站。
 * 内容为 public/film-law-s2/ 下的独立静态 SPA，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 */
export const FilmLawS2Tab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src="/film-law-s2/index.html"
    title="影视法律 · The Good Wife S2 法律英语学习"
    darkMode={darkMode}
    id="tab-film-law-s2-content"
    openUrl={null}
  />
);
