"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useCVStore } from "@/lib/store";
import { analyzeATS } from "@/lib/atsScorer";
import { analyzeQuality } from "@/lib/cvQuality";
import { analyzeJobMatch } from "@/lib/cvProfile";

interface SectionStatus {
  name: string;
  filled: boolean;
  count: number;
  label: string;
}

export function FinalReview() {
  const { data, jobDescription, template } = useCVStore();

  const atsResult = useMemo(() => analyzeATS(data, template), [data, template]);
  const qualityResult = useMemo(() => analyzeQuality(data), [data]);
  const jobMatch = useMemo(
    () => (jobDescription ? analyzeJobMatch(data, jobDescription) : null),
    [data, jobDescription]
  );

  const sections: SectionStatus[] = [
    { name: "personal", filled: !!data.personal.fullName, count: 1, label: "Personal Info" },
    { name: "summary", filled: !!data.personal.summary, count: 1, label: "Summary" },
    { name: "experience", filled: data.experiences.length > 0, count: data.experiences.length, label: "Experience" },
    { name: "education", filled: data.education.length > 0, count: data.education.length, label: "Education" },
    { name: "skills", filled: data.skills.length > 0, count: data.skills.length, label: "Skills" },
    { name: "projects", filled: data.projects.length > 0, count: data.projects.length, label: "Projects" },
    { name: "languages", filled: data.languages.length > 0, count: data.languages.length, label: "Languages" },
    { name: "certifications", filled: data.certifications.length > 0, count: data.certifications.length, label: "Certifications" },
    { name: "awards", filled: data.awards.length > 0, count: data.awards.length, label: "Awards" },
    { name: "publications", filled: data.publications.length > 0, count: data.publications.length, label: "Publications" },
  ];

  const filledCount = sections.filter((s) => s.filled).length;
  const completeness = Math.round((filledCount / sections.length) * 100);

  const overallScore = jobMatch
    ? Math.round((atsResult.score + qualityResult.overall + jobMatch.score) / 3)
    : Math.round((atsResult.score + qualityResult.overall) / 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-x-hidden animate-fade-in">
      <div className="h-1.5 w-full bg-gradient-to-r from-gray-900 via-gray-500 to-gray-300" />

      <nav className="border-b border-gray-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-gray-900 to-gray-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xs sm:text-sm">S</span>
            </div>
            <span className="text-base sm:text-lg font-bold text-gray-900">SmartCV</span>
          </Link>
          <div className="flex gap-1.5 sm:gap-2">
            <Link href="/build" className="px-3 sm:px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-all">
              Back to Editor
            </Link>
            <Link href="/export" className="px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-xs font-semibold hover:from-gray-800 hover:to-gray-600 transition-all shadow-md">
              Export PDF
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Final CV Review</h1>
          <p className="text-sm text-gray-500">Review your CV before exporting</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-4 sm:p-6 text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-3 relative">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={overallScore >= 70 ? "#16a34a" : overallScore >= 40 ? "#d97706" : "#dc2626"} strokeWidth="3" strokeDasharray={`${overallScore}, 100`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{overallScore}</span>
                </div>
              </div>
              <h3 className="font-bold text-gray-900">Overall Score</h3>
              <p className="text-xs text-gray-500 mt-1">{overallScore >= 70 ? "Ready to export" : "Needs improvement"}</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-full" />
            <div className="relative">
              <h3 className="font-bold text-gray-900 mb-3">Score Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">ATS Score</span>
                    <span className="font-bold text-gray-900">{atsResult.score}/100</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-600 h-1.5 rounded-full" style={{ width: `${atsResult.score}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Content Quality</span>
                    <span className="font-bold text-gray-900">{qualityResult.overall}/100</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-600 h-1.5 rounded-full" style={{ width: `${qualityResult.overall}%` }} />
                  </div>
                </div>
                {jobMatch && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Job Match</span>
                      <span className="font-bold text-gray-900">{jobMatch.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-gray-900 to-gray-600 h-1.5 rounded-full" style={{ width: `${jobMatch.score}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-full" />
            <div className="relative">
              <h3 className="font-bold text-gray-900 mb-3">Completeness</h3>
              <div className="text-center mb-3">
                <span className="text-3xl font-extrabold text-gray-900">{completeness}%</span>
                <p className="text-xs text-gray-500">{filledCount}/{sections.length} sections filled</p>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {sections.map((s) => (
                  <div
                    key={s.name}
                    className={`h-2 rounded-full ${s.filled ? "bg-gradient-to-r from-gray-900 to-gray-600" : "bg-gray-200"}`}
                    title={`${s.label}: ${s.filled ? `${s.count} items` : "Empty"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-100 via-gray-50 to-transparent rounded-bl-full" />
          <div className="relative">
            <h3 className="font-bold text-gray-900 mb-4">Section Summary</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {sections.map((s) => (
                <div
                  key={s.name}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    s.filled ? "border-gray-200/80 bg-white/50" : "border-dashed border-gray-300 bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${s.filled ? "bg-gradient-to-br from-gray-900 to-gray-600" : "bg-gray-200"}`}>
                      {s.filled ? (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${s.filled ? "text-gray-900" : "text-gray-400"}`}>{s.label}</span>
                  </div>
                  <span className={`text-xs ${s.filled ? "text-gray-600" : "text-gray-400"}`}>
                    {s.filled ? `${s.count} item${s.count !== 1 ? "s" : ""}` : "Empty"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {atsResult.issues.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-100 via-gray-50 to-transparent rounded-bl-full" />
            <div className="relative">
              <h3 className="font-bold text-gray-900 mb-4">Issues to Fix</h3>
              <div className="space-y-2">
                {atsResult.issues.slice(0, 5).map((issue, i) => (
                  <div key={i} className={`p-3 rounded-xl border text-sm ${
                    issue.type === "critical" ? "border-red-200 bg-red-50/50 text-red-800" :
                    issue.type === "warning" ? "border-amber-200 bg-amber-50/50 text-amber-800" :
                    "border-gray-200 bg-gray-50/50 text-gray-600"
                  }`}>
                    <span className="font-semibold">{issue.message}</span>
                    {issue.fix && <span className="text-xs ml-2 opacity-70">- {issue.fix}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/export"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl font-bold hover:from-gray-800 hover:to-gray-600 transition-all shadow-lg hover:shadow-xl text-base sm:text-lg"
          >
            Export as PDF
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
