// =============================================================================
// SmartCV Type System v2 - Professional CV Workspace
// =============================================================================

// --- CV Data Model ---

export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  photoUrl: string | null;
  photoSize: number;
  photoPosition: "left" | "center" | "right";
  linkedIn: string;
  github: string;
  website: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Skill {
  id: string;
  name: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert" | null;
  category: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "basic" | "conversational" | "fluent" | "native";
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
  bullets: string[];
}

export interface Award {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Publication {
  id: string;
  title: string;
  journal: string;
  date: string;
  url: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
}

export interface VolunteerExperience {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Course {
  id: string;
  name: string;
  provider: string;
  date: string;
  description: string;
}

export interface CVData {
  personal: PersonalInfo;
  experiences: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  awards: Award[];
  publications: Publication[];
  references: Reference[];
  volunteer: VolunteerExperience[];
  courses: Course[];
  includeReferences: boolean;
  showAvailableUponRequest: boolean;
  activeSections: SectionId[];
}

// --- Section Configuration ---

export type SectionId =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "languages"
  | "certifications"
  | "awards"
  | "publications"
  | "references"
  | "volunteer"
  | "courses";

export const CORE_SECTIONS: SectionId[] = ["summary", "experience", "education", "skills"];
export const OPTIONAL_SECTIONS: SectionId[] = ["projects", "languages", "certifications", "awards", "publications", "references", "volunteer", "courses"];

export interface SectionConfig {
  id: SectionId;
  label: string;
  icon: string;
  core: boolean;
  description: string;
}

export const SECTION_CONFIGS: Record<SectionId, SectionConfig> = {
  summary: { id: "summary", label: "Professional Summary", icon: "S", core: true, description: "Brief overview of your professional background" },
  experience: { id: "experience", label: "Work Experience", icon: "E", core: true, description: "Your work history and achievements" },
  education: { id: "education", label: "Education", icon: "D", core: true, description: "Academic background and qualifications" },
  skills: { id: "skills", label: "Skills", icon: "K", core: true, description: "Technical and soft skills" },
  projects: { id: "projects", label: "Projects", icon: "J", core: false, description: "Notable projects and portfolio pieces" },
  languages: { id: "languages", label: "Languages", icon: "L", core: false, description: "Language proficiencies" },
  certifications: { id: "certifications", label: "Certifications", icon: "C", core: false, description: "Professional certifications and licenses" },
  awards: { id: "awards", label: "Awards", icon: "A", core: false, description: "Awards and honors received" },
  publications: { id: "publications", label: "Publications", icon: "U", core: false, description: "Published works and research" },
  references: { id: "references", label: "References", icon: "R", core: false, description: "Professional references" },
  volunteer: { id: "volunteer", label: "Volunteer Experience", icon: "V", core: false, description: "Volunteer work and community involvement" },
  courses: { id: "courses", label: "Courses & Training", icon: "T", core: false, description: "Relevant courses and professional development" },
};

// --- CV Purpose (separated from visual style) ---

export type CVType =
  | "first-job"
  | "internship"
  | "scholarship"
  | "graduate-job"
  | "experienced"
  | "academic"
  | "tech-developer"
  | "creative-design"
  | "international"
  | "government"
  | "executive"
  | "research";

export type ApplicationGoal =
  | "job"
  | "internship"
  | "scholarship"
  | "fellowship"
  | "graduate-program"
  | "remote-job"
  | "international-job";

// --- Visual Style (separate from CV type) ---

export type VisualStyle =
  | "professional"
  | "classic"
  | "modern"
  | "minimal"
  | "executive"
  | "compact"
  | "elegant"
  | "creative"
  | "editorial"
  | "technical"
  | "two-column"
  | "academic";

export type FontChoice =
  | "helvetica"
  | "times";

export interface FontOption {
  id: FontChoice;
  name: string;
  headingFamily: string;
  bodyFamily: string;
  cssFamily: string;
  category: "serif" | "sans-serif" | "modern";
}

export const FONT_OPTIONS: FontOption[] = [
  { id: "helvetica", name: "Helvetica", headingFamily: "Helvetica-Bold", bodyFamily: "Helvetica", cssFamily: "Arial, Helvetica, sans-serif", category: "sans-serif" },
  { id: "times", name: "Times New Roman", headingFamily: "Times-Bold", bodyFamily: "Times-Roman", cssFamily: "'Times New Roman', Times, serif", category: "serif" },
];

// --- Template System ---

export type TemplateCategory =
  | "classic"
  | "modern"
  | "minimal"
  | "executive"
  | "creative"
  | "technical"
  | "academic"
  | "ats";

export type LayoutType =
  | "single-column"
  | "two-column"
  | "sidebar-left"
  | "sidebar-right"
  | "timeline"
  | "editorial";

export type HeaderStyle =
  | "centered"
  | "left-aligned"
  | "full-width-bar"
  | "split"
  | "minimal"
  | "bold-block"
  | "editorial";

export type SectionStyle =
  | "underline"
  | "background-block"
  | "plain"
  | "boxed"
  | "bordered-left"
  | "numbered";

export type ExperienceStyle =
  | "standard"
  | "timeline"
  | "compact"
  | "detailed"
  | "card";

export type SkillsStyle =
  | "tags"
  | "bars"
  | "comma-list"
  | "grouped"
  | "two-column"
  | "proficiency-grid";

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  bestFor: string[];
  category: TemplateCategory;
  layoutType: LayoutType;
  headerStyle: HeaderStyle;
  sectionStyle: SectionStyle;
  experienceStyle: ExperienceStyle;
  skillsStyle: SkillsStyle;
  supportsPhoto: boolean;
  supportsSidebar: boolean;
  atsSafe: boolean;
  premium: boolean;
  visualStyles: VisualStyle[];
}

// --- Theme ---

export interface CVTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    muted: string;
    background: string;
    border: string;
    accent: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingWeight: number;
    bodySize: number;
    lineHeight: number;
  };
  spacing: {
    sectionGap: number;
    elementGap: number;
    padding: number;
  };
  premium: boolean;
}

// --- Layout Engine ---

export type CareerStage = "entry-level" | "mid-level" | "senior";
export type ContentDensity = "light" | "medium" | "heavy";

export interface ContentAnalysis {
  experienceYears: number;
  experienceEntryCount: number;
  hasLongSkillsList: boolean;
  hasProjects: boolean;
  hasPublications: boolean;
  hasAwards: boolean;
  careerStage: CareerStage;
  contentDensity: ContentDensity;
  totalCharCount: number;
  skillCategories: string[];
}

export interface SectionOrder {
  main: string[];
  sidebar: string[];
}

export interface LayoutConfig {
  sectionOrder: SectionOrder;
  fontScale: number;
  spacingScale: number;
  photoSize: number;
  sidebarWidth: number;
  atsMode: boolean;
}

// --- CV Profile (unified intelligence layer) ---

export interface CVProfile {
  cvType: CVType | null;
  applicationGoal: ApplicationGoal | null;
  targetJobTitle: string;
  targetIndustry: string;
  careerStage: CareerStage;
  experienceYears: number;
  preferredStyle: VisualStyle;
  atsPriority: "high" | "medium" | "low";
  recommendedTemplate: string;
  recommendedSections: string[];
  recommendedSectionOrder: string[];
  recommendedSkills: string[];
  roleKeywords: string[];
}

export interface RoleRecommendation {
  skills: string[];
  keywords: string[];
  sections: SectionId[];
  sectionOrder: string[];
  templateId: string;
  description: string;
}

// --- Scoring System ---

export interface CVHealthScore {
  overall: number;
  ats: number;
  quality: number;
  jobMatch: number | null;
  grade: "Excellent" | "Good" | "Needs Work" | "Poor";
}

export interface ScoreBreakdown {
  ats: number;
  content: number;
  design: number;
  jobMatch: number | null;
  overall: number;
}

// --- Content Assistance ---

export interface BulletSuggestion {
  original: string;
  improved: string;
  type: "impact" | "concise" | "professional" | "grammar" | "tailor";
  explanation: string;
}

export interface SummarySuggestion {
  type: "shorten" | "professionalize" | "tailor" | "improve";
  label: string;
  description: string;
}

// --- Smart Recommendations ---

export interface SmartRecommendation {
  id: string;
  type: "section" | "content" | "design" | "ats" | "skill" | "job-match";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action: string;
  targetSection?: SectionId;
  targetField?: string;
  autoFixable?: boolean;
}

// --- Job Match ---

export interface JobMatchResult {
  score: number;
  strongMatches: string[];
  weakMatches: string[];
  missing: string[];
  missingKeywords: string[];
  suggestions: string[];
  extractedSkills: string[];
  extractedKeywords: string[];
  hasJobDescription: boolean;
}

// --- Combined State ---

export interface CVVersion {
  id: string;
  name: string;
  data: CVData;
  template: CVTemplate;
  theme: CVTheme;
  createdAt: string;
  updatedAt: string;
}

export interface CVState {
  data: CVData;
  template: CVTemplate;
  theme: CVTheme;
  fontChoice: FontChoice;
  layoutOverride: boolean;
  manualLayout: Partial<LayoutConfig>;
  manualSectionOrder: string[];
  isPremium: boolean;
  step: number;
  activeSection: SectionId | null;
  cvType: CVType | null;
  applicationGoal: ApplicationGoal | null;
  targetJobTitle: string;
  targetIndustry: string;
  versions: CVVersion[];
  activeVersionId: string | null;
  profile: CVProfile;
  jobDescription: string;
  history: CVData[];
  historyIndex: number;
}
