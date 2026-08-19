import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free CV Maker - Create a Professional CV Online (No Cost)",
  description:
    "Make a professional CV for free. SmartCV is a free CV maker with 12+ templates, ATS optimization, job matching, and cover letter generation. No account required. Your data stays in your browser.",
  alternates: { canonical: "https://smartcv-virid.vercel.app/free-cv-maker" },
  openGraph: {
    title: "Free CV Maker - Create a Professional CV Online | SmartCV",
    description: "Make a professional CV for free. 12+ templates, ATS optimization, and job matching. No account required.",
    url: "https://smartcv-virid.vercel.app/free-cv-maker",
    type: "website",
  },
};

export default function FreeCvMakerPage() {
  const features = [
    { title: "12+ Professional Templates", desc: "Choose from templates designed for different industries and experience levels." },
    { title: "ATS-Optimized Formatting", desc: "Every template is designed to pass Applicant Tracking Systems." },
    { title: "Job Matching", desc: "Paste a job description and see your compatibility score instantly." },
    { title: "Cover Letter Generator", desc: "Generate tailored cover letters for each application." },
    { title: "Interview Simulator", desc: "Practice with personalized interview questions and get feedback." },
    { title: "Application Tracker", desc: "Track all your job applications in one place." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <nav className="border-b border-gray-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-bold text-gray-900">SmartCV</span>
          </Link>
          <Link href="/career-twin" className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg text-sm font-semibold hover:from-gray-800 hover:to-gray-600 transition-all">
            Make Your CV Free
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">Free CV Maker</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Free CV Maker — No Cost, No Account Required
        </h1>
        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
          SmartCV is a completely free CV maker. Create a professional, ATS-friendly CV without paying anything. No account required — your data stays in your browser.
        </p>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">What You Get for Free</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Why is SmartCV Free?</h2>
          <p className="text-gray-600 leading-relaxed">
            We believe every Ethiopian job seeker deserves access to professional CV tools. SmartCV is completely free to use because everyone deserves a fair chance at their dream job. All templates, colors, and PDF exports are available to everyone.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How It Works</h2>
          <ol className="space-y-3 text-gray-600">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">1</span>
              <span>Build your Career Twin — enter your career info once.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">2</span>
              <span>Choose a template and theme that matches your style.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">3</span>
              <span>Export your CV as a professional PDF — free forever.</span>
            </li>
          </ol>
        </section>

        <section className="text-center py-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl text-white">
          <h2 className="text-2xl font-bold mb-3">Start Making Your CV Now</h2>
          <p className="text-gray-300 mb-6 text-sm">No sign-up. No cost. Just a professional CV.</p>
          <Link href="/career-twin" className="inline-block px-8 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm">
            Build Your CV Free
          </Link>
        </section>

        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Related Resources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/cv-generator-ethiopia" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">CV Generator Ethiopia</Link>
            <Link href="/ethiopian-cv-template" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">Ethiopian CV Templates</Link>
            <Link href="/ats-cv-ethiopia" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">ATS CV Ethiopia</Link>
            <Link href="/cv-tips" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">CV Tips</Link>
          </div>
        </section>
      </article>
    </div>
  );
}
