import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Scale,
  ScrollText,
  Copyright,
  Megaphone,
  Store,
  FileSignature,
  UtensilsCrossed,
  Gavel,
  Users,
  ChevronDown,
  ExternalLink,
  GraduationCap,
  CalendarDays,
  BookOpen,
  Target,
  ClipboardCheck,
  Link2,
  Sparkles,
  ArrowUpRight,
  X,
} from 'lucide-react';

// ── 数据源（来自 WorkBuddy 资料库「餐饮加盟法务总监养成计划」）──
const SPACE_URL = 'https://www.workbuddy.cn/space/d/kzNoDzerpCUhVoRTJDxKms';

const STATS = [
  { label: '学习周期', value: '16 周', sub: '4 阶段能力跃迁' },
  { label: '工作日主题', value: '80 天', sub: '每天一个主题 + 一份产出物' },
  { label: '周末实战', value: '16 场', sub: '真实项目演练' },
  { label: '核心法规', value: '42 部', sub: '含 9 部必精读' },
  { label: '现成指令', value: '118 条', sub: '8 模板 + 22 场景' },
  { label: '交付成果', value: '12 份', sub: '可直接落地的文本' },
];

const KNOWLEDGE_MAP = [
  { icon: ScrollText, title: '商业特许经营三件套', desc: '条例 · 备案 · 信披办法' },
  { icon: Copyright, title: '商标与经营资源', desc: '43/35 类 · 授权链 · 商业秘密' },
  { icon: Megaphone, title: '招商与广告合规', desc: '广告法 · 新反法 · 话术红线' },
  { icon: Store, title: '门店租赁与办证', desc: '消防 · 排烟 · 食营许可' },
  { icon: FileSignature, title: '特许经营合同体系', desc: '11 项必备条款 · 冷静期 · 区域保护' },
  { icon: UtensilsCrossed, title: '食品安全与供应链', desc: '食安法 · 25 年餐饮新规 · 供货' },
  { icon: Gavel, title: '争议解决与判例', desc: '冷静期 · 虚假宣传 · 撤店' },
  { icon: Users, title: '用工 · 数据 · 预付卡', desc: '门店用工 · 个保法 · 单用途卡' },
];

const CHAIN = ['招商', '签约', '开店', '运营', '退出'];

const DELIVERABLES = [
  { no: '01', title: '《特许经营合同（特许人版）》', desc: '11 项法定必备条款 + 冷静期 + 区域保护 + 终止后义务，附带 6 个附件' },
  { no: '02', title: '《信息披露文件》', desc: '12 项法定披露内容全覆盖 + 回执 + 保密协议' },
  { no: '03', title: '《备案合规材料包》', desc: '两店一年证明、市场计划书、操作手册目录、承诺书本' },
  { no: '04', title: '《招商物料合规审查清单》', desc: '话术红黄线表、广告法禁用词库、审核 SOP' },
  { no: '05', title: '《餐饮门店租赁合同审查清单》', desc: '40 项，含排烟排污、办证配合、撤场补偿' },
  { no: '06', title: '《门店食品安全合规手册》', desc: '事故应急预案与危机处置流程' },
  { no: '07', title: '《统采统配供货框架协议》', desc: '供应商准入评分表 + 廉洁协议' },
  { no: '08', title: '《门店用工合规指引》', desc: '用工模式对比、工伤处置、员工手册模板' },
  { no: '09', title: '《预付卡与会员数据合规方案》', desc: '单用途卡备案、资金存管、数据归属与退出处理' },
  { no: '10', title: '《品牌保护年度方案》', desc: '监测 + 取证 + 投诉 + 诉讼 + 刑民交叉的完整打法' },
  { no: '11', title: '《加盟纠纷应诉手册》', desc: '四类高发纠纷的抗辩要点与证据清单' },
  { no: '12', title: '《法务总监上任 90 天工作方案》', desc: '结业项目，可直接用于面试 / 述职' },
];

// 单篇课程：id 指向资料库节点（跳转原文）；带 localHtml 的在站内直接阅读
type Lesson = { title: string; id: string; localHtml?: string };
type Week = { id: string; label: string; theme: string; lessons: Lesson[] };

// 周模块（课程全文已抓取至站内，见 LOCAL_LESSON_IDS）
const WEEKS: Week[] = [
  {
    id: 'Bn840EZ5D63zhmqmjJkjv0',
    label: '第 1 周',
    theme: '特许经营入门与合规地基',
    lessons: [
      { title: '第 1 周第 1 天', id: '3Cl4SqOw7KcxTFrNBI9P5v' },
      { title: '第 1 周第 2 天', id: '9N41ajAC0YT4c73LHOePHm' },
      { title: '第 1 周第 3 天', id: '1ar5RwMGZyczNBlQD1TJKg' },
      { title: '第 1 周第 4 天', id: '6arH6BQ8N802udNQFI0mNL' },
      { title: '第 1 周第 5 天', id: 'HLQGuMbrAhY6Qr8xoMiezG' },
      { title: '第 1 周周末实战', id: 'o7kxBObM9ah4v8tE7LArwV' },
    ],
  },
  {
    id: 'j0SI7hkn46wscOrdpmbumM',
    label: '第 2 周',
    theme: '商标 · 经营资源与授权链',
    lessons: [
      { title: '第 2 周第 1 天', id: 'QEpAnVLjoIdFJB5u9wXpSf' },
      { title: '第 2 周第 2 天', id: 'ig1IgYan0X8xWZ0DRpQVQX' },
      { title: '第 2 周第 3 天', id: 'fbsGaOhUvHHJKTyXCTOdfV' },
      { title: '第 2 周第 4 天', id: 'm9RpFC3urxyq7Wqe9mua0v' },
      { title: '第 2 周第 5 天', id: '9YepcoqEkqWJtOxwTr1MnU' },
      { title: '第 2 周周末实战', id: 'EsLe3F5z1R2al0OCZne39t' },
    ],
  },
  {
    id: 'PlBFb6OR6NLWoEmXkYkX3T',
    label: '第 3 周',
    theme: '招商物料与广告合规',
    lessons: [
      { title: '第 3 周第 1 天', id: 'd9xj2uSzPXoHaWCe2KEneZ' },
      { title: '第 3 周第 2 天', id: 'LzEXSRGoGiyTKqM4QGjiBe' },
      { title: '第 3 周第 3 天', id: 'B5I5lvyTKXBl6aWW1XvemB' },
      { title: '第 3 周第 4 天', id: 'b4OkX3xXzf8TrgaquaNc8d' },
      { title: '第 3 周第 5 天', id: 'VdV2XWlvLJr2n8bL09TxTy' },
      { title: '第 3 周周末实战', id: 'wIaxIxSTpQi5EAQmI7edO9' },
    ],
  },
  {
    id: 'lwInbp8H2yTb9gLkpE3FES',
    label: '第 4 周',
    theme: '门店租赁与办证',
    lessons: [
      { title: '第 4 周第 1 天', id: 'vTfXfo5ptxxNNJCm6rFWJ7' },
      { title: '第 4 周第 2 天', id: 'OPPzYYZVEUwRKibMqBTKpr' },
      { title: '第 4 周第 3 天', id: 'xSYQ2TpwHK2GTHcFldtuMb' },
      { title: '第 4 周第 4 天', id: 'MC0CoUbXxRt6lZocHEWxAH' },
      { title: '第 4 周第 5 天', id: 'YwKTcwn28zaBAJcRHkA0yH' },
      { title: '第 4 周周末实战', id: 'naMNbbNE80NTm26XP8hyW6' },
    ],
  },
  {
    id: 'EKJynj4RrBmR6DW7WfzrYK',
    label: '第 5 周',
    theme: '特许经营合同体系（上）',
    lessons: [
      { title: '第 5 周第 1 天', id: 'EJhWtZsoy0PEjdiCyh3dti' },
      { title: '第 5 周第 2 天', id: 'CjQWybJWSbvpgR9DuVHeIY' },
      { title: '第 5 周第 3 天', id: 'Kr5oK8qwQVOqYalDGyTNyS' },
      { title: '第 5 周第 4 天', id: 'EVxBl5qsoYdYTevQ1ehlzn' },
      { title: '第 5 周第 5 天', id: 'obdFuI5vpdeuMpRX7GZIqt' },
      { title: '第 5 周周末实战-1', id: 'Rd5cc6Ybpzp7Pse1rWDmaq' },
      { title: '第 5 周周末实战-2', id: 'k7Ohk2uoeq8cEx8wGcfC74' },
    ],
  },
  {
    id: 'b1EAErvVbnC9ijKe1WbmBn',
    label: '第 6 周',
    theme: '特许经营合同体系（下）',
    lessons: [
      { title: '第 6 周第 1 天', id: 'uBqPYJ8rBup8bys765Xew3' },
      { title: '第 6 周第 2 天', id: '2tB3nm8hTQSrfG1swtwrsr' },
      { title: '第 6 周第 3 天', id: 'GaKS1CaevHOhPPacP7vAJx' },
      { title: '第 6 周第 4 天', id: 'dcKfg0FzJRDXHmnC7G9ICe' },
      { title: '第 6 周第 5 天-1', id: 'V4mTl1mhgKVOoX7yqdR61Z' },
      { title: '第 6 周第 5 天-2', id: 'CYN6Ca4iLvJ2aT6PALOZRt' },
      { title: '第 6 周周末实战', id: 'eWSdFtnqoqMEIYG9TCBTeV' },
    ],
  },
  {
    id: 'qFNz7zQP7woaSVJ4OzjJbl',
    label: '第 7 周',
    theme: '食品安全与供应链',
    lessons: [
      { title: '第 7 周第 1 天', id: 'VniogK5Kv4KV2G3FGYJ7VS' },
      { title: '第 7 周第 2 天', id: 'ZE9KjZOfyqQpJtPjsg23iW' },
      { title: '第 7 周第 3 天', id: 'V45QnptrdJ7i8Ov2hdfYxW' },
      { title: '第 7 周第 4 天', id: 'KF0B9OHITqE1uomvLQ5g31' },
      { title: '第 7 周第 5 天', id: '14WJa2pEI4OjAjkQzqcg4A' },
      { title: '第 7 周周末实战-1', id: 'RX6D0YfCv7JAkF1x8a98ad' },
      { title: '第 7 周周末实战-2', id: 'jWx3KC5iu0zcczBBGQG5jJ' },
    ],
  },
  {
    id: 'DeBdcAHde6cEj2G33PdkPK',
    label: '第 8 周',
    theme: '争议解决与应诉',
    lessons: [
      { title: '第 8 周第 1 天', id: 'BpVNsssA70HmSRB1hiPK52' },
      { title: '第 8 周第 2 天', id: 'oPALTIVqnjPMvLQxnbwCe2' },
      { title: '第 8 周第 3 天', id: 'MVVDqUHvusnPV0bKNrEddq' },
      { title: '第 8 周第 4 天', id: 'l1OSJoDyZmzIzSv7opDja5' },
      { title: '第 8 周第 5 天', id: 'pheFurTqUKuKAwEinm7lY7' },
      { title: '第 8 周周末实战', id: 'yH99fOLzMSgjrd5OIaYJux' },
    ],
  },
  {
    id: 'week-09',
    label: '第 9 周',
    theme: '食品安全法定义务与「退一赔十」攻防',
    lessons: [
      {
        title: '第 9 周第 1 天 · 食安法定义务系统梳理（含 100 条自查表）',
        id: 'week09-day1',
        localHtml: '/food-safety-week9.html',
      },
    ],
  },
  {
    id: 'BYrhHqoMDFRR5qonLJQe6y',
    label: '第 13 周',
    theme: '统采统配与用工 · 数据合规',
    lessons: [
      { title: '第 13 周第 1 天', id: 'a5xc4Lr74ZqqJ9xcyC4oA8' },
      { title: '第 13 周第 2 天', id: 'aK7R5ZmKU1ahVzJI7doMdO' },
      { title: '第 13 周第 3 天', id: 'N93jUAsWdap6gGPJgm2QeE' },
      { title: '第 13 周第 4 天-1', id: 'WnT6AgmGJxGcwzsSeUTCfX' },
      { title: '第 13 周第 4 天-2', id: 'FXIyVYkaVmukdLD37Y5JUv' },
      { title: '第 13 周第 4 天-3', id: '7ulCpJlZXeXzYIkzplYJyd' },
      { title: '第 13 周第 4 天-4', id: '0HlkUkNCNg115UbXjpU1uK' },
      { title: '第 13 周第 4 天-5', id: 'bcMO0nsipfUANOfSeE8lh4' },
      { title: '第 13 周第 5 天', id: 'a1JesKx8Bm1KgWZYDz9LYK' },
      { title: '第 13 周周末实战', id: 'yb4Ny8nApNOXvwjO0mrWna' },
    ],
  },
];

const lessonUrl = (id: string) => `https://www.workbuddy.cn/space/d/${id}`;

// 已抓取至站内的课程（public/lessons/{id}.html）：免登录、可直接站内阅读
const LOCAL_LESSON_IDS = new Set([
  '0HlkUkNCNg115UbXjpU1uK',
  '14WJa2pEI4OjAjkQzqcg4A',
  '1ar5RwMGZyczNBlQD1TJKg',
  '2tB3nm8hTQSrfG1swtwrsr',
  '3Cl4SqOw7KcxTFrNBI9P5v',
  '6arH6BQ8N802udNQFI0mNL',
  '7ulCpJlZXeXzYIkzplYJyd',
  '9N41ajAC0YT4c73LHOePHm',
  '9YepcoqEkqWJtOxwTr1MnU',
  'B5I5lvyTKXBl6aWW1XvemB',
  'BpVNsssA70HmSRB1hiPK52',
  'CYN6Ca4iLvJ2aT6PALOZRt',
  'CjQWybJWSbvpgR9DuVHeIY',
  'EJhWtZsoy0PEjdiCyh3dti',
  'EVxBl5qsoYdYTevQ1ehlzn',
  'EsLe3F5z1R2al0OCZne39t',
  'FXIyVYkaVmukdLD37Y5JUv',
  'GaKS1CaevHOhPPacP7vAJx',
  'HLQGuMbrAhY6Qr8xoMiezG',
  'KF0B9OHITqE1uomvLQ5g31',
  'Kr5oK8qwQVOqYalDGyTNyS',
  'LzEXSRGoGiyTKqM4QGjiBe',
  'MC0CoUbXxRt6lZocHEWxAH',
  'MVVDqUHvusnPV0bKNrEddq',
  'N93jUAsWdap6gGPJgm2QeE',
  'OPPzYYZVEUwRKibMqBTKpr',
  'QEpAnVLjoIdFJB5u9wXpSf',
  'RX6D0YfCv7JAkF1x8a98ad',
  'Rd5cc6Ybpzp7Pse1rWDmaq',
  'V45QnptrdJ7i8Ov2hdfYxW',
  'V4mTl1mhgKVOoX7yqdR61Z',
  'VdV2XWlvLJr2n8bL09TxTy',
  'VniogK5Kv4KV2G3FGYJ7VS',
  'WnT6AgmGJxGcwzsSeUTCfX',
  'YwKTcwn28zaBAJcRHkA0yH',
  'ZE9KjZOfyqQpJtPjsg23iW',
  'a1JesKx8Bm1KgWZYDz9LYK',
  'a5xc4Lr74ZqqJ9xcyC4oA8',
  'aK7R5ZmKU1ahVzJI7doMdO',
  'b4OkX3xXzf8TrgaquaNc8d',
  'bcMO0nsipfUANOfSeE8lh4',
  'd9xj2uSzPXoHaWCe2KEneZ',
  'dcKfg0FzJRDXHmnC7G9ICe',
  'eWSdFtnqoqMEIYG9TCBTeV',
  'fbsGaOhUvHHJKTyXCTOdfV',
  'ig1IgYan0X8xWZ0DRpQVQX',
  'jWx3KC5iu0zcczBBGQG5jJ',
  'k7Ohk2uoeq8cEx8wGcfC74',
  'l1OSJoDyZmzIzSv7opDja5',
  'm9RpFC3urxyq7Wqe9mua0v',
  'naMNbbNE80NTm26XP8hyW6',
  'o7kxBObM9ah4v8tE7LArwV',
  'oPALTIVqnjPMvLQxnbwCe2',
  'obdFuI5vpdeuMpRX7GZIqt',
  'pheFurTqUKuKAwEinm7lY7',
  'uBqPYJ8rBup8bys765Xew3',
  'vTfXfo5ptxxNNJCm6rFWJ7',
  'wIaxIxSTpQi5EAQmI7edO9',
  'week09-day1',
  'xSYQ2TpwHK2GTHcFldtuMb',
  'yH99fOLzMSgjrd5OIaYJux',
  'yb4Ny8nApNOXvwjO0mrWna',
]);
const lessonLocalUrl = (id: string) => `/lessons/${id}.html`;
const hasLocalLesson = (id: string) => LOCAL_LESSON_IDS.has(id);

export const CateringLegalTab: React.FC = () => {
  const [openWeek, setOpenWeek] = useState<string>(WEEKS[0].id);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const readerRef = useRef<HTMLDivElement>(null);

  // 展开阅读面板后滚动到面板处；否则面板在列表上方，视觉上像"点了没反应"
  const openLesson = (l: Lesson) => {
    setActiveLesson(l);
    setTimeout(() => readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  return (
    <div id="tab-catering-content" className="space-y-12 py-6">
      {/* ── Hero / 简介 ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="h-[1px] w-4 bg-[#B89F6B]" />
          <span className="text-xs uppercase tracking-widest text-[#86868B]">
            Catering Franchise Legal · 餐饮连锁法务
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-light text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
          餐饮加盟法务总监养成计划
        </h2>
        <p className="text-sm text-[#86868B] mt-3 max-w-3xl font-normal leading-relaxed">
          面向「蒙自源」式中式快餐 / 米线连锁（直营 + 加盟 + 统采统配）的法务总监能力模型，
          16 周系统训练，80 个工作日 + 16 个周末实战项目。每天一个主题、一份产出物、一条可直接复制的指令。
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 rounded-xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/30 dark:bg-[#242426]/30"
            >
              <div className="text-2xl font-light text-[#B89F6B]">{s.value}</div>
              <div className="text-xs text-[#1D1D1F] dark:text-[#F5F5F7] mt-1 font-medium">{s.label}</div>
              <div className="text-[11px] text-[#86868B] mt-0.5 leading-snug">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 知识地图 ── */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-widest text-[#86868B]">
            Knowledge Map / 知识地图（特许人 · 总部立场）
          </span>
        </div>
        <h3 className="text-2xl font-light text-[#1D1D1F] dark:text-[#F5F5F7] mb-6">
          八大能力模块
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KNOWLEDGE_MAP.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group p-5 rounded-xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/30 dark:bg-[#242426]/30 hover:border-[#B89F6B] dark:hover:border-[#B89F6B] transition-all duration-300"
              >
                <div className="text-[#86868B] group-hover:text-[#B89F6B] transition-colors mb-3">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h4 className="text-base font-normal text-[#1D1D1F] dark:text-[#F5F5F7] group-hover:text-[#B89F6B] transition-colors mb-1">
                  {m.title}
                </h4>
                <p className="text-xs text-[#86868B] dark:text-[#8E8E93] leading-relaxed">{m.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* 全链路 */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-xs uppercase tracking-widest text-[#86868B]">全链路</span>
          {CHAIN.map((c, i) => (
            <React.Fragment key={c}>
              <span className="px-3 py-1 rounded-full border border-[#E8E8E6] dark:border-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7]">
                {c}
              </span>
              {i < CHAIN.length - 1 && <span className="text-[#B89F6B]">→</span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── 学习计划：周模块（可展开）── */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-widest text-[#86868B]">
            Learning Path / 学习计划
          </span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-light text-[#1D1D1F] dark:text-[#F5F5F7]">
            每周主题与当日计划
          </h3>
          <a
            href={SPACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#86868B] hover:text-[#B89F6B] transition-colors"
          >
            <ExternalLink size={13} />
            在资料库查看全部
          </a>
        </div>

        {/* ── 站内阅读面板：点击带「站内阅读」的课程后在此展开 ── */}
        {activeLesson && activeLesson.localHtml && (
          <motion.div
            ref={readerRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 rounded-xl border border-[#B89F6B]/40 bg-white/40 dark:bg-[#242426]/40 overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[#E8E8E6] dark:border-[#2C2C2E]">
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen size={16} className="text-[#B89F6B] shrink-0" />
                <span className="text-sm text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                  {activeLesson.title}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={lessonLocalUrl(activeLesson.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#86868B] hover:text-[#B89F6B] transition-colors flex items-center gap-1"
                >
                  <ExternalLink size={13} />
                  新窗口打开
                </a>
                <button
                  onClick={() => setActiveLesson(null)}
                  className="text-xs text-[#86868B] hover:text-[#B89F6B] transition-colors flex items-center gap-1"
                >
                  <X size={14} />
                  收起
                </button>
              </div>
            </div>
            <iframe
              src={lessonLocalUrl(activeLesson.id)}
              title={activeLesson.title}
              className="w-full h-[75vh] border-0 bg-white"
            />
          </motion.div>
        )}

        <div className="space-y-3">
          {WEEKS.map((w, i) => {
            const isOpen = openWeek === w.id;
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/30 dark:bg-[#242426]/30 overflow-hidden"
              >
                <button
                  onClick={() => setOpenWeek(isOpen ? '' : w.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#E8E8E6]/20 dark:hover:bg-[#2C2C2E]/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-[#B89F6B] w-14">{w.label}</span>
                    <span className="text-[15px] text-[#1D1D1F] dark:text-[#F5F5F7]">{w.theme}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#86868B]">
                    <span className="text-xs">{w.lessons.length} 篇</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#B89F6B]' : ''}`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 border-t border-[#E8E8E6]/60 dark:border-[#2C2C2E]/60">
                    <ul className="divide-y divide-[#E8E8E6]/60 dark:divide-[#2C2C2E]/60">
                      {w.lessons.map((l) => (
                        <li key={l.id}>
                          {hasLocalLesson(l.id) ? (
                            <button
                              onClick={() => openLesson(l)}
                              className="group w-full flex items-center justify-between gap-3 py-2.5 text-left text-sm text-[#1D1D1F] dark:text-[#F5F5F7] hover:text-[#B89F6B] transition-colors"
                            >
                              <span>{l.title}</span>
                              <span className="flex items-center gap-2 shrink-0">
                                <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#B89F6B]/15 text-[#B89F6B]">
                                  站内阅读
                                </span>
                                <BookOpen
                                  size={15}
                                  className="text-[#86868B] group-hover:text-[#B89F6B] transition-colors"
                                />
                              </span>
                            </button>
                          ) : (
                            <a
                              href={lessonUrl(l.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center justify-between py-2.5 text-sm text-[#1D1D1F] dark:text-[#F5F5F7] hover:text-[#B89F6B] transition-colors"
                            >
                              <span>{l.title}</span>
                              <ArrowUpRight
                                size={15}
                                className="text-[#86868B] group-hover:text-[#B89F6B] transition-colors"
                              />
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        <p className="text-xs text-[#86868B] mt-3">
          * 计划共 16 周。已发布的课程全文均已存于本站，点击「站内阅读」免登录直接查看；需看原文可点上方「在资料库查看全部」。
        </p>
      </section>

      {/* ── 12 份交付成果 ── */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-widest text-[#86868B]">
            Deliverables / 交付成果
          </span>
        </div>
        <h3 className="text-2xl font-light text-[#1D1D1F] dark:text-[#F5F5F7] mb-6">
          结业你将拥有的 12 份文本
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DELIVERABLES.map((d, i) => (
            <motion.div
              key={d.no}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-4 p-5 rounded-xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/30 dark:bg-[#242426]/30 hover:border-[#B89F6B] dark:hover:border-[#B89F6B] transition-all duration-300"
            >
              <span className="text-2xl font-light text-[#B89F6B]/70 shrink-0 w-9">{d.no}</span>
              <div>
                <h4 className="text-[15px] font-normal text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">{d.title}</h4>
                <p className="text-xs text-[#86868B] dark:text-[#8E8E93] leading-relaxed">{d.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA：跳转资料库 ── */}
      <section>
        <div className="p-8 rounded-2xl border border-[#B89F6B]/40 bg-[#B89F6B]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={16} className="text-[#B89F6B]" />
              <span className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                完整计划 · 每日指令 · 法规库
              </span>
            </div>
            <p className="text-xs text-[#86868B] max-w-xl">
              全部 16 周路线图、118 条可直接复制的指令、核心法规清单与能力自检，均托管于 WorkBuddy 资料库，点击进入即可逐日学习。
            </p>
          </div>
          <a
            href={SPACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-full bg-[#B89F6B] text-white text-sm font-medium hover:bg-[#A8905C] transition-colors"
          >
            <Link2 size={15} />
            打开资料库
          </a>
        </div>
      </section>
    </div>
  );
};
