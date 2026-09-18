import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 商事仲裁实务全流程手册（20 章）。
 * 内容为 public/arbitration/ 下的独立静态站，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 * 源站文件在仓库根目录的「商事仲裁/」，改动后执行 `npm run sync:arbitration` 同步。
 */
export const ArbitrationTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe src="/arbitration/index.html" title="商事仲裁实务全流程手册" darkMode={darkMode} />
);
