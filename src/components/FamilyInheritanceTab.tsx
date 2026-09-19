import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 婚姻家事与遗产继承律师实务全流程手册（24 章）。
 * 内容为 public/family-law/ 下的独立静态站，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 * 源站文件在仓库根目录的「婚姻家事与遗产继承/」，改动后执行 `npm run sync:family-law` 同步。
 */
// 缓存穿透：iframe src 挂版本号，src 一变浏览器必定重新拉取静态站（精度到小时，
// 静态站 HTML 缓存 10 分钟，按天生成会导致同日改完仍命中旧 HTML）。
const IFRAME_V = new Date().toISOString().slice(0, 13).replace(/[-T]/g, '');

export const FamilyInheritanceTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe src={`/family-law/index.html?v=${IFRAME_V}`} title="婚姻家事与遗产继承律师实务全流程手册" darkMode={darkMode} />
);
