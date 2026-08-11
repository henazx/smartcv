"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useCVStore } from "@/lib/store";
import { computeProfile } from "@/lib/cvProfile";
import { analyzeATS } from "@/lib/atsScorer";
import { analyzeQuality } from "@/lib/cvQuality";

interface ReadinessScores {
  overall: number;
  cvHealth: number;
  ats: number;
  quality: number;
  completeness: number;
}

function getGrade(score: number): { grade: string; color: string } {
  if (score >= 90) return { grade: "A+", color: "text-green-600" };
  if (score >= 80) return { grade: "A", color: "text-green-600" };
  if (score >= 70) return { grade: "B+", color: "text-blue-600" };
  if (score >= 60) return { grade: "B", color: "text-blue-600" };
  if (score >= 50) return { grade: "C", color: "text-amber-600" };
  if (score >= 40) return { grade: "D", color: "text-orange-600" };
  return { grade: "F", color: "text-red-600" };
}

export default function ReadinessPage() {
  const { data, cvType, applicationGoal, targetJobTitle, targetIndustry, template, hydrateFromStorage, applications } = useCVStore();
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hydrateFromStorage();
    setHydrated(true);
  }, [hydrateFromStorage]);

  const scores = useMemo((): ReadinessScores => {
    const profile = computeProfile(cvType, applicationGoal, targetJobTitle, targetIndustry, data);
    const ats = analyzeATS(data, template, targetJobTitle);
    const quality = analyzeQuality(data);

    // Compute CV Health score based on profile data
    const profileScore = Math.min(100, (
      (profile.experienceYears > 0 ? 20 : 0) +
      (profile.recommendedSections.length > 3 ? 20 : profile.recommendedSections.length * 5) +
      (profile.recommendedSkills.length > 3 ? 20 : profile.recommendedSkills.length * 5) +
      (profile.roleKeywords.length > 3 ? 20 : profile.roleKeywords.length * 5) +
      (profile.atsPriority === "high" ? 20 : profile.atsPriority === "medium" ? 10 : 5)
    ));

    // Completeness: how many sections have content
    const sections = [
      data.personal.fullName,
      data.personal.summary,
      data.experiences.length > 0,
      data.education.length > 0,
      data.skills.length > 0,
      data.personal.email,
    ];
    const completeness = Math.round((sections.filter(Boolean).length / sections.length) * 100);

    const overall = Math.round((profileScore * 0.35) + (ats.score * 0.3) + (quality.overall * 0.2) + (completeness * 0.15));

    return { overall, cvHealth: profileScore, ats: ats.score, quality: quality.overall, completeness };
  }, [data, targetJobTitle, targetIndustry, cvType, applicationGoal, template]);

  const stats = useMemo(() => {
    const yearsExp = data.experiences.reduce((total, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : new Date(exp.endDate);
      const years = (end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      return total + Math.max(0, years);
    }, 0);

    return {
      yearsExperience: Math.round(yearsExp * 10) / 10,
      skillsCount: data.skills.length,
      experiencesCount: data.experiences.length,
      educationCount: data.education.length,
      applicationsCount: applications.length,
    };
  }, [data, applications]);

  const strengths = useMemo(() => {
    const s: string[] = [];
    if (data.personal.summary) s.push("Professional summary present");
    if (data.experiences.length >= 3) s.push(`${data.experiences.length} work experiences`);
    if (data.skills.length >= 5) s.push(`${data.skills.length} skills listed`);
    if (data.education.length > 0) s.push("Education background");
    if (data.personal.linkedIn) s.push("LinkedIn profile included");
    if (data.personal.github) s.push("GitHub profile included");
    if (data.projects.length > 0) s.push(`${data.projects.length} projects showcased`);
    if (data.certifications.length > 0) s.push(`${data.certifications.length} certifications`);
    return s.slice(0, 5);
  }, [data]);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/readiness` : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const overallGrade = getGrade(scores.overall);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900">SmartCV</Link>
            <h1 className="text-xl font-bold text-gray-900 mt-1">Career Readiness</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/build" className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50">Builder</Link>
            <Link href="/export" className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg text-sm font-semibold hover:from-gray-800 hover:to-gray-600">Export</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {!hydrated ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-8">
            {/* Career Readiness Card */}
            <div ref={cardRef} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              {/* Header gradient */}
              <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 px-8 py-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Career Readiness Card</h2>
                    <p className="text-xs text-gray-300 mt-1">Your professional profile at a glance</p>
                  </div>
                  <div className={`text-5xl font-extrabold ${overallGrade.color} bg-white/10 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center`}>
                    {overallGrade.grade}
                  </div>
                </div>
              </div>

              {/* Scores */}
              <div className="px-8 py-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Overall", score: scores.overall, icon: "\u2B50" },
                    { label: "CV Health", score: scores.cvHealth, icon: "\uD83D\uDCC4" },
                    { label: "ATS Score", score: scores.ats, icon: "\uD83D\uDD0D" },
                    { label: "Quality", score: scores.quality, icon: "\u2728" },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="text-lg mb-1">{item.icon}</div>
                      <div className={`text-2xl font-extrabold ${item.score >= 70 ? "text-green-600" : item.score >= 40 ? "text-amber-600" : "text-red-600"}`}>
                        {item.score}
                      </div>
                      <div className="text-[10px] font-semibold text-gray-500">{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {[
                    { value: stats.yearsExperience, label: "Years Exp" },
                    { value: stats.skillsCount, label: "Skills" },
                    { value: stats.experiencesCount, label: "Roles" },
                    { value: stats.educationCount, label: "Education" },
                    { value: stats.applicationsCount, label: "Applications" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                      <div className="text-[9px] text-gray-400 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Strengths */}
                {strengths.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Key Strengths</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {strengths.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Branding */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                      <span className="text-white font-bold text-[8px]">S</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">SmartCV</span>
                  </div>
                  <span className="text-[9px] text-gray-300">Generated {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Share Your Readiness</h3>
              <div className="flex gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <span className="text-green-400">{"\u2713"}</span> Copied!
                    </>
                  ) : (
                    <>
                      <span>{"\uD83D\uDD17"}</span> Copy Link
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    if (cardRef.current) {
                      const printWindow = window.open("", "_blank");
                      if (printWindow) {
                        printWindow.document.write(`
                          <html><head><title>Career Readiness Card</title>
                          <style>body{margin:0;padding:20px;font-family:system-ui,-apple-system,sans-serif;}</style>
                          </head><body>${cardRef.current.outerHTML}</body></html>
                        `);
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <span>{"\uD83D\uDDA8"}</span> Print / Save PDF
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-3 text-center">
                Share your career readiness score with recruiters or on LinkedIn
              </p>
            </div>

            {/* Improvement Suggestions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">How to Improve</h3>
              <div className="space-y-3">
                {!data.personal.summary && (
                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                    <span className="text-amber-500 mt-0.5">{"\u26A0"}</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Add a professional summary</p>
                      <p className="text-[10px] text-gray-500">A 2-3 sentence summary highlights your key strengths</p>
                    </div>
                  </div>
                )}
                {data.experiences.length < 2 && (
                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                    <span className="text-amber-500 mt-0.5">{"\u26A0"}</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Add more work experience</p>
                      <p className="text-[10px] text-gray-500">Include relevant roles with specific achievements</p>
                    </div>
                  </div>
                )}
                {data.skills.length < 5 && (
                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                    <span className="text-amber-500 mt-0.5">{"\u26A0"}</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Add more skills</p>
                      <p className="text-[10px] text-gray-500">List 5-15 relevant technical and soft skills</p>
                    </div>
                  </div>
                )}
                {data.skills.length >= 5 && data.experiences.length >= 2 && data.personal.summary && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                    <span className="text-green-500 mt-0.5">{"\u2713"}</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Your CV is looking strong!</p>
                      <p className="text-[10px] text-gray-500">Consider tailoring it for specific jobs using Job Match</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { href: "/career-twin", label: "Career Twin", icon: "\uD83E\uDDE0" },
                { href: "/job-match", label: "Job Match", icon: "\u2694" },
                { href: "/interview", label: "Interview Prep", icon: "\uD83C\uDfaf" },
                { href: "/applications", label: "Applications", icon: "\uD83D\uDCCB" },
              ].map((action) => (
                <Link key={action.href} href={action.href} className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-sm transition-all">
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <div className="text-xs font-bold text-gray-900">{action.label}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
