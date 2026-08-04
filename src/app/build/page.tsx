"use client";

import React, { useEffect, useState } from "react";
import { useCVStore } from "@/lib/store";
import { templates } from "@/lib/templates";
import { OnboardingFlow } from "@/components/builder/OnboardingFlow";
import { BuilderLayout } from "@/components/builder/BuilderLayout";

export default function BuildPage() {
  const { hydrateFromStorage, saveToStorage, cvType, setTemplate } = useCVStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    hydrateFromStorage();

    // Apply template from URL query param (?template=xxx)
    const params = new URLSearchParams(window.location.search);
    const templateId = params.get("template");
    if (templateId) {
      const match = templates.find((t) => t.id === templateId);
      if (match) setTemplate(match);
      // Clean up the URL
      window.history.replaceState({}, "", "/build");
    }

    setHydrated(true);
  }, [hydrateFromStorage, setTemplate]);

  useEffect(() => {
    if (hydrated) {
      const interval = setInterval(saveToStorage, 5000);
      return () => clearInterval(interval);
    }
  }, [hydrated, saveToStorage]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#009A44] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!cvType) {
    return <OnboardingFlow />;
  }

  return <BuilderLayout />;
}
