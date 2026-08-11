"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useCVStore } from "@/lib/store";
import { templates } from "@/lib/templates";
import { trackPageView } from "@/lib/analytics";

const EXAMPLE = {
  name: "Abebe Kebede",
  roles: ["Software Engineer", "Marketing Manager", "Research Analyst"],
  companies: ["Ethio Telecom", "Safaricom", "Dashen Bank"],
  skills: ["JavaScript", "Python", "React", "SQL", "Project Management"],
  email: "abebe.kebede@email.com",
  phone: "+251 91 234 5678",
  location: "Addis Ababa, Ethiopia",
  university: "Addis Ababa University",
  degree: "BSc Computer Science",
};

function SkillTag({ color, text }: { color: string; text: string }) {
  return (
    <span
      className="inline-block px-1.5 py-0.5 rounded text-white font-medium"
      style={{ fontSize: "5px", backgroundColor: color }}
    >
      {text}
    </span>
  );
}

function SkillBar({ color, text, width }: { color: string; text: string; width: number }) {
  return (
    <div className="flex items-center gap-1">
      <span style={{ fontSize: "4.5px", color: "#555", width: "32px", flexShrink: 0 }}>{text}</span>
      <div className="flex-1 rounded-full" style={{ height: "3px", backgroundColor: "#eee" }}>
        <div className="rounded-full" style={{ height: "100%", width: `${width}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function TemplatePreview({ templateId }: { templateId: string; layoutType?: string }) {
  if (templateId === "modern-sidebar") {
    return (
      <div className="w-full h-full bg-white text-left overflow-hidden" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="flex h-full">
          <div className="flex-1 p-2 pt-2.5">
            <div style={{ fontSize: "7px", fontWeight: 700, color: "#1e3a5f" }}>{EXAMPLE.name}</div>
            <div style={{ fontSize: "4px", color: "#888" }}>Software Engineer</div>
            <div className="mt-1.5" style={{ fontSize: "4px", color: "#888" }}>EXPERIENCE</div>
            <div style={{ fontSize: "4.5px", fontWeight: 600, color: "#333" }}>Ethio Telecom</div>
            <div style={{ fontSize: "3.5px", color: "#999" }}>2020 - Present</div>
            <div style={{ fontSize: "3.5px", color: "#777", lineHeight: 1.4 }}>Built microservices serving 2M+ users. Led migration from monolith to microservices architecture.</div>
            <div className="mt-1" style={{ fontSize: "4px", color: "#888" }}>EDUCATION</div>
            <div style={{ fontSize: "4.5px", fontWeight: 600, color: "#333" }}>{EXAMPLE.university}</div>
            <div style={{ fontSize: "3.5px", color: "#999" }}>{EXAMPLE.degree}</div>
          </div>
          <div className="p-2" style={{ width: "35%", background: "linear-gradient(180deg, #1e3a5f, #2563eb)", color: "white" }}>
            <div className="rounded-full mx-auto mb-1.5" style={{ width: "20px", height: "20px", background: "linear-gradient(135deg, #e2e8f0, #f1f5f9)" }} />
            <div style={{ fontSize: "3.5px", lineHeight: 1.5 }}>
              <div>{EXAMPLE.email}</div>
              <div>{EXAMPLE.phone}</div>
              <div>{EXAMPLE.location}</div>
            </div>
            <div className="mt-1.5" style={{ fontSize: "4px", fontWeight: 600 }}>SKILLS</div>
            {EXAMPLE.skills.map((s) => (
              <div key={s} style={{ fontSize: "3.5px", padding: "1.5px 0", opacity: 0.9 }}>{s}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "minimalist") {
    return (
      <div className="w-full h-full bg-white text-left overflow-hidden p-2.5 pt-3" style={{ fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: "4.5px", fontWeight: 400, letterSpacing: "1.5px", color: "#888", textTransform: "uppercase" }}>Software Engineer</div>
        <div style={{ fontSize: "8px", fontWeight: 300, color: "#111" }}>{EXAMPLE.name}</div>
        <div style={{ fontSize: "3px", color: "#aaa", marginTop: "2px" }}>{EXAMPLE.email} &middot; {EXAMPLE.phone}</div>
        <div className="mt-1.5" style={{ borderBottom: "0.5px solid #ddd", paddingBottom: "2px" }}>
          <div style={{ fontSize: "4px", fontWeight: 600, color: "#333" }}>Ethio Telecom</div>
          <div style={{ fontSize: "3.5px", color: "#777" }}>Senior Software Engineer &middot; 2020 - Present</div>
          <div style={{ fontSize: "3.5px", color: "#888", lineHeight: 1.5, marginTop: "1px" }}>Designed scalable APIs, optimized database queries improving performance by 40%.</div>
        </div>
        <div className="mt-1" style={{ borderBottom: "0.5px solid #ddd", paddingBottom: "2px" }}>
          <div style={{ fontSize: "4px", fontWeight: 600, color: "#333" }}>Safaricom Ethiopia</div>
          <div style={{ fontSize: "3.5px", color: "#777" }}>Software Developer &middot; 2018 - 2020</div>
          <div style={{ fontSize: "3.5px", color: "#888", lineHeight: 1.5, marginTop: "1px" }}>Developed mobile payment features for telebirr platform integration.</div>
        </div>
        <div className="mt-1">
          <div style={{ fontSize: "4px", fontWeight: 600, color: "#333" }}>{EXAMPLE.university}</div>
          <div style={{ fontSize: "3.5px", color: "#777" }}>{EXAMPLE.degree}</div>
        </div>
      </div>
    );
  }

  if (templateId === "executive") {
    return (
      <div className="w-full h-full bg-white text-left overflow-hidden" style={{ fontFamily: "Arial, sans-serif" }}>
        <div style={{ background: "linear-gradient(135deg, #111827, #1f2937)", padding: "6px 8px", color: "white" }}>
          <div className="flex items-center gap-1.5">
            <div className="rounded-full" style={{ width: "14px", height: "14px", border: "1.5px solid #d1d5db", background: "linear-gradient(135deg, #9ca3af, #d1d5db)" }} />
            <div>
              <div style={{ fontSize: "7px", fontWeight: 700, letterSpacing: "0.5px" }}>{EXAMPLE.name}</div>
              <div style={{ fontSize: "4px", opacity: 0.8, letterSpacing: "1px" }}>MARKETING MANAGER</div>
            </div>
          </div>
        </div>
        <div className="p-2 pt-1.5">
          <div style={{ fontSize: "4px", fontWeight: 700, color: "#111827", borderBottom: "1px solid #111827", paddingBottom: "1px", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "1px" }}>Experience</div>
          <div className="flex gap-1">
            <div style={{ width: "1px", background: "#d1d5db", flexShrink: 0 }} className="ml-0.5" />
            <div>
              <div style={{ fontSize: "4.5px", fontWeight: 600, color: "#111" }}>Dashen Bank</div>
              <div style={{ fontSize: "3.5px", color: "#666" }}>Head of Digital Marketing &middot; 2021 - Present</div>
              <div style={{ fontSize: "3.5px", color: "#888", lineHeight: 1.4, marginTop: "1px" }}>Spearheaded digital transformation increasing online engagement by 180%.</div>
            </div>
          </div>
          <div className="flex gap-1 mt-1">
            <div style={{ width: "1px", background: "#d1d5db", flexShrink: 0 }} className="ml-0.5" />
            <div>
              <div style={{ fontSize: "4.5px", fontWeight: 600, color: "#111" }}>Safaricom Ethiopia</div>
              <div style={{ fontSize: "3.5px", color: "#666" }}>Marketing Specialist &middot; 2018 - 2021</div>
              <div style={{ fontSize: "3.5px", color: "#888", lineHeight: 1.4, marginTop: "1px" }}>Managed campaigns across 5 regions with budgets of 10M+ ETB.</div>
            </div>
          </div>
          <div className="mt-1.5" style={{ fontSize: "4px", fontWeight: 700, color: "#111827", borderBottom: "1px solid #111827", paddingBottom: "1px", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "1px" }}>Skills</div>
          <div className="flex flex-wrap gap-0.5">
            {EXAMPLE.skills.map((s) => (
              <span key={s} style={{ fontSize: "3.5px", background: "#f3f4f6", padding: "1px 3px", borderRadius: "2px", color: "#333" }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "timeline") {
    return (
      <div className="w-full h-full bg-white text-left overflow-hidden p-2 pt-2.5" style={{ fontFamily: "Arial, sans-serif" }}>
        <div style={{ fontSize: "7px", fontWeight: 700, color: "#0f172a" }}>{EXAMPLE.name}</div>
        <div style={{ fontSize: "4px", color: "#64748b" }}>Research Analyst</div>
        <div className="mt-1 relative" style={{ borderLeft: "1.5px solid #cbd5e1", marginLeft: "3px", paddingLeft: "6px" }}>
          {[
            { year: "2022", title: "Ethio Telecom", sub: "Senior Research Analyst", desc: "Led market research studies" },
            { year: "2019", title: "Safaricom", sub: "Data Analyst", desc: "Built analytics dashboards" },
            { year: "2017", title: "Dashen Bank", sub: "Junior Analyst", desc: "Supporting financial reports" },
          ].map((item, i) => (
            <div key={i} className="relative mb-1.5">
              <div className="absolute rounded-full" style={{ width: "4px", height: "4px", background: "#475569", left: "-7.5px", top: "0.5px" }} />
              <div style={{ fontSize: "3px", color: "#94a3b8", marginBottom: "0.5px" }}>{item.year}</div>
              <div style={{ fontSize: "4.5px", fontWeight: 600, color: "#334155" }}>{item.title}</div>
              <div style={{ fontSize: "3.5px", color: "#64748b" }}>{item.sub}</div>
              <div style={{ fontSize: "3.5px", color: "#94a3b8", lineHeight: 1.4, marginTop: "0.5px" }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-1">
          <div style={{ fontSize: "4px", fontWeight: 600, color: "#475569" }}>Skills</div>
          <div className="flex flex-wrap gap-0.5 mt-0.5">
            {EXAMPLE.skills.map((s) => (
              <span key={s} style={{ fontSize: "3px", background: "#f1f5f9", padding: "1px 2.5px", borderRadius: "1.5px", color: "#475569" }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "compact-ats") {
    return (
      <div className="w-full h-full bg-white text-left overflow-hidden p-2.5 pt-2" style={{ fontFamily: "Arial, sans-serif" }}>
        <div style={{ fontSize: "8px", fontWeight: 700, color: "#000" }}>{EXAMPLE.name}</div>
        <div style={{ fontSize: "3.5px", color: "#333" }}>{EXAMPLE.email} | {EXAMPLE.phone} | {EXAMPLE.location}</div>
        <div className="mt-1">
          <div style={{ fontSize: "4px", fontWeight: 700, color: "#000", textTransform: "uppercase" }}>Professional Summary</div>
          <div style={{ fontSize: "3.5px", color: "#444", lineHeight: 1.5, marginTop: "1px" }}>Experienced software engineer with 5+ years in enterprise applications, specializing in scalable microservices.</div>
        </div>
        <div className="mt-1">
          <div style={{ fontSize: "4px", fontWeight: 700, color: "#000", textTransform: "uppercase" }}>Work Experience</div>
          <div style={{ fontSize: "4px", fontWeight: 600, color: "#222", marginTop: "1px" }}>Ethio Telecom - Software Engineer (2020-Present)</div>
          <div style={{ fontSize: "3.5px", color: "#444", lineHeight: 1.5 }}>Built microservices serving 2M+ users. Reduced API latency by 60%.</div>
          <div style={{ fontSize: "4px", fontWeight: 600, color: "#222", marginTop: "1px" }}>Safaricom - Developer (2018-2020)</div>
          <div style={{ fontSize: "3.5px", color: "#444", lineHeight: 1.5 }}>Developed payment features for telebirr. Led team of 4 engineers.</div>
        </div>
        <div className="mt-1">
          <div style={{ fontSize: "4px", fontWeight: 700, color: "#000", textTransform: "uppercase" }}>Education</div>
          <div style={{ fontSize: "3.5px", color: "#444" }}>{EXAMPLE.degree}, {EXAMPLE.university}, 2018</div>
        </div>
        <div className="mt-1">
          <div style={{ fontSize: "4px", fontWeight: 700, color: "#000", textTransform: "uppercase" }}>Skills</div>
          <div style={{ fontSize: "3.5px", color: "#444" }}>{EXAMPLE.skills.join(", ")}</div>
        </div>
      </div>
    );
  }

  if (templateId === "modern-header") {
    return (
      <div className="w-full h-full bg-white text-left overflow-hidden" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="p-2" style={{ background: "linear-gradient(135deg, #2563eb, #1e40af)", color: "white" }}>
          <div className="flex items-center gap-1.5">
            <div className="rounded-full" style={{ width: "16px", height: "16px", border: "1.5px solid rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.2)" }} />
            <div>
              <div style={{ fontSize: "8px", fontWeight: 700 }}>{EXAMPLE.name}</div>
              <div style={{ fontSize: "4px", opacity: 0.85 }}>Marketing Manager &middot; Addis Ababa</div>
            </div>
          </div>
        </div>
        <div className="p-2">
          <div className="p-1 rounded" style={{ background: "#f8fafc", marginBottom: "3px" }}>
            <div style={{ fontSize: "4px", fontWeight: 700, color: "#1e40af", textTransform: "uppercase" }}>Experience</div>
          </div>
          <div style={{ fontSize: "4.5px", fontWeight: 600, color: "#1e293b" }}>Dashen Bank</div>
          <div style={{ fontSize: "3.5px", color: "#64748b" }}>Digital Marketing Lead &middot; 2021 - Present</div>
          <div style={{ fontSize: "3.5px", color: "#888", lineHeight: 1.4, marginTop: "1px" }}>Led social media strategy reaching 500K+ followers across platforms.</div>
          <div className="mt-1" style={{ background: "#f8fafc", padding: "1px 3px", borderRadius: "2px" }}>
            <div style={{ fontSize: "4px", fontWeight: 700, color: "#1e40af", textTransform: "uppercase" }}>Skills</div>
          </div>
          <div className="flex flex-wrap gap-0.5 mt-1">
            {EXAMPLE.skills.map((s) => (
              <SkillTag key={s} color="#3b82f6" text={s} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "split-profile") {
    return (
      <div className="w-full h-full bg-white text-left overflow-hidden" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="flex h-full">
          <div className="flex-1 p-2">
            <div className="rounded-full mb-1.5" style={{ width: "18px", height: "18px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }} />
            <div style={{ fontSize: "7px", fontWeight: 700, color: "#1e293b" }}>{EXAMPLE.name}</div>
            <div style={{ fontSize: "4px", color: "#8b5cf6" }}>Marketing Manager</div>
            <div className="mt-1.5" style={{ fontSize: "3.5px", color: "#64748b", lineHeight: 1.5 }}>Results-driven marketing professional with 7+ years experience in digital strategy and brand management.</div>
            <div className="mt-1.5" style={{ fontSize: "4px", fontWeight: 600, color: "#6366f1" }}>EXPERIENCE</div>
            <div style={{ fontSize: "4.5px", fontWeight: 600, color: "#1e293b" }}>Dashen Bank</div>
            <div style={{ fontSize: "3.5px", color: "#888" }}>Marketing Manager &middot; 2021-Present</div>
            <div style={{ fontSize: "3.5px", color: "#94a3b8", lineHeight: 1.4, marginTop: "0.5px" }}>Increased brand awareness by 45% through integrated campaigns.</div>
            <div className="mt-1" style={{ fontSize: "4px", fontWeight: 600, color: "#6366f1" }}>EDUCATION</div>
            <div style={{ fontSize: "4px", fontWeight: 600, color: "#1e293b" }}>{EXAMPLE.university}</div>
            <div style={{ fontSize: "3.5px", color: "#888" }}>{EXAMPLE.degree}</div>
          </div>
          <div style={{ width: "30%", background: "#f8fafc", borderLeft: "2px solid #e2e8f0", padding: "6px 4px" }}>
            <div style={{ fontSize: "4px", fontWeight: 600, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.5px" }}>Skills</div>
            <div className="mt-1 space-y-0.5">
              {EXAMPLE.skills.map((s) => (
                <SkillBar key={s} color="#8b5cf6" text={s} width={70 + (s.charCodeAt(0) % 30)} />
              ))}
            </div>
            <div className="mt-2" style={{ fontSize: "4px", fontWeight: 600, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.5px" }}>Contact</div>
            <div style={{ fontSize: "3px", color: "#64748b", lineHeight: 1.6, marginTop: "2px" }}>
              <div>{EXAMPLE.email}</div>
              <div>{EXAMPLE.phone}</div>
              <div>{EXAMPLE.location}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "creative-portfolio") {
    return (
      <div className="w-full h-full text-left overflow-hidden" style={{ fontFamily: "Arial, sans-serif", background: "#fafafa" }}>
        <div className="p-2 pb-1.5" style={{ background: "linear-gradient(135deg, #ec4899, #f43f5e)", color: "white" }}>
          <div style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "-0.3px" }}>{EXAMPLE.name}</div>
          <div style={{ fontSize: "4px", opacity: 0.9 }}>Creative Portfolio &middot; Designer</div>
          <div className="flex gap-1.5 mt-1">
            {["01", "02", "03"].map((n) => (
              <div key={n} style={{ flex: 1, height: "14px", background: "rgba(255,255,255,0.2)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "5px", opacity: 0.8 }}>Project {n}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-2 pt-1.5">
          <div className="flex gap-1.5">
            <div className="flex-1">
              <div style={{ fontSize: "4px", fontWeight: 700, color: "#ec4899", textTransform: "uppercase" }}>Experience</div>
              <div style={{ fontSize: "4.5px", fontWeight: 600, color: "#1e293b", marginTop: "2px" }}>Safaricom Ethiopia</div>
              <div style={{ fontSize: "3.5px", color: "#64748b" }}>Creative Lead &middot; 2020-Present</div>
              <div style={{ fontSize: "3.5px", color: "#888", lineHeight: 1.4, marginTop: "0.5px" }}>Designed brand identity for telebirr campaign reaching 5M impressions.</div>
              <div className="mt-1" style={{ fontSize: "4px", fontWeight: 700, color: "#ec4899", textTransform: "uppercase" }}>Education</div>
              <div style={{ fontSize: "4px", fontWeight: 600, color: "#1e293b" }}>{EXAMPLE.university}</div>
              <div style={{ fontSize: "3.5px", color: "#64748b" }}>{EXAMPLE.degree}</div>
            </div>
            <div style={{ width: "35%", borderLeft: "1px solid #f1f5f9", paddingLeft: "4px" }}>
              <div style={{ fontSize: "4px", fontWeight: 700, color: "#ec4899", textTransform: "uppercase" }}>Skills</div>
              <div className="mt-0.5 space-y-0.5">
                {EXAMPLE.skills.map((s) => (
                  <SkillBar key={s} color="#f43f5e" text={s} width={65 + (s.charCodeAt(0) % 35)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "tech-developer") {
    return (
      <div className="w-full h-full bg-white text-left overflow-hidden" style={{ fontFamily: "'Courier New', monospace" }}>
        <div className="flex h-full">
          <div className="p-2" style={{ width: "35%", background: "#0f172a", color: "#e2e8f0" }}>
            <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#38bdf8" }}>{EXAMPLE.name}</div>
            <div style={{ fontSize: "3.5px", color: "#94a3b8" }}>Software Engineer</div>
            <div className="mt-1.5" style={{ fontSize: "3.5px", color: "#64748b", lineHeight: 1.6 }}>
              <div>{EXAMPLE.email}</div>
              <div>{EXAMPLE.phone}</div>
              <div>{EXAMPLE.location}</div>
            </div>
            <div className="mt-1.5" style={{ fontSize: "3.5px", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase" }}>Tech Stack</div>
            <div className="mt-0.5" style={{ fontSize: "3.5px", color: "#cbd5e1", lineHeight: 1.6 }}>
              <div>JavaScript, TypeScript</div>
              <div>Python, Go</div>
              <div>React, Next.js</div>
              <div>PostgreSQL, Redis</div>
              <div>Docker, AWS</div>
            </div>
            <div className="mt-1.5" style={{ fontSize: "3.5px", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase" }}>Education</div>
            <div style={{ fontSize: "3.5px", color: "#cbd5e1", marginTop: "2px" }}>{EXAMPLE.degree}</div>
            <div style={{ fontSize: "3px", color: "#64748b" }}>{EXAMPLE.university}</div>
          </div>
          <div className="flex-1 p-2 pt-2">
            <div style={{ fontSize: "4px", fontWeight: 700, color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "1px", textTransform: "uppercase", letterSpacing: "1px" }}>Experience</div>
            <div className="mt-1">
              <div style={{ fontSize: "4.5px", fontWeight: 600, color: "#0f172a" }}>Ethio Telecom</div>
              <div style={{ fontSize: "3.5px", color: "#64748b" }}>Senior Software Engineer &middot; 2020-Present</div>
              <div className="mt-0.5" style={{ fontSize: "3.5px", color: "#475569", lineHeight: 1.4 }}>
                <div>- Built microservices with Node.js serving 2M+ users</div>
                <div>- Reduced deployment time by 80% with CI/CD</div>
                <div>- Led migration to Kubernetes infrastructure</div>
              </div>
            </div>
            <div className="mt-1">
              <div style={{ fontSize: "4.5px", fontWeight: 600, color: "#0f172a" }}>Safaricom Ethiopia</div>
              <div style={{ fontSize: "3.5px", color: "#64748b" }}>Backend Developer &middot; 2018-2020</div>
              <div className="mt-0.5" style={{ fontSize: "3.5px", color: "#475569", lineHeight: 1.4 }}>
                <div>- Developed telebirr payment APIs</div>
                <div>- Optimized database queries, 40% faster</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "academic-research") {
    return (
      <div className="w-full h-full bg-white text-left overflow-hidden p-2.5 pt-2" style={{ fontFamily: "Georgia, serif" }}>
        <div style={{ textAlign: "center", borderBottom: "2px solid #1e293b", paddingBottom: "3px" }}>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#1e293b" }}>{EXAMPLE.name}</div>
          <div style={{ fontSize: "4px", color: "#64748b" }}>Research Analyst | {EXAMPLE.location}</div>
          <div style={{ fontSize: "3.5px", color: "#94a3b8" }}>{EXAMPLE.email} &middot; {EXAMPLE.phone}</div>
        </div>
        <div className="mt-1.5">
          <div style={{ fontSize: "4px", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "1px" }}>Research Interests</div>
          <div style={{ fontSize: "3.5px", color: "#475569", lineHeight: 1.5, marginTop: "1px" }}>Data Science, Machine Learning, Financial Technology, East African Digital Economy</div>
        </div>
        <div className="mt-1">
          <div style={{ fontSize: "4px", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "1px" }}>Publications</div>
          <div style={{ fontSize: "3.5px", color: "#475569", lineHeight: 1.5, marginTop: "1px" }}>&ldquo;Mobile Payment Adoption in Ethiopia&rdquo; - African Journal of Technology, 2023</div>
          <div style={{ fontSize: "3.5px", color: "#475569", lineHeight: 1.5 }}>&ldquo;Machine Learning for Credit Scoring&rdquo; - Addis Ababa University Press, 2022</div>
        </div>
        <div className="mt-1">
          <div style={{ fontSize: "4px", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "1px" }}>Experience</div>
          <div style={{ fontSize: "4px", fontWeight: 600, color: "#334155", marginTop: "1px" }}>Ethio Telecom - Research Analyst</div>
          <div style={{ fontSize: "3.5px", color: "#64748b" }}>2020 - Present</div>
          <div style={{ fontSize: "3.5px", color: "#475569", lineHeight: 1.4, marginTop: "0.5px" }}>Conducted quantitative analysis of telecom market trends. Published 3 internal whitepapers.</div>
        </div>
        <div className="mt-1">
          <div style={{ fontSize: "4px", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "1px" }}>Education</div>
          <div style={{ fontSize: "3.5px", color: "#475569" }}>{EXAMPLE.degree}, {EXAMPLE.university} (2018)</div>
        </div>
      </div>
    );
  }

  if (templateId === "elegant-editorial") {
    return (
      <div className="w-full h-full bg-white text-left overflow-hidden" style={{ fontFamily: "Georgia, serif" }}>
        <div className="p-2 pb-1" style={{ borderBottom: "2px solid #1e1b4b" }}>
          <div style={{ fontSize: "4px", fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: "2px" }}>Portfolio</div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#1e1b4b", marginTop: "1px" }}>{EXAMPLE.name}</div>
          <div style={{ fontSize: "4px", color: "#64748b" }}>Marketing Manager &middot; Brand Strategist</div>
        </div>
        <div className="p-2 pt-1.5">
          <div className="flex gap-2">
            <div className="flex-1" style={{ borderLeft: "1.5px solid #dc2626", paddingLeft: "4px" }}>
              <div style={{ fontSize: "4px", fontWeight: 700, color: "#dc2626" }}>EXPERIENCE</div>
              <div style={{ fontSize: "4.5px", fontWeight: 600, color: "#1e1b4b", marginTop: "2px" }}>Dashen Bank</div>
              <div style={{ fontSize: "3.5px", color: "#64748b" }}>Brand Manager &middot; 2021-Present</div>
              <div style={{ fontSize: "3.5px", color: "#475569", lineHeight: 1.4, marginTop: "0.5px" }}>Oversee brand strategy for 12 regional branches. Increased brand equity by 35%.</div>
              <div style={{ fontSize: "4.5px", fontWeight: 600, color: "#1e1b4b", marginTop: "2px" }}>Safaricom Ethiopia</div>
              <div style={{ fontSize: "3.5px", color: "#64748b" }}>Content Strategist &middot; 2019-2021</div>
              <div style={{ fontSize: "3.5px", color: "#475569", lineHeight: 1.4, marginTop: "0.5px" }}>Created content calendar for 5M+ subscriber base.</div>
            </div>
            <div style={{ width: "35%" }}>
              <div style={{ fontSize: "4px", fontWeight: 700, color: "#dc2626" }}>SKILLS</div>
              <div className="mt-0.5 space-y-0.5">
                {EXAMPLE.skills.map((s) => (
                  <SkillBar key={s} color="#1e1b4b" text={s} width={75 + (s.charCodeAt(0) % 25)} />
                ))}
              </div>
              <div className="mt-2" style={{ fontSize: "4px", fontWeight: 700, color: "#dc2626" }}>EDUCATION</div>
              <div style={{ fontSize: "3.5px", color: "#334155", marginTop: "1px" }}>{EXAMPLE.degree}</div>
              <div style={{ fontSize: "3px", color: "#94a3b8" }}>{EXAMPLE.university}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // classic-professional and default fallback
  return (
    <div className="w-full h-full bg-white text-left overflow-hidden p-2.5 pt-2" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="text-center" style={{ borderBottom: "1.5px solid #1e293b", paddingBottom: "3px" }}>
        <div style={{ fontSize: "8px", fontWeight: 700, color: "#111827" }}>{EXAMPLE.name}</div>
        <div style={{ fontSize: "3.5px", color: "#6b7280" }}>{EXAMPLE.email} &middot; {EXAMPLE.phone} &middot; {EXAMPLE.location}</div>
      </div>
      <div className="mt-1.5">
        <div style={{ fontSize: "4px", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "1px" }}>Professional Summary</div>
        <div style={{ fontSize: "3.5px", color: "#4b5563", lineHeight: 1.5, marginTop: "1px" }}>Experienced software engineer with expertise in building scalable applications for large-scale enterprise environments.</div>
      </div>
      <div className="mt-1">
        <div style={{ fontSize: "4px", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "1px" }}>Experience</div>
        <div style={{ fontSize: "4.5px", fontWeight: 600, color: "#1f2937", marginTop: "1px" }}>Ethio Telecom</div>
        <div style={{ fontSize: "3.5px", color: "#6b7280" }}>Software Engineer &middot; 2020 - Present</div>
        <div style={{ fontSize: "3.5px", color: "#4b5563", lineHeight: 1.4, marginTop: "0.5px" }}>Architected microservices platform handling 10K+ requests/second. Mentored 5 junior developers.</div>
        <div style={{ fontSize: "4.5px", fontWeight: 600, color: "#1f2937", marginTop: "1px" }}>Safaricom Ethiopia</div>
        <div style={{ fontSize: "3.5px", color: "#6b7280" }}>Junior Developer &middot; 2018 - 2020</div>
        <div style={{ fontSize: "3.5px", color: "#4b5563", lineHeight: 1.4, marginTop: "0.5px" }}>Contributed to telebirr mobile money platform development.</div>
      </div>
      <div className="mt-1">
        <div style={{ fontSize: "4px", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "1px" }}>Education</div>
        <div style={{ fontSize: "3.5px", color: "#4b5563" }}>{EXAMPLE.degree}, {EXAMPLE.university}</div>
      </div>
      <div className="mt-1">
        <div style={{ fontSize: "4px", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "1px" }}>Skills</div>
        <div style={{ fontSize: "3.5px", color: "#4b5563" }}>{EXAMPLE.skills.join(" | ")}</div>
      </div>
    </div>
  );
}

const SHOWCASE_TEMPLATES = ["modern-sidebar", "executive", "timeline", "creative-portfolio"];

const FLOW_STEPS = [
  { icon: "1", label: "Your Career", desc: "Build your Career Twin once" },
  { icon: "2", label: "Job Match", desc: "Paste any job description" },
  { icon: "3", label: "Smart Match", desc: "See your match score & gaps" },
  { icon: "4", label: "Tailored CV", desc: "CV customized for that job" },
  { icon: "5", label: "Interview Prep", desc: "Practice with real questions" },
];

export default function Home() {
  const { setTemplate } = useCVStore();
  const router = useRouter();
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    trackPageView("/");
    autoScrollRef.current = setInterval(() => {
      setShowcaseIndex((prev) => (prev + 1) % SHOWCASE_TEMPLATES.length);
    }, 3500);
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, []);

  const showcaseTemplates = SHOWCASE_TEMPLATES.map((id) => templates.find((t) => t.id === id)!).filter(Boolean);

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-bold text-gray-900">SmartCV</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/career-twin" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all hidden sm:inline-flex">Career Twin</Link>
            <Link href="/job-match" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all hidden sm:inline-flex">Job Match</Link>
            <Link href="/cover-letter" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all hidden sm:inline-flex">Cover Letter</Link>
            <Link href="/applications" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all hidden sm:inline-flex">Applications</Link>
            <Link href="/interview" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all hidden sm:inline-flex">Interview</Link>
            <Link href="/readiness" className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all hidden sm:inline-flex">Readiness</Link>
            <Link href="/premium" className="px-3 py-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all">Premium</Link>
            <Link href="/career-twin" className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg text-sm font-semibold hover:from-gray-800 hover:to-gray-600 transition-all shadow-sm">Build My Career Twin</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100/80 text-gray-600 rounded-full text-xs font-medium mb-5 backdrop-blur-sm">
              Your career, intelligently applied
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-5 leading-tight">
              Your CV is only<br />
              <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-400 bg-clip-text text-transparent">the beginning</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
              SmartCV turns your experience into a complete job application tailored to every opportunity. One profile,无限 applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/career-twin" className="px-7 py-3.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl font-bold hover:from-gray-800 hover:to-gray-600 transition-all shadow-lg text-sm">
                Build My Career Twin
              </Link>
              <Link href="/build" className="px-7 py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all text-sm">
                Try Job Match
              </Link>
            </div>
          </div>

          {/* Hero Showcase */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-100/50 to-transparent p-6 md:p-10">
            <div className="flex justify-center gap-4 md:gap-6 perspective-[1200px]">
              {showcaseTemplates.map((t, i) => {
                const isActive = i === showcaseIndex;
                const offset = i - showcaseIndex;
                return (
                  <div
                    key={t.id}
                    className="transition-all duration-700 ease-in-out shrink-0"
                    style={{
                      width: "clamp(140px, 22vw, 220px)",
                      transform: `rotateY(${offset * -4}deg) scale(${isActive ? 1 : 0.85}) translateX(${offset * 12}px)`,
                      opacity: isActive ? 1 : 0.5,
                      zIndex: isActive ? 10 : 5 - Math.abs(offset),
                    }}
                  >
                    <div
                      className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200/60"
                      style={{ aspectRatio: "3/4" }}
                    >
                      <TemplatePreview templateId={t.id} layoutType={t.layoutType} />
                    </div>
                    <div className={`text-center mt-3 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}>
                      <div className="text-xs font-semibold text-gray-900">{t.name}</div>
                      <div className="text-[10px] text-gray-400 capitalize">{t.category}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-1.5 mt-5">
              {showcaseTemplates.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setShowcaseIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === showcaseIndex ? "bg-gray-900 w-5" : "bg-gray-300 hover:bg-gray-400"}`}
                  aria-label={`Show ${t.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — Career Twin Flow */}
      <section className="py-16 relative">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='%23000' fill-opacity='1'/%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">How SmartCV Works</h2>
          <p className="text-sm text-gray-500 text-center max-w-md mx-auto mb-12">Build your career profile once. Then tailor it for every job you apply to.</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.icon} className="text-center relative">
                {i < 4 && <div className="hidden md:block absolute top-5 left-[60%] w-[80%] border-t border-dashed border-gray-200" />}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <span className="text-lg font-bold text-gray-700">{step.icon}</span>
                </div>
                <h3 className="font-bold text-sm mb-1">{step.label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Gallery */}
      <section id="templates" className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">12 Templates. One Career Twin.</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">Each template is a genuinely different structure. Your Career Twin adapts to any of them.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTemplate(t); router.push(`/build?template=${t.id}`); }}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 text-left"
              >
                <div className="aspect-[3/4] p-3 bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden">
                  <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-110 origin-center">
                    <TemplatePreview templateId={t.id} layoutType={t.layoutType} />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-xs text-gray-900 group-hover:text-gray-700 transition-colors">{t.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{t.category} {t.premium ? "- Premium" : ""}</p>
                  <div className="flex flex-wrap gap-0.5 mt-1.5">
                    {t.bestFor.slice(0, 2).map((item) => (
                      <span key={item} className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full">{item}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">Everything You Need</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "\u2601", title: "Career Twin", desc: "Your professional profile, saved once. Edit it, and every CV you generate updates automatically." },
              { icon: "\u2694", title: "Job Match", desc: "Paste a job description. See your match score, missing skills, and exactly what to improve." },
              { icon: "\u270D", title: "Tailored CVs", desc: "Generate a CV customized for each specific job. Same Career Twin, different emphasis." },
              { icon: "\u2709", title: "Cover Letters", desc: "Auto-generated cover letters based on your profile and the job you're applying to." },
              { icon: "\u2699", title: "ATS Optimization", desc: "Built-in ATS scoring analyzes your CV against applicant tracking systems before you apply." },
              { icon: "\u2605", title: "12 Templates", desc: "Genuinely different CV structures for every career stage and industry." },
              { icon: "\u23F1", title: "Interview Prep", desc: "Practice with role-specific questions generated from the job description and your experience." },
              { icon: "\u2611", title: "Application Tracker", desc: "Track every application from saved to interview. Never lose track of where you applied." },
              { icon: "\u260E", title: "Ethiopian-First", desc: "Ethiopian phone formats, cities, industries, Chapa payment in Birr." },
            ].map((feature) => (
              <div key={feature.title} className="p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-3">
                    <span className="text-lg">{feature.icon}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">Ready to build your Career Twin?</h2>
          <p className="text-gray-400 mb-8 text-sm md:text-base max-w-md mx-auto">Free to start. No account required. Your data stays in your browser. One profile, unlimited applications.</p>
          <Link href="/career-twin" className="inline-block px-10 py-4 bg-gradient-to-r from-white to-gray-100 text-gray-900 rounded-xl font-bold hover:from-gray-100 hover:to-white transition-all shadow-lg text-sm">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">S</span>
            </div>
            <span className="font-bold text-sm text-gray-900">SmartCV</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <Link href="/career-twin" className="hover:text-gray-600 transition-colors">Career Twin</Link>
            <Link href="/job-match" className="hover:text-gray-600 transition-colors">Job Match</Link>
            <Link href="/cover-letter" className="hover:text-gray-600 transition-colors">Cover Letter</Link>
            <Link href="/applications" className="hover:text-gray-600 transition-colors">Applications</Link>
            <Link href="/interview" className="hover:text-gray-600 transition-colors">Interview</Link>
            <Link href="/readiness" className="hover:text-gray-600 transition-colors">Readiness</Link>
            <Link href="/build" className="hover:text-gray-600 transition-colors">Builder</Link>
            <Link href="/premium" className="hover:text-gray-600 transition-colors">Premium</Link>
            <span>Made in Ethiopia</span>
          </div>
          <p className="text-xs text-gray-300">&copy; 2026 SmartCV</p>
        </div>
      </footer>
    </div>
  );
}
