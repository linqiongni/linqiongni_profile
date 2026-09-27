import React, { useEffect, useState } from 'react';

/**
 * 实时香港时间：无边框内嵌小字，带一个极淡脉冲金点。置于首页低调处。
 */
export const LiveClock: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('zh-HK', {
      timeZone: 'Asia/Hong_Kong',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 text-[11px] tracking-wide text-[#86868B] dark:text-[#8E8E93] select-none">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B89F6B] opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#B89F6B]" />
      </span>
      <span>香港时间 · {time}</span>
    </div>
  );
};
