import React from 'react';

/**
 * 影视法律 · 基于《傲骨贤战》(The Good Wife) 的法律英语学习站。
 * 内容为 public/film-law/ 下的独立静态 SPA，此处用全宽 iframe 嵌入，
 * 作为「个人 / 法务实务」之后的第三个顶层导航分组。
 */
export const FilmLawTab: React.FC = () => {
  return (
    <div id="tab-film-law-content" className="w-full" style={{ height: 'calc(100vh - 80px)' }}>
      <iframe
        src="/film-law/"
        title="影视法律 · The Good Wife 法律英语学习"
        className="block w-full h-full border-0"
      />
    </div>
  );
};
