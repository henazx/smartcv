import { analyzeJobMatch } from "@/lib/cvProfile";
import { CVData } from "@/types";

function makeCV(overrides: Partial<CVData> = {}): CVData {
  return {
    personal: {
      fullName: "Test User",
      headline: "Developer",
      email: "test@test.com",
      phone: "+251911234567",
      address: "Addis Ababa",
      summary: "Experienced developer with skills in JavaScript and React.",
      photoUrl: null,
      photoSize: 60,
      photoPosition: "center",
      linkedIn: "",
      github: "",
      website: "",
    },
    experiences: [
      {
        id: "1",
        company: "Tech Co",
        role: "Software Engineer",
        startDate: "2020-01",
        endDate: "2023-01",
        current: false,
        bullets: [
          "Built React applications with TypeScript",
          "Managed PostgreSQL databases",
        ],
      },
    ],
    education: [],
    skills: [
      { id: "1", name: "JavaScript", proficiency: "expert" },
      { id: "2", name: "React", proficiency: "advanced" },
      { id: "3", name: "TypeScript", proficiency: "advanced" },
      { id: "4", name: "SQL", proficiency: "intermediate" },
    ],
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
    activeSections: ["summary", "experience", "skills"],
    ...overrides,
  };
}

describe("analyzeJobMatch", () => {
  test("returns score 0 with no job description", () => {
    const result = analyzeJobMatch(makeCV(), "");
    expect(result.score).toBe(0);
    expect(result.hasJobDescription).toBe(false);
  });

  test("finds strong matches for matching skills", () => {
    const jd = "Looking for a developer with JavaScript and React experience";
    const result = analyzeJobMatch(makeCV(), jd);
    expect(result.strongMatches.length).toBeGreaterThan(0);
    expect(result.score).toBeGreaterThan(0);
  });

  test("finds missing keywords", () => {
    const jd = "Looking for a developer with Kubernetes and Docker experience";
    const result = analyzeJobMatch(makeCV(), jd);
    expect(result.missing.length).toBeGreaterThan(0);
  });

  test("uses synonyms for matching", () => {
    const jd = "Experience with reactjs react.js required";
    const result = analyzeJobMatch(makeCV(), jd);
    // "reactjs" is a synonym for "react" — should find it as weak match
    // or "react" is extracted directly as a technical term — strong match
    expect(result.hasJobDescription).toBe(true);
    expect(result.score).toBeGreaterThan(0);
  });

  test("provides suggestions for missing keywords", () => {
    const jd = "Experience with Docker, Kubernetes required";
    const result = analyzeJobMatch(makeCV(), jd);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  test("extracts experience years from JD", () => {
    const jd = "Requires 5+ years of experience in software development";
    const result = analyzeJobMatch(makeCV(), jd);
    expect(result.hasJobDescription).toBe(true);
  });

  test("score is between 0 and 100", () => {
    const jd = "Looking for JavaScript React developer with TypeScript";
    const result = analyzeJobMatch(makeCV(), jd);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
