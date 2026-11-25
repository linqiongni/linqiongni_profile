import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 英语拾遗 · 碎片英语收纳页（标签 + 全文搜索找回，不做层级分类）。
 * 内容为 public/english-scraps/ 下的独立静态站，源站在仓库根目录「英语拾遗/」。
 * 加内容：往 英语拾遗/assets/data.js 的 window.SCRAPS 追加一条，
 * 再执行 `python3 scripts/sync_english_scraps.py` 同步。
 */
const IFRAME_V = new Date().toISOString().slice(0, 16).replace(/[-T:]/g, '');

export const EnglishScrapsTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/english-scraps/index.html?v=${IFRAME_V}`}
    title="英语拾遗 · 碎片英语收纳"
    darkMode={darkMode}
    mobileFullscreen
  />
);
