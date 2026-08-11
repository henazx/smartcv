import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartCV - Your Career Twin",
  description:
    "SmartCV turns your experience into a complete job application tailored to every opportunity. Build your Career Twin, match jobs, generate tailored CVs, and prepare for interviews.",
  keywords: ["career twin", "CV builder", "job match", "Ethiopian resume", "tailored CV", "interview prep", "ATS optimization", "cover letter"],
  openGraph: {
    title: "SmartCV - Your Career Twin",
    description: "Your career, intelligently applied. Build your Career Twin, match jobs, and generate tailored applications.",
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
