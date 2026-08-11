import type { CareerProfile, CoverLetter, CoverLetterParagraph } from "@/types";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function extractCompanyFromJD(jd: string): string {
  const lines = jd.split("\n").filter((l) => l.trim());
  for (const line of lines.slice(0, 5)) {
    const trimmed = line.trim();
    if (trimmed.length > 3 && trimmed.length < 60 && !trimmed.includes("@") && !trimmed.includes("http")) {
      return trimmed;
    }
  }
  return "your company";
}

function extractKeywordsFromJD(jd: string): string[] {
  const techKeywords = [
    "javascript", "typescript", "python", "java", "react", "node", "aws", "docker",
    "kubernetes", "sql", "nosql", "mongodb", "postgresql", "redis", "graphql", "rest",
    "api", "microservices", "ci/cd", "git", "agile", "scrum", "leadership", "communication",
    "problem-solving", "team management", "project management", "data analysis", "machine learning",
    "cloud", "devops", "security", "testing", "automation", "frontend", "backend", "fullstack",
  ];
  const lower = jd.toLowerCase();
  return techKeywords.filter((kw) => lower.includes(kw));
}

function findMatchingSkills(cp: CareerProfile, keywords: string[]): string[] {
  const allSkills = cp.skills.map((s) => s.name.toLowerCase());
  return keywords.filter((kw) => allSkills.some((skill) => skill.includes(kw) || kw.includes(skill)));
}

function findRelevantExperience(cp: CareerProfile, keywords: string[]): string[] {
  const matched: string[] = [];
  for (const exp of cp.experiences) {
    const text = `${exp.role} ${(exp.bullets || []).join(" ")}`.toLowerCase();
    for (const kw of keywords) {
      if (text.includes(kw) && !matched.includes(exp.role)) {
        matched.push(exp.role);
      }
    }
  }
  return matched;
}

function buildOpening(name: string, headline: string, company: string, jobTitle: string): string {
  const headlinePhrase = headline ? ` with a background in ${headline.toLowerCase()}` : "";
  return `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${jobTitle} position at ${company}. As a professional${headlinePhrase}, I am excited about the opportunity to contribute to your team.`;
}

function buildBody(cp: CareerProfile, matchingSkills: string[], relevantExp: string[], company: string): string {
  const paragraphs: string[] = [];

  if (relevantExp.length > 0) {
    const expList = relevantExp.slice(0, 3).join(", ");
    paragraphs.push(
      `In my recent role${relevantExp.length > 1 ? "s" : ""} (${expList}), I have developed deep expertise that directly aligns with this position. I have consistently delivered results by applying ${matchingSkills.length > 0 ? matchingSkills.slice(0, 4).join(", ") : "my technical and professional skills"} to solve complex challenges.`
    );
  } else if (matchingSkills.length > 0) {
    paragraphs.push(
      `My technical skill set, including ${matchingSkills.slice(0, 4).join(", ")}, positions me well to contribute meaningfully to ${company}'s goals. I am passionate about applying these skills to drive impactful outcomes.`
    );
  } else {
    paragraphs.push(
      `Throughout my career, I have built a strong foundation of transferable skills including problem-solving, collaboration, and adaptability. I am confident these abilities will allow me to make a positive contribution to your team.`
    );
  }

  const summary = cp.personal.summary;
  if (summary && summary.length > 20) {
    const shortSummary = summary.length > 150 ? summary.slice(0, 147) + "..." : summary;
    paragraphs.push(`As I describe in my professional summary: "${shortSummary}" This perspective drives my approach to every role I take on.`);
  } else {
    paragraphs.push(`I am a motivated professional who thrives in collaborative environments and is committed to continuous learning and growth. I am eager to bring this energy to ${company}.`);
  }

  return paragraphs.join("\n\n");
}

function buildClosing(company: string, jobTitle: string): string {
  return `I would welcome the opportunity to discuss how my background and enthusiasm can contribute to ${company}'s continued success. Thank you for considering my application for the ${jobTitle} position. I look forward to the possibility of contributing to your team.\n\nSincerely`;
}

export function generateCoverLetter(
  cp: CareerProfile,
  jobDescription: string,
  jobTitle?: string,
  companyName?: string,
): CoverLetter {
  const resolvedJobTitle = jobTitle || cp.targetRoles[0] || "the open position";
  const resolvedCompany = companyName || extractCompanyFromJD(jobDescription);

  const keywords = extractKeywordsFromJD(jobDescription);
  const matchingSkills = findMatchingSkills(cp, keywords);
  const relevantExp = findRelevantExperience(cp, keywords);

  const paragraphs: CoverLetterParagraph[] = [
    {
      id: generateId(),
      type: "opening",
      content: buildOpening(cp.personal.fullName, cp.personal.headline, resolvedCompany, resolvedJobTitle),
    },
    {
      id: generateId(),
      type: "body",
      content: buildBody(cp, matchingSkills, relevantExp, resolvedCompany),
    },
    {
      id: generateId(),
      type: "closing",
      content: buildClosing(resolvedCompany, resolvedJobTitle),
    },
  ];

  const now = new Date().toISOString();
  return {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    jobTitle: resolvedJobTitle,
    companyName: resolvedCompany,
    paragraphs,
  };
}

export function getCoverLetterText(cl: CoverLetter): string {
  return cl.paragraphs.map((p) => p.content).join("\n\n");
}

export function getWordCount(cl: CoverLetter): number {
  return getCoverLetterText(cl).split(/\s+/).filter((w) => w.length > 0).length;
}
