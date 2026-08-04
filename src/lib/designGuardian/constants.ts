export const A4_WIDTH_PT = 595.28;
export const A4_HEIGHT_PT = 841.89;
export const DEFAULT_PADDING = 30;
export const USABLE_HEIGHT = A4_HEIGHT_PT - DEFAULT_PADDING * 2;
export const USABLE_WIDTH = A4_WIDTH_PT - DEFAULT_PADDING * 2;

export const SIDEBAR_WIDTH_RATIO = 0.35;
export const SIDEBAR_PADDING = 18;

export const MIN_BODY_FONT_SIZE = 7;
export const MAX_BODY_FONT_SIZE = 12;
export const SAFE_BODY_FONT_SIZE = 8.5;
export const MIN_HEADING_FONT_SIZE = 10;
export const IDEAL_HEADING_FONT_SIZE = 13;

export const MIN_FONT_SCALE = 0.75;
export const MAX_FONT_SCALE = 1.2;
export const SAFE_MIN_FONT_SCALE = 0.85;

export const MIN_SPACING_SCALE = 0.6;
export const MAX_SPACING_SCALE = 1.4;

export const SECTION_HEIGHTS: Record<string, number> = {
  personal: 50,
  experience: 120,
  education: 60,
  skills: 40,
  projects: 80,
  languages: 25,
  certifications: 30,
  awards: 30,
  publications: 30,
  references: 25,
  summary: 40,
};

export const BULLET_HEIGHT = 12;
export const SECTION_TITLE_HEIGHT = 20;
export const SECTION_GAP_BASE = 14;

export const IDEAL_PAGES: Record<string, [number, number]> = {
  "entry-level": [1, 1],
  "mid-level": [1, 2],
  senior: [1, 2],
  academic: [2, 4],
};

export const MAX_RECOMMENDED_BULLETS_PER_JOB = 6;
export const IDEAL_BULLET_LENGTH_MIN = 30;
export const IDEAL_BULLET_LENGTH_MAX = 150;
export const MAX_BULLET_LENGTH = 200;
export const IDEAL_SKILL_COUNT_MIN = 5;
export const IDEAL_SKILL_COUNT_MAX = 25;
export const MAX_SKILL_COUNT = 40;
export const IDEAL_SUMMARY_LENGTH_MIN = 80;
export const IDEAL_SUMMARY_LENGTH_MAX = 400;

export const EMPTY_SPACE_THRESHOLD = 0.25;
export const DENSE_CONTENT_THRESHOLD = 0.85;

export const ACTION_VERBS = [
  "Developed", "Built", "Led", "Created", "Implemented", "Managed", "Designed",
  "Improved", "Increased", "Reduced", "Achieved", "Delivered", "Launched",
  "Established", "Optimized", "Streamlined", "Coordinated", "Oversaw",
  "Mentored", "Analyzed", "Researched", "Automated", "Integrated",
  "Deployed", "Maintained", "Debugged", "Tested", "Presented", "Facilitated",
  "Planned", "Spearheaded", "Championed", "Transformed", "Accelerated",
  "Generated", "Produced", "Constructed", "Programmed", "Engineered",
  "Supervised", "Evaluated", "Assessed", "Reviewed", "Inspected",
  "Adapted", "Modified", "Refined", "Enhanced", "Upgraded", "Resolved",
  "Directed", "Governed", "Piloted", "Strategized", "Devised", "Formulated",
];

export const ATS_RISKY_ELEMENTS = [
  "skill bars", "proficiency bars", "visual ratings",
  "icons", "graphics", "images", "logos",
  "text boxes", "callout boxes",
  "multi-column headers", "sidebars",
];

export const SECTION_NAMES: Record<string, string> = {
  personal: "Personal Information",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  languages: "Languages",
  certifications: "Certifications",
  awards: "Awards",
  publications: "Publications",
  references: "References",
  summary: "Professional Summary",
};
