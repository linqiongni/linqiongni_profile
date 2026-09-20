import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 新零售与广告合规 · 零售与广告全场景合规审查操作指引。
 * 内容为 public/retail-ad/ 下的独立静态站，此处用全宽 iframe 嵌入，并把主站 darkMode 同步进 iframe。
 * 源站文件在仓库根目录的「新零售与广告合规/」，改动后执行 `npm run sync:retail-ad` 同步。
 */
// 缓存穿透：iframe src 挂在版本号上，src 一变浏览器必定重新拉取静态站。
// 精度取到小时：静态站 HTML 的 max-age 是 10 分钟，按天生成会导致同一天改完仍命中旧 HTML。
const IFRAME_V = new Date().toISOString().slice(0, 13).replace(/[-T]/g, '');

export const RetailAdLegalTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/retail-ad/index.html?v=${IFRAME_V}`}
    title="新零售与广告合规 · 零售与广告全场景合规审查操作指引"
    darkMode={darkMode}
    // 内容为长文 + 左侧固定目录 + 右侧本页目录，移动端 iframe 内滚动不可靠，
    // 窄屏改为引导全屏打开子站（桌面端行为不变）。
    mobileFullscreen
  />
);
