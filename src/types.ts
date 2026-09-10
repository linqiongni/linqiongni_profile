export type TabType = 'about' | 'expertise' | 'cases' | 'insights' | 'notes' | 'catering' | 'plan';

export interface TimelineItem {
  year: string;
  title: string;
  organization: string;
  description: string;
}

export interface SkillItem {
  id: string;
  category: 'contract' | 'compliance' | 'dispute';
  categoryName: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  industry: string;
  type: string;
  year: string;
  summary: string;
  background: string;
  challenge: string;
  actions: string[];
  results: {
    label: string;
    value: string;
    subtext?: string;
  }[];
  tags: string[];
}

export interface InsightArticle {
  id: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  summary: string;
  lead: string;
  contentParagraphs: string[];
  quote: {
    text: string;
    author?: string;
  };
  clauseExample?: {
    title: string;
    code: string;
    explanation: string;
  };
}

export interface NotePost {
  id: string;
  image: string;
  caption: string;
  date: string;
  tags: string[];
  location?: string;
  aspect?: string;
}
