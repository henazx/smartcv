"use client";

import { create } from "zustand";
import { CVData, CVTemplate, CVTheme, LayoutConfig, CVState, CVType, ApplicationGoal, CVVersion, CVProfile, SectionId, FontChoice } from "@/types";
import { templates } from "@/lib/templates";
import { themes } from "@/lib/themes";
import { computeProfile } from "@/lib/cvProfile";

const defaultPersonal = {
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  address: "",
  summary: "",
  photoUrl: null,
  photoSize: 60,
  photoPosition: "center" as const,
  linkedIn: "",
  github: "",
  website: "",
};

const defaultCVData: CVData = {
  personal: { ...defaultPersonal },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  awards: [],
  publications: [],
  references: [],
  volunteer: [],
  courses: [],
  includeReferences: false,
  showAvailableUponRequest: true,
  activeSections: ["summary", "experience", "education", "skills", "languages"] as SectionId[],
};

const defaultProfile: CVProfile = {
  cvType: null, applicationGoal: null, targetJobTitle: "", targetIndustry: "",
  careerStage: "entry-level", experienceYears: 0, preferredStyle: "modern",
  atsPriority: "medium", recommendedTemplate: "classic-professional",
  recommendedSections: ["summary", "experience", "education", "skills"],
  recommendedSectionOrder: ["summary", "experience", "education", "skills"],
  recommendedSkills: [], roleKeywords: [],
};

interface CVStore extends CVState {
  setData: (data: Partial<CVData>) => void;
  setPersonal: (personal: Partial<CVData["personal"]>) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<CVData["experiences"][0]>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<CVData["education"][0]>) => void;
  removeEducation: (id: string) => void;
  addSkill: (name: string, proficiency?: CVData["skills"][0]["proficiency"], category?: string) => void;
  removeSkill: (id: string) => void;
  updateSkill: (id: string, data: Partial<CVData["skills"][0]>) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, data: Partial<CVData["languages"][0]>) => void;
  removeLanguage: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<CVData["certifications"][0]>) => void;
  removeCertification: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, data: Partial<CVData["projects"][0]>) => void;
  removeProject: (id: string) => void;
  addAward: () => void;
  updateAward: (id: string, data: Partial<CVData["awards"][0]>) => void;
  removeAward: (id: string) => void;
  addPublication: () => void;
  updatePublication: (id: string, data: Partial<CVData["publications"][0]>) => void;
  removePublication: (id: string) => void;
  addReference: () => void;
  updateReference: (id: string, data: Partial<CVData["references"][0]>) => void;
  removeReference: (id: string) => void;
  addVolunteer: () => void;
  updateVolunteer: (id: string, data: Partial<CVData["volunteer"][0]>) => void;
  removeVolunteer: (id: string) => void;
  addCourse: () => void;
  updateCourse: (id: string, data: Partial<CVData["courses"][0]>) => void;
  removeCourse: (id: string) => void;
  setIncludeReferences: (v: boolean) => void;
  setShowAvailableUponRequest: (v: boolean) => void;
  setActiveSections: (sections: SectionId[]) => void;
  addSection: (sectionId: SectionId) => void;
  removeSection: (sectionId: SectionId) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  setTemplate: (template: CVTemplate) => void;
  setTheme: (theme: CVTheme) => void;
  setLayoutOverride: (v: boolean) => void;
  setManualLayout: (layout: Partial<LayoutConfig>) => void;
  setManualSectionOrder: (order: string[]) => void;
  setIsPremium: (v: boolean) => void;
  setStep: (step: number) => void;
  setActiveSection: (section: SectionId | null) => void;
  setCvType: (cvType: CVType) => void;
  setApplicationGoal: (goal: ApplicationGoal) => void;
  setTargetJobTitle: (title: string) => void;
  setTargetIndustry: (industry: string) => void;
  setJobDescription: (jd: string) => void;
  setFontChoice: (font: FontChoice) => void;
  refreshProfile: () => void;
  undo: () => void;
  redo: () => void;
  hydrateFromStorage: () => void;
  saveToStorage: () => void;
  resetAll: () => void;
  saveVersion: (name: string) => void;
  loadVersion: (id: string) => void;
  deleteVersion: (id: string) => void;
  duplicateVersion: (id: string) => void;
  getVersions: () => CVVersion[];
  exportCV: () => string;
  importCV: (json: string) => boolean;
  downloadBackup: () => void;
  importBackup: (file: File) => void;
  applyBulletSuggestion: (experienceId: string, bulletIndex: number, improved: string) => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Debounced localStorage save — batches rapid mutations into a single write
let _saveTimer: ReturnType<typeof setTimeout> | null = null;
function debouncedSave(get: () => CVStore) {
  if (_saveTimer) clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    try {
      const { data, template, theme, isPremium, cvType, applicationGoal, targetJobTitle, targetIndustry, jobDescription, fontChoice } = get();
      localStorage.setItem("smartcv-data-v2", JSON.stringify({ data, template, theme, isPremium, cvType, applicationGoal, targetJobTitle, targetIndustry, jobDescription, fontChoice }));
    } catch {}
  }, 300);
}

const MAX_HISTORY = 50;

function pushHistory(history: CVData[], historyIndex: number, data: CVData): { history: CVData[]; historyIndex: number } {
  const newHistory = history.slice(0, historyIndex + 1);
  // Deep clone to prevent reference sharing between history entries
  newHistory.push(JSON.parse(JSON.stringify(data)));
  if (newHistory.length > MAX_HISTORY) newHistory.shift();
  return { history: newHistory, historyIndex: newHistory.length - 1 };
}

export const useCVStore = create<CVStore>((set, get) => ({
  data: defaultCVData,
  template: templates[0],
  theme: themes[0],
  fontChoice: "helvetica" as FontChoice,
  layoutOverride: false,
  manualLayout: {},
  manualSectionOrder: [],
  isPremium: false,
  step: 0,
  activeSection: null,
  cvType: null,
  applicationGoal: null,
  targetJobTitle: "",
  targetIndustry: "",
  versions: [],
  activeVersionId: null,
  profile: defaultProfile,
  jobDescription: "",
  history: [],
  historyIndex: -1,

  setData: (data) => set((state) => {
    const merged = { ...state.data, ...data };
    return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
  }),

  setPersonal: (personal) =>
    set((state) => {
      const merged = { ...state.data, personal: { ...state.data.personal, ...personal } };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  addExperience: () =>
    set((state) => {
      const merged = {
        ...state.data,
        experiences: [
          ...state.data.experiences,
          { id: generateId(), company: "", role: "", startDate: "", endDate: "", current: false, bullets: [""] },
        ],
      };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  updateExperience: (id, data) =>
    set((state) => {
      const merged = { ...state.data, experiences: state.data.experiences.map((e) => (e.id === id ? { ...e, ...data } : e)) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  removeExperience: (id) =>
    set((state) => {
      const merged = { ...state.data, experiences: state.data.experiences.filter((e) => e.id !== id) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  addEducation: () =>
    set((state) => {
      const merged = {
        ...state.data,
        education: [
          ...state.data.education,
          { id: generateId(), institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" },
        ],
      };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  updateEducation: (id, data) =>
    set((state) => {
      const merged = { ...state.data, education: state.data.education.map((e) => (e.id === id ? { ...e, ...data } : e)) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  removeEducation: (id) =>
    set((state) => {
      const merged = { ...state.data, education: state.data.education.filter((e) => e.id !== id) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  addSkill: (name, proficiency = null, category = "General") =>
    set((state) => {
      const merged = { ...state.data, skills: [...state.data.skills, { id: generateId(), name, proficiency, category }] };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  removeSkill: (id) =>
    set((state) => {
      const merged = { ...state.data, skills: state.data.skills.filter((s) => s.id !== id) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  updateSkill: (id, data) =>
    set((state) => {
      const merged = { ...state.data, skills: state.data.skills.map((s) => (s.id === id ? { ...s, ...data } : s)) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  addLanguage: () =>
    set((state) => {
      const merged = {
        ...state.data,
        languages: [...state.data.languages, { id: generateId(), name: "", proficiency: "conversational" as const }],
      };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  updateLanguage: (id, data) =>
    set((state) => {
      const merged = { ...state.data, languages: state.data.languages.map((l) => (l.id === id ? { ...l, ...data } : l)) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  removeLanguage: (id) =>
    set((state) => {
      const merged = { ...state.data, languages: state.data.languages.filter((l) => l.id !== id) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  addCertification: () =>
    set((state) => {
      const merged = {
        ...state.data,
        certifications: [...state.data.certifications, { id: generateId(), name: "", issuer: "", date: "" }],
      };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  updateCertification: (id, data) =>
    set((state) => {
      const merged = { ...state.data, certifications: state.data.certifications.map((c) => (c.id === id ? { ...c, ...data } : c)) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  removeCertification: (id) =>
    set((state) => {
      const merged = { ...state.data, certifications: state.data.certifications.filter((c) => c.id !== id) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  addProject: () =>
    set((state) => {
      const merged = {
        ...state.data,
        projects: [...state.data.projects, { id: generateId(), name: "", description: "", url: "", technologies: [], bullets: [""] }],
      };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  updateProject: (id, data) =>
    set((state) => {
      const merged = { ...state.data, projects: state.data.projects.map((p) => (p.id === id ? { ...p, ...data } : p)) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  removeProject: (id) =>
    set((state) => {
      const merged = { ...state.data, projects: state.data.projects.filter((p) => p.id !== id) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  addAward: () =>
    set((state) => {
      const merged = {
        ...state.data,
        awards: [...state.data.awards, { id: generateId(), name: "", issuer: "", date: "", description: "" }],
      };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  updateAward: (id, data) =>
    set((state) => {
      const merged = { ...state.data, awards: state.data.awards.map((a) => (a.id === id ? { ...a, ...data } : a)) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  removeAward: (id) =>
    set((state) => {
      const merged = { ...state.data, awards: state.data.awards.filter((a) => a.id !== id) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  addPublication: () =>
    set((state) => {
      const merged = {
        ...state.data,
        publications: [...state.data.publications, { id: generateId(), title: "", journal: "", date: "", url: "" }],
      };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  updatePublication: (id, data) =>
    set((state) => {
      const merged = { ...state.data, publications: state.data.publications.map((p) => (p.id === id ? { ...p, ...data } : p)) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  removePublication: (id) =>
    set((state) => {
      const merged = { ...state.data, publications: state.data.publications.filter((p) => p.id !== id) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  addReference: () =>
    set((state) => {
      const merged = {
        ...state.data,
        references: [...state.data.references, { id: generateId(), name: "", title: "", email: "", phone: "" }],
      };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  updateReference: (id, data) =>
    set((state) => {
      const merged = { ...state.data, references: state.data.references.map((r) => (r.id === id ? { ...r, ...data } : r)) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  removeReference: (id) =>
    set((state) => {
      const merged = { ...state.data, references: state.data.references.filter((r) => r.id !== id) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  addVolunteer: () =>
    set((state) => {
      const merged = {
        ...state.data,
        volunteer: [...state.data.volunteer, { id: generateId(), organization: "", role: "", startDate: "", endDate: "", description: "" }],
      };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  updateVolunteer: (id, data) =>
    set((state) => {
      const merged = { ...state.data, volunteer: state.data.volunteer.map((v) => (v.id === id ? { ...v, ...data } : v)) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  removeVolunteer: (id) =>
    set((state) => {
      const merged = { ...state.data, volunteer: state.data.volunteer.filter((v) => v.id !== id) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  addCourse: () =>
    set((state) => {
      const merged = {
        ...state.data,
        courses: [...state.data.courses, { id: generateId(), name: "", provider: "", date: "", description: "" }],
      };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  updateCourse: (id, data) =>
    set((state) => {
      const merged = { ...state.data, courses: state.data.courses.map((c) => (c.id === id ? { ...c, ...data } : c)) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  removeCourse: (id) =>
    set((state) => {
      const merged = { ...state.data, courses: state.data.courses.filter((c) => c.id !== id) };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  setIncludeReferences: (v) => set((state) => {
    const merged = { ...state.data, includeReferences: v };
    return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
  }),
  setShowAvailableUponRequest: (v) => set((state) => {
    const merged = { ...state.data, showAvailableUponRequest: v };
    return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
  }),
  setActiveSections: (sections) => set((state) => {
    const merged = { ...state.data, activeSections: sections };
    return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
  }),

  addSection: (sectionId) => set((state) => {
    if (state.data.activeSections.includes(sectionId)) return {};
    const merged = { ...state.data, activeSections: [...state.data.activeSections, sectionId] };
    return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
  }),

  removeSection: (sectionId) => set((state) => {
    const merged = { ...state.data, activeSections: state.data.activeSections.filter((s) => s !== sectionId) };
    return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
  }),

  reorderSections: (fromIndex, toIndex) => set((state) => {
    const sections = [...state.data.activeSections];
    const [moved] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, moved);
    const merged = { ...state.data, activeSections: sections };
    return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
  }),

  setTemplate: (template) => {
    set({ template });
    get().saveToStorage();
  },
  setTheme: (theme) => {
    set({ theme });
    get().saveToStorage();
  },
  setLayoutOverride: (v) => set({ layoutOverride: v }),
  setManualLayout: (layout) => set((state) => ({ manualLayout: { ...state.manualLayout, ...layout } })),
  setManualSectionOrder: (order) => set({ manualSectionOrder: order }),
  setIsPremium: (v) => set({ isPremium: v }),
  setStep: (step) => set({ step }),
  setActiveSection: (activeSection) => set({ activeSection }),

  setTargetJobTitle: (targetJobTitle) => set((state) => {
    const { cvType, applicationGoal, targetIndustry, data } = state;
    return {
      targetJobTitle,
      profile: computeProfile(cvType, applicationGoal, targetJobTitle, targetIndustry, data),
    };
  }),
  setTargetIndustry: (targetIndustry) => set((state) => {
    const { cvType, applicationGoal, targetJobTitle, data } = state;
    return {
      targetIndustry,
      profile: computeProfile(cvType, applicationGoal, targetJobTitle, targetIndustry, data),
    };
  }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  setFontChoice: (fontChoice) => set({ fontChoice }),

  refreshProfile: () => set((state) => ({
    profile: computeProfile(state.cvType, state.applicationGoal, state.targetJobTitle, state.targetIndustry, state.data),
  })),

  setCvType: (cvType) => set((state) => {
    const { applicationGoal, targetJobTitle, targetIndustry, data } = state;
    return {
      cvType,
      profile: computeProfile(cvType, applicationGoal, targetJobTitle, targetIndustry, data),
    };
  }),
  setApplicationGoal: (applicationGoal) => set((state) => {
    const { cvType, targetJobTitle, targetIndustry, data } = state;
    return {
      applicationGoal,
      profile: computeProfile(cvType, applicationGoal, targetJobTitle, targetIndustry, data),
    };
  }),

  saveVersion: (name) => {
    const { data, template, theme, versions } = get();
    const newVersion: CVVersion = {
      id: generateId(),
      name,
      data: JSON.parse(JSON.stringify(data)),
      template: { ...template },
      theme: { ...theme },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set({ versions: [...versions, newVersion], activeVersionId: newVersion.id });
    try { localStorage.setItem("smartcv-versions", JSON.stringify([...versions, newVersion])); } catch {}
  },

  loadVersion: (id) => {
    const { versions } = get();
    const version = versions.find((v) => v.id === id);
    if (version) {
      const restoredData = { ...defaultCVData, ...version.data, personal: { ...defaultPersonal, ...(version.data.personal || {}) } };
      set({
        data: restoredData,
        template: version.template,
        theme: version.theme,
        activeVersionId: id,
      });
      debouncedSave(get);
    }
  },

  deleteVersion: (id) => {
    const { versions, activeVersionId } = get();
    const filtered = versions.filter((v) => v.id !== id);
    set({
      versions: filtered,
      activeVersionId: activeVersionId === id ? null : activeVersionId,
    });
    try { localStorage.setItem("smartcv-versions", JSON.stringify(filtered)); } catch {}
  },

  duplicateVersion: (id) => {
    const { versions } = get();
    const version = versions.find((v) => v.id === id);
    if (version) {
      const duplicate: CVVersion = {
        ...version,
        id: generateId(),
        name: `${version.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [...versions, duplicate];
      set({ versions: updated });
      try { localStorage.setItem("smartcv-versions", JSON.stringify(updated)); } catch {}
    }
  },

  getVersions: () => get().versions,

  exportCV: () => {
    const { data, template, theme, fontChoice, cvType, applicationGoal, targetJobTitle, targetIndustry, jobDescription } = get();
    return JSON.stringify({
      "_smartcv_version": 1,
      data,
      template,
      theme,
      fontChoice,
      activeSections: data.activeSections,
      cvType,
      applicationGoal,
      targetJobTitle,
      targetIndustry,
      jobDescription,
    });
  },

  importCV: (json: string) => {
    try {
      const parsed = JSON.parse(json);
      const hasData = parsed.data || parsed.template || parsed.theme;
      if (!hasData) return false;

      const mergedData: CVData = {
        ...defaultCVData,
        ...(parsed.data || {}),
        personal: { ...defaultPersonal, ...(parsed.data?.personal || {}) },
        volunteer: parsed.data?.volunteer || [],
        courses: parsed.data?.courses || [],
        activeSections: parsed.data?.activeSections || ["summary", "experience", "education", "skills", "languages"],
      };
      const cvType = parsed.cvType || null;
      const applicationGoal = parsed.applicationGoal || null;
      const targetJobTitle = parsed.targetJobTitle || "";
      const targetIndustry = parsed.targetIndustry || "";
      set({
        data: mergedData,
        template: parsed.template || templates[0],
        theme: parsed.theme || themes[0],
        fontChoice: parsed.fontChoice || "helvetica",
        cvType,
        applicationGoal,
        targetJobTitle,
        targetIndustry,
        jobDescription: parsed.jobDescription || "",
        profile: computeProfile(cvType, applicationGoal, targetJobTitle, targetIndustry, mergedData),
      });
      debouncedSave(get);
      return true;
    } catch {
      return false;
    }
  },

  downloadBackup: () => {
    const json = get().exportCV();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `smartcv-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importBackup: (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const success = get().importCV(text);
      if (success) {
        window.alert("Backup imported successfully!");
      } else {
        window.alert("Failed to import backup. The file may be corrupted or invalid.");
      }
    };
    reader.onerror = () => {
      window.alert("Failed to read the backup file.");
    };
    reader.readAsText(file);
  },

  applyBulletSuggestion: (experienceId, bulletIndex, improved) =>
    set((state) => {
      const experiences = state.data.experiences.map((e) => {
        if (e.id !== experienceId) return e;
        const bullets = [...e.bullets];
        bullets[bulletIndex] = improved;
        return { ...e, bullets };
      });
      const merged = { ...state.data, experiences };
      return { data: merged, ...pushHistory(state.history, state.historyIndex, merged) };
    }),

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevData = history[historyIndex - 1];
      set({ data: { ...prevData }, historyIndex: historyIndex - 1 });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextData = history[historyIndex + 1];
      set({ data: { ...nextData }, historyIndex: historyIndex + 1 });
    }
  },

  hydrateFromStorage: () => {
    try {
      const saved = localStorage.getItem("smartcv-data-v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        const cvType = parsed.cvType || null;
        const applicationGoal = parsed.applicationGoal || null;
        const targetJobTitle = parsed.targetJobTitle || "";
        const targetIndustry = parsed.targetIndustry || "";
        const data = parsed.data || {};
        const mergedData: CVData = {
          ...defaultCVData,
          ...data,
          personal: { ...defaultPersonal, ...(data.personal || {}) },
          volunteer: data.volunteer || [],
          courses: data.courses || [],
          activeSections: data.activeSections || ["summary", "experience", "education", "skills", "languages"],
        };
        set({
          data: mergedData,
          template: parsed.template || templates[0],
          theme: parsed.theme || themes[0],
          fontChoice: parsed.fontChoice || "helvetica",
          isPremium: parsed.isPremium || false,
          cvType,
          applicationGoal,
          targetJobTitle,
          targetIndustry,
          jobDescription: parsed.jobDescription || "",
          profile: computeProfile(cvType, applicationGoal, targetJobTitle, targetIndustry, mergedData),
        });
      }
      const versionsSaved = localStorage.getItem("smartcv-versions");
      if (versionsSaved) {
        set({ versions: JSON.parse(versionsSaved) });
      }
    } catch (e) {
      console.warn("Failed to load saved data, resetting to defaults:", e);
    }
  },

  saveToStorage: () => {
    try {
      const { data, template, theme, isPremium, cvType, applicationGoal, targetJobTitle, targetIndustry, jobDescription, fontChoice } = get();
      localStorage.setItem("smartcv-data-v2", JSON.stringify({ data, template, theme, isPremium, cvType, applicationGoal, targetJobTitle, targetIndustry, jobDescription, fontChoice }));
    } catch {}
  },

  resetAll: () => {
    try {
      localStorage.removeItem("smartcv-data-v2");
      localStorage.removeItem("smartcv-versions");
      localStorage.removeItem("smartcv-premium");
    } catch {}
    set({
      data: { ...defaultCVData },
      template: templates[0],
      theme: themes[0],
      fontChoice: "helvetica" as FontChoice,
      layoutOverride: false,
      manualLayout: {},
      manualSectionOrder: [],
      isPremium: false,
      step: 0,
      activeSection: null,
      cvType: null,
      applicationGoal: null,
      targetJobTitle: "",
      targetIndustry: "",
      versions: [],
      activeVersionId: null,
      profile: { ...defaultProfile },
      jobDescription: "",
      history: [],
      historyIndex: -1,
    });
  },
}));
