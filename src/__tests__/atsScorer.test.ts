import { analyzeATS, estimatePageCount } from "@/lib/atsScorer";
import { templates } from "@/lib/templates";
import { CVData } from "@/types";

function makeCV(overrides: Partial<CVData> = {}): CVData {
  return {
    personal: {
      fullName: "Abebe Kebede",
      headline: "Software Engineer",
      email: "abebe@example.com",
      phone: "+251911234567",
      address: "Addis Ababa",
      summary: "Experienced developer with 5+ years building web apps.",
      photoUrl: null,
      photoSize: 60,
      photoPosition: "center",
      linkedIn: "linkedin.com/in/abebe",
      github: "github.com/abebe",
      website: "",
    },
    experiences: [
      {
        id: "1",
        company: "Ethio Telecom",
        role: "Software Engineer",
        startDate: "2020-01",
        endDate: "",
        current: true,
        bullets: [
          "Built microservices serving 2M+ users using Node.js and React",
          "Reduced API latency by 60% through query optimization",
        ],
      },
    ],
    education: [
      {
        id: "1",
        institution: "Addis Ababa University",
        degree: "BSc",
        field: "Computer Science",
        startDate: "2016-09",
        endDate: "2020-06",
        gpa: "3.8",
      },
    ],
    skills: [
      { id: "1", name: "JavaScript", proficiency: "expert", category: "Programming Languages" },
      { id: "2", name: "React", proficiency: "advanced", category: "Frameworks" },
      { id: "3", name: "Node.js", proficiency: "advanced", category: "Frameworks" },
      { id: "4", name: "Python", proficiency: "intermediate", category: "Programming Languages" },
      { id: "5", name: "SQL", proficiency: "advanced", category: "Databases" },
    ],
    languages: [{ id: "1", name: "English", proficiency: "fluent" }],
    certifications: [{ id: "1", name: "AWS Certified", issuer: "Amazon", date: "" }],
    projects: [],
    awards: [],
    publications: [],
    references: [],
    volunteer: [],
    courses: [],
    includeReferences: false,
    showAvailableUponRequest: true,
    activeSections: ["summary", "experience", "education", "skills", "languages"],
    ...overrides,
  };
}

describe("analyzeATS", () => {
  const template = templates.find((t) => t.id === "classic-professional")!;

  test("returns high score for complete CV", () => {
    const result = analyzeATS(makeCV(), template);
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.grade).not.toBe("Poor");
  });

  test("penalizes missing email", () => {
    const cv = makeCV();
    cv.personal.email = "";
    const result = analyzeATS(cv, template);
    expect(result.score).toBeLessThan(100);
    expect(result.issues.some((i) => i.message.includes("Email"))).toBe(true);
  });

  test("penalizes missing phone", () => {
    const cv = makeCV();
    cv.personal.phone = "";
    const result = analyzeATS(cv, template);
    expect(result.issues.some((i) => i.message.includes("Phone"))).toBe(true);
  });

  test("penalizes missing summary", () => {
    const cv = makeCV();
    cv.personal.summary = "";
    const result = analyzeATS(cv, template);
    expect(result.issues.some((i) => i.message.includes("summary"))).toBe(true);
  });

  test("penalizes no experience and no projects", () => {
    const cv = makeCV({ experiences: [], projects: [] });
    const result = analyzeATS(cv, template);
    expect(result.issues.some((i) => i.message.includes("experience"))).toBe(true);
  });

  test("penalizes missing skills", () => {
    const cv = makeCV({ skills: [] });
    const result = analyzeATS(cv, template);
    expect(result.issues.some((i) => i.message.includes("skills"))).toBe(true);
  });

  test("detects JD keywords when job description provided", () => {
    const jd = "Looking for a software engineer with JavaScript, React, and Node.js experience";
    const result = analyzeATS(makeCV(), template, jd);
    expect(result.passed.some((p) => p.includes("JD keyword match"))).toBe(true);
  });

  test("warns on low JD keyword match", () => {
    const jd = "Looking for a graphic designer with Photoshop and Illustrator skills";
    const result = analyzeATS(makeCV(), template, jd);
    expect(result.issues.some((i) => i.category === "Job Match")).toBe(true);
  });
});

describe("estimatePageCount", () => {
  test("returns 1 for minimal CV", () => {
    expect(estimatePageCount(makeCV())).toBe(1);
  });

  test("returns more for very long CV", () => {
    const longBullets = Array.from({ length: 50 }, (_, i) => ({
      id: String(i),
      company: `Company ${i}`,
      role: `Role ${i}`,
      startDate: "2020-01",
      endDate: "2021-01",
      current: false,
      bullets: Array.from({ length: 5 }, (_, j) => `Achieved result ${j} with measurable impact of ${j * 10}% improvement in performance metrics`),
    }));
    const cv = makeCV({ experiences: longBullets });
    expect(estimatePageCount(cv)).toBeGreaterThan(1);
  });
});
