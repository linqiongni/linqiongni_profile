import { TabType } from './types';

/**
 * 两级导航配置（数据驱动）。
 * - 顶层只有「个人」「法务实务」两个分组，避免 tab 太多拥挤。
 * - 以后要加新板块（新执业领域 / 新个人栏目）：
 *   1) types.ts 的 TabType 加一个 union 成员；
 *   2) 下方 NAV_GROUPS 对应分组的 subTabs 里加一行；
 *   3) App.tsx 的渲染分支加一行 <XxxTab />。
 * 顶层永远只有两个分组，不会变挤。
 */
export interface NavGroup {
  id: string;
  label: string;
  enLabel: string;
  subTabs: TabType[];
}

export interface SubTabMeta {
  label: string;
  enLabel: string;
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'profile',
    label: '个人',
    enLabel: 'Profile',
    subTabs: ['about', 'expertise', 'cases', 'insights', 'notes'],
  },
  {
    id: 'legal',
    label: '法务实务',
    enLabel: 'Legal Practice',
    subTabs: ['catering', 'logistics', 'foreign-contracts'],
  },
];

export const SUB_TAB_META: Record<TabType, SubTabMeta> = {
  about: { label: '关于我', enLabel: 'About' },
  expertise: { label: '专业技能', enLabel: 'Expertise' },
  cases: { label: '案例展示', enLabel: 'Cases' },
  insights: { label: '思考观点', enLabel: 'Insights' },
  notes: { label: '日常分享', enLabel: 'Notes' },
  catering: { label: '餐饮法务', enLabel: 'Catering' },
  logistics: { label: '跨境物流法务', enLabel: 'Logistics' },
  'foreign-contracts': { label: '涉外合同学习', enLabel: 'Foreign Contracts' },
};

/** 给定子板块，返回它所属的分组 id */
export const groupOfTab = (tab: TabType): string =>
  NAV_GROUPS.find((g) => g.subTabs.includes(tab))?.id ?? NAV_GROUPS[0].id;
