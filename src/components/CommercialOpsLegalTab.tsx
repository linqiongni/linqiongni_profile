import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 商业运营法务 · 高端商业综合体商业租赁合同审核指引。
 * 内容为 public/commercial-ops/ 下的独立静态站，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 * 源站文件在仓库根目录的「商业运营法务/」，改动后执行 `npm run sync:commercial-ops` 同步。
 */
// 缓存穿透：iframe src 挂在版本号上，src 一变浏览器必定重新拉取静态站。
// 精度取到小时：静态站 HTML 的 max-age 是 10 分钟，按天生成会导致同一天改完仍命中旧 HTML。
const IFRAME_V = new Date().toISOString().slice(0, 13).replace(/[-T]/g, '');

export const CommercialOpsLegalTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/commercial-ops/index.html?v=${IFRAME_V}`}
    title="商业运营法务 · 高端商业综合体商业租赁合同审核指引"
    darkMode={darkMode}
    // 桌面端与手机端均在当前页内嵌打开，不再提示「全屏打开/另行页面」。
    mobileFullscreen={false}
  />
);
