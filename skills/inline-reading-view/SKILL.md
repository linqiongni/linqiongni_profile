---
name: inline-reading-view
description: linqiongni.top 主站（linqiongni_profile 仓库）里把「跳转/新开标签页/弹窗打开的内容」改成「当前页打开」——点击后整个 tab 内容区换出成阅读视图（透明 iframe + 面包屑返回）。当用户说「跟上次一样改成当前页打开这种形式」「在当前页打开」「当页展示」「点卡片不要跳走」「不要用弹窗」时立即加载本技能，照模板改 React tab 组件，不要重新设计方案。
agent_created: true
---

# 当前页打开：tab 内容区换出阅读视图

## 用户口径（Andy 拍板过三次，别再返工）

- ✅ **要的**：点卡片 → **整个 tab 内容区换出**成阅读视图（透明 iframe + 面包屑「‹ 上级 › 当前」），内容直接在眼前，能看到主站固定背景和鱼影。
- ❌ **不要的**：① 跳走当前页 + 返回按钮（09-28 被否）；② 模态弹窗（09-28 被否）；③ `target="_blank"` 新开标签页（09-29 涉外合同被否）。
- 有多个文档时（如加盟经销课程）面包屑右侧加「下一天 / 下一周」按钮；只有一个文档时（如涉外合同指南）只做返回。

---

## 一、四步走（照抄，不要自创）

### ① 确认挂载方式
`grep -rn "<XxxTab" src/App.tsx` —— 必须是 **inline 组件分支**（如 `{activeTab === 'foreign-contracts' && <ForeignContractTab />}`），
内容在 `#app-scroll` 滚动容器内。若是 iframe 子站（`ThemeIframe` / `public/<slug>/`），那是另一条路，不适用本技能。

### ② 给 tab 组件加换出状态
```tsx
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export const XxxTab: React.FC = () => {
  const [reading, setReading] = useState(false);   // 多文档：{ weekId, lessonId } | null

  // 打开阅读视图时把主滚动容器带回顶部（换出后内容变短，避免停留在页脚）
  useEffect(() => {
    if (reading) {
      const el = document.getElementById('app-scroll');
      if (el) el.scrollTo({ top: 0 });
    }
  }, [reading]);

  if (reading) { /* 见 ③ */ }
  return (/* 原总览内容，卡片按钮改成 onClick={() => setReading(true)} */);
};
```

### ③ 阅读视图本体（透明 iframe + 面包屑）
```tsx
if (reading) {
  return (
    <div id="tab-xxx-content" className="py-6">
      <div className="flex items-center justify-between gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setReading(false)}
            className="group flex items-center gap-1 text-[#B89F6B] hover:text-[#A8905C] transition-colors shrink-0"
          >
            <ChevronLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
            {上级名称}
          </button>
          <span className="text-[#86868B]">›</span>
          <span className="text-[#86868B] truncate">{当前文档名}</span>
        </div>
      </div>
      <iframe
        key={URL}
        src={URL}
        title={当前文档名}
        className="w-full rounded-2xl border border-[#E8E8E6]/50 dark:border-[#2C2C2E]/70 bg-transparent h-[calc(100dvh-12.5rem)] md:h-[calc(100dvh-14.5rem)]"
      />
    </div>
  );
}
```
高度类、面包屑样式与 `CateringLegalTab.tsx` 保持一致（用户认可的基准）；iframe **必须 `bg-transparent`**（见 fixed-bg-fish-bug 铁律）。

### ④ 核对被嵌入页的「交互态底色」是否进了玻璃化白名单
**这一步最容易漏**（09-29 涉外合同实锤）：被嵌入的页面若有胶囊/目录条（选中态底色随 class 切换），
先 `grep` 它的类名——玻璃化豁免白名单只认 ① class 含 `tab` ② `nav.tabs` 内的按钮。
类名不在这两类里 → 选中态底色会被清透后永久救不回（死锁），必须补进金本白名单：
`scripts/theme-kit/embedded_kit.txt` 里两处条件
`el.classList.contains("tab")||(el.closest&&el.closest("nav.tabs"))`，改完跑
`python3 scripts/apply-theme-kit.py --fix public/lessons public/ai-law ...`（全量子站目录）全量刷新，
再 `node --check` 抽查提取的脚本。

---

## 二、验收（缺一项就别提交）

1. `npx tsc --noEmit` 必须通过（漏了的表现是「导航按钮没出现」而不是报错）。
2. 起 dev：`npm run dev`（**不要 `npm run build`**，会清空 dist，构建交给 CI），端口常是 3003。
3. 浏览器实测三件事：
   - 点卡片 → 内容区换出、iframe `html`/`body` 背景 = `rgba(0, 0, 0, 0)`、鱼影透出；
   - iframe 内切胶囊 → 选中态底色正确（金底/深金渐变），面板全透明；
   - 点面包屑 → 回到总览，卡片按钮还在。
4. **探针前先验 iframe 里跑的是不是新脚本**（`d.getElementById('embedded-glassify').textContent.includes('新标记')`），否则浏览器缓存给你假读数。
5. 动了金本就必须跑 fixed-bg-fish-bug 技能里的玻璃化回归清单（顶栏/搜索框/侧栏/胶囊/大卡/引用块/切 tab 滚动逐项探针）。

---

## 三、上线与核验

- 提交即触发 hook 推 GitHub + Gitee 镜像（国内线常通，GitHub 常瞬时断网 → 后台 `git ls-remote` 每 60s 探活，通了 bypass 代理直推，别狂试）。
- CI 约 3–5 分钟。**React 源码改动**的线上核验：抓 `https://linqiongni.top/` 的 index.html → 取其中 JS 资产路径 → `?cb=$(date +%s)` 抓下来 grep 新标记（如「当页打开」）。
  **public/ 子页改动**：直接 `curl "<url>?cb=$(date +%s)" | grep -c 新标记`（GH Pages HTML 有约 10 分钟 CDN 缓存，不打 cb 会假阴性）。
- 报「已上线」前必须真的探测到新标记；探测不到就说「没验成」。

---

## 四、坑位（都是踩过的）

- 浏览器里点子 tab 前要先展开分组（导航收起时按钮不在 DOM 里，探针会报「找不到」）。
- 内容区面包屑返回按钮与导航里的同名子 tab 都含「涉外合同学习」字样，探针要限定在 `#tab-xxx-content` 内查找，否则点错会切走 tab。
- `agent-browser eval` 里嵌套 `setTimeout` 一旦抛异常，Promise 永不 resolve，会静默返回 `{}`——**拆成多步 eval + `sleep`，别写长链**。
- 改了 `public/<站>/assets/*.js|css` 必须 bump 该站 index.html 的 `?v=`；React 源码不需要（CI 重新打包带 hash）。
- 修完在等用户验收时，要明确告诉用户「线上还是旧的」，否则用户测线上会报「没改完整」（09-29 实锤）。
