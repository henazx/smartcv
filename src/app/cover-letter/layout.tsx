import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cover Letter Generator - Tailored Cover Letters",
  description: "Generate personalized cover letters that complement your CV. SmartCV matches your experience to each job description for compelling, targeted cover letters.",
  alternates: { canonical: "https://smartcv.app/cover-letter" },
  openGraph: {
    title: "Cover Letter Generator | SmartCV",
    description: "Generate personalized cover letters that complement your CV for every job application.",
    url: "https://smartcv.app/cover-letter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
