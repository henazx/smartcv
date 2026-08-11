import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ethiopian CV Templates - Professional CV Designs for Ethiopia",
  description:
    "Browse 12+ professional CV templates designed for Ethiopian job seekers. ATS-friendly templates for IT, banking, healthcare, engineering, and more. Free to use.",
  alternates: { canonical: "https://smartcv-virid.vercel.app/ethiopian-cv-template" },
  openGraph: {
    title: "Ethiopian CV Templates | SmartCV",
    description: "Browse 12+ professional CV templates designed for Ethiopian job seekers. ATS-friendly and free to use.",
    url: "https://smartcv-virid.vercel.app/ethiopian-cv-template",
    type: "website",
  },
};

export default function EthiopianCvTemplatePage() {
  const templates = [
    { name: "Classic", desc: "Traditional single-column layout. Clean and professional for any industry.", best: "Banking, Government, Education" },
    { name: "Modern", desc: "Contemporary two-column design with accent colors. Stands out while staying professional.", best: "Marketing, Tech, Startups" },
    { name: "Minimal", desc: "Ultra-clean design with maximum white space. Lets your content speak for itself.", best: "Consulting, Finance, Law" },
    { name: "Bold", desc: "Strong visual hierarchy with prominent headings. Commands attention.", best: "Sales, Management, Leadership" },
    { name: "Compact", desc: "Dense layout that fits more content. Ideal for experienced professionals.", best: "Senior roles, Academic" },
    { name: "Creative", desc: "Unique layout with visual elements. Shows personality while staying professional.", best: "Design, Media, Advertising" },
    { name: "Executive", desc: "Polished design for C-level and senior management positions.", best: "Executive, Director, VP" },
    { name: "Technical", desc: "Skills-focused layout highlighting technical abilities and certifications.", best: "IT, Engineering, Data Science" },
    { name: "Academic", desc: "Research-focused with publications and conference sections.", best: "University, Research, PhD" },
    { name: "Gradient", desc: "Modern gradient backgrounds with clean typography.", best: "Tech, Creative, Digital" },
    { name: "Monochrome", desc: "Black and white elegance. Never goes out of style.", best: "Any industry" },
    { name: "Professional", desc: "Balanced design combining tradition with modern touches.", best: "All industries" },
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
            Choose a Template
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">Ethiopian CV Templates</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Professional CV Templates for Ethiopian Job Seekers
        </h1>
        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
          Choose from 12+ professionally designed CV templates. Each template is ATS-friendly and optimized for the Ethiopian job market. Pick the design that matches your industry and experience level.
        </p>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">All CV Templates</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {templates.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-400 transition-colors">
                <h3 className="font-bold text-gray-900 mb-1">{t.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{t.desc}</p>
                <p className="text-xs text-gray-400">Best for: {t.best}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How to Choose the Right CV Template</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-900">Consider your industry.</strong> Traditional industries like banking, government, and education prefer classic, conservative templates. Tech and creative industries allow more modern designs.
            </p>
            <p>
              <strong className="text-gray-900">Match your experience level.</strong> Entry-level professionals benefit from templates that highlight education and skills. Senior professionals need templates that showcase a longer career history.
            </p>
            <p>
              <strong className="text-gray-900">Think about ATS compatibility.</strong> All SmartCV templates are ATS-friendly, but simpler designs tend to perform better with automated screening systems.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">CV Formatting Tips for Ethiopia</h2>
          <ul className="space-y-2 text-gray-600 ml-4 list-disc">
            <li>Use a professional font (Helvetica, Times New Roman)</li>
            <li>Keep margins between 0.5 and 1 inch</li>
            <li>Use clear section headings</li>
            <li>Include your phone number and professional email</li>
            <li>List work experience in reverse chronological order</li>
            <li>Quantify achievements with numbers and metrics</li>
            <li>Keep it to 1-2 pages maximum</li>
          </ul>
        </section>

        <section className="text-center py-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to Use These Templates?</h2>
          <p className="text-gray-300 mb-6 text-sm">Build your Career Twin and choose a template that fits your career.</p>
          <Link href="/career-twin" className="inline-block px-8 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm">
            Get Started Free
          </Link>
        </section>

        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Related Resources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/cv-generator-ethiopia" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">CV Generator Ethiopia</Link>
            <Link href="/ats-cv-ethiopia" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">ATS CV Ethiopia</Link>
            <Link href="/fresh-graduate-cv" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">Fresh Graduate CV</Link>
            <Link href="/it-cv-template" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">IT CV Template</Link>
          </div>
        </section>
      </article>
    </div>
  );
}
