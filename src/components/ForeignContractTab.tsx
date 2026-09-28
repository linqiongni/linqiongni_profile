import React, { useEffect, useState } from 'react';
import { BookOpenText, ChevronLeft, FileDown, MapPin, Scale, FileText, Landmark } from 'lucide-react';

const GUIDE_URL = '/foreign-contracts/us-office-lease-guide.html';
const DOCX_URL = '/foreign-contracts/us-office-lease-full.docx';

export const ForeignContractTab: React.FC = () => {
  // 阅读视图：点「站内阅读」后整个内容区换出（对齐加盟经销课程当页展示的体验）
  const [reading, setReading] = useState(false);

  // 打开阅读视图时把主滚动容器带回顶部
  useEffect(() => {
    if (reading) {
      const el = document.getElementById('app-scroll');
      if (el) el.scrollTo({ top: 0 });
    }
  }, [reading]);

  // ── 阅读视图（换出态）──
  if (reading) {
    return (
      <div id="tab-foreign-contracts-content" className="py-6">
        <div className="flex items-center justify-between gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setReading(false)}
              className="group flex items-center gap-1 text-[#B89F6B] hover:text-[#A8905C] transition-colors shrink-0"
            >
              <ChevronLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
              涉外合同学习
            </button>
            <span className="text-[#86868B]">›</span>
            <span className="text-[#86868B] truncate">美国办公场地租赁合同精读</span>
          </div>
          <span className="text-[11px] text-[#86868B] shrink-0 hidden sm:inline">交互版 · 可离线打开</span>
        </div>
        <iframe
          key={GUIDE_URL}
          src={GUIDE_URL}
          title="美国办公场地租赁合同精读"
          className="w-full rounded-2xl border border-[#E8E8E6]/50 dark:border-[#2C2C2E]/70 bg-transparent h-[calc(100dvh-12.5rem)] md:h-[calc(100dvh-14.5rem)]"
        />
      </div>
    );
  }

  return (
    <div id="tab-foreign-contracts-content" className="space-y-8">
      {/* 标题区 */}
      <div className="flex items-start gap-3 px-1">
        <Scale size={20} className="text-[#B89F6B] shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-medium text-[#1D1D1F] dark:text-[#F4EFE4] leading-tight">
            涉外合同学习
          </h2>
          <p className="text-xs text-[#86868B] mt-1">
            以真实州级标准表单为底本 · 英文条款在前中文在后 · 面向六级英语读者 · 逐条拆解到可谈判粒度
          </p>
        </div>
      </div>

      {/* 统计卡 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Landmark, label: '底本', value: '加州 AIR CRE 标准表单' },
          { icon: FileText, label: '条款覆盖', value: '14 条主文 + 附录 + 4 附件' },
          { icon: MapPin, label: '术语', value: '40 个核心法律英语术语' },
          { icon: BookOpenText, label: '学习路径', value: '6 阶段 · 3–4 周' },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white dark:bg-[#1C1C1E] p-4"
          >
            <Icon size={16} className="text-[#B89F6B] mb-2" />
            <div className="text-[11px] text-[#86868B]">{label}</div>
            <div className="text-sm font-medium text-[#1D1D1F] dark:text-[#F4EFE4] mt-0.5 leading-snug">
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* 内容卡片 */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* 精读指南 */}
        <div className="rounded-2xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white dark:bg-[#1C1C1E] p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <BookOpenText size={18} className="text-[#B89F6B]" />
            <h3 className="text-base font-medium text-[#1D1D1F] dark:text-[#F4EFE4]">
              美国办公场地租赁合同精读
            </h3>
          </div>
          <p className="text-xs text-[#86868B] leading-relaxed flex-1">
            单文件交互学习系统：背景预设与四大租赁类型对比 → 40 条术语库（当事方 / 租金费用 / 风险担保 / 违约退出）→
            十五字条款架构 → 14 条逐条详解（英文原文 + 中文对照 + 语言拆解 + 房东立场 vs 租户反制点）→
            谈判反制速查表与落地清单 → 六阶段学习路径。
          </p>
          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={() => setReading(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#B89F6B] text-white text-xs font-medium hover:bg-[#A8905C] transition-colors"
            >
              <BookOpenText size={12} />
              站内阅读
            </button>
            <span className="text-[11px] text-[#86868B]">交互版 · 当页打开</span>
          </div>
        </div>

        {/* 完整合同 Word */}
        <div className="rounded-2xl border border-[#E8E8E6] dark:border-[#2C2C2E] bg-white dark:bg-[#1C1C1E] p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <FileDown size={18} className="text-[#B89F6B]" />
            <h3 className="text-base font-medium text-[#1D1D1F] dark:text-[#F4EFE4]">
              完整版租赁合同（Word）
            </h3>
          </div>
          <p className="text-xs text-[#86868B] leading-relaxed flex-1">
            可签署级完整合同全文（.docx）：序言 + 第 1–14 条主文 + 附录第 50–52 条（续租选择权 / 担保递减 /
            中英文本效力）+ 附件 A–D（平面图 / 大厦规则 / 工程函 / 担保函）+ 三方签署页。
            英文条款在前，中文对照紧随其后。
          </p>
          <div className="flex items-center gap-2 mt-5">
            <a
              href={DOCX_URL}
              download="美国加州办公场地租赁合同（英文完整版）.docx"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#B89F6B] text-white text-xs font-medium hover:bg-[#A8905C] transition-colors"
            >
              <FileDown size={12} />
              下载 Word
            </a>
            <span className="text-[11px] text-[#86868B]">.docx · 约 66 KB</span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#86868B] px-1">
        * 内容为学习与谈判演练用途，不构成法律意见；真实交易请以执业律师审核为准。
      </p>
    </div>
  );
};
