"use client";

import React, { useState, useCallback } from "react";
import { useCVStore } from "@/lib/store";
import { TextInput, Input } from "./FormInputs";
import { suggestBulletImprovement } from "@/lib/contentAssistant";
import type { BulletSuggestion } from "@/types";

function BulletSuggestionChips({
  suggestions,
  onApply,
}: {
  suggestions: BulletSuggestion[];
  onApply: (improved: string) => void;
}) {
  if (suggestions.length === 0) return null;

  const typeLabel: Record<string, string> = {
    impact: "Impact",
    concise: "Concise",
    professional: "Professional",
    grammar: "Grammar",
    tailor: "Tailor",
  };

  const typeColor: Record<string, string> = {
    impact: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    concise: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    professional: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
    grammar: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
    tailor: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  };

  return (
    <div className="mt-1.5 space-y-1">
      {suggestions.map((s, i) => (
        <div key={i} className="flex items-start gap-1.5 group">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${typeColor[s.type]} flex-shrink-0 mt-0.5`}>
            {typeLabel[s.type]}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-500 leading-relaxed">{s.explanation}</p>
            <button
              onClick={() => onApply(s.improved)}
              className="text-[10px] text-gray-900 font-semibold hover:underline mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Apply suggestion
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StepExperience() {
  const { data, addExperience, updateExperience, removeExperience, applyBulletSuggestion, jobDescription } = useCVStore();
  const { experiences } = data;
  const [expandedBullets, setExpandedBullets] = useState<Record<string, number[]>>({});

  const toggleBulletSuggestion = useCallback((expId: string, bulletIdx: number) => {
    setExpandedBullets((prev) => {
      const current = prev[expId] || [];
      const newIdx = current.includes(bulletIdx)
        ? current.filter((i) => i !== bulletIdx)
        : [...current, bulletIdx];
      return { ...prev, [expId]: newIdx };
    });
  }, []);

  const getSuggestions = useCallback(
    (bullet: string): BulletSuggestion[] => {
      if (!bullet.trim() || bullet.length < 5) return [];
      return suggestBulletImprovement(bullet, jobDescription || undefined);
    },
    [jobDescription]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <span className="text-amber-600 font-bold text-sm">W</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
      </div>

      {experiences.length === 0 && (
        <p className="text-gray-500 text-sm italic">
          No work experience added yet. Click the button below to add your first entry.
        </p>
      )}

      {experiences.map((exp, idx) => (
        <div key={exp.id} className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Position {idx + 1}</span>
            <button
              onClick={() => removeExperience(exp.id)}
              className="text-red-500 text-sm hover:underline font-medium"
            >
              Remove
            </button>
          </div>

          <TextInput
            label="Company"
            required
            value={exp.company}
            onChange={(val) => updateExperience(exp.id, { company: val })}
            dataType="name"
            placeholder="e.g. Ethio Telecom"
          />

          <TextInput
            label="Role / Title"
            required
            value={exp.role}
            onChange={(val) => updateExperience(exp.id, { role: val })}
            dataType="name"
            placeholder="e.g. Software Engineer"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="month"
              value={exp.startDate}
              onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
            />
            <div>
              <Input
                label="End Date"
                type="month"
                value={exp.endDate}
                disabled={exp.current}
                onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                Currently working here
              </label>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Responsibilities / Achievements
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Tip: Start each bullet with an action verb (Led, Built, Increased). Keep under 20 words.
            </p>
            {exp.bullets.map((bullet, bIdx) => {
              const suggestions = getSuggestions(bullet);
              const showSuggestions = (expandedBullets[exp.id] || []).includes(bIdx);
              return (
                <div key={bIdx} className="mb-3">
                  <div className="flex gap-2">
                    <input
                      value={bullet}
                      onChange={(e) => {
                        const newBullets = [...exp.bullets];
                        newBullets[bIdx] = e.target.value;
                        updateExperience(exp.id, { bullets: newBullets });
                      }}
                      placeholder="e.g. Increased sales by 25% in 6 months"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    />
                    {suggestions.length > 0 && (
                      <button
                        onClick={() => toggleBulletSuggestion(exp.id, bIdx)}
                        className={`flex-shrink-0 px-2 py-2 rounded-lg text-[10px] font-bold transition-all border ${
                          showSuggestions
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-white text-gray-400 border-gray-200 hover:text-blue-600 hover:border-blue-200"
                        }`}
                        title="Content suggestions"
                      >
                        {suggestions.length}
                      </button>
                    )}
                    {exp.bullets.length > 1 && (
                      <button
                        onClick={() => {
                          const newBullets = exp.bullets.filter((_, i) => i !== bIdx);
                          updateExperience(exp.id, { bullets: newBullets });
                        }}
                        className="text-gray-400 hover:text-red-500 text-sm px-2"
                      >
                        x
                      </button>
                    )}
                  </div>
                  {showSuggestions && (
                    <BulletSuggestionChips
                      suggestions={suggestions}
                      onApply={(improved) => {
                        applyBulletSuggestion(exp.id, bIdx, improved);
                      }}
                    />
                  )}
                </div>
              );
            })}
            <button
              onClick={() =>
                updateExperience(exp.id, { bullets: [...exp.bullets, ""] })
              }
              className="text-gray-900 text-sm hover:underline font-medium"
            >
              + Add another bullet
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-900 hover:text-gray-900 text-sm font-medium transition-colors"
      >
        + Add Work Experience
      </button>
    </div>
  );
}
