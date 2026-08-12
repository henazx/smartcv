"use client";

import React from "react";
import { useCVStore } from "@/lib/store";
import { TextInput, Input, Textarea, validateDate } from "./FormInputs";

export function StepVolunteer() {
  const { data, addVolunteer, updateVolunteer, removeVolunteer } = useCVStore();
  const { volunteer } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
          <span className="text-emerald-600 font-bold text-sm">V</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Volunteer Experience</h2>
      </div>
      <p className="text-sm text-gray-500">Optional - showcase community involvement and leadership outside of work.</p>

      {volunteer.length === 0 && <p className="text-gray-500 text-sm italic">No volunteer experience added yet.</p>}

      {volunteer.map((vol, idx) => (
        <div key={vol.id} className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Volunteer {idx + 1}</span>
            <button onClick={() => removeVolunteer(vol.id)} className="text-red-500 text-sm hover:underline font-medium">Remove</button>
          </div>
          <TextInput label="Organization" value={vol.organization} onChange={(val) => updateVolunteer(vol.id, { organization: val })} dataType="name" placeholder="e.g. Red Cross" />
          <TextInput label="Role" value={vol.role} onChange={(val) => updateVolunteer(vol.id, { role: val })} dataType="name" placeholder="e.g. Volunteer Coordinator" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Start Date" type="month" value={vol.startDate} onChange={(e) => updateVolunteer(vol.id, { startDate: e.target.value })} validate={validateDate} />
            <Input label="End Date" type="month" value={vol.endDate} onChange={(e) => updateVolunteer(vol.id, { endDate: e.target.value })} validate={validateDate} />
          </div>
          <Textarea label="Description" value={vol.description} onChange={(e) => updateVolunteer(vol.id, { description: e.target.value })} placeholder="What did you accomplish? Use action verbs and metrics..." />
        </div>
      ))}

      <button onClick={addVolunteer} className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-900 hover:text-gray-900 text-sm font-medium transition-colors">
        + Add Volunteer Experience
      </button>
    </div>
  );
}

export function StepCourses() {
  const { data, addCourse, updateCourse, removeCourse } = useCVStore();
  const { courses } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
          <span className="text-violet-600 font-bold text-sm">T</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Courses & Training</h2>
      </div>
      <p className="text-sm text-gray-500">Optional - highlight relevant coursework and professional development.</p>

      {courses.length === 0 && <p className="text-gray-500 text-sm italic">No courses added yet.</p>}

      {courses.map((course, idx) => (
        <div key={course.id} className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Course {idx + 1}</span>
            <button onClick={() => removeCourse(course.id)} className="text-red-500 text-sm hover:underline font-medium">Remove</button>
          </div>
          <TextInput label="Course Name" value={course.name} onChange={(val) => updateCourse(course.id, { name: val })} dataType="text" placeholder="e.g. Advanced React Patterns" />
          <TextInput label="Provider" value={course.provider} onChange={(val) => updateCourse(course.id, { provider: val })} dataType="name" placeholder="e.g. Udemy, Coursera" />
          <Input label="Date" type="month" value={course.date} onChange={(e) => updateCourse(course.id, { date: e.target.value })} validate={validateDate} />
          <Textarea label="Description (optional)" value={course.description} onChange={(e) => updateCourse(course.id, { description: e.target.value })} placeholder="What did you learn? Key skills gained..." />
        </div>
      ))}

      <button onClick={addCourse} className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-900 hover:text-gray-900 text-sm font-medium transition-colors">
        + Add Course
      </button>
    </div>
  );
}
