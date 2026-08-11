"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BuildPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/career-twin");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Redirecting to Career Twin...</p>
      </div>
    </div>
  );
}
