import type { CareerProfile } from "@/types";

export interface InterviewSimQuestion {
  id: string;
  category: "behavioral" | "technical" | "situational" | "company" | "role-specific";
  question: string;
  context: string;
  evaluationCriteria: string[];
}

export interface AnswerEvaluation {
  score: number;
  strengths: string[];
  improvements: string[];
  tips: string[];
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

export function generateInterviewQuestions(
  cp: CareerProfile,
  jobDescription: string,
  jobTitle: string,
): InterviewSimQuestion[] {
  const keywords = extractKeywordsFromJD(jobDescription);
  const questions: InterviewSimQuestion[] = [];

  // Behavioral
  questions.push({
    id: "sim-b1",
    category: "behavioral",
    question: "Tell me about yourself and your professional background.",
    context: "This is your elevator pitch. Focus on your career journey and what led you to this role.",
    evaluationCriteria: ["Clear narrative", "Relevant experience highlighted", "Concise (1-2 minutes)", "Connects to target role"],
  });

  questions.push({
    id: "sim-b2",
    category: "behavioral",
    question: "Describe a time when you had to learn a new technology or skill quickly. How did you approach it?",
    context: "Employers want to see your learning agility and self-motivation.",
    evaluationCriteria: ["Specific example", "Clear learning strategy", "Outcome mentioned", "Shows adaptability"],
  });

  questions.push({
    id: "sim-b3",
    category: "behavioral",
    question: "Tell me about a time you disagreed with a teammate or manager. How did you handle it?",
    context: "This tests your conflict resolution and interpersonal skills.",
    evaluationCriteria: ["Professional approach", "Active listening", "Constructive resolution", "Lessons learned"],
  });

  questions.push({
    id: "sim-b4",
    category: "behavioral",
    question: "Describe your most significant professional achievement. Why was it important?",
    context: "Choose an achievement that demonstrates impact and aligns with the role.",
    evaluationCriteria: ["Clear impact quantified", "Your specific role", "Challenges overcome", "Relevance to target position"],
  });

  // Technical (keyword-based)
  if (keywords.length > 0) {
    questions.push({
      id: "sim-t1",
      category: "technical",
      question: `Walk me through your experience with ${keywords.slice(0, 2).join(" and ")}. What projects have you used them in?`,
      context: "Be specific about how you used these technologies and what you built.",
      evaluationCriteria: ["Project specifics", "Technical depth", "Challenges solved", "Best practices followed"],
    });
  }

  questions.push({
    id: "sim-t2",
    category: "technical",
    question: "How do you ensure the quality and reliability of your work? Describe your approach to testing or quality assurance.",
    context: "This tests your attention to detail and professional standards.",
    evaluationCriteria: ["Systematic approach", "Tools and methods", "Prevention vs detection", "Continuous improvement"],
  });

  questions.push({
    id: "sim-t3",
    category: "technical",
    question: "Describe a time when you had to debug a complex issue. What was your process?",
    context: "Show your analytical thinking and problem-solving methodology.",
    evaluationCriteria: ["Systematic debugging", "Tools used", "Root cause found", "Prevention measures"],
  });

  // Situational
  questions.push({
    id: "sim-s1",
    category: "situational",
    question: "If you joined our team and were assigned a project you had no experience with, how would you approach it?",
    context: "This tests your initiative, resourcefulness, and communication skills.",
    evaluationCriteria: ["Research approach", "Asking questions", "Breaking down the problem", "Timeline management"],
  });

  questions.push({
    id: "sim-s2",
    category: "situational",
    question: "How would you handle a situation where you disagreed with a technical decision made by leadership?",
    context: "Show you can be a team player while also advocating for better solutions.",
    evaluationCriteria: ["Respectful communication", "Data-driven arguments", "Compromise ability", "Supporting final decision"],
  });

  questions.push({
    id: "sim-s3",
    category: "situational",
    question: "Imagine you have multiple high-priority tasks with the same deadline. How do you decide what to work on first?",
    context: "This tests your prioritization and time management skills.",
    evaluationCriteria: ["Clear prioritization framework", "Stakeholder communication", "Delegation awareness", "Deadline management"],
  });

  // Role-specific
  const recentRole = cp.experiences[0];
  if (recentRole) {
    questions.push({
      id: "sim-r1",
      category: "role-specific",
      question: `In your role as ${recentRole.role} at ${recentRole.company}, what was the biggest challenge you faced and how did you overcome it?`,
      context: "Use this to demonstrate problem-solving and resilience in a work context.",
      evaluationCriteria: ["Clear challenge description", "Action taken", "Result achieved", "Transferable skills shown"],
    });
  }

  questions.push({
    id: "sim-r2",
    category: "role-specific",
    question: `Why are you interested in the ${jobTitle} position specifically? What makes it different from other roles you've considered?`,
    context: "Show genuine interest and how this role aligns with your career goals.",
    evaluationCriteria: ["Specific motivation", "Role understanding", "Career alignment", "Enthusiasm"],
  });

  // Company
  questions.push({
    id: "sim-c1",
    category: "company",
    question: "Why do you want to work at this company specifically? What about our mission or products resonates with you?",
    context: "Show you've done your research and have genuine interest.",
    evaluationCriteria: ["Company knowledge", "Personal connection", "Long-term fit", "Enthusiasm shown"],
  });

  questions.push({
    id: "sim-c2",
    category: "company",
    question: "Where do you see yourself in 3-5 years, and how does this role fit into that vision?",
    context: "Show ambition while demonstrating commitment to growth at the company.",
    evaluationCriteria: ["Realistic goals", "Growth mindset", "Company alignment", "Commitment signal"],
  });

  return questions;
}

export function evaluateAnswer(
  question: InterviewSimQuestion,
  answer: string,
  cp: CareerProfile,
): AnswerEvaluation {
  const words = answer.trim().split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  const strengths: string[] = [];
  const improvements: string[] = [];
  const tips: string[] = [];

  // Length evaluation
  if (wordCount >= 50) {
    strengths.push("Good level of detail in your answer");
  } else if (wordCount >= 20) {
    strengths.push("Concise answer");
    tips.push("Consider adding more specific examples to strengthen your response");
  } else {
    improvements.push("Answer is too short — aim for at least 3-4 sentences");
    tips.push("Try using the STAR method: Situation, Task, Action, Result");
  }

  // Check for specific indicators
  const lowerAnswer = answer.toLowerCase();

  // Check for examples/stories
  const hasExample = lowerAnswer.includes("for example") || lowerAnswer.includes("such as") ||
    lowerAnswer.includes("specifically") || lowerAnswer.includes("in my role") ||
    lowerAnswer.includes("when i") || lowerAnswer.includes("one time") ||
    lowerAnswer.includes("i worked on") || lowerAnswer.includes("i built");

  if (hasExample) {
    strengths.push("Includes specific examples or experiences");
  } else {
    improvements.push("Try to include a specific example or story");
    tips.push("Concrete examples make your answers more memorable and credible");
  }

  // Check for quantifiable results
  const hasNumbers = /\d+/.test(answer);
  if (hasNumbers) {
    strengths.push("Includes quantifiable results or metrics");
  } else {
    tips.push("Where possible, include numbers (e.g., 'reduced load time by 40%')");
  }

  // Check for STAR method
  const hasSTAR = lowerAnswer.includes("situation") || lowerAnswer.includes("task") ||
    lowerAnswer.includes("action") || lowerAnswer.includes("result");
  if (hasSTAR) {
    strengths.push("Follows a structured approach (STAR method)");
  } else if (question.category === "behavioral") {
    tips.push("For behavioral questions, use the STAR method: describe the Situation, Task, Action, and Result");
  }

  // Check for career-relevant content
  const allSkills = cp.skills.map((s) => s.name.toLowerCase());
  const skillMentions = allSkills.filter((skill) => lowerAnswer.includes(skill));
  if (skillMentions.length > 0) {
    strengths.push(`Relevant skills mentioned: ${skillMentions.slice(0, 3).join(", ")}`);
  }

  // Check for soft skills
  const softSkills = ["communication", "teamwork", "leadership", "problem-solving", "adaptability", "initiative"];
  const softSkillMentions = softSkills.filter((skill) => lowerAnswer.includes(skill));
  if (softSkillMentions.length > 0) {
    strengths.push("Demonstrates soft skills: " + softSkillMentions.slice(0, 2).join(", "));
  }

  // Category-specific feedback
  if (question.category === "behavioral") {
    if (lowerAnswer.includes("i learned") || lowerAnswer.includes("lesson")) {
      strengths.push("Shows self-reflection and learning");
    }
  }

  if (question.category === "technical") {
    if (lowerAnswer.includes("best practice") || lowerAnswer.includes("pattern") || lowerAnswer.includes("architecture")) {
      strengths.push("Demonstrates technical best practices awareness");
    }
  }

  if (question.category === "company") {
    if (lowerAnswer.includes("mission") || lowerAnswer.includes("product") || lowerAnswer.includes("values")) {
      strengths.push("Shows company research and alignment");
    } else {
      tips.push("Research the company's mission, products, and recent news before the interview");
    }
  }

  // Calculate score
  let score = 50; // Base score
  if (wordCount >= 50) score += 10;
  if (wordCount >= 100) score += 5;
  if (hasExample) score += 15;
  if (hasNumbers) score += 10;
  if (hasSTAR) score += 10;
  if (skillMentions.length > 0) score += 5;
  if (softSkillMentions.length > 0) score += 5;
  if (strengths.length >= 3) score += 5;

  // Deductions
  if (wordCount < 20) score -= 15;
  if (!hasExample && question.category === "behavioral") score -= 10;

  score = Math.max(0, Math.min(100, score));

  return { score, strengths, improvements, tips };
}
