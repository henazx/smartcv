"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useCVStore } from "@/lib/store";
import { templates, filterTemplates, type TemplateCategoryFilter } from "@/lib/templates";
import { getFreeThemes, getPremiumThemes } from "@/lib/themes";
import { computeLayout, recommendTemplates } from "@/lib/layoutEngine";
import { CVDocument } from "@/components/pdf/CVDocument";
import { PDFViewer } from "@react-pdf/renderer";

const categories: { label: string; value: TemplateCategoryFilter }[] = [
  { label: "All", value: "all" },
  { label: "Professional", value: "classic" },
  { label: "Modern", value: "modern" },
  { label: "Minimal", value: "minimal" },
  { label: "Executive", value: "executive" },
  { label: "Creative", value: "creative" },
  { label: "Technical", value: "technical" },
  { label: "Academic", value: "academic" },
  { label: "ATS-Friendly", value: "ats" },
];

export default function ThemePage() {
  const { data, template, setTemplate, theme, setTheme, isPremium, profile, hydrateFromStorage, fontChoice } = useCVStore();
  const [hydrated, setHydrated] = useState(false);
  const [activeCategory, setActiveCategory] = useState<TemplateCategoryFilter>("all");
  const [showThemes, setShowThemes] = useState(false);

  useEffect(() => {
    hydrateFromStorage();
    setHydrated(true);
  }, [hydrateFromStorage]);

  const filteredTemplates = filterTemplates(activeCategory);
  const layout = useMemo(() => computeLayout(data, template, profile), [data, template, profile]);
  const recommendations = useMemo(() => recommendTemplates(data, profile), [data, profile]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  const hasContent =
    data.personal.fullName ||
    data.experiences.length > 0 ||
    data.education.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-x-hidden animate-fade-in">
      <div className="h-1.5 w-full bg-gradient-to-r from-gray-900 via-gray-500 to-gray-300" />

      <nav className="border-b border-gray-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-gray-900 to-gray-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-xs sm:text-sm">S</span>
            </div>
            <span className="text-base sm:text-lg font-bold text-gray-900">SmartCV</span>
          </Link>
          <div className="flex gap-1.5 sm:gap-2">
            <Link href="/build" className="px-3 sm:px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all">
              Back to Editor
            </Link>
            <Link href="/export" className="px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-xs font-semibold hover:from-gray-800 hover:to-gray-600 transition-all shadow-md hover:shadow-lg">
              Export PDF
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">Choose Your Design</h1>
            <p className="text-sm text-gray-500">Pick a template and color theme for your CV</p>
          </div>
          <button
            onClick={() => setShowThemes(!showThemes)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md ${showThemes ? "bg-gradient-to-r from-gray-900 to-gray-700 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"}`}
          >
            {showThemes ? "Back to Templates" : `Colors: ${theme.name}`}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            {!showThemes ? (
              <>
                {hasContent && recommendations.length > 0 && (
                  <div className="mb-6 p-5 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gray-100 via-gray-50 to-transparent rounded-bl-full" />
                    <h3 className="relative text-sm font-bold text-gray-900 mb-3">Recommended for you</h3>
                    <div className="relative space-y-2">
                      {recommendations.slice(0, 3).map((rec) => {
                        const t = templates.find((tpl) => tpl.id === rec.templateId);
                        if (!t) return null;
                        return (
                          <button
                            key={rec.templateId}
                            onClick={() => setTemplate(t)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                              template.id === rec.templateId ? "bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-md" : "bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-200/50 border border-gray-100"
                            }`}
                          >
                            <span className="font-bold">{t.name}</span>
                            <span className={`text-xs ml-2 ${template.id === rec.templateId ? "opacity-70" : "text-gray-400"}`}>{rec.reason}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex overflow-x-auto gap-2 mb-5 pb-1 -mx-1 px-1 scrollbar-hide">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setActiveCategory(cat.value)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        activeCategory === cat.value
                          ? "bg-gray-900 text-white shadow-md"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 max-h-[50vh] sm:max-h-[600px] overflow-y-auto pr-1">
                  {filteredTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => (t.premium ? isPremium : true) && setTemplate(t)}
                      className={`group w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                        template.id === t.id
                          ? "border-gray-900 bg-white shadow-lg"
                          : t.premium && !isPremium
                            ? "border-gray-200 bg-gray-50/50 opacity-50 cursor-not-allowed"
                            : "border-gray-200/80 hover:border-gray-300 bg-white/80 hover:shadow-md"
                      }`}
                      disabled={t.premium && !isPremium}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                            {t.name}
                            {t.premium && <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold shadow-sm">PRO</span>}
                            {t.atsSafe && <span className="text-[10px] bg-gray-900 text-white px-1.5 py-0.5 rounded-full font-bold">ATS</span>}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t.description}</p>
                          <div className="flex gap-1.5 mt-2.5 flex-wrap">
                            {t.bestFor.slice(0, 3).map((b) => (
                              <span key={b} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{b}</span>
                            ))}
                          </div>
                        </div>
                        {template.id === t.id && (
                          <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 ml-2 shadow-md">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Free Colors</h3>
                <div className="space-y-2">
                  {getFreeThemes().map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t)}
                      className={`group w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                        theme.id === t.id ? "border-gray-900 bg-white shadow-lg" : "border-gray-200/80 hover:border-gray-300 bg-white/80 hover:shadow-md"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl shadow-inner" style={{ backgroundColor: t.colors.primary }} />
                      <div className="flex-1">
                        <span className="text-sm font-bold text-gray-900">{t.name}</span>
                      </div>
                      {theme.id === t.id && (
                        <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center shadow-md">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 mb-3">Premium Colors</h3>
                <div className="space-y-2">
                  {getPremiumThemes().map((t) => (
                    <button
                      key={t.id}
                      onClick={() => isPremium && setTheme(t)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                        theme.id === t.id ? "border-gray-900 bg-white shadow-lg" : isPremium ? "border-gray-200/80 hover:border-gray-300 bg-white/80 hover:shadow-md" : "border-gray-200 bg-gray-50/50 opacity-50 cursor-not-allowed"
                      }`}
                      disabled={!isPremium}
                    >
                      <div className="w-8 h-8 rounded-xl shadow-inner" style={{ backgroundColor: t.colors.primary }} />
                      <div className="flex-1">
                        <span className="text-sm font-bold text-gray-900">{t.name}</span>
                      </div>
                      {!isPremium && <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">PRO</span>}
                      {theme.id === t.id && (
                        <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center shadow-md">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-2">
            {hasContent ? (
              <div className="rounded-2xl overflow-hidden border border-gray-200/80 shadow-lg bg-white" style={{ height: "min(700px, 60vh)" }}>
                <PDFViewer width="100%" height="100%" showToolbar={false}>
                  <CVDocument
                    data={data}
                    template={template}
                    theme={theme}
                    layout={layout}
                    isPremium={isPremium}
                    fontChoice={fontChoice}
                  />
                </PDFViewer>
              </div>
            ) : (
              <div className="h-[50vh] sm:h-[700px] rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm flex items-center justify-center relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-transparent to-gray-100/30" />
                <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
                <div className="relative text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <span className="text-gray-400 text-2xl font-bold">CV</span>
                  </div>
                  <p className="text-gray-500 mb-3 font-medium">No content to preview yet</p>
                  <Link href="/build" className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 text-sm font-bold transition-colors">
                    Go fill in your details first
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
