import { generateCV, improveBullet, normalizeBullet, isWeakBullet, generateSummary, orderSkills } from "@/lib/cv/generator";
import type { CareerProfile } from "@/types";

function makeProfile(overrides: Partial<CareerProfile> = {}): CareerProfile {
  return {
    id: "1",
    createdAt: "",
    updatedAt: "",
    personal: {
      fullName: "Abebe Kebede",
      headline: "Software Engineer",
      email: "abebe@example.com",
      phone: "+251911234567",
      address: "Addis Ababa",
      linkedIn: "linkedin.com/in/abebe",
      github: "",
      website: "",
      summary: "",
      photoUrl: null,
      photoSize: 60,
      photoPosition: "center",
    },
    education: [{ id: "e1", institution: "AAU", degree: "BSc", field: "CS", startDate: "2016", endDate: "2020", gpa: "3.8" }],
    experiences: [
      {
        id: "x1",
        company: "Ethio Telecom",
        role: "Software Engineer",
        startDate: "2020",
        endDate: "",
        current: true,
        bullets: ["built the checkout system", "responsible for computers"],
      },
    ],
    skills: [
      { id: "s1", name: "Python", proficiency: "advanced", category: "Programming Languages" },
      { id: "s2", name: "React", proficiency: "advanced", category: "Frameworks" },
    ],
    languages: [],
    certifications: [],
    projects: [],
    awards: [],
    publications: [],
    volunteer: [],
    courses: [],
    careerInterests: [],
    targetRoles: ["Software Developer"],
    targetIndustries: ["Technology"],
    careerGoals: "",
    jobDescriptions: [],
    ...overrides,
  };
}

describe("cv generator", () => {
  test("generates a complete normalized CV", () => {
    const profile = makeProfile();
    const result = generateCV(profile, { name: "General CV", targetRole: "Software Developer" });

    expect(result.data.personal.fullName).toBe("Abebe Kebede");
    expect(result.data.experiences.length).toBe(1);
    // bullets normalized: capitalized + period, weak bullets improved
    expect(result.data.experiences[0].bullets[0]).toMatch(/^Built/);
    expect(result.data.experiences[0].bullets[1]).toMatch(/^Managed|^Maintained/);
    // summary generated since profile has none
    expect(result.summaryGenerated).toBe(true);
    expect(result.data.personal.summary.length).toBeGreaterThan(20);
    // sections selected from content
    expect(result.sections).toContain("experience");
    expect(result.sections).toContain("education");
    expect(result.sections).toContain("skills");
  });

  test("reports missing items", () => {
    const profile = makeProfile({ personal: { ...makeProfile().personal, fullName: "", email: "" }, experiences: [] });
    const result = generateCV(profile, { name: "Test" });
    expect(result.missingItems).toContain("Full name");
    expect(result.missingItems).toContain("Email address");
  });

  test("improveBullet does not invent numbers", () => {
    const improved = improveBullet("Responsible for computers");
    expect(improved).not.toMatch(/\d+%/);
    expect(improved).toMatch(/Maintained/);
  });

  test("normalizeBullet capitalizes and ends with period", () => {
    expect(normalizeBullet("built api")).toBe("Built api.");
  });

  test("isWeakBullet detects vague verbs and short text", () => {
    expect(isWeakBullet("Responsible for computers")).toBe(true);
    expect(isWeakBullet("hi")).toBe(true);
    expect(isWeakBullet("Led a team of 5 engineers to ship a payments platform on time.")).toBe(false);
  });

  test("generateSummary produces a professional paragraph", () => {
    const profile = makeProfile();
    const summary = generateSummary(profile, "Software Developer");
    expect(summary.length).toBeGreaterThan(30);
    expect(summary.endsWith(".")).toBe(true);
  });

  test("orderSkills puts role-relevant skills first", () => {
    const profile = makeProfile({
      skills: [
        { id: "a", name: "Marketing", proficiency: "advanced", category: "General" },
        { id: "b", name: "React", proficiency: "advanced", category: "Frameworks" },
        { id: "c", name: "JavaScript", proficiency: "expert", category: "Programming Languages" },
      ],
    });
    const ordered = orderSkills(profile, "Software Developer");
    expect(ordered[0].name).toBe("JavaScript");
    expect(ordered[1].name).toBe("React");
    expect(ordered[2].name).toBe("Marketing");
  });
});
