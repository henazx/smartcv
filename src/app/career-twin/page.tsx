"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCVStore } from "@/lib/store";

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, multiline }: { value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  if (multiline) {
    return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 resize-none" rows={3} />;
  }
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />;
}

export default function CareerTwinPage() {
  const router = useRouter();
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
    importCareerFromCV, populateFromCareerProfile, data, removeJobDescription,
  } = useCVStore();

  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<TwinSection>("overview");
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    hydrateFromStorage();
    setHydrated(true);
  }, [hydrateFromStorage]);

  if (!hydrated) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>;
  }

  const cp = careerProfile;
  const hasData = cp.personal.fullName || cp.experiences.length > 0 || cp.skills.length > 0;
  const hasCvData = data.personal.fullName || data.experiences.length > 0 || data.skills.length > 0;

  const completeness = (() => {
    let filled = 0;
    let total = 0;
    if (cp.personal.fullName) filled++; total++;
    if (cp.personal.email) filled++; total++;
    if (cp.personal.phone) filled++; total++;
    if (cp.personal.summary) filled++; total++;
    if (cp.experiences.length > 0) filled++; total++;
    if (cp.education.length > 0) filled++; total++;
    if (cp.skills.length > 0) filled++; total++;
    if (cp.targetRoles.length > 0) filled++; total++;
    return total > 0 ? Math.round((filled / total) * 100) : 0;
  })();

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
            <Link href="/build" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Builder</Link>
            <Link href="/job-match" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Job Match</Link>
            <Link href="/cover-letter" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Cover Letter</Link>
            <Link href="/applications" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Applications</Link>
            <Link href="/interview" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">Interview</Link>
            <Link href="/build" onClick={(e) => { e.preventDefault(); populateFromCareerProfile(); router.push("/build"); }} className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg text-sm font-semibold hover:from-gray-800 hover:to-gray-600 transition-all shadow-sm">Create CV</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Career Twin</h1>
          <p className="text-sm text-gray-500">Your professional profile, stored once. Edit here, and every CV you generate updates automatically.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar tabs */}
          <div className="lg:col-span-3">
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
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-9">
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
                        <Link href="/build" onClick={(e) => { e.preventDefault(); populateFromCareerProfile(); router.push("/build"); }} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all text-center">
                          Generate CV
                        </Link>
                        <button onClick={() => setActiveTab("goals")} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
                          Set Goals
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Personal */}
            {activeTab === "personal" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <TextInput value={cp.personal.fullName} onChange={(v) => updateCareerPersonal({ fullName: v })} placeholder="Abebe Kebede" />
                  </Field>
                  <Field label="Headline">
                    <TextInput value={cp.personal.headline} onChange={(v) => updateCareerPersonal({ headline: v })} placeholder="Software Engineer" />
                  </Field>
                  <Field label="Email">
                    <TextInput value={cp.personal.email} onChange={(v) => updateCareerPersonal({ email: v })} placeholder="abebe@email.com" />
                  </Field>
                  <Field label="Phone">
                    <TextInput value={cp.personal.phone} onChange={(v) => updateCareerPersonal({ phone: v })} placeholder="+251 91 234 5678" />
                  </Field>
                  <Field label="Location">
                    <TextInput value={cp.personal.address} onChange={(v) => updateCareerPersonal({ address: v })} placeholder="Addis Ababa, Ethiopia" />
                  </Field>
                  <Field label="LinkedIn">
                    <TextInput value={cp.personal.linkedIn} onChange={(v) => updateCareerPersonal({ linkedIn: v })} placeholder="linkedin.com/in/..." />
                  </Field>
                  <Field label="GitHub">
                    <TextInput value={cp.personal.github} onChange={(v) => updateCareerPersonal({ github: v })} placeholder="github.com/..." />
                  </Field>
                  <Field label="Website">
                    <TextInput value={cp.personal.website} onChange={(v) => updateCareerPersonal({ website: v })} placeholder="https://..." />
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="Professional Summary">
                    <TextInput value={cp.personal.summary} onChange={(v) => updateCareerPersonal({ summary: v })} placeholder="Brief overview of your professional background..." multiline />
                  </Field>
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
                          {exp.bullets.map((bullet, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                              <input type="text" value={bullet} onChange={(e) => { const b = [...exp.bullets]; b[i] = e.target.value; updateCareerExperience(exp.id, { bullets: b }); }} placeholder="Describe an achievement..." className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
                              <button onClick={() => { const b = exp.bullets.filter((_, idx) => idx !== i); updateCareerExperience(exp.id, { bullets: b }); }} className="text-xs text-gray-400 hover:text-red-500 px-2">x</button>
                            </div>
                          ))}
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
                    <Link href="/build" className="text-sm text-gray-600 hover:text-gray-900 font-semibold underline">Go to Builder to paste a job description</Link>
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
    </div>
  );
}
