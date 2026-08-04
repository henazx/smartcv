"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useCVStore } from "@/lib/store";
import { computeLayout, analyzeContent } from "@/lib/layoutEngine";
import { estimatePageCount } from "@/lib/atsScorer";
import { CVDocument } from "./CVDocument";
import { PDFViewer } from "@react-pdf/renderer";

class PreviewErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export function LivePreview() {
  const { data, template, theme, layoutOverride, manualLayout, isPremium, fontChoice } = useCVStore();
  const [zoom, setZoom] = useState(100);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const autoLayout = useMemo(() => computeLayout(data, template), [data, template]);
  const finalLayout = useMemo(() => layoutOverride ? { ...autoLayout, ...manualLayout } : autoLayout, [autoLayout, layoutOverride, manualLayout]);
  const analysis = useMemo(() => analyzeContent(data), [data]);
  const pageCount = useMemo(() => estimatePageCount(data), [data]);

  const hasContent = data.personal.fullName || data.experiences.length > 0 || data.education.length > 0;

  const getDensityColor = () => {
    switch (analysis.contentDensity) {
      case "heavy": return "bg-red-50 text-red-500";
      case "medium": return "bg-amber-50 text-amber-600";
      default: return "bg-gray-100 text-gray-900";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-3 py-2.5 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-bold text-gray-800">Preview</h3>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 text-xs"
            >
              -
            </button>
            <span className="text-xs text-gray-500 w-8 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 text-xs"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getDensityColor()}`}>
            {analysis.contentDensity}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">
            {analysis.careerStage}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700">
            {template.name}
          </span>
          {pageCount > 1 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-50 text-orange-700">
              {pageCount} pages
            </span>
          )}
        </div>
      </div>

      {!hasContent ? (
        <div className="h-[400px] sm:h-[500px] flex items-center justify-center text-gray-400 text-sm">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-gray-400 text-lg font-bold">CV</span>
            </div>
            <p className="text-sm font-medium">Start filling in your details</p>
            <p className="text-xs text-gray-400 mt-1">Your CV preview will appear here</p>
          </div>
        </div>
      ) : (
        <div className="overflow-auto bg-gray-50 max-h-[700px]">
          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left", width: "100%" }}>
            {!mounted ? (
              <div className="h-[800px] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <PreviewErrorBoundary
                fallback={
                  <div className="h-[800px] flex items-center justify-center bg-gray-100 m-2 rounded-lg">
                    <p className="text-sm text-gray-500">Preview rendering failed. Try a different template.</p>
                  </div>
                }
              >
                <div className="w-full">
                  <PDFViewer width="100%" height="800" showToolbar={false} style={{ width: "100%" }}>
                    <CVDocument data={data} template={template} theme={theme} layout={finalLayout} isPremium={isPremium} fontChoice={fontChoice} />
                  </PDFViewer>
                </div>
              </PreviewErrorBoundary>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
