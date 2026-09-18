import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 创业奇思妙想章：虚拟创业推演小说《屿见》。
 * 内容为 public/startup/ 下的独立静态站点，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 */
export const StartupTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src="/startup/"
    title="创业奇思妙想章 · 屿见 —— 一个广州法务的下山记"
    darkMode={darkMode}
    id="tab-startup-content"
    openUrl={null}
  />
);
