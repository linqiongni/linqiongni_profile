import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 婚姻家事与遗产继承律师实务全流程手册（24 章）。
 * 内容为 public/family-law/ 下的独立静态站，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 * 源站文件在仓库根目录的「婚姻家事与遗产继承/」，改动后执行 `npm run sync:family-law` 同步。
 */
export const FamilyInheritanceTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe src="/family-law/index.html" title="婚姻家事与遗产继承律师实务全流程手册" darkMode={darkMode} />
);
