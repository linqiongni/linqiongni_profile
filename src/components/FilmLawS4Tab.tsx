import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 影视法律 · 第四季：《傲骨贤妻》(The Good Wife) S4 法律英语学习站。
 * 内容为 public/film-law-s4/ 下的独立静态 SPA，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 */
export const FilmLawS4Tab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src="/film-law-s4/"
    title="影视法律 · The Good Wife S4 法律英语学习"
    darkMode={darkMode}
    id="tab-film-law-s4-content"
    openUrl={null}
  />
);
