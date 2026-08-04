"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useCVStore } from "@/lib/store";
import { analyzeJobMatch } from "@/lib/cvProfile";
import type { JobMatchResult } from "@/types";

export function JobMatchPanel() {
  const { data, jobDescription, setJobDescription } = useCVStore();
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyze = useCallback(() => {
    if (!jobDescription.trim()) {
      setResult(null);
      return;
    }
    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      const matchResult = analyzeJobMatch(data, jobDescription);
      setResult(matchResult);
      setIsAnalyzing(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [data, jobDescription]);

  useEffect(() => {
    const cleanup = analyze();
    return cleanup;
  }, [analyze]);

  const matchPercent = result ? Math.round(result.score) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <span className="text-blue-600 font-bold text-xs sm:text-sm">JD</span>
        </div>
        <div>
          <h2 className="text-base sm:text-xl font-bold text-gray-900">Job Description Match</h2>
          <p className="text-xs text-gray-500">Paste a job description to see how well your CV matches</p>
        </div>
      </div>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here..."
        rows={6}
        className="w-full px-3 sm:px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white/50 placeholder:text-gray-400 resize-none min-h-[44px]"
      />

      {isAnalyzing && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          Analyzing match...
        </div>
      )}

      {result && !isAnalyzing && (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gray-100 via-gray-50 to-transparent rounded-bl-full" />

          <div className="relative">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="relative">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={matchPercent >= 70 ? "#16a34a" : matchPercent >= 40 ? "#d97706" : "#dc2626"}
                    strokeWidth="3"
                    strokeDasharray={`${matchPercent}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{matchPercent}%</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Match Score</h3>
                <p className="text-sm text-gray-500">
                  {matchPercent >= 70 ? "Great match!" : matchPercent >= 40 ? "Good start" : "Needs improvement"}
                </p>
              </div>
            </div>

            {result.strongMatches.length > 0 && (
              <div className="mb-3">
                <h4 className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1.5">Matched Keywords</h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.strongMatches.map((kw) => (
                    <span key={kw} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.missingKeywords.length > 0 && (
              <div className="mb-3">
                <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">Missing Keywords</h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords.map((kw) => (
                    <span key={kw} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.suggestions.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Suggestions</h4>
                <ul className="space-y-1">
                  {result.suggestions.slice(0, 3).map((s, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                      <span className="text-gray-400 mt-0.5">-</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
