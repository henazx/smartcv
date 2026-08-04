"use client";

import React, { useState } from "react";
import { useCVStore } from "@/lib/store";
import type { CVType, ApplicationGoal, SectionId } from "@/types";
import { ethiopianIndustries } from "@/lib/ethiopianData";
import { ROLE_DATABASE } from "@/lib/cvProfile";

const cvTypes: { value: CVType; label: string; desc: string; icon: string; gradient: string }[] = [
  { value: "first-job", label: "First Job", desc: "Entering the workforce for the first time", icon: "1", gradient: "from-blue-500 to-blue-600" },
  { value: "internship", label: "Internship", desc: "Applying for internship opportunities", icon: "I", gradient: "from-violet-500 to-violet-600" },
  { value: "scholarship", label: "Scholarship", desc: "Applying for academic scholarships", icon: "S", gradient: "from-amber-500 to-amber-600" },
  { value: "graduate-job", label: "Graduate Job", desc: "Recent graduate looking for work", icon: "G", gradient: "from-emerald-500 to-emerald-600" },
  { value: "experienced", label: "Experienced", desc: "Moving to a new role or company", icon: "E", gradient: "from-gray-700 to-gray-900" },
  { value: "academic", label: "Academic CV", desc: "Research, teaching, or PhD applications", icon: "A", gradient: "from-rose-500 to-rose-600" },
  { value: "tech-developer", label: "Tech / Developer", desc: "Software engineering or IT roles", icon: "T", gradient: "from-cyan-500 to-cyan-600" },
  { value: "creative-design", label: "Creative / Design", desc: "Design, media, or creative roles", icon: "C", gradient: "from-pink-500 to-pink-600" },
  { value: "international", label: "International", desc: "Applying for jobs abroad or remote", icon: "R", gradient: "from-indigo-500 to-indigo-600" },
];

const goals: { value: ApplicationGoal; label: string; desc: string; icon: string }[] = [
  { value: "job", label: "Job Application", desc: "Full-time employment", icon: "💼" },
  { value: "internship", label: "Internship", desc: "Internship or training position", icon: "📚" },
  { value: "scholarship", label: "Scholarship", desc: "Academic scholarship or fellowship", icon: "🎓" },
  { value: "fellowship", label: "Fellowship", desc: "Professional fellowship program", icon: "🤝" },
  { value: "graduate-program", label: "Graduate Program", desc: "Masters or PhD program", icon: "📖" },
  { value: "remote-job", label: "Remote Job", desc: "Working remotely for any company", icon: "🌍" },
  { value: "international-job", label: "International Job", desc: "Working abroad or for global company", icon: "✈️" },
];

const stepLabels = ["CV Type", "Goal", "Details"];

function ProgressIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex flex-col items-center mb-8">
      <p className="text-xs text-gray-500 mb-3 font-medium">Step {currentStep + 1} of 3</p>
      <div className="flex items-center gap-0">
        {[0, 1, 2].map((step, i) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isCompleted
                      ? "bg-gray-900 text-white"
                      : isCurrent
                      ? "border-2 border-gray-900 text-gray-900 animate-pulse"
                      : "border-2 border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step + 1
                  )}
                </div>
                <span className={`text-[10px] mt-1.5 font-medium ${isCurrent ? "text-gray-900" : "text-gray-400"}`}>
                  {stepLabels[step]}
                </span>
              </div>
              {i < 2 && (
                <div className="flex flex-col items-center -mt-4">
                  <div className={`w-12 h-0.5 ${step < currentStep ? "bg-gray-900" : "bg-gray-200"}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function OnboardingFlow() {
  const { setCvType, setApplicationGoal, targetJobTitle, setTargetJobTitle, targetIndustry, setTargetIndustry, setStep, profile, setActiveSections } = useCVStore();
  const [onboardingStep, setOnboardingStep] = useState(0);

  const handleCvTypeSelect = (type: CVType) => {
    setCvType(type);
    setOnboardingStep(1);
  };

  const handleGoalSelect = (goal: ApplicationGoal) => {
    setApplicationGoal(goal);
    setOnboardingStep(2);
  };

  const handleComplete = () => {
    const recommended = profile.recommendedSections.filter((s): s is SectionId =>
      ["summary", "experience", "education", "skills", "projects", "languages", "certifications", "awards", "publications", "references", "volunteer", "courses"].includes(s)
    );
    if (recommended.length > 0) {
      setActiveSections(recommended);
    }
    setStep(0);
  };

  const roleKey = targetJobTitle.toLowerCase().trim();
  const roleRec = ROLE_DATABASE[roleKey] || null;

  if (onboardingStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-600 flex items-center justify-center mx-auto mb-5 shadow-xl">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Smart CV Setup</h1>
              <p className="text-sm text-gray-500 max-w-md mx-auto">Answer 3 quick questions and we&apos;ll personalize your templates, section order, and skill suggestions</p>
            </div>

            <ProgressIndicator currentStep={0} />

            <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-full" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">SmartCV uses your answers to recommend the best template, suggest relevant skills, and optimize your CV for ATS systems. No data is sent to external servers.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cvTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleCvTypeSelect(type.value)}
                  className="group text-left p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <span className="text-white text-sm font-bold">{type.icon}</span>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900">{type.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{type.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (onboardingStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='%23000' fill-opacity='1'/%3E%3C/svg%3E\")" }} />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative">
          <div className="w-full max-w-lg">
            <div className="text-center mb-10">
              <button onClick={() => setOnboardingStep(0)} className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-flex items-center gap-1 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Back
              </button>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-3">What are you applying for?</h1>
              <p className="text-sm text-gray-500">We&apos;ll optimize your CV for this goal</p>
            </div>

            <ProgressIndicator currentStep={1} />

            <div className="space-y-3">
              {goals.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => handleGoalSelect(goal.value)}
                  className="group w-full text-left p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-4">
                    <span className="text-xl">{goal.icon}</span>
                    <div>
                      <div className="font-bold text-sm text-gray-900">{goal.label}</div>
                      <div className="text-xs text-gray-500">{goal.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (onboardingStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative">
          <div className="w-full max-w-lg">
            <div className="text-center mb-10">
              <button onClick={() => setOnboardingStep(1)} className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-flex items-center gap-1 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Back
              </button>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Tell us about your target role</h1>
              <p className="text-sm text-gray-500">This is optional but helps us give better suggestions</p>
            </div>

            <ProgressIndicator currentStep={2} />

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-full" />
              <div className="relative space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    placeholder="e.g. Software Developer, Accountant, Project Manager"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white/50 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Industry</label>
                  <select
                    value={targetIndustry}
                    onChange={(e) => setTargetIndustry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white/50"
                  >
                    <option value="">Select your industry</option>
                    {ethiopianIndustries.map((ind) => (
                      <option key={ind.industry} value={ind.industry}>{ind.industry}</option>
                    ))}
                  </select>
                </div>

                {targetIndustry && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/80 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Suggested skills for {targetIndustry}:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {ethiopianIndustries.find((i) => i.industry === targetIndustry)?.skills.slice(0, 8).map((skill) => (
                        <span key={skill} className="text-xs bg-white text-gray-700 px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {roleRec && (
                  <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl p-4 text-white">
                    <h4 className="text-sm font-bold mb-2">Recommended for this role:</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Key Skills</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {roleRec.keywords.slice(0, 6).map((kw) => (
                            <span key={kw} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{kw}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Best Template</span>
                        <div className="mt-1">
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full capitalize">{roleRec.templateId.replace(/-/g, " ")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleComplete}
                    className="flex-1 py-3.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl font-bold hover:from-gray-800 hover:to-gray-600 transition-all shadow-lg hover:shadow-xl text-sm"
                  >
                    Start Building My CV
                  </button>
                  <button
                    onClick={() => { setTargetJobTitle(""); setTargetIndustry(""); handleComplete(); }}
                    className="px-6 py-3.5 text-gray-500 text-sm font-medium hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
