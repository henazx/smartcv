"use client";

import React, { useState } from "react";
import { useCVStore } from "@/lib/store";
import { ROLE_DATABASE } from "@/lib/cvProfile";
import { getIndustrySkills } from "@/lib/contentAssistant";

const proficiencyOptions = [
  { value: "", label: "No rating" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

const categoryOptions = [
  "General",
  "Programming Languages",
  "Frameworks",
  "Databases",
  "Cloud & DevOps",
  "Design",
  "Soft Skills",
  "Languages",
  "Tools",
  "Other",
];

export function StepSkills() {
  const { data, addSkill, removeSkill, targetJobTitle, targetIndustry } = useCVStore();
  const { skills } = data;
  const [newSkill, setNewSkill] = useState("");
  const [newProficiency, setNewProficiency] = useState("");
  const [newCategory, setNewCategory] = useState("General");

  const roleKey = targetJobTitle.toLowerCase().trim();
  const roleRec = ROLE_DATABASE[roleKey] || null;
  const industrySkills = getIndustrySkills(targetIndustry);
  const existingSkillNames = new Set(skills.map((s) => s.name.toLowerCase()));
  const suggestedSkills = roleRec
    ? roleRec.skills.filter((s) => !existingSkillNames.has(s.toLowerCase()))
    : [];
  const suggestedIndustrySkills = industrySkills.filter(
    (s) => !existingSkillNames.has(s.toLowerCase()) && !suggestedSkills.includes(s)
  );

  const handleAdd = () => {
    if (newSkill.trim()) {
      addSkill(
        newSkill.trim(),
        (newProficiency as "beginner" | "intermediate" | "advanced" | "expert") || null,
        newCategory
      );
      setNewSkill("");
      setNewProficiency("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <span className="text-amber-600 font-bold text-sm">S</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Skills</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
          pattern="[A-Za-z0-9\s\+\#\.\/\-]+"
          title="Skill name should only contain letters, numbers, +, #, ., /, or hyphens"
          className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          {categoryOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <select
          value={newProficiency}
          onChange={(e) => setNewProficiency(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          {proficiencyOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button onClick={handleAdd} className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg text-sm font-semibold hover:from-gray-800 hover:to-gray-600">
          Add
        </button>
      </div>

      {/* Grouped display */}
      {(() => {
        const groups: Record<string, typeof skills> = {};
        skills.forEach((skill) => {
          const cat = skill.category || "General";
          if (!groups[cat]) groups[cat] = [];
          groups[cat].push(skill);
        });
        return Object.entries(groups).map(([category, catSkills]) => (
          <div key={category} className="mt-3">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{category}</p>
            <div className="flex flex-wrap gap-2">
              {catSkills.map((skill) => (
                <span key={skill.id} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-sm font-medium">
                  {skill.name}
                  {skill.proficiency && (
                    <span className="text-gray-900/60 text-xs">({skill.proficiency})</span>
                  )}
                  <button onClick={() => removeSkill(skill.id)} className="ml-1 text-gray-900 hover:text-red-500">x</button>
                </span>
              ))}
            </div>
          </div>
        ));
      })()}

      {skills.length === 0 && (
        <p className="text-gray-500 text-sm italic">
          No skills added yet. Common skills: JavaScript, Python, Microsoft Office, Project Management...
        </p>
      )}

      {suggestedSkills.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/80 rounded-xl">
          <h4 className="text-sm font-bold text-gray-900 mb-2">
            Suggested for {targetJobTitle}
          </h4>
          <p className="text-xs text-gray-500 mb-3">Click to add recommended skills for this role</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => addSkill(skill, null, roleRec?.sections?.[0] === "skills" ? "Technical" : "General")}
                className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-sm"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {suggestedIndustrySkills.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80 rounded-xl">
          <h4 className="text-sm font-bold text-gray-900 mb-2">
            Industry: {targetIndustry}
          </h4>
          <p className="text-xs text-gray-500 mb-3">Common skills in this industry</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedIndustrySkills.map((skill) => (
              <button
                key={skill}
                onClick={() => addSkill(skill, null, "Technical")}
                className="text-xs bg-white border border-emerald-200 text-gray-700 px-2.5 py-1 rounded-full hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
