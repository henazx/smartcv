import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Readiness Score - Check Your CV Health",
  description: "Get your career readiness score. Evaluate CV health, ATS compatibility, content quality, and job match potential. See exactly what to improve before you apply.",
  alternates: { canonical: "https://smartcv-virid.vercel.app/readiness" },
  openGraph: {
    title: "Career Readiness Score | SmartCV",
    description: "Get your career readiness score. Evaluate CV health, ATS compatibility, and content quality.",
    url: "https://smartcv-virid.vercel.app/readiness",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
