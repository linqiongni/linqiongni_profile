import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 商事仲裁实务全流程手册（20 章）。
 * 内容为 public/arbitration/ 下的独立静态站，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 * 源站文件在仓库根目录的「商事仲裁/」，改动后执行 `npm run sync:arbitration` 同步。
 */
// 缓存穿透：iframe src 挂版本号，src 一变浏览器必定重新拉取静态站（精度到小时，
// 静态站 HTML 缓存 10 分钟，按天生成会导致同日改完仍命中旧 HTML）。
const IFRAME_V = new Date().toISOString().slice(0, 13).replace(/[-T]/g, '');

export const ArbitrationTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe src={`/arbitration/index.html?v=${IFRAME_V}`} title="商事仲裁实务全流程手册" darkMode={darkMode} />
);
