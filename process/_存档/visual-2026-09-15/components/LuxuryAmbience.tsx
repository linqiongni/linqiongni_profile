import React from 'react';

/**
 * 静态奢华氛围层：暗/浅底各叠极淡香槟金光晕 + 细颗粒质感（丝绒/纸感）。
 * 解决背景「单调」；不随鼠标动，纯氛围。pointer-events-none，置于内容之下。
 */
export const LuxuryAmbience: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none luxury-ambient"
      aria-hidden="true"
    >
      <div className="absolute inset-0 grain-overlay opacity-[0.035] mix-blend-soft-light dark:opacity-[0.05] dark:mix-blend-overlay" />
    </div>
  );
};
