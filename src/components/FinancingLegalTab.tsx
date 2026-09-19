import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 融资法务 · 从 0 到 1（十二站）。
 * 内容为 public/financing-legal/ 下的独立静态站，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 * 源站文件在仓库根目录的「融资法务/」，改动后执行 `npm run sync:financing` 同步。
 */
/**
 * 缓存穿透：iframe src 挂在日期版本号上。
 * 主站重新构建后，src 变化 → 浏览器必定重新拉取静态站，不会命中旧 iframe 缓存。
 * 日期粒度即可（静态站自身 HTML 的 max-age 只有 10 分钟），无需每次手改。
 */
const IFRAME_V = new Date().toISOString().slice(0, 10).replace(/-/g, '');

export const FinancingLegalTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/financing-legal/index.html?v=${IFRAME_V}`}
    title="融资法务 · 从 0 到 1"
    darkMode={darkMode}
    // openUrl={null} = 不显示右下角「新窗口打开」浮层按钮（2026-09-19 Andy 要求正文区保持干净）
    openUrl={null}
  />
);
