"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCVStore } from "@/lib/store";
import { getPremiumTemplates } from "@/lib/templates";
import { getPremiumThemes } from "@/lib/themes";

export default function PremiumPage() {
  const { isPremium, setIsPremium } = useCVStore();
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    try {
      const premiumFlag = localStorage.getItem("smartcv-premium");
      if (premiumFlag === "true") setIsPremium(true);
    } catch {}
  }, [setIsPremium]);

  const premiumTemplates = getPremiumTemplates();
  const premiumThemes = getPremiumThemes();

  const handleUnlock = async () => {
    setCheckingPayment(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || "user@smartcv.app", amount: 500 }),
      });
      const result = await res.json();
      if (result.checkout_url) window.location.href = result.checkout_url;
    } catch {
      alert("Payment failed. Please try again.");
    } finally {
      setCheckingPayment(false);
    }
  };

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
        {/* Hero */}
        <div className="text-center mb-10 sm:mb-14">
          {isPremium ? (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-full text-sm font-bold mb-5 shadow-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Premium Active
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full text-sm font-bold mb-5 shadow-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Premium Features
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            {isPremium ? "Your Premium Benefits" : "Unlock Premium"}
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            {isPremium
              ? "You have full access to all premium templates, colors, and watermark-free exports."
              : "Get access to exclusive templates, premium colors, and watermark-free PDF exports."}
          </p>
        </div>

        {/* Premium Templates */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">T</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Premium Templates</h2>
              <p className="text-xs text-gray-500">3 exclusive designs for standout CVs</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {premiumTemplates.map((t) => (
              <div key={t.id} className="relative bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-100 via-amber-50 to-transparent rounded-bl-full" />
                {!isPremium && (
                  <div className="absolute top-3 right-3">
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                )}
                {isPremium && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                )}
                <h3 className="font-bold text-gray-900 text-sm mb-1">{t.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{t.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {t.bestFor.slice(0, 3).map((b) => (
                    <span key={b} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{b}</span>
                  ))}
                </div>
                {isPremium && (
                  <Link href="/build/theme" className="mt-3 block text-center text-xs font-bold text-gray-900 hover:text-gray-600 transition-colors">
                    Use Template
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Premium Themes */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Premium Colors</h2>
              <p className="text-xs text-gray-500">3 exclusive color themes</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {premiumThemes.map((t) => (
              <div key={t.id} className="relative bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-100 via-amber-50 to-transparent rounded-bl-full" />
                {!isPremium && (
                  <div className="absolute top-3 right-3">
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                )}
                {isPremium && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl shadow-inner" style={{ backgroundColor: t.colors.primary }} />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{t.name}</h3>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Premium</span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.colors.primary }} />
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.colors.secondary }} />
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.colors.text }} />
                  <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: t.colors.accent }} />
                </div>
                {isPremium && (
                  <Link href="/build/theme" className="mt-3 block text-center text-xs font-bold text-gray-900 hover:text-gray-600 transition-colors">
                    Use Color
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Other Benefits */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">+</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">More Benefits</h2>
              <p className="text-xs text-gray-500">Everything else you get with premium</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-5 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Watermark-Free PDFs</h3>
                <p className="text-xs text-gray-500">Export clean PDFs without the &quot;Made with SmartCV&quot; watermark</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-5 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">All 12 Templates</h3>
                <p className="text-xs text-gray-500">Access every template including Split Profile, Creative Portfolio, and Elegant Editorial</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-5 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">All 10 Colors</h3>
                <p className="text-xs text-gray-500">Gold, Teal, and Rose premium color themes for a polished look</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-5 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Photo Support</h3>
                <p className="text-xs text-gray-500">Add your professional photo to templates that support it</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unlock CTA */}
        {!isPremium && (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='%23fff' fill-opacity='1'/%3E%3C/svg%3E\")" }} />
            <div className="relative">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">One-Time Payment</h2>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">Pay once, use forever. No subscriptions, no hidden fees.</p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email (optional)"
                  className="flex-1 px-4 py-3 rounded-xl text-sm bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-amber-400 focus:border-transparent min-h-[44px]"
                />
                <button
                  onClick={handleUnlock}
                  disabled={checkingPayment}
                  className="px-6 sm:px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 rounded-xl font-bold text-sm hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                >
                  {checkingPayment ? "Processing..." : "Unlock for 500 ETB"}
                </button>
              </div>

              <p className="text-gray-500 text-xs">Secure payment via Chapa. Works in demo mode without real payment.</p>
            </div>
          </div>
        )}

        {isPremium && (
          <div className="text-center">
            <Link href="/career-twin" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl font-bold hover:from-gray-800 hover:to-gray-600 transition-all shadow-lg hover:shadow-xl min-h-[44px]">
              Start Building Your CV
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
