"use client";

import React from "react";
import { CVData, CVTemplate, CVTheme, LayoutConfig, FontChoice, FONT_OPTIONS } from "@/types";
import { ensureFontsRegistered } from "@/lib/fonts";

import { ClassicProfessional } from "./templates/ClassicProfessional";
import { ModernSidebar } from "./templates/ModernSidebar";
import { Minimalist } from "./templates/Minimalist";
import { Executive } from "./templates/Executive";
import { Timeline } from "./templates/Timeline";
import { CompactATS } from "./templates/CompactATS";
import { ModernHeader } from "./templates/ModernHeader";
import { SplitProfile } from "./templates/SplitProfile";
import { CreativePortfolio } from "./templates/CreativePortfolio";
import { TechDeveloper } from "./templates/TechDeveloper";
import { AcademicResearch } from "./templates/AcademicResearch";
import { ElegantEditorial } from "./templates/ElegantEditorial";

interface CVDocumentProps {
  data: CVData;
  template: CVTemplate;
  theme: CVTheme;
  layout: LayoutConfig;
  isPremium: boolean;
  fontChoice: FontChoice;
}

interface TemplateProps {
  data: CVData;
  template: CVTemplate;
  theme: CVTheme;
  layout: LayoutConfig;
  isPremium: boolean;
}

const templateMap: Record<string, React.FC<TemplateProps>> = {
  "classic-professional": ClassicProfessional,
  "modern-sidebar": ModernSidebar,
  "minimalist": Minimalist,
  "executive": Executive,
  "timeline": Timeline,
  "compact-ats": CompactATS,
  "modern-header": ModernHeader,
  "split-profile": SplitProfile,
  "creative-portfolio": CreativePortfolio,
  "tech-developer": TechDeveloper,
  "academic-research": AcademicResearch,
  "elegant-editorial": ElegantEditorial,
};

export function CVDocument({ data, template, theme, layout, isPremium, fontChoice }: CVDocumentProps) {
  ensureFontsRegistered();
  const TemplateComponent = templateMap[template.id] || ClassicProfessional;

  const fontOption = FONT_OPTIONS.find((f) => f.id === fontChoice) || FONT_OPTIONS[0];
  const themedTheme: CVTheme = {
    ...theme,
    typography: {
      ...theme.typography,
      headingFont: fontOption.headingFamily,
      bodyFont: fontOption.bodyFamily,
    },
  };

  return (
    <TemplateComponent
      data={data}
      template={template}
      theme={themedTheme}
      layout={layout}
      isPremium={isPremium}
    />
  );
}
