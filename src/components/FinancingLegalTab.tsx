import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 融资法务 · 从 0 到 1（十二站）。
 * 内容为 public/financing-legal/ 下的独立静态站，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 * 源站文件在仓库根目录的「融资法务/」，改动后执行 `npm run sync:financing` 同步。
 */
export const FinancingLegalTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe src="/financing-legal/index.html" title="融资法务 · 从 0 到 1" darkMode={darkMode} />
);
