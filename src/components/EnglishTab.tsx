import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 身边的英语 · 场景化英语短文（阅读器 + 整段朗读）。
 * 内容为 public/english/ 下的独立静态站：index.html（布局 + 播放引擎）+ scenes.js（内容数据），
 * 零外部依赖，此处用全宽 iframe 嵌入。源站在仓库根目录的「身边的英语/」，改动后执行 `npm run sync:english` 同步。
 * 新增场景只需往 scenes.js 的 SCENES 数组追加一条，目录与播放会自动带上。
 */
/**
 * 缓存穿透：iframe src 挂在日期版本号上。
 * 主站重新构建后 src 变化 → 浏览器必定重新拉取静态站，不会命中旧 iframe 缓存。
 * 站内 index.html 会把这个 v 透传给 scenes.js，保证 HTML 与内容数据同版本。
 */
const IFRAME_V = new Date().toISOString().slice(0, 10).replace(/-/g, '');

export const EnglishTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/english/index.html?v=${IFRAME_V}`}
    title="身边的英语 · 一个上班族完整的一天"
    darkMode={darkMode}
  />
);
