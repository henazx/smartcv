import type { CVData, CVTemplate, CVType, ApplicationGoal } from "@/types";
import { computeProfile } from "@/lib/cvProfile";
import { analyzeATS } from "@/lib/atsScorer";
import { analyzeQuality } from "@/lib/cvQuality";

export interface ReadinessScores {
  overall: number;
  cvHealth: number;
  ats: number;
  quality: number;
  completeness: number;
}

export function computeReadinessScores(
  data: CVData,
  template: CVTemplate,
  cvType: CVType | null,
  applicationGoal: ApplicationGoal | null,
  targetJobTitle: string,
  targetIndustry: string
): ReadinessScores {
  const profile = computeProfile(cvType, applicationGoal, targetJobTitle, targetIndustry, data);
  const ats = analyzeATS(data, template, targetJobTitle);
  const quality = analyzeQuality(data);

  const profileScore = Math.min(100, (
    (profile.experienceYears > 0 ? 20 : 0) +
    (profile.recommendedSections.length > 3 ? 20 : profile.recommendedSections.length * 5) +
    (profile.recommendedSkills.length > 3 ? 20 : profile.recommendedSkills.length * 5) +
    (profile.roleKeywords.length > 3 ? 20 : profile.roleKeywords.length * 5) +
    (profile.atsPriority === "high" ? 20 : profile.atsPriority === "medium" ? 10 : 5)
  ));

  const sections = [
    data.personal.fullName,
    data.personal.summary,
    data.experiences.length > 0,
    data.education.length > 0,
    data.skills.length > 0,
    data.personal.email,
  ];
  const completeness = Math.round((sections.filter(Boolean).length / sections.length) * 100);

  const overall = Math.round((profileScore * 0.35) + (ats.score * 0.3) + (quality.overall * 0.2) + (completeness * 0.15));

  return { overall, cvHealth: profileScore, ats: ats.score, quality: quality.overall, completeness };
}