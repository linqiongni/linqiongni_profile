# AGENTS.md — linqiongni_profile（个人主页）

> 工作规则：本文件先于任何「干活」请求读取。改动文件 / 外部状态前先读完 MEMORY.md 并遵守下述约定。

## 项目定位
- 个人主页 / 作品集站点（「林琼霓 · 港企珠宝法务」人设），含「餐饮加盟法务总监养成计划」等模块。
- 技术栈：Vite + React + TypeScript + Tailwind CSS v4 + motion（framer-motion v12）。
- 部署：GitHub Pages，CI 在 `.github/workflows/deploy.yml`（push main → `npm run build` → 发布，dist 不入库）。

## 红线 / 已踩坑
- **本地禁止 `npm run build`**：会清空 `dist/`（含 `dist/lessons` 等已发布资源），曾触发删除拦截。本地只做 `npx tsc --noEmit` 校验，构建交给 CI。
- 改完源码：直接 `git commit` + `git push origin main` 即上线（沙箱内 push 有时需提权放行）。
- 沙箱连 github.com:443 偶发失败，push 不通时让用户自推或稍后重试。

## 视觉与交互约定
- 主题：国风/极简，香槟金 `#B89F6B`、浅底 `#FDFCF9`、暗底 `#1C1C1E`；支持 light/dark。
- 图片偏好：默认彩色，不要黑白→hover 变彩（用户 2026-09-10 明确要求）。
- 为「餐饮法务」每周计划：点击「第 x 周第 x 天」标题即在新窗口打开该课全文（站内 `public/lessons/{id}.html`，免登录）；无站内版的跳资料库原文。不要恢复右侧「站内阅读」徽标与分享小图标（用户 2026-09-12 要求移除）。
- 全屏背景波纹（WaterRippleBackground）：走克制参数，动效首版必须保守，避免「滑动发晕」（已踩坑）。

## 外部依赖位置（只记位置，不记值）
- 资料库 SPACE_URL：`https://www.workbuddy.cn/space/d/kzNoDzerpCUhVoRTJDxKms`
- 课程全文抓取脚本：`scripts/`（add_lesson.py 等）
- 凭据 / token 不写入本仓库。

## 与法律工作流的区分
- 本仓库是「网站」，**不是** 案件材料库。案件 / 合同审阅请回到 Zcode 工作区与 Obsidian 餐饮加盟法务库，遵守保密边界。
