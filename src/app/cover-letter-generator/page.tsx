import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cover Letter Generator - Write Tailored Cover Letters Online",
  description:
    "Generate tailored cover letters for every job application. SmartCV's cover letter generator matches your experience to each job description. Free for Ethiopian job seekers.",
  alternates: { canonical: "https://smartcv.app/cover-letter-generator" },
  openGraph: {
    title: "Cover Letter Generator | SmartCV",
    description: "Generate tailored cover letters for every job application. Free for Ethiopian job seekers.",
    url: "https://smartcv.app/cover-letter-generator",
    type: "website",
  },
};

export default function CoverLetterGeneratorPage() {
  const tips = [
    { title: "Address the hiring manager by name", desc: "If the job listing includes a name, use it. If not, &quot;Dear Hiring Manager&quot; is acceptable." },
    { title: "Open with why you are writing", desc: "State the position you are applying for and why you are interested in this specific company." },
    { title: "Connect your experience to the role", desc: "Highlight 2-3 specific skills or experiences that match the job requirements." },
    { title: "Show company knowledge", desc: "Mention something specific about the company — their mission, recent projects, or values." },
    { title: "End with a call to action", desc: "Express enthusiasm and invite the hiring manager to review your CV or schedule an interview." },
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
          <Link href="/cover-letter" className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg text-sm font-semibold hover:from-gray-800 hover:to-gray-600 transition-all">
            Generate Cover Letter
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">Cover Letter Generator</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Cover Letter Generator for Ethiopian Job Seekers
        </h1>
        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
          A cover letter is your chance to tell your story. SmartCV&apos;s cover letter generator creates tailored cover letters that complement your CV and match each specific job application.
        </p>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Why Cover Letters Matter</h2>
          <p className="text-gray-600 leading-relaxed">
            In Ethiopia, many job seekers skip the cover letter. This is a missed opportunity. A well-written cover letter demonstrates your interest in the role, highlights your most relevant qualifications, and shows that you have taken the time to research the company. Many hiring managers in Ethiopia say that a cover letter can be the deciding factor between two equally qualified candidates.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">How to Write a Cover Letter</h2>
          <div className="space-y-4">
            {tips.map((t) => (
              <div key={t.title} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-1">{t.title}</h3>
                <p className="text-sm text-gray-600">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Cover Letter Structure</h2>
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-sm text-gray-700 space-y-3">
            <p><strong>Opening:</strong> State the position, express enthusiasm, and briefly mention why you are a strong fit.</p>
            <p><strong>Body (2-3 paragraphs):</strong> Connect your specific skills and experience to the job requirements. Use examples and metrics.</p>
            <p><strong>Closing:</strong> Reaffirm your interest, mention your CV, and invite the hiring manager to contact you.</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Common Cover Letter Mistakes</h2>
          <ul className="space-y-2 text-gray-600 ml-4 list-disc">
            <li>Using a generic cover letter for every application</li>
            <li>Repeating your CV word for word</li>
            <li>Focusing on what you want instead of what you can offer</li>
            <li>Being too long — keep it to one page</li>
            <li>Not proofreading for errors</li>
          </ul>
        </section>

        <section className="text-center py-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl text-white">
          <h2 className="text-2xl font-bold mb-3">Generate Your Cover Letter</h2>
          <p className="text-gray-300 mb-6 text-sm">SmartCV creates tailored cover letters for each application.</p>
          <Link href="/cover-letter" className="inline-block px-8 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm">
            Try Cover Letter Generator
          </Link>
        </section>

        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Related Resources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/cv-generator-ethiopia" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">CV Generator</Link>
            <Link href="/ats-cv-ethiopia" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">ATS CV</Link>
            <Link href="/job-match" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">Job Match</Link>
            <Link href="/cv-tips" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">CV Tips</Link>
          </div>
        </section>
      </article>
    </div>
  );
}
