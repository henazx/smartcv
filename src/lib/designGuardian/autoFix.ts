import { AutoFix, DesignIssue } from "./types";
import { LayoutConfig, CVData, CVTemplate, CVTheme } from "@/types";
import { computeLayout } from "@/lib/layoutEngine";

export function generateAutoFixes(
  issues: DesignIssue[],
  data: CVData,
  template: CVTemplate,
  theme: CVTheme,
  layout: LayoutConfig
): AutoFix[] {
  const fixes: AutoFix[] = [];
  const fixableIssues = issues.filter((i) => i.autoFixAvailable);

  if (fixableIssues.some((i) => i.autoFixId === "reduce-spacing")) {
    fixes.push(createSpacingReductionFix(layout));
  }

  if (fixableIssues.some((i) => i.autoFixId === "increase-spacing")) {
    fixes.push(createSpacingIncreaseFix(layout));
  }

  if (fixableIssues.some((i) => i.autoFixId === "optimize-skills")) {
    fixes.push(createSkillOptimizationFix(template));
  }

  if (fixableIssues.some((i) => i.autoFixId === "optimize-sidebar")) {
    fixes.push(createSidebarFix());
  }

  if (fixableIssues.some((i) => i.autoFixId === "adjust-spacing")) {
    fixes.push(createSpacingAdjustFix(layout));
  }

  return fixes;
}

function createSpacingReductionFix(layout: LayoutConfig): AutoFix {
  const newSpacingScale = Math.max(0.7, layout.spacingScale - 0.15);
  return {
    id: "fix-reduce-spacing",
    title: "Reduce section spacing",
    description: "Compress spacing between sections to fit more content on the page.",
    impact: "medium",
    changes: [{
      type: "spacing",
      field: "spacingScale",
      from: layout.spacingScale,
      to: newSpacingScale,
      description: `Reduce spacing from ${Math.round(layout.spacingScale * 100)}% to ${Math.round(newSpacingScale * 100)}%`,
    }],
  };
}

function createSpacingIncreaseFix(layout: LayoutConfig): AutoFix {
  const newSpacingScale = Math.min(1.3, layout.spacingScale + 0.1);
  return {
    id: "fix-increase-spacing",
    title: "Increase section spacing",
    description: "Add more space between sections to fill the page more evenly.",
    impact: "low",
    changes: [{
      type: "spacing",
      field: "spacingScale",
      from: layout.spacingScale,
      to: newSpacingScale,
      description: `Increase spacing from ${Math.round(layout.spacingScale * 100)}% to ${Math.round(newSpacingScale * 100)}%`,
    }],
  };
}

function createSkillOptimizationFix(template: CVTemplate): AutoFix {
  let newSkillStyle = template.skillsStyle;
  if (template.skillsStyle === "tags") newSkillStyle = "grouped";
  else if (template.skillsStyle === "bars") newSkillStyle = "comma-list";
  else if (template.skillsStyle === "proficiency-grid") newSkillStyle = "two-column";

  return {
    id: "fix-optimize-skills",
    title: "Optimize skill display",
    description: "Switch to a more compact skill layout to handle the large number of skills.",
    impact: "low",
    changes: [{
      type: "skillDisplay",
      field: "skillsStyle",
      from: template.skillsStyle,
      to: newSkillStyle,
      description: `Change skill display from "${template.skillsStyle}" to "${newSkillStyle}"`,
    }],
  };
}

function createSidebarFix(): AutoFix {
  return {
    id: "fix-optimize-sidebar",
    title: "Optimize sidebar content",
    description: "Move some sidebar content to the main area to reduce crowding.",
    impact: "medium",
    changes: [{
      type: "spacing",
      field: "sidebarWidth",
      from: 35,
      to: 30,
      description: "Reduce sidebar width from 35% to 30% to give more room to main content",
    }],
  };
}

function createSpacingAdjustFix(layout: LayoutConfig): AutoFix {
  const newSpacingScale = Math.max(0.75, Math.min(1.1, layout.spacingScale));
  return {
    id: "fix-adjust-spacing",
    title: "Adjust spacing to comfortable level",
    description: "Set spacing to a balanced level that maintains readability.",
    impact: "low",
    changes: [{
      type: "spacing",
      field: "spacingScale",
      from: layout.spacingScale,
      to: newSpacingScale,
      description: `Adjust spacing from ${Math.round(layout.spacingScale * 100)}% to ${Math.round(newSpacingScale * 100)}%`,
    }],
  };
}

export function applyAutoFix(
  currentLayout: LayoutConfig,
  fix: AutoFix
): Partial<LayoutConfig> {
  const updates: Partial<LayoutConfig> = {};
  for (const change of fix.changes) {
    if (change.field === "spacingScale" && typeof change.to === "number") {
      updates.spacingScale = change.to;
    } else if (change.field === "fontScale" && typeof change.to === "number") {
      updates.fontScale = change.to;
    } else if (change.field === "sidebarWidth" && typeof change.to === "number") {
      updates.sidebarWidth = change.to;
    }
  }
  return updates;
}

export function applyAllSafeFixes(
  data: CVData,
  template: CVTemplate,
  theme: CVTheme,
  currentLayout: LayoutConfig
): { layout: Partial<LayoutConfig>; appliedFixes: AutoFix[] } {
  const autoLayout = computeLayout(data, template);
  const updates: Partial<LayoutConfig> = {};
  const appliedFixes: AutoFix[] = [];

  if (autoLayout.spacingScale < 0.8 && currentLayout.spacingScale > 0.8) {
    updates.spacingScale = Math.max(0.8, currentLayout.spacingScale - 0.1);
    appliedFixes.push({
      id: "fix-safe-spacing", title: "Adjusted spacing", description: "Reduced spacing to a more comfortable level.",
      impact: "low", changes: [{ type: "spacing", field: "spacingScale", from: currentLayout.spacingScale, to: updates.spacingScale, description: "Spacing adjusted" }],
    });
  }

  if (autoLayout.fontScale < 0.85 && currentLayout.fontScale > 0.85) {
    updates.fontScale = Math.max(0.85, currentLayout.fontScale);
    appliedFixes.push({
      id: "fix-safe-font", title: "Adjusted font size", description: "Prevented font from shrinking below comfortable reading size.",
      impact: "medium", changes: [{ type: "fontScale", field: "fontScale", from: currentLayout.fontScale, to: updates.fontScale, description: "Font scale adjusted" }],
    });
  }

  return { layout: updates, appliedFixes };
}
