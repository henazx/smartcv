"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCVStore } from "@/lib/store";
import { generateRecruiterMessage, generateInterviewQuestions } from "@/lib/applicationPack";
import type { Application, ApplicationStatus } from "@/types";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  saved: { label: "Saved", color: "text-gray-600", bg: "bg-gray-100" },
  applied: { label: "Applied", color: "text-blue-700", bg: "bg-blue-100" },
  interview: { label: "Interview", color: "text-purple-700", bg: "bg-purple-100" },
  offer: { label: "Offer", color: "text-green-700", bg: "bg-green-100" },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-100" },
  withdrawn: { label: "Withdrawn", color: "text-gray-500", bg: "bg-gray-50" },
};

const STATUS_ORDER: ApplicationStatus[] = ["saved", "applied", "interview", "offer", "rejected", "withdrawn"];

export default function ApplicationsPage() {
  const { applications, updateApplication, removeApplication, careerProfile, data, hydrateFromStorage } = useCVStore();
  const [hydrated, setHydrated] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "all">("all");
  const [showActions, setShowActions] = useState<string | null>(null);
  const [recruiterMsg, setRecruiterMsg] = useState("");
  const [interviewQuestions, setInterviewQuestions] = useState<Awaited<ReturnType<typeof generateInterviewQuestions>>>([]);

  useEffect(() => {
    hydrateFromStorage();
    setHydrated(true);
  }, [hydrateFromStorage]);

  const filteredApps = filterStatus === "all" ? applications : applications.filter((a) => a.status === filterStatus);

  const pipelineCounts = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = applications.filter((a) => a.status === status).length;
    return acc;
  }, {} as Record<ApplicationStatus, number>);

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    const updates: Partial<Application> = { status: newStatus };
    if (newStatus === "applied") updates.appliedAt = new Date().toISOString();
    if (newStatus === "interview") updates.interviewAt = new Date().toISOString();
    updateApplication(appId, updates);
    setShowActions(null);
  };

  const handleGenerateRecruiterMsg = (app: Application) => {
    const cp = careerProfile.personal.fullName ? careerProfile : {
      ...careerProfile,
      personal: { ...careerProfile.personal, fullName: data.personal.fullName },
      experiences: careerProfile.experiences.length > 0 ? careerProfile.experiences : data.experiences,
      skills: careerProfile.skills.length > 0 ? careerProfile.skills : data.skills,
    };
    const msg = generateRecruiterMessage(cp, app.jobDescription, app.jobTitle, app.companyName);
    setRecruiterMsg(msg);
    setSelectedApp(app);
  };

  const handleGenerateInterviewPrep = (app: Application) => {
    const cp = careerProfile.personal.fullName ? careerProfile : {
      ...careerProfile,
      personal: { ...careerProfile.personal, fullName: data.personal.fullName },
      experiences: careerProfile.experiences.length > 0 ? careerProfile.experiences : data.experiences,
      skills: careerProfile.skills.length > 0 ? careerProfile.skills : data.skills,
    };
    const questions = generateInterviewQuestions(cp, app.jobDescription, app.jobTitle);
    setInterviewQuestions(questions);
    setSelectedApp(app);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900">SmartCV</Link>
            <h1 className="text-xl font-bold text-gray-900 mt-1">Applications</h1>
            <p className="text-xs text-gray-500">{applications.length} total &middot; {pipelineCounts.applied + pipelineCounts.interview} active</p>
          </div>
          <div className="flex gap-2">
            <Link href="/job-match" className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50">Job Match</Link>
            <Link href="/career-twin" className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50">Career Twin</Link>
            <Link href="/readiness" className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50">Readiness</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {!hydrated ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">{"\uD83D\uDCCB"}</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No applications yet</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Start by analyzing a job description. Save it to your tracker to monitor your application progress.
            </p>
            <Link href="/job-match" className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all inline-block">
              Analyze a Job
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pipeline View */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Pipeline</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {STATUS_ORDER.map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(filterStatus === status ? "all" : status)}
                    className={`p-3 rounded-xl text-center transition-all ${filterStatus === status ? "ring-2 ring-gray-900 bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}`}
                  >
                    <div className="text-lg font-bold text-gray-900">{pipelineCounts[status]}</div>
                    <div className={`text-[10px] font-semibold ${STATUS_CONFIG[status].color}`}>{STATUS_CONFIG[status].label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-3">
              {filteredApps.map((app) => (
                <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-gray-900 truncate">{app.jobTitle}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_CONFIG[app.status].bg} ${STATUS_CONFIG[app.status].color}`}>
                          {STATUS_CONFIG[app.status].label}
                        </span>
                        {app.matchScore !== null && (
                          <span className={`text-[10px] font-bold ${app.matchScore >= 70 ? "text-green-600" : app.matchScore >= 40 ? "text-amber-600" : "text-red-600"}`}>
                            {app.matchScore}% match
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{app.companyName} &middot; Saved {new Date(app.createdAt).toLocaleDateString()}</p>
                      {app.notes && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{app.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleGenerateRecruiterMsg(app)}
                        className="px-3 py-1.5 text-[10px] font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        Message
                      </button>
                      <button
                        onClick={() => handleGenerateInterviewPrep(app)}
                        className="px-3 py-1.5 text-[10px] font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        Prep
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === app.id ? null : app.id)}
                          className="px-2 py-1.5 text-gray-400 hover:text-gray-600"
                        >
                          {"\u22EE"}
                        </button>
                        {showActions === app.id && (
                          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg z-10 w-40 py-1">
                            {STATUS_ORDER.filter((s) => s !== app.status).map((status) => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(app.id, status)}
                                className="w-full px-3 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50"
                              >
                                Move to {STATUS_CONFIG[status].label}
                              </button>
                            ))}
                            <div className="border-t border-gray-100 my-1" />
                            <button
                              onClick={() => { removeApplication(app.id); setShowActions(null); }}
                              className="w-full px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recruiter Message Modal */}
        {selectedApp && recruiterMsg && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setSelectedApp(null); setRecruiterMsg(""); }}>
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Recruiter Message</h3>
              <p className="text-xs text-gray-500 mb-4">For {selectedApp.jobTitle} at {selectedApp.companyName}</p>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">{recruiterMsg}</div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => { navigator.clipboard.writeText(recruiterMsg); }} className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold">Copy</button>
                <button onClick={() => { setSelectedApp(null); setRecruiterMsg(""); }} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Interview Prep Modal */}
        {selectedApp && interviewQuestions.length > 0 && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setSelectedApp(null); setInterviewQuestions([]); }}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Interview Prep</h3>
              <p className="text-xs text-gray-500 mb-4">For {selectedApp.jobTitle} at {selectedApp.companyName}</p>
              <div className="space-y-4">
                {interviewQuestions.map((q) => (
                  <div key={q.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        q.category === "behavioral" ? "bg-blue-100 text-blue-700" :
                        q.category === "technical" ? "bg-purple-100 text-purple-700" :
                        q.category === "situational" ? "bg-amber-100 text-amber-700" :
                        "bg-green-100 text-green-700"
                      }`}>{q.category}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">{q.question}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{q.tip}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => { setSelectedApp(null); setInterviewQuestions([]); }} className="w-full mt-4 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold">Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
