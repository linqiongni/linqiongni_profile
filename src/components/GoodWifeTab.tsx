import React, { useEffect, useState } from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 影视法律 · 傲骨贤妻（The Good Wife）法律英语学习站 hub。
 *
 * 与 LanxiangTab 同款「hub tab」结构：全局菜单只暴露一个「傲骨贤妻」入口，
 * 季列表收在 tab 内部左侧栏，右侧用全宽 iframe 嵌入选中季的静态子站
 * （public 下的 film-law 系列子站页）。
 *
 * 子站页内的「S2 · 第二季 →」等互链会 postMessage('site-tab-navigate')，
 * 由 App.tsx 转成 CustomEvent('goodwife-season') 派发到这里同步选中态——
 * 保证切季后左侧栏高亮跟着走、全局 tab 始终停在 film-law。
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
  { id: 'film-law', label: 'S1', enLabel: 'Season 1', src: '/film-law/index.html?v=20260929hub' },
  { id: 'film-law-s2', label: 'S2', enLabel: 'Season 2', src: '/film-law-s2/index.html?v=20260929hub' },
  { id: 'film-law-s3', label: 'S3', enLabel: 'Season 3', src: '/film-law-s3/index.html?v=20260929hub' },
  { id: 'film-law-s4', label: 'S4', enLabel: 'Season 4', src: '/film-law-s4/index.html?v=20260929hub' },
];

export const GoodWifeTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => {
  const [selected, setSelected] = useState<string>(SEASONS[0]?.id ?? 'film-law');
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

  return (
    <div className="flex w-full flex-col md:flex-row">
      {/* 左侧季列表栏：桌面竖向固定，移动端横向滚动（视觉对齐兰香如故） */}
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
                onClick={() => setSelected(s.id)}
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
      </aside>

      {/* 右侧：选中季的静态子站（key 随选中变化以重新载入） */}
      <div className="min-w-0 flex-1">
        {current ? (
          <ThemeIframe
            key={current.id}
            src={current.src}
            title={`影视法律 · The Good Wife ${current.enLabel}`}
            darkMode={darkMode}
            id="tab-film-law-content"
            openUrl={current.src}
            openLabel="新窗口打开本季"
          />
        ) : (
          <div className="p-10 text-center text-sm text-[#86868B]">剧集整理中…</div>
        )}
      </div>
    </div>
  );
};
