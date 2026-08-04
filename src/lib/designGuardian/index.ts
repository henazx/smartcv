import { CVData, CVTemplate, CVTheme, LayoutConfig } from "@/types";
import { DesignGuardianResult, DesignGuardianConfig, LayoutConstraints } from "./types";
import { analyzeContentMetrics, estimatePages, analyzeSectionBalance } from "./analyzer";
import { runAllRules } from "./rules";
import { calculateDesignScore } from "./scoring";
import { generateAutoFixes } from "./autoFix";
import { analyzeContent } from "@/lib/layoutEngine";

export type { DesignIssue, DesignHealthScore, AutoFix, ContentMetrics, PageEstimate, SectionBalance, LayoutConstraints } from "./types";
export type { DesignRecommendation } from "./recommendations";
export { getStatusLabel, getStatusColor, getSeverityColor } from "./scoring";
export { applyAutoFix, applyAllSafeFixes } from "./autoFix";

let lastResult: DesignGuardianResult | null = null;

export function runDesignGuardian(config: DesignGuardianConfig): DesignGuardianResult {
  const { data, template, theme, layout } = config;
  const analysis = analyzeContent(data);
  const metrics = analyzeContentMetrics(data);
  const pageEstimate = estimatePages(data, template, layout);
  const sectionBalance = analyzeSectionBalance(data, layout);
  const issues = runAllRules(data, template, theme, layout, metrics, pageEstimate, sectionBalance, analysis.careerStage);
  const score = calculateDesignScore(issues);
  const constraints = deriveConstraints(issues, layout);
  const autoFixes = generateAutoFixes(issues, data, template, theme, layout);

  const result: DesignGuardianResult = {
    issues,
    score,
    metrics,
    pageEstimate,
    sectionBalance,
    constraints,
    autoFixes,
  };

  lastResult = result;
  return result;
}

export function getLastResult(): DesignGuardianResult | null {
  return lastResult;
}

export function runExportSafetyCheck(
  data: CVData,
  template: CVTemplate,
  theme: CVTheme,
  layout: LayoutConfig
): { safe: boolean; checks: { label: string; pass: boolean; message?: string }[]; result: DesignGuardianResult } {
  const result = runDesignGuardian({ data, template, theme, layout, careerStage: analyzeContent(data).careerStage, contentDensity: analyzeContent(data).contentDensity });
  const checks = [
    {
      label: "No content overflow",
      pass: !result.issues.some((i) => i.type === "overflow" && i.severity === "critical"),
      message: result.issues.find((i) => i.type === "overflow" && i.severity === "critical")?.description,
    },
    {
      label: "No blank pages",
      pass: result.pageEstimate.estimatedPages >= 1,
    },
    {
      label: "Text is readable",
      pass: !result.issues.some((i) => i.type === "small_font" && i.severity === "critical"),
      message: result.issues.find((i) => i.type === "small_font" && i.severity === "critical")?.description,
    },
    {
      label: `Page count: ${result.pageEstimate.estimatedPages}`,
      pass: result.pageEstimate.estimatedPages <= 3,
    },
    {
      label: "Contact information visible",
      pass: result.metrics.hasEmail || result.metrics.hasPhone,
    },
    {
      label: "Layout is balanced",
      pass: !result.issues.some((i) => i.type === "unbalanced_layout" && i.severity === "warning"),
    },
    {
      label: "PDF is ready",
      pass: result.score.overall >= 60,
    },
  ];

  return {
    safe: checks.every((c) => c.pass),
    checks,
    result,
  };
}

function deriveConstraints(issues: import("./types").DesignIssue[], layout: LayoutConfig): LayoutConstraints {
  const constraints: LayoutConstraints = {};

  const hasOverflow = issues.some((i) => i.type === "overflow");
  if (hasOverflow) {
    constraints.minFontScale = 0.85;
    constraints.preferredSpacingScale = Math.max(0.75, layout.spacingScale - 0.1);
  }

  const hasSmallFont = issues.some((i) => i.type === "small_font" && i.severity === "critical");
  if (hasSmallFont) {
    constraints.minFontScale = 0.9;
    constraints.maxPages = 2;
  }

  const hasTooManyPages = issues.some((i) => i.type === "too_many_pages" && i.severity === "critical");
  if (hasTooManyPages) {
    constraints.maxPages = 2;
  }

  return constraints;
}

export function getSmartFixSummary(data: CVData, template: CVTemplate, theme: CVTheme, layout: LayoutConfig): string {
  const result = runDesignGuardian({ data, template, theme, layout, careerStage: analyzeContent(data).careerStage, contentDensity: analyzeContent(data).contentDensity });
  const criticalCount = result.issues.filter((i) => i.severity === "critical").length;
  const warningCount = result.issues.filter((i) => i.severity === "warning").length;

  if (criticalCount === 0 && warningCount === 0) {
    return "Your CV design is in great shape. No fixes needed.";
  }

  const parts: string[] = [];
  if (criticalCount > 0) parts.push(`${criticalCount} critical issue${criticalCount > 1 ? "s" : ""}`);
  if (warningCount > 0) parts.push(`${warningCount} warning${warningCount > 1 ? "s" : ""}`);

  return `${parts.join(" and ")} detected. ${result.autoFixes.length > 0 ? `${result.autoFixes.length} auto-fix${result.autoFixes.length > 1 ? "es" : ""} available.` : "Review recommendations for manual improvements."}`;
}
