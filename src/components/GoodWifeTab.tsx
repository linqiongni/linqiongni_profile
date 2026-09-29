import React, { useEffect, useState } from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 影视法律 · 傲骨贤妻（The Good Wife）法律英语学习站 hub。
 *
 * 与 LanxiangTab 同款「hub tab」结构：全局菜单只暴露一个「傲骨贤妻」入口，
 * 季列表收在 tab 内部左侧栏，右侧用全宽 iframe 嵌入选中季的静态子站
 * （public 下的 film-law 系列子站页）。
 *
 * 2026-09-29 子站顶栏菜单已撤（课程地图/术语表/方法 + 跨季链接全部移除），
 * 侧边栏新增「本季页面」组接管：子站 app.js 是纯 hash 路由（#/、#/glossary、
 * #/about），所以视图直接编进 iframe src 的 hash——同季内切视图只改 hash
 * 不重载 iframe，路由由子站 hashchange 监听自然接管；跨季切换换 key 全量重载。
 *
 * 注意：subTabs 里的 film-law-s2/s3/s4 不可删（groupOfTab 只认 subTabs），
 * 它们不再出现在任何菜单里，仅作为类型与回退路由存在。
 */
interface Season {
  id: string; // 全局 tab id（App.tsx 消息映射用）
  label: string;
  enLabel: string;
  src: string;
}

const SEASONS: Season[] = [
  { id: 'film-law', label: 'S1', enLabel: 'Season 1', src: '/film-law/index.html?v=20260929b3' },
  { id: 'film-law-s2', label: 'S2', enLabel: 'Season 2', src: '/film-law-s2/index.html?v=20260929b3' },
  { id: 'film-law-s3', label: 'S3', enLabel: 'Season 3', src: '/film-law-s3/index.html?v=20260929b3' },
  { id: 'film-law-s4', label: 'S4', enLabel: 'Season 4', src: '/film-law-s4/index.html?v=20260929b3' },
];

/** 本季页面视图：与子站 hash 路由一一对应 */
const VIEWS: { key: string; label: string; hash: string }[] = [
  { key: 'map', label: '课程地图', hash: '#/' },
  { key: 'glossary', label: '术语表', hash: '#/glossary' },
  { key: 'about', label: '方法 & 版权', hash: '#/about' },
];

export const GoodWifeTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => {
  const [selected, setSelected] = useState<string>(SEASONS[0]?.id ?? 'film-law');
  const [view, setView] = useState<string>('map');
  const current = SEASONS.find((s) => s.id === selected) ?? SEASONS[0];

  // 子站页内互跳 → App.tsx 转发的切季事件：同步左侧栏选中态
  useEffect(() => {
    const onSeason = (e: Event) => {
      const tab = (e as CustomEvent<string>).detail;
      if (SEASONS.some((s) => s.id === tab)) setSelected(tab);
    };
    window.addEventListener('goodwife-season', onSeason);
    return () => window.removeEventListener('goodwife-season', onSeason);
  }, []);

  // iframe 实际加载地址：视图编进 hash（课程地图无 hash，保持干净 URL）
  const activeView = VIEWS.find((v) => v.key === view) ?? VIEWS[0];
  const src =
    current && activeView.key !== 'map' ? `${current.src}${activeView.hash}` : current?.src ?? '';

  const pickSeason = (id: string) => {
    setSelected(id);
    setView('map'); // 换季回到该季课程地图
  };

  return (
    <div className="flex w-full flex-col md:flex-row">
      {/* 左侧栏：上半季列表 + 下半本季页面（视觉对齐兰香如故） */}
      <aside className="shrink-0 border-b border-[#E8E8E6] p-3 dark:border-[#2C2C2E] md:h-[calc(100vh-128px)] md:w-60 md:overflow-y-auto md:border-b-0 md:border-r">
        <div className="mb-2 px-1 text-[10px] uppercase tracking-[0.18em] text-[#B89F6B]">
          The Good Wife
        </div>
        <div className="flex gap-1.5 overflow-x-auto md:flex-col md:overflow-visible">
          {SEASONS.map((s) => {
            const isCurrent = s.id === selected;
            return (
              <button
                key={s.id}
                id={`goodwife-${s.id}`}
                onClick={() => pickSeason(s.id)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
                  isCurrent
                    ? 'bg-[#B89F6B] font-medium text-white'
                    : 'text-[#5F5F63] hover:text-[#B89F6B] dark:text-[#A1A1A6]'
                }`}
              >
                {s.label}
                <span className="ml-1.5 text-[10px] uppercase tracking-widest opacity-60">
                  {s.enLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* 本季页面：接管原子站顶栏的 课程地图 / 术语表 / 方法&版权 */}
        <div className="mb-2 mt-4 px-1 text-[10px] uppercase tracking-[0.18em] text-[#B89F6B]">
          本季页面
        </div>
        <div className="flex gap-1.5 overflow-x-auto md:flex-col md:overflow-visible">
          {VIEWS.map((v) => {
            const isCurrent = v.key === view;
            return (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
                  isCurrent
                    ? 'bg-[#B89F6B] font-medium text-white'
                    : 'text-[#5F5F63] hover:text-[#B89F6B] dark:text-[#A1A1A6]'
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>
      </aside>

      {/* 右侧：选中季 + 选中视图的静态子站（key 随季变化以重新载入；视图走 hash 不重载） */}
      <div className="min-w-0 flex-1">
        {current ? (
          <ThemeIframe
            key={current.id}
            src={src}
            title={`影视法律 · The Good Wife ${current.enLabel}`}
            darkMode={darkMode}
            id="tab-film-law-content"
            openUrl={src}
            openLabel="新窗口打开本季"
          />
        ) : (
          <div className="p-10 text-center text-sm text-[#86868B]">剧集整理中…</div>
        )}
      </div>
    </div>
  );
};
