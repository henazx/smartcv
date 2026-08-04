import { suggestBulletImprovement, extractKeywords, getIndustrySummaryTemplates, getIndustrySkills } from "@/lib/contentAssistant";

describe("suggestBulletImprovement", () => {
  test("suggests stronger verb for weak phrases", () => {
    const suggestions = suggestBulletImprovement("Responsible for building APIs");
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some((s) => s.type === "impact")).toBe(true);
  });

  test("suggests metrics when none present", () => {
    const suggestions = suggestBulletImprovement("Built web applications for the team");
    expect(suggestions.some((s) => s.explanation.includes("metrics") || s.explanation.includes("quantify"))).toBe(true);
  });

  test("does not suggest metrics when already present", () => {
    const suggestions = suggestBulletImprovement("Increased revenue by 25% in Q3");
    expect(suggestions.every((s) => !s.explanation.includes("metrics"))).toBe(true);
  });

  test("suggests professional tone for casual words", () => {
    const suggestions = suggestBulletImprovement("Really awesome work on the project");
    expect(suggestions.some((s) => s.type === "professional")).toBe(true);
  });

  test("suggests capitalization", () => {
    const suggestions = suggestBulletImprovement("managed the team");
    expect(suggestions.some((s) => s.type === "grammar")).toBe(true);
  });

  test("returns empty for empty input", () => {
    expect(suggestBulletImprovement("")).toEqual([]);
  });

  test("limits to 3 suggestions", () => {
    const suggestions = suggestBulletImprovement("really awesome stuff and things basically");
    expect(suggestions.length).toBeLessThanOrEqual(3);
  });

  test("tailors to job description", () => {
    const jd = "We need someone with Kubernetes and Docker experience";
    const suggestions = suggestBulletImprovement("Managed servers and deployment", jd);
    expect(suggestions.some((s) => s.type === "tailor")).toBe(true);
  });
});

describe("extractKeywords", () => {
  test("extracts meaningful words", () => {
    const keywords = extractKeywords("JavaScript developer with React experience");
    expect(keywords).toContain("javascript");
    expect(keywords).toContain("developer");
    expect(keywords).toContain("react");
    expect(keywords).toContain("experience");
  });

  test("filters stop words", () => {
    const keywords = extractKeywords("the and or but is was are");
    expect(keywords.length).toBe(0);
  });

  test("filters short words", () => {
    const keywords = extractKeywords("I am a big fan of the web");
    expect(keywords.every((k) => k.length > 3)).toBe(true);
  });

  test("removes duplicates", () => {
    const keywords = extractKeywords("react react react developer");
    expect(keywords.filter((k) => k === "react").length).toBe(1);
  });
});

describe("getIndustrySummaryTemplates", () => {
  test("returns templates for known industry", () => {
    const templates = getIndustrySummaryTemplates("Technology");
    expect(templates.length).toBeGreaterThan(0);
    expect(templates[0].length).toBeGreaterThan(20);
  });

  test("returns templates for partial match", () => {
    const templates = getIndustrySummaryTemplates("tech");
    expect(templates.length).toBeGreaterThan(0);
  });

  test("returns empty for unknown industry", () => {
    const templates = getIndustrySummaryTemplates("UnderwaterBasketWeaving");
    expect(templates).toEqual([]);
  });
});

describe("getIndustrySkills", () => {
  test("returns skills for known industry", () => {
    const skills = getIndustrySkills("Technology");
    expect(skills.length).toBeGreaterThan(0);
    expect(skills).toContain("JavaScript");
  });

  test("returns empty for unknown industry", () => {
    const skills = getIndustrySkills("Nonexistent");
    expect(skills).toEqual([]);
  });
});
