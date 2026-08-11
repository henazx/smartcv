import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Export Your CV - Download Professional PDF",
  description: "Export your tailored CV as a professional PDF. Choose from 12 templates and 10 themes. ATS-optimized formatting for Ethiopian and international job markets.",
  alternates: { canonical: "https://smartcv-virid.vercel.app/export" },
  openGraph: {
    title: "Export Your CV - Professional PDF | SmartCV",
    description: "Export your tailored CV as a professional PDF with 12 templates and 10 themes.",
    url: "https://smartcv-virid.vercel.app/export",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
