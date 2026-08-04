"use client";

import React from "react";
import { useCVStore } from "@/lib/store";
import { TextInput, Select } from "./FormInputs";

const proficiencyOptions = [
  { value: "basic", label: "Basic" },
  { value: "conversational", label: "Conversational" },
  { value: "fluent", label: "Fluent" },
  { value: "native", label: "Native" },
];

export function StepLanguages() {
  const { data, addLanguage, updateLanguage, removeLanguage } = useCVStore();
  const { languages } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <span className="text-gray-900 font-bold text-sm">L</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Languages</h2>
      </div>
      <p className="text-sm text-gray-500 bg-amber-50 p-3 rounded-lg border border-amber-200">
        Listing languages is important for the Ethiopian market - consider adding Amharic, Oromo, and English.
      </p>

      {languages.length === 0 && (
        <p className="text-gray-500 text-sm italic">
          No languages added yet.
        </p>
      )}

      {languages.map((lang, idx) => (
        <div key={lang.id} className="flex gap-2 items-end mb-2">
          <div className="flex-1">
            <TextInput
              label={idx === 0 ? "Language" : ""}
              value={lang.name}
              onChange={(val) => updateLanguage(lang.id, { name: val })}
              dataType="letters"
              placeholder="e.g. Amharic"
            />
          </div>
          <div className="w-40">
            <Select
              label={idx === 0 ? "Proficiency" : ""}
              value={lang.proficiency}
              onChange={(e) =>
                updateLanguage(lang.id, {
                  proficiency: e.target.value as "basic" | "conversational" | "fluent" | "native",
                })
              }
              options={proficiencyOptions}
            />
          </div>
          <button
            onClick={() => removeLanguage(lang.id)}
            className="text-gray-400 hover:text-red-500 text-sm mb-3"
          >
            x
          </button>
        </div>
      ))}

      <button
        onClick={addLanguage}
        className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-900 hover:text-gray-900 text-sm font-medium transition-colors"
      >
        + Add Language
      </button>
    </div>
  );
}
