import {
  CVData,
  CVTemplate,
  ContentAnalysis,
  LayoutConfig,
  SectionOrder,
  CareerStage,
  ContentDensity,
  CVProfile,
} from "@/types";

/**
 * SMART LAYOUT ENGINE (template-aware)
 *
 * The engine now works WITH templates, not instead of them.
 * Templates define the structural design.
 * The engine adapts that structure to the user's content.
 */

export function analyzeContent(data: CVData): ContentAnalysis {
  const now = new Date();

  let totalDays = 0;
  data.experiences.forEach((exp) => {
    const start = new Date(exp.startDate);
    const end = exp.current ? now : new Date(exp.endDate);
    const diff = end.getTime() - start.getTime();
    if (diff > 0) totalDays += diff;
  });
  const experienceYears = Math.round((totalDays / (1000 * 60 * 60 * 24 * 365)) * 10) / 10;

  const experienceEntryCount = data.experiences.length;
  const hasLongSkillsList = data.skills.length > 8;
  const hasProjects = data.projects.length > 0;
  const hasPublications = data.publications.length > 0;
  const hasAwards = data.awards.length > 0;

  let careerStage: CareerStage;
  if (experienceYears <= 2 || experienceEntryCount <= 1) {
    careerStage = "entry-level";
  } else if (experienceYears <= 8) {
    careerStage = "mid-level";
  } else {
    careerStage = "senior";
  }

  const totalCharCount = [
    data.personal.summary,
    data.personal.headline,
    ...data.experiences.flatMap((e) => [e.company, e.role, ...e.bullets]),
    ...data.education.flatMap((e) => [e.institution, e.degree, e.field]),
    ...data.projects.flatMap((p) => [p.name, p.description, ...p.bullets]),
    ...data.publications.map((p) => p.title),
    ...data.awards.map((a) => a.name),
    data.personal.fullName,
  ]
    .join("")
    .replace(/\s/g, "").length;

  let contentDensity: ContentDensity;
  if (totalCharCount < 800) {
    contentDensity = "light";
  } else if (totalCharCount < 2000) {
    contentDensity = "medium";
  } else {
    contentDensity = "heavy";
  }

  const skillCategories = Array.from(new Set(data.skills.map((s) => s.category).filter(Boolean)));

  return {
    experienceYears,
    experienceEntryCount,
    hasLongSkillsList,
    hasProjects,
    hasPublications,
    hasAwards,
    careerStage,
    contentDensity,
    totalCharCount,
    skillCategories,
  };
}

function getDefaultSectionOrder(template: CVTemplate, careerStage: CareerStage): SectionOrder {
  // Templates can have their own preferred ordering
  switch (template.id) {
    case "tech-developer":
      return {
        main: ["summary", "skills", "experience", "projects", "education", "certifications"],
        sidebar: ["contact", "skills", "certifications", "languages"],
      };
    case "academic-research":
      return {
        main: ["summary", "education", "publications", "experience", "projects", "awards", "skills", "certifications"],
        sidebar: [],
      };
    case "executive":
      return {
        main: ["summary", "experience", "skills", "education", "certifications", "awards"],
        sidebar: [],
      };
    case "creative-portfolio":
      return {
        main: ["summary", "experience", "projects", "education", "awards"],
        sidebar: ["contact", "skills", "languages", "certifications"],
      };
    case "modern-sidebar":
      return {
        main: ["summary", "experience", "education", "projects"],
        sidebar: ["contact", "skills", "languages", "certifications"],
      };
    case "split-profile":
      return {
        main: ["summary", "experience", "education", "skills", "projects", "languages"],
        sidebar: [],
      };
    case "elegant-editorial":
      return {
        main: ["summary", "experience", "education", "skills", "projects", "awards", "certifications", "languages"],
        sidebar: [],
      };
    default:
      // Career stage based ordering for templates that don't specify
      switch (careerStage) {
        case "entry-level":
          return {
            main: ["summary", "education", "skills", "experience", "projects", "certifications", "languages"],
            sidebar: template.supportsSidebar ? ["contact", "skills", "languages"] : [],
          };
        case "mid-level":
          return {
            main: ["summary", "experience", "skills", "education", "projects", "certifications", "languages"],
            sidebar: template.supportsSidebar ? ["contact", "skills", "languages"] : [],
          };
        case "senior":
          return {
            main: ["summary", "experience", "certifications", "skills", "education", "projects", "languages"],
            sidebar: template.supportsSidebar ? ["contact", "skills", "languages"] : [],
          };
      }
  }
}

function getFontScale(contentDensity: ContentDensity, careerStage: CareerStage): number {
  let base = 1.0;
  switch (contentDensity) {
    case "light": base = 1.1; break;
    case "medium": base = 1.0; break;
    case "heavy": base = 0.9; break;
  }
  if (careerStage === "senior") base *= 0.95;
  return Math.round(base * 100) / 100;
}

function getSpacingScale(contentDensity: ContentDensity): number {
  switch (contentDensity) {
    case "light": return 1.2;
    case "medium": return 1.0;
    case "heavy": return 0.85;
  }
}

export function computeLayout(data: CVData, template: CVTemplate, profile?: CVProfile): LayoutConfig {
  const analysis = analyzeContent(data);

  // Use profile-based section order if available, otherwise fall back to template defaults
  let sectionOrder: SectionOrder;
  if (profile?.recommendedSectionOrder?.length) {
    const mainSections = profile.recommendedSectionOrder.filter((s) => s !== "personal" && s !== "contact" && s !== "skills");
    const sidebarSections = template.supportsSidebar
      ? profile.recommendedSectionOrder.filter((s) => s === "contact" || s === "skills" || s === "languages" || s === "certifications")
      : [];
    sectionOrder = { main: mainSections, sidebar: sidebarSections };
  } else {
    sectionOrder = getDefaultSectionOrder(template, analysis.careerStage);
  }

  const layout: LayoutConfig = {
    sectionOrder,
    fontScale: getFontScale(analysis.contentDensity, analysis.careerStage),
    spacingScale: getSpacingScale(analysis.contentDensity),
    photoSize: 60,
    sidebarWidth: template.layoutType === "sidebar-left" || template.layoutType === "sidebar-right" ? 35 : 0,
    atsMode: template.atsSafe,
  };

  return layout;
}

export interface HeightEstimate {
  totalHeight: number;
  availableHeight: number;
  overflowRisk: "none" | "low" | "medium" | "high";
  estimatedPages: number;
  overflowAmount: number;
}

const A4_HEIGHT = 841.89;
const A4_PADDING = 60;
const USABLE_HEIGHT = A4_HEIGHT - A4_PADDING;

export function estimateContentHeight(data: CVData, layout: LayoutConfig, template: CVTemplate): HeightEstimate {
  const fs = layout.fontScale;
  const ss = layout.spacingScale;
  const isSidebar = template.layoutType === "sidebar-left" || template.layoutType === "sidebar-right";

  let height = 0;

  // Header height (name + headline + contact)
  height += 30;
  if (data.personal.headline) height += 14;
  height += 20; // contact row

  // Divider
  height += 14;

  // Summary
  if (data.personal.summary) {
    height += 16; // section title
    height += Math.ceil(data.personal.summary.length / 60) * 14 * fs;
  }

  // Experience section
  if (data.experiences.length > 0) {
    height += 16; // section title
    data.experiences.forEach((exp) => {
      height += 28; // header + company
      const bulletCount = exp.bullets.filter((b) => b.trim()).length;
      height += bulletCount * 14 * fs;
      height += 8; // spacing between items
    });
  }

  // Education
  if (data.education.length > 0) {
    height += 16;
    data.education.forEach(() => {
      height += 24;
    });
  }

  // Skills
  if (data.skills.length > 0) {
    height += 16;
    if (template.skillsStyle === "tags") {
      height += Math.ceil(data.skills.length / 4) * 20;
    } else if (template.skillsStyle === "bars") {
      height += data.skills.length * 16;
    } else if (template.skillsStyle === "grouped") {
      const cats = new Set(data.skills.map((s) => s.category || "General"));
      height += cats.size * 24;
    } else {
      height += Math.ceil(data.skills.length / 2) * 14;
    }
  }

  // Projects
  if (data.projects.length > 0) {
    height += 16;
    data.projects.forEach((proj) => {
      height += 16;
      if (proj.description) height += Math.ceil(proj.description.length / 60) * 14 * fs;
      if (proj.technologies.length > 0) height += 14;
      height += proj.bullets.filter((b) => b.trim()).length * 14 * fs;
    });
  }

  // Languages
  if (data.languages.length > 0) {
    height += 16;
    height += Math.ceil(data.languages.length / 3) * 14;
  }

  // Certifications
  if (data.certifications.length > 0) {
    height += 16;
    height += data.certifications.length * 16;
  }

  // Awards
  if (data.awards.length > 0) {
    height += 16;
    height += data.awards.length * 16;
  }

  // Publications
  if (data.publications.length > 0) {
    height += 16;
    height += data.publications.length * 20;
  }

  // Section gaps
  const sectionCount = [
    data.personal.summary,
    data.experiences.length > 0,
    data.education.length > 0,
    data.skills.length > 0,
    data.projects.length > 0,
    data.languages.length > 0,
    data.certifications.length > 0,
    data.awards.length > 0,
    data.publications.length > 0,
  ].filter(Boolean).length;
  height += sectionCount * 8 * ss;

  const availableHeight = isSidebar ? USABLE_HEIGHT : USABLE_HEIGHT;
  const estimatedPages = Math.max(1, Math.ceil(height / availableHeight));
  const overflowAmount = Math.max(0, height - availableHeight);

  let overflowRisk: "none" | "low" | "medium" | "high" = "none";
  if (overflowAmount > availableHeight * 0.5) overflowRisk = "high";
  else if (overflowAmount > availableHeight * 0.2) overflowRisk = "medium";
  else if (overflowAmount > 0) overflowRisk = "low";

  return {
    totalHeight: Math.round(height),
    availableHeight: Math.round(availableHeight),
    overflowRisk,
    estimatedPages,
    overflowAmount: Math.round(overflowAmount),
  };
}

export function applyManualOverrides(
  autoLayout: LayoutConfig,
  overrides: Partial<LayoutConfig>
): LayoutConfig {
  return {
    ...autoLayout,
    ...Object.fromEntries(
      Object.entries(overrides).filter(([, v]) => v !== undefined && v !== null)
    ),
  };
}

// --- Template Recommendations (profile-aware) ---

export interface TemplateRecommendation {
  templateId: string;
  reason: string;
  score: number; // 0-100 relevance score
}

export function recommendTemplates(data: CVData, profile?: CVProfile): TemplateRecommendation[] {
  const analysis = analyzeContent(data);
  const scores: Record<string, number> = {};
  const reasons: Record<string, string[]> = {};

  // Score each template 0-100 based on multiple factors
  const allTemplateIds = [
    "classic-professional", "modern-sidebar", "minimalist", "executive",
    "timeline", "compact-ats", "modern-header", "split-profile",
    "creative-portfolio", "tech-developer", "academic-research", "elegant-editorial",
  ];
  allTemplateIds.forEach((id) => { scores[id] = 50; reasons[id] = []; });

  // 1. Profile-based boost (if cvType is set, heavily boost matching template)
  if (profile?.cvType) {
    const cvTypeToTemplate: Record<string, string> = {
      "tech-developer": "tech-developer",
      "academic": "academic-research",
      "creative-design": "creative-portfolio",
      "executive": "executive",
      "entry-level": "compact-ats",
      "modern": "modern-sidebar",
      "minimalist": "minimalist",
      "professional": "classic-professional",
    };
    const match = cvTypeToTemplate[profile.cvType];
    if (match) {
      scores[match] += 40;
      reasons[match].push(`Best match for ${profile.cvType} CV type`);
    }
  }

  // 2. Career stage boost
  if (analysis.careerStage === "senior") {
    scores["executive"] += 20;
    reasons["executive"].push("Great for senior professionals");
    scores["elegant-editorial"] += 15;
    reasons["elegant-editorial"].push("Sophisticated design for experienced candidates");
  } else if (analysis.careerStage === "entry-level") {
    scores["compact-ats"] += 20;
    reasons["compact-ats"].push("ATS-optimized for entry-level applications");
    scores["classic-professional"] += 15;
    reasons["classic-professional"].push("Clean and professional for new graduates");
  } else {
    scores["modern-sidebar"] += 10;
    reasons["modern-sidebar"].push("Balanced layout for mid-career professionals");
    scores["modern-header"] += 10;
    reasons["modern-header"].push("Modern look with clear structure");
  }

  // 3. Content density
  if (analysis.contentDensity === "light") {
    scores["minimalist"] += 20;
    reasons["minimalist"].push("Minimalist design suits lighter content");
  } else if (analysis.contentDensity === "heavy") {
    scores["compact-ats"] += 15;
    reasons["compact-ats"].push("Compact layout handles dense content well");
    scores["timeline"] += 10;
    reasons["timeline"].push("Timeline organizes extensive experience clearly");
  }

  // 4. Skills count
  if (analysis.hasLongSkillsList) {
    scores["tech-developer"] += 15;
    reasons["tech-developer"].push("Skills-focused layout for technical roles");
    scores["modern-sidebar"] += 10;
    reasons["modern-sidebar"].push("Sidebar handles long skills lists well");
  }

  // 5. Projects
  if (analysis.hasProjects) {
    scores["creative-portfolio"] += 15;
    reasons["creative-portfolio"].push("Showcases projects prominently");
    scores["tech-developer"] += 10;
    reasons["tech-developer"].push("Project grid layout highlights technical work");
  }

  // 6. Publications
  if (analysis.hasPublications) {
    scores["academic-research"] += 25;
    reasons["academic-research"].push("Designed specifically for academic CVs");
  }

  // 7. ATS safety (always a good default)
  scores["classic-professional"] += 5;
  scores["compact-ats"] += 5;

  // Sort by score descending and return top 5
  const results: TemplateRecommendation[] = allTemplateIds
    .map((id) => ({
      templateId: id,
      reason: reasons[id].length > 0 ? reasons[id][0] : "Solid choice for your profile",
      score: Math.min(100, scores[id]),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return results;
}
