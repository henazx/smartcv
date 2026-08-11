"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCVStore } from "@/lib/store";
import { generateCoverLetter, getCoverLetterText, getWordCount } from "@/lib/coverLetter";

export default function CoverLetterPage() {
  const { careerProfile, coverLetter, setCoverLetter, updateCoverLetterParagraph, hydrateFromStorage, data } = useCVStore();
  const [hydrated, setHydrated] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [editingParagraph, setEditingParagraph] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    hydrateFromStorage();
    setHydrated(true);
    if (coverLetter) {
      setJobTitle(coverLetter.jobTitle);
      setCompanyName(coverLetter.companyName);
    }
  }, [hydrateFromStorage, coverLetter]);

  const hasProfile = careerProfile.personal.fullName || careerProfile.experiences.length > 0 || careerProfile.skills.length > 0;

  const handleGenerate = () => {
    const cp = hasProfile ? careerProfile : {
      ...careerProfile,
      personal: {
        ...careerProfile.personal,
        fullName: data.personal.fullName || careerProfile.personal.fullName,
        headline: data.personal.headline || careerProfile.personal.headline,
        email: data.personal.email || careerProfile.personal.email,
        summary: data.personal.summary || careerProfile.personal.summary,
      },
      experiences: careerProfile.experiences.length > 0 ? careerProfile.experiences : data.experiences,
      skills: careerProfile.skills.length > 0 ? careerProfile.skills : data.skills,
    };
    const cl = generateCoverLetter(cp, jobDescription || "Looking for a motivated professional to join our team", jobTitle || undefined, companyName || undefined);
    setCoverLetter(cl);
    setJobTitle(cl.jobTitle);
    setCompanyName(cl.companyName);
  };

  const startEditing = (paragraphId: string, content: string) => {
    setEditingParagraph(paragraphId);
    setEditContent(content);
  };

  const saveEdit = () => {
    if (editingParagraph) {
      updateCoverLetterParagraph(editingParagraph, editContent);
      setEditingParagraph(null);
    }
  };

  const wordCount = coverLetter ? getWordCount(coverLetter) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900">SmartCV</Link>
            <h1 className="text-xl font-bold text-gray-900 mt-1">Cover Letter</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/job-match" className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50">Job Match</Link>
            <Link href="/applications" className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50">Applications</Link>
            <Link href="/interview" className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50">Interview</Link>
            <Link href="/readiness" className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50">Readiness</Link>
            <Link href="/career-twin" className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50">Career Twin</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {!hydrated ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : !coverLetter ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="text-4xl mb-4">{"\u2709\uFE0F"}</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Create Your Cover Letter</h2>
              <p className="text-sm text-gray-600 mb-6">
                {hasProfile
                  ? "Generate a tailored cover letter from your Career Twin profile."
                  : "Import your CV data into Career Twin first, or generate with basic info."}
              </p>

              <div className="space-y-3 text-left mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Job Title</label>
                  <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name</label>
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Google" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Job Description (optional - improves tailoring)</label>
                  <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job description here..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 resize-none" rows={5} />
                </div>
              </div>

              <button onClick={handleGenerate} className="w-full px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all">
                Generate Cover Letter
              </button>

              {!hasProfile && (
                <Link href="/career-twin" className="mt-3 block text-xs text-gray-500 hover:text-gray-700">
                  Or set up your Career Twin first for better results
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Edit Cover Letter</h2>
                <p className="text-xs text-gray-500">{coverLetter.jobTitle} at {coverLetter.companyName} &middot; {wordCount} words</p>
              </div>

              <div className="space-y-4">
                {coverLetter.paragraphs.map((para) => (
                  <div key={para.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{para.type}</span>
                      <button onClick={() => startEditing(para.id, para.content)} className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold">Edit</button>
                    </div>
                    {editingParagraph === para.id ? (
                      <div>
                        <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 resize-none" rows={6} />
                        <div className="flex gap-2 mt-2">
                          <button onClick={saveEdit} className="px-3 py-1 bg-gray-900 text-white text-xs rounded-lg font-semibold">Save</button>
                          <button onClick={() => setEditingParagraph(null)} className="px-3 py-1 border border-gray-200 text-gray-700 text-xs rounded-lg font-semibold">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{para.content}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={handleGenerate} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
                  Regenerate
                </button>
                <Link href="/export" className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all text-center">
                  Export PDF
                </Link>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                  <div className="text-lg font-bold text-gray-900">{careerProfile.personal.fullName || data.personal.fullName || "Your Name"}</div>
                  <div className="text-xs text-gray-500 mt-1">{careerProfile.personal.email || data.personal.email}</div>
                  <div className="text-xs text-gray-500">{careerProfile.personal.phone || data.personal.phone}</div>
                </div>
                <div className="text-xs text-gray-500 mb-4">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
                <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {getCoverLetterText(coverLetter)}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
