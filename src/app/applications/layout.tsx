import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Tracker - Manage Your Job Applications",
  description: "Track all your job applications in one place. Monitor status from saved to applied to interview to offer. Generate recruiter messages and interview prep materials.",
  alternates: { canonical: "https://smartcv-virid.vercel.app/applications" },
  openGraph: {
    title: "Application Tracker | SmartCV",
    description: "Track all your job applications in one place. Monitor status from saved to interview to offer.",
    url: "https://smartcv-virid.vercel.app/applications",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
