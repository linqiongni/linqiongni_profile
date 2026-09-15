import React from 'react';

/**
 * 影视法律 · 第二季：《傲骨贤妻》(The Good Wife) S2 法律英语学习站。
 * 内容为 public/film-law-s2/ 下的独立静态 SPA，此处用全宽 iframe 嵌入，
 * 挂在「影视法律」分组下，与 S1 (film-law) 并列为子 tab。
 */
export const FilmLawS2Tab: React.FC = () => {
  return (
    <div id="tab-film-law-s2-content" className="w-full" style={{ height: 'calc(100vh - 80px)' }}>
      <iframe
        src="/film-law-s2/"
        title="影视法律 · The Good Wife S2 法律英语学习"
        className="block w-full h-full border-0"
      />
    </div>
  );
};
