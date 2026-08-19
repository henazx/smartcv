"use client";

import React from "react";
import Link from "next/link";
import { templates } from "@/lib/templates";
import { themes } from "@/lib/themes";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-x-hidden animate-fade-in">
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
            <Link href="/career-twin" className="px-3 sm:px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-all">
              Editor
            </Link>
            <Link href="/export" className="px-3 sm:px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-all">
              Export
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-8 sm:py-12 relative">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-full text-sm font-bold mb-5 shadow-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            All Features Included
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Everything is free
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Every template, every color theme, and clean PDF exports are available to all users. No paywall, no watermark, no account required.
          </p>
        </div>

        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">T</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">All {templates.length} Templates</h2>
              <p className="text-xs text-gray-500">Choose the design that fits the job you are applying for</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {templates.map((t) => (
              <div key={t.id} className="relative bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-100 via-gray-50 to-transparent rounded-bl-full" />
                <h3 className="font-bold text-gray-900 text-sm mb-1">{t.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{t.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {t.bestFor.slice(0, 3).map((b) => (
                    <span key={b} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{b}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">All {themes.length} Color Themes</h2>
              <p className="text-xs text-gray-500">Match your CV to your industry</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {themes.map((t) => (
              <div key={t.id} className="relative bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-100 via-gray-50 to-transparent rounded-bl-full" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl shadow-inner" style={{ backgroundColor: t.colors.primary }} />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{t.name}</h3>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.colors.primary }} />
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.colors.secondary }} />
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.colors.text }} />
                  <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: t.colors.accent }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='%23fff' fill-opacity='1'/%3E%3C/svg%3E\")" }} />
          <div className="relative">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">Start building your CV</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">Build your Career Twin profile and generate a polished CV in minutes.</p>
            <Link href="/career-twin" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl min-h-[44px]">
              Go to Career Twin
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}