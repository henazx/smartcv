"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useCVStore } from "@/lib/store";
import { generateInterviewQuestions, evaluateAnswer, type InterviewSimQuestion, type AnswerEvaluation } from "@/lib/interviewSimulator";

type Phase = "setup" | "practice" | "review";

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  behavioral: { label: "Behavioral", color: "text-blue-700", bg: "bg-blue-100" },
  technical: { label: "Technical", color: "text-purple-700", bg: "bg-purple-100" },
  situational: { label: "Situational", color: "text-amber-700", bg: "bg-amber-100" },
  "role-specific": { label: "Role-Specific", color: "text-green-700", bg: "bg-green-100" },
  company: { label: "Company", color: "text-red-700", bg: "bg-red-100" },
};

export default function InterviewPage() {
  const { careerProfile, data, hydrateFromStorage } = useCVStore();
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<Phase>("setup");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState<InterviewSimQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluations, setEvaluations] = useState<Map<string, AnswerEvaluation>>(new Map());
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    hydrateFromStorage();
    setHydrated(true);
  }, [hydrateFromStorage]);

  const hasProfile = careerProfile.personal.fullName || careerProfile.experiences.length > 0 || careerProfile.skills.length > 0;

  const filteredQuestions = useMemo(() => {
    if (filterCategory === "all") return questions;
    return questions.filter((q) => q.category === filterCategory);
  }, [questions, filterCategory]);

  const startPractice = () => {
    const cp = hasProfile ? careerProfile : {
      ...careerProfile,
      personal: { ...careerProfile.personal, fullName: data.personal.fullName },
      experiences: careerProfile.experiences.length > 0 ? careerProfile.experiences : data.experiences,
      skills: careerProfile.skills.length > 0 ? careerProfile.skills : data.skills,
    };
    const qs = generateInterviewQuestions(cp, jobDescription || "Looking for a motivated professional to join our team", jobTitle || "the position");
    setQuestions(qs);
    setCurrentIdx(0);
    setAnswer("");
    setEvaluations(new Map());
    setShowEvaluation(false);
    setPhase("practice");
  };

  const submitAnswer = () => {
    const cp = hasProfile ? careerProfile : {
      ...careerProfile,
      personal: { ...careerProfile.personal, fullName: data.personal.fullName },
      experiences: careerProfile.experiences.length > 0 ? careerProfile.experiences : data.experiences,
      skills: careerProfile.skills.length > 0 ? careerProfile.skills : data.skills,
    };
    const eval_ = evaluateAnswer(filteredQuestions[currentIdx], answer, cp);
    const newEvals = new Map(evaluations);
    newEvals.set(filteredQuestions[currentIdx].id, eval_);
    setEvaluations(newEvals);
    setShowEvaluation(true);
  };

  const nextQuestion = () => {
    if (currentIdx < filteredQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setAnswer("");
      setShowEvaluation(false);
    } else {
      setPhase("review");
    }
  };

  const currentQuestion = filteredQuestions[currentIdx];
  const currentEval = currentQuestion ? evaluations.get(currentQuestion.id) : null;

  const overallScore = useMemo(() => {
    if (evaluations.size === 0) return 0;
    const scores = Array.from(evaluations.values()).map((e) => e.score);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [evaluations]);

  const categories = useMemo(() => {
    const cats = new Set(questions.map((q) => q.category));
    return Array.from(cats);
  }, [questions]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900">SmartCV</Link>
            <h1 className="text-xl font-bold text-gray-900 mt-1">Interview Simulator</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/job-match" className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50">Job Match</Link>
            <Link href="/applications" className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50">Applications</Link>
            <Link href="/readiness" className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50">Readiness</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {!hydrated ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : phase === "setup" ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="text-4xl mb-4">{"\uD83C\uDfaf"}</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Practice Your Interview</h2>
              <p className="text-sm text-gray-600 mb-6">
                Get personalized interview questions based on the job and your Career Twin. Practice your answers and receive instant feedback.
              </p>

              <div className="space-y-3 text-left mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Job Title</label>
                  <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Job Description (optional - improves questions)</label>
                  <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job description here..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 resize-none" rows={5} />
                </div>
              </div>

              <button onClick={startPractice} className="w-full px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all">
                Start Practice
              </button>

              {!hasProfile && (
                <Link href="/career-twin" className="mt-3 block text-xs text-gray-500 hover:text-gray-700">
                  Set up your Career Twin for more personalized questions
                </Link>
              )}
            </div>
          </div>
        ) : phase === "practice" ? (
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-900">Question {currentIdx + 1} of {filteredQuestions.length}</span>
                <span className="text-xs text-gray-500">Score: {overallScore}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gray-900 to-gray-600 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / filteredQuestions.length) * 100}%` }} />
              </div>
              {/* Category filters */}
              <div className="flex gap-2 mt-3 flex-wrap">
                <button onClick={() => { setFilterCategory("all"); setCurrentIdx(0); setAnswer(""); setShowEvaluation(false); }} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${filterCategory === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  All ({questions.length})
                </button>
                {categories.map((cat) => (
                  <button key={cat} onClick={() => { setFilterCategory(cat); setCurrentIdx(0); setAnswer(""); setShowEvaluation(false); }} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${filterCategory === cat ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {CATEGORY_CONFIG[cat]?.label || cat} ({questions.filter((q) => q.category === cat).length})
                  </button>
                ))}
              </div>
            </div>

            {currentQuestion && (
              <div className="space-y-4">
                {/* Question */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${CATEGORY_CONFIG[currentQuestion.category]?.bg || "bg-gray-100"} ${CATEGORY_CONFIG[currentQuestion.category]?.color || "text-gray-600"}`}>
                      {CATEGORY_CONFIG[currentQuestion.category]?.label || currentQuestion.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{currentQuestion.question}</h3>
                  <p className="text-xs text-gray-500 italic">{currentQuestion.context}</p>
                </div>

                {/* Answer Input */}
                {!showEvaluation ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <label className="block text-xs font-bold text-gray-700 mb-2">Your Answer</label>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here. Try to be specific and use examples..."
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 resize-none leading-relaxed"
                      rows={8}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-gray-400">{answer.split(/\s+/).filter((w) => w.length > 0).length} words</span>
                      <button
                        onClick={submitAnswer}
                        disabled={!answer.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all disabled:opacity-40"
                      >
                        Evaluate Answer
                      </button>
                    </div>
                  </div>
                ) : currentEval && (
                  /* Evaluation */
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-gray-900">Evaluation</h4>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${currentEval.score >= 70 ? "bg-green-100 text-green-700" : currentEval.score >= 40 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                        {currentEval.score}%
                      </div>
                    </div>

                    {currentEval.strengths.length > 0 && (
                      <div>
                        <h5 className="text-[10px] font-bold text-green-700 uppercase mb-2">Strengths</h5>
                        <ul className="space-y-1">
                          {currentEval.strengths.map((s, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">{"\u2713"}</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentEval.improvements.length > 0 && (
                      <div>
                        <h5 className="text-[10px] font-bold text-amber-700 uppercase mb-2">To Improve</h5>
                        <ul className="space-y-1">
                          {currentEval.improvements.map((s, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                              <span className="text-amber-500 mt-0.5">{"\u25B2"}</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentEval.tips.length > 0 && (
                      <div>
                        <h5 className="text-[10px] font-bold text-blue-700 uppercase mb-2">Tips</h5>
                        <ul className="space-y-1">
                          {currentEval.tips.map((s, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">{"\u2022"}</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Evaluation Criteria */}
                    <div className="pt-3 border-t border-gray-100">
                      <h5 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Evaluation Criteria</h5>
                      <div className="flex flex-wrap gap-1">
                        {currentQuestion.evaluationCriteria.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-[10px]">{c}</span>
                        ))}
                      </div>
                    </div>

                    <button onClick={nextQuestion} className="w-full px-6 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all">
                      {currentIdx < filteredQuestions.length - 1 ? "Next Question" : "See Results"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Review Phase */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="text-4xl mb-4">{"\uD83C\uDF89"}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Practice Complete!</h2>
              <p className="text-sm text-gray-500 mb-4">You answered {evaluations.size} questions</p>
              <div className={`text-5xl font-extrabold mb-2 ${overallScore >= 70 ? "text-green-600" : overallScore >= 40 ? "text-amber-600" : "text-red-600"}`}>
                {overallScore}%
              </div>
              <p className="text-sm text-gray-500">Overall Score</p>
            </div>

            {/* Results by Category */}
            {categories.map((cat) => {
              const catQuestions = questions.filter((q) => q.category === cat);
              const catEvals = catQuestions.map((q) => evaluations.get(q.id)).filter(Boolean);
              const catScore = catEvals.length > 0 ? Math.round(catEvals.reduce((a, e) => a + (e?.score || 0), 0) / catEvals.length) : 0;

              return (
                <div key={cat} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${CATEGORY_CONFIG[cat]?.bg || "bg-gray-100"} ${CATEGORY_CONFIG[cat]?.color || "text-gray-600"}`}>
                      {CATEGORY_CONFIG[cat]?.label || cat}
                    </span>
                    <span className={`text-sm font-bold ${catScore >= 70 ? "text-green-600" : catScore >= 40 ? "text-amber-600" : "text-red-600"}`}>
                      {catScore}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    {catQuestions.map((q) => {
                      const ev = evaluations.get(q.id);
                      return (
                        <div key={q.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                          <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${ev && ev.score >= 70 ? "bg-green-100 text-green-700" : ev && ev.score >= 40 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                            {ev ? ev.score : "-"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 line-clamp-2">{q.question}</p>
                            {ev && ev.strengths.length > 0 && (
                              <p className="text-[10px] text-green-600 mt-1">Top strength: {ev.strengths[0]}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="flex gap-3">
              <button onClick={() => { setPhase("setup"); setQuestions([]); setEvaluations(new Map()); }} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
                Practice Again
              </button>
              <Link href="/applications" className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all text-center">
                View Applications
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
