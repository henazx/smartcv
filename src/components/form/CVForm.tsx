"use client";

import React, { useState } from "react";
import { useCVStore } from "@/lib/store";
import { SectionId, SECTION_CONFIGS, OPTIONAL_SECTIONS, CORE_SECTIONS } from "@/types";
import { StepPersonal } from "./StepPersonal";
import { StepSummary } from "./StepSummary";
import { StepExperience } from "./StepExperience";
import { StepEducation } from "./StepEducation";
import { StepSkills } from "./StepSkills";
import { StepLanguages } from "./StepLanguages";
import { StepCertifications, StepReferences } from "./StepExtras";
import { StepProjects, StepAwards, StepPublications } from "./StepNewSections";
import { StepVolunteer, StepCourses } from "./StepVolunteerCourses";

const SECTION_COMPONENTS: Record<SectionId, React.ComponentType> = {
  summary: StepSummary,
  experience: StepExperience,
  education: StepEducation,
  skills: StepSkills,
  projects: StepProjects,
  languages: StepLanguages,
  certifications: StepCertifications,
  awards: StepAwards,
  publications: StepPublications,
  references: StepReferences,
  volunteer: StepVolunteer,
  courses: StepCourses,
};

export function CVForm() {
  const { data, activeSection, setActiveSection, addSection, removeSection, reorderSections, saveToStorage } = useCVStore();
  const [showAddMenu, setShowAddMenu] = useState(false);

  const currentSection = activeSection || "personal";
  const isPersonal = currentSection === "personal";

  const availableToAdd = OPTIONAL_SECTIONS.filter((s) => !data.activeSections.includes(s));

  const handleSectionClick = (sectionId: SectionId | null) => {
    setActiveSection(sectionId);
    saveToStorage();
  };

  const handleAddSection = (sectionId: SectionId) => {
    addSection(sectionId);
    setActiveSection(sectionId);
    setShowAddMenu(false);
    saveToStorage();
  };

  const handleRemoveSection = (sectionId: SectionId) => {
    removeSection(sectionId);
    if (currentSection === sectionId) setActiveSection(null);
    saveToStorage();
  };

  const handleMoveUp = (sectionId: SectionId) => {
    const idx = data.activeSections.indexOf(sectionId);
    if (idx > 0) {
      reorderSections(idx, idx - 1);
      saveToStorage();
    }
  };

  const handleMoveDown = (sectionId: SectionId) => {
    const idx = data.activeSections.indexOf(sectionId);
    if (idx < data.activeSections.length - 1) {
      reorderSections(idx, idx + 1);
      saveToStorage();
    }
  };

  const CurrentComponent = isPersonal ? StepPersonal : SECTION_COMPONENTS[currentSection as SectionId];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Your Details</h2>
            <p className="text-[10px] text-gray-400">
              {isPersonal ? "Personal Info" : SECTION_CONFIGS[currentSection as SectionId]?.label || currentSection}
            </p>
          </div>
          <div className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            {data.activeSections.length + 1} sections
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-100 px-2 gap-1 py-2">
        {/* Personal (always first) */}
        <button
          onClick={() => handleSectionClick(null)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
            isPersonal
              ? "bg-gray-900 text-white shadow-md"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          }`}
        >
          P
        </button>

        {/* Active sections */}
        {data.activeSections.map((sectionId) => {
          const config = SECTION_CONFIGS[sectionId as SectionId];
          if (!config) return null;
          return (
            <div key={sectionId} className="flex-shrink-0 flex items-center gap-0.5 group">
              <button
                onClick={() => handleSectionClick(sectionId as SectionId)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  currentSection === sectionId
                    ? "bg-gray-900 text-white shadow-md"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                {config.icon}
              </button>
              {!CORE_SECTIONS.includes(sectionId) && currentSection === sectionId && (
                <button
                  onClick={() => handleRemoveSection(sectionId)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-[10px] transition-all -ml-1"
                  title={`Remove ${config.label}`}
                >
                  x
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Section — above content, visible when needed */}
      <div className="px-4 sm:px-6 pt-3">
        {showAddMenu && availableToAdd.length > 0 && (
          <div className="mb-3 p-2 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-[10px] text-gray-400 px-1 pb-1 font-medium">Add a section</p>
            <div className="flex flex-wrap gap-1.5">
              {availableToAdd.map((sectionId) => {
                const config = SECTION_CONFIGS[sectionId];
                return (
                  <button
                    key={sectionId}
                    onClick={() => handleAddSection(sectionId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-gray-700 bg-white border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                  >
                    <span className="text-[10px] font-bold">{config.icon}</span>
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {!showAddMenu && availableToAdd.length > 0 && (
          <button
            onClick={() => setShowAddMenu(true)}
            className="mb-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-gray-400 hover:text-gray-900 hover:bg-gray-100 border border-dashed border-gray-300 hover:border-gray-900 transition-all"
          >
            <span className="text-sm leading-none">+</span>
            <span>Add section</span>
          </button>
        )}
      </div>

      {/* Section content */}
      <div className="p-4 sm:p-6">
        <CurrentComponent />
      </div>

      {/* Footer nav */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 sm:p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-transparent">
        {/* Section reorder (for non-personal sections) */}
        {!isPersonal && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleMoveUp(currentSection as SectionId)}
              disabled={data.activeSections.indexOf(currentSection as SectionId) <= 0}
              className="px-2 py-1.5 text-[10px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
              title="Move up"
            >
              Up
            </button>
            <button
              onClick={() => handleMoveDown(currentSection as SectionId)}
              disabled={data.activeSections.indexOf(currentSection as SectionId) >= data.activeSections.length - 1}
              className="px-2 py-1.5 text-[10px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
              title="Move down"
            >
              Down
            </button>
          </div>
        )}

        {isPersonal && <div />}

        {/* Quick jump buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
          onClick={() => handleSectionClick(null)}
            className={`px-3 py-1.5 text-[11px] rounded-lg font-medium transition-all ${
              isPersonal ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Personal
          </button>
          {data.activeSections.map((sectionId) => {
            const config = SECTION_CONFIGS[sectionId as SectionId];
            if (!config) return null;
            return (
              <button
                key={sectionId}
                onClick={() => handleSectionClick(sectionId as SectionId)}
                className={`px-3 py-1.5 text-[11px] rounded-lg font-medium transition-all ${
                  currentSection === sectionId ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
