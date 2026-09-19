import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 保险 · 法律维权 —— 中国大陆保险纠纷实务知识体系（以广东判例为锚）。
 * 内容为 public/insurance/ 下的独立静态站，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 */
// 缓存穿透：iframe src 挂版本号，src 一变浏览器必定重新拉取静态站（精度到小时，
// 静态站 HTML 缓存 10 分钟，按天生成会导致同日改完仍命中旧 HTML）。
const IFRAME_V = new Date().toISOString().slice(0, 13).replace(/[-T]/g, '');

export const InsuranceTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/insurance/index.html?v=${IFRAME_V}`}
    title="保险 · 法律维权"
    darkMode={darkMode}
    id="tab-insurance-content"
    openUrl={null}
  />
);
