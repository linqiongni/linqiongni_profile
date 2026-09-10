import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Key, Loader2, AlertCircle, CheckCircle2, Copy } from 'lucide-react';

// 这些只存在用户浏览器 localStorage，不进代码、不上传、不公开
const LS_KEY = 'lq_ds_key';
const LS_URL = 'lq_ds_url';
const LS_WEEK = 'lq_plan_week';
const DEFAULT_URL = 'https://api.deepseek.com/chat/completions';

const SYSTEM_PROMPT = `你是「餐饮加盟法务总监养成计划」的学习教练。这是一个面向中式快餐/米线连锁（参考蒙自源模式）法务总监的 16 周系统学习路线，覆盖八大知识模块：① 特许经营三件套（商业特许经营条例 / 备案管理办法 / 104号令）② 商标与品牌保护 ③ 招商与加盟合规 ④ 门店租赁 ⑤ 特许经营合同体系（11项必备条款、冷静期、区域保护）⑥ 食品安全与供应链 ⑦ 争议解决 ⑧ 用工、数据与预付卡。每周含 6-10 篇课程与实战交付物（合同模板、核对清单、SOP、研究报告等）。请始终基于这条路线，给出贴合法务总监养成目标、可落地的学习建议。`;

export const DevelopmentPlanTab: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1400);

  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState(DEFAULT_URL);
  const [week, setWeek] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // 载入本地已保存的设置
  useEffect(() => {
    const k = localStorage.getItem(LS_KEY);
    const u = localStorage.getItem(LS_URL);
    const w = localStorage.getItem(LS_WEEK);
    if (k) setApiKey(k);
    if (u) setApiUrl(u);
    if (w) setWeek(Number(w) || 1);
  }, []);

  const saveSettings = () => {
    localStorage.setItem(LS_KEY, apiKey);
    localStorage.setItem(LS_URL, apiUrl);
    localStorage.setItem(LS_WEEK, String(week));
    setShowSettings(false);
  };

  const handleLoad = () => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      const h = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
      if (h > 0) setHeight(h);
    } catch {
      /* 跨域兜底 */
    }
  };

  const generate = async () => {
    setError('');
    if (!apiKey.trim()) {
      setError('请先在「设置」里填入 DeepSeek API Key。');
      setShowSettings(true);
      return;
    }
    setLoading(true);
    setResult('');
    setCopied(false);
    const today = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
    const userPrompt = `今天是 ${today}。假设我正处于第 ${week} 周的学习。请生成【今日学习计划】，要求：\n1) 给 3-4 个具体可执行任务，每个含【主题】【目标】【建议时长】；\n2) 标明所属知识模块；\n3) 给出一个当天可交付的小成果（如一段条款草稿 / 一张核对清单 / 一篇笔记要点）；\n4) 用中文，分点清晰，不要冗长。`;
    try {
      const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          stream: false,
        }),
      });
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`DeepSeek 返回 ${resp.status}：${errText.slice(0, 240)}`);
      }
      const data = await resp.json();
      const text = data?.choices?.[0]?.message?.content ?? '';
      if (!text) throw new Error('模型返回为空，请重试。');
      setResult(text);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '调用失败，请检查网络 / API Key / API 地址。';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 忽略 */
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span className="w-1.5 h-6 rounded-full bg-[#B89F6B]" />
        <h2 className="text-2xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
          餐饮加盟法务总监养成计划
        </h2>
      </div>
      <p className="text-sm text-[#86868B] mb-6 leading-relaxed">
        16 周系统学习路线完整版（下方原版交互页面可内部滚动）。点「一键生成今日计划」，由 DeepSeek 智能体基于本路线为你输出当日可执行计划。
      </p>

      {/* 智能体生成区 */}
      <div className="rounded-2xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/60 dark:bg-[#161618]/60 p-5 mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[#1D1D1F] dark:text-[#F5F5F7]">
            <Sparkles size={18} className="text-[#B89F6B]" />
            <span className="font-medium">AI 今日计划生成器</span>
          </div>
          <button
            onClick={() => setShowSettings((s) => !s)}
            className="flex items-center gap-1.5 text-xs text-[#86868B] hover:text-[#B89F6B] transition-colors"
          >
            <Key size={14} />
            {showSettings ? '收起设置' : '设置'}
          </button>
        </div>

        {/* 设置面板 */}
        {showSettings && (
          <div className="mb-4 space-y-3 rounded-xl bg-[#FDFCF9] dark:bg-[#1C1C1E] p-4 border border-[#E8E8E6] dark:border-[#2C2C2E]">
            <div>
              <label className="block text-xs text-[#86868B] mb-1">
                DeepSeek API Key（仅存本机浏览器，不上传）
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-xxxxxxxx"
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white dark:bg-[#161618] text-[#1D1D1F] dark:text-[#F5F5F7] outline-none focus:border-[#B89F6B]"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-[#86868B] mb-1">
                  当前周数（1–16）
                </label>
                <input
                  type="number"
                  min={1}
                  max={16}
                  value={week}
                  onChange={(e) =>
                    setWeek(Math.min(16, Math.max(1, Number(e.target.value) || 1)))
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white dark:bg-[#161618] text-[#1D1D1F] dark:text-[#F5F5F7] outline-none focus:border-[#B89F6B]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-[#86868B] mb-1">
                  API 地址（一般不用改）
                </label>
                <input
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white dark:bg-[#161618] text-[#1D1D1F] dark:text-[#F5F5F7] outline-none focus:border-[#B89F6B]"
                />
              </div>
            </div>
            <button
              onClick={saveSettings}
              className="px-4 py-2 text-sm rounded-lg bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F] hover:opacity-90 transition-opacity"
            >
              保存设置
            </button>
          </div>
        )}

        <button
          onClick={generate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#B89F6B] text-white font-medium hover:bg-[#A88F5C] transition-colors disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              智能体正在生成…
            </>
          ) : (
            <>
              <Sparkles size={18} />
              一键生成今日计划
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg p-3">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
                <CheckCircle2 size={16} className="text-[#B89F6B]" />
                今日计划
              </div>
              <button
                onClick={copyResult}
                className="flex items-center gap-1 text-xs text-[#86868B] hover:text-[#B89F6B] transition-colors"
              >
                <Copy size={13} />
                {copied ? '已复制' : '复制'}
              </button>
            </div>
            <div className="rounded-xl bg-[#FDFCF9] dark:bg-[#1C1C1E] border border-[#E8E8E6] dark:border-[#2C2C2E] p-4 text-sm leading-relaxed text-[#1D1D1F] dark:text-[#F5F5F7] whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>

      {/* 原版养成计划 HTML */}
      <div className="rounded-2xl overflow-hidden border border-[#E8E8E6] dark:border-[#2C2C2E] shadow-[0_8px_30px_rgba(0,0,0,0.05)] bg-white dark:bg-[#161618]">
        <iframe
          ref={iframeRef}
          src="/development-plan.html"
          title="餐饮加盟法务总监养成计划"
          onLoad={handleLoad}
          className="block w-full"
          style={{ height, border: 'none' }}
        />
      </div>
    </div>
  );
};
