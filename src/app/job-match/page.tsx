"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCVStore } from "@/lib/store";
import { analyzeJobMatch } from "@/lib/cvProfile";
import type { CVData, JobMatchResult, CareerProfile } from "@/types";

function careerProfileToCVData(cp: CareerProfile): CVData {
  return {
    personal: {
      fullName: cp.personal.fullName,
      headline: cp.personal.headline,
      email: cp.personal.email,
      phone: cp.personal.phone,
      address: cp.personal.address,
      summary: cp.personal.summary,
      photoUrl: null,
      photoSize: 60,
      photoPosition: "center",
      linkedIn: cp.personal.linkedIn,
      github: cp.personal.github,
      website: cp.personal.website,
    },
    experiences: cp.experiences,
    education: cp.education,
    skills: cp.skills,
    languages: cp.languages,
    certifications: cp.certifications,
    projects: cp.projects,
    awards: cp.awards,
    publications: cp.publications,
    references: [],
    volunteer: cp.volunteer,
    courses: cp.courses,
    includeReferences: false,
    showAvailableUponRequest: true,
    activeSections: ["summary", "experience", "education", "skills"],
  };
}

interface GapItem {
  keyword: string;
  type: "missing-skill" | "missing-evidence" | "missing-keyword";
  explanation: string;
  suggestion: string;
}

function classifyGaps(result: JobMatchResult, cp: CareerProfile): GapItem[] {
  const gaps: GapItem[] = [];

  const userSkills = cp.skills.map((s) => s.name.toLowerCase());

  for (const kw of result.missing) {
    const kwLower = kw.toLowerCase();

    const hasSkill = userSkills.some((s) => s.includes(kwLower) || kwLower.includes(s));
    if (hasSkill) {
      gaps.push({
        keyword: kw,
        type: "missing-evidence",
        explanation: `You appear to have "${kw}" in your skills, but your experience bullets don't clearly demonstrate it.`,
        suggestion: `Add a bullet point describing how you used ${kw} in a real project or role.`,
      });
      continue;
    }

    const roleKeywords = cp.experiences.flatMap((e) => [e.role, ...e.bullets]).join(" ").toLowerCase();
    const hasRelated = kwLower.split(" ").some((word) => word.length > 3 && roleKeywords.includes(word));
    if (hasRelated) {
      gaps.push({
        keyword: kw,
        type: "missing-keyword",
        explanation: `Your experience may be relevant, but your CV doesn't use the employer's terminology "${kw}".`,
        suggestion: `Rephrase a bullet point to include the keyword "${kw}" naturally.`,
      });
      continue;
    }

    gaps.push({
      keyword: kw,
      type: "missing-skill",
      explanation: `This skill or qualification doesn't appear in your Career Twin.`,
      suggestion: `If you have this skill, add it to your profile. If not, consider whether it's essential for this role.`,
    });
  }

  return gaps;
}

function ScoreCircle({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#111827" : score >= 40 ? "#d97706" : "#dc2626";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold" style={{ color }}>{score}</span>
        <span className="text-[10px] text-gray-400 font-medium">match</span>
      </div>
    </div>
  );
}

export default function JobMatchPage() {
  const { careerProfile, hydrateFromStorage, saveJobDescription, data, populateFromCareerProfile, setJobDescription, addApplication } = useCVStore();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [jobInput, setJobInput] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [gaps, setGaps] = useState<GapItem[]>([]);
  const [activeResultTab, setActiveResultTab] = useState<"overview" | "matched" | "gaps" | "suggestions">("overview");
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    hydrateFromStorage();
    setHydrated(true);
  }, [hydrateFromStorage]);

  const hasProfile = careerProfile.personal.fullName || careerProfile.experiences.length > 0 || careerProfile.skills.length > 0;
  const hasCvData = data.personal.fullName || data.experiences.length > 0 || data.skills.length > 0;

  const runMatch = (jd: string) => {
    const cvData = hasProfile ? careerProfileToCVData(careerProfile) : data;
    const matchResult = analyzeJobMatch(cvData, jd);
    setResult(matchResult);
    setGaps(classifyGaps(matchResult, careerProfile));
    setActiveResultTab("overview");
  };

  const handleAnalyze = () => {
    if (!jobInput.trim()) return;
    runMatch(jobInput);
  };

  const handleSave = () => {
    if (!result || !jobInput.trim()) return;
    saveJobDescription({
      id: Math.random().toString(36).substring(2, 9),
      title: jobTitle || "Untitled Position",
      company: jobCompany || "",
      description: jobInput,
      url: jobUrl,
      savedAt: new Date().toISOString(),
      matchResult: result,
    });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleLoadSaved = (description: string, title?: string, company?: string) => {
    setJobInput(description);
    setJobTitle(title || "");
    setJobCompany(company || "");
    setShowSaved(false);
    runMatch(description);
  };

  const gapCounts = useMemo(() => {
    if (!gaps.length) return { skill: 0, evidence: 0, keyword: 0 };
    return {
      skill: gaps.filter((g) => g.type === "missing-skill").length,
      evidence: gaps.filter((g) => g.type === "missing-evidence").length,
      keyword: gaps.filter((g) => g.type === "missing-keyword").length,
    };
  }, [gaps]);

  if (!hydrated) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>;
  }

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
            <Link href="/career-twin" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all hidden sm:inline-flex">Career Twin</Link>
            <Link href="/cover-letter" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all hidden sm:inline-flex">Cover Letter</Link>
            <Link href="/applications" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all hidden sm:inline-flex">Applications</Link>
            <Link href="/build" className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg text-sm font-semibold hover:from-gray-800 hover:to-gray-600 transition-all shadow-sm">Create CV</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Job Match</h1>
          <p className="text-sm text-gray-500">Paste a job description. See how well your Career Twin matches, and exactly what to improve.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: Input */}
          <div className="lg:col-span-5">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6 shadow-sm sticky top-20">
              {!hasProfile && !hasCvData ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl text-gray-400">{"\u2694"}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">You need a Career Twin or CV data to match against jobs.</p>
                  <Link href="/career-twin" className="px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all inline-block">
                    Build Career Twin
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-gray-900">Job Description</h2>
                    <button onClick={() => setShowSaved(!showSaved)} className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                      {careerProfile.jobDescriptions.length > 0 ? `Saved (${careerProfile.jobDescriptions.length})` : "Saved jobs"}
                    </button>
                  </div>

                  {/* Saved jobs dropdown */}
                  {showSaved && careerProfile.jobDescriptions.length > 0 && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-xl space-y-2">
                      {careerProfile.jobDescriptions.map((jd) => (
                        <button key={jd.id} onClick={() => handleLoadSaved(jd.description, jd.title, jd.company)} className="w-full text-left p-2.5 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
                          <div className="text-xs font-bold text-gray-900">{jd.title || "Untitled"}</div>
                          <div className="text-[10px] text-gray-500">{jd.company} {jd.matchResult ? `· ${jd.matchResult.score}% match` : ""}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Job title (optional)" className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
                    <input type="text" value={jobCompany} onChange={(e) => setJobCompany(e.target.value)} placeholder="Company (optional)" className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
                  </div>
                  <input type="text" value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="Job URL (optional)" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 mb-3" />
                  <textarea
                    value={jobInput}
                    onChange={(e) => setJobInput(e.target.value)}
                    placeholder={"Paste the full job description here...\n\nInclude requirements, responsibilities, and qualifications for the best match analysis."}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 resize-none mb-3"
                    rows={10}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAnalyze} disabled={!jobInput.trim()} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      Analyze Match
                    </button>
                    {result && (
                      <button onClick={handleSave} className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
                        Save
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-7">
            {!result ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-8 text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-gray-400">{"\u2694"}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Paste a job description</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  SmartCV will analyze the job against your Career Twin and show you exactly what matches, what&apos;s missing, and how to improve your application.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Score card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6 shadow-sm">
                  <div className="flex items-center gap-6">
                    <ScoreCircle score={result.score} />
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-900 mb-1">
                        {jobTitle || "Job Match"} {jobCompany ? `at ${jobCompany}` : ""}
                      </h2>
                      <div className="flex gap-3 text-xs">
                        <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-medium">{result.strongMatches.length} strong</span>
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">{result.weakMatches.length} partial</span>
                        <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded-full font-medium">{result.missing.length} missing</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {result.score >= 70 ? "Strong match — your profile aligns well with this role." :
                         result.score >= 40 ? "Moderate match — there are some gaps to address." :
                         "Low match — significant gaps between your profile and this role."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                  <div className="flex border-b border-gray-100">
                    {[
                      { id: "overview" as const, label: "Overview" },
                      { id: "matched" as const, label: `Matched (${result.strongMatches.length + result.weakMatches.length})` },
                      { id: "gaps" as const, label: `Gaps (${gaps.length})` },
                      { id: "suggestions" as const, label: `Actions (${result.suggestions.length})` },
                    ].map((tab) => (
                      <button key={tab.id} onClick={() => setActiveResultTab(tab.id)} className={`flex-1 px-3 py-3 text-xs font-semibold transition-all ${activeResultTab === tab.id ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-400 hover:text-gray-600"}`}>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-5">
                    {/* Overview tab */}
                    {activeResultTab === "overview" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 bg-green-50 rounded-xl text-center">
                            <div className="text-lg font-bold text-green-700">{gapCounts.skill}</div>
                            <div className="text-[10px] text-green-600">Missing Skills</div>
                          </div>
                          <div className="p-3 bg-amber-50 rounded-xl text-center">
                            <div className="text-lg font-bold text-amber-700">{gapCounts.evidence}</div>
                            <div className="text-[10px] text-amber-600">Missing Evidence</div>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-xl text-center">
                            <div className="text-lg font-bold text-blue-700">{gapCounts.keyword}</div>
                            <div className="text-[10px] text-blue-600">Missing Keywords</div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xs font-bold text-gray-900 mb-2">What the job asks for</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {result.extractedSkills.slice(0, 15).map((skill, i) => {
                              const isMatched = result.strongMatches.includes(skill) || result.weakMatches.includes(skill);
                              const isMissing = result.missing.includes(skill);
                              return (
                                <span key={i} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${isMatched ? "bg-green-100 text-green-700" : isMissing ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`}>
                                  {skill}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {result.suggestions.length > 0 && (
                          <div>
                            <h3 className="text-xs font-bold text-gray-900 mb-2">Top recommendations</h3>
                            {result.suggestions.slice(0, 3).map((s, i) => (
                              <div key={i} className="flex items-start gap-2 mb-2">
                                <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500 mt-0.5 shrink-0">{i + 1}</span>
                                <p className="text-xs text-gray-600 leading-relaxed">{s}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Matched tab */}
                    {activeResultTab === "matched" && (
                      <div className="space-y-4">
                        {result.strongMatches.length > 0 && (
                          <div>
                            <h3 className="text-xs font-bold text-green-700 mb-2">Strong Matches</h3>
                            <div className="flex flex-wrap gap-1.5">
                              {result.strongMatches.map((kw, i) => (
                                <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">{kw}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {result.weakMatches.length > 0 && (
                          <div>
                            <h3 className="text-xs font-bold text-amber-700 mb-2">Partial Matches (via synonyms)</h3>
                            <div className="flex flex-wrap gap-1.5">
                              {result.weakMatches.map((kw, i) => (
                                <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium">{kw}</span>
                              ))}
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2">These match through synonyms. Consider using the employer&apos;s exact terminology.</p>
                          </div>
                        )}
                        {result.strongMatches.length === 0 && result.weakMatches.length === 0 && (
                          <p className="text-sm text-gray-400 text-center py-4">No keyword matches found. Try adding more skills to your Career Twin.</p>
                        )}
                      </div>
                    )}

                    {/* Gaps tab */}
                    {activeResultTab === "gaps" && (
                      <div className="space-y-3">
                        {gaps.length === 0 ? (
                          <p className="text-sm text-gray-400 text-center py-4">No gaps found — great match!</p>
                        ) : (
                          gaps.map((gap, i) => (
                            <div key={i} className={`p-3.5 rounded-xl border ${gap.type === "missing-skill" ? "border-red-200 bg-red-50/50" : gap.type === "missing-evidence" ? "border-amber-200 bg-amber-50/50" : "border-blue-200 bg-blue-50/50"}`}>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${gap.type === "missing-skill" ? "bg-red-100 text-red-600" : gap.type === "missing-evidence" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}>
                                  {gap.type === "missing-skill" ? "Missing Skill" : gap.type === "missing-evidence" ? "Missing Evidence" : "Missing Keyword"}
                                </span>
                                <span className="text-sm font-bold text-gray-900">{gap.keyword}</span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{gap.explanation}</p>
                              <p className="text-xs text-gray-500 italic">{gap.suggestion}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* Suggestions tab */}
                    {activeResultTab === "suggestions" && (
                      <div className="space-y-3">
                        {result.suggestions.length === 0 ? (
                          <p className="text-sm text-gray-400 text-center py-4">No specific actions needed.</p>
                        ) : (
                          result.suggestions.map((s, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                              <div className="w-6 h-6 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
                                <span className="text-white text-[10px] font-bold">{i + 1}</span>
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed">{s}</p>
                            </div>
                          ))
                        )}
                        <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                          <p className="text-xs text-blue-700 font-medium">Review AI-generated content before submitting. All suggestions are based on information in your Career Twin.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (hasProfile) populateFromCareerProfile();
                      if (jobInput.trim()) setJobDescription(jobInput);
                      router.push("/build");
                    }}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all text-center"
                  >
                    Create Tailored CV
                  </button>
                  <button
                    onClick={() => router.push("/cover-letter")}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all text-center"
                  >
                    Cover Letter
                  </button>
                  <button
                    onClick={() => {
                      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
                      addApplication({
                        id,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        jobTitle: jobTitle || "Untitled Position",
                        companyName: jobCompany || "Unknown Company",
                        jobDescription: jobInput,
                        url: jobUrl,
                        status: "saved",
                        appliedAt: null,
                        interviewAt: null,
                        notes: "",
                        matchScore: result?.score ?? null,
                      });
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all text-center"
                  >
                    Save to Tracker
                  </button>
                  <Link href="/applications" className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all text-center">
                    View Apps
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
