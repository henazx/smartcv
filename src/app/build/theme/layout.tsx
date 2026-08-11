import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Templates & Themes - Choose Your Design",
  description: "Choose from 12 professional CV templates and 10 color themes. Find the perfect design for your industry and role.",
  alternates: { canonical: "https://smartcv-virid.vercel.app/build/theme" },
  openGraph: {
    title: "CV Templates & Themes | SmartCV",
    description: "Choose from 12 professional CV templates and 10 color themes.",
    url: "https://smartcv-virid.vercel.app/build/theme",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
