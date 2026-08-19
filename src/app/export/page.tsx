"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useCVStore } from "@/lib/store";
import { computeLayout } from "@/lib/layoutEngine";
import { analyzeATS } from "@/lib/atsScorer";
import { analyzeQuality } from "@/lib/cvQuality";
import { ExportSafetyCheck } from "@/components/builder/ExportSafetyCheck";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { CVData, CVTemplate, CVTheme, LayoutConfig, FontChoice } from "@/types";

interface PdfDocProps {
  data: CVData;
  template: CVTemplate;
  theme: CVTheme;
  layout: LayoutConfig;
  fontChoice: FontChoice;
}

function PdfPreview({ data, template, theme, layout, fontChoice }: PdfDocProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Viewer, setViewer] = useState<React.ComponentType<any> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Doc, setDoc] = useState<React.ComponentType<any> | null>(null);
  useEffect(() => {
    Promise.all([
      import("@react-pdf/renderer").then((m) => setViewer(() => m.PDFViewer)),
      import("@/components/pdf/CVDocument").then((m) => setDoc(() => m.CVDocument)),
    ]);
  }, []);
  if (!Viewer || !Doc) return <div className="w-full h-full bg-gray-50 animate-pulse rounded-lg flex items-center justify-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>;
  return (
    <Viewer width="100%" height="100%" showToolbar={false}>
      <Doc data={data} template={template} theme={theme} layout={layout} fontChoice={fontChoice} />
    </Viewer>
  );
}

function DownloadButton({ data, template, theme, layout, fontChoice, fileName }: PdfDocProps & { fileName: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [LinkComp, setLinkComp] = useState<React.ComponentType<any> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Doc, setDoc] = useState<React.ComponentType<any> | null>(null);
  useEffect(() => {
    Promise.all([
      import("@react-pdf/renderer").then((m) => setLinkComp(() => m.PDFDownloadLink)),
      import("@/components/pdf/CVDocument").then((m) => setDoc(() => m.CVDocument)),
    ]);
  }, []);
  if (!LinkComp || !Doc) return <div className="flex-1 px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl font-bold text-center text-sm flex items-center justify-center gap-2 min-h-[44px] opacity-50">Loading PDF...</div>;
  return (
    <LinkComp
      document={<Doc data={data} template={template} theme={theme} layout={layout} fontChoice={fontChoice} />}
      fileName={fileName}
      className="group flex-1 px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl font-bold text-center hover:from-gray-800 hover:to-gray-600 transition-all shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2 min-h-[44px]"
    >
      {({ loading }: { loading: boolean }) => (
        <>
          {loading ? "Generating PDF..." : "Download PDF"}
          {!loading && <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
        </>
      )}
    </LinkComp>
  );
}

function CoverLetterDownloadButton() {
  const { coverLetter, careerProfile, data } = useCVStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [LinkComp, setLinkComp] = useState<React.ComponentType<any> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Doc, setDoc] = useState<React.ComponentType<any> | null>(null);
  useEffect(() => {
    if (coverLetter) {
      Promise.all([
        import("@react-pdf/renderer").then((m) => setLinkComp(() => m.PDFDownloadLink)),
        import("@/components/pdf/CoverLetterDocument").then((m) => setDoc(() => m.CoverLetterDocument)),
      ]);
    }
  }, [coverLetter]);
  if (!coverLetter) return null;
  if (!LinkComp || !Doc) return <div className="flex-1 px-5 sm:px-6 py-3 sm:py-3.5 border border-gray-200 text-gray-700 rounded-xl font-bold text-center text-sm flex items-center justify-center gap-2 min-h-[44px] opacity-50">Loading...</div>;
  const fullName = careerProfile.personal.fullName || data.personal.fullName || "Your Name";
  const email = careerProfile.personal.email || data.personal.email || "";
  const phone = careerProfile.personal.phone || data.personal.phone || "";
  const fileName = `Cover-Letter-${coverLetter.companyName.replace(/\s+/g, "-")}-${coverLetter.jobTitle.replace(/\s+/g, "-")}.pdf`;
  return (
    <LinkComp
      document={<Doc coverLetter={coverLetter} fullName={fullName} email={email} phone={phone} />}
      fileName={fileName}
      className="group flex-1 px-5 sm:px-6 py-3 sm:py-3.5 border border-gray-200 text-gray-700 rounded-xl font-bold text-center hover:bg-gray-50 hover:border-gray-300 transition-all text-sm flex items-center justify-center gap-2 min-h-[44px]"
    >
      {({ loading }: { loading: boolean }) => (
        <>
          {loading ? "Generating..." : "Download Cover Letter"}
          {!loading && <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
        </>
      )}
    </LinkComp>
  );
}

export default function ExportPage() {
  const { data, template, theme, layoutOverride, manualLayout, hydrateFromStorage, resetAll, fontChoice } = useCVStore();
  const [hydrated, setHydrated] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    hydrateFromStorage();
    setHydrated(true);
  }, [hydrateFromStorage]);

  const autoLayout = useMemo(() => computeLayout(data, template), [data, template]);
  const finalLayout = layoutOverride ? { ...autoLayout, ...manualLayout } : autoLayout;
  const hasContent = data.personal.fullName || data.experiences.length > 0 || data.education.length > 0;

  const atsResult = useMemo(() => analyzeATS(data, template), [data, template]);
  const qualityResult = useMemo(() => analyzeQuality(data), [data]);

  const generateFileName = () => {
    const name = data.personal.fullName.replace(/\s+/g, "_") || "CV";
    const role = template.name.replace(/\s+/g, "_");
    return `${name}_${role}.pdf`;
  };

  if (!hydrated) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100"><div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>;
  }

  const checks = [
    { label: "Contact information", pass: !!(data.personal.email && data.personal.phone) },
    { label: "Professional summary", pass: data.personal.summary.length > 30 },
    { label: "Work experience", pass: data.experiences.length > 0 },
    { label: "Education", pass: data.education.length > 0 },
    { label: "Skills listed", pass: data.skills.length > 0 },
    { label: "ATS compatible", pass: atsResult.score >= 60 },
    { label: "Quality score", pass: qualityResult.overall >= 60 },
  ];

  const passedChecks = checks.filter((c) => c.pass).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-x-hidden animate-fade-in">
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      <div className="h-1.5 w-full bg-gradient-to-r from-gray-900 via-gray-500 to-gray-300 relative" />

      <nav className="border-b border-gray-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-gray-900 to-gray-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-xs sm:text-sm">S</span>
            </div>
            <span className="text-base sm:text-lg font-bold text-gray-900">SmartCV</span>
          </Link>
          <div className="flex gap-1.5 sm:gap-2">
            <Link href="/career-twin" className="px-3 sm:px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all">
              Back to Editor
            </Link>
            <Link href="/review" className="px-3 sm:px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all hidden sm:inline-flex">
              Final Review
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 relative">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Export Your CV</h1>
          <p className="text-sm text-gray-500">Using {template.name} template with {theme.name} colors</p>
        </div>

        {!hasContent ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-transparent to-gray-100/30" />
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-5 shadow-lg">
                <span className="text-gray-400 text-2xl font-bold">CV</span>
              </div>
              <p className="text-gray-500 mb-4 text-sm font-medium">No content to export yet.</p>
              <Link href="/career-twin" className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all shadow-lg hover:shadow-xl min-h-[44px]">
                Go to Editor
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="rounded-2xl overflow-hidden border border-gray-200/80 shadow-lg bg-white" style={{ height: "min(500px, 60vh)" }}>
                <PdfPreview data={data} template={template} theme={theme} layout={finalLayout} fontChoice={fontChoice} />
              </div>

              <div className="mt-5">
                <ExportSafetyCheck />
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <DownloadButton data={data} template={template} theme={theme} layout={finalLayout} fontChoice={fontChoice} fileName={generateFileName()} />
                <CoverLetterDownloadButton />

                <button
                  onClick={() => setShowResetModal(true)}
                  className="flex-1 px-5 sm:px-6 py-3 sm:py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-center hover:bg-gray-50 hover:border-gray-300 transition-all text-sm flex items-center justify-center gap-2 min-h-[44px]"
                >
                  Start New CV
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4 sm:space-y-5">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-4 sm:p-5 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gray-100 via-gray-50 to-transparent rounded-bl-full" />
                <h3 className="relative text-sm font-bold text-gray-900 mb-4">Export Checklist</h3>
                <div className="relative space-y-2.5">
                  {checks.map((check, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${check.pass ? "bg-gray-900 text-white shadow-sm" : "bg-gray-100 text-gray-400"}`}>
                        {check.pass ? "\u2713" : "-"}
                      </span>
                      <span className={`text-xs font-medium ${check.pass ? "text-gray-700" : "text-gray-400"}`}>{check.label}</span>
                    </div>
                  ))}
                </div>
                <div className="relative mt-4 pt-4 border-t border-gray-100 text-center">
                  <span className="text-2xl font-extrabold text-gray-900">{passedChecks}</span>
                  <span className="text-sm text-gray-400 font-medium">/{checks.length}</span>
                  <span className="text-xs text-gray-500 ml-1">checks passed</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-4 sm:p-5 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gray-100 via-gray-50 to-transparent rounded-bl-full" />
                <h3 className="relative text-sm font-bold text-gray-900 mb-4">Scores</h3>
                <div className="relative space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-600">ATS Score</span>
                    <span className={`text-lg font-extrabold ${atsResult.score >= 70 ? "text-gray-900" : atsResult.score >= 50 ? "text-amber-600" : "text-red-500"}`}>
                      {atsResult.score}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${atsResult.score >= 70 ? "bg-gradient-to-r from-gray-900 to-gray-700" : atsResult.score >= 50 ? "bg-gradient-to-r from-amber-500 to-amber-600" : "bg-gradient-to-r from-red-500 to-red-600"}`} style={{ width: `${atsResult.score}%` }} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-600">Quality Score</span>
                    <span className={`text-lg font-extrabold ${qualityResult.overall >= 70 ? "text-gray-900" : qualityResult.overall >= 50 ? "text-amber-600" : "text-red-500"}`}>
                      {qualityResult.overall}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${qualityResult.overall >= 70 ? "bg-gradient-to-r from-gray-900 to-gray-700" : qualityResult.overall >= 50 ? "bg-gradient-to-r from-amber-500 to-amber-600" : "bg-gradient-to-r from-red-500 to-red-600"}`} style={{ width: `${qualityResult.overall}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={showResetModal}
        title="Start a New CV?"
        message="Your current data will be permanently cleared. This cannot be undone."
        confirmLabel="Clear & Start New"
        cancelLabel="Keep My CV"
        danger
        onConfirm={() => {
          resetAll();
          window.location.href = "/build";
        }}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
}
