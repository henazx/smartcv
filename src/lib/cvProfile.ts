import {
  CVData, CVProfile, CVType, ApplicationGoal, CareerStage,
  RoleRecommendation, SmartRecommendation,
  JobMatchResult, ScoreBreakdown, CVTemplate,
} from "@/types";
import { analyzeContent, computeLayout } from "@/lib/layoutEngine";
import { analyzeATS } from "@/lib/atsScorer";
import { analyzeQuality } from "@/lib/cvQuality";
import { runDesignGuardian } from "@/lib/designGuardian";
import { ethiopianIndustries } from "@/lib/ethiopianData";

// --- Role-based recommendations ---

export const ROLE_DATABASE: Record<string, RoleRecommendation> = {
  "software developer": {
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Git", "REST APIs", "SQL", "Docker", "AWS"],
    keywords: ["full-stack", "frontend", "backend", "API", "microservices", "agile", "CI/CD", "testing", "debugging", "performance"],
    sections: ["experience", "projects", "skills", "education", "certifications"],
    sectionOrder: ["personal", "skills", "experience", "projects", "education", "certifications"],
    templateId: "tech-developer",
    description: "Technical roles emphasizing projects and skills",
  },
  "data scientist": {
    skills: ["Python", "R", "SQL", "Machine Learning", "TensorFlow", "Pandas", "Statistics", "Data Visualization", "Jupyter", "Scikit-learn"],
    keywords: ["machine learning", "deep learning", "data analysis", "statistical modeling", "neural networks", "NLP", "big data", "ETL"],
    sections: ["experience", "projects", "skills", "education", "publications"],
    sectionOrder: ["personal", "skills", "experience", "projects", "education", "publications"],
    templateId: "tech-developer",
    description: "Data-focused roles emphasizing research and technical skills",
  },
  "accountant": {
    skills: ["Financial Reporting", "Tax Preparation", "GAAP", "Excel", "QuickBooks", "Audit", "Budgeting", "Accounts Payable", "Accounts Receivable", "Compliance"],
    keywords: ["financial analysis", "month-end close", "reconciliation", "variance analysis", "internal controls", "IFRS", "tax compliance"],
    sections: ["experience", "education", "skills", "certifications"],
    sectionOrder: ["personal", "experience", "education", "skills", "certifications"],
    templateId: "classic-professional",
    description: "Finance roles emphasizing certifications and experience",
  },
  "project manager": {
    skills: ["Project Planning", "Agile", "Scrum", "Risk Management", "Stakeholder Management", "Budgeting", "MS Project", "Jira", "Leadership", "Communication"],
    keywords: ["project delivery", "cross-functional", "KPI", "milestone", "scope management", "resource allocation", "PMP", "waterfall"],
    sections: ["experience", "skills", "education", "certifications"],
    sectionOrder: ["personal", "experience", "skills", "certifications", "education"],
    templateId: "executive",
    description: "Leadership roles emphasizing experience and certifications",
  },
  "marketing manager": {
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Social Media", "Google Analytics", "Email Marketing", "Brand Management", "Campaign Management", "Market Research", "Copywriting"],
    keywords: ["ROI", "conversion", "engagement", "brand awareness", "lead generation", "funnel", "A/B testing", "growth hacking"],
    sections: ["experience", "skills", "projects", "education"],
    sectionOrder: ["personal", "experience", "skills", "projects", "education"],
    templateId: "modern-header",
    description: "Marketing roles emphasizing campaigns and measurable results",
  },
  "teacher": {
    skills: ["Curriculum Development", "Classroom Management", "Student Assessment", "Differentiated Instruction", "Educational Technology", "Parent Communication", "Lesson Planning", "Special Education"],
    keywords: ["student achievement", "learning outcomes", "IEP", "differentiation", "formative assessment", "classroom engagement"],
    sections: ["experience", "education", "skills", "certifications", "awards"],
    sectionOrder: ["personal", "education", "experience", "skills", "certifications"],
    templateId: "academic-research",
    description: "Education roles emphasizing teaching experience and certifications",
  },
  "nurse": {
    skills: ["Patient Care", "Vital Signs", "Medication Administration", "EMR/EHR", "IV Therapy", "Wound Care", "Patient Education", "BLS/ACLS", "Triage", "Clinical Assessment"],
    keywords: ["patient safety", "care plan", "clinical documentation", "infection control", "patient advocacy", "evidence-based practice"],
    sections: ["experience", "education", "skills", "certifications"],
    sectionOrder: ["personal", "experience", "education", "skills", "certifications"],
    templateId: "classic-professional",
    description: "Healthcare roles emphasizing clinical skills and certifications",
  },
  "graphic designer": {
    skills: ["Adobe Photoshop", "Illustrator", "InDesign", "Figma", "UI/UX", "Typography", "Brand Identity", "Layout Design", "Color Theory", "Motion Graphics"],
    keywords: ["visual design", "creative direction", "brand development", "user interface", "responsive design", "wireframing", "prototyping"],
    sections: ["projects", "experience", "skills", "education", "awards"],
    sectionOrder: ["personal", "projects", "experience", "skills", "education"],
    templateId: "creative-portfolio",
    description: "Creative roles emphasizing portfolio and visual skills",
  },
  // Ethiopian-specific roles
  "bank officer": {
    skills: ["Microsoft Excel", "Financial Analysis", "Accounting", "Risk Management", "Compliance", "Customer Service", "Data Analysis", "SQL", "IFRS", "Credit Analysis"],
    keywords: ["financial reporting", "credit analysis", "loan processing", "anti-money laundering", "regulatory compliance", "portfolio management", "banking operations"],
    sections: ["experience", "education", "skills", "certifications"],
    sectionOrder: ["personal", "experience", "education", "skills", "certifications"],
    templateId: "classic-professional",
    description: "Banking roles emphasizing compliance and financial skills",
  },
  "development officer": {
    skills: ["Project Management", "Monitoring & Evaluation", "Grant Writing", "Report Writing", "Community Engagement", "Data Collection", "Stakeholder Management", "Budget Management", "Gender Analysis", "Environmental Assessment"],
    keywords: ["sustainable development", "community empowerment", "capacity building", "livelihood improvement", "food security", "health programs", "M&E"],
    sections: ["experience", "skills", "education", "certifications"],
    sectionOrder: ["personal", "experience", "skills", "education", "certifications"],
    templateId: "modern-header",
    description: "NGO/development roles emphasizing program delivery",
  },
  "telecom engineer": {
    skills: ["Network Engineering", "TCP/IP", "Fiber Optics", "4G/5G Technologies", "Project Management", "Customer Service", "Technical Support", "ERP Systems", "Data Analysis", "Linux"],
    keywords: ["telecommunications", "network infrastructure", "mobile services", "broadband", "digital transformation", "fiber optics"],
    sections: ["experience", "skills", "education", "certifications"],
    sectionOrder: ["personal", "experience", "skills", "education", "certifications"],
    templateId: "tech-developer",
    description: "Telecom roles emphasizing technical and network skills",
  },
  "public health officer": {
    skills: ["Patient Care", "Health Education", "Data Collection", "Public Health", "Epidemiology", "Health Information Systems", "Community Health", "Disease Surveillance", "Program Management", "Report Writing"],
    keywords: ["healthcare delivery", "patient outcomes", "health programs", "disease prevention", "health promotion", "community health"],
    sections: ["experience", "education", "skills", "certifications"],
    sectionOrder: ["personal", "experience", "education", "skills", "certifications"],
    templateId: "classic-professional",
    description: "Healthcare roles emphasizing clinical and program skills",
  },
  "civil engineer": {
    skills: ["AutoCAD", "Project Management", "Quality Control", "Safety Management", "Technical Drawing", "Structural Analysis", "Material Testing", "Site Supervision", "Budget Management", "Stakeholder Communication"],
    keywords: ["construction", "infrastructure", "quality assurance", "project delivery", "engineering design", "site management"],
    sections: ["experience", "skills", "education", "certifications"],
    sectionOrder: ["personal", "experience", "skills", "education", "certifications"],
    templateId: "modern-header",
    description: "Engineering roles emphasizing project delivery and technical skills",
  },
  "hospitality manager": {
    skills: ["Customer Service", "Food & Beverage Management", "Event Planning", "Hotel Operations", "Revenue Management", "Guest Relations", "Tourism Marketing", "Staff Training", "Inventory Management", "Quality Assurance"],
    keywords: ["guest satisfaction", "hospitality management", "tourism development", "service excellence", "revenue optimization"],
    sections: ["experience", "skills", "education", "certifications"],
    sectionOrder: ["personal", "experience", "skills", "education", "certifications"],
    templateId: "modern-header",
    description: "Hospitality roles emphasizing operations and guest services",
  },
};

// --- CV Type to profile mapping ---

const CV_TYPE_PROFILES: Record<CVType, Partial<CVProfile>> = {
  "first-job": { careerStage: "entry-level", preferredStyle: "professional", atsPriority: "high", recommendedSections: ["education", "skills", "projects", "languages"] },
  "internship": { careerStage: "entry-level", preferredStyle: "professional", atsPriority: "high", recommendedSections: ["education", "skills", "projects", "languages"] },
  "scholarship": { careerStage: "entry-level", preferredStyle: "academic", atsPriority: "low", recommendedSections: ["education", "publications", "awards", "skills", "languages"] },
  "graduate-job": { careerStage: "entry-level", preferredStyle: "modern", atsPriority: "high", recommendedSections: ["education", "skills", "projects", "experience"] },
  "experienced": { careerStage: "mid-level", preferredStyle: "professional", atsPriority: "medium", recommendedSections: ["experience", "skills", "education", "projects"] },
  "academic": { careerStage: "mid-level", preferredStyle: "academic", atsPriority: "low", recommendedSections: ["education", "publications", "experience", "awards", "skills"] },
  "tech-developer": { careerStage: "mid-level", preferredStyle: "modern", atsPriority: "medium", recommendedSections: ["skills", "projects", "experience", "education", "certifications"] },
  "creative-design": { careerStage: "mid-level", preferredStyle: "creative", atsPriority: "low", recommendedSections: ["projects", "experience", "skills", "education", "awards"] },
  "international": { careerStage: "mid-level", preferredStyle: "professional", atsPriority: "high", recommendedSections: ["experience", "skills", "education", "languages", "certifications"] },
  "government": { careerStage: "mid-level", preferredStyle: "professional", atsPriority: "high", recommendedSections: ["experience", "education", "skills", "certifications"] },
  "executive": { careerStage: "senior", preferredStyle: "executive", atsPriority: "medium", recommendedSections: ["experience", "awards", "skills", "education", "certifications", "publications"] },
  "research": { careerStage: "mid-level", preferredStyle: "academic", atsPriority: "low", recommendedSections: ["publications", "experience", "education", "skills", "awards"] },
};

// --- Goal to profile mapping ---

const GOAL_PROFILES: Record<ApplicationGoal, Partial<CVProfile>> = {
  "job": { atsPriority: "high" },
  "internship": { atsPriority: "high" },
  "scholarship": { atsPriority: "low", preferredStyle: "academic" },
  "fellowship": { atsPriority: "medium", preferredStyle: "academic" },
  "graduate-program": { atsPriority: "low", preferredStyle: "academic" },
  "remote-job": { atsPriority: "high" },
  "international-job": { atsPriority: "high" },
};

// --- Main profile computation ---

export function computeProfile(
  cvType: CVType | null,
  applicationGoal: ApplicationGoal | null,
  targetJobTitle: string,
  targetIndustry: string,
  data: CVData
): CVProfile {
  const analysis = analyzeContent(data);

  const typeProfile = cvType ? CV_TYPE_PROFILES[cvType] : {};
  const goalProfile = applicationGoal ? GOAL_PROFILES[applicationGoal] : {};

  const roleKey = targetJobTitle.toLowerCase().trim();
  const roleRec = ROLE_DATABASE[roleKey] || null;

  const careerStage = typeProfile.careerStage || analysis.careerStage;
  const experienceYears = analysis.experienceYears;

  let preferredStyle: CVProfile["preferredStyle"] = typeProfile.preferredStyle || "professional";
  if (goalProfile.preferredStyle) preferredStyle = goalProfile.preferredStyle;

  let atsPriority: CVProfile["atsPriority"] = typeProfile.atsPriority || "medium";
  if (goalProfile.atsPriority) atsPriority = goalProfile.atsPriority;

  const recommendedTemplate = roleRec?.templateId || getDefaultTemplate(cvType, careerStage, preferredStyle);
  const recommendedSections = typeProfile.recommendedSections || ["experience", "education", "skills", "languages"];
  const recommendedSectionOrder = roleRec?.sectionOrder || getDefaultSectionOrder(careerStage);
  const recommendedSkills = roleRec?.skills || [];
  const roleKeywords = roleRec?.keywords || [];

  return {
    cvType,
    applicationGoal,
    targetJobTitle,
    targetIndustry,
    careerStage,
    experienceYears,
    preferredStyle,
    atsPriority,
    recommendedTemplate,
    recommendedSections,
    recommendedSectionOrder,
    recommendedSkills,
    roleKeywords,
  };
}

function getDefaultTemplate(cvType: CVType | null, careerStage: CareerStage, style: CVProfile["preferredStyle"]): string {
  if (cvType === "tech-developer") return "tech-developer";
  if (cvType === "academic") return "academic-research";
  if (cvType === "creative-design") return "creative-portfolio";
  if (careerStage === "senior") return "executive";
  if (style === "minimal") return "minimalist";
  if (style === "academic") return "academic-research";
  if (style === "creative") return "creative-portfolio";
  return "classic-professional";
}

function getDefaultSectionOrder(careerStage: CareerStage): string[] {
  switch (careerStage) {
    case "entry-level": return ["personal", "education", "skills", "projects", "experience", "certifications", "languages"];
    case "mid-level": return ["personal", "experience", "skills", "education", "projects", "certifications", "languages"];
    case "senior": return ["personal", "experience", "certifications", "skills", "education", "projects", "languages"];
    default: return ["personal", "experience", "skills", "education", "projects", "certifications", "languages"];
  }
}

// --- Synonym Map ---

const SYNONYM_MAP: Record<string, string[]> = {
  "javascript": ["js"],
  "js": ["javascript"],
  "typescript": ["ts"],
  "ts": ["typescript"],
  "react": ["reactjs", "react.js"],
  "reactjs": ["react", "react.js"],
  "react.js": ["react", "reactjs"],
  "node": ["node.js", "nodejs"],
  "node.js": ["node", "nodejs"],
  "nodejs": ["node", "node.js"],
  "postgresql": ["postgres"],
  "postgres": ["postgresql"],
  "rest api": ["restful api", "rest"],
  "restful api": ["rest api", "rest"],
  "rest": ["rest api", "restful api"],
  "microsoft excel": ["excel"],
  "excel": ["microsoft excel"],
  "python": ["python3"],
  "python3": ["python"],
  "css": ["cascading style sheets"],
  "cascading style sheets": ["css"],
  "html": ["html5"],
  "html5": ["html"],
  "git": ["github", "gitlab"],
  "github": ["git", "gitlab"],
  "gitlab": ["git", "github"],
  "docker": ["containers"],
  "containers": ["docker"],
  "aws": ["amazon web services"],
  "amazon web services": ["aws"],
  "ci/cd": ["continuous integration", "continuous deployment"],
  "continuous integration": ["ci/cd", "continuous deployment"],
  "continuous deployment": ["ci/cd", "continuous integration"],
  "sql": ["mysql", "postgresql"],
  "mysql": ["sql"],
  "api": ["apis"],
  "apis": ["api"],
  "agile": ["scrum", "kanban"],
  "scrum": ["agile", "kanban"],
  "kanban": ["agile", "scrum"],
  "machine learning": ["ml"],
  "ml": ["machine learning"],
  "data analysis": ["data analytics"],
  "data analytics": ["data analysis"],
  "project management": ["pm"],
  "pm": ["project management"],
  "communication": ["interpersonal skills"],
  "interpersonal skills": ["communication"],
  "leadership": ["team leadership"],
  "team leadership": ["leadership"],
};

// --- Word-boundary keyword search ---

function wordBoundaryMatch(keyword: string, text: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escaped}\\b`, "i");
  return regex.test(text);
}

// --- Intelligent keyword extraction from JD ---

function extractKeywordsFromJD(jdLower: string): { technical: string[]; soft: string[]; qualifications: string[]; experienceYears: number | null } {
  const technicalTerms = [
    "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "ruby", "php",
    "react", "angular", "vue", "svelte", "next.js", "node.js", "express", "django", "flask", "spring",
    "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch",
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins",
    "html", "css", "sass", "less", "tailwind",
    "git", "ci/cd", "graphql", "rest", "grpc", "websocket",
    "machine learning", "deep learning", "nlp", "data analysis", "tensorflow", "pytorch",
    "excel", "powerpoint", "word", "google analytics", "tableau", "power bi",
    "figma", "sketch", "adobe", "photoshop", "illustrator",
    "agile", "scrum", "jira", "confluence",
    // Ethiopian industry tech terms
    "autocad", "erp", "tcp/ip", "fiber optics", "4g", "5g",
    "ifrs", "bloomberg", "quickbooks",
  ];

  const softSkillTerms = [
    "communication", "leadership", "teamwork", "problem solving", "critical thinking",
    "time management", "organization", "adaptability", "creativity", "collaboration",
    "interpersonal skills", "team leadership", "mentoring", "stakeholder management",
    "project management", "attention to detail", "analytical", "self-motivated",
    "work ethic", "conflict resolution", "negotiation", "presentation",
  ];

  const qualificationTerms = [
    "bachelor", "master", "phd", "mba", "degree", "diploma",
    "certification", "certified", "pmp", "aws certified", "azure certified",
    "google certified", "cissp", "comptia", "ccna", "ccnp",
    "cpa", "cfa", "frm", "six sigma", "itil",
    // Ethiopian certifications
    "medical license", "teaching license", "public administration",
    "hotel management", "food safety", "tourism",
  ];

  // Add Ethiopian industry keywords from ethiopianIndustries
  const ethiopianKeywords = ethiopianIndustries.flatMap((ind) => ind.keywords);

  const technical = technicalTerms.filter((t) => wordBoundaryMatch(t, jdLower));
  const soft = softSkillTerms.filter((s) => wordBoundaryMatch(s, jdLower));
  const qualifications = qualificationTerms.filter((q) => wordBoundaryMatch(q, jdLower));

  // Check for Ethiopian industry keywords in JD
  const ethiopianMatched = ethiopianKeywords.filter((k) => wordBoundaryMatch(k, jdLower));

  const yearsMatch = jdLower.match(/(\d+)\+?\s*years?\s*(?:of\s+)?(?:experience)?/);
  const experienceYears = yearsMatch ? parseInt(yearsMatch[1], 10) : null;

  return { technical: [...technical, ...ethiopianMatched], soft, qualifications, experienceYears };
}

// --- Job Description Matching ---

export function analyzeJobMatch(data: CVData, jobDescription: string): JobMatchResult {
  if (!jobDescription.trim()) {
    return { score: 0, strongMatches: [], weakMatches: [], missing: [], missingKeywords: [], suggestions: [], extractedSkills: [], extractedKeywords: [], hasJobDescription: false };
  }

  const jdLower = jobDescription.toLowerCase();
  const allUserText = [
    data.personal.summary,
    data.personal.headline,
    ...data.experiences.flatMap((e) => [e.role, e.company, ...e.bullets]),
    ...data.education.flatMap((e) => [e.degree, e.field, e.institution]),
    ...data.skills.map((s) => s.name),
    ...data.projects.flatMap((p) => [p.name, p.description, ...p.technologies]),
    ...data.certifications.map((c) => c.name),
  ].join(" ").toLowerCase();

  const userSkills = data.skills.map((s) => s.name.toLowerCase());
  const { technical, soft, qualifications, experienceYears } = extractKeywordsFromJD(jdLower);

  const jdKeywords = Array.from(new Set([...technical, ...soft, ...qualifications]));
  const keywordsToCheck = Array.from(new Set([...userSkills, ...jdKeywords]));

  const strongMatches: string[] = [];
  const weakMatches: string[] = [];
  const missing: string[] = [];

  for (const kw of keywordsToCheck) {
    const inJD = wordBoundaryMatch(kw, jdLower);
    if (!inJD) continue;

    const inCV = wordBoundaryMatch(kw, allUserText);
    if (inCV) {
      strongMatches.push(kw);
      continue;
    }

    const synonyms = SYNONYM_MAP[kw] || [];
    const synonymFound = synonyms.some((syn) => wordBoundaryMatch(syn, allUserText));
    if (synonymFound) {
      weakMatches.push(kw);
    } else {
      missing.push(kw);
    }
  }

  const STRONG_WEIGHT = 3;
  const WEAK_WEIGHT = 1;
  const MISSING_PENALTY = 2;

  const totalPoints = (strongMatches.length * STRONG_WEIGHT) + (weakMatches.length * WEAK_WEIGHT) - (missing.length * MISSING_PENALTY);
  const maxPossiblePoints = keywordsToCheck.length * STRONG_WEIGHT;
  const score = maxPossiblePoints > 0
    ? Math.max(0, Math.min(100, Math.round((totalPoints / maxPossiblePoints) * 100)))
    : 50;

  const suggestions: string[] = [];
  for (const kw of missing.slice(0, 5)) {
    suggestions.push(`Add experience or projects demonstrating "${kw}"`);
  }
  if (experienceYears !== null) {
    const hasEnoughExp = data.experiences.some((e) => {
      const duration = e.endDate ? Math.floor((new Date(e.endDate).getTime() - new Date(e.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365)) : 3;
      return duration >= experienceYears;
    });
    if (!hasEnoughExp) {
      suggestions.push(`The role asks for ${experienceYears}+ years of experience — highlight relevant experience prominently`);
    }
  }
  if (missing.some((kw) => ["communication", "leadership", "teamwork", "interpersonal skills"].includes(kw))) {
    suggestions.push("Add examples of soft skills with specific achievements in your experience bullets");
  }

  return {
    score,
    strongMatches,
    weakMatches,
    missing,
    missingKeywords: missing,
    suggestions,
    extractedSkills: [...technical, ...soft],
    extractedKeywords: keywordsToCheck,
    hasJobDescription: true,
  };
}

// --- Smart Recommendations ---

export function generateRecommendations(
  data: CVData,
  profile: CVProfile,
  template: CVTemplate
): SmartRecommendation[] {
  const recs: SmartRecommendation[] = [];

  // Content recommendations
  if (!data.personal.summary || data.personal.summary.length < 30) {
      recs.push({
        id: "add-summary",
        type: "content",
        priority: "high",
        title: "Add a professional summary",
        description: "A strong summary helps recruiters understand your value in 6 seconds.",
        action: "Write 2-3 sentences about your professional background and goals",
        targetSection: "summary",
      });
  }

  if (data.experiences.length === 0 && profile.careerStage !== "entry-level") {
      recs.push({
        id: "add-experience",
        type: "section",
        priority: "high",
        title: "Add work experience",
        description: "Work experience is the most important section for most CVs.",
        action: "Add your most recent positions",
        targetSection: "experience",
      });
  }

  // Bullet quality
  data.experiences.forEach((exp) => {
    const weakBullets = exp.bullets.filter((b) => {
      const lower = b.toLowerCase();
      return lower.startsWith("responsible for") || lower.startsWith("duties include") || lower.startsWith("worked on") || b.length < 20;
    });
    if (weakBullets.length > 0) {
      recs.push({
        id: `weak-bullets-${exp.id}`,
        type: "content",
        priority: "medium",
        title: `Strengthen bullets at ${exp.company || "this position"}`,
        description: `${weakBullets.length} bullet(s) could be more impactful with measurable achievements.`,
        action: "Add specific numbers, outcomes, and action verbs",
        targetSection: "experience",
      });
    }
  });

  // Skills recommendations
  if (profile.recommendedSkills.length > 0 && data.skills.length < 5) {
    const missing = profile.recommendedSkills.filter(
      (s) => !data.skills.some((us) => us.name.toLowerCase() === s.toLowerCase())
    );
    if (missing.length > 0) {
      recs.push({
        id: "add-role-skills",
        type: "skill",
        priority: "medium",
        title: `Add relevant skills for ${profile.targetJobTitle || "your target role"}`,
        description: `Consider adding: ${missing.slice(0, 3).join(", ")}`,
        action: "Add these skills to improve role alignment",
        targetSection: "skills",
      });
    }
  }

  // Education
  if (data.education.length === 0) {
      recs.push({
        id: "add-education",
        type: "section",
        priority: profile.careerStage === "entry-level" ? "high" : "medium",
        title: "Add education details",
        description: "Education is essential for entry-level roles and adds credibility.",
        action: "Add your educational background",
        targetSection: "education",
      });
  }

  // Design recommendations
  if (template.category === "classic" && profile.preferredStyle === "modern") {
      recs.push({
        id: "try-modern-template",
        type: "design",
        priority: "low",
        title: "Try a modern template",
        description: "Your profile suggests a modern style might work better.",
        action: "Browse modern templates",
        targetSection: undefined,
      });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recs.slice(0, 5);
}

// --- Score Breakdown ---

export function computeScoreBreakdown(
  data: CVData,
  template: CVTemplate,
  jobDescription: string
): ScoreBreakdown {
  const atsResult = analyzeATS(data, template);
  const qualityResult = analyzeQuality(data);
  const jobMatch = jobDescription ? analyzeJobMatch(data, jobDescription) : null;

  const ats = atsResult.score;
  const content = qualityResult.overall;

  let design = 75;
  try {
    const analysis = analyzeContent(data);
    const layout = computeLayout(data, template);
    const defaultTheme = {
      id: "default", name: "Default",
      colors: { primary: "#1a1a1a", secondary: "#4a4a4a", text: "#111827", muted: "#6b7280", background: "#ffffff", border: "#e5e7eb", accent: "#2563eb" },
      typography: { headingFont: "Helvetica-Bold", bodyFont: "Helvetica", headingWeight: 700, bodySize: 10, lineHeight: 1.4 },
      spacing: { sectionGap: 12, elementGap: 6, padding: 20 },
      premium: false,
    };
    const result = runDesignGuardian({
      data, template, theme: defaultTheme, layout,
      careerStage: analysis.careerStage,
      contentDensity: analysis.contentDensity,
    });
    design = result.score.overall;
  } catch { /* fallback to 75 */ }

  const jobMatchScore = jobMatch?.score ?? null;

  const scores = [ats, content, design];
  if (jobMatchScore !== null) scores.push(jobMatchScore);
  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  return { ats, content, design, jobMatch: jobMatchScore, overall };
}
