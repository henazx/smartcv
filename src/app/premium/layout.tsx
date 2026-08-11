import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Features - Unlock Advanced Tools",
  description: "Unlock premium CV templates, advanced job matching, unlimited cover letters, and interview simulation. Invest in your career with SmartCV Premium.",
  alternates: { canonical: "https://smartcv-virid.vercel.app/premium" },
  openGraph: {
    title: "Premium Features - Unlock Advanced Tools | SmartCV",
    description: "Unlock premium CV templates, advanced job matching, and interview simulation.",
    url: "https://smartcv-virid.vercel.app/premium",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
