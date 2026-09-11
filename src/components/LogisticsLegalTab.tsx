import React from 'react';
import { motion } from 'motion/react';
import {
  Ship,
  FileCheck2,
  Globe2,
  ShieldAlert,
  Warehouse,
  Gavel,
  BookOpen,
  ArrowUpRight,
  GraduationCap,
  CalendarDays,
  Target,
  Compass,
} from 'lucide-react';

const PLAN_URL = '/logistics/';

const STATS = [
  { label: '学习周期', value: '24 周', sub: '4 阶段能力跃迁' },
  { label: '工作日主题', value: '120 天', sub: '每天一个主题 + 一份产出物' },
  { label: '周末实战', value: '24 场', sub: '真实项目演练' },
  { label: '术语地基', value: '238 条', sub: '中英对照，可搜索' },
  { label: '现成指令', value: '168 条', sub: '8 模板 + 高频场景' },
  { label: '法规公约', value: '64 部', sub: '含必精读与关键条款号' },
];

const KNOWLEDGE_MAP = [
  { icon: Ship, title: '海商法与四大公约', desc: '海牙 · 维斯比 · 汉堡 · 鹿特丹' },
  { icon: Globe2, title: '空运 / 铁路 / 公路', desc: '蒙特利尔 · SMGS/CIM · CMR' },
  { icon: FileCheck2, title: '单据与证据学', desc: 'B/L · AWB · CMR · FIATA 四件套' },
  { icon: Warehouse, title: '海外仓与货权', desc: '德国商租 · 仓储协议 · 留置权' },
  { icon: ShieldAlert, title: '出口管制与制裁', desc: '两用物项 · EAR · OFAC' },
  { icon: Compass, title: '欧盟产品合规', desc: 'GPSR · 电池法 · EPR · CE' },
  { icon: Gavel, title: '国际争议解决', desc: '仲裁条款 · 纽约公约 · 时效' },
  { icon: BookOpen, title: '中英文合同体系', desc: '五类核心协议 + 条款句式库' },
];

const STAGES = [
  {
    no: '01',
    weeks: 'W1–W6',
    title: '打地基',
    desc: '行业链路 → 单据证据 → Incoterms/CISG → 结算外汇 → 保险责任 → 岗位画像',
    color: '#4a9d9c',
  },
  {
    no: '02',
    weeks: 'W7–W13',
    title: '主干法律',
    desc: '海商法 → 四大公约 → 空铁公 → 多式联运与货代身份 → 中欧海关 → 责任地图',
    color: '#c9a227',
  },
  {
    no: '03',
    weeks: 'W14–W19',
    title: '境外合规',
    desc: '欧盟法通识 → 产品合规 → GDPR → 出口管制 → 德/波/墨子公司 → 海外仓',
    color: '#5b8dd6',
  },
  {
    no: '04',
    weeks: 'W20–W24',
    title: '岗位能力',
    desc: '合同模板库 → 法律英语 → 争议解决 → 内控内审 → 结业作品集',
    color: '#b06ab3',
  },
];

const CHAIN = ['揽货', '报关', '干线', '清关', '海外仓', '尾程', '退件'];

const WEEK1: { no: string; title: string; file: string; desc: string }[] = [
  { no: 'D1', title: '跨境物流这门生意在卖什么', file: '/logistics/W1/W1-D1.html', desc: '8 类产品 + 收入的法律定性 + 轻资产翻车三件套' },
  { no: 'D2', title: '主体图谱：谁是谁，谁对谁负责', file: '/logistics/W1/W1-D2.html', desc: '12 类主体 + 四组混同辨析 + 3 条英文锁身份条款' },
  { no: 'D3', title: '跨境电商五大物流模式', file: '/logistics/W1/W1-D3.html', desc: '0110/9610/9710/9810/1210 + FBA 四问 + IOR 决策图' },
  { no: 'D4', title: '计费逻辑与报价单风险', file: '/logistics/W1/W1-D4.html', desc: '泡货系数 + 12 类附加费 + 20 项审查清单' },
  { no: 'D5', title: '复盘与自测', file: '/logistics/W1/W1-D5.html', desc: '10 道题 + 费曼讲稿：3 分钟讲清 DDP 与 DDU' },
  { no: 'WK', title: '周末实战：一票货全链路法律关系图', file: '/logistics/W1/W1-weekend.html', desc: '12 节点全链路图 + 责任归属速查表' },
];

export const LogisticsLegalTab: React.FC = () => {
  return (
    <div className="space-y-20">
      {/* Header */}
      <section className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#B89F6B]/40 text-[#B89F6B] text-xs tracking-widest uppercase">
            <GraduationCap size={14} />
            Cross-border Logistics Legal
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl font-light tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
            跨境物流法务总监养成计划
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-[15px] leading-relaxed text-[#6E6E73] dark:text-[#98989D]">
            24 周，从「完全不涉外」到「能独立扛跨境物流全盘法务」。覆盖国际货运代理、海外仓、中欧班列、FBA 头程，
            以及欧盟产品合规、GDPR、出口管制与制裁。每天 90 分钟，一条指令，一份产出物。
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={PLAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1D1D1F] dark:bg-[#F5F5F7] text-white dark:text-[#1D1D1F] text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Compass size={16} />
              打开完整养成计划
              <ArrowUpRight size={15} />
            </a>
            <a
              href="/logistics/W1/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#B89F6B] text-[#B89F6B] text-sm font-medium hover:bg-[#B89F6B] hover:text-white transition-all"
            >
              <CalendarDays size={16} />
              第 1 周内容（已跑出）
              <ArrowUpRight size={15} />
            </a>
          </div>
        </motion.div>

        {/* 链路示意 */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {CHAIN.map((c, i) => (
            <React.Fragment key={c}>
              <span className="px-3 py-1.5 rounded-lg border border-[#E8E8E6] dark:border-[#2C2C2E] text-xs text-[#6E6E73] dark:text-[#98989D]">
                {c}
              </span>
              {i < CHAIN.length - 1 && (
                <span className="text-[#B89F6B] text-xs">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="p-5 rounded-2xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/60 dark:bg-[#242426]/60 text-center"
          >
            <div className="text-2xl font-light text-[#1D1D1F] dark:text-[#F5F5F7]">
              {s.value}
            </div>
            <div className="mt-1 text-xs text-[#B89F6B]">{s.label}</div>
            <div className="mt-1 text-[11px] text-[#86868B]">{s.sub}</div>
          </div>
        ))}
      </section>

      {/* 四阶段 */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Target size={18} className="text-[#B89F6B]" />
          <h3 className="text-xl font-light text-[#1D1D1F] dark:text-[#F5F5F7]">
            四阶段学习路线
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {STAGES.map((s) => (
            <div
              key={s.no}
              className="p-6 rounded-2xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/60 dark:bg-[#242426]/60"
              style={{ borderLeft: `3px solid ${s.color}` }}
            >
              <div className="flex items-baseline gap-3">
                <span className="text-xs tracking-widest text-[#B89F6B]">
                  {s.weeks}
                </span>
                <span className="text-lg text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {s.title}
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[#6E6E73] dark:text-[#98989D]">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 知识地图 */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen size={18} className="text-[#B89F6B]" />
          <h3 className="text-xl font-light text-[#1D1D1F] dark:text-[#F5F5F7]">
            知识版图
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KNOWLEDGE_MAP.map((k) => {
            const Icon = k.icon;
            return (
              <div
                key={k.title}
                className="p-5 rounded-2xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/60 dark:bg-[#242426]/60 hover:border-[#B89F6B] transition-colors"
              >
                <Icon size={20} className="text-[#B89F6B]" />
                <div className="mt-3 text-[15px] text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {k.title}
                </div>
                <div className="mt-1 text-xs text-[#86868B]">{k.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 第 1 周内容 */}
      <section className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <CalendarDays size={18} className="text-[#B89F6B]" />
            <h3 className="text-xl font-light text-[#1D1D1F] dark:text-[#F5F5F7]">
              第 1 周 · 行业解剖（指令已跑出内容）
            </h3>
          </div>
          <span className="text-xs text-[#86868B]">
            每天含：生活比喻 → 地基概念 → 完整内容 → 中英术语
          </span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WEEK1.map((d) => (
            <a
              key={d.no}
              href={d.file}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-5 rounded-2xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white/60 dark:bg-[#242426]/60 hover:border-[#B89F6B] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-widest text-[#B89F6B]">
                  {d.no}
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-[#86868B] group-hover:text-[#B89F6B]"
                />
              </div>
              <div className="mt-2 text-[15px] leading-snug text-[#1D1D1F] dark:text-[#F5F5F7]">
                {d.title}
              </div>
              <div className="mt-2 text-xs leading-relaxed text-[#86868B]">
                {d.desc}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="text-center pt-4">
        <a
          href={PLAN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#1D1D1F] dark:border-[#F5F5F7] text-sm text-[#1D1D1F] dark:text-[#F5F5F7] hover:border-[#B89F6B] hover:text-[#B89F6B] transition-all"
        >
          进入 24 周完整计划（120 天 + 24 场周末实战）
          <ArrowUpRight size={15} />
        </a>
      </section>
    </div>
  );
};
