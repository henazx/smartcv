"use client";

import React, { useState, useMemo } from "react";
import { useCVStore } from "@/lib/store";
import { analyzeATS } from "@/lib/atsScorer";
import { analyzeQuality } from "@/lib/cvQuality";
import { analyzeJobMatch } from "@/lib/cvProfile";
import { computeLayout } from "@/lib/layoutEngine";
import { runDesignGuardian } from "@/lib/designGuardian";

function getBarColor(score: number) {
  if (score >= 70) return "from-gray-800 to-gray-600";
  if (score >= 50) return "from-amber-500 to-amber-600";
  return "from-red-500 to-red-600";
}

function getGrade(score: number) {
  if (score >= 80) return { label: "Excellent", color: "text-gray-900 bg-gray-100" };
  if (score >= 60) return { label: "Good", color: "text-blue-700 bg-blue-50" };
  if (score >= 40) return { label: "Needs Work", color: "text-amber-700 bg-amber-50" };
  return { label: "Poor", color: "text-red-700 bg-red-50" };
}

function CircularGauge({ score, size = 56, stroke = 5, label }: { score: number; size?: number; stroke?: number; label?: string }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "text-gray-900" : score >= 50 ? "text-amber-500" : "text-red-500";
  const trackColor = score >= 70 ? "#111827" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1 relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-700 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-sm font-bold ${color}`}>{score}</span>
      </div>
      {label && <span className="text-[10px] text-gray-500 font-medium">{label}</span>}
    </div>
  );
}

export function ScorePanel() {
  const { data, template, theme, layoutOverride, manualLayout, jobDescription } = useCVStore();
  const [activeTab, setActiveTab] = useState<"overview" | "ats" | "quality" | "job">("overview");

  const atsResult = useMemo(() => analyzeATS(data, template, jobDescription || undefined), [data, template, jobDescription]);
  const qualityResult = useMemo(() => analyzeQuality(data), [data]);
  const jobMatch = useMemo(
    () => (jobDescription ? analyzeJobMatch(data, jobDescription) : null),
    [data, jobDescription]
  );

  const guardianResult = useMemo(() => {
    try {
      const autoLayout = computeLayout(data, template);
      const finalLayout = layoutOverride ? { ...autoLayout, ...manualLayout } : autoLayout;
      return runDesignGuardian({ data, template, theme, layout: finalLayout, careerStage: "mid-level", contentDensity: "medium" });
    } catch { return null; }
  }, [data, template, theme, layoutOverride, manualLayout]);

  const scores = [atsResult.score, qualityResult.overall];
  if (jobMatch) scores.push(jobMatch.score);
  const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  const criticalIssues = guardianResult?.issues.filter((i) => i.severity === "critical") || [];
  const warnings = guardianResult?.issues.filter((i) => i.severity === "warning") || [];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm">
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {(["overview", "ats", "quality", "job"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 flex-1 min-w-0 px-2 py-3 text-[10px] font-bold transition-all uppercase tracking-wider ${
              activeTab === tab ? "text-gray-900 bg-gradient-to-b from-gray-50 to-transparent border-b-2 border-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab === "job" ? (jobMatch ? "Job" : "Job*") : tab}
          </button>
        ))}
      </div>

      <div className="p-3 sm:p-4">
        {activeTab === "overview" && (
          <div>
            {/* Overall Score */}
            <div className="flex items-center gap-4 mb-5">
              <div className="relative flex-shrink-0">
                <CircularGauge score={overallScore} size={64} stroke={6} />
                {criticalIssues.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center ring-2 ring-white">
                    {criticalIssues.length}
                  </span>
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Overall CV Health</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getGrade(overallScore).color}`}>
                  {getGrade(overallScore).label}
                </span>
              </div>
            </div>

            {/* Individual bars */}
            <div className="space-y-3">
              <ScoreBar label="ATS Compatibility" score={atsResult.score} getBarColor={getBarColor} />
              <ScoreBar label="Content Quality" score={qualityResult.overall} getBarColor={getBarColor} />
              {jobMatch ? (
                <ScoreBar label="Job Match" score={jobMatch.score} getBarColor={getBarColor} />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Job Match</span>
                  <span className="text-[10px] text-gray-400 italic">Paste a JD to enable</span>
                </div>
              )}
            </div>

            {/* Issues section */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              {criticalIssues.length > 0 ? (
                <div className="mb-2">
                  <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">Critical Issues</h4>
                  {criticalIssues.slice(0, 2).map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1.5 p-2 bg-red-50/50 rounded-lg">
                      <span className="text-red-500 text-xs mt-0.5 font-bold">!</span>
                      <div>
                        <span className="text-[11px] font-semibold text-gray-800 block">{issue.title}</span>
                        <span className="text-[10px] text-gray-500 leading-relaxed">{issue.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-start gap-2 p-2 bg-emerald-50/50 rounded-lg mb-2">
                  <span className="text-emerald-600 text-xs mt-0.5 font-bold">&#10003;</span>
                  <span className="text-xs text-gray-700">No critical issues found</span>
                </div>
              )}

              {warnings.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">Warnings</h4>
                  {warnings.slice(0, 2).map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1.5 p-2 bg-amber-50/50 rounded-lg">
                      <span className="text-amber-600 text-xs mt-0.5 font-bold">-</span>
                      <div>
                        <span className="text-[11px] font-semibold text-gray-800 block">{issue.title}</span>
                        <span className="text-[10px] text-gray-500 leading-relaxed">{issue.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "ats" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-shrink-0">
                <CircularGauge score={atsResult.score} size={56} stroke={5} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">ATS Score</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getGrade(atsResult.score).color}`}>{getGrade(atsResult.score).label}</span>
              </div>
            </div>

            {atsResult.issues.filter((i) => i.type === "critical").length > 0 && (
              <div className="mb-3">
                <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">Critical Issues</h4>
                {atsResult.issues.filter((i) => i.type === "critical").map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5 p-2 bg-red-50/50 rounded-lg">
                    <span className="text-red-500 text-xs mt-0.5 font-bold">!</span>
                    <span className="text-xs text-gray-700">{issue.message}</span>
                  </div>
                ))}
              </div>
            )}

            {atsResult.issues.filter((i) => i.type === "warning").length > 0 && (
              <div className="mb-3">
                <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">Warnings</h4>
                {atsResult.issues.filter((i) => i.type === "warning").slice(0, 4).map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5 p-2 bg-amber-50/50 rounded-lg">
                    <span className="text-amber-600 text-xs mt-0.5 font-bold">-</span>
                    <span className="text-xs text-gray-700">{issue.message}</span>
                  </div>
                ))}
              </div>
            )}

            {atsResult.passed.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-2">Passed</h4>
                {atsResult.passed.slice(0, 4).map((check, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5 p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-900 text-xs mt-0.5">&#10003;</span>
                    <span className="text-xs text-gray-700">{check}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "quality" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-shrink-0">
                <CircularGauge score={qualityResult.overall} size={56} stroke={5} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Content Quality</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getGrade(qualityResult.overall).color}`}>{getGrade(qualityResult.overall).label}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {qualityResult.dimensions.map((dim, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-gray-700">{dim.name}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{dim.score}/{dim.maxScore}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getBarColor((dim.score / dim.maxScore) * 100)}`}
                      style={{ width: `${(dim.score / dim.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {qualityResult.dimensions.length > 0 && qualityResult.dimensions[0].feedback.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tips</h4>
                {qualityResult.dimensions[0].feedback.slice(0, 3).map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5 p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-900 text-xs mt-0.5 font-bold">*</span>
                    <span className="text-xs text-gray-600">{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "job" && (
          <div>
            {!jobMatch ? (
              <div className="text-center py-6">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-400 text-lg">JD</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">No job description added</p>
                <p className="text-xs text-gray-400">Paste a job description in the sidebar to see your match score</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-shrink-0">
                    <CircularGauge score={jobMatch.score} size={56} stroke={5} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Job Match</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getGrade(jobMatch.score).color}`}>{getGrade(jobMatch.score).label}</span>
                  </div>
                </div>

                {jobMatch.strongMatches.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Matched Keywords</h4>
                    <div className="flex flex-wrap gap-1">
                      {jobMatch.strongMatches.slice(0, 8).map((kw, i) => (
                        <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}

                {jobMatch.missingKeywords.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-1">
                      {jobMatch.missingKeywords.slice(0, 6).map((kw, i) => (
                        <span key={i} className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}

                {jobMatch.suggestions.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Suggestions</h4>
                    {jobMatch.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 mb-1.5 p-2 bg-gray-50 rounded-lg">
                        <span className="text-gray-900 text-xs mt-0.5 font-bold">*</span>
                        <span className="text-xs text-gray-600">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreBar({ label, score, getBarColor }: { label: string; score: number; getBarColor: (s: number) => string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-gray-700">{label}</span>
        <span className="text-[10px] text-gray-400 font-medium">{score}/100</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${getBarColor(score)}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
