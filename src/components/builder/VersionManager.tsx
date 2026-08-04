"use client";

import React, { useState } from "react";
import { useCVStore } from "@/lib/store";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function VersionManager() {
  const { versions, activeVersionId, saveVersion, loadVersion, deleteVersion, duplicateVersion } = useCVStore();
  const [name, setName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    saveVersion(trimmed);
    setName("");
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      deleteVersion(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-4 sm:p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-100 via-gray-50 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-gray-50 to-transparent rounded-tr-full" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900">Versions</h3>
          {versions.length > 0 && (
            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{versions.length}</span>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 50))}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="Version name..."
            className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all placeholder:text-gray-400"
          />
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-3 py-2 text-xs font-semibold bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl hover:from-gray-800 hover:to-gray-600 transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>

        {versions.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No saved versions yet</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...versions].reverse().map((v) => (
              <div
                key={v.id}
                className={`p-3 rounded-xl border transition-all ${
                  activeVersionId === v.id
                    ? "bg-gray-900 border-gray-800 text-white shadow-md"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold truncate ${activeVersionId === v.id ? "text-white" : "text-gray-900"}`}>
                        {v.name}
                      </span>
                      {activeVersionId === v.id && (
                        <span className="text-[9px] font-bold bg-white/20 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                          Active
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] ${activeVersionId === v.id ? "text-gray-300" : "text-gray-400"}`}>
                      {formatDate(v.createdAt)}
                    </span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => loadVersion(v.id)}
                      className={`p-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                        activeVersionId === v.id
                          ? "bg-white/20 text-white hover:bg-white/30"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                      title="Load version"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </button>
                    <button
                      onClick={() => duplicateVersion(v.id)}
                      className={`p-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                        activeVersionId === v.id
                          ? "bg-white/20 text-white hover:bg-white/30"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                      title="Duplicate version"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(v.id)}
                      onBlur={() => setConfirmDeleteId(null)}
                      className={`p-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                        confirmDeleteId === v.id
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : activeVersionId === v.id
                            ? "bg-white/20 text-white hover:bg-red-400/80"
                            : "bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600"
                      }`}
                      title={confirmDeleteId === v.id ? "Click again to confirm" : "Delete version"}
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
