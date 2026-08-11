import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ATS CV Ethiopia - Create an ATS-Friendly CV That Gets Interviews",
  description:
    "Learn how to create an ATS-friendly CV for Ethiopian employers. SmartCV generates CVs that pass Applicant Tracking Systems and reach hiring managers. Free ATS optimization.",
  alternates: { canonical: "https://smartcv.app/ats-cv-ethiopia" },
  openGraph: {
    title: "ATS CV Ethiopia - ATS-Friendly CV Generator | SmartCV",
    description: "Create an ATS-friendly CV that passes automated screening. Free for Ethiopian job seekers.",
    url: "https://smartcv.app/ats-cv-ethiopia",
    type: "website",
  },
};

export default function AtsCvEthiopiaPage() {
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
            Create ATS CV
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">ATS CV Ethiopia</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          ATS-Friendly CV Generator for Ethiopia
        </h1>
        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
          Most Ethiopian employers now use Applicant Tracking Systems (ATS) to screen CVs. If your CV is not ATS-friendly, it may be rejected before a human ever sees it. SmartCV generates ATS-optimized CVs automatically.
        </p>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What is an ATS?</h2>
          <p className="text-gray-600 leading-relaxed">
            An Applicant Tracking System (ATS) is software used by employers to collect, sort, and filter job applications. It scans your CV for keywords, formatting, and structure. If your CV does not match the criteria, the ATS may automatically reject it — even if you are qualified.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            In Ethiopia, companies like Ethio Telecom, Dashen Bank, and international organizations operating in Addis Ababa increasingly use ATS software. Having an ATS-friendly CV is no longer optional.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How to Make Your CV ATS-Friendly</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-2">1. Use Standard Section Headings</h3>
              <p className="text-sm text-gray-600">ATS systems look for standard headings: &quot;Work Experience,&quot; &quot;Education,&quot; &quot;Skills,&quot; &quot;Contact Information.&quot; Avoid creative headings like &quot;My Journey&quot; or &quot;What I Bring.&quot;</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-2">2. Include Keywords from the Job Description</h3>
              <p className="text-sm text-gray-600">Read the job description carefully. Identify the key skills and qualifications the employer is looking for. Include these exact words in your CV. SmartCV&apos;s job match feature does this automatically.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-2">3. Avoid Complex Formatting</h3>
              <p className="text-sm text-gray-600">Tables, text boxes, headers/footers, and columns can confuse ATS software. Use a simple, clean layout. SmartCV templates are designed to be ATS-compatible.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-2">4. Use Standard Fonts</h3>
              <p className="text-sm text-gray-600">Stick to standard fonts like Helvetica, Arial, or Times New Roman. Decorative fonts may not be read correctly by ATS software.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-2">5. Save as PDF</h3>
              <p className="text-sm text-gray-600">PDF format preserves your formatting across all devices and is widely supported by ATS systems. SmartCV exports your CV as a clean, ATS-friendly PDF.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Common ATS Mistakes to Avoid</h2>
          <ul className="space-y-2 text-gray-600 ml-4 list-disc">
            <li>Using abbreviations without the full version (write &quot;Bachelor of Science (BS)&quot;)</li>
            <li>Putting important information in headers or footers</li>
            <li>Using images or icons instead of text</li>
            <li>Submitting a Word document with complex formatting</li>
            <li>Not including enough keywords from the job description</li>
            <li>Using a CV template that is not ATS-compatible</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How SmartCV Helps</h2>
          <p className="text-gray-600 leading-relaxed">
            SmartCV&apos;s job match feature analyzes your CV against any job description and identifies missing keywords and skills. Every template is designed to be ATS-compatible. The content assistant helps you write bullet points that include the right keywords.
          </p>
        </section>

        <section className="text-center py-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl text-white">
          <h2 className="text-2xl font-bold mb-3">Create Your ATS-Friendly CV</h2>
          <p className="text-gray-300 mb-6 text-sm">Free to start. No account required.</p>
          <Link href="/career-twin" className="inline-block px-8 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm">
            Build Your CV Now
          </Link>
        </section>

        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Related Resources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/cv-generator-ethiopia" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">CV Generator Ethiopia</Link>
            <Link href="/ethiopian-cv-template" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">Ethiopian CV Templates</Link>
            <Link href="/fresh-graduate-cv" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">Fresh Graduate CV</Link>
            <Link href="/cv-tips" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">CV Tips</Link>
          </div>
        </section>
      </article>
    </div>
  );
}
