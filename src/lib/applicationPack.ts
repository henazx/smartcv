import type { CareerProfile } from "@/types";

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

export function generateRecruiterMessage(
  cp: CareerProfile,
  jobDescription: string,
  jobTitle: string,
  companyName: string,
): string {
  const keywords = extractKeywordsFromJD(jobDescription);
  const matchingSkills = cp.skills
    .filter((s) => keywords.some((kw) => s.name.toLowerCase().includes(kw) || kw.includes(s.name.toLowerCase())))
    .slice(0, 3)
    .map((s) => s.name);

  const recentRole = cp.experiences[0];
  const roleContext = recentRole ? `in my role as ${recentRole.role} at ${recentRole.company}` : "in my career";

  const skillPhrase = matchingSkills.length > 0
    ? ` My experience with ${matchingSkills.join(", ")} aligns well with what you're looking for.`
    : "";

  return `Hi, I'm interested in the ${jobTitle} position at ${companyName}.${skillPhrase} I'd love to learn more about this opportunity and how my background ${roleContext} could contribute to your team. Would you be open to a brief conversation?`;
}

export interface InterviewQuestion {
  id: string;
  category: "behavioral" | "technical" | "situational" | "company";
  question: string;
  tip: string;
}

export function generateInterviewQuestions(
  cp: CareerProfile,
  jobDescription: string,
  jobTitle: string,
): InterviewQuestion[] {
  const keywords = extractKeywordsFromJD(jobDescription);
  const questions: InterviewQuestion[] = [];

  questions.push({
    id: "b1",
    category: "behavioral",
    question: "Tell me about yourself and why you're interested in this role.",
    tip: `Focus on your background${cp.personal.headline ? ` in ${cp.personal.headline}` : ""} and connect it to the ${jobTitle} position. Keep it under 2 minutes.`,
  });

  questions.push({
    id: "b2",
    category: "behavioral",
    question: "Describe a challenging project you've worked on and how you overcame the obstacles.",
    tip: cp.experiences.length > 0
      ? `Use the STAR method. Draw from your experience at ${cp.experiences[0].company} where you worked as ${cp.experiences[0].role}.`
      : "Use the STAR method (Situation, Task, Action, Result). Be specific about the outcome.",
  });

  questions.push({
    id: "b3",
    category: "behavioral",
    question: "How do you handle working under pressure or tight deadlines?",
    tip: "Give a specific example. Employers want to see composure and problem-solving under stress.",
  });

  if (keywords.length > 0) {
    questions.push({
      id: "t1",
      category: "technical",
      question: `What experience do you have with ${keywords.slice(0, 3).join(", ")}?`,
      tip: `Reference specific projects or roles where you used these technologies. ${cp.experiences.length > 0 ? `Mention your work at ${cp.experiences[0].company}.` : ""}`,
    });
  }

  questions.push({
    id: "t2",
    category: "technical",
    question: "How do you ensure code quality and maintainability in your projects?",
    tip: "Discuss testing practices, code reviews, documentation, and any CI/CD experience you have.",
  });

  questions.push({
    id: "s1",
    category: "situational",
    question: "How would you approach learning a new technology or framework required for this role?",
    tip: "Show enthusiasm for learning. Mention specific learning strategies you use (docs, tutorials, side projects).",
  });

  questions.push({
    id: "s2",
    category: "situational",
    question: "Describe how you would handle a disagreement with a team member about a technical decision.",
    tip: "Emphasize collaboration, data-driven decisions, and respect for different perspectives.",
  });

  questions.push({
    id: "c1",
    category: "company",
    question: `What do you know about ${extractCompanyFromJD(jobDescription)} and why do you want to work here?`,
    tip: "Research the company's mission, products, and recent news. Connect your career goals to their work.",
  });

  questions.push({
    id: "c2",
    category: "company",
    question: "Where do you see yourself in 5 years?",
    tip: `Align your answer with growth opportunities at the company. Show ambition while demonstrating commitment.`,
  });

  return questions;
}
