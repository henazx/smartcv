import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CV Tips - Expert Advice for a Winning CV",
  description:
    "Expert CV tips for Ethiopian job seekers. Learn how to write a professional summary, quantify achievements, format your CV, and tailor it for each application. Free guide.",
  alternates: { canonical: "https://smartcv.app/cv-tips" },
  openGraph: {
    title: "CV Tips - Expert Advice for a Winning CV | SmartCV",
    description: "Expert CV tips for Ethiopian job seekers. Learn how to write and format a winning CV.",
    url: "https://smartcv.app/cv-tips",
    type: "website",
  },
};

export default function CvTipsPage() {
  const sections = [
    {
      title: "Writing a Professional Summary",
      content: "Your professional summary is the first thing employers read. It should be 2-3 sentences that highlight your experience, key skills, and what you bring to the role. Avoid generic phrases like &quot;hard-working professional.&quot; Instead, be specific: &quot;Marketing professional with 5 years of experience in digital campaigns and a track record of increasing engagement by 40%.&quot;",
    },
    {
      title: "Quantifying Your Achievements",
      content: "Numbers make your achievements concrete. Instead of &quot;Managed a team,&quot; write &quot;Led a team of 8 that increased quarterly revenue by 15%.&quot; Instead of &quot;Improved processes,&quot; write &quot;Streamlined the reporting process, reducing completion time from 5 days to 2 days.&quot;",
    },
    {
      title: "Formatting Your CV",
      content: "Use a clean, professional format. Stick to 1-2 pages. Use consistent fonts, spacing, and heading styles. Put the most important information first. Use bullet points instead of paragraphs. Make sure there is enough white space to avoid a cluttered look.",
    },
    {
      title: "Tailoring Your CV for Each Application",
      content: "Read the job description carefully. Identify the key skills and qualifications the employer is looking for. Make sure your CV includes these keywords. Adjust your professional summary and work experience bullets to highlight the most relevant qualifications for each specific role.",
    },
    {
      title: "Writing Strong Bullet Points",
      content: "Start each bullet point with an action verb: led, developed, implemented, increased, reduced, managed, created, launched. Follow the formula: Action + Task + Result. Example: &quot;Implemented a new inventory system that reduced waste by 20%.&quot;",
    },
    {
      title: "Choosing the Right Skills",
      content: "Include both technical and soft skills. Technical skills: programming languages, software, tools. Soft skills: communication, leadership, problem-solving, teamwork. Match your skills to the job description. Do not list skills you cannot demonstrate in an interview.",
    },
    {
      title: "Contact Information",
      content: "Include your full name, phone number, professional email, and city. Add LinkedIn if it is up to date. Do not include unnecessary personal information like marital status, religion, or photo (unless specifically required).",
    },
    {
      title: "Common CV Mistakes",
      content: "Typos and grammatical errors. Using an unprofessional email address. Including irrelevant work experience. Writing long paragraphs instead of bullet points. Not including keywords from the job description. Using a generic CV for every application.",
    },
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
            Apply These Tips
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">CV Tips</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Expert CV Tips for Ethiopian Job Seekers
        </h1>
        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
          A great CV opens doors. These expert tips will help you write a CV that stands out in the Ethiopian job market and passes ATS screening.
        </p>

        <section className="mb-12 space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">CV Checklist</h2>
          <ul className="space-y-2 text-gray-600 ml-4 list-disc">
            <li>Professional summary tailored to the target role</li>
            <li>Work experience with quantified achievements</li>
            <li>Relevant education and certifications</li>
            <li>Skills matched to the job description</li>
            <li>Contact information with professional email</li>
            <li>1-2 pages maximum</li>
            <li>No typos or grammatical errors</li>
            <li>ATS-friendly formatting</li>
          </ul>
        </section>

        <section className="text-center py-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to Apply These Tips?</h2>
          <p className="text-gray-300 mb-6 text-sm">SmartCV helps you implement every tip automatically.</p>
          <Link href="/career-twin" className="inline-block px-8 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm">
            Build Your CV Now
          </Link>
        </section>

        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Related Resources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/cv-generator-ethiopia" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">CV Generator</Link>
            <Link href="/ats-cv-ethiopia" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">ATS CV</Link>
            <Link href="/ethiopian-cv-template" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">CV Templates</Link>
            <Link href="/fresh-graduate-cv" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">Fresh Graduate CV</Link>
          </div>
        </section>
      </article>
    </div>
  );
}
