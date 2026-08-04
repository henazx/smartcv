"use client";

import React, { useMemo, useState } from "react";
import { useCVStore } from "@/lib/store";
import { computeLayout } from "@/lib/layoutEngine";
import { runExportSafetyCheck } from "@/lib/designGuardian";

export function ExportSafetyCheck() {
  const { data, template, theme, layoutOverride, manualLayout } = useCVStore();
  const [expanded, setExpanded] = useState(false);

  const autoLayout = computeLayout(data, template);
  const finalLayout = useMemo(
    () => (layoutOverride ? { ...autoLayout, ...manualLayout } : autoLayout),
    [autoLayout, layoutOverride, manualLayout]
  );

  const safetyResult = useMemo(
    () => runExportSafetyCheck(data, template, theme, finalLayout),
    [data, template, theme, finalLayout]
  );

  const passedCount = safetyResult.checks.filter((c) => c.pass).length;
  const totalCount = safetyResult.checks.length;
  const allPassed = safetyResult.safe;

  return (
    <div className={`rounded-xl border overflow-hidden ${allPassed ? "border-gray-200 bg-gray-100/30" : "border-amber-200 bg-amber-50/30"}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${allPassed ? "bg-gray-100" : "bg-amber-50"}`}>
            {allPassed ? (
              <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-800">Final CV Check</div>
            <div className="text-xs text-gray-500">{passedCount}/{totalCount} checks passed</div>
          </div>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-3 space-y-1.5">
          {safetyResult.checks.map((check, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                check.pass ? "bg-gray-100 text-gray-900" : "bg-amber-50 text-amber-600"
              }`}>
                {check.pass ? "\u2713" : "!"}
              </span>
              <span className={`text-xs ${check.pass ? "text-gray-700" : "text-gray-600"}`}>{check.label}</span>
              {!check.pass && check.message && (
                <span className="text-[10px] text-gray-400 ml-auto flex-shrink-0">!</span>
              )}
            </div>
          ))}

          {allPassed && (
            <div className="mt-2 pt-2 border-t border-gray-200 text-center">
              <span className="text-xs font-semibold text-gray-900">PDF is ready for download</span>
            </div>
          )}

          {!allPassed && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="text-[10px] text-gray-500">
                {safetyResult.result.issues.filter((i) => i.severity === "critical").length > 0
                  ? "Critical issues should be resolved before downloading."
                  : "Minor issues detected. You can still download your CV."}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
