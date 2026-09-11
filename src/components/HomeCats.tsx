import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * 首页三只装饰猫咪（仅 Hero 第一屏可见，不拦截交互）
 * - 右上角：蜷成一团、尾巴卷成螺旋，像卷起来的书页
 * - 左下角：四脚朝天翻肚皮睡觉，飘 Zzz
 * - 右下角：坐着招手，配「hi，终于等到你～我是Andy」气泡
 * 配色用暖橙+奶白+棕描边，亮/暗模式下都清晰。
 */

// 调色板（与全站金棕调一致）
const COAT = '#F2C29B'; // 橘猫身体
const COAT_DARK = '#E59E6B'; // 阴影/条纹
const CREAM = '#FFF4E6'; // 肚皮/嘴周
const OUTLINE = '#6B5440'; // 暖棕描边（亮暗都可见）
const PINK = '#EFA6A6'; // 鼻/耳内/肉垫
const CHEEK = '#F6C7C2'; // 腮红

/* ---------- 右上角：蜷成书页卷的猫 ---------- */
const CurledCat: React.FC<{ reduce: boolean }> = ({ reduce }) => (
  <svg viewBox="0 0 180 170" className="w-full h-full overflow-visible" aria-hidden>
    {/* 影子 */}
    <ellipse cx="92" cy="150" rx="68" ry="11" fill="rgba(0,0,0,0.06)" />
    {/* 身体（蜷成圆） */}
    <path
      d="M42 112 C30 62 72 34 112 46 C152 58 166 102 140 132 C120 156 68 160 50 136 C44 127 42 120 42 112 Z"
      fill={COAT}
      stroke={OUTLINE}
      strokeWidth="3"
    />
    {/* 尾巴卷成螺旋（书页卷的意象） */}
    <path
      d="M138 128 C168 118 170 78 138 70 C116 64 110 90 130 98 C140 102 142 92 134 88"
      fill="none"
      stroke={COAT_DARK}
      strokeWidth="13"
      strokeLinecap="round"
    />
    {/* 头（埋在左侧） */}
    <circle cx="58" cy="114" r="27" fill={COAT} stroke={OUTLINE} strokeWidth="3" />
    {/* 耳朵 */}
    <path d="M40 94 L33 68 L58 86 Z" fill={COAT} stroke={OUTLINE} strokeWidth="3" />
    <path d="M70 86 L80 64 L84 92 Z" fill={COAT} stroke={OUTLINE} strokeWidth="3" />
    <path d="M44 88 L40 74 L54 84 Z" fill={PINK} />
    <path d="M72 84 L77 72 L79 88 Z" fill={PINK} />
    {/* 闭眼（满足的弧） */}
    <path d="M46 112 q7 7 14 0" fill="none" stroke={OUTLINE} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M60 112 q7 7 14 0" fill="none" stroke={OUTLINE} strokeWidth="2.5" strokeLinecap="round" />
    {/* 鼻 + 嘴 */}
    <path d="M58 122 l-4 4 h8 Z" fill={PINK} />
    <path d="M58 126 q-5 5 -10 2 M58 126 q5 5 10 2" fill="none" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
    {/* 前爪 */}
    <ellipse cx="48" cy="138" rx="11" ry="7" fill={COAT} stroke={OUTLINE} strokeWidth="2.5" />
  </svg>
);

/* ---------- 左下角：翻肚皮睡觉的猫 ---------- */
const SleepingCat: React.FC<{ reduce: boolean }> = ({ reduce }) => (
  <svg viewBox="0 0 200 150" className="w-full h-full overflow-visible" aria-hidden>
    <ellipse cx="100" cy="136" rx="84" ry="10" fill="rgba(0,0,0,0.06)" />
    {/* 身体（横躺） */}
    <ellipse cx="100" cy="96" rx="82" ry="42" fill={COAT} stroke={OUTLINE} strokeWidth="3" />
    {/* 露出的肚皮 */}
    <ellipse cx="100" cy="82" rx="58" ry="28" fill={CREAM} />
    {/* 四脚朝天 */}
    {[68, 92, 118, 144].map((x, i) => (
      <g key={i}>
        <rect x={x - 8} y="44" width="16" height="34" rx="8" fill={COAT} stroke={OUTLINE} strokeWidth="2.5" />
        <ellipse cx={x} cy="48" rx="6" ry="5" fill={PINK} />
      </g>
    ))}
    {/* 尾巴卷（右端） */}
    <path d="M178 96 C196 90 196 64 176 60 C162 57 158 74 172 80" fill="none" stroke={COAT_DARK} strokeWidth="11" strokeLinecap="round" />
    {/* 头（左端，后仰） */}
    <circle cx="30" cy="82" r="30" fill={COAT} stroke={OUTLINE} strokeWidth="3" />
    <path d="M10 64 L4 40 L28 58 Z" fill={COAT} stroke={OUTLINE} strokeWidth="3" />
    <path d="M40 58 L50 38 L52 64 Z" fill={COAT} stroke={OUTLINE} strokeWidth="3" />
    <path d="M14 58 L11 46 L24 56 Z" fill={PINK} />
    <path d="M42 56 L48 46 L50 60 Z" fill={PINK} />
    {/* 闭眼 */}
    <path d="M18 80 q7 7 14 0" fill="none" stroke={OUTLINE} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M34 80 q7 7 14 0" fill="none" stroke={OUTLINE} strokeWidth="2.5" strokeLinecap="round" />
    {/* 鼻 + 满足小嘴 */}
    <path d="M30 90 l-4 4 h8 Z" fill={PINK} />
    <path d="M30 94 q-4 4 -8 1 M30 94 q4 4 8 1" fill="none" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
    {/* Zzz */}
    {[
      { x: 60, y: 30, s: 12, d: 0 },
      { x: 74, y: 18, s: 15, d: 0.4 },
      { x: 92, y: 6, s: 18, d: 0.8 },
    ].map((z, i) => (
      <motion.text
        key={i}
        x={z.x}
        y={z.y}
        fontSize={z.s}
        fontFamily="'Comic Sans MS', 'PingFang SC', sans-serif"
        fontWeight="700"
        fill={OUTLINE}
        initial={{ opacity: 0, y: 6 }}
        animate={reduce ? { opacity: 0.8 } : { opacity: [0, 0.9, 0.9, 0], y: [6, -4, -4, -12] }}
        transition={reduce ? {} : { duration: 3.2, delay: z.d, repeat: Infinity, ease: 'easeInOut' }}
      >
        z
      </motion.text>
    ))}
  </svg>
);

/* ---------- 右下角：坐着招手的猫 ---------- */
const WavingCat: React.FC<{ reduce: boolean }> = ({ reduce }) => (
  <svg viewBox="0 0 160 180" className="w-full h-full overflow-visible" aria-hidden>
    <ellipse cx="80" cy="168" rx="54" ry="9" fill="rgba(0,0,0,0.06)" />
    {/* 身体 */}
    <ellipse cx="80" cy="122" rx="46" ry="50" fill={COAT} stroke={OUTLINE} strokeWidth="3" />
    <ellipse cx="80" cy="128" rx="28" ry="36" fill={CREAM} />
    {/* 尾巴（右底卷） */}
    <path d="M122 150 C150 150 152 116 128 110 C114 106 110 124 124 130" fill="none" stroke={COAT_DARK} strokeWidth="12" strokeLinecap="round" />
    {/* 头 */}
    <circle cx="80" cy="62" r="34" fill={COAT} stroke={OUTLINE} strokeWidth="3" />
    <path d="M52 44 L46 16 L74 38 Z" fill={COAT} stroke={OUTLINE} strokeWidth="3" />
    <path d="M108 44 L114 16 L86 38 Z" fill={COAT} stroke={OUTLINE} strokeWidth="3" />
    <path d="M56 40 L52 24 L68 36 Z" fill={PINK} />
    <path d="M104 40 L108 24 L92 36 Z" fill={PINK} />
    {/* 眼睛（圆亮，带高光） */}
    <circle cx="68" cy="60" r="5.5" fill={OUTLINE} />
    <circle cx="92" cy="60" r="5.5" fill={OUTLINE} />
    <circle cx="69.5" cy="58.5" r="1.8" fill="#fff" />
    <circle cx="93.5" cy="58.5" r="1.8" fill="#fff" />
    {/* 腮红 */}
    <ellipse cx="60" cy="72" rx="6" ry="4" fill={CHEEK} opacity="0.8" />
    <ellipse cx="100" cy="72" rx="6" ry="4" fill={CHEEK} opacity="0.8" />
    {/* 鼻 + 嘴 */}
    <path d="M80 70 l-4 4 h8 Z" fill={PINK} />
    <path d="M80 74 q-5 5 -9 2 M80 74 q5 5 9 2" fill="none" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
    {/* 前爪 */}
    <ellipse cx="64" cy="162" rx="11" ry="8" fill={COAT} stroke={OUTLINE} strokeWidth="2.5" />
    <ellipse cx="96" cy="162" rx="11" ry="8" fill={COAT} stroke={OUTLINE} strokeWidth="2.5" />
    {/* 招手的那只爪（绕肩旋转） */}
    <motion.g
      style={{ transformBox: 'fill-box', transformOrigin: '50% 95%' }}
      animate={reduce ? {} : { rotate: [0, -22, 0] }}
      transition={reduce ? {} : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path d="M118 96 q22 -10 30 -30" fill="none" stroke={COAT} strokeWidth="13" strokeLinecap="round" />
      <circle cx="148" cy="64" r="10" fill={COAT} stroke={OUTLINE} strokeWidth="2.5" />
    </motion.g>
  </svg>
);

export const HomeCats: React.FC = () => {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none select-none">
      {/* 右上角：蜷成书页卷 */}
      <motion.div
        className="absolute top-24 right-3 sm:right-8 lg:right-14 w-24 sm:w-32 lg:w-40 -rotate-6"
        animate={reduce ? {} : { scale: [1, 1.03, 1], rotate: [-6, -4, -6] }}
        transition={reduce ? {} : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <CurledCat reduce={reduce} />
      </motion.div>

      {/* 左下角：翻肚皮睡觉 */}
      <motion.div
        className="absolute bottom-16 left-2 sm:left-8 lg:left-14 w-28 sm:w-40 lg:w-52"
        animate={reduce ? {} : { scale: [1, 1.025, 1] }}
        transition={reduce ? {} : { duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <SleepingCat reduce={reduce} />
      </motion.div>

      {/* 右下角：招手 + 气泡 */}
      <div className="absolute bottom-16 right-3 sm:right-10 lg:right-16 w-24 sm:w-32 lg:w-40">
        <div className="relative">
          {/* 气泡 */}
          <motion.div
            className="absolute -top-2 left-0 -translate-x-[105%] hidden sm:block"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={reduce ? { opacity: 1, y: 0 } : { opacity: [0, 1, 1, 1], y: [8, 0, 0, -4] }}
            transition={reduce ? {} : { duration: 4, delay: 0.8, repeat: Infinity, repeatDelay: 1.5, ease: 'easeOut' }}
          >
            <div className="relative whitespace-nowrap rounded-2xl bg-white/90 dark:bg-[#2C2C2E]/90 border border-[#B89F6B]/50 px-3.5 py-2 text-[13px] sm:text-sm text-[#6B5440] dark:text-[#F5F5F7] shadow-sm">
              hi，终于等到你～我是Andy
              <span className="absolute top-1/2 right-0 translate-x-full -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[8px] border-l-[#B89F6B]/50" />
            </div>
          </motion.div>
          <WavingCat reduce={reduce} />
        </div>
      </div>
    </div>
  );
};
