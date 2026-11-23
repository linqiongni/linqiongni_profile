import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 日常英语 · 短文精读笔记（左目录 + 逐段中英对照 + 词句语法拆解）。
 * 内容为 public/daily-english/ 下的独立静态站，源站在仓库根目录「日常英语/」，
 * 改内容后执行 `python3 scripts/sync_daily_english.py` 同步（或 npm run sync:daily-english）。
 * 新增课文：往 日常英语/lessons.js 的 DAILY_LESSONS 追加一条，或用 add_daily_english.py 从 Word 生成。
 */
const IFRAME_V = new Date().toISOString().slice(0, 16).replace(/[-T:]/g, '');

export const DailyEnglishTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/daily-english/index.html?v=${IFRAME_V}`}
    title="日常英语 · 短文精读笔记"
    darkMode={darkMode}
    mobileFullscreen
  />
);
