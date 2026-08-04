import { CVData, CVTemplate, CVTheme, LayoutConfig, CareerStage, ContentDensity } from "@/types";

export type DesignSeverity = "info" | "success" | "warning" | "critical";

export type DesignIssueType =
  | "overflow"
  | "too_many_pages"
  | "too_much_empty_space"
  | "too_dense"
  | "small_font"
  | "large_font"
  | "bad_page_break"
  | "orphan_heading"
  | "section_split"
  | "unbalanced_layout"
  | "sidebar_overflow"
  | "content_density"
  | "inconsistent_spacing"
  | "template_mismatch"
  | "ats_risk"
  | "long_bullets"
  | "missing_content"
  | "skill_display"
  | "excessive_whitespace";

export interface DesignIssue {
  id: string;
  type: DesignIssueType;
  severity: DesignSeverity;
  title: string;
  description: string;
  recommendation: string;
  affectedSection?: string;
  autoFixAvailable: boolean;
  autoFixId?: string;
}

export interface ContentMetrics {
  totalWords: number;
  totalChars: number;
  sectionCount: number;
  experienceCount: number;
  bulletCount: number;
  avgBulletLength: number;
  longestBullet: number;
  skillCount: number;
  projectCount: number;
  educationCount: number;
  certificationCount: number;
  awardCount: number;
  publicationCount: number;
  languageCount: number;
  referenceCount: number;
  summaryLength: number;
  hasPhoto: boolean;
  hasLinkedIn: boolean;
  hasGitHub: boolean;
  hasWebsite: boolean;
  hasEmail: boolean;
  hasPhone: boolean;
  hasAddress: boolean;
}

export interface PageEstimate {
  estimatedPages: number;
  contentHeight: number;
  availableHeight: number;
  overflowAmount: number;
  overflowRisk: "none" | "low" | "medium" | "high";
  emptySpaceRatio: number;
}

export interface SectionBalance {
  name: string;
  estimatedHeight: number;
  percentage: number;
}

export interface DesignHealthScore {
  overall: number;
  dimensions: {
    readability: number;
    spacing: number;
    balance: number;
    pageStructure: number;
    typography: number;
    atsSafety: number;
  };
  status: "excellent" | "good" | "needs-improvement" | "critical";
}

export interface LayoutConstraints {
  minFontScale?: number;
  maxFontScale?: number;
  preferredSpacingScale?: number;
  maxPages?: number;
  preferredSkillDisplay?: string;
  recommendedTemplate?: string;
  sectionOrderSuggestion?: string[];
}

export interface DesignGuardianResult {
  issues: DesignIssue[];
  score: DesignHealthScore;
  metrics: ContentMetrics;
  pageEstimate: PageEstimate;
  sectionBalance: SectionBalance[];
  constraints: LayoutConstraints;
  autoFixes: AutoFix[];
}

export interface AutoFix {
  id: string;
  title: string;
  description: string;
  changes: AutoFixChange[];
  impact: "low" | "medium" | "high";
}

export interface AutoFixChange {
  type: "spacing" | "fontScale" | "skillDisplay" | "sectionOrder" | "template";
  field: string;
  from: unknown;
  to: unknown;
  description: string;
}

export interface DesignGuardianConfig {
  data: CVData;
  template: CVTemplate;
  theme: CVTheme;
  layout: LayoutConfig;
  careerStage: CareerStage;
  contentDensity: ContentDensity;
}
