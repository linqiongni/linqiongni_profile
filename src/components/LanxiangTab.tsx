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
  { id: 'ep01', label: 'EP01', enLabel: 'Episode 01', src: '/lanxiang/EP01.html?v=20260929g' },
  { id: 'ep02', label: 'EP02', enLabel: 'Episode 02', src: '/lanxiang/EP02.html?v=20260929f' },
  { id: 'ep03', label: 'EP03', enLabel: 'Episode 03', src: '/lanxiang/EP03.html?v=20260929g' },
  { id: 'ep04', label: 'EP04', enLabel: 'Episode 04', src: '/lanxiang/EP04.html?v=20260929g' },
  { id: 'ep05', label: 'EP05', enLabel: 'Episode 05', src: '/lanxiang/EP05.html?v=20260929g' },
  { id: 'ep06', label: 'EP06', enLabel: 'Episode 06', src: '/lanxiang/EP06.html?v=20260929f' },
  { id: 'ep07', label: 'EP07', enLabel: 'Episode 07', src: '/lanxiang/EP07.html?v=20260929g' },
  { id: 'ep08', label: 'EP08', enLabel: 'Episode 08', src: '/lanxiang/EP08.html?v=20260929i' },
  { id: 'ep09', label: 'EP09', enLabel: 'Episode 09', src: '/lanxiang/EP09.html?v=20260930a' },
  { id: 'ep10', label: 'EP10', enLabel: 'Episode 10', src: '/lanxiang/EP10.html?v=20260930a' },
  { id: 'ep11', label: 'EP11', enLabel: 'Episode 11', src: '/lanxiang/EP11.html?v=20260930a' },
  { id: 'ep12', label: 'EP12', enLabel: 'Episode 12', src: '/lanxiang/EP12.html?v=20260930a' },
  { id: 'ep13', label: 'EP13', enLabel: 'Episode 13', src: '/lanxiang/EP13.html?v=20260930a' },
  { id: 'ep14', label: 'EP14', enLabel: 'Episode 14', src: '/lanxiang/EP14.html?v=20260930a' },
  { id: 'ep15', label: 'EP15', enLabel: 'Episode 15', src: '/lanxiang/EP15.html?v=20260930a' },
  { id: 'ep16', label: 'EP16', enLabel: 'Episode 16', src: '/lanxiang/EP16.html?v=20261001b' },
  { id: 'ep17', label: 'EP17', enLabel: 'Episode 17', src: '/lanxiang/EP17.html?v=20261001b' },
  { id: 'ep18', label: 'EP18', enLabel: 'Episode 18', src: '/lanxiang/EP18.html?v=20261001b' },
  { id: 'ep19', label: 'EP19', enLabel: 'Episode 19', src: '/lanxiang/EP19.html?v=20261001b' },
  { id: 'ep20', label: 'EP20', enLabel: 'Episode 20', src: '/lanxiang/EP20.html?v=20261001b' },
  { id: 'ep21', label: 'EP21', enLabel: 'Episode 21', src: '/lanxiang/EP21.html?v=20261001b' },
  { id: 'ep22', label: 'EP22', enLabel: 'Episode 22', src: '/lanxiang/EP22.html?v=20261001b' },
  { id: 'ep23', label: 'EP23', enLabel: 'Episode 23', src: '/lanxiang/EP23.html?v=20261001b' },
  { id: 'ep24', label: 'EP24', enLabel: 'Episode 24', src: '/lanxiang/EP24.html?v=20261001b' },
  { id: 'ep25', label: 'EP25', enLabel: 'Episode 25', src: '/lanxiang/EP25.html?v=20261001b' },
  { id: 'ep26', label: 'EP26', enLabel: 'Episode 26', src: '/lanxiang/EP26.html?v=20261001b' },
  { id: 'ep27', label: 'EP27', enLabel: 'Episode 27', src: '/lanxiang/EP27.html?v=20261001b' },
  { id: 'ep28', label: 'EP28', enLabel: 'Episode 28', src: '/lanxiang/EP28.html?v=20261001b' },
  { id: 'ep29', label: 'EP29', enLabel: 'Episode 29', src: '/lanxiang/EP29.html?v=20261001b' },
  { id: 'ep30', label: 'EP30', enLabel: 'Episode 30', src: '/lanxiang/EP30.html?v=20261001b' },
  { id: 'ep31', label: 'EP31', enLabel: 'Episode 31', src: '/lanxiang/EP31.html?v=20261001b' },
  { id: 'ep32', label: 'EP32', enLabel: 'Episode 32', src: '/lanxiang/EP32.html?v=20261001b' },
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
