"use client";

import React from "react";
import { useCVStore } from "@/lib/store";
import { TextInput, Input, NumberInput } from "./FormInputs";

export function StepEducation() {
  const { data, addEducation, updateEducation, removeEducation } = useCVStore();
  const { education } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <span className="text-gray-900 font-bold text-sm">E</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Education</h2>
      </div>

      {education.length === 0 && (
        <p className="text-gray-500 text-sm italic">
          No education entries added yet.
        </p>
      )}

      {education.map((edu, idx) => (
        <div key={edu.id} className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Education {idx + 1}</span>
            <button
              onClick={() => removeEducation(edu.id)}
              className="text-red-500 text-sm hover:underline font-medium"
            >
              Remove
            </button>
          </div>

          <TextInput
            label="Institution"
            required
            value={edu.institution}
            onChange={(val) => updateEducation(edu.id, { institution: val })}
            dataType="name"
            placeholder="e.g. Addis Ababa University"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextInput
              label="Degree"
              required
              value={edu.degree}
              onChange={(val) => updateEducation(edu.id, { degree: val })}
              dataType="name"
              placeholder="e.g. BSc, MSc, PhD"
            />
            <TextInput
              label="Field of Study"
              required
              value={edu.field}
              onChange={(val) => updateEducation(edu.id, { field: val })}
              dataType="name"
              placeholder="e.g. Computer Science"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Start Date"
              type="month"
              required
              value={edu.startDate}
              onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="month"
              value={edu.endDate}
              onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
            />
            <NumberInput
              label="GPA (optional)"
              value={edu.gpa}
              onChange={(val) => updateEducation(edu.id, { gpa: val })}
              min={0}
              max={4}
              placeholder="e.g. 3.80"
              hint="Scale: 0.00 - 4.00"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-900 hover:text-gray-900 text-sm font-medium transition-colors"
      >
        + Add Education
      </button>
    </div>
  );
}
