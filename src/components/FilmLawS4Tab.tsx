import React from 'react';

/**
 * 影视法律 · 第四季：《傲骨贤妻》(The Good Wife) S4 法律英语学习站。
 * 内容为 public/film-law-s4/ 下的独立静态 SPA，此处用全宽 iframe 嵌入，
 * 挂在「影视法律」分组下，与 S1 (film-law) / S2 (film-law-s2) / S3 (film-law-s3) 并列为子 tab。
 */
export const FilmLawS4Tab: React.FC = () => {
  return (
    <div id="tab-film-law-s4-content" className="w-full" style={{ height: 'calc(100vh - 128px)' }}>
      <iframe
        src="/film-law-s4/"
        title="影视法律 · The Good Wife S4 法律英语学习"
        className="block w-full h-full border-0"
      />
    </div>
  );
};
