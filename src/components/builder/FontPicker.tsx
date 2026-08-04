"use client";

import React from "react";
import { useCVStore } from "@/lib/store";
import { FONT_OPTIONS } from "@/types";

export function FontPicker() {
  const { fontChoice, setFontChoice } = useCVStore();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-4 sm:p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-100 via-gray-50 to-transparent rounded-bl-full" />
      <h3 className="relative text-sm font-bold text-gray-900 mb-3">Font</h3>
      <div className="relative grid grid-cols-2 gap-2">
        {FONT_OPTIONS.map((font) => (
          <button
            key={font.id}
            onClick={() => setFontChoice(font.id)}
            className={`text-left px-3 py-3.5 rounded-xl border text-xs transition-all ${
              fontChoice === font.id
                ? "border-gray-900 bg-gray-900 text-white shadow-md"
                : "border-gray-200 bg-gray-50/50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
            }`}
            style={{ fontFamily: font.cssFamily }}
          >
            <span className="leading-tight block">{font.name}</span>
            <span
              className={`text-[10px] mt-1 block ${fontChoice === font.id ? "text-gray-400" : "text-gray-400"}`}
              style={{ fontFamily: font.cssFamily }}
            >
              The quick brown fox jumps
            </span>
            <span className={`text-[9px] mt-0.5 block ${fontChoice === font.id ? "text-gray-300" : "text-gray-400"}`}>
              {font.category === "serif" ? "Serif" : "Sans-serif"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
