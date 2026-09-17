(function () {
  'use strict';

  const STORAGE_KEY = 'site_theme';
  const LIGHT_CSS = '/theme-light.css';
  const LIGHT_LINK_ID = 'theme-light-link';
  const OVERRIDE_IDS = ['light-theme-override-v2', 'light-theme-override-v3'];

  const root = document.documentElement;

  const hasEmbeddedOverride = OVERRIDE_IDS.some(id => !!document.getElementById(id));
  const defaultAttr = root.getAttribute('data-theme-default')
    || (hasEmbeddedOverride ? 'light' : 'dark');

  function getSaved() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function save(mode) {
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) {}
  }

  function setEmbeddedOverride(enabled) {
    OVERRIDE_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.disabled = !enabled;
    });
  }

  function loadLightCss(enabled) {
    if (defaultAttr !== 'dark') return; // only for pages whose native look is dark
    let link = document.getElementById(LIGHT_LINK_ID);
    if (enabled) {
      if (!link) {
        link = document.createElement('link');
        link.id = LIGHT_LINK_ID;
        link.rel = 'stylesheet';
        link.href = LIGHT_CSS;
        document.head.appendChild(link);
      }
    } else if (link) {
      link.remove();
    }
  }

  function applyTheme(mode) {
    if (mode !== 'dark') mode = 'light';
    root.setAttribute('data-theme', mode);

    if (hasEmbeddedOverride) {
      setEmbeddedOverride(mode === 'light');
    } else if (defaultAttr === 'dark') {
      loadLightCss(mode === 'light');
    }
    // pages with data-theme-default="light" rely on their own [data-theme="dark"] CSS
  }

  function setTheme(mode, opts) {
    opts = opts || {};
    save(mode);
    applyTheme(mode);
    updateBtn();
    if (!opts.silent) {
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'theme', mode: mode }, '*');
        }
      } catch (e) {}
    }
  }

  function updateBtn() {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    btn.textContent = isDark ? '切换浅色' : '切换深色';
    btn.title = isDark ? '切换至浅色模式' : '切换至深色模式';
  }

  function createBtn() {
    if (document.getElementById('theme-toggle-btn')) return;

    const isDark = root.getAttribute('data-theme') === 'dark';
    const btn = document.createElement('button');
    btn.id = 'theme-toggle-btn';
    btn.type = 'button';
    btn.textContent = isDark ? '切换浅色' : '切换深色';
    btn.title = isDark ? '切换至浅色模式' : '切换至深色模式';
    btn.setAttribute('aria-label', '切换深色 / 浅色');

    // 固定位于 iframe 内容区右上角、主站「新窗口打开」浮层下方，避免重叠
    btn.style.cssText = [
      'position:fixed',
      'top:56px',
      'right:16px',
      'z-index:9999',
      'padding:6px 14px',
      'border:1px solid var(--line, var(--line2, #CFCABE))',
      'border-radius:2px',
      'background:var(--card, var(--panel, var(--bg2, #FDFCF9)))',
      'color:var(--tx, var(--ink, var(--txt, #1D1D1F)))',
      'font-size:13px',
      'font-family:inherit',
      'cursor:pointer',
      'box-shadow:0 1px 3px rgba(0,0,0,.08)',
      'transition:border-color .15s, color .15s, background-color .15s'
    ].join(';');

    btn.addEventListener('mouseenter', function () {
      btn.style.borderColor = 'var(--gold, var(--accent, #B89F6B))';
      btn.style.color = 'var(--gold, var(--accent, #B89F6B))';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.borderColor = 'var(--line, var(--line2, #CFCABE))';
      btn.style.color = 'var(--tx, var(--ink, var(--txt, #1D1D1F)))';
    });

    btn.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });

    (document.body || root).appendChild(btn);
  }

  // 接收主站或其他 iframe 发来的主题消息
  window.addEventListener('message', function (e) {
    const d = e.data || {};
    if (d.type === 'theme' && (d.mode === 'light' || d.mode === 'dark')) {
      setTheme(d.mode, { silent: true });
    }
  });

  // 初始化：默认浅色，与主站保持一致
  const saved = getSaved() || 'light';
  setTheme(saved, { silent: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBtn);
  } else {
    createBtn();
  }
})();
