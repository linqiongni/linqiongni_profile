import React from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 刑事辩护实录：三十宗虚拟案件的完整诉讼（框架页，直接嵌入 iframe）。
 * 完整静态站位于 public/criminal-record/，由 scripts/build_criminal_cases.py
 * 读取仓库根目录的 Word 源（全书导览 + 已写的第 1–9 章 + 两篇配套文书）生成，
 * 并用 scripts/apply-theme-kit.py --fix 注入鱼影背景与深浅色同步补丁。
 * 主站 darkMode 同步进 iframe（criminal-record 页已引入主题同步补丁并监听主题消息）。
 */
// 缓存穿透：iframe src 挂版本号，src 一变浏览器必定重新拉取静态站（精度到小时，
// 静态站 HTML 缓存 10 分钟，按天生成会导致同日改完仍命中旧 HTML）。
const IFRAME_V = new Date().toISOString().slice(0, 13).replace(/[-T]/g, '');

export const CriminalRecordTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => (
  <ThemeIframe
    src={`/criminal-record/index.html?v=${IFRAME_V}`}
    title="刑事辩护实录：三十宗虚拟案件的完整诉讼"
    darkMode={darkMode}
    openUrl="/criminal-record/index.html"
    openLabel="新窗口打开完整实录"
  />
);
