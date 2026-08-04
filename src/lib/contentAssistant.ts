import { BulletSuggestion } from "@/types";
import { ethiopianIndustries } from "@/lib/ethiopianData";

const WEAK_PHRASES = [
  { pattern: /^responsible for\b/i, replacement: "Managed" },
  { pattern: /^duties include\b/i, replacement: "Performed" },
  { pattern: /^worked on\b/i, replacement: "Developed" },
  { pattern: /^helped with\b/i, replacement: "Contributed to" },
  { pattern: /^assisted in\b/i, replacement: "Supported" },
  { pattern: /^was part of\b/i, replacement: "Collaborated on" },
  { pattern: /^in charge of\b/i, replacement: "Directed" },
  { pattern: /^handled\b/i, replacement: "Managed" },
];

// Ethiopian industry-specific summary templates
const ETHIOPIAN_SUMMARY_TEMPLATES: Record<string, string[]> = {
  "Technology": [
    "Software developer with X years of experience building web applications using modern technologies. Proficient in React, Node.js, and cloud services.",
    "Full-stack developer specializing in React and Node.js with a passion for creating efficient solutions. Experienced in agile environments.",
  ],
  "Banking & Finance": [
    "Finance professional with X years of experience in banking operations and regulatory compliance. Skilled in financial analysis, risk management, and IFRS.",
    "Detail-oriented financial analyst with expertise in risk assessment and financial reporting. Committed to accuracy and regulatory standards.",
  ],
  "NGO & Development": [
    "Development professional with X years of experience implementing community-based programs. Passionate about sustainable development and capacity building.",
    "Results-driven program manager with expertise in M&E, grant writing, and stakeholder engagement. Committed to community empowerment.",
  ],
  "Government & Public Administration": [
    "Public administration professional with X years of experience in government service. Skilled in policy analysis, stakeholder engagement, and strategic planning.",
    "Dedicated public servant with expertise in policy implementation and community development. Committed to public service excellence.",
  ],
  "Telecom": [
    "Telecommunications professional with X years of experience in network operations. Proficient in fiber optics, 4G/5G technologies, and network optimization.",
    "Results-driven telecom engineer with expertise in network infrastructure and customer experience. Skilled in TCP/IP, fiber optics, and project management.",
  ],
  "Engineering": [
    "Civil engineer with X years of experience in infrastructure development and project management. Proficient in AutoCAD, quality control, and site supervision.",
    "Results-oriented engineer with expertise in construction management and quality assurance. Committed to safe and efficient project delivery.",
  ],
  "Healthcare": [
    "Healthcare professional with X years of experience in patient care and health program management. Skilled in community health, epidemiology, and health education.",
    "Dedicated health worker with expertise in community health and disease prevention programs. Committed to patient outcomes and health promotion.",
  ],
  "Education": [
    "Educator with X years of experience in curriculum development and student engagement. Passionate about innovative pedagogy and inclusive education.",
    "Committed teacher with expertise in lesson planning, student assessment, and educational technology. Dedicated to student success.",
  ],
  "Hospitality & Tourism": [
    "Hospitality professional with X years of experience in hotel operations and guest services. Skilled in revenue management, event planning, and team leadership.",
    "Results-driven hospitality manager with expertise in revenue optimization and guest satisfaction. Committed to service excellence.",
  ],
  "Marketing & Sales": [
    "Marketing professional with X years of experience in digital marketing and brand management. Proficient in SEO, social media, and content strategy.",
    "Results-driven marketer with expertise in lead generation and customer engagement. Skilled in analytics and campaign management.",
  ],
};

const METRIC_PATTERNS = [
  { pattern: /\d+%/, hint: "Good — percentage metric found" },
  { pattern: /\$\d+/, hint: "Good — dollar amount found" },
  { pattern: /\d+\+?\s*(users|customers|clients|people|team members|employees)/i, hint: "Good — people metric found" },
  { pattern: /\d+\s*(days|weeks|months|hours|minutes)/i, hint: "Good — time metric found" },
  { pattern: /\d+\s*(projects|tasks|tickets|issues|pull requests)/i, hint: "Good — volume metric found" },
];

export function suggestBulletImprovement(original: string, jobDescription?: string): BulletSuggestion[] {
  if (!original.trim()) return [];

  const suggestions: BulletSuggestion[] = [];

  // 1. Impact improvement (replace weak verbs)
  for (const weak of WEAK_PHRASES) {
    if (weak.pattern.test(original)) {
      const improved = original.replace(weak.pattern, weak.replacement);
      suggestions.push({
        original,
        improved,
        type: "impact",
        explanation: `Replace "${original.split(" ").slice(0, 2).join(" ")}" with a stronger action verb`,
      });
      break;
    }
  }

  // 2. Add metrics suggestion (if no metrics present)
  const hasMetrics = METRIC_PATTERNS.some((m) => m.pattern.test(original));
  if (!hasMetrics && original.length > 15) {
    const improved = `${original.trim().replace(/\.$/, "")}. Achieved measurable results`;
    suggestions.push({
      original,
      improved,
      type: "impact",
      explanation: "Add specific metrics (%, $, time, team size) to quantify your impact",
    });
  }

  // 3. Professional tone
  const casualPatterns = [
    { pattern: /\b(really|very|just|kind of|sort of|basically|actually)\b/gi, replacement: "" },
    { pattern: /\b(stuff|things|a lot)\b/gi, replacement: "results" },
    { pattern: /\b(awesome|cool|great)\b/gi, replacement: "effective" },
  ];

  let professionalImproved = original;
  let madeProfessionalChange = false;
  for (const cp of casualPatterns) {
    if (cp.pattern.test(professionalImproved)) {
      professionalImproved = professionalImproved.replace(cp.pattern, cp.replacement).replace(/\s{2,}/g, " ").trim();
      madeProfessionalChange = true;
    }
  }
  if (madeProfessionalChange && professionalImproved !== original) {
    suggestions.push({
      original,
      improved: professionalImproved,
      type: "professional",
      explanation: "Remove casual language for a more professional tone",
    });
  }

  // 4. Concise improvement
  const wordCount = original.split(/\s+/).length;
  if (wordCount > 25) {
    const trimmed = original
      .replace(/\b(that|which|who|whom)\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (trimmed.split(/\s+/).length < wordCount) {
      suggestions.push({
        original,
        improved: trimmed,
        type: "concise",
        explanation: `Reduce from ${wordCount} words to ~${trimmed.split(/\s+/).length} words for better readability`,
      });
    }
  }

  // 5. Job-specific tailoring
  if (jobDescription) {
    const jdLower = jobDescription.toLowerCase();
    const words = original.toLowerCase().split(/\s+/);
    const matchingKeywords = words.filter((w) => w.length > 3 && jdLower.includes(w));
    const missingFromJd = words.filter((w) => w.length > 5 && !jdLower.includes(w));

    if (missingFromJd.length > 0 && matchingKeywords.length < 2) {
      const jdKeywords = extractKeywords(jobDescription);
      const relevantMissing = jdKeywords.filter((kw) => !original.toLowerCase().includes(kw)).slice(0, 2);
      if (relevantMissing.length > 0) {
        const improved = `${original.trim().replace(/\.$/, "")} | ${relevantMissing.join(", ")}`;
        suggestions.push({
          original,
          improved,
          type: "tailor",
          explanation: `Consider aligning with job keywords: ${relevantMissing.join(", ")}`,
        });
      }
    }
  }

  // 6. Grammar fix (basic)
  if (original.length > 0 && !/^[A-Z]/.test(original)) {
    suggestions.push({
      original,
      improved: original.charAt(0).toUpperCase() + original.slice(1),
      type: "grammar",
      explanation: "Capitalize the first letter",
    });
  }

  return suggestions.slice(0, 3);
}

export function getIndustrySummaryTemplates(industry: string): string[] {
  const templates = ETHIOPIAN_SUMMARY_TEMPLATES[industry];
  if (templates) return templates;
  // Try matching by partial name
  const match = Object.keys(ETHIOPIAN_SUMMARY_TEMPLATES).find((k) =>
    k.toLowerCase().includes(industry.toLowerCase()) || industry.toLowerCase().includes(k.toLowerCase())
  );
  return match ? ETHIOPIAN_SUMMARY_TEMPLATES[match] : [];
}

export function getIndustrySkills(industry: string): string[] {
  const ind = ethiopianIndustries.find(
    (i) => i.industry.toLowerCase() === industry.toLowerCase() ||
           i.industry.toLowerCase().includes(industry.toLowerCase()) ||
           industry.toLowerCase().includes(i.industry.toLowerCase())
  );
  return ind?.skills || [];
}

export function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
    "by", "from", "as", "is", "was", "are", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
    "may", "might", "shall", "can", "this", "that", "these", "those", "i", "you",
    "he", "she", "it", "we", "they", "what", "which", "who", "whom", "how",
    "when", "where", "why", "all", "each", "every", "both", "few", "more", "most",
    "other", "some", "such", "no", "not", "only", "own", "same", "so", "than",
    "too", "very", "just", "about", "above", "after", "again", "also", "any",
  ]);

  return Array.from(new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopWords.has(w))
  ));
}
