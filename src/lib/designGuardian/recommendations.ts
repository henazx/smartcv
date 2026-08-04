import { DesignIssue } from "./types";
import { CVData, CVTemplate, CareerStage } from "@/types";
import { templates } from "@/lib/templates";

export interface DesignRecommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  action?: string;
}

export function generateRecommendations(
  issues: DesignIssue[],
  data: CVData,
  template: CVTemplate,
  careerStage: CareerStage
): DesignRecommendation[] {
  const recs: DesignRecommendation[] = [];

  const criticalIssues = issues.filter((i) => i.severity === "critical");
  const warnings = issues.filter((i) => i.severity === "warning");

  for (const issue of criticalIssues) {
    recs.push({
      id: `rec-${issue.id}`,
      title: issue.title,
      description: issue.recommendation,
      priority: "high",
    });
  }

  for (const issue of warnings.slice(0, 3)) {
    recs.push({
      id: `rec-${issue.id}`,
      title: issue.title,
      description: issue.recommendation,
      priority: "medium",
    });
  }

  const hasTemplateMismatch = issues.some((i) => i.type === "template_mismatch");
  if (hasTemplateMismatch) {
    const betterTemplates = findBetterTemplates(data, template, careerStage);
    if (betterTemplates.length > 0) {
      recs.push({
        id: "rec-better-template",
        title: "A better template may be available",
        description: `Based on your content, ${betterTemplates[0].name} might be a better fit because ${getTemplateReason(betterTemplates[0])}.`,
        priority: "medium",
        action: "change-template",
      });
    }
  }

  if (recs.length === 0) {
    recs.push({
      id: "rec-all-good",
      title: "Your CV design looks great",
      description: "No major design issues detected. Your CV is well-structured and ready for export.",
      priority: "low",
    });
  }

  return recs;
}

function findBetterTemplates(
  data: CVData, currentTemplate: CVTemplate, careerStage: CareerStage
): CVTemplate[] {
  const candidates = templates.filter((t) => t.id !== currentTemplate.id);
  const scored = candidates.map((t) => {
    let score = 0;
    if (careerStage === "entry-level" && (t.id === "compact-ats" || t.id === "classic-professional")) score += 3;
    if (careerStage === "senior" && (t.id === "executive" || t.id === "elegant-editorial")) score += 3;
    if (data.publications.length > 0 && t.id === "academic-research") score += 2;
    if (data.projects.length > 0 && (t.id === "tech-developer" || t.id === "creative-portfolio")) score += 2;
    if (data.skills.length > 10 && t.skillsStyle === "grouped") score += 1;
    if (t.atsSafe && !currentTemplate.atsSafe) score += 1;
    return { template: t, score };
  });
  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).map((s) => s.template);
}

function getTemplateReason(template: CVTemplate): string {
  if (template.id === "tech-developer") return "you have technical skills and projects";
  if (template.id === "compact-ats") return "it maximizes ATS compatibility";
  if (template.id === "classic-professional") return "it's universally accepted across industries";
  if (template.id === "academic-research") return "you have publications and academic content";
  if (template.id === "executive") return "it's designed for senior professionals";
  if (template.id === "minimalist") return "your content is concise and benefits from whitespace";
  return "it matches your content profile better";
}
