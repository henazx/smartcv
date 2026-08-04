"use client";

import React, { useMemo } from "react";
import { useCVStore } from "@/lib/store";
import { Textarea } from "./FormInputs";
import { getIndustrySummaryTemplates } from "@/lib/contentAssistant";
import type { SummarySuggestion } from "@/types";

function getSummarySuggestions(summary: string, jobDescription?: string, targetIndustry?: string): SummarySuggestion[] {
  const suggestions: SummarySuggestion[] = [];

  if (summary.length > 200) {
    suggestions.push({
      type: "shorten",
      label: "Shorten",
      description: `Your summary is ${summary.length} characters. Aim for 150-200 for better readability.`,
    });
  }

  if (summary.length < 50 && summary.length > 0) {
    suggestions.push({
      type: "improve",
      label: "Expand",
      description: "Aim for 2-3 sentences (50-200 characters) to make a strong impression.",
    });
  }

  const casualWords = /\b(really|very|just|kind of|basically|awesome|stuff)\b/i;
  if (casualWords.test(summary)) {
    suggestions.push({
      type: "professionalize",
      label: "More Professional",
      description: "Consider removing casual words for a more polished tone.",
    });
  }

  if (jobDescription && summary.length > 0) {
    const summaryLower = summary.toLowerCase();
    const keywords = ["experience", "skills", "knowledge", "proven", "results"];
    const matched = keywords.filter((kw) => summaryLower.includes(kw));
    if (matched.length < 2) {
      suggestions.push({
        type: "tailor",
        label: "Tailor to Job",
        description: "Consider adding keywords from the job description for better ATS match.",
      });
    }
  }

  // Industry-specific template suggestions
  if (targetIndustry && summary.length === 0) {
    const templates = getIndustrySummaryTemplates(targetIndustry);
    if (templates.length > 0) {
      suggestions.push({
        type: "tailor",
        label: `${targetIndustry} Template Available`,
        description: `We have ${templates.length} pre-written summary templates for ${targetIndustry}. Click below to use one.`,
      });
    }
  }

  return suggestions;
}

export function StepSummary() {
  const { data, setPersonal, jobDescription, targetIndustry } = useCVStore();
  const { summary, headline } = data.personal;

  const suggestions = useMemo(
    () => getSummarySuggestions(summary, jobDescription || undefined, targetIndustry || undefined),
    [summary, jobDescription, targetIndustry]
  );

  const templates = useMemo(
    () => (targetIndustry ? getIndustrySummaryTemplates(targetIndustry) : []),
    [targetIndustry]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <span className="text-blue-600 font-bold text-sm">S</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Professional Summary</h2>
      </div>
      <p className="text-sm text-gray-500">A brief 2-4 sentence overview of your professional background and goals.</p>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Professional Headline</label>
        <input
          value={headline}
          onChange={(e) => setPersonal({ headline: e.target.value })}
          placeholder="e.g. Software Engineer | React & Node.js Specialist"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        />
        <p className="text-[10px] text-gray-400 mt-1">A short title displayed under your name</p>
      </div>

      <Textarea
        label="Summary"
        value={summary}
        onChange={(e) => setPersonal({ summary: e.target.value })}
        placeholder="e.g. Results-driven software engineer with 5+ years of experience building scalable web applications. Passionate about clean code and user-centric design. Seeking to leverage full-stack expertise at a forward-thinking company."
        rows={4}
      />

      {summary && (
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
            summary.length >= 50 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}>
            {summary.length} characters
          </span>
          {summary.length < 50 && (
            <span className="text-[10px] text-amber-600">Consider writing at least 50 characters for impact</span>
          )}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="bg-blue-50/50 border border-blue-200/50 rounded-xl p-3 space-y-2">
          <h4 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Suggestions</h4>
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 flex-shrink-0 mt-0.5">
                {s.type}
              </span>
              <p className="text-[11px] text-gray-600 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      )}

      {templates.length > 0 && summary.length === 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-xl p-3 space-y-2">
          <h4 className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
            {targetIndustry} Summary Templates
          </h4>
          <p className="text-[10px] text-gray-500">Click a template to use it as your summary:</p>
          {templates.map((template, i) => (
            <button
              key={i}
              onClick={() => setPersonal({ summary: template })}
              className="w-full text-left p-2 bg-white/80 rounded-lg hover:bg-white transition-colors border border-emerald-100/50"
            >
              <p className="text-[11px] text-gray-700 leading-relaxed">{template}</p>
              <span className="text-[9px] text-emerald-600 font-medium mt-1 inline-block">Click to use</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
