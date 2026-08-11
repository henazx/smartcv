import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview Simulator - Practice Interview Questions",
  description: "Practice with personalized interview questions based on your career profile. Get instant feedback on your answers with behavioral, technical, and situational questions.",
  alternates: { canonical: "https://smartcv-virid.vercel.app/interview" },
  openGraph: {
    title: "Interview Simulator - Practice Interview Questions | SmartCV",
    description: "Practice with personalized interview questions and get instant feedback.",
    url: "https://smartcv-virid.vercel.app/interview",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
