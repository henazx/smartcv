import { CVData } from "@/types";

export interface QualityDimension {
  name: string;
  score: number;
  maxScore: number;
  feedback: string[];
}

export interface QualityResult {
  overall: number;
  grade: string;
  dimensions: QualityDimension[];
  summary: string;
}

export interface ContentSuggestion {
  section: string;
  type: "summary" | "bullets" | "skills" | "general";
  original?: string;
  suggestion: string;
  reason: string;
}

const ACTION_VERBS = [
  "achieved", "administered", "analyzed", "automated", "built",
  "collaborated", "consolidated", "coordinated", "created", "decreased",
  "delivered", "designed", "developed", "directed", "drove",
  "eliminated", "engineered", "established", "evaluated", "executed",
  "expanded", "facilitated", "generated", "grew", "guided",
  "implemented", "improved", "increased", "influenced", "initiated",
  "innovated", "integrated", "introduced", "launched", "led",
  "managed", "maintained", "maximized", "mentored", "migrated",
  "negotiated", "optimized", "orchestrated", "oversaw", "pioneered",
  "planned", "produced", "programmed", "promoted", "proposed",
  "reduced", "refactored", "redesigned", "restructured", "revamped",
  "saved", "scaled", "secured", "simplified", "spearheaded",
  "standardized", "streamlined", "strengthened", "supervised", "transformed",
  "troubleshooted", "upgraded", "won"
];

const COMMON_SKILLS = [
  "javascript", "typescript", "python", "java", "c++", "c#", "ruby",
  "go", "rust", "php", "swift", "kotlin", "scala", "r",
  "react", "angular", "vue", "svelte", "next.js", "nuxt",
  "node.js", "express", "django", "flask", "spring", "rails",
  "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
  "sql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
  "html", "css", "sass", "tailwind", "bootstrap",
  "git", "ci/cd", "jenkins", "github actions", "gitlab",
  "agile", "scrum", "jira", "confluence",
  "machine learning", "deep learning", "nlp", "tensorflow", "pytorch",
  "rest api", "graphql", "microservices",
  "figma", "sketch", "adobe xd",
  "communication", "leadership", "teamwork", "problem solving"
];

const SPECIAL_CHAR_REGEX = /[^\w\s\-.,;:()\/@#&+='%*!?]/;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getGrade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  if (score >= 55) return "C-";
  if (score >= 50) return "D";
  return "F";
}

function startsWithActionVerb(bullet: string): boolean {
  const trimmed = bullet.trim();
  const firstWord = trimmed.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, "");
  return ACTION_VERBS.some((v) => firstWord === v || firstWord === v + "ed" || firstWord === v + "s");
}

function containsNumbers(text: string): boolean {
  return /\d/.test(text);
}

function analyzeContent(data: CVData): QualityDimension {
  let score = 0;
  const feedback: string[] = [];

  const summary = data.personal.summary || "";
  const summaryLen = summary.length;

  if (summaryLen >= 100 && summaryLen <= 400) {
    score += 15;
  } else if (summaryLen > 0) {
    score += 7;
    if (summaryLen < 100) {
      feedback.push("Summary is too short (aim for 100-400 characters).");
    } else {
      feedback.push("Summary is too long (aim for 100-400 characters).");
    }
  } else {
    feedback.push("Missing summary.");
  }

  let totalBullets = 0;
  let goodBullets = 0;
  let quantifiedBullets = 0;
  let verbBullets = 0;

  for (const exp of data.experiences) {
    const bullets = exp.bullets || [];
    totalBullets += bullets.length;

    for (const b of bullets) {
      const len = b.length;
      if (len >= 30 && len <= 150) goodBullets++;
      if (containsNumbers(b)) quantifiedBullets++;
      if (startsWithActionVerb(b)) verbBullets++;
    }

    if (bullets.length < 3) {
      feedback.push(`"${exp.role}" has fewer than 3 bullets (has ${bullets.length}).`);
    } else if (bullets.length > 6) {
      feedback.push(`"${exp.role}" has more than 6 bullets (has ${bullets.length}).`);
    }
  }

  if (data.experiences.length > 0) {
    if (totalBullets > 0) {
      const bulletScore = (goodBullets / totalBullets) * 15;
      score += bulletScore;
      if (goodBullets < totalBullets * 0.6) {
        feedback.push("Many bullet points are too short or too long (aim for 30-150 chars).");
      }

      const quantScore = (quantifiedBullets / totalBullets) * 10;
      score += quantScore;
      if (quantifiedBullets < totalBullets * 0.3) {
        feedback.push("Add more quantified achievements (numbers, percentages, metrics).");
      }

      const verbScore = (verbBullets / totalBullets) * 10;
      score += verbScore;
      if (verbBullets < totalBullets * 0.5) {
        feedback.push("Start more bullet points with strong action verbs.");
      }
    } else {
      feedback.push("No bullet points found in experience entries.");
    }
  } else {
    feedback.push("No work experience entries found.");
  }

  return {
    name: "Content",
    score: Math.round(clamp(score, 0, 30)),
    maxScore: 30,
    feedback,
  };
}

function analyzeCompleteness(data: CVData): QualityDimension {
  let score = 0;
  const feedback: string[] = [];

  if (data.personal.fullName) score += 3;
  else feedback.push("Missing full name.");

  if (data.personal.email) score += 3;
  else feedback.push("Missing email address.");

  if (data.personal.phone) score += 2;
  else feedback.push("Missing phone number.");

  if (data.personal.summary && data.personal.summary.length > 20) score += 3;
  else feedback.push("Missing or too-short summary.");

  if (data.experiences.length > 0) score += 4;
  else feedback.push("No work experience listed.");

  if (data.education.length > 0) score += 3;
  else feedback.push("No education listed.");

  if (data.skills.length >= 5) score += 4;
  else if (data.skills.length > 0) {
    score += 2;
    feedback.push(`Only ${data.skills.length} skills listed (aim for at least 5).`);
  } else {
    feedback.push("No skills listed.");
  }

  if (data.languages.length > 0) score += 3;
  else feedback.push("No languages listed.");

  if (data.personal.linkedIn || data.personal.website || data.personal.github) score += 3;
  else feedback.push("No LinkedIn, portfolio, or GitHub link.");

  return {
    name: "Completeness",
    score: Math.round(clamp(score, 0, 25)),
    maxScore: 25,
    feedback,
  };
}

function analyzeATS(data: CVData): QualityDimension {
  let score = 0;
  const feedback: string[] = [];

  const allText = [
    data.personal.summary,
    ...data.experiences.flatMap((e) => [e.role, e.company, ...e.bullets]),
    ...data.education.flatMap((e) => [e.degree, e.field, e.institution]),
    ...data.skills.map((s) => s.name),
  ].join(" ");

  const hasSpecialChars = SPECIAL_CHAR_REGEX.test(allText);
  if (!hasSpecialChars) {
    score += 5;
  } else {
    feedback.push("Contains special characters or icons that may confuse ATS systems.");
  }

  score += 5;
  const sections = ["experience", "education", "skills", "languages"];
  const activeLower = data.activeSections.map((s) => s.toLowerCase());
  const missingSections = sections.filter((s) => !activeLower.some((a) => a.includes(s)));
  if (missingSections.length > 0) {
    score -= missingSections.length;
    feedback.push(`Consider using standard section headings (missing: ${missingSections.join(", ")}).`);
  }

  const hasContact = data.personal.email && data.personal.phone;
  if (hasContact) score += 5;
  else feedback.push("Ensure contact info is plain text (no images or complex formatting).");

  const skillNames = data.skills.map((s) => s.name.toLowerCase());
  const matchedKeywords = skillNames.filter((s) =>
    COMMON_SKILLS.some((cs) => s.includes(cs) || cs.includes(s))
  );
  if (matchedKeywords.length >= 3) {
    score += 5;
  } else if (matchedKeywords.length > 0) {
    score += 2;
    feedback.push("Add more industry-standard keywords to improve ATS matching.");
  } else {
    feedback.push("No common job keywords detected in skills.");
  }

  return {
    name: "ATS Compatibility",
    score: Math.round(clamp(score, 0, 20)),
    maxScore: 20,
    feedback,
  };
}

function analyzeDesign(data: CVData): QualityDimension {
  let score = 0;
  const feedback: string[] = [];

  let estimatedLines = 0;
  estimatedLines += 4;
  estimatedLines += data.personal.summary ? Math.ceil(data.personal.summary.length / 80) + 2 : 0;
  for (const exp of data.experiences) {
    estimatedLines += 3 + exp.bullets.length;
  }
  estimatedLines += data.education.length * 3;
  estimatedLines += Math.ceil(data.skills.length / 3) + 1;
  estimatedLines += data.languages.length + 1;

  if (estimatedLines <= 55) {
    score += 5;
  } else if (estimatedLines <= 80) {
    score += 3;
    feedback.push("CV may be slightly long. Aim for 1-2 pages.");
  } else {
    feedback.push("CV appears too long. Consider trimming to 1-2 pages.");
  }

  const sectionCounts = [
    data.experiences.length,
    data.education.length,
    data.skills.length,
  ];
  const maxSection = Math.max(...sectionCounts);
  const minSection = Math.min(...sectionCounts);
  if (maxSection > 0 && minSection > 0 && maxSection / minSection <= 5) {
    score += 4;
  } else {
    score += 2;
    feedback.push("Section balance could be improved.");
  }

  if (data.skills.length >= 15 && data.skills.length <= 30) {
    score += 3;
  } else if (data.skills.length > 0 && data.skills.length < 15) {
    score += 1;
    feedback.push(`Only ${data.skills.length} skills listed. 15-30 is ideal.`);
  } else if (data.skills.length > 30) {
    score += 1;
    feedback.push(`${data.skills.length} skills is too many. Aim for 15-30.`);
  }

  const dates = data.experiences
    .flatMap((e) => [e.startDate, e.endDate])
    .concat(data.education.flatMap((e) => [e.startDate, e.endDate]))
    .filter(Boolean);
  const dateFormats = dates.map((d) => {
    if (/^\d{4}$/.test(d)) return "year";
    if (/^\d{4}-\d{2}/.test(d)) return "iso";
    if (/^\d{2}\/\d{4}/.test(d)) return "slash";
    if (/^[A-Z][a-z]+\s+\d{4}/.test(d)) return "text";
    return "other";
  });
  const uniqueFormats = new Set(dateFormats);
  if (uniqueFormats.size <= 1) {
    score += 3;
  } else if (uniqueFormats.size <= 2) {
    score += 1;
    feedback.push("Date formats are inconsistent. Use a consistent format throughout.");
  } else {
    feedback.push("Multiple date formats detected. Standardize for a cleaner look.");
  }

  return {
    name: "Design",
    score: Math.round(clamp(score, 0, 15)),
    maxScore: 15,
    feedback,
  };
}

function analyzeRelevance(data: CVData): QualityDimension {
  let score = 0;
  const feedback: string[] = [];

  const skillNames = data.skills.map((s) => s.name.toLowerCase());
  const experienceText = data.experiences
    .flatMap((e) => [e.role, e.company, ...e.bullets])
    .join(" ")
    .toLowerCase();

  const matchingSkills = skillNames.filter((s) => experienceText.includes(s));
  if (skillNames.length > 0) {
    const matchRatio = matchingSkills.length / skillNames.length;
    if (matchRatio >= 0.5) {
      score += 4;
    } else if (matchRatio >= 0.25) {
      score += 2;
      feedback.push("Fewer than half your skills appear in your experience. Consider removing unrelated skills.");
    } else {
      feedback.push("Skills have low overlap with experience. Ensure listed skills are demonstrated in your work.");
    }
  } else {
    feedback.push("No skills to evaluate for relevance.");
  }

  if (data.education.length > 0) {
    score += 3;
    const hasAdvanced = data.education.some(
      (e) =>
        e.degree.toLowerCase().includes("master") ||
        e.degree.toLowerCase().includes("mba") ||
        e.degree.toLowerCase().includes("phd") ||
        e.degree.toLowerCase().includes("doctorate")
    );
    const hasEntryLevelExp = data.experiences.some(
      (e) =>
        e.role.toLowerCase().includes("intern") ||
        e.role.toLowerCase().includes("junior") ||
        e.role.toLowerCase().includes("entry")
    );
    if (hasAdvanced && hasEntryLevelExp) {
      feedback.push("Advanced degree may overshadow entry-level experience. Consider tailoring.");
    }
  } else {
    feedback.push("No education to assess relevance.");
  }

  const summary = data.personal.summary.toLowerCase();
  const hasSeniorTerms = /\b(senior|lead|principal|director|head|chief)\b/.test(summary);
  const hasJuniorTerms = /\b(junior|entry|graduate|recent|new)\b/.test(summary);
  const hasSeniorExp = data.experiences.some(
    (e) =>
      e.role.toLowerCase().includes("senior") ||
      e.role.toLowerCase().includes("lead") ||
      e.role.toLowerCase().includes("principal")
  );
  const hasJuniorExp = data.experiences.some(
    (e) =>
      e.role.toLowerCase().includes("junior") ||
      e.role.toLowerCase().includes("intern") ||
      e.role.toLowerCase().includes("entry")
  );

  if ((hasSeniorTerms && hasJuniorExp) || (hasJuniorTerms && hasSeniorExp)) {
    feedback.push("Summary level may not match experience level. Ensure consistency.");
  } else {
    score += 3;
  }

  return {
    name: "Relevance",
    score: Math.round(clamp(score, 0, 10)),
    maxScore: 10,
    feedback,
  };
}

export function analyzeQuality(data: CVData): QualityResult {
  const dimensions = [
    analyzeContent(data),
    analyzeCompleteness(data),
    analyzeATS(data),
    analyzeDesign(data),
    analyzeRelevance(data),
  ];

  const overall = dimensions.reduce((sum, d) => sum + d.score, 0);
  const grade = getGrade(overall);

  const topIssues = dimensions
    .flatMap((d) => d.feedback.map((f) => `[${d.name}] ${f}`))
    .slice(0, 3);

  const summary =
    topIssues.length > 0
      ? `Your CV scores ${overall}/100 (${grade}). Priority improvements: ${topIssues.join("; ")}.`
      : `Your CV scores ${overall}/100 (${grade}). Excellent work!`;

  return { overall, grade, dimensions, summary };
}

export function generateContentSuggestions(data: CVData): ContentSuggestion[] {
  const suggestions: ContentSuggestion[] = [];

  const summary = data.personal.summary || "";
  if (summary.length > 0 && summary.length < 100) {
    suggestions.push({
      section: "Summary",
      type: "summary",
      original: summary,
      suggestion:
        "Your summary is too brief. Aim for 2-4 sentences highlighting your key qualifications.",
      reason: "Recruiters spend ~7 seconds scanning; a short summary misses critical context.",
    });
  } else if (summary.length > 400) {
    suggestions.push({
      section: "Summary",
      type: "summary",
      original: summary,
      suggestion:
        "Your summary is too long. Keep it to 3-4 impactful sentences.",
      reason: "Lengthy summaries lose reader attention and dilute key messages.",
    });
  } else if (summary.length > 0 && !/\d/.test(summary) && !/[A-Z][a-z]+(?:ed|ing)\b/.test(summary)) {
    suggestions.push({
      section: "Summary",
      type: "summary",
      original: summary,
      suggestion:
        "Consider adding specific skills or achievements to your summary.",
      reason: "Concrete details make your summary more compelling and memorable.",
    });
  }

  for (const exp of data.experiences) {
    for (const bullet of exp.bullets) {
      if (bullet.length > 0 && bullet.length < 30) {
        suggestions.push({
          section: `Experience: ${exp.role}`,
          type: "bullets",
          original: bullet,
          suggestion:
            "Add more detail to your bullet points. Include what you did, how you did it, and the result.",
          reason: "Short bullets lack impact and fail to demonstrate your contributions.",
        });
        break;
      }
    }

    const bulletsWithoutNumbers = exp.bullets.filter((b) => !containsNumbers(b));
    if (exp.bullets.length > 0 && bulletsWithoutNumbers.length === exp.bullets.length) {
      suggestions.push({
        section: `Experience: ${exp.role}`,
        type: "bullets",
        suggestion:
          "Add measurable results where possible (e.g., 'Increased sales by 20%').",
        reason: "Quantified achievements are more convincing and memorable.",
      });
    }

    const bulletsWithoutVerbs = exp.bullets.filter((b) => !startsWithActionVerb(b));
    if (exp.bullets.length > 0 && bulletsWithoutVerbs.length > exp.bullets.length * 0.5) {
      suggestions.push({
        section: `Experience: ${exp.role}`,
        type: "bullets",
        suggestion:
          "Start each bullet with a strong action verb (e.g., Developed, Led, Implemented).",
        reason: "Action verbs convey initiative and make achievements stand out.",
      });
    }
  }

  if (data.skills.length > 0 && data.skills.length < 8) {
    suggestions.push({
      section: "Skills",
      type: "skills",
      suggestion:
        "Add more relevant skills. Aim for 8-15 skills.",
      reason: "More skills increase ATS match rates and show breadth of expertise.",
    });
  } else if (data.skills.length > 30) {
    suggestions.push({
      section: "Skills",
      type: "skills",
      suggestion:
        "Consider reducing your skills list to the most relevant ones.",
      reason: "A focused skills list is easier to scan and more impactful.",
    });
  }

  return suggestions;
}

export function getQualityTips(data: CVData): string[] {
  const tips: string[] = [];

  if (!data.personal.summary || data.personal.summary.length < 80) {
    tips.push("Write a compelling professional summary of 2-4 sentences.");
  }

  const totalBullets = data.experiences.reduce((sum, e) => sum + e.bullets.length, 0);
  const quantified = data.experiences.flatMap((e) => e.bullets).filter(containsNumbers).length;
  if (totalBullets > 0 && quantified < totalBullets * 0.4) {
    tips.push("Add numbers and metrics to at least half your bullet points.");
  }

  if (data.skills.length < 8) {
    tips.push("Include 8-15 relevant skills for better ATS matching.");
  }

  if (!data.personal.linkedIn && !data.personal.website && !data.personal.github) {
    tips.push("Add a LinkedIn profile or portfolio link.");
  }

  const hasSpecialChars = data.experiences.some((e) =>
    e.bullets.some((b) => SPECIAL_CHAR_REGEX.test(b))
  );
  if (hasSpecialChars) {
    tips.push("Remove special characters and icons for ATS compatibility.");
  }

  if (tips.length < 5) {
    const defaults = [
      "Tailor your CV for each job application.",
      "Use consistent formatting and date formats.",
      "Keep your CV to 1-2 pages.",
      "Proofread for spelling and grammar errors.",
      "Put your most recent experience first.",
    ];
    for (const tip of defaults) {
      if (tips.length >= 5) break;
      if (!tips.includes(tip)) tips.push(tip);
    }
  }

  return tips.slice(0, 5);
}
