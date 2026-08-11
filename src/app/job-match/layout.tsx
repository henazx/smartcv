import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Match - Find Your Perfect Role",
  description: "Match your skills and experience against any job description. Get a compatibility score, gap analysis, and a tailored action plan for every opportunity.",
  alternates: { canonical: "https://smartcv.app/job-match" },
  openGraph: {
    title: "Job Match - Find Your Perfect Role | SmartCV",
    description: "Match your skills against any job description. Get a compatibility score and gap analysis.",
    url: "https://smartcv.app/job-match",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
