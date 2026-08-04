import { CVData, CVTemplate } from "@/types";

export interface ATSIssue {
  type: "critical" | "warning" | "info";
  category: string;
  message: string;
  fix?: string;
  section?: string;
}

export interface ATSResult {
  score: number;
  grade: "Excellent" | "Good" | "Needs Work" | "Poor";
  issues: ATSIssue[];
  passed: string[];
}

const ACTION_VERBS = [
  "Developed", "Built", "Led", "Created", "Implemented", "Managed", "Designed",
  "Improved", "Increased", "Reduced", "Achieved", "Delivered", "Launched",
  "Established", "Optimized", "Streamlined", "Coordinated", "Oversaw",
  "Mentored", "Trained", "Analyzed", "Researched", "Identified", "Negotiated",
  "Resolved", "Automated", "Integrated", "Deployed", "Maintained", "Debugged",
  "Tested", "Documented", "Presented", "Facilitated", "Organized", "Planned",
  "Budgeted", "Spearheaded", "Championed", "Pioneered", "Transformed",
  "Revitalized", "Accelerated", "Elevated", "Empowered", "Fostered",
  "Cultivated", "Instigated", "Orchestrated", "Mobilized", "Galvanized",
  "Unified", "Enabled", "Headed", "Directed", "Governed", "Commanded",
  "Piloted", "Navigated", "Steered", "Guided", "Routed", "Conducted",
  "Masterminded", "Strategized", "Devised", "Formulated", "Conceptualized",
  "Envisioned", "Imagined", "Conceived", "Originated", "Initiated",
  "Inaugurated", "Instituted", "Introduced", "Founded", "Generated",
  "Produced", "Fabricated", "Constructed", "Assembled", "Manufactured",
  "Crafted", "Fashioned", "Molded", "Shaped", "Formed", "Engineered",
  "Architected", "Programmed", "Coded", "Computed", "Calculated", "Quantified",
  "Measured", "Evaluated", "Assessed", "Appraised", "Reviewed", "Audited",
  "Inspected", "Examined", "Investigated", "Explored", "Probed", "Delved",
  "Studied", "Dissected", "Parsed", "Decoded", "Interpreted", "Translated",
  "Adapted", "Modified", "Altered", "Adjusted", "Tuned", "Calibrated",
  "Refined", "Polished", "Enhanced", "Upgraded", "Updated", "Modernized",
  "Revamped", "Renovated", "Restored", "Repaired", "Fixed", "Settled",
  "Addressed", "Tackled", "Handled", "Administered", "Supervised", "Overseen",
  "Controlled", "Regulated", "Monitored", "Tracked",
];

const MEASURABLE_PATTERNS = [
  /\d+%/,
  /\$[\d,]+/,
  /\d+\s*(x|times)/i,
  /\d+\s*(million|billion|thousand)/i,
  /increased\s+\w+\s+by/i,
  /reduced\s+\w+\s+by/i,
  /improved\s+\w+\s+by/i,
  /saved/i,
  /generated/i,
  /grew/i,
  /roi/i,
  /kpi/i,
];

const CHARS_PER_PAGE = 2500;

function countChars(data: CVData): number {
  let total = 0;
  total += data.personal.fullName.length;
  total += data.personal.headline.length;
  total += data.personal.summary.length;
  for (const exp of data.experiences) {
    total += exp.company.length + exp.role.length;
    total += exp.bullets.reduce((sum, b) => sum + b.length, 0);
  }
  for (const edu of data.education) {
    total += edu.institution.length + edu.degree.length + edu.field.length;
  }
  total += data.skills.reduce((sum, s) => sum + s.name.length, 0);
  total += data.languages.reduce((sum, l) => sum + l.name.length, 0);
  total += data.certifications.reduce((sum, c) => sum + c.name.length + c.issuer.length, 0);
  total += data.projects.reduce((sum, p) => sum + p.name.length + p.description.length, 0);
  total += data.awards.reduce((sum, a) => sum + a.name.length + a.description.length, 0);
  total += data.publications.reduce((sum, p) => sum + p.title.length + p.journal.length, 0);
  return total;
}

export function estimatePageCount(data: CVData): number {
  const chars = countChars(data);
  return Math.max(1, Math.ceil(chars / CHARS_PER_PAGE));
}

function hasActionVerb(bullet: string): boolean {
  const trimmed = bullet.trim();
  const firstWord = trimmed.split(/\s+/)[0];
  return ACTION_VERBS.some(
    (v) => firstWord.toLowerCase().startsWith(v.toLowerCase())
  );
}

function hasMeasurableResults(bullet: string): boolean {
  return MEASURABLE_PATTERNS.some((p) => p.test(bullet));
}

function getGrade(score: number): ATSResult["grade"] {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs Work";
  return "Poor";
}

export function analyzeATS(data: CVData, template: CVTemplate, jobDescription?: string): ATSResult {
  let score = 100;
  const issues: ATSIssue[] = [];
  const passed: string[] = [];
  const allBullets = data.experiences.flatMap((e) => e.bullets);

  // --- Critical checks (-15 each) ---
  if (!data.personal.email || data.personal.email.trim() === "") {
    score -= 15;
    issues.push({
      type: "critical",
      category: "Contact",
      message: "Email address is missing",
      fix: "Add a valid professional email address",
      section: "personal",
    });
  } else {
    passed.push("Has email");
  }

  if (!data.personal.phone || data.personal.phone.trim() === "") {
    score -= 15;
    issues.push({
      type: "critical",
      category: "Contact",
      message: "Phone number is missing",
      fix: "Add your phone number with country code",
      section: "personal",
    });
  } else {
    passed.push("Has phone");
  }

  const hasExperience = data.experiences.length > 0 && data.experiences.some((e) => e.bullets.length > 0);
  const hasProjects = data.projects.length > 0;
  if (!hasExperience && !hasProjects) {
    score -= 15;
    issues.push({
      type: "critical",
      category: "Experience",
      message: "No work experience and no projects listed",
      fix: "Add work experience or project entries to demonstrate your skills",
      section: "experience",
    });
  } else {
    passed.push("Has experience with bullets");
  }

  if (!data.personal.summary || data.personal.summary.trim().length === 0) {
    score -= 15;
    issues.push({
      type: "critical",
      category: "Summary",
      message: "Professional summary is empty",
      fix: "Write a concise 2-4 sentence professional summary",
      section: "personal",
    });
  } else {
    passed.push("Has summary");
  }

  // --- Warning checks (-8 each) ---
  if (data.skills.length === 0) {
    score -= 8;
    issues.push({
      type: "warning",
      category: "Skills",
      message: "No skills listed",
      fix: "Add relevant technical and soft skills",
      section: "skills",
    });
  } else {
    passed.push("Has skills");
  }

  const summaryLen = data.personal.summary?.trim().length || 0;
  if (summaryLen > 0 && summaryLen < 50) {
    score -= 8;
    issues.push({
      type: "warning",
      category: "Summary",
      message: "Summary is too short (under 50 characters)",
      fix: "Expand your summary to 2-4 sentences highlighting key qualifications",
      section: "personal",
    });
  } else if (summaryLen > 500) {
    score -= 8;
    issues.push({
      type: "warning",
      category: "Summary",
      message: "Summary is too long (over 500 characters)",
      fix: "Condense your summary to 3-5 concise sentences",
      section: "personal",
    });
  }

  if (data.education.length === 0) {
    score -= 8;
    issues.push({
      type: "warning",
      category: "Education",
      message: "No education listed",
      fix: "Add your educational background",
      section: "education",
    });
  } else {
    passed.push("Has education");
  }

  if (hasExperience) {
    if (allBullets.length > 0) {
      const avgLen = allBullets.reduce((sum, b) => sum + b.length, 0) / allBullets.length;
      if (avgLen < 20) {
        score -= 8;
        issues.push({
          type: "warning",
          category: "Experience",
          message: "Experience bullet points are too short (average under 20 characters)",
          fix: "Expand bullet points with details about your role, actions, and results",
          section: "experience",
        });
      }
    }

    const hasDates = data.experiences.some(
      (e) => (e.startDate && e.startDate.trim() !== "") || (e.endDate && e.endDate.trim() !== "")
    );
    if (!hasDates) {
      score -= 8;
      issues.push({
        type: "warning",
        category: "Experience",
        message: "No dates in experience section",
        fix: "Add start and end dates for each position",
        section: "experience",
      });
    }
  }

  const hasLinkedIn = data.personal.linkedIn && data.personal.linkedIn.trim() !== "";
  const hasGitHub = data.personal.github && data.personal.github.trim() !== "";
  const hasWebsite = data.personal.website && data.personal.website.trim() !== "";
  if (!hasLinkedIn && !hasGitHub && !hasWebsite) {
    score -= 8;
    issues.push({
      type: "warning",
      category: "Contact",
      message: "No LinkedIn, GitHub, or website listed",
      fix: "Add at least one professional online profile",
      section: "personal",
    });
  } else {
    passed.push("Has LinkedIn/GitHub/website");
  }

  const pageCount = estimatePageCount(data);
  if (pageCount > 3) {
    score -= 8;
    issues.push({
      type: "warning",
      category: "Length",
      message: `Estimated ${pageCount} pages - content may be too long`,
      fix: "Trim content to 2 pages (4000-5000 characters) unless you have 10+ years of experience",
    });
  }

  if (hasExperience) {
    if (allBullets.length > 0 && !allBullets.some(hasActionVerb)) {
      score -= 8;
      issues.push({
        type: "warning",
        category: "Experience",
        message: "No action verbs found in bullet points",
        fix: "Start each bullet with a strong action verb (Developed, Led, Created, etc.)",
        section: "experience",
      });
    }
  }

  // Duplicate skill names
  const skillNames = data.skills.map((s) => s.name.trim().toLowerCase());
  const uniqueSkills = new Set(skillNames);
  if (skillNames.length !== uniqueSkills.size) {
    score -= 8;
    issues.push({
      type: "warning",
      category: "Skills",
      message: "Duplicate skill names detected",
      fix: "Remove duplicate skills to keep the list concise",
      section: "skills",
    });
  }

  // --- Info checks (-3 each) ---
  if (data.certifications.length === 0) {
    score -= 3;
    issues.push({
      type: "info",
      category: "Certifications",
      message: "No certifications listed",
      fix: "Add relevant certifications to strengthen your profile",
      section: "certifications",
    });
  }

  if (data.languages.length === 0) {
    score -= 3;
    issues.push({
      type: "info",
      category: "Languages",
      message: "No languages listed",
      fix: "Add language proficiencies, especially for multilingual roles",
      section: "languages",
    });
  }

  if (data.projects.length === 0) {
    score -= 3;
    issues.push({
      type: "info",
      category: "Projects",
      message: "No projects listed",
      fix: "Add personal or professional projects to showcase your skills",
      section: "projects",
    });
  } else {
    passed.push("Has projects");
  }

  if (data.awards.length === 0) {
    score -= 3;
    issues.push({
      type: "info",
      category: "Awards",
      message: "No awards or honors listed",
      fix: "Include any relevant awards, honors, or recognitions",
      section: "awards",
    });
  }

  if (data.education.length > 0) {
    const hasGpa = data.education.some((e) => e.gpa && e.gpa.trim() !== "");
    if (!hasGpa) {
      score -= 3;
      issues.push({
        type: "info",
        category: "Education",
        message: "GPA not listed",
        fix: "Include GPA if it is 3.0 or above",
        section: "education",
      });
    }
  }

  if (!data.personal.headline || data.personal.headline.trim().length === 0) {
    score -= 3;
    issues.push({
      type: "info",
      category: "Summary",
      message: "No professional summary headline",
      fix: "Add a headline (e.g., 'Senior Software Engineer') below your name",
      section: "personal",
    });
  }

  // --- Passed checks ---
  if (!template.atsSafe) {
    issues.push({
      type: "warning",
      category: "Template",
      message: "Selected template may not be ATS-safe",
      fix: "Choose an ATS-friendly template with a single-column layout",
    });
  } else {
    passed.push("Uses ATS-safe template");
  }

  if (allBullets.some(hasMeasurableResults)) {
    passed.push("Experience has measurable results (numbers, percentages)");
  }

  // Common Ethiopian industry keywords
  const ethiopianKeywords = [
    "addis ababa", "ethiopia", "ethiopian", "amharic", "oromo", "tigrinya",
    "NGO", "UNDP", "UNICEF", "USAID", "World Bank", "African Union",
    "government", "ministry", "federal", "regional", "kebele", "woreda",
    "mobile", "banking", "telecom", "agriculture", "manufacturing", "tourism",
    "coffee", "floriculture", "horticulture", "leather", "textile",
  ];
  const allText = [
    data.personal.summary,
    data.personal.headline,
    ...data.experiences.flatMap((e) => [e.company, e.role, ...e.bullets]),
    ...data.skills.map((s) => s.name),
    ...data.projects.map((p) => p.description),
  ]
    .join(" ")
    .toLowerCase();

  if (ethiopianKeywords.some((k) => allText.includes(k.toLowerCase()))) {
    passed.push("Has keywords relevant to common Ethiopian industries");
  }

  // JD-aware keyword checking
  if (jobDescription && jobDescription.trim().length > 20) {
    const jdLower = jobDescription.toLowerCase();
    const userTextLower = allText;

    // Extract important keywords from JD (simple extraction)
    const jdWords = jdLower.split(/\s+/).filter((w) => w.length > 4);
    const uniqueJdWords = Array.from(new Set(jdWords));
    const matchedKeywords = uniqueJdWords.filter((w) => userTextLower.includes(w));
    const matchRatio = uniqueJdWords.length > 0 ? matchedKeywords.length / uniqueJdWords.length : 0;

    if (matchRatio >= 0.3) {
      passed.push(`Strong JD keyword match (${Math.round(matchRatio * 100)}%)`);
    } else if (matchRatio >= 0.15) {
      issues.push({
        type: "warning",
        category: "Job Match",
        message: `Only ${Math.round(matchRatio * 100)}% of JD keywords found in your CV`,
        fix: "Add more keywords from the job description to improve ATS matching",
      });
      score -= 5;
    } else {
      issues.push({
        type: "critical",
        category: "Job Match",
        message: `Very low JD keyword match (${Math.round(matchRatio * 100)}%)`,
        fix: "Significantly align your CV content with the job description keywords",
      });
      score -= 10;
    }

    // Check for required qualifications from JD
    const requiredPatterns = [
      { pattern: /bachelor|degree|education/i, check: () => data.education.length > 0 },
      { pattern: /experience|years/i, check: () => data.experiences.length > 0 },
      { pattern: /certification|certified/i, check: () => data.certifications.length > 0 },
      { pattern: /skills?|technical/i, check: () => data.skills.length > 0 },
    ];

    for (const rp of requiredPatterns) {
      if (rp.pattern.test(jdLower) && !rp.check()) {
        issues.push({
          type: "warning",
          category: "Job Match",
          message: `Job description mentions requirements you haven't included`,
          fix: `Add relevant ${rp.pattern.source} section to your CV`,
        });
        score -= 3;
      }
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    grade: getGrade(score),
    issues,
    passed,
  };
}

export function getATSSuggestions(data: CVData): string[] {
  const suggestions: string[] = [];

  const { summary, email, phone, linkedIn, github, website } = data.personal;

  if (!summary || summary.trim().length === 0) {
    suggestions.push(
      "Write a professional summary of 2-4 sentences that highlights your key qualifications and career goals."
    );
  } else if (summary.trim().length < 50) {
    suggestions.push(
      "Expand your professional summary to at least 50 characters to give recruiters more context about your background."
    );
  }

  if (!email || email.trim() === "" || !phone || phone.trim() === "") {
    suggestions.push(
      "Ensure both your email and phone number are filled in so employers can reach you easily."
    );
  }

  if (!linkedIn && !github && !website) {
    suggestions.push(
      "Add at least one online profile (LinkedIn, GitHub, or personal website) to make your CV more discoverable."
    );
  }

  if (data.experiences.length > 0) {
    const allBullets = data.experiences.flatMap((e) => e.bullets);
    const hasMeasurable = allBullets.some(hasMeasurableResults);
    if (!hasMeasurable) {
      suggestions.push(
        "Add quantifiable achievements to your experience bullets (e.g., 'Increased sales by 25%', 'Reduced load time by 40%')."
      );
    }

    const hasVerbs = allBullets.some(hasActionVerb);
    if (!hasVerbs) {
      suggestions.push(
        "Start each bullet point with a strong action verb like 'Developed', 'Led', 'Created', or 'Implemented'."
      );
    }
  } else if (data.projects.length === 0) {
    suggestions.push(
      "Add work experience or project entries to demonstrate your skills and accomplishments."
    );
  }

  if (data.skills.length === 0) {
    suggestions.push(
      "List your technical and soft skills to help ATS systems match you with relevant job postings."
    );
  }

  if (data.education.length === 0) {
    suggestions.push(
      "Add your educational background including institution, degree, and field of study."
    );
  }

  if (estimatePageCount(data) > 2) {
    suggestions.push(
      "Your CV is estimated to be over 2 pages. Consider trimming content to focus on the most relevant experience."
    );
  }

  return suggestions.slice(0, 5);
}
