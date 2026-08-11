import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://smartcv.app"),
  title: {
    default: "SmartCV - Your Career Twin",
    template: "%s | SmartCV",
  },
  description:
    "SmartCV turns your experience into a complete job application tailored to every opportunity. Build your Career Twin, match jobs, generate tailored CVs, and prepare for interviews.",
  keywords: ["career twin", "CV builder", "job match", "Ethiopian resume", "tailored CV", "interview prep", "ATS optimization", "cover letter", "job application", "resume builder"],
  authors: [{ name: "SmartCV" }],
  creator: "SmartCV",
  publisher: "SmartCV",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "SmartCV - Your Career Twin",
    description: "Your career, intelligently applied. Build your Career Twin, match jobs, and generate tailored applications.",
    url: "https://smartcv.app",
    siteName: "SmartCV",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SmartCV - Your Career Twin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartCV - Your Career Twin",
    description: "Your career, intelligently applied. Build your Career Twin, match jobs, and generate tailored applications.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SmartCV",
    description: "Build your Career Twin, match jobs, and generate tailored applications.",
    url: "https://smartcv.app",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ETB",
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen bg-[#FAFAF5]">
        {children}
      </body>
    </html>
  );
}
