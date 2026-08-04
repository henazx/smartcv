"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useCVStore } from "@/lib/store";
import { computeLayout } from "@/lib/layoutEngine";
import {
  runDesignGuardian, getStatusLabel, getStatusColor, getSeverityColor,
  applyAutoFix,
} from "@/lib/designGuardian";
import type { DesignGuardianResult, DesignIssue, AutoFix } from "@/lib/designGuardian/types";

export function DesignGuardianPanel() {
  const { data, template, theme, layoutOverride, manualLayout, setManualLayout } = useCVStore();
  const [expanded, setExpanded] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [showFixes, setShowFixes] = useState(false);
  const [fixApplied, setFixApplied] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [result, setResult] = useState<DesignGuardianResult | null>(null);
  const prevCriticalRef = useRef(0);

  const autoLayout = computeLayout(data, template);
  const finalLayout = useMemo(
    () => (layoutOverride ? { ...autoLayout, ...manualLayout } : autoLayout),
    [autoLayout, layoutOverride, manualLayout]
  );

  const analyze = useCallback(() => {
    const r = runDesignGuardian({
      data, template, theme, layout: finalLayout,
      careerStage: "mid-level",
      contentDensity: "medium",
    });
    setResult(r);
  }, [data, template, theme, finalLayout]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(analyze, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [analyze]);

  useEffect(() => {
    if (!result) return;
    const criticalCount = result.issues.filter((i) => i.severity === "critical").length;
    if (criticalCount > 0 && criticalCount > prevCriticalRef.current) {
      setExpanded(true);
    }
    prevCriticalRef.current = criticalCount;
  }, [result]);

  if (!result) return null;

  const { score, issues, autoFixes, pageEstimate } = result;
  const criticalIssues = issues.filter((i) => i.severity === "critical");
  const warningIssues = issues.filter((i) => i.severity === "warning");
  const infoIssues = issues.filter((i) => i.severity === "info");

  const handleApplyFix = (fix: AutoFix) => {
    const layoutUpdates = applyAutoFix(finalLayout, fix);
    setManualLayout(layoutUpdates);
    setFixApplied(true);
    setTimeout(() => setFixApplied(false), 2000);
  };

  const handleApplyAllFixes = () => {
    for (const fix of autoFixes) {
      const layoutUpdates = applyAutoFix(finalLayout, fix);
      setManualLayout(layoutUpdates);
    }
    setFixApplied(true);
    setTimeout(() => setFixApplied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${getStatusColor(score.status)}15` }}>
              <span className="text-sm font-bold" style={{ color: getStatusColor(score.status) }}>{score.overall}</span>
            </div>
            {criticalIssues.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center animate-pulse">{criticalIssues.length}</span>
            )}
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-800">Design Health</div>
            <div className="text-xs" style={{ color: getStatusColor(score.status) }}>{getStatusLabel(score.status)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!expanded && criticalIssues.length === 0 && warningIssues.length > 0 && (
            <span className="text-[10px] text-amber-600 font-medium">{warningIssues.length} warning{warningIssues.length > 1 ? "s" : ""}</span>
          )}
          {!expanded && criticalIssues.length === 0 && warningIssues.length === 0 && (
            <span className="text-[10px] text-green-600 font-medium">All good</span>
          )}
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100">
          <div className="px-4 py-3">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {Object.entries(score.dimensions).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-[10px] text-gray-500 capitalize mb-0.5">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                   <div className="text-xs font-bold" style={{ color: value >= 80 ? "#111827" : value >= 60 ? "#d97706" : "#ef4444" }}>{value}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
              <span>~{pageEstimate.estimatedPages} page{pageEstimate.estimatedPages > 1 ? "s" : ""}</span>
              {pageEstimate.overflowRisk !== "none" && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  pageEstimate.overflowRisk === "high" ? "bg-red-50 text-red-500" :
                  pageEstimate.overflowRisk === "medium" ? "bg-amber-50 text-amber-600" :
                  "bg-gray-100 text-gray-600"
                }`}>{pageEstimate.overflowRisk} overflow risk</span>
              )}
            </div>

            {criticalIssues.length > 0 && (
              <div className="mb-3">
                <h4 className="text-[10px] font-semibold text-red-500 uppercase tracking-wide mb-1.5">Critical</h4>
                {criticalIssues.map((issue) => (
                  <IssueRow key={issue.id} issue={issue} selected={selectedIssue === issue.id} onSelect={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)} />
                ))}
              </div>
            )}

            {warningIssues.length > 0 && (
              <div className="mb-3">
                <h4 className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mb-1.5">Warnings</h4>
                {warningIssues.slice(0, expanded ? undefined : 2).map((issue) => (
                  <IssueRow key={issue.id} issue={issue} selected={selectedIssue === issue.id} onSelect={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)} />
                ))}
              </div>
            )}

            {infoIssues.length > 0 && !expanded && (
              <div className="text-xs text-gray-400">{infoIssues.length} additional note{infoIssues.length > 1 ? "s" : ""}</div>
            )}

            {infoIssues.length > 0 && expanded && (
              <div className="mb-3">
                <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Notes</h4>
                {infoIssues.map((issue) => (
                  <IssueRow key={issue.id} issue={issue} selected={selectedIssue === issue.id} onSelect={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)} />
                ))}
              </div>
            )}
          </div>

          {autoFixes.length > 0 && (
            <div className="px-4 pb-3">
              <button
                onClick={() => setShowFixes(!showFixes)}
                className="w-full px-3 py-2 bg-gray-100 text-gray-900 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{fixApplied ? "Fixes Applied!" : `Optimize My CV Design (${autoFixes.length} fix${autoFixes.length > 1 ? "es" : ""})`}</span>
              </button>
              {showFixes && (
                <div className="mt-2 space-y-1.5">
                  {autoFixes.map((fix) => (
                    <div key={fix.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-xs font-medium text-gray-700">{fix.title}</div>
                        <div className="text-[10px] text-gray-500">{fix.description}</div>
                      </div>
                      <button
                        onClick={() => handleApplyFix(fix)}
                        className="px-2 py-1 bg-gray-900 text-white rounded text-[10px] font-medium hover:bg-gray-700 flex-shrink-0 ml-2"
                      >Apply</button>
                    </div>
                  ))}
                  {autoFixes.length > 1 && (
                    <button
                      onClick={handleApplyAllFixes}
                      className="w-full px-2 py-1.5 bg-gray-900 text-white rounded-lg text-[10px] font-semibold hover:bg-gray-700"
                    >Apply All Fixes</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function IssueRow({ issue, selected, onSelect }: { issue: DesignIssue; selected: boolean; onSelect: () => void }) {
  return (
    <div className="mb-1.5">
      <button onClick={onSelect} className="w-full text-left flex items-start gap-2 p-1.5 rounded hover:bg-gray-50 transition-colors">
        <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: getSeverityColor(issue.severity) }} />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-700 font-medium">{issue.title}</div>
          {selected && (
            <div className="mt-1 text-[10px] text-gray-500 leading-relaxed">{issue.description}</div>
          )}
          {selected && (
            <div className="mt-1 text-[10px] text-gray-900 font-medium">{issue.recommendation}</div>
          )}
        </div>
        {issue.autoFixAvailable && selected && (
          <span className="text-[9px] bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded flex-shrink-0">Auto-fix</span>
        )}
      </button>
    </div>
  );
}
