import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Twin - Your Professional Profile",
  description: "Build your Career Twin: a living professional profile that adapts your experience for every job application. Edit once, apply everywhere with SmartCV.",
  alternates: { canonical: "https://smartcv-virid.vercel.app/career-twin" },
  openGraph: {
    title: "Career Twin - Your Professional Profile | SmartCV",
    description: "Build your Career Twin: a living professional profile that adapts your experience for every job application.",
    url: "https://smartcv-virid.vercel.app/career-twin",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
