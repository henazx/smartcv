import { careerProfileToCVData, normalizeCVData, normalizeCareerProfile, cvDataToCareerProfile } from "@/lib/cv/convert";
import type { CareerProfile, CVData } from "@/types";

const baseCP: CareerProfile = {
  id: "cp1",
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
  personal: {
    fullName: "Abebe Kebede", headline: "Engineer", email: "abebe@email.com", phone: "+251911000000",
    address: "Addis Ababa", linkedIn: "", github: "", website: "", summary: "Summary text",
    photoUrl: null, photoSize: 60, photoPosition: "center",
  },
  education: [{ id: "e1", institution: "AAU", degree: "BSc", field: "CS", startDate: "2018", endDate: "2022", gpa: "3.8" }],
  experiences: [{ id: "x1", company: "Acme", role: "Dev", startDate: "2022", endDate: "", current: true, bullets: ["Built things."] }],
  skills: [{ id: "s1", name: "TypeScript", proficiency: "expert", category: "General" }],
  languages: [{ id: "l1", name: "Amharic", proficiency: "native" }],
  certifications: [],
  projects: [],
  awards: [],
  publications: [],
  volunteer: [],
  courses: [],
  careerInterests: [],
  targetRoles: ["Software Engineer"],
  targetIndustries: ["Technology"],
  careerGoals: "",
  jobDescriptions: [],
};

describe("careerProfileToCVData", () => {
  it("copies canonical profile into a CV document", () => {
    const d = careerProfileToCVData(baseCP);
    expect(d.personal.fullName).toBe("Abebe Kebede");
    expect(d.experiences).toHaveLength(1);
    expect(d.education).toHaveLength(1);
    expect(d.skills).toHaveLength(1);
    expect(d.activeSections).toEqual(["summary", "experience", "education", "skills"]);
  });

  it("gates sections by activeSections so preview and export agree", () => {
    const d = careerProfileToCVData(baseCP, ["summary", "skills"]);
    expect(d.experiences).toHaveLength(0);
    expect(d.education).toHaveLength(0);
    expect(d.skills).toHaveLength(1);
    expect(d.personal.summary).toBe("Summary text");
    expect(d.activeSections).toEqual(["summary", "skills"]);
  });

  it("blanks the summary when the summary section is off", () => {
    const d = careerProfileToCVData(baseCP, ["experience", "education", "skills"]);
    expect(d.personal.summary).toBe("");
  });

  it("does not share references with the source profile", () => {
    const d = careerProfileToCVData(baseCP);
    d.experiences[0].bullets[0] = "changed";
    expect(baseCP.experiences[0].bullets[0]).toBe("Built things.");
  });
});

describe("normalizeCVData", () => {
  it("fills missing arrays and personal fields", () => {
    const d = normalizeCVData({ personal: { fullName: "X" } } as Partial<CVData>);
    expect(d.personal.email).toBe("");
    expect(d.experiences).toEqual([]);
    expect(d.courses).toEqual([]);
    expect(d.activeSections.length).toBeGreaterThan(0);
  });

  it("preserves provided activeSections and dedupes them", () => {
    const d = normalizeCVData({ activeSections: ["skills", "skills", "summary"] } as Partial<CVData>);
    expect(d.activeSections).toEqual(["skills", "summary"]);
  });

  it("handles null input", () => {
    const d = normalizeCVData(null);
    expect(d.experiences).toEqual([]);
    expect(d.personal.fullName).toBe("");
  });
});

describe("normalizeCareerProfile", () => {
  it("fills missing arrays", () => {
    const cp = normalizeCareerProfile({ id: "x" } as Partial<CareerProfile>);
    expect(cp.experiences).toEqual([]);
    expect(cp.skills).toEqual([]);
    expect(cp.jobDescriptions).toEqual([]);
    expect(cp.personal.photoSize).toBe(60);
    expect(cp.personal.photoPosition).toBe("center");
  });
});

describe("cvDataToCareerProfile", () => {
  const cv: CVData = {
    personal: { fullName: "Abebe", headline: "", email: "a@b.c", phone: "", address: "", summary: "S", photoUrl: null, photoSize: 60, photoPosition: "center", linkedIn: "", github: "", website: "" },
    experiences: [{ id: "x1", company: "Acme", role: "Dev", startDate: "2022", endDate: "", current: true, bullets: ["B."] }],
    education: [], skills: [], languages: [], certifications: [], projects: [], awards: [], publications: [], references: [], volunteer: [], courses: [],
    includeReferences: false, showAvailableUponRequest: true, activeSections: ["summary", "experience"],
  };

  it("preserves career-level fields while copying content", () => {
    const cp = cvDataToCareerProfile(cv, baseCP);
    expect(cp.experiences[0].bullets).toEqual(["B."]);
    expect(cp.careerInterests).toEqual(baseCP.careerInterests);
    expect(cp.targetRoles).toEqual(baseCP.targetRoles);
    expect(cp.jobDescriptions).toEqual(baseCP.jobDescriptions);
  });

  it("uses fallback target role when none exists", () => {
    const empty = { ...baseCP, targetRoles: [], targetIndustries: [] };
    const cp = cvDataToCareerProfile(cv, empty, { targetRole: "Designer", targetIndustry: "Agency" });
    expect(cp.targetRoles).toEqual(["Designer"]);
    expect(cp.targetIndustries).toEqual(["Agency"]);
  });
});