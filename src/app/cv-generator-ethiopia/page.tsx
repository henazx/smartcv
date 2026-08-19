import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free CV Generator Ethiopia | Create a Professional CV Online",
  description:
    "Create a professional, ATS-friendly CV in minutes with SmartCV's free CV generator for Ethiopian job seekers. 12+ templates, smart formatting, and tailored content suggestions.",
  alternates: { canonical: "https://smartcv-virid.vercel.app/cv-generator-ethiopia" },
  openGraph: {
    title: "Free CV Generator Ethiopia | SmartCV",
    description:
      "Create a professional, ATS-friendly CV in minutes. Free for Ethiopian job seekers.",
    url: "https://smartcv-virid.vercel.app/cv-generator-ethiopia",
    type: "website",
  },
};

export default function CvGeneratorEthiopiaPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I create a CV in Ethiopia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use SmartCV's free CV generator. Enter your career information once, then tailor it for each job application. Choose from 12+ professional templates designed for the Ethiopian job market.",
        },
      },
      {
        "@type": "Question",
        name: "What format should a CV be in Ethiopia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A professional CV in Ethiopia should include: contact information, professional summary, work experience, education, skills, and languages. Use ATS-friendly formatting with clear section headings.",
        },
      },
      {
        "@type": "Question",
        name: "Is SmartCV free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. SmartCV is completely free. Build your Career Twin, match jobs, and generate your CV at no cost. All templates, colors, and PDF exports are available to everyone.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Nav */}
        <nav className="border-b border-gray-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold text-gray-900">SmartCV</span>
            </Link>
            <Link href="/career-twin" className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg text-sm font-semibold hover:from-gray-800 hover:to-gray-600 transition-all">
              Create Your CV
            </Link>
          </div>
        </nav>

        <article className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Free CV Generator for Ethiopian Job Seekers
          </h1>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed">
            Create a professional, ATS-friendly CV in minutes. SmartCV is the free CV generator designed specifically for the Ethiopian job market, with templates, formatting, and content suggestions that match local employer expectations.
          </p>

          {/* Breadcrumb */}
          <nav className="text-xs text-gray-400 mb-8">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-600">CV Generator Ethiopia</span>
          </nav>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Why Use SmartCV to Generate Your CV?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Ethiopian employers receive hundreds of CVs for every opening. Most are rejected by Applicant Tracking Systems before a human ever sees them. SmartCV generates CVs that are formatted to pass ATS screening, so your application actually reaches the hiring manager.
            </p>
            <ul className="space-y-2 text-gray-600 ml-4 list-disc">
              <li><strong>12+ professional templates</strong> designed for Ethiopian industries</li>
              <li><strong>ATS-optimized formatting</strong> that passes automated screening</li>
              <li><strong>Smart content suggestions</strong> based on your experience and target role</li>
              <li><strong>Job matching</strong> that highlights your strongest qualifications for each application</li>
              <li><strong>Cover letter generation</strong> tailored to each job description</li>
              <li><strong>Interview preparation</strong> with personalized practice questions</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">How to Create a CV in Ethiopia (Step by Step)</h2>
            <ol className="space-y-4 text-gray-600">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">1</span>
                <div>
                  <strong className="text-gray-900">Build Your Career Twin.</strong> Enter your personal details, work experience, education, skills, and career goals. This is your master profile — edit once, use everywhere.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">2</span>
                <div>
                  <strong className="text-gray-900">Match a Job.</strong> Paste a job description and SmartCV analyzes the match. You will see your compatibility score, missing skills, and a tailored action plan.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">3</span>
                <div>
                  <strong className="text-gray-900">Choose a Template.</strong> Select from 12+ professional CV templates and 10 color themes. Each template is designed for different industries and experience levels.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">4</span>
                <div>
                  <strong className="text-gray-900">Export as PDF.</strong> Download your tailored CV as a professionally formatted PDF. Ready to submit to any Ethiopian employer.
                </div>
              </li>
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">What Makes a CV ATS-Friendly?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Applicant Tracking Systems scan your CV for keywords, formatting, and structure. A CV that is not ATS-friendly may be rejected before a human reads it. Here is what ATS systems look for:
            </p>
            <ul className="space-y-2 text-gray-600 ml-4 list-disc">
              <li>Clear section headings (Experience, Education, Skills)</li>
              <li>Standard fonts and formatting</li>
              <li>Keywords from the job description</li>
              <li>No tables, text boxes, or complex layouts</li>
              <li>Consistent date formats</li>
              <li>Contact information at the top</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              SmartCV handles all of this automatically. Every template is designed to be ATS-compatible.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">CV Tips for Ethiopian Job Seekers</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Keep it to 1-2 pages</h3>
                <p className="text-sm text-gray-600">Ethiopian employers prefer concise CVs. One page for early career, two pages for senior roles.</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Quantify your achievements</h3>
                <p className="text-sm text-gray-600">Use numbers and metrics. &quot;Increased sales by 25%&quot; is stronger than &quot;Responsible for sales.&quot;</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Include relevant skills</h3>
                <p className="text-sm text-gray-600">Match your skills to the job description. Include both technical and soft skills.</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Write a strong summary</h3>
                <p className="text-sm text-gray-600">Your professional summary is the first thing employers read. Make it count.</p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-2">How do I create a CV in Ethiopia?</h3>
                <p className="text-sm text-gray-600">Use SmartCV&apos;s free CV generator. Enter your career information once, then tailor it for each job application. Choose from 12+ professional templates designed for the Ethiopian job market.</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-2">What format should a CV be in Ethiopia?</h3>
                <p className="text-sm text-gray-600">A professional CV in Ethiopia should include: contact information, professional summary, work experience, education, skills, and languages. Use ATS-friendly formatting with clear section headings.</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Is SmartCV free to use?</h3>
                <p className="text-sm text-gray-600">Yes. SmartCV is completely free. Build your Career Twin, match jobs, and generate your CV at no cost. All templates, colors, and PDF exports are available to everyone.</p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl text-white">
            <h2 className="text-2xl font-bold mb-3">Ready to Create Your CV?</h2>
            <p className="text-gray-300 mb-6 text-sm">Free to start. No account required. Your data stays in your browser.</p>
            <Link href="/career-twin" className="inline-block px-8 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm">
              Build Your CV Now
            </Link>
          </section>

          {/* Related Links */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Related Resources</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link href="/ethiopian-cv-template" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">Ethiopian CV Templates</Link>
              <Link href="/ats-cv-ethiopia" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">ATS CV Ethiopia</Link>
              <Link href="/fresh-graduate-cv" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">Fresh Graduate CV</Link>
              <Link href="/cover-letter-generator" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">Cover Letter Generator</Link>
              <Link href="/free-cv-maker" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">Free CV Maker</Link>
              <Link href="/it-cv-template" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">IT CV Template</Link>
              <Link href="/cv-tips" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">CV Tips</Link>
              <Link href="/job-match" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">Job Match</Link>
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
