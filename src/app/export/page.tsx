"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useCVStore } from "@/lib/store";
import { computeLayout } from "@/lib/layoutEngine";
import { analyzeATS } from "@/lib/atsScorer";
import { analyzeQuality } from "@/lib/cvQuality";
import { CVDocument } from "@/components/pdf/CVDocument";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ExportSafetyCheck } from "@/components/builder/ExportSafetyCheck";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function ExportPage() {
  const { data, template, theme, layoutOverride, manualLayout, isPremium, setIsPremium, hydrateFromStorage, resetAll, fontChoice } = useCVStore();
  const [hydrated, setHydrated] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(false);

  useEffect(() => {
    hydrateFromStorage();
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      setIsPremium(true);
      localStorage.setItem("smartcv-premium", "true");
    }
    setHydrated(true);
  }, [hydrateFromStorage, setIsPremium]);

  useEffect(() => {
    if (hydrated) {
      const premiumFlag = localStorage.getItem("smartcv-premium");
      if (premiumFlag === "true") setIsPremium(true);
    }
  }, [hydrated, setIsPremium]);

  const autoLayout = useMemo(() => computeLayout(data, template), [data, template]);
  const finalLayout = layoutOverride ? { ...autoLayout, ...manualLayout } : autoLayout;
  const hasContent = data.personal.fullName || data.experiences.length > 0 || data.education.length > 0;

  const atsResult = useMemo(() => analyzeATS(data, template), [data, template]);
  const qualityResult = useMemo(() => analyzeQuality(data), [data]);

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

  const generateFileName = () => {
    const name = data.personal.fullName.replace(/\s+/g, "_") || "CV";
    const role = template.name.replace(/\s+/g, "_");
    return `${name}_${role}.pdf`;
  };

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
            <Link href="/build" className="px-3 sm:px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all">
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
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-5 shadow-lg">
                <span className="text-gray-400 text-2xl font-bold">CV</span>
              </div>
              <p className="text-gray-500 mb-4 text-sm font-medium">No content to export yet.</p>
              <Link href="/build" className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-sm font-bold hover:from-gray-800 hover:to-gray-600 transition-all shadow-lg hover:shadow-xl min-h-[44px]">
                Go to Editor
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="rounded-2xl overflow-hidden border border-gray-200/80 shadow-lg bg-white" style={{ height: "min(500px, 60vh)" }}>
                <PDFViewer width="100%" height="100%" showToolbar={false}>
                  <CVDocument data={data} template={template} theme={theme} layout={finalLayout} isPremium={isPremium} fontChoice={fontChoice} />
                </PDFViewer>
              </div>

              <div className="mt-5">
                <ExportSafetyCheck />
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <PDFDownloadLink
                  document={<CVDocument data={data} template={template} theme={theme} layout={finalLayout} isPremium={isPremium} fontChoice={fontChoice} />}
                  fileName={generateFileName()}
                  className="group flex-1 px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl font-bold text-center hover:from-gray-800 hover:to-gray-600 transition-all shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2 min-h-[44px]"
                >
                  {({ loading }) => (
                    <>
                      {loading ? "Generating PDF..." : "Download PDF"}
                      {!loading && <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
                    </>
                  )}
                </PDFDownloadLink>

                <button
                  onClick={() => setShowResetModal(true)}
                  className="flex-1 px-5 sm:px-6 py-3 sm:py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-center hover:bg-gray-50 hover:border-gray-300 transition-all text-sm flex items-center justify-center gap-2 min-h-[44px]"
                >
                  Start New CV
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>

                {!isPremium && (
                  <button
                    onClick={async () => {
                      setCheckingPayment(true);
                      try {
                        const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.personal.email || "user@smartcv.app", amount: 500 }) });
                        const result = await res.json();
                        if (result.checkout_url) window.location.href = result.checkout_url;
                      } catch { setPaymentError(true); } finally { setCheckingPayment(false); }
                    }}
                    className="flex-1 px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-center hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    {checkingPayment ? "Processing..." : "Unlock Premium (500 ETB)"}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </button>
                )}
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

              {!isPremium && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/80 rounded-2xl p-4 sm:p-5 text-xs text-gray-600 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-full" />
                  <p className="relative"><strong className="text-gray-900">Free tier:</strong> All templates, 7 colors, PDF with watermark. Premium removes watermark + unlocks 3 extra colors.</p>
                </div>
              )}

              {isPremium && (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-4 sm:p-5 text-xs text-gray-300 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <strong className="text-white font-bold">Premium unlocked!</strong>
                  </div>
                  <p>All templates, all colors, watermark-free PDFs.</p>
                </div>
              )}
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

      <ConfirmModal
        open={paymentError}
        title="Payment Failed"
        message="Something went wrong with the payment. Please try again or contact support."
        confirmLabel="OK"
        cancelLabel="Cancel"
        onConfirm={() => setPaymentError(false)}
        onCancel={() => setPaymentError(false)}
      />
    </div>
  );
}
