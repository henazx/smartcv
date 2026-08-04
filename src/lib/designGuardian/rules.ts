import { DesignIssue } from "./types";
import { ContentMetrics, PageEstimate, SectionBalance } from "./types";
import { CVData, CVTemplate, CVTheme, LayoutConfig, CareerStage } from "@/types";
import {
  IDEAL_PAGES, IDEAL_BULLET_LENGTH_MIN,
  IDEAL_BULLET_LENGTH_MAX, MAX_BULLET_LENGTH,
  IDEAL_SKILL_COUNT_MAX, MAX_SKILL_COUNT, IDEAL_SUMMARY_LENGTH_MIN,
  IDEAL_SUMMARY_LENGTH_MAX, EMPTY_SPACE_THRESHOLD,
  SAFE_MIN_FONT_SCALE,
} from "./constants";

let issueCounter = 0;
function makeId(): string {
  return `dg-${++issueCounter}-${Date.now().toString(36)}`;
}

export function runAllRules(
  data: CVData,
  template: CVTemplate,
  theme: CVTheme,
  layout: LayoutConfig,
  metrics: ContentMetrics,
  pageEstimate: PageEstimate,
  sectionBalance: SectionBalance[],
  careerStage: CareerStage
): DesignIssue[] {
  const issues: DesignIssue[] = [];
  issues.push(...checkPageCount(pageEstimate, careerStage));
  issues.push(...checkOverflow(pageEstimate));
  issues.push(...checkEmptySpace(pageEstimate, metrics));
  issues.push(...checkContentDensity(metrics));
  issues.push(...checkFontSize(layout));
  issues.push(...checkSpacing(layout));
  issues.push(...checkBullets(metrics));
  issues.push(...checkSkills(metrics));
  issues.push(...checkSummary(metrics));
  issues.push(...checkSectionBalance(sectionBalance));
  issues.push(...checkTemplateMismatch(data, template, metrics, careerStage));
  issues.push(...checkATSRisk(template));
  issues.push(...checkMissingContent(metrics));
  issues.push(...checkSidebarHealth(data, template, metrics));
  return issues;
}

function checkPageCount(pe: PageEstimate, careerStage: CareerStage): DesignIssue[] {
  const issues: DesignIssue[] = [];
  const [min, max] = IDEAL_PAGES[careerStage] || [1, 2];

  if (pe.estimatedPages > max + 1) {
    issues.push({
      id: makeId(), type: "too_many_pages", severity: "critical",
      title: "CV is too long",
      description: `Your CV spans approximately ${pe.estimatedPages} pages. For your experience level, ${min}-${max} pages is recommended.`,
      recommendation: "Consider shortening bullet points, removing less relevant experience, or switching to Compact ATS layout.",
      autoFixAvailable: true, autoFixId: "reduce-spacing",
    });
  } else if (pe.estimatedPages > max) {
    issues.push({
      id: makeId(), type: "too_many_pages", severity: "warning",
      title: "CV may be longer than ideal",
      description: `Your CV is approximately ${pe.estimatedPages} pages. For your career stage, ${min}-${max} pages is optimal.`,
      recommendation: "Review your content for redundancy. Remove outdated roles or consolidate similar bullet points.",
      autoFixAvailable: true, autoFixId: "reduce-spacing",
    });
  }

  return issues;
}

function checkOverflow(pe: PageEstimate): DesignIssue[] {
  const issues: DesignIssue[] = [];
  if (pe.overflowRisk === "high") {
    issues.push({
      id: makeId(), type: "overflow", severity: "critical",
      title: "Content may overflow the page",
      description: `Estimated content height (${pe.contentHeight}pt) exceeds available page space by ${pe.overflowAmount}pt. Some content may be clipped or pushed to an unexpected page.`,
      recommendation: "Reduce content or use a more compact layout to prevent content from being cut off.",
      autoFixAvailable: true, autoFixId: "reduce-spacing",
    });
  } else if (pe.overflowRisk === "medium") {
    issues.push({
      id: makeId(), type: "overflow", severity: "warning",
      title: "Content is approaching page limits",
      description: `Your content is close to filling the page. The layout engine may need to reduce spacing or font size to fit everything.`,
      recommendation: "Consider removing a few bullet points or shortening your summary to give the layout more breathing room.",
      autoFixAvailable: true, autoFixId: "reduce-spacing",
    });
  }
  return issues;
}

function checkEmptySpace(pe: PageEstimate, metrics: ContentMetrics): DesignIssue[] {
  const issues: DesignIssue[] = [];
  if (pe.estimatedPages === 1 && pe.emptySpaceRatio > EMPTY_SPACE_THRESHOLD && metrics.totalChars > 0) {
    issues.push({
      id: makeId(), type: "excessive_whitespace", severity: "info",
      title: "Large empty area detected",
      description: `About ${Math.round(pe.emptySpaceRatio * 100)}% of your CV page is unused space. This can make the CV look incomplete.`,
      recommendation: "Consider adding more detail to your experience, including projects, or using a more spacious template.",
      autoFixAvailable: true, autoFixId: "increase-spacing",
    });
  }
  return issues;
}

function checkContentDensity(metrics: ContentMetrics): DesignIssue[] {
  const issues: DesignIssue[] = [];
  const densityScore = calculateDensityScore(metrics);
  if (densityScore > 85) {
    issues.push({
      id: makeId(), type: "too_dense", severity: "warning",
      title: "CV is very information-dense",
      description: `Your CV contains a high volume of content (${metrics.totalWords} words, ${metrics.sectionCount} sections, ${metrics.bulletCount} bullet points). This may feel overwhelming.`,
      recommendation: "Focus on your most impactful achievements. Remove redundant or outdated information.",
      autoFixAvailable: false,
    });
  }
  return issues;
}

function calculateDensityScore(m: ContentMetrics): number {
  let score = 0;
  score += Math.min(30, m.totalWords / 50);
  score += Math.min(20, m.bulletCount * 1.5);
  score += Math.min(15, m.sectionCount * 2);
  score += Math.min(15, m.skillCount * 0.8);
  score += Math.min(10, m.projectCount * 3);
  score += Math.min(10, m.experienceCount * 3);
  return Math.min(100, Math.round(score));
}

function checkFontSize(layout: LayoutConfig): DesignIssue[] {
  const issues: DesignIssue[] = [];
  const effectiveBodySize = 10 * layout.fontScale;

  if (layout.fontScale < SAFE_MIN_FONT_SCALE) {
    issues.push({
      id: makeId(), type: "small_font", severity: "critical",
      title: "Text is becoming too small to read comfortably",
      description: `The layout engine has reduced font scale to ${layout.fontScale}x, making body text approximately ${effectiveBodySize.toFixed(1)}pt. This may be difficult to read, especially on screen.`,
      recommendation: "Reduce content instead of shrinking text further. Switch to Compact ATS or remove less important sections.",
      autoFixAvailable: false,
    });
  } else if (layout.fontScale < 0.9) {
    issues.push({
      id: makeId(), type: "small_font", severity: "warning",
      title: "Font size is slightly reduced",
      description: `Body text is scaled to ${layout.fontScale}x (${effectiveBodySize.toFixed(1)}pt). This is still readable but on the smaller side.`,
      recommendation: "If you have less important content, removing it would allow larger, more readable text.",
      autoFixAvailable: false,
    });
  }
  return issues;
}

function checkSpacing(layout: LayoutConfig): DesignIssue[] {
  const issues: DesignIssue[] = [];
  if (layout.spacingScale < 0.7) {
    issues.push({
      id: makeId(), type: "inconsistent_spacing", severity: "warning",
      title: "CV is visually crowded",
      description: `Spacing has been reduced to ${Math.round(layout.spacingScale * 100)}% to fit content. This makes the CV harder to scan quickly.`,
      recommendation: "Consider reducing bullet points or switching to a more compact layout instead of compressing all spacing.",
      autoFixAvailable: true, autoFixId: "adjust-spacing",
    });
  }
  return issues;
}

function checkBullets(metrics: ContentMetrics): DesignIssue[] {
  const issues: DesignIssue[] = [];
  if (metrics.longestBullet > MAX_BULLET_LENGTH) {
    issues.push({
      id: makeId(), type: "long_bullets", severity: "warning",
      title: "Some bullet points are too long",
      description: `Your longest bullet is ${metrics.longestBullet} characters. Recruiters typically spend 6-7 seconds scanning each bullet.`,
      recommendation: "Keep bullets to 1-2 lines. Use the formula: Action + Task + Technology + Result.",
      autoFixAvailable: false,
    });
  } else if (metrics.avgBulletLength > IDEAL_BULLET_LENGTH_MAX) {
    issues.push({
      id: makeId(), type: "long_bullets", severity: "info",
      title: "Bullet points could be more concise",
      description: `Average bullet length is ${Math.round(metrics.avgBulletLength)} characters. Aim for ${IDEAL_BULLET_LENGTH_MIN}-${IDEAL_BULLET_LENGTH_MAX} characters.`,
      recommendation: "Tighten your language. Remove filler words. Focus on measurable outcomes.",
      autoFixAvailable: false,
    });
  }
  return issues;
}

function checkSkills(metrics: ContentMetrics): DesignIssue[] {
  const issues: DesignIssue[] = [];
  if (metrics.skillCount > MAX_SKILL_COUNT) {
    issues.push({
      id: makeId(), type: "skill_display", severity: "warning",
      title: "Too many skills listed",
      description: `You have ${metrics.skillCount} skills. Listing more than ${IDEAL_SKILL_COUNT_MAX} skills can dilute the impact of your strongest ones.`,
      recommendation: "Keep your top 10-15 most relevant skills. Group related skills by category.",
      autoFixAvailable: true, autoFixId: "optimize-skills",
    });
  } else if (metrics.skillCount > IDEAL_SKILL_COUNT_MAX) {
    issues.push({
      id: makeId(), type: "skill_display", severity: "info",
      title: "Consider focusing your skills list",
      description: `You have ${metrics.skillCount} skills. While comprehensive, a focused list of 10-15 most relevant skills often has more impact.`,
      recommendation: "Remove outdated or less relevant skills. Group remaining skills by category.",
      autoFixAvailable: true, autoFixId: "optimize-skills",
    });
  }
  return issues;
}

function checkSummary(metrics: ContentMetrics): DesignIssue[] {
  const issues: DesignIssue[] = [];
  if (metrics.summaryLength > 0 && metrics.summaryLength < IDEAL_SUMMARY_LENGTH_MIN) {
    issues.push({
      id: makeId(), type: "missing_content", severity: "info",
      title: "Professional summary is brief",
      description: `Your summary is ${metrics.summaryLength} characters. A stronger summary is typically ${IDEAL_SUMMARY_LENGTH_MIN}-${IDEAL_SUMMARY_LENGTH_MAX} characters.`,
      recommendation: "Include your years of experience, key skills, and one major achievement.",
      autoFixAvailable: false,
    });
  } else if (metrics.summaryLength > IDEAL_SUMMARY_LENGTH_MAX) {
    issues.push({
      id: makeId(), type: "missing_content", severity: "info",
      title: "Professional summary is long",
      description: `Your summary is ${metrics.summaryLength} characters. Recruiters prefer concise summaries of 2-4 sentences.`,
      recommendation: "Focus on your most relevant qualifications. Save details for the experience section.",
      autoFixAvailable: false,
    });
  }
  return issues;
}

function checkSectionBalance(balance: SectionBalance[]): DesignIssue[] {
  const issues: DesignIssue[] = [];
  if (balance.length < 2) return issues;

  const top = balance[0];
  const second = balance[1];

  if (top && top.percentage > 60) {
    issues.push({
      id: makeId(), type: "unbalanced_layout", severity: "info",
      title: "One section dominates the CV",
      description: `"${top.name}" takes up ${top.percentage}% of your content. This may overshadow other important sections.`,
      recommendation: "Consider redistributing emphasis or adding detail to underrepresented sections.",
      autoFixAvailable: false,
    });
  }

  if (balance.length >= 2 && top && second) {
    const ratio = top.percentage / (second.percentage || 1);
    if (ratio > 4) {
      issues.push({
        id: makeId(), type: "unbalanced_layout", severity: "warning",
        title: "Content is heavily unbalanced",
        description: `"${top.name}" (${top.percentage}%) dwarfs "${second.name}" (${second.percentage}%). This creates an uneven visual weight.`,
        recommendation: "Add more detail to smaller sections or trim the dominant section.",
        autoFixAvailable: false,
      });
    }
  }

  return issues;
}

function checkTemplateMismatch(
  data: CVData, template: CVTemplate, metrics: ContentMetrics, careerStage: CareerStage
): DesignIssue[] {
  const issues: DesignIssue[] = [];

  if (template.id === "academic-research" && metrics.publicationCount === 0 && careerStage !== "entry-level") {
    issues.push({
      id: makeId(), type: "template_mismatch", severity: "info",
      title: "Academic template selected without publications",
      description: "The Academic Research template prioritizes publications and research. Your CV has no publications listed.",
      recommendation: "Consider Classic Professional or Executive if you don't have academic publications.",
      autoFixAvailable: false,
    });
  }

  if (template.id === "tech-developer" && metrics.skillCount < 5 && metrics.projectCount < 2) {
    issues.push({
      id: makeId(), type: "template_mismatch", severity: "info",
      title: "Tech template may not showcase your strengths",
      description: "The Tech Developer template emphasizes skills and projects. Your CV has fewer technical elements to display.",
      recommendation: "Modern Sidebar or Classic Professional may better highlight your experience.",
      autoFixAvailable: false,
    });
  }

  if (careerStage === "entry-level" && (template.id === "executive" || template.id === "elegant-editorial")) {
    issues.push({
      id: makeId(), type: "template_mismatch", severity: "info",
      title: "Senior template for entry-level profile",
      description: "This template is designed for senior professionals with extensive experience. It may make limited content look sparse.",
      recommendation: "Compact ATS or Minimalist would better suit an entry-level profile.",
      autoFixAvailable: false,
    });
  }

  return issues;
}

function checkATSRisk(template: CVTemplate): DesignIssue[] {
  const issues: DesignIssue[] = [];
  if (!template.atsSafe) {
    const risks: string[] = [];
    if (template.layoutType === "sidebar-left" || template.layoutType === "sidebar-right") {
      risks.push("sidebar layout");
    }
    if (template.skillsStyle === "bars" || template.skillsStyle === "proficiency-grid") {
      risks.push("visual skill bars");
    }
    if (template.experienceStyle === "card" || template.experienceStyle === "timeline") {
      risks.push("non-standard experience format");
    }
    if (template.layoutType === "two-column" || template.layoutType === "editorial") {
      risks.push("multi-column layout");
    }

    if (risks.length > 0) {
      issues.push({
        id: makeId(), type: "ats_risk", severity: "info",
        title: "This design may reduce ATS compatibility",
        description: `The ${template.name} template uses ${risks.join(", ")}, which some ATS systems may not parse correctly.`,
        recommendation: "For ATS-heavy applications (online portals), consider Compact ATS or Classic Professional.",
        autoFixAvailable: false,
      });
    }
  }
  return issues;
}

function checkMissingContent(metrics: ContentMetrics): DesignIssue[] {
  const issues: DesignIssue[] = [];
  if (!metrics.hasEmail) {
    issues.push({
      id: makeId(), type: "missing_content", severity: "warning",
      title: "Email address is missing",
      description: "An email address is essential for recruiters to contact you.",
      recommendation: "Add a professional email address in the Personal Information section.",
      autoFixAvailable: false,
    });
  }
  if (!metrics.hasPhone) {
    issues.push({
      id: makeId(), type: "missing_content", severity: "warning",
      title: "Phone number is missing",
      description: "A phone number allows recruiters to reach you quickly.",
      recommendation: "Add your phone number with country code in the Personal Information section.",
      autoFixAvailable: false,
    });
  }
  if (metrics.summaryLength === 0) {
    issues.push({
      id: makeId(), type: "missing_content", severity: "info",
      title: "No professional summary",
      description: "A summary helps recruiters quickly understand your qualifications.",
      recommendation: "Add a 2-4 sentence professional summary highlighting your key strengths.",
      autoFixAvailable: false,
    });
  }
  if (metrics.experienceCount === 0 && metrics.projectCount === 0) {
    issues.push({
      id: makeId(), type: "missing_content", severity: "warning",
      title: "No work experience or projects",
      description: "Your CV has no experience or project entries. This makes it hard for recruiters to assess your capabilities.",
      recommendation: "Add relevant work experience, internships, or personal projects.",
      autoFixAvailable: false,
    });
  }
  return issues;
}

function checkSidebarHealth(
  data: CVData, template: CVTemplate, metrics: ContentMetrics
): DesignIssue[] {
  const issues: DesignIssue[] = [];
  const isSidebar = template.layoutType === "sidebar-left" || template.layoutType === "sidebar-right";
  if (!isSidebar) return issues;

  const sidebarSections = (data.skills.length > 0 ? 1 : 0) +
    (data.languages.length > 0 ? 1 : 0) +
    (data.certifications.length > 0 ? 1 : 0) +
    (data.personal.email ? 1 : 0) + (data.personal.phone ? 1 : 0);

  if (metrics.skillCount > 15 && sidebarSections > 3) {
    issues.push({
      id: makeId(), type: "sidebar_overflow", severity: "warning",
      title: "Sidebar may be overloaded",
      description: `The sidebar contains ${metrics.skillCount} skills plus ${sidebarSections} other sections. This may cause overflow or visual crowding.`,
      recommendation: "Group skills by category or move some skills to the main content area.",
      autoFixAvailable: true, autoFixId: "optimize-sidebar",
    });
  }

  return issues;
}
