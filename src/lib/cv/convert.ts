import type { CVData, CareerProfile, SectionId, PersonalInfo, CVVersion } from "@/types";

// ---------------------------------------------------------------------------
// Career Profile <-> CVData conversion (single source of truth)
// ---------------------------------------------------------------------------

export const defaultPersonal: PersonalInfo = {
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  address: "",
  summary: "",
  photoUrl: null,
  photoSize: 60,
  photoPosition: "center",
  linkedIn: "",
  github: "",
  website: "",
};

export const defaultCVData: CVData = {
  personal: { ...defaultPersonal },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  awards: [],
  publications: [],
  references: [],
  volunteer: [],
  courses: [],
  includeReferences: false,
  showAvailableUponRequest: true,
  activeSections: ["summary", "experience", "education", "skills", "languages"] as SectionId[],
};

const DEFAULT_SECTIONS: SectionId[] = ["summary", "experience", "education", "skills"];

// Ensure a CVData object always has all required fields/arrays (backward compatible).
export function normalizeCVData(data?: Partial<CVData> | null): CVData {
  const activeSections =
    Array.isArray(data?.activeSections) && data!.activeSections.length > 0
      ? Array.from(new Set(data!.activeSections))
      : [...defaultCVData.activeSections];
  return {
    ...defaultCVData,
    ...(data || {}),
    personal: { ...defaultPersonal, ...(data?.personal || {}) },
    experiences: data?.experiences || [],
    education: data?.education || [],
    skills: data?.skills || [],
    languages: data?.languages || [],
    certifications: data?.certifications || [],
    projects: data?.projects || [],
    awards: data?.awards || [],
    publications: data?.publications || [],
    references: data?.references || [],
    volunteer: data?.volunteer || [],
    courses: data?.courses || [],
    includeReferences: !!data?.includeReferences,
    showAvailableUponRequest: data?.showAvailableUponRequest !== false,
    activeSections,
  };
}

// Ensure a CareerProfile always has all fields/arrays (backward compatible).
export function normalizeCareerProfile(cp?: Partial<CareerProfile> | null): CareerProfile {
  return {
    id: cp?.id || "",
    createdAt: cp?.createdAt || "",
    updatedAt: cp?.updatedAt || "",
    personal: {
      fullName: cp?.personal?.fullName || "",
      headline: cp?.personal?.headline || "",
      email: cp?.personal?.email || "",
      phone: cp?.personal?.phone || "",
      address: cp?.personal?.address || "",
      linkedIn: cp?.personal?.linkedIn || "",
      github: cp?.personal?.github || "",
      website: cp?.personal?.website || "",
      summary: cp?.personal?.summary || "",
      photoUrl: cp?.personal?.photoUrl ?? null,
      photoSize: cp?.personal?.photoSize ?? 60,
      photoPosition: (cp?.personal?.photoPosition as "left" | "center" | "right") || "center",
    },
    education: Array.isArray(cp?.education) ? cp!.education : [],
    experiences: Array.isArray(cp?.experiences) ? cp!.experiences : [],
    skills: Array.isArray(cp?.skills) ? cp!.skills : [],
    languages: Array.isArray(cp?.languages) ? cp!.languages : [],
    certifications: Array.isArray(cp?.certifications) ? cp!.certifications : [],
    projects: Array.isArray(cp?.projects) ? cp!.projects : [],
    awards: Array.isArray(cp?.awards) ? cp!.awards : [],
    publications: Array.isArray(cp?.publications) ? cp!.publications : [],
    volunteer: Array.isArray(cp?.volunteer) ? cp!.volunteer : [],
    courses: Array.isArray(cp?.courses) ? cp!.courses : [],
    careerInterests: Array.isArray(cp?.careerInterests) ? cp!.careerInterests : [],
    targetRoles: Array.isArray(cp?.targetRoles) ? cp!.targetRoles : [],
    targetIndustries: Array.isArray(cp?.targetIndustries) ? cp!.targetIndustries : [],
    careerGoals: cp?.careerGoals || "",
    jobDescriptions: Array.isArray(cp?.jobDescriptions) ? cp!.jobDescriptions : [],
  };
}

// Build a full CVData document from the canonical CareerProfile.
// When `activeSections` is provided, sections that are turned off are omitted
// so the editor preview, analysis and export all agree.
export function careerProfileToCVData(cp: CareerProfile, activeSections?: SectionId[] | null): CVData {
  const sections =
    activeSections && activeSections.length > 0
      ? Array.from(new Set(activeSections))
      : [...DEFAULT_SECTIONS];
  const on = (id: SectionId) => sections.includes(id);
  return {
    personal: {
      fullName: cp.personal.fullName,
      headline: cp.personal.headline,
      email: cp.personal.email,
      phone: cp.personal.phone,
      address: cp.personal.address,
      summary: on("summary") ? cp.personal.summary : "",
      photoUrl: cp.personal.photoUrl || null,
      photoSize: cp.personal.photoSize || 60,
      photoPosition: (cp.personal.photoPosition as "left" | "center" | "right") || "center",
      linkedIn: cp.personal.linkedIn,
      github: cp.personal.github,
      website: cp.personal.website,
    },
    experiences: on("experience") ? cp.experiences.map((e) => ({ ...e, bullets: [...e.bullets] })) : [],
    education: on("education") ? cp.education.map((e) => ({ ...e })) : [],
    skills: on("skills") ? cp.skills.map((s) => ({ ...s })) : [],
    languages: on("languages") ? cp.languages.map((l) => ({ ...l })) : [],
    certifications: on("certifications") ? cp.certifications.map((c) => ({ ...c })) : [],
    projects: on("projects") ? cp.projects.map((p) => ({ ...p, technologies: [...p.technologies], bullets: [...p.bullets] })) : [],
    awards: on("awards") ? cp.awards.map((a) => ({ ...a })) : [],
    publications: on("publications") ? cp.publications.map((p) => ({ ...p })) : [],
    references: [],
    volunteer: on("volunteer") ? cp.volunteer.map((v) => ({ ...v })) : [],
    courses: on("courses") ? cp.courses.map((c) => ({ ...c })) : [],
    includeReferences: false,
    showAvailableUponRequest: true,
    activeSections: sections,
  };
}

// Copy a CVData document back into a CareerProfile (e.g. loading a saved version
// into the Career Twin editor). Career-level fields are preserved from `existing`.
export function cvDataToCareerProfile(data: CVData, existing: CareerProfile, fallback?: { targetRole?: string; targetIndustry?: string }): CareerProfile {
  const now = new Date().toISOString();
  return {
    ...existing,
    id: existing.id || Math.random().toString(36).substring(2, 9),
    createdAt: existing.createdAt || now,
    updatedAt: now,
    personal: {
      fullName: data.personal.fullName,
      headline: data.personal.headline,
      email: data.personal.email,
      phone: data.personal.phone,
      address: data.personal.address,
      linkedIn: data.personal.linkedIn,
      github: data.personal.github,
      website: data.personal.website,
      summary: data.personal.summary,
      photoUrl: data.personal.photoUrl || null,
      photoSize: data.personal.photoSize || 60,
      photoPosition: data.personal.photoPosition || "center",
    },
    education: data.education.map((e) => ({ ...e })),
    experiences: data.experiences.map((e) => ({ ...e, bullets: [...e.bullets] })),
    skills: data.skills.map((s) => ({ ...s })),
    languages: data.languages.map((l) => ({ ...l })),
    certifications: data.certifications.map((c) => ({ ...c })),
    projects: data.projects.map((p) => ({ ...p, technologies: [...p.technologies], bullets: [...p.bullets] })),
    awards: data.awards.map((a) => ({ ...a })),
    publications: data.publications.map((p) => ({ ...p })),
    volunteer: data.volunteer.map((v) => ({ ...v })),
    courses: data.courses.map((c) => ({ ...c })),
    careerInterests: existing.careerInterests,
    targetRoles: existing.targetRoles.length > 0 ? existing.targetRoles : fallback?.targetRole ? [fallback.targetRole] : [],
    targetIndustries: existing.targetIndustries.length > 0 ? existing.targetIndustries : fallback?.targetIndustry ? [fallback.targetIndustry] : [],
    careerGoals: existing.careerGoals,
    jobDescriptions: existing.jobDescriptions,
  };
}

export function normalizeVersions(versions: CVVersion[]): CVVersion[] {
  return (Array.isArray(versions) ? versions : []).map((v) => ({
    ...v,
    data: normalizeCVData(v.data),
  }));
}