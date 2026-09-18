import React from 'react';

/**
 * 创业奇思妙想章：虚拟创业推演小说《屿见》。
 * 内容为 public/startup/ 下的独立静态站点，此处用全宽 iframe 嵌入，
 * 与「个人 / 法务实务 / 影视法律」并列的顶层分组「创业奇思妙想章」下。
 */
export const StartupTab: React.FC = () => {
  return (
    <div id="tab-startup-content" className="w-full" style={{ height: 'calc(100vh - 128px)' }}>
      <iframe
        src="/startup/"
        title="创业奇思妙想章 · 屿见 —— 一个广州法务的下山记"
        className="block w-full h-full border-0"
      />
    </div>
  );
};
