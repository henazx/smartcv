"use client";

import React from "react";
import { useCVStore } from "@/lib/store";
import { TextInput, Input, Textarea } from "./FormInputs";

export function StepProjects() {
  const { data, addProject, updateProject, removeProject } = useCVStore();
  const { projects } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <span className="text-gray-900 font-bold text-sm">P</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Projects</h2>
      </div>
      <p className="text-sm text-gray-500">Optional - showcase your best work, side projects, or open source contributions.</p>

      {projects.length === 0 && (
        <p className="text-gray-500 text-sm italic">No projects added yet.</p>
      )}

      {projects.map((proj, idx) => (
        <div key={proj.id} className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Project {idx + 1}</span>
            <button onClick={() => removeProject(proj.id)} className="text-red-500 text-sm hover:underline font-medium">Remove</button>
          </div>

          <TextInput label="Project Name" required value={proj.name} onChange={(val) => updateProject(proj.id, { name: val })} dataType="text" placeholder="e.g. E-Commerce Platform" />
          <Textarea label="Description" value={proj.description} onChange={(e) => updateProject(proj.id, { description: e.target.value })} placeholder="Brief description of what this project does..." />
          <TextInput label="URL (optional)" value={proj.url} onChange={(val) => updateProject(proj.id, { url: val })} dataType="url" placeholder="https://github.com/..." hint="Full URL: https://..." />

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
            <input
              value={proj.technologies.join(", ")}
              onChange={(e) => updateProject(proj.id, { technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
              placeholder="React, Node.js, PostgreSQL (comma separated)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key Achievements</label>
            {proj.bullets.map((bullet, bIdx) => (
              <div key={bIdx} className="flex gap-2 mb-2">
                <input
                  value={bullet}
                  onChange={(e) => {
                    const newBullets = [...proj.bullets];
                    newBullets[bIdx] = e.target.value;
                    updateProject(proj.id, { bullets: newBullets });
                  }}
                  placeholder="e.g. Reduced load time by 40%"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                {proj.bullets.length > 1 && (
                  <button onClick={() => updateProject(proj.id, { bullets: proj.bullets.filter((_, i) => i !== bIdx) })} className="text-gray-400 hover:text-red-500 text-sm px-2">x</button>
                )}
              </div>
            ))}
            <button onClick={() => updateProject(proj.id, { bullets: [...proj.bullets, ""] })} className="text-gray-900 text-sm hover:underline font-medium">+ Add another bullet</button>
          </div>
        </div>
      ))}

      <button onClick={addProject} className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-900 hover:text-gray-900 text-sm font-medium transition-colors">
        + Add Project
      </button>
    </div>
  );
}

export function StepAwards() {
  const { data, addAward, updateAward, removeAward } = useCVStore();
  const { awards } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <span className="text-amber-600 font-bold text-sm">A</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Awards & Achievements</h2>
      </div>
      <p className="text-sm text-gray-500">Optional - highlight recognition and accomplishments.</p>

      {awards.length === 0 && <p className="text-gray-500 text-sm italic">No awards added yet.</p>}

      {awards.map((award, idx) => (
        <div key={award.id} className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Award {idx + 1}</span>
            <button onClick={() => removeAward(award.id)} className="text-red-500 text-sm hover:underline font-medium">Remove</button>
          </div>
          <TextInput label="Award Name" value={award.name} onChange={(val) => updateAward(award.id, { name: val })} dataType="text" placeholder="e.g. Employee of the Year" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextInput label="Issuing Organization" value={award.issuer} onChange={(val) => updateAward(award.id, { issuer: val })} dataType="name" placeholder="e.g. Ethio Telecom" />
            <Input label="Date" type="month" value={award.date} onChange={(e) => updateAward(award.id, { date: e.target.value })} />
          </div>
          <Textarea label="Description (optional)" value={award.description} onChange={(e) => updateAward(award.id, { description: e.target.value })} placeholder="Brief description of why you received this..." />
        </div>
      ))}

      <button onClick={addAward} className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-900 hover:text-gray-900 text-sm font-medium transition-colors">
        + Add Award
      </button>
    </div>
  );
}

export function StepPublications() {
  const { data, addPublication, updatePublication, removePublication } = useCVStore();
  const { publications } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <span className="text-gray-900 font-bold text-sm">R</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Publications</h2>
      </div>
      <p className="text-sm text-gray-500">Optional - list research papers, articles, or other publications.</p>

      {publications.length === 0 && <p className="text-gray-500 text-sm italic">No publications added yet.</p>}

      {publications.map((pub, idx) => (
        <div key={pub.id} className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Publication {idx + 1}</span>
            <button onClick={() => removePublication(pub.id)} className="text-red-500 text-sm hover:underline font-medium">Remove</button>
          </div>
          <TextInput label="Title" value={pub.title} onChange={(val) => updatePublication(pub.id, { title: val })} dataType="text" placeholder="e.g. Machine Learning in Healthcare" />
          <TextInput label="Journal / Conference" value={pub.journal} onChange={(val) => updatePublication(pub.id, { journal: val })} dataType="text" placeholder="e.g. IEEE Transactions" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextInput label="Date" value={pub.date} onChange={(val) => updatePublication(pub.id, { date: val })} dataType="text" placeholder="YYYY-MM" />
            <TextInput label="URL (optional)" value={pub.url} onChange={(val) => updatePublication(pub.id, { url: val })} dataType="url" placeholder="https://..." hint="Full URL: https://..." />
          </div>
        </div>
      ))}

      <button onClick={addPublication} className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-900 hover:text-gray-900 text-sm font-medium transition-colors">
        + Add Publication
      </button>
    </div>
  );
}
