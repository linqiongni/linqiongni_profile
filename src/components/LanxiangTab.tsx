import React, { useState } from 'react';
import { ThemeIframe } from './ThemeIframe';

/**
 * 影视法律 · 兰香如故（The Fragrance of Orchids Remains）英文有声剧集。
 *
 * 设计为「hub tab」：全局菜单只暴露一个「兰香如故」入口，剧集列表收在 tab 内部左侧栏，
 * 右侧用全宽 iframe 嵌入选中的某一集静态页（public/lanxiang/EPxx.html）。
 * 这样 37 集不会把顶层导航撑爆——分层次放在 tab 内而非全局菜单里。
 *
 * 新增一集：往下方 EPISODES 数组追加一行即可（html 放进 public/lanxiang/）。
 */
interface Episode {
  id: string;
  label: string;
  enLabel: string;
  src: string;
}

const EPISODES: Episode[] = [
  { id: 'ep01', label: 'EP01', enLabel: 'Episode 01', src: '/lanxiang/EP01.html?v=20260929c' },
  { id: 'ep02', label: 'EP02', enLabel: 'Episode 02', src: '/lanxiang/EP02.html?v=20260929e' },
  { id: 'ep03', label: 'EP03', enLabel: 'Episode 03', src: '/lanxiang/EP03.html?v=20260929e' },
  { id: 'ep04', label: 'EP04', enLabel: 'Episode 04', src: '/lanxiang/EP04.html?v=20260929e' },
  { id: 'ep05', label: 'EP05', enLabel: 'Episode 05', src: '/lanxiang/EP05.html?v=20260929e' },
  { id: 'ep06', label: 'EP06', enLabel: 'Episode 06', src: '/lanxiang/EP06.html?v=20260929e' },
  // EP07–EP37 续做时在此追加一行（html + _audio.mp3 放进 public/lanxiang/，由 兰香如故/工具/gen_story.py 生成）
];

export const LanxiangTab: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => {
  const [selected, setSelected] = useState<string>(EPISODES[0]?.id ?? '');
  const current = EPISODES.find((e) => e.id === selected) ?? EPISODES[0];

  return (
    <div className="flex w-full flex-col md:flex-row">
      {/* 左侧剧集栏：桌面竖向固定，移动端横向滚动 */}
      <aside className="shrink-0 border-b border-[#E8E8E6] p-3 dark:border-[#2C2C2E] md:h-[calc(100vh-128px)] md:w-60 md:overflow-y-auto md:border-b-0 md:border-r">
        <div className="mb-2 px-1 text-[10px] uppercase tracking-[0.18em] text-[#B89F6B]">
          The Fragrance of Orchids
        </div>
        <div className="flex gap-1.5 overflow-x-auto md:flex-col md:overflow-visible">
          {EPISODES.map((ep) => {
            const isCurrent = ep.id === selected;
            return (
              <button
                key={ep.id}
                id={`lanxiang-${ep.id}`}
                onClick={() => setSelected(ep.id)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
                  isCurrent
                    ? 'bg-[#B89F6B] font-medium text-white'
                    : 'text-[#5F5F63] hover:text-[#B89F6B] dark:text-[#A1A1A6]'
                }`}
              >
                {ep.label}
                <span className="ml-1.5 text-[10px] uppercase tracking-widest opacity-60">
                  {ep.enLabel.replace('Episode ', 'EP')}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* 右侧：选中集的静态页（key 随选中变化以重新载入） */}
      <div className="min-w-0 flex-1">
        {current ? (
          <ThemeIframe
            key={current.id}
            src={current.src}
            title={`兰香如故 · ${current.label}`}
            darkMode={darkMode}
            id="tab-lanxiang-content"
            openUrl={current.src}
            openLabel="新窗口打开本集"
          />
        ) : (
          <div className="p-10 text-center text-sm text-[#86868B]">剧集整理中…</div>
        )}
      </div>
    </div>
  );
};
