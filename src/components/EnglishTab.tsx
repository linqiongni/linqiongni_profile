import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 身边的英语 · 场景化英语短文（阅读器 + 整段朗读）。
 * 内容为 public/english/ 下的独立静态站：index.html（布局 + 播放引擎）+ scenes.js（内容数据），
 * 零外部依赖，此处用全宽 iframe 嵌入。源站在仓库根目录的「身边的英语/」，改动后执行 `npm run sync:english` 同步。
 * 新增场景只需往 scenes.js 的 SCENES 数组追加一条，目录与播放会自动带上。
 */
/**
 * 缓存穿透：iframe src 挂在「日期+小时+分钟」版本号上（如 202609192325，构建时刻）。
 * 主站重新构建后 src 变化 → 浏览器必定重新拉取静态站，不会命中旧 iframe 缓存。
 * 粒度到分钟：同一天内多次发布也能立即刷新（小时粒度在同小时二次发布会命中旧缓存）。
 * 站内 index.html 会把这个 v 透传给 scenes.js，保证 HTML 与内容数据同版本。
 */
const IFRAME_V = new Date().toISOString().slice(0, 16).replace(/[-T:]/g, '');

export const EnglishTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/english/index.html?v=${IFRAME_V}`}
    title="身边的英语 · 一个上班族完整的一天"
    darkMode={darkMode}
    // 手机端改为全屏打开（iframe 内部滚动在 iOS 上不可靠：回不到顶部、朗读控件被挡）
    mobileFullscreen
  />
);
