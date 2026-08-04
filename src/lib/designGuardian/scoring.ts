import { DesignIssue, DesignHealthScore } from "./types";

export function calculateDesignScore(issues: DesignIssue[]): DesignHealthScore {
  const readability = calculateDimensionScore(issues, ["long_bullets", "small_font", "missing_content"]);
  const spacing = calculateDimensionScore(issues, ["inconsistent_spacing", "excessive_whitespace", "too_dense"]);
  const balance = calculateDimensionScore(issues, ["unbalanced_layout", "section_split"]);
  const pageStructure = calculateDimensionScore(issues, ["overflow", "too_many_pages", "orphan_heading", "bad_page_break"]);
  const typography = calculateDimensionScore(issues, ["small_font", "large_font"]);
  const atsSafety = calculateDimensionScore(issues, ["ats_risk", "template_mismatch"]);

  const overall = Math.round(
    readability * 0.25 +
    spacing * 0.20 +
    balance * 0.15 +
    pageStructure * 0.20 +
    typography * 0.10 +
    atsSafety * 0.10
  );

  let status: DesignHealthScore["status"];
  if (overall >= 90) status = "excellent";
  else if (overall >= 75) status = "good";
  else if (overall >= 60) status = "needs-improvement";
  else status = "critical";

  return {
    overall,
    dimensions: {
      readability: Math.round(readability),
      spacing: Math.round(spacing),
      balance: Math.round(balance),
      pageStructure: Math.round(pageStructure),
      typography: Math.round(typography),
      atsSafety: Math.round(atsSafety),
    },
    status,
  };
}

function calculateDimensionScore(issues: DesignIssue[], relatedTypes: string[]): number {
  let score = 100;
  for (const issue of issues) {
    if (relatedTypes.includes(issue.type)) {
      switch (issue.severity) {
        case "critical": score -= 25; break;
        case "warning": score -= 12; break;
        case "info": score -= 5; break;
      }
    }
  }
  return Math.max(0, Math.min(100, score));
}

export function getStatusLabel(status: DesignHealthScore["status"]): string {
  switch (status) {
    case "excellent": return "Excellent";
    case "good": return "Good";
    case "needs-improvement": return "Needs Improvement";
    case "critical": return "Critical Issues";
  }
}

export function getStatusColor(status: DesignHealthScore["status"]): string {
  switch (status) {
    case "excellent": return "#009A44";
    case "good": return "#2563eb";
    case "needs-improvement": return "#c5a800";
    case "critical": return "#DA121A";
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical": return "#DA121A";
    case "warning": return "#c5a800";
    case "info": return "#6b7280";
    case "success": return "#009A44";
    default: return "#6b7280";
  }
}
