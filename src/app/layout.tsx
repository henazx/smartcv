import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartCV - Build Your Professional Resume",
  description:
    "Build a professionally designed CV in minutes. 12 unique templates, intelligent scoring, ATS optimization, and PDF export. Free to use.",
  keywords: ["resume builder", "CV maker", "Ethiopian resume", "professional CV", "ATS resume", "PDF export"],
  openGraph: {
    title: "SmartCV - Build Your Professional Resume",
    description: "Build a professionally designed CV in minutes. 12 unique templates, intelligent scoring, and PDF export.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#FAFAF5]">
        {children}
      </body>
    </html>
  );
}
