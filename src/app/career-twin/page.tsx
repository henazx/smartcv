"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useCVStore } from "@/lib/store";
import { templates } from "@/lib/templates";
import { themes as allThemes } from "@/lib/themes";
import { computeLayout, analyzeContent } from "@/lib/layoutEngine";
import { estimatePageCount } from "@/lib/atsScorer";
import type { CVData, SectionId, FontChoice } from "@/types";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { suggestBulletImprovement, getIndustrySummaryTemplates, getIndustrySkills } from "@/lib/contentAssistant";
import { ROLE_DATABASE } from "@/lib/cvProfile";
import { FONT_OPTIONS } from "@/types";

type TwinSection = "overview" | "personal" | "experience" | "education" | "skills" | "extras" | "goals" | "jobs";

const SECTION_TABS: { id: TwinSection; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "\u25CB" },
  { id: "personal", label: "Personal", icon: "\u2022" },
  { id: "experience", label: "Experience", icon: "\u25A0" },
  { id: "education", label: "Education", icon: "\u25B2" },
  { id: "skills", label: "Skills", icon: "\u2713" },
  { id: "extras", label: "Extras", icon: "+" },
  { id: "goals", label: "Goals", icon: "\u2192" },
  { id: "jobs", label: "Jobs", icon: "\u2605" },
];

const ALL_SECTIONS: { id: SectionId; label: string; icon: string }[] = [  { id: "summary", label: "Summary", icon: "S" },
  { id: "experience", label: "Experience", icon: "E" },
  { id: "education", label: "Education", icon: "D" },
  { id: "skills", label: "Skills", icon: "K" },
  { id: "projects", label: "Projects", icon: "J" },
  { id: "languages", label: "Languages", icon: "L" },
  { id: "certifications", label: "Certifications", icon: "C" },
  { id: "awards", label: "Awards", icon: "A" },
  { id: "publications", label: "Publications", icon: "U" },
  { id: "volunteer", label: "Volunteer", icon: "V" },
  { id: "courses", label: "Courses", icon: "T" },
];

function headlineIdeas(role: string): string[] {  const r = role.trim();
  if (!r) return [];
  const title = r.charAt(0).toUpperCase() + r.slice(1);
  return [
    title,
    `Senior ${title}`,
    `${title} | 5+ Years of Experience`,
    `Experienced ${title} in Addis Ababa`,
  ];
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

type FieldType = "text" | "name" | "phone" | "email" | "url";

const FIELD_PATTERNS: Record<Exclude<FieldType, "text">, RegExp> = {
  name: /[^A-Za-z\s\-\'\.]/g,
  phone: /[^0-9]/g,
  email: /[^a-zA-Z0-9@\.\+\-_]/g,
  url: /[^a-zA-Z0-9\.\:\/\-\_\?&=%#@\+]/g,
};

function TextInput({ value, onChange, placeholder, multiline, type = "text", error }: { value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean; type?: FieldType; error?: string }) {
  const handleChange = (raw: string) => {
    if (type !== "text") {
      onChange(raw.replace(FIELD_PATTERNS[type], ""));
    } else {
      onChange(raw);
    }
  };
  const base = "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-gray-400";
  const borderCls = error ? " border-red-400" : " border-gray-200";
  if (multiline) {
    return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${base} resize-none ${borderCls}`} rows={3} />;
  }
  return (
    <div>
      <input
        type={type === "email" ? "email" : type === "url" ? "url" : type === "phone" ? "tel" : "text"}
        inputMode={type === "phone" ? "numeric" : undefined}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={type === "phone" ? (e) => { const allowed = ["Backspace", "Delete", "Tab", "Escape", "Enter", "Home", "End", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]; const isNum = e.key >= "0" && e.key <= "9"; if (!isNum && !allowed.includes(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) e.preventDefault(); } : undefined}
        placeholder={placeholder}
        className={`${base} ${borderCls}`}
      />
      {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PdfViewerWrapper({ children, ...props }: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Viewer, setViewer] = useState<React.ComponentType<any> | null>(null);
  useEffect(() => {
    import("@react-pdf/renderer").then((m) => setViewer(() => m.PDFViewer));
  }, []);
  if (!Viewer) return <div className="w-full h-full bg-gray-50 animate-pulse rounded-lg" />;
  return <Viewer {...props}>{children}</Viewer>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PdfDocumentLoader(props: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Doc, setDoc] = useState<React.ComponentType<any> | null>(null);
  useEffect(() => {
    import("@/components/pdf/CVDocument").then((m) => setDoc(() => m.CVDocument));
  }, []);
  if (!Doc) return null;
  return <Doc {...props} />;
}

export default function CareerTwinPage() {
  const {
    careerProfile, hydrateFromStorage,
    updateCareerPersonal,
    addCareerExperience, updateCareerExperience, removeCareerExperience,
    addCareerEducation, updateCareerEducation, removeCareerEducation,
    addCareerSkill, removeCareerSkill,
    addCareerLanguage, updateCareerLanguage, removeCareerLanguage,
    addCareerCertification, updateCareerCertification, removeCareerCertification,
    addCareerProject, updateCareerProject, removeCareerProject,
    setCareerInterests, setCareerTargetRoles, setCareerTargetIndustries, setCareerGoals,
    importCareerFromCV, populateFromCareerProfile, removeJobDescription, data,
    template, setTemplate, theme, setTheme, fontChoice,
    layoutOverride, manualLayout,
    resetAll, reorderSections, addSection, removeSection, setActiveSections, setFontChoice,
    createCVFromProfile, versions, deleteVersion, duplicateVersion, loadVersionIntoEditor,
} = useCVStore();

  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<TwinSection>("overview");
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [mounted, setMounted] = useState(false);
  const [showSectionManager, setShowSectionManager] = useState(false);
  const [bulletSuggestions, setBulletSuggestions] = useState<Record<string, string[]>>({});
  const [suggestingBullets, setSuggestingBullets] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generateStage, setGenerateStage] = useState("");
  const [showVersions, setShowVersions] = useState(false);

  useEffect(() => {
    hydrateFromStorage();
    setHydrated(true);
    setMounted(true);
  }, [hydrateFromStorage]);

  const cp = careerProfile;
  const hasData = cp.personal.fullName || cp.experiences.length > 0 || cp.skills.length > 0;
  const hasCvData = data.personal.fullName || data.experiences.length > 0 || data.skills.length > 0;

  // Compute preview data directly from career profile — no one-time copy needed
  const activeSections = useMemo(() => {
    const configured = data.activeSections && data.activeSections.length > 0 ? data.activeSections : (["summary", "experience", "education", "skills"] as SectionId[]);
    return Array.from(new Set(configured));
  }, [data.activeSections]);

  const previewData = useMemo<CVData>(() => {
    const on = (id: SectionId) => activeSections.includes(id);
    return {
      personal: {
        fullName: cp.personal.fullName,
        headline: cp.personal.headline,
        email: cp.personal.email,
        phone: cp.personal.phone,
        address: cp.personal.address,
        summary: on("summary") ? cp.personal.summary : "",
        photoUrl: cp.personal.photoUrl,
        photoSize: cp.personal.photoSize,
        photoPosition: cp.personal.photoPosition,
        linkedIn: cp.personal.linkedIn,
        github: cp.personal.github,
        website: cp.personal.website,
      },
      experiences: on("experience") ? cp.experiences.map((e) => ({ ...e })) : [],
      education: on("education") ? cp.education.map((e) => ({ ...e })) : [],
      skills: on("skills") ? cp.skills.map((s) => ({ ...s })) : [],
      languages: on("languages") ? cp.languages.map((l) => ({ ...l })) : [],
      certifications: on("certifications") ? cp.certifications.map((c) => ({ ...c })) : [],
      projects: on("projects") ? cp.projects.map((p) => ({ ...p })) : [],
      awards: on("awards") ? cp.awards.map((a) => ({ ...a })) : [],
      publications: on("publications") ? cp.publications.map((p) => ({ ...p })) : [],
      references: [],
      volunteer: on("volunteer") ? cp.volunteer.map((v) => ({ ...v })) : [],
      courses: on("courses") ? cp.courses.map((c) => ({ ...c })) : [],
      includeReferences: false,
      showAvailableUponRequest: true,
      activeSections,
    };
  }, [cp, activeSections]);

  // Also sync to CV data store so Export/Job Match can use it
  const populatedRef = useRef(false);
  useEffect(() => {
    if (hasData && hydrated && !populatedRef.current) {
      populateFromCareerProfile();
      populatedRef.current = true;
    }
  }, [hasData, hydrated, populateFromCareerProfile]);

  // Keep CV store activeSections in sync with Career Twin section manager
  const lastSectionSync = useRef<string | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    const key = activeSections.join(",");
    if (key !== lastSectionSync.current) {
      lastSectionSync.current = key;
      setActiveSections(activeSections);
    }
  }, [hydrated, activeSections, setActiveSections]);

  // CV Preview layout
  const autoLayout = useMemo(() => computeLayout(previewData, template), [previewData, template]);
  const finalLayout = layoutOverride ? { ...autoLayout, ...manualLayout } : autoLayout;
  const contentAnalysis = useMemo(() => analyzeContent(previewData), [previewData]);
  const pageCount = useMemo(() => estimatePageCount(previewData), [previewData]);

  const completeness = (() => {
    let filled = 0;
    let total = 0;
    if (cp.personal.fullName) filled++; total++;
    if (cp.personal.headline) filled++; total++;
    if (cp.personal.email) filled++; total++;
    if (cp.personal.summary) filled++; total++;
    if (cp.experiences.length > 0) filled++; total++;
    if (cp.education.length > 0) filled++; total++;
    if (cp.skills.length > 0) filled++; total++;
    return total > 0 ? Math.round((filled / total) * 100) : 0;
  })();

  if (!hydrated) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>;
  }

  const roleKey = cp.targetRoles[0]?.toLowerCase().trim() || "";
  const roleRec = roleKey ? ROLE_DATABASE[roleKey] : null;
  const industrySuggestions = cp.targetIndustries[0] ? getIndustrySkills(cp.targetIndustries[0]) : [];

  const handlePhotoUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file (JPG or PNG).");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setPhotoError("Image is too large. Please choose an image under 4MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateCareerPersonal({ photoUrl: reader.result as string });
      setPhotoError("");
    };
    reader.onerror = () => setPhotoError("Failed to read the image. Please try again.");
    reader.readAsDataURL(file);
  };

  const handleGenerateCV = () => {
    const targetRole = cp.targetRoles[0]?.trim() || cp.personal.headline.trim();
    setGenerating(true);
    setGenerateStage("Analyzing your profile and tailoring content to your target role...");
    setTimeout(() => {
      const version = createCVFromProfile("Generated CV", {
        targetRole: targetRole || undefined,
        targetIndustry: cp.targetIndustries[0],
        autoImproveBullets: true,
        maxBulletsPerRole: 5,
      });
      setGenerating(false);
      if (version) {
        setActiveTab("overview");
      }
    }, 350);
  };

  const runBulletSuggestions = async (expId: string, index: number, text: string) => {
    if (!text.trim()) return;
    setSuggestingBullets(true);
    const jobDesc = cp.jobDescriptions[0]?.description || "";
    const results = suggestBulletImprovement(text, jobDesc);
    setBulletSuggestions((prev) => ({ ...prev, [`${expId}-${index}`]: results.map((r) => r.improved) }));
    setSuggestingBullets(false);
  };

  const applySuggestedBullet = (expId: string, index: number, improved: string) => {
    const bullets = [...cp.experiences];
    const target = bullets.find((e) => e.id === expId);
    if (!target) return;
    const newBullets = [...target.bullets];
    newBullets[index] = improved;
    updateCareerExperience(expId, { bullets: newBullets });
    setBulletSuggestions((prev) => {
      const next = { ...prev };
      delete next[`${expId}-${index}`];
      return next;
    });
  };

  const reorderActiveSection = (fromIndex: number, toIndex: number) => {
    reorderSections(fromIndex, toIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 animate-fade-in">
      {/* Nav */}
      <nav className="border-b border-gray-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-bold text-gray-900">SmartCV</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/job-match" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Job Match</Link>
            <Link href="/cover-letter" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Cover Letter</Link>
            <Link href="/applications" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Applications</Link>
            <Link href="/interview" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Interview</Link>
            <Link href="/readiness" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Readiness</Link>
            <Link href="/export" className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg text-sm font-semibold hover:from-gray-800 hover:to-gray-600 transition-all shadow-sm">Export PDF</Link>
            <button
              onClick={() => setShowVersions(true)}
              className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
              title="CV versions"
            >
              Versions
            </button>
            <button
              onClick={() => setShowResetModal(true)}
              className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
              title="Start fresh"
            >
              New
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">Career Twin</h1>
          <p className="text-sm text-gray-500">Edit your profile on the left. See your CV update live on the right.</p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr_400px] gap-6">
          {/* Sidebar tabs + Template/Theme */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-2 sticky top-20 shadow-sm">
              {SECTION_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? "bg-gray-900 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}

              {/* Completeness */}
              <div className="mt-4 px-3 py-3 bg-gray-50 rounded-xl">
                <div className="text-xs font-semibold text-gray-600 mb-2">Profile Strength</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-gray-700 to-gray-900 rounded-full transition-all" style={{ width: `${completeness}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-900">{completeness}%</span>
                </div>
              </div>

              {/* Import from CV */}
              {hasCvData && !hasData && (
                <button
                  onClick={() => setShowImportModal(true)}
                  className="mt-3 w-full px-3 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-all text-left"
                >
                  Import from existing CV
                </button>
              )}

              {/* Template Selector */}
              <div className="mt-4 px-3 py-3 bg-gray-50 rounded-xl">
                <div className="text-xs font-semibold text-gray-600 mb-2">Template</div>
                <select
                  value={template.id}
                  onChange={(e) => {
                    const t = templates.find((t) => t.id === e.target.value);
                    if (t) setTemplate(t);
                  }}
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Theme Selector */}
              <div className="mt-3 px-3 py-3 bg-gray-50 rounded-xl">
                <div className="text-xs font-semibold text-gray-600 mb-2">Theme</div>
                <div className="grid grid-cols-5 gap-1.5">
                  {allThemes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t)}
                      className={`w-full aspect-square rounded-lg border-2 transition-all ${theme.id === t.id ? "border-gray-900 shadow-sm" : "border-transparent hover:border-gray-300"}`}
                      style={{ background: t.colors.primary }}
                      title={t.name}
                    />
                  ))}
                </div>
                <div className="text-[10px] text-gray-400 mt-1.5">{theme.name}</div>
              </div>

              {/* Font Selector */}
              <div className="mt-3 px-3 py-3 bg-gray-50 rounded-xl">
                <div className="text-xs font-semibold text-gray-600 mb-2">Font</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {FONT_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFontChoice(f.id as FontChoice)}
                      className={`px-2 py-1.5 rounded-lg text-xs transition-all ${fontChoice === f.id ? "bg-gray-900 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"}`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Manager */}
              <div className="mt-3 px-3 py-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-gray-600">CV Sections</div>
                  <button onClick={() => setShowSectionManager(!showSectionManager)} className="text-[10px] text-gray-500 hover:text-gray-900 font-semibold">
                    {showSectionManager ? "Hide" : "Manage"}
                  </button>
                </div>
                {showSectionManager ? (
                  <div className="space-y-1">
                    <div className="text-[10px] font-semibold text-gray-500 mb-1">In your CV (drag order)</div>
                    {activeSections.map((secId, idx) => {
                      const sec = ALL_SECTIONS.find((s) => s.id === secId);
                      return (
                        <div key={secId} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white border border-gray-200">
                          <button
                            onClick={() => removeSection(secId)}
                            className="w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold bg-gray-900 text-white"
                            title="Remove from CV"
                          >
                            ✓
                          </button>
                          <span className="flex-1 text-[11px] font-medium text-gray-800">{sec?.label || secId}</span>
                          <button
                            onClick={() => idx > 0 && reorderActiveSection(idx, idx - 1)}
                            disabled={idx === 0}
                            className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-[10px] px-0.5"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => idx < activeSections.length - 1 && reorderActiveSection(idx, idx + 1)}
                            disabled={idx === activeSections.length - 1}
                            className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-[10px] px-0.5"
                            title="Move down"
                          >
                            ↓
                          </button>
                        </div>
                      );
                    })}
                    {activeSections.length === 0 && <p className="text-[10px] text-gray-400 px-1">No sections selected.</p>}
                    <div className="text-[10px] font-semibold text-gray-500 mt-2 mb-1">Available to add</div>
                    <div className="flex flex-wrap gap-1">
                      {ALL_SECTIONS.filter((s) => !activeSections.includes(s.id)).map((sec) => (
                        <button
                          key={sec.id}
                          onClick={() => addSection(sec.id)}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] hover:bg-blue-100 transition-all"
                        >
                          + {sec.label}
                        </button>
                      ))}
                    </div>
                    {ALL_SECTIONS.every((s) => activeSections.includes(s.id)) && (
                      <p className="text-[10px] text-gray-400 mt-1.5">All sections are in your CV.</p>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-400">{activeSections.length} sections shown</p>
                )}
              </div>

              {/* Start Fresh */}
              {hasData && (
                <button onClick={() => setShowResetModal(true)} className="mt-3 w-full px-3 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition-all text-left">
                  Start Fresh
                </button>
              )}
            </div>
          </div>

          {/* Main content - Profile Editor */}
          <div className="lg:col-span-1 space-y-4">
            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Your Career Twin</h2>
                  {!hasData ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl text-gray-400">{"\u2601"}</span>
                      </div>
                      <p className="text-gray-500 mb-4 text-sm">Your Career Twin is empty. Start by filling in your profile.</p>
                      <div className="flex gap-3 justify-center">
                        <button onClick={() => setActiveTab("personal")} className="px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all">
                          Start Filling Profile
                        </button>
                        {hasCvData && (
                          <button onClick={() => setShowImportModal(true)} className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
                            Import from CV
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cp.personal.fullName && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-bold text-gray-700">
                            {cp.personal.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{cp.personal.fullName}</div>
                            <div className="text-xs text-gray-500">{cp.personal.headline || "No headline yet"}</div>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-gray-50 rounded-xl text-center">
                          <div className="text-lg font-bold text-gray-900">{cp.experiences.length}</div>
                          <div className="text-[10px] text-gray-500">Experiences</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl text-center">
                          <div className="text-lg font-bold text-gray-900">{cp.education.length}</div>
                          <div className="text-[10px] text-gray-500">Education</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl text-center">
                          <div className="text-lg font-bold text-gray-900">{cp.skills.length}</div>
                          <div className="text-[10px] text-gray-500">Skills</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl text-center">
                          <div className="text-lg font-bold text-gray-900">{cp.targetRoles.length}</div>
                          <div className="text-[10px] text-gray-500">Target Roles</div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={handleGenerateCV} disabled={generating} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all text-center disabled:opacity-50">
                          {generating ? "Generating..." : "Generate CV"}
                        </button>
                        <button onClick={() => setActiveTab("goals")} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
                          Set Goals
                        </button>
                      </div>
                      {generateStage && (
                        <div className="pt-2 text-[11px] text-gray-500 flex items-center gap-2">
                          <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                          {generateStage}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Personal */}
            {activeTab === "personal" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h2>

                {/* Photo upload */}
                <div className="mb-6 flex items-center gap-4">
                  {cp.personal.photoUrl ? (
                    <div className="relative">
                      <img src={cp.personal.photoUrl} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border border-gray-200 shadow-sm" />
                      <button
                        onClick={() => updateCareerPersonal({ photoUrl: null })}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow hover:bg-red-600"
                        title="Remove photo"
                      >
                        x
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition-all">
                        {cp.personal.photoUrl ? "Change Photo" : "Upload Photo"}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); e.target.value = ""; }} />
                      </label>
                      <select
                        value={cp.personal.photoPosition}
                        onChange={(e) => updateCareerPersonal({ photoPosition: e.target.value as "left" | "center" | "right" })}
                        className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400"
                        title="Photo position"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                      <input
                        type="range" min={40} max={100} value={cp.personal.photoSize}
                        onChange={(e) => updateCareerPersonal({ photoSize: parseInt(e.target.value, 10) })}
                        className="flex-1 accent-gray-900"
                        title="Photo size"
                      />
                    </div>
                    {photoError && <p className="text-red-500 text-[11px] mt-1">{photoError}</p>}
                    <p className="text-[10px] text-gray-400 mt-0.5">JPG or PNG, under 4MB. Shows in supported templates & PDF.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <TextInput type="name" value={cp.personal.fullName} onChange={(v) => updateCareerPersonal({ fullName: v })} placeholder="Abebe Kebede" />
                  </Field>
                  <Field label="Headline">
                    <TextInput type="text" value={cp.personal.headline} onChange={(v) => updateCareerPersonal({ headline: v })} placeholder="Software Engineer" />
                  </Field>
                  <Field label="Email">
                    <TextInput type="email" value={cp.personal.email} onChange={(v) => updateCareerPersonal({ email: v })} placeholder="abebe@email.com" />
                  </Field>
                  <Field label="Phone">
                    <TextInput type="phone" value={cp.personal.phone} onChange={(v) => updateCareerPersonal({ phone: v })} placeholder="+251 91 234 5678" />
                  </Field>
                  <Field label="Location">
                    <TextInput type="text" value={cp.personal.address} onChange={(v) => updateCareerPersonal({ address: v })} placeholder="Addis Ababa, Ethiopia" />
                  </Field>
                  <Field label="LinkedIn">
                    <TextInput type="url" value={cp.personal.linkedIn} onChange={(v) => updateCareerPersonal({ linkedIn: v })} placeholder="linkedin.com/in/..." />
                  </Field>
                  <Field label="GitHub">
                    <TextInput type="url" value={cp.personal.github} onChange={(v) => updateCareerPersonal({ github: v })} placeholder="github.com/..." />
                  </Field>
                  <Field label="Website">
                    <TextInput type="url" value={cp.personal.website} onChange={(v) => updateCareerPersonal({ website: v })} placeholder="https://..." />
                  </Field>
                </div>

                {/* Headline suggestions */}
                {roleRec && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Headline ideas for &ldquo;{cp.targetRoles[0]}&rdquo;</p>
                    <div className="flex flex-wrap gap-1.5">
                      {headlineIdeas(cp.targetRoles[0]).map((h, i) => (
                        <button
                          key={i}
                          onClick={() => updateCareerPersonal({ headline: h })}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] hover:bg-blue-100 transition-all text-left"
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary suggestions */}
                <div className="mt-4">
                  <Field label="Professional Summary">
                    <TextInput value={cp.personal.summary} onChange={(v) => updateCareerPersonal({ summary: v })} placeholder="Brief overview of your professional background..." multiline />
                  </Field>
                  {cp.targetIndustries[0] && (() => {
                    const templatesList = getIndustrySummaryTemplates(cp.targetIndustries[0]);
                    if (templatesList.length === 0) return null;
                    return (
                      <div className="mt-2">
                        <p className="text-[11px] text-gray-500 mb-1.5">Suggested summaries for {cp.targetIndustries[0]}:</p>
                        <div className="space-y-1.5">
                          {templatesList.map((t, i) => (
                            <button
                              key={i}
                              onClick={() => updateCareerPersonal({ summary: t })}
                              className="w-full text-left px-3 py-2 bg-amber-50 text-amber-900 rounded-lg text-[11px] hover:bg-amber-100 transition-all"
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Experience */}
            {activeTab === "experience" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Work Experience</h2>
                  <button onClick={addCareerExperience} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all">+ Add Experience</button>
                </div>
                {cp.experiences.length === 0 ? (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-8 text-center shadow-sm">
                    <p className="text-gray-400 text-sm">No experiences added yet.</p>
                  </div>
                ) : (
                  cp.experiences.map((exp) => (
                    <div key={exp.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-5 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400">Experience</span>
                        <button onClick={() => removeCareerExperience(exp.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <Field label="Company">
                          <TextInput value={exp.company} onChange={(v) => updateCareerExperience(exp.id, { company: v })} placeholder="Ethio Telecom" />
                        </Field>
                        <Field label="Role">
                          <TextInput value={exp.role} onChange={(v) => updateCareerExperience(exp.id, { role: v })} placeholder="Software Engineer" />
                        </Field>
                        <Field label="Start Date">
                          <TextInput value={exp.startDate} onChange={(v) => updateCareerExperience(exp.id, { startDate: v })} placeholder="2020" />
                        </Field>
                        <Field label="End Date">
                          <TextInput value={exp.endDate} onChange={(v) => updateCareerExperience(exp.id, { endDate: v })} placeholder="Present" />
                        </Field>
                      </div>
                      <div className="mt-3">
                        <Field label="Key Achievements">
                          {exp.bullets.map((bullet, i) => {
                            const suggestionKey = `${exp.id}-${i}`;
                            const suggestions = bulletSuggestions[suggestionKey] || [];
                            return (
                              <div key={i} className="mb-2">
                                <div className="flex gap-2">
                                  <input type="text" value={bullet} onChange={(e) => { const b = [...exp.bullets]; b[i] = e.target.value; updateCareerExperience(exp.id, { bullets: b }); }} placeholder="Describe an achievement..." className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
                                  <button
                                    onClick={() => runBulletSuggestions(exp.id, i, bullet)}
                                    disabled={suggestingBullets || !bullet.trim()}
                                    className="flex-shrink-0 px-2 py-2 rounded-lg text-[10px] font-bold border border-gray-200 bg-white text-gray-400 hover:text-blue-600 hover:border-blue-200 disabled:opacity-40 transition-all"
                                    title="Get AI rewrite suggestions"
                                  >
                                    ✨
                                  </button>
                                  <button onClick={() => { const b = exp.bullets.filter((_, idx) => idx !== i); updateCareerExperience(exp.id, { bullets: b }); }} className="text-xs text-gray-400 hover:text-red-500 px-2">x</button>
                                </div>
                                {suggestions.length > 0 && (
                                  <div className="mt-1.5 space-y-1">
                                    {suggestions.map((s, si) => (
                                      <div key={si} className="flex items-center gap-2 px-2.5 py-1.5 bg-blue-50 rounded-lg">
                                        <span className="flex-1 text-[11px] text-blue-900">{s}</span>
                                        <button onClick={() => applySuggestedBullet(exp.id, i, s)} className="flex-shrink-0 px-2 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-all">Use</button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          <button onClick={() => updateCareerExperience(exp.id, { bullets: [...exp.bullets, ""] })} className="text-xs text-gray-500 hover:text-gray-700 font-medium">+ Add bullet</button>
                        </Field>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Education */}
            {activeTab === "education" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Education</h2>
                  <button onClick={addCareerEducation} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all">+ Add Education</button>
                </div>
                {cp.education.length === 0 ? (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-8 text-center shadow-sm">
                    <p className="text-gray-400 text-sm">No education added yet.</p>
                  </div>
                ) : (
                  cp.education.map((edu) => (
                    <div key={edu.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-5 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400">Education</span>
                        <button onClick={() => removeCareerEducation(edu.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <Field label="Institution">
                          <TextInput value={edu.institution} onChange={(v) => updateCareerEducation(edu.id, { institution: v })} placeholder="Addis Ababa University" />
                        </Field>
                        <Field label="Degree">
                          <TextInput value={edu.degree} onChange={(v) => updateCareerEducation(edu.id, { degree: v })} placeholder="BSc" />
                        </Field>
                        <Field label="Field of Study">
                          <TextInput value={edu.field} onChange={(v) => updateCareerEducation(edu.id, { field: v })} placeholder="Computer Science" />
                        </Field>
                        <Field label="GPA">
                          <TextInput value={edu.gpa} onChange={(v) => updateCareerEducation(edu.id, { gpa: v })} placeholder="3.8" />
                        </Field>
                        <Field label="Start Year">
                          <TextInput value={edu.startDate} onChange={(v) => updateCareerEducation(edu.id, { startDate: v })} placeholder="2016" />
                        </Field>
                        <Field label="End Year">
                          <TextInput value={edu.endDate} onChange={(v) => updateCareerEducation(edu.id, { endDate: v })} placeholder="2020" />
                        </Field>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Skills */}
            {activeTab === "skills" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Skills</h2>
                <div className="flex gap-2 mb-4">
                  <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && skillInput.trim()) { addCareerSkill(skillInput.trim()); setSkillInput(""); } }} placeholder="Add a skill and press Enter" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
                  <button onClick={() => { if (skillInput.trim()) { addCareerSkill(skillInput.trim()); setSkillInput(""); } }} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-all">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cp.skills.map((skill) => (
                    <div key={skill.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm">
                      <span className="text-gray-700">{skill.name}</span>
                      <button onClick={() => removeCareerSkill(skill.id)} className="text-gray-400 hover:text-red-500 text-xs">x</button>
                    </div>
                  ))}
                </div>
                {cp.skills.length === 0 && <p className="text-gray-400 text-xs mt-2">No skills added yet.</p>}

                {(roleRec || industrySuggestions.length > 0) && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Suggested skills {cp.targetRoles[0] ? `for ${cp.targetRoles[0]}` : ""}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        ...(roleRec?.skills || []),
                        ...industrySuggestions.filter((s) => !(roleRec?.skills || []).includes(s)),
                      ].filter((s) => !cp.skills.some((existing) => existing.name.toLowerCase() === s.toLowerCase()))
                        .slice(0, 12)
                        .map((s, i) => (
                          <button
                            key={i}
                            onClick={() => addCareerSkill(s)}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] hover:bg-blue-100 transition-all"
                          >
                            + {s}
                          </button>
                        ))}
                    </div>
                    {cp.skills.length >= 5 && (
                      <button
                        onClick={() => { roleRec?.skills.slice(0, 8).forEach((s) => { if (!cp.skills.some((e) => e.name.toLowerCase() === s.toLowerCase())) addCareerSkill(s); }); industrySuggestions.slice(0, 6).forEach((s) => { if (!cp.skills.some((e) => e.name.toLowerCase() === s.toLowerCase())) addCareerSkill(s); }); }}
                        className="mt-2 text-xs text-gray-500 hover:text-gray-700 font-medium"
                      >
                        + Add all suggested skills
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Extras (Languages, Certifications, Projects, Awards) */}
            {activeTab === "extras" && (
              <div className="space-y-6">
                {/* Languages */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Languages</h3>
                    <button onClick={addCareerLanguage} className="text-xs text-gray-600 hover:text-gray-900 font-semibold">+ Add</button>
                  </div>
                  {cp.languages.map((lang) => (
                    <div key={lang.id} className="flex items-center gap-2 mb-2">
                      <input type="text" value={lang.name} onChange={(e) => updateCareerLanguage(lang.id, { name: e.target.value })} placeholder="Language" className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
                      <select value={lang.proficiency} onChange={(e) => updateCareerLanguage(lang.id, { proficiency: e.target.value as "basic" | "conversational" | "fluent" | "native" })} className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg">
                        <option value="basic">Basic</option>
                        <option value="conversational">Conversational</option>
                        <option value="fluent">Fluent</option>
                        <option value="native">Native</option>
                      </select>
                      <button onClick={() => removeCareerLanguage(lang.id)} className="text-xs text-gray-400 hover:text-red-500">x</button>
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Certifications</h3>
                    <button onClick={addCareerCertification} className="text-xs text-gray-600 hover:text-gray-900 font-semibold">+ Add</button>
                  </div>
                  {cp.certifications.map((cert) => (
                    <div key={cert.id} className="grid grid-cols-3 gap-2 mb-2">
                      <input type="text" value={cert.name} onChange={(e) => updateCareerCertification(cert.id, { name: e.target.value })} placeholder="Certification" className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
                      <input type="text" value={cert.issuer} onChange={(e) => updateCareerCertification(cert.id, { issuer: e.target.value })} placeholder="Issuer" className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
                      <div className="flex gap-1">
                        <input type="text" value={cert.date} onChange={(e) => updateCareerCertification(cert.id, { date: e.target.value })} placeholder="Date" className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
                        <button onClick={() => removeCareerCertification(cert.id)} className="text-xs text-gray-400 hover:text-red-500 px-1">x</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Projects */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Projects</h3>
                    <button onClick={addCareerProject} className="text-xs text-gray-600 hover:text-gray-900 font-semibold">+ Add</button>
                  </div>
                  {cp.projects.map((proj) => (
                    <div key={proj.id} className="mb-3 p-3 bg-gray-50 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <input type="text" value={proj.name} onChange={(e) => updateCareerProject(proj.id, { name: e.target.value })} placeholder="Project name" className="flex-1 px-2 py-1 text-sm font-semibold border-none bg-transparent focus:outline-none" />
                        <button onClick={() => removeCareerProject(proj.id)} className="text-xs text-gray-400 hover:text-red-500">x</button>
                      </div>
                      <textarea value={proj.description} onChange={(e) => updateCareerProject(proj.id, { description: e.target.value })} placeholder="Description..." className="w-full px-2 py-1 text-xs border-none bg-transparent resize-none focus:outline-none" rows={2} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Goals */}
            {activeTab === "goals" && (
              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Career Goals</h2>

                  <Field label="Target Roles">
                    <div className="flex gap-2 mb-2">
                      <input type="text" value={roleInput} onChange={(e) => setRoleInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && roleInput.trim()) { setCareerTargetRoles([...cp.targetRoles, roleInput.trim()]); setRoleInput(""); } }} placeholder="Add a target role" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
                      <button onClick={() => { if (roleInput.trim()) { setCareerTargetRoles([...cp.targetRoles, roleInput.trim()]); setRoleInput(""); } }} className="px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cp.targetRoles.map((role, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg text-xs">
                          {role}
                          <button onClick={() => setCareerTargetRoles(cp.targetRoles.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">x</button>
                        </span>
                      ))}
                    </div>
                  </Field>

                  <div className="mt-4">
                    <Field label="Target Industries">
                      <div className="flex gap-2 mb-2">
                        <input type="text" value={industryInput} onChange={(e) => setIndustryInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && industryInput.trim()) { setCareerTargetIndustries([...cp.targetIndustries, industryInput.trim()]); setIndustryInput(""); } }} placeholder="Add an industry" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
                        <button onClick={() => { if (industryInput.trim()) { setCareerTargetIndustries([...cp.targetIndustries, industryInput.trim()]); setIndustryInput(""); } }} className="px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Add</button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cp.targetIndustries.map((ind, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg text-xs">
                            {ind}
                            <button onClick={() => setCareerTargetIndustries(cp.targetIndustries.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">x</button>
                          </span>
                        ))}
                      </div>
                    </Field>
                  </div>

                  <div className="mt-4">
                    <Field label="Career Interests">
                      <div className="flex gap-2 mb-2">
                        <input type="text" value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && interestInput.trim()) { setCareerInterests([...cp.careerInterests, interestInput.trim()]); setInterestInput(""); } }} placeholder="Add an interest" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
                        <button onClick={() => { if (interestInput.trim()) { setCareerInterests([...cp.careerInterests, interestInput.trim()]); setInterestInput(""); } }} className="px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Add</button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cp.careerInterests.map((int, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg text-xs">
                            {int}
                            <button onClick={() => setCareerInterests(cp.careerInterests.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">x</button>
                          </span>
                        ))}
                      </div>
                    </Field>
                  </div>

                  <div className="mt-4">
                    <Field label="Career Goals">
                      <textarea value={cp.careerGoals} onChange={(e) => setCareerGoals(e.target.value)} placeholder="Describe your career goals and what you're looking for..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 resize-none" rows={4} />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {/* Jobs */}
            {activeTab === "jobs" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Saved Jobs</h2>
                <p className="text-xs text-gray-500 mb-4">Paste job descriptions to match against your Career Twin.</p>
                {cp.jobDescriptions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm mb-3">No saved jobs yet.</p>
                    <Link href="/job-match" className="text-sm text-gray-600 hover:text-gray-900 font-semibold underline">Go to Job Match to paste a job description</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cp.jobDescriptions.map((jd) => (
                      <div key={jd.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-bold text-gray-900">{jd.title || "Untitled"}</div>
                            <div className="text-xs text-gray-500">{jd.company}</div>
                          </div>
                          <button onClick={() => removeJobDescription(jd.id)} className="text-xs text-gray-400 hover:text-red-500">Remove</button>
                        </div>
                        {jd.matchResult && (
                          <div className="mt-2 text-xs text-gray-600">
                            Match: <span className="font-bold">{jd.matchResult.score}%</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Live CV Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm sticky top-20">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-900">Live Preview</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Page {pageCount} &middot; {contentAnalysis.contentDensity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/export" className="px-2.5 py-1.5 bg-gray-900 text-white rounded-lg text-[10px] font-bold hover:bg-gray-800 transition-all">
                    Download PDF
                  </Link>
                  <button onClick={() => setPreviewZoom(Math.max(50, previewZoom - 10))} className="w-6 h-6 rounded bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200">-</button>
                  <span className="text-[10px] text-gray-400 w-8 text-center font-medium">{previewZoom}%</span>
                  <button onClick={() => setPreviewZoom(Math.min(150, previewZoom + 10))} className="w-6 h-6 rounded bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200">+</button>
                </div>
              </div>
              <div className="p-3">
                {mounted ? (
                  <div style={{ height: "min(500px, 60vh)", transform: `scale(${previewZoom / 100})`, transformOrigin: "top center" }}>
                    <PdfViewerWrapper width="100%" height="100%" showToolbar={false}>
                      <PdfDocumentLoader data={previewData} template={template} theme={theme} layout={finalLayout} fontChoice={fontChoice} />
                    </PdfViewerWrapper>
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Import from CV?</h3>
            <p className="text-sm text-gray-500 mb-6">This will copy all data from your existing CV into your Career Twin. You can edit it afterwards.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowImportModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">Cancel</button>
              <button onClick={() => { importCareerFromCV(); setShowImportModal(false); }} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all">Import</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={showResetModal}
        title="Start Fresh?"
        message="This will permanently delete all your Career Twin and CV data. This cannot be undone."
        confirmLabel="Delete Everything"
        danger
        onConfirm={() => { resetAll(); setShowResetModal(false); }}
        onCancel={() => setShowResetModal(false)}
      />

      {/* Versions modal */}
      {showVersions && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowVersions(false)}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">CV Versions</h3>
              <button onClick={() => setShowVersions(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Generated CVs are saved as versions and never overwrite your Career Twin profile. Generate a version from the Overview tab, then load it to export a PDF.
            </p>
            {versions.length === 0 ? (
              <div className="text-center py-10 text-sm text-gray-500 bg-gray-50 rounded-xl">
                No versions yet. Click <span className="font-semibold text-gray-700">Generate CV</span> on the Overview tab to create your first one.
              </div>
            ) : (
              <div className="space-y-3">
                {versions.map((v) => (
                  <div key={v.id} className="border border-gray-200 rounded-xl p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-gray-900 truncate">{v.name}</div>
                        <div className="text-[11px] text-gray-500">
                          {v.targetRole ? `${v.targetRole} · ` : ""}
                          {v.targetCompany ? `${v.targetCompany} · ` : ""}
                          {new Date(v.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => { loadVersionIntoEditor(v.id); setShowVersions(false); }} className="px-2.5 py-1.5 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-all">Load</button>
                        <button onClick={() => duplicateVersion(v.id)} className="px-2 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg" title="Duplicate">Copy</button>
                        <button onClick={() => deleteVersion(v.id)} className="px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg" title="Delete">&times;</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
