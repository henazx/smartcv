import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fresh Graduate CV - How to Write a CV With No Experience",
  description:
    "Just graduated? Learn how to write a professional CV with no work experience. SmartCV helps fresh graduates highlight education, projects, and transferable skills. Free CV builder.",
  alternates: { canonical: "https://smartcv-virid.vercel.app/fresh-graduate-cv" },
  openGraph: {
    title: "Fresh Graduate CV Guide | SmartCV",
    description: "Learn how to write a professional CV with no work experience. Free CV builder for fresh graduates.",
    url: "https://smartcv-virid.vercel.app/fresh-graduate-cv",
    type: "website",
  },
};

export default function FreshGraduateCvPage() {
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
            Build Your CV
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">Fresh Graduate CV</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          How to Write a CV as a Fresh Graduate in Ethiopia
        </h1>
        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
          No work experience? No problem. A well-structured CV can still make a strong impression. This guide shows fresh graduates how to highlight education, projects, and transferable skills.
        </p>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">The Challenge for Fresh Graduates</h2>
          <p className="text-gray-600 leading-relaxed">
            Ethiopian employers often require 2-3 years of experience even for entry-level positions. This creates a catch-22 for fresh graduates. The solution is a CV that demonstrates your potential through education, projects, volunteer work, and transferable skills.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What to Include in a Fresh Graduate CV</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-2">Contact Information</h3>
              <p className="text-sm text-gray-600">Full name, phone number, email address, LinkedIn (if you have one), and location. Use a professional email address.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-2">Professional Summary</h3>
              <p className="text-sm text-gray-600">Write 2-3 sentences highlighting your degree, key skills, and career goals. Focus on what you can contribute, not what you lack.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-2">Education</h3>
              <p className="text-sm text-gray-600">List your degree, university, graduation year, and GPA (if above 3.0). Include relevant coursework, thesis topics, and academic achievements.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-2">Projects</h3>
              <p className="text-sm text-gray-600">Academic projects, personal projects, or freelance work. Describe what you built, the tools you used, and the results.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-2">Skills</h3>
              <p className="text-sm text-gray-600">Technical skills (programming languages, software, tools) and soft skills (communication, teamwork, problem-solving). Match these to the job description.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-2">Volunteer Work & Extracurriculars</h3>
              <p className="text-sm text-gray-600">Leadership roles, community service, student organizations. These show initiative and real-world experience.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Example: Fresh Graduate CV Structure</h2>
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 font-mono text-sm text-gray-700 space-y-2">
            <p className="font-bold">SARA MENGISTE</p>
            <p>Addis Ababa, Ethiopia | +251 91 234 5678 | sara@email.com</p>
            <p className="mt-3 font-bold">PROFESSIONAL SUMMARY</p>
            <p>Computer Science graduate from Addis Ababa University with strong skills in Python and web development. Passionate about building solutions that solve real problems.</p>
            <p className="mt-3 font-bold">EDUCATION</p>
            <p>Bachelor of Science in Computer Science | Addis Ababa University | 2024 | GPA: 3.6</p>
            <p className="mt-3 font-bold">PROJECTS</p>
            <p>Student Management System — Built with React, Node.js, MongoDB. Handles 500+ student records.</p>
            <p className="mt-3 font-bold">SKILLS</p>
            <p>Python, JavaScript, React, Node.js, MongoDB, Git, Problem Solving, Teamwork</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Tips for Fresh Graduate CVs</h2>
          <ul className="space-y-2 text-gray-600 ml-4 list-disc">
            <li>Focus on education and projects — they are your experience</li>
            <li>Use action verbs: built, developed, analyzed, organized, led</li>
            <li>Quantify achievements: &quot;managed a team of 5&quot; or &quot;improved loading speed by 40%&quot;</li>
            <li>Tailor your CV for each application using the job description</li>
            <li>Keep it to one page — you have a short career history</li>
            <li>Proofread carefully — errors make a bad first impression</li>
          </ul>
        </section>

        <section className="text-center py-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl text-white">
          <h2 className="text-2xl font-bold mb-3">Build Your Fresh Graduate CV</h2>
          <p className="text-gray-300 mb-6 text-sm">SmartCV helps you highlight your strengths, even without work experience.</p>
          <Link href="/career-twin" className="inline-block px-8 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm">
            Get Started Free
          </Link>
        </section>

        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Related Resources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/cv-generator-ethiopia" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">CV Generator Ethiopia</Link>
            <Link href="/ats-cv-ethiopia" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">ATS CV Ethiopia</Link>
            <Link href="/ethiopian-cv-template" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">Ethiopian CV Templates</Link>
            <Link href="/cv-tips" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">CV Tips</Link>
          </div>
        </section>
      </article>
    </div>
  );
}
