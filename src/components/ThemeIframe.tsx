import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface ThemeIframeProps {
  src: string;
  title: string;
  darkMode: boolean;
  /** 外层 wrapper 的 id（部分 tab 用作锚点） */
  id?: string;
  /**
   * 右下角浮层按钮：
   * - 不传（undefined）→ 显示「新窗口打开」，地址 = src，点击会重载 iframe 拉取最新
   * - 传具体地址（如手册页）→ 显示按钮，地址 = 该地址，点击不重载 iframe
   * - 传 null → 不显示按钮
   */
  openUrl?: string | null;
  openLabel?: string;
  /** iframe 高度等样式（默认铺满视口，与既有 tab 一致） */
  iframeClassName?: string;
}

const DEFAULT_IFRAME_CLASS =
  'block w-full border-0 bg-white dark:bg-[#1C1C1E] h-[calc(100vh-80px)] md:h-[calc(100vh-128px)]';

/**
 * 统一的 iframe 容器：把主站 darkMode 通过 postMessage 同步进 iframe 内部。
 * iframe 页需引入 /theme-toggle.js（监听 {type:'theme',mode}），或用自身兼容的消息监听。
 * 抽此组件是为了避免 11 个 tab 重复同一套 postMessage 逻辑。
 */
export const ThemeIframe: React.FC<ThemeIframeProps> = ({
  src,
  title,
  darkMode,
  id,
  openUrl,
  openLabel = '新窗口打开',
  iframeClassName = DEFAULT_IFRAME_CLASS,
}) => {
  const [loading, setLoading] = useState(true);
  const [loadedTick, setLoadedTick] = useState(0);
  const [nonce, setNonce] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // 主站主题变化时，同步进 iframe（监听器在 iframe 页尾脚本注册，需等 onLoad 后再发）
  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win || loading) return;
    try {
      win.postMessage({ type: 'theme', mode: darkMode ? 'dark' : 'light' }, '*');
    } catch (e) {
      /* 跨域等异常忽略 */
    }
  }, [darkMode, loading, loadedTick, nonce, iframeRef]);

  const showButton = openUrl !== null;
  const resolvedOpenUrl = openUrl ?? src;
  // 默认（未显式指定 openUrl）按钮地址等于 src，点击重载 iframe 拉取最新
  const reloadOnOpen = openUrl === undefined;

  return (
    <div className="relative w-full" id={id}>
      <div className="relative w-full bg-white dark:bg-[#1C1C1E]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white dark:bg-[#1C1C1E]">
            <div className="flex items-center gap-2 text-xs text-[#86868B]">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#B89F6B] border-t-transparent animate-spin" />
              正在载入…
            </div>
          </div>
        )}
        <iframe
          key={nonce}
          ref={iframeRef}
          src={src}
          title={title}
          onLoad={() => {
            setLoading(false);
            setLoadedTick((t) => t + 1);
          }}
          className={iframeClassName}
          loading="eager"
          // 允许 iframe 内的静态站自己调用 Fullscreen API（融资法务站顶栏的「全屏」按钮）
          allow="fullscreen"
        />
      </div>

      {showButton && (
        <a
          href={resolvedOpenUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => reloadOnOpen && setNonce((n) => n + 1)}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#B89F6B] text-white text-xs font-medium shadow-lg hover:bg-[#A8905C] transition-colors"
        >
          <ExternalLink size={12} />
          {openLabel}
        </a>
      )}
    </div>
  );
};
