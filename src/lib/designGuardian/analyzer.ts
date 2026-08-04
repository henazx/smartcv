import { CVData, CVTemplate, LayoutConfig } from "@/types";
import { ContentMetrics, PageEstimate, SectionBalance } from "./types";
import {
  A4_HEIGHT_PT, DEFAULT_PADDING, USABLE_HEIGHT,
  SECTION_HEIGHTS, BULLET_HEIGHT, SECTION_TITLE_HEIGHT, SECTION_GAP_BASE,
} from "./constants";

export function analyzeContentMetrics(data: CVData): ContentMetrics {
  const allBullets = data.experiences.flatMap((e) => e.bullets);
  const allTexts = [
    ...data.experiences.flatMap((e) => [e.company, e.role, ...e.bullets]),
    ...data.education.flatMap((e) => [e.institution, e.degree, e.field]),
    ...data.projects.flatMap((p) => [p.name, p.description, ...p.bullets]),
    ...data.publications.map((p) => p.title),
    ...data.awards.map((a) => a.name),
    data.personal.fullName,
    data.personal.summary,
    data.personal.headline,
  ];

  const totalChars = allTexts.join("").length;
  const totalWords = allTexts.join(" ").split(/\s+/).filter(Boolean).length;
  const bulletLengths = allBullets.filter((b) => b.trim()).map((b) => b.length);
  const avgBulletLength = bulletLengths.length > 0
    ? bulletLengths.reduce((a, b) => a + b, 0) / bulletLengths.length
    : 0;
  const longestBullet = bulletLengths.length > 0 ? Math.max(...bulletLengths) : 0;

  const activeSections = [
    data.personal.summary ? "summary" : null,
    data.experiences.length > 0 ? "experience" : null,
    data.education.length > 0 ? "education" : null,
    data.skills.length > 0 ? "skills" : null,
    data.projects.length > 0 ? "projects" : null,
    data.languages.length > 0 ? "languages" : null,
    data.certifications.length > 0 ? "certifications" : null,
    data.awards.length > 0 ? "awards" : null,
    data.publications.length > 0 ? "publications" : null,
    data.references.length > 0 ? "references" : null,
  ].filter(Boolean);

  return {
    totalWords,
    totalChars,
    sectionCount: activeSections.length,
    experienceCount: data.experiences.length,
    bulletCount: allBullets.filter((b) => b.trim()).length,
    avgBulletLength,
    longestBullet,
    skillCount: data.skills.length,
    projectCount: data.projects.length,
    educationCount: data.education.length,
    certificationCount: data.certifications.length,
    awardCount: data.awards.length,
    publicationCount: data.publications.length,
    languageCount: data.languages.length,
    referenceCount: data.references.length,
    summaryLength: data.personal.summary.length,
    hasPhoto: !!data.personal.photoUrl,
    hasLinkedIn: !!data.personal.linkedIn,
    hasGitHub: !!data.personal.github,
    hasWebsite: !!data.personal.website,
    hasEmail: !!data.personal.email,
    hasPhone: !!data.personal.phone,
    hasAddress: !!data.personal.address,
  };
}

export function estimatePages(
  data: CVData,
  template: CVTemplate,
  layout: LayoutConfig
): PageEstimate {
  const isSidebar = template.layoutType === "sidebar-left" || template.layoutType === "sidebar-right";

  let mainHeight = 0;
  let sidebarHeight = 0;

  const sectionGap = SECTION_GAP_BASE * layout.spacingScale;
  const fontScale = layout.fontScale;

  if (data.personal.fullName || data.personal.summary) {
    mainHeight += SECTION_HEIGHTS.personal * fontScale;
  }
  if (data.personal.summary) {
    const lines = Math.ceil(data.personal.summary.length / 80);
    mainHeight += SECTION_HEIGHTS.summary * fontScale * Math.min(lines, 4);
  }

  for (const exp of data.experiences) {
    mainHeight += SECTION_TITLE_HEIGHT * fontScale;
    mainHeight += 20 * fontScale;
    const bullets = exp.bullets.filter((b) => b.trim());
    mainHeight += bullets.length * BULLET_HEIGHT * fontScale;
    mainHeight += sectionGap;
  }

  mainHeight += data.education.length * (25 * fontScale + sectionGap * 0.5);

  if (data.skills.length > 0) {
    mainHeight += SECTION_TITLE_HEIGHT * fontScale;
    const skillsPerLine = isSidebar ? 1 : 3;
    const skillLines = Math.ceil(data.skills.length / skillsPerLine);
    mainHeight += skillLines * 12 * fontScale;
    mainHeight += sectionGap;
  }

  for (const proj of data.projects) {
    mainHeight += 15 * fontScale;
    const bullets = proj.bullets.filter((b) => b.trim());
    mainHeight += bullets.length * BULLET_HEIGHT * fontScale;
    if (proj.technologies.length > 0) mainHeight += 10 * fontScale;
    mainHeight += sectionGap * 0.5;
  }

  if (data.languages.length > 0) {
    mainHeight += 15 * fontScale;
  }
  if (data.certifications.length > 0) {
    mainHeight += data.certifications.length * 12 * fontScale;
  }
  if (data.awards.length > 0) {
    mainHeight += data.awards.length * 15 * fontScale;
  }
  if (data.publications.length > 0) {
    mainHeight += data.publications.length * 15 * fontScale;
  }

  if (isSidebar) {
    sidebarHeight = mainHeight * 0.6;
    sidebarHeight += (data.skills.length * 10 + data.languages.length * 10 + data.certifications.length * 10) * fontScale;
  }

  const contentHeight = Math.max(mainHeight, sidebarHeight);
  const totalPadding = DEFAULT_PADDING * 2;
  const availableHeight = USABLE_HEIGHT;
  const estimatedPages = Math.max(1, Math.ceil((contentHeight + totalPadding) / A4_HEIGHT_PT));
  const overflowAmount = Math.max(0, contentHeight - availableHeight);
  const emptySpaceOnLastPage = estimatedPages > 1
    ? Math.max(0, availableHeight - (contentHeight % availableHeight || availableHeight))
    : Math.max(0, availableHeight - contentHeight);
  const emptySpaceRatio = emptySpaceOnLastPage / availableHeight;

  let overflowRisk: "none" | "low" | "medium" | "high" = "none";
  if (overflowAmount > availableHeight * 0.5) overflowRisk = "high";
  else if (overflowAmount > availableHeight * 0.2) overflowRisk = "medium";
  else if (overflowAmount > 0) overflowRisk = "low";

  return {
    estimatedPages,
    contentHeight: Math.round(contentHeight),
    availableHeight,
    overflowAmount: Math.round(overflowAmount),
    overflowRisk,
    emptySpaceRatio: Math.round(emptySpaceRatio * 100) / 100,
  };
}

export function analyzeSectionBalance(
  data: CVData,
  layout: LayoutConfig
): SectionBalance[] {
  const sections: SectionBalance[] = [];
  const fontScale = layout.fontScale;
  const spacingScale = layout.spacingScale;
  const sectionGap = SECTION_GAP_BASE * spacingScale;

  if (data.personal.summary) {
    const lines = Math.ceil(data.personal.summary.length / 80);
    sections.push({ name: "Summary", estimatedHeight: SECTION_HEIGHTS.summary * fontScale * Math.min(lines, 4), percentage: 0 });
  }

  if (data.experiences.length > 0) {
    let h = SECTION_TITLE_HEIGHT * fontScale;
    for (const exp of data.experiences) {
      h += 20 * fontScale;
      h += exp.bullets.filter((b) => b.trim()).length * BULLET_HEIGHT * fontScale;
      h += sectionGap * 0.5;
    }
    sections.push({ name: "Experience", estimatedHeight: h, percentage: 0 });
  }

  if (data.education.length > 0) {
    sections.push({ name: "Education", estimatedHeight: data.education.length * 25 * fontScale, percentage: 0 });
  }

  if (data.skills.length > 0) {
    const skillLines = Math.ceil(data.skills.length / 3);
    sections.push({ name: "Skills", estimatedHeight: SECTION_TITLE_HEIGHT * fontScale + skillLines * 12 * fontScale, percentage: 0 });
  }

  if (data.projects.length > 0) {
    let h = SECTION_TITLE_HEIGHT * fontScale;
    for (const proj of data.projects) {
      h += 15 * fontScale;
      h += proj.bullets.filter((b) => b.trim()).length * BULLET_HEIGHT * fontScale;
      h += sectionGap * 0.3;
    }
    sections.push({ name: "Projects", estimatedHeight: h, percentage: 0 });
  }

  if (data.languages.length > 0) {
    sections.push({ name: "Languages", estimatedHeight: 15 * fontScale + data.languages.length * 10 * fontScale, percentage: 0 });
  }
  if (data.certifications.length > 0) {
    sections.push({ name: "Certifications", estimatedHeight: data.certifications.length * 12 * fontScale, percentage: 0 });
  }
  if (data.awards.length > 0) {
    sections.push({ name: "Awards", estimatedHeight: data.awards.length * 15 * fontScale, percentage: 0 });
  }
  if (data.publications.length > 0) {
    sections.push({ name: "Publications", estimatedHeight: data.publications.length * 15 * fontScale, percentage: 0 });
  }

  const totalHeight = sections.reduce((sum, s) => sum + s.estimatedHeight, 0) || 1;
  for (const s of sections) {
    s.percentage = Math.round((s.estimatedHeight / totalHeight) * 100);
  }

  return sections.sort((a, b) => b.percentage - a.percentage);
}
