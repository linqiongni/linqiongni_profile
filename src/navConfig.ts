import { TabType } from './types';



/**

 * 三级导航配置（数据驱动）。

 * - 第一层：顶层分组（个人 / 法务实务 / 律师实务 / 影视法律）；双视角劳动实务作为「律师实务」的子板块。

 * - 第二层：每个分组下的子板块 subTabs。

 * - 第三层（可选）：分组内再按「剧集 / 栏目」分层 sections，

 *   例如 影视法律 → The Good Wife → 第一季 S1 / 第二季 S2。

 *   只有需要分层的分组才写 sections，其余分组保持两级，不增加复杂度。

 *

 * 以后要加新板块（新执业领域 / 新个人栏目 / 新剧集）：

 *   1) types.ts 的 TabType 加一个 union 成员；

 *   2) 下方 NAV_GROUPS 对应分组的 subTabs（或 section.tabs）里加一行；

 *   3) App.tsx 的渲染分支加一行 <XxxTab />。

 */

export interface NavSection {

  id: string;

  label: string;

  enLabel: string;

  tabs: TabType[];

}



export interface NavGroup {

  id: string;

  label: string;

  enLabel: string;

  subTabs: TabType[];

  /** 可选：分组内按「剧集 / 栏目」再分一层 */

  sections?: NavSection[];

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

    subTabs: ['commercial-ops', 'retail-ad', 'ip', 'financing', 'catering', 'logistics', 'foreign-contracts', 'ai-law'],

  },

  {
    id: 'practice',
    label: '律师实务',
    enLabel: 'Lawyer Practice',
    subTabs: ['family-law', 'criminal', 'arbitration', 'insurance', 'labor'],
  },

  {

    id: 'film',

    label: '影视法律',

    enLabel: 'Film & Law',

    subTabs: ['film-law', 'film-law-s2', 'film-law-s3', 'film-law-s4', 'english'],

    sections: [

      {

        id: 'tgw',

        label: 'The Good Wife',

        enLabel: 'The Good Wife',

        tabs: ['film-law', 'film-law-s2', 'film-law-s3', 'film-law-s4'],

      },

      {

        id: 'daily',

        label: '日常实用',

        enLabel: 'Daily Tools',

        tabs: ['english'],

      },

    ],

  },

];



export const SUB_TAB_META: Record<TabType, SubTabMeta> = {

  // 概览主页态：不属于任何分组 subTabs，不在导航中渲染，仅用于类型补全与初始进入态
  home: { label: '主页', enLabel: 'Home' },

  about: { label: '关于我', enLabel: 'About' },

  expertise: { label: '专业技能', enLabel: 'Expertise' },

  cases: { label: '案例展示', enLabel: 'Cases' },

  insights: { label: '思考观点', enLabel: 'Insights' },

  notes: { label: '日常分享', enLabel: 'Notes' },

  catering: { label: '加盟经销法务', enLabel: 'Franchise & Distribution' },
  'commercial-ops': { label: '商业运营法务', enLabel: 'Commercial Operations' },
  'retail-ad': { label: '新零售与广告合规', enLabel: 'Retail & Advertising Compliance' },

  logistics: { label: '跨境物流法务', enLabel: 'Logistics' },

  ip: { label: 'IP', enLabel: 'Intellectual Property' },

  'foreign-contracts': { label: '涉外合同学习', enLabel: 'Foreign Contracts' },

  'film-law': { label: '第一季 S1', enLabel: 'Season 1' },

  'film-law-s2': { label: '第二季 S2', enLabel: 'Season 2' },
  'film-law-s3': { label: '第三季 S3', enLabel: 'Season 3' },
  'film-law-s4': { label: '第四季 S4', enLabel: 'Season 4' },

  labor: { label: '双视角劳动实务', enLabel: 'Labor Practice' },
  insurance: { label: '保险·法律维权', enLabel: 'Insurance' },
  criminal: { label: '刑事辩护', enLabel: 'Criminal Defense' },
  'ai-law': { label: 'AI+法律', enLabel: 'AI + Law' },
  financing: { label: '融资法务', enLabel: 'Financing' },
  arbitration: { label: '商事仲裁', enLabel: 'Arbitration' },
  'family-law': { label: '婚姻家事与遗产继承', enLabel: 'Family & Inheritance' },
  'english': { label: 'ENGLISH', enLabel: 'English' },

};



/** 给定子板块，返回它所属的分组 id */

export const groupOfTab = (tab: TabType): string =>

  NAV_GROUPS.find((g) => g.subTabs.includes(tab))?.id ?? NAV_GROUPS[0].id;



/** 分组内所有子板块（含 section 下的），用于平铺展示 */

export const tabsOfGroup = (group: NavGroup): TabType[] =>

  group.sections

    ? group.sections.reduce<TabType[]>((acc, s) => acc.concat(s.tabs), [])

    : group.subTabs;



/** 给定子板块，返回它所属分组的 section（若该分组有分层） */

export const sectionOfTab = (tab: TabType): NavSection | undefined => {

  for (const g of NAV_GROUPS) {

    const s = g.sections?.find((sec) => sec.tabs.includes(tab));

    if (s) return s;

  }

  return undefined;

};

