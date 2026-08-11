import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://smartcv.app"),
  title: {
    default: "Free CV Generator Ethiopia | SmartCV - CV Maker & Builder",
    template: "%s | SmartCV",
  },
  description:
    "Create a professional, ATS-friendly CV in minutes. Free CV generator for Ethiopian job seekers with 12+ templates, job matching, cover letters, and interview prep. Build your career twin today.",
  keywords: [
    "CV generator Ethiopia",
    "Ethiopian CV template",
    "ATS CV Ethiopia",
    "free CV maker",
    "CV builder",
    "resume builder Ethiopia",
    "professional CV",
    "cover letter generator",
    "job application Ethiopia",
    "fresh graduate CV",
    "IT CV template",
    "career twin",
    "job match",
    "interview prep",
    "Ethiopian job seekers",
  ],
  authors: [{ name: "Henok Neknikie" }],
  creator: "Henok Neknikie",
  publisher: "SmartCV",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Free CV Generator Ethiopia | SmartCV",
    description:
      "Create a professional, ATS-friendly CV in minutes. Free CV generator for Ethiopian job seekers with 12+ templates, job matching, and cover letters.",
    url: "https://smartcv.app",
    siteName: "SmartCV",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SmartCV - Free CV Generator for Ethiopian Job Seekers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free CV Generator Ethiopia | SmartCV",
    description:
      "Create a professional, ATS-friendly CV in minutes. Free for Ethiopian job seekers.",
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
  alternates: {
    canonical: "https://smartcv.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SmartCV",
    description:
      "Free CV generator for Ethiopian job seekers. Create ATS-friendly CVs, match jobs, and prepare for interviews.",
    url: "https://smartcv.app",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ETB",
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SmartCV",
    url: "https://smartcv.app",
    founder: {
      "@type": "Person",
      name: "Henok Neknikie",
    },
    description:
      "SmartCV helps Ethiopian job seekers create professional CVs, match jobs, and prepare for interviews.",
  };

  const siteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SmartCV",
    url: "https://smartcv.app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://smartcv.app/career-twin",
      "query-input": "required name=target",
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([webAppSchema, orgSchema, siteSchema]),
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-[#FAFAF5]">
        {children}
      </body>
    </html>
  );
}
