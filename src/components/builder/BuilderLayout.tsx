"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CVForm } from "@/components/form/CVForm";
import { LivePreview } from "@/components/pdf/LivePreview";
import { ScorePanel } from "@/components/builder/ScorePanel";
import { JobMatchPanel } from "@/components/builder/JobMatchPanel";
import { FontPicker } from "@/components/builder/FontPicker";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useCVStore } from "@/lib/store";

type MobileTab = "edit" | "preview" | "score";

export function BuilderLayout() {
  const [mobileTab, setMobileTab] = useState<MobileTab>("edit");
  const [showResetModal, setShowResetModal] = useState(false);
  const { undo, redo, resetAll, downloadBackup, importBackup } = useCVStore();
  const backupInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        useCVStore.getState().undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        useCVStore.getState().redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col overflow-x-hidden animate-fade-in">
      <div className="h-1.5 w-full bg-gradient-to-r from-gray-900 via-gray-500 to-gray-300" />

      <nav className="border-b border-gray-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-gray-900 to-gray-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-xs sm:text-sm">S</span>
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-gray-900 leading-none block">SmartCV</span>
              <span className="text-[8px] sm:text-[9px] text-gray-400 font-medium tracking-wider uppercase">Builder</span>
            </div>
          </Link>
          <div className="flex gap-1 sm:gap-1.5 items-center">
            <button
              onClick={undo}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
              title="Undo (Ctrl+Z)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
            </button>
            <button
              onClick={redo}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
              title="Redo (Ctrl+Y)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
            </button>
            <div className="w-px h-5 bg-gray-200 mx-0.5" />
            <button
              onClick={() => setShowResetModal(true)}
              className="px-2 sm:px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all"
              title="Start a new CV"
            >
              <span className="hidden sm:inline">New</span>
              <span className="sm:hidden">+</span>
            </button>
            <Link href="/build/theme" className="px-2 sm:px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all" title="Templates">
              <span className="hidden sm:inline">Templates</span>
              <svg className="sm:hidden w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
            </Link>
            <Link href="/review" className="hidden sm:inline-flex px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all">
              Review
            </Link>
            <Link href="/career-twin" className="hidden sm:inline-flex px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all">
              Career Twin
            </Link>
            <Link href="/job-match" className="hidden sm:inline-flex px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all">
              Job Match
            </Link>
            <Link href="/cover-letter" className="hidden sm:inline-flex px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all">
              Cover Letter
            </Link>
            <Link href="/applications" className="hidden sm:inline-flex px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all">
              Applications
            </Link>
            <Link href="/export" className="px-2 sm:px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl text-xs font-semibold hover:from-gray-800 hover:to-gray-600 transition-all shadow-md hover:shadow-lg">
              Export PDF
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 hidden lg:block relative">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-6">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <CVForm />
            </div>
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-20 lg:self-start space-y-4">
                <LivePreview />
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-20 lg:self-start space-y-4">
                <ScorePanel />
                <FontPicker />
                <JobMatchPanel />
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-4 sm:p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-100 via-gray-50 to-transparent rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-gray-50 to-transparent rounded-tr-full" />
                  <h3 className="relative text-sm font-bold text-gray-900 mb-3">Quick Actions</h3>
                  <div className="relative space-y-2.5">
                    <Link href="/build/theme" className="group block w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl text-sm text-gray-700 hover:from-gray-100 hover:to-gray-200/50 transition-all border border-gray-100">
                      <span className="font-semibold">Change Template</span>
                      <span className="text-xs text-gray-400 ml-2">12 designs</span>
                    </Link>
                    <Link href="/export" className="group block w-full text-left px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl text-sm text-white font-semibold hover:from-gray-800 hover:to-gray-600 transition-all shadow-md hover:shadow-lg">
                      Export PDF
                      <svg className="inline-block w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </Link>
                    <button
                      onClick={downloadBackup}
                      className="group block w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl text-sm text-gray-700 hover:from-gray-100 hover:to-gray-200/50 transition-all border border-gray-100"
                    >
                      <span className="font-semibold">Download Backup</span>
                      <svg className="inline-block w-4 h-4 ml-1.5 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </button>
                    <button
                      onClick={() => backupInputRef.current?.click()}
                      className="group block w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl text-sm text-gray-700 hover:from-gray-100 hover:to-gray-200/50 transition-all border border-gray-100"
                    >
                      <span className="font-semibold">Import Backup</span>
                      <svg className="inline-block w-4 h-4 ml-1.5 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    </button>
                    <input
                      ref={backupInputRef}
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) importBackup(file);
                        e.target.value = "";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 lg:hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          {mobileTab === "edit" && (
            <div className="p-3 sm:p-4">
              <CVForm />
            </div>
          )}
          {mobileTab === "preview" && (
            <div className="p-3 sm:p-4">
              <LivePreview />
            </div>
          )}
          {mobileTab === "score" && (
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              <ScorePanel />
              <JobMatchPanel />
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-4 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-full" />
                <h3 className="relative text-sm font-bold text-gray-900 mb-3">Quick Actions</h3>
                <div className="relative space-y-2.5">
                  <Link href="/build/theme" className="block w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl text-sm text-gray-700 hover:from-gray-100 hover:to-gray-200/50 transition-all border border-gray-100 font-semibold">
                    Change Template
                  </Link>
                  <Link href="/export" className="block w-full text-left px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl text-sm text-white font-semibold hover:from-gray-800 hover:to-gray-600 transition-all shadow-md">
                    Export PDF
                  </Link>
                  <button
                    onClick={downloadBackup}
                    className="block w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl text-sm text-gray-700 hover:from-gray-100 hover:to-gray-200/50 transition-all border border-gray-100 font-semibold"
                  >
                    Download Backup
                  </button>
                  <button
                    onClick={() => backupInputRef.current?.click()}
                    className="block w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl text-sm text-gray-700 hover:from-gray-100 hover:to-gray-200/50 transition-all border border-gray-100 font-semibold"
                  >
                    Import Backup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200/80 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex">
            <button
              onClick={() => setMobileTab("edit")}
              className={`flex-1 py-3.5 flex flex-col items-center gap-0.5 transition-all ${
                mobileTab === "edit" ? "text-gray-900 bg-gradient-to-b from-gray-50 to-transparent" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className={`p-1 rounded-lg transition-all ${mobileTab === "edit" ? "bg-gray-900 text-white shadow-md" : ""}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold">Edit</span>
            </button>
            <button
              onClick={() => setMobileTab("preview")}
              className={`flex-1 py-3.5 flex flex-col items-center gap-0.5 transition-all ${
                mobileTab === "preview" ? "text-gray-900 bg-gradient-to-b from-gray-50 to-transparent" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className={`p-1 rounded-lg transition-all ${mobileTab === "preview" ? "bg-gray-900 text-white shadow-md" : ""}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold">Preview</span>
            </button>
            <button
              onClick={() => setMobileTab("score")}
              className={`flex-1 py-3.5 flex flex-col items-center gap-0.5 transition-all relative ${
                mobileTab === "score" ? "text-gray-900 bg-gradient-to-b from-gray-50 to-transparent" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className={`relative p-1 rounded-lg transition-all ${mobileTab === "score" ? "bg-gray-900 text-white shadow-md" : ""}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold">Score</span>
            </button>
          </div>
        </div>
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
