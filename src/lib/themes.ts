import { CVTheme } from "@/types";

export const themes: CVTheme[] = [
  {
    id: "emerald",
    name: "Emerald",
    colors: {
      primary: "#059669",
      secondary: "#10b981",
      text: "#1f2937",
      muted: "#6b7280",
      background: "#ffffff",
      border: "#e5e7eb",
      accent: "#d1fae5",
    },
    typography: {
      headingFont: "Helvetica-Bold",
      bodyFont: "Helvetica",
      headingWeight: 700,
      bodySize: 10,
      lineHeight: 1.5,
    },
    spacing: {
      sectionGap: 14,
      elementGap: 6,
      padding: 30,
    },
    premium: false,
  },
  {
    id: "navy",
    name: "Navy",
    colors: {
      primary: "#1e3a5f",
      secondary: "#2563eb",
      text: "#111827",
      muted: "#6b7280",
      background: "#ffffff",
      border: "#d1d5db",
      accent: "#dbeafe",
    },
    typography: {
      headingFont: "Helvetica-Bold",
      bodyFont: "Helvetica",
      headingWeight: 700,
      bodySize: 10,
      lineHeight: 1.5,
    },
    spacing: {
      sectionGap: 14,
      elementGap: 6,
      padding: 30,
    },
    premium: false,
  },
  {
    id: "charcoal",
    name: "Charcoal",
    colors: {
      primary: "#374151",
      secondary: "#6b7280",
      text: "#111827",
      muted: "#9ca3af",
      background: "#ffffff",
      border: "#e5e7eb",
      accent: "#f3f4f6",
    },
    typography: {
      headingFont: "Helvetica-Bold",
      bodyFont: "Helvetica",
      headingWeight: 700,
      bodySize: 10,
      lineHeight: 1.5,
    },
    spacing: {
      sectionGap: 14,
      elementGap: 6,
      padding: 30,
    },
    premium: false,
  },
  {
    id: "burgundy",
    name: "Burgundy",
    colors: {
      primary: "#9f1239",
      secondary: "#e11d48",
      text: "#1f2937",
      muted: "#6b7280",
      background: "#ffffff",
      border: "#e5e7eb",
      accent: "#ffe4e6",
    },
    typography: {
      headingFont: "Times-Bold",
      bodyFont: "Times-Roman",
      headingWeight: 700,
      bodySize: 10,
      lineHeight: 1.5,
    },
    spacing: {
      sectionGap: 14,
      elementGap: 6,
      padding: 30,
    },
    premium: false,
  },
  {
    id: "slate",
    name: "Slate",
    colors: {
      primary: "#475569",
      secondary: "#64748b",
      text: "#0f172a",
      muted: "#94a3b8",
      background: "#ffffff",
      border: "#e2e8f0",
      accent: "#f1f5f9",
    },
    typography: {
      headingFont: "Helvetica-Bold",
      bodyFont: "Helvetica",
      headingWeight: 700,
      bodySize: 10,
      lineHeight: 1.5,
    },
    spacing: {
      sectionGap: 14,
      elementGap: 6,
      padding: 30,
    },
    premium: false,
  },
  {
    id: "forest",
    name: "Forest",
    colors: {
      primary: "#166534",
      secondary: "#22c55e",
      text: "#1a1a1a",
      muted: "#6b7280",
      background: "#ffffff",
      border: "#d1d5db",
      accent: "#dcfce7",
    },
    typography: {
      headingFont: "Helvetica-Bold",
      bodyFont: "Helvetica",
      headingWeight: 700,
      bodySize: 10,
      lineHeight: 1.5,
    },
    spacing: {
      sectionGap: 14,
      elementGap: 6,
      padding: 30,
    },
    premium: false,
  },
  {
    id: "royal",
    name: "Royal",
    colors: {
      primary: "#4338ca",
      secondary: "#6366f1",
      text: "#1e1b4b",
      muted: "#6b7280",
      background: "#ffffff",
      border: "#e0e7ff",
      accent: "#eef2ff",
    },
    typography: {
      headingFont: "Helvetica-Bold",
      bodyFont: "Helvetica",
      headingWeight: 700,
      bodySize: 10,
      lineHeight: 1.5,
    },
    spacing: {
      sectionGap: 14,
      elementGap: 6,
      padding: 30,
    },
    premium: false,
  },
  {
    id: "gold",
    name: "Gold",
    colors: {
      primary: "#a16207",
      secondary: "#ca8a04",
      text: "#1c1917",
      muted: "#78716c",
      background: "#ffffff",
      border: "#e7e5e4",
      accent: "#fef9c3",
    },
    typography: {
      headingFont: "Times-Bold",
      bodyFont: "Times-Roman",
      headingWeight: 700,
      bodySize: 10,
      lineHeight: 1.5,
    },
    spacing: {
      sectionGap: 14,
      elementGap: 6,
      padding: 30,
    },
    premium: true,
  },
  {
    id: "teal",
    name: "Teal",
    colors: {
      primary: "#0d9488",
      secondary: "#14b8a6",
      text: "#134e4a",
      muted: "#6b7280",
      background: "#ffffff",
      border: "#ccfbf1",
      accent: "#f0fdfa",
    },
    typography: {
      headingFont: "Helvetica-Bold",
      bodyFont: "Helvetica",
      headingWeight: 700,
      bodySize: 10,
      lineHeight: 1.5,
    },
    spacing: {
      sectionGap: 14,
      elementGap: 6,
      padding: 30,
    },
    premium: true,
  },
  {
    id: "rose",
    name: "Rose",
    colors: {
      primary: "#be123c",
      secondary: "#f43f5e",
      text: "#1f2937",
      muted: "#6b7280",
      background: "#ffffff",
      border: "#fecdd3",
      accent: "#fff1f2",
    },
    typography: {
      headingFont: "Helvetica-Bold",
      bodyFont: "Helvetica",
      headingWeight: 700,
      bodySize: 10,
      lineHeight: 1.5,
    },
    spacing: {
      sectionGap: 14,
      elementGap: 6,
      padding: 30,
    },
    premium: true,
  },
];

export function getThemeById(id: string): CVTheme {
  return themes.find((t) => t.id === id) || themes[0];
}

export function getFreeThemes(): CVTheme[] {
  return themes.filter((t) => !t.premium);
}

export function getPremiumThemes(): CVTheme[] {
  return themes.filter((t) => t.premium);
}
