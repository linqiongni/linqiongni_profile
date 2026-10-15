import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 韩语 · 韩语速查（直接嵌入 iframe）。
 * 完整静态站位于 public/korean-ref/，公共领域的韩语入门书面材料：
 * 字母表 / 发音规则 / 核心语法 / 场景常用语。
 * 主站 darkMode 同步进 iframe（页内监听 {type:'theme',mode} 消息）。
 */
// 缓存穿透：iframe src 挂版本号，src 一变浏览器必定重新拉取静态站（精度到小时）。
const IFRAME_V = new Date().toISOString().slice(0, 13).replace(/[-T]/g, '');

export const KoreanRefTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/korean-ref/index.html?v=${IFRAME_V}`}
    title="韩语速查手册"
    darkMode={darkMode}
    openUrl="/korean-ref/index.html"
    openLabel="新窗口打开速查"
  />
);
