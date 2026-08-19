import type { CVData, CareerProfile, SectionId, CVTemplate, CVTheme, FontChoice, WorkExperience, Skill } from "@/types";
import { templates } from "@/lib/templates";
import { themes } from "@/lib/themes";
import { ROLE_DATABASE } from "@/lib/cvProfile";
import { getIndustrySkills } from "@/lib/contentAssistant";
import { computeLayout } from "@/lib/layoutEngine";

// ---------------------------------------------------------------------------
// CV Generation Engine
// ---------------------------------------------------------------------------
// Transforms a CareerProfile + generation config into a complete, normalized
// CVData document. Deterministic and local — no fake AI, no fabricated facts.

export interface CVGenerateConfig {
  name: string;
  targetRole?: string;
  targetCompany?: string;
  targetIndustry?: string;
  jobDescription?: string;
  template?: CVTemplate;
  theme?: CVTheme;
  fontChoice?: FontChoice;
  sections?: SectionId[];
  summary?: string;
  autoImproveBullets?: boolean;
  maxBulletsPerRole?: number;
}

export interface CVGenerationResult {
  data: CVData;
  template: CVTemplate;
  theme: CVTheme;
  fontChoice: FontChoice;
  sections: SectionId[];
  warnings: string[];
  missingItems: string[];
  bulletImprovements: number;
  summaryGenerated: boolean;
}

// --- Content normalization helpers ------------------------------------------

export function normalizeBullet(bullet: string): string {
  let b = bullet.trim().replace(/\s+/g, " ");
  if (!b) return "";
  if (!/^[A-Z]/.test(b)) b = b.charAt(0).toUpperCase() + b.slice(1);
  if (!/[.!?]$/.test(b)) b += ".";
  return b;
}

export function cleanBullets(bullets: string[], max = 6): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of bullets) {
    const b = normalizeBullet(raw);
    if (!b) continue;
    const key = b.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(b);
    if (out.length >= max) break;
  }
  return out;
}

export function isWeakBullet(bullet: string): boolean {
  const weakVerbs = [
    /^responsible for\b/i,
    /^duties include\b/i,
    /^worked on\b/i,
    /^helped with\b/i,
    /^assisted in\b/i,
    /^was part of\b/i,
    /^in charge of\b/i,
    /^handled\b/i,
    /^did\b/i,
    /^did some\b/i,
  ];
  const b = bullet.trim();
  if (!b) return false;
  if (weakVerbs.some((r) => r.test(b))) return true;
  const words = b.split(/\s+/).length;
  if (words < 3) return true;
  if (words > 30) return true;
  return false;
}

export function improveBulletDeterministic(bullet: string): string {
  const b = bullet.trim();
  const replacements: [RegExp, string][] = [
    [/^responsible for (the |our |company |)computers/i, "Maintained and troubleshot computer systems"],
    [/^responsible for\b/i, "Managed"],
    [/^duties include\b/i, "Performed"],
    [/^worked on\b/i, "Developed"],
    [/^helped with\b/i, "Contributed to"],
    [/^assisted in\b/i, "Supported"],
    [/^was part of\b/i, "Collaborated on"],
    [/^in charge of\b/i, "Directed"],
    [/^handled\b/i, "Managed"],
    [/^did\b/i, "Delivered"],
  ];
  let improved = b;
  for (const [pattern, replacement] of replacements) {
    if (pattern.test(improved)) {
      improved = improved.replace(pattern, replacement);
      break;
    }
  }
  // remove casual filler
  improved = improved
    .replace(/\b(really|very|just|basically|actually|kind of|sort of)\b/gi, "")
    .replace(/\b(stuff|things)\b/gi, "results")
    .replace(/\s{2,}/g, " ")
    .trim();
  return normalizeBullet(improved) || normalizeBullet(b);
}

export function improveBullet(bullet: string): string {
  return improveBulletDeterministic(bullet);
}

// --- Summary generation -----------------------------------------------------

export interface SummaryStyle {
  length: "short" | "medium" | "long";
  focus: "balanced" | "achievement" | "technical";
}

export function generateSummary(
  profile: CareerProfile,
  targetRole: string,
  style: SummaryStyle = { length: "medium", focus: "balanced" }
): string {
  const fullName = profile.personal.fullName.trim();
  const headline = profile.personal.headline.trim();
  const years = yearsOfExperience(profile);
  const skills = profile.skills.map((s) => s.name.trim()).filter(Boolean);
  const industries = profile.targetIndustries.join(", ");

  const roleName = targetRole.trim() || headline || "a professional";
  const rolePhrase = targetRole.trim() ? `specializing in ${targetRole.trim()}` : headline ? `specializing in ${headline}` : "";

  const expPart = years > 0 ? ` with ${years} years of experience` : years === 0 ? " as an early-career professional" : "";
  const skillsPart = skills.length > 0
    ? ` Skilled in ${skills.slice(0, 5).join(", ")}.`
    : "";
  const industryPart = industries ? ` Focused on the ${industries} sector.` : "";
  const achievementPart = profile.experiences.length > 0
    ? ` Proven ability to deliver measurable results across ${profile.experiences.length} role${profile.experiences.length > 1 ? "s" : ""}.`
    : "";

  const base = `${rolePhrase ? `A professional ${rolePhrase}` : `A dedicated ${roleName}`}${expPart}, committed to delivering high-quality work and continuous growth.`;

  const parts: Record<SummaryStyle["length"], string[]> = {
    short: [base],
    medium: [base, skillsPart || achievementPart],
    long: [base, skillsPart, industryPart, achievementPart],
  };

  const focusAdd = style.focus === "achievement" ? achievementPart : style.focus === "technical" ? skillsPart : "";
  const candidateParts = [...parts[style.length], focusAdd];
  const deduped: string[] = [];
  for (const p of candidateParts) {
    if (p && !deduped.includes(p)) deduped.push(p);
  }
  const joined = deduped.join(" ");

  let final = joined.replace(/\s+/g, " ").trim();
  if (!final.endsWith(".")) final += ".";
  if (final.length > 5) {
    final = final.charAt(0).toUpperCase() + final.slice(1);
  }
  void fullName;
  return final;
}

export function yearsOfExperience(profile: CareerProfile): number {
  let total = 0;
  for (const exp of profile.experiences) {
    const start = parseYear(exp.startDate);
    const end = exp.current ? new Date().getFullYear() : parseYear(exp.endDate);
    if (start && end && end >= start) total += end - start;
  }
  return total;
}

function parseYear(dateStr: string): number | null {
  if (!dateStr) return null;
  const m = dateStr.match(/(\d{4})/);
  return m ? parseInt(m[1], 10) : null;
}

// --- Section selection ------------------------------------------------------

export function selectSections(profile: CareerProfile, requested?: SectionId[]): SectionId[] {
  const hasContent: Record<SectionId, boolean> = {
    summary: !!profile.personal.summary,
    experience: profile.experiences.length > 0,
    education: profile.education.length > 0,
    skills: profile.skills.length > 0,
    projects: profile.projects.length > 0,
    languages: profile.languages.length > 0,
    certifications: profile.certifications.length > 0,
    awards: profile.awards.length > 0,
    publications: profile.publications.length > 0,
    references: false,
    volunteer: profile.volunteer.length > 0,
    courses: profile.courses.length > 0,
  };

  const order: SectionId[] = ["summary", "experience", "education", "skills", "projects", "languages", "certifications", "awards", "publications", "volunteer", "courses"];

  if (requested && requested.length > 0) {
    return order.filter((s) => requested.includes(s) && hasContent[s]);
  }

  return order.filter((s) => hasContent[s]);
}

// --- Skill ordering ---------------------------------------------------------

export function orderSkills(profile: CareerProfile, targetRole?: string, targetIndustry?: string): Skill[] {
  const roleSkills = targetRole ? ROLE_DATABASE[targetRole.toLowerCase().trim()]?.skills || [] : [];
  const industrySkills = targetIndustry ? getIndustrySkills(targetIndustry) : [];

  const relevance: Record<string, number> = {};
  const bump = (name: string) => {
    relevance[name.toLowerCase()] = (relevance[name.toLowerCase()] || 0) + 1;
  };
  roleSkills.forEach(bump);
  industrySkills.forEach(bump);

  const deduped: Skill[] = [];
  const seen = new Set<string>();
  for (const s of profile.skills) {
    const key = s.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(s);
  }

  return deduped.sort((a, b) => {
    const ra = relevance[a.name.toLowerCase()] || 0;
    const rb = relevance[b.name.toLowerCase()] || 0;
    if (rb !== ra) return rb - ra;
    return a.name.localeCompare(b.name);
  });
}

// --- Experience normalization -----------------------------------------------

export function normalizeExperiences(profile: CareerProfile, maxBulletsPerRole = 5, autoImprove = false): WorkExperience[] {
  return profile.experiences
    .filter((e) => e.company.trim() || e.role.trim())
    .map((e) => {
      let bullets = cleanBullets(e.bullets || [], maxBulletsPerRole);
      if (autoImprove) {
        bullets = bullets.map((b) => (isWeakBullet(b) ? improveBullet(b) : b));
      }
      return { ...e, bullets };
    });
}

// --- Main pipeline ----------------------------------------------------------

export function generateCV(profile: CareerProfile, config: CVGenerateConfig): CVGenerationResult {
  const warnings: string[] = [];
  const missingItems: string[] = [];

  const targetRole = config.targetRole?.trim() || profile.targetRoles[0]?.trim() || profile.personal.headline.trim();
  const targetIndustry = config.targetIndustry?.trim() || profile.targetIndustries[0]?.trim() || "";

  if (!profile.personal.fullName.trim()) missingItems.push("Full name");
  if (!profile.personal.email.trim()) missingItems.push("Email address");
  if (!profile.personal.phone.trim()) missingItems.push("Phone number");
  if (profile.experiences.length === 0) missingItems.push("Work experience");
  if (profile.education.length === 0) missingItems.push("Education");

  const summary = config.summary?.trim() || profile.personal.summary.trim() || generateSummary(profile, targetRole);

  const experiences = normalizeExperiences(profile, config.maxBulletsPerRole ?? 5, config.autoImproveBullets ?? true);
  const skills = orderSkills(profile, targetRole, targetIndustry);
  const sections = selectSections({ ...profile, personal: { ...profile.personal, summary }, skills }, config.sections);

  if (experiences.some((e) => e.bullets.length === 0)) warnings.push("Some experiences have no achievements listed");
  if (profile.skills.length === 0) warnings.push("No skills added yet");
  if (!profile.personal.summary.trim()) warnings.push("Professional summary was generated from your profile");

  const template = config.template || (targetRole ? recommendTemplateForRole(targetRole) : templates[0]);
  const theme = config.theme || themes[0];

  const data: CVData = {
    personal: {
      fullName: profile.personal.fullName.trim(),
      headline: profile.personal.headline.trim() || targetRole,
      email: profile.personal.email.trim(),
      phone: profile.personal.phone.trim(),
      address: profile.personal.address.trim(),
      summary,
      photoUrl: profile.personal.photoUrl || null,
      photoSize: profile.personal.photoSize || 60,
      photoPosition: profile.personal.photoPosition || "center",
      linkedIn: profile.personal.linkedIn.trim(),
      github: profile.personal.github.trim(),
      website: profile.personal.website.trim(),
    },
    experiences,
    education: profile.education.map((e) => ({ ...e })),
    skills,
    languages: profile.languages.map((l) => ({ ...l })),
    certifications: profile.certifications.map((c) => ({ ...c })),
    projects: profile.projects.map((p) => ({ ...p })),
    awards: profile.awards.map((a) => ({ ...a })),
    publications: profile.publications.map((p) => ({ ...p })),
    references: [],
    volunteer: profile.volunteer.map((v) => ({ ...v })),
    courses: profile.courses.map((c) => ({ ...c })),
    includeReferences: false,
    showAvailableUponRequest: true,
    activeSections: sections,
  };

  const bulletImprovements = data.experiences.reduce((acc, e) => acc + e.bullets.filter((b) => isWeakBullet(b)).length, 0);

  return {
    data,
    template,
    theme,
    fontChoice: config.fontChoice || "helvetica",
    sections,
    warnings,
    missingItems,
    bulletImprovements,
    summaryGenerated: !profile.personal.summary.trim(),
  };
}

export function recommendTemplateForRole(role: string): CVTemplate {
  const rec = ROLE_DATABASE[role.toLowerCase().trim()];
  if (rec?.templateId) {
    const t = templates.find((x) => x.id === rec.templateId);
    if (t) return t;
  }
  const t = templates.find((x) => x.id === "classic-professional")!;
  return t;
}

export function analyzeGeneratedCV(data: CVData): { layout: ReturnType<typeof computeLayout> } {
  return { layout: computeLayout(data, templates[0]) };
}