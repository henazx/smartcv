import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "IT CV Template - Professional CV Templates for Tech Jobs",
  description:
    "IT CV templates designed for software developers, data scientists, DevOps engineers, and IT professionals in Ethiopia. Skills-focused layouts that highlight technical abilities. Free to use.",
  alternates: { canonical: "https://smartcv.app/it-cv-template" },
  openGraph: {
    title: "IT CV Template - Tech CV Templates | SmartCV",
    description: "IT CV templates designed for software developers, data scientists, and IT professionals. Free to use.",
    url: "https://smartcv.app/it-cv-template",
    type: "website",
  },
};

export default function ItCvTemplatePage() {
  const roles = [
    { role: "Software Developer", tips: "Highlight programming languages, frameworks, and projects. Include GitHub links. Quantify impact (reduced load time by 40%)." },
    { role: "Data Scientist", tips: "Showcase Python, R, SQL, and ML frameworks. Include model accuracy metrics and datasets worked with." },
    { role: "DevOps Engineer", tips: "Emphasize CI/CD pipelines, cloud platforms (AWS, Azure), Docker, Kubernetes, and monitoring tools." },
    { role: "IT Support", tips: "Highlight troubleshooting skills, ticketing systems, networking knowledge, and customer service experience." },
    { role: "UI/UX Designer", tips: "Include portfolio link, design tools (Figma, Adobe XD), and user research experience." },
    { role: "Cybersecurity Analyst", tips: "Showcase certifications (CEH, CompTIA Security+), vulnerability assessment, and incident response experience." },
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
            Create IT CV
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">IT CV Template</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          IT CV Templates for Tech Professionals
        </h1>
        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
          The Ethiopian tech industry is growing fast. A well-crafted CV can open doors at startups, multinational companies, and organizations across Addis Ababa and beyond. SmartCV provides IT-focused templates that showcase your technical skills.
        </p>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">CV Tips by IT Role</h2>
          <div className="space-y-4">
            {roles.map((r) => (
              <div key={r.role} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2">{r.role}</h3>
                <p className="text-sm text-gray-600">{r.tips}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What IT Employers Look For</h2>
          <ul className="space-y-2 text-gray-600 ml-4 list-disc">
            <li><strong>Technical skills:</strong> Programming languages, frameworks, tools, and platforms</li>
            <li><strong>Projects:</strong> What you have built and the impact it had</li>
            <li><strong>Certifications:</strong> AWS, Azure, Google Cloud, CompTIA, Cisco</li>
            <li><strong>Open source contributions:</strong> GitHub activity and community involvement</li>
            <li><strong>Problem-solving:</strong> How you approach and solve technical challenges</li>
            <li><strong>Communication:</strong> Ability to explain technical concepts to non-technical stakeholders</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Technical Skills Section Examples</h2>
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-sm text-gray-700 space-y-3">
            <div>
              <p className="font-bold">Full-Stack Developer</p>
              <p>Languages: JavaScript, TypeScript, Python | Frontend: React, Next.js | Backend: Node.js, Express | Database: PostgreSQL, MongoDB | Tools: Git, Docker, AWS</p>
            </div>
            <div>
              <p className="font-bold">Data Scientist</p>
              <p>Languages: Python, R, SQL | ML: TensorFlow, PyTorch, scikit-learn | Visualization: Tableau, Matplotlib | Cloud: AWS SageMaker, Google Colab</p>
            </div>
            <div>
              <p className="font-bold">DevOps Engineer</p>
              <p>Cloud: AWS, Azure, GCP | Containers: Docker, Kubernetes | CI/CD: Jenkins, GitHub Actions | Monitoring: Prometheus, Grafana | IaC: Terraform, Ansible</p>
            </div>
          </div>
        </section>

        <section className="text-center py-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl text-white">
          <h2 className="text-2xl font-bold mb-3">Build Your IT CV Now</h2>
          <p className="text-gray-300 mb-6 text-sm">Choose a technical template and highlight your skills.</p>
          <Link href="/career-twin" className="inline-block px-8 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm">
            Get Started Free
          </Link>
        </section>

        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Related Resources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/ethiopian-cv-template" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">Ethiopian CV Templates</Link>
            <Link href="/ats-cv-ethiopia" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">ATS CV Ethiopia</Link>
            <Link href="/cv-generator-ethiopia" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">CV Generator</Link>
            <Link href="/cv-tips" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">CV Tips</Link>
          </div>
        </section>
      </article>
    </div>
  );
}
