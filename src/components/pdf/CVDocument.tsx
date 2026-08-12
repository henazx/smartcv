"use client";

import React, { useEffect, useState } from "react";
import { CVData, CVTemplate, CVTheme, LayoutConfig, FontChoice, FONT_OPTIONS } from "@/types";

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
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { Font } = await import("@react-pdf/renderer");

      // Register standard PDF fonts
      Font.register({
        family: "Helvetica",
        fonts: [
          { src: "Helvetica", fontWeight: "normal", fontStyle: "normal" },
          { src: "Helvetica-Bold", fontWeight: "bold", fontStyle: "normal" },
          { src: "Helvetica-Oblique", fontWeight: "normal", fontStyle: "italic" },
          { src: "Helvetica-BoldOblique", fontWeight: "bold", fontStyle: "italic" },
        ],
      });

      Font.register({
        family: "Times-Roman",
        fonts: [
          { src: "Times-Roman", fontWeight: "normal", fontStyle: "normal" },
          { src: "Times-Bold", fontWeight: "bold", fontStyle: "normal" },
          { src: "Times-Italic", fontWeight: "normal", fontStyle: "italic" },
          { src: "Times-BoldItalic", fontWeight: "bold", fontStyle: "italic" },
        ],
      });

      Font.register({
        family: "Courier",
        fonts: [
          { src: "Courier", fontWeight: "normal", fontStyle: "normal" },
          { src: "Courier-Bold", fontWeight: "bold", fontStyle: "normal" },
          { src: "Courier-Oblique", fontWeight: "normal", fontStyle: "italic" },
          { src: "Courier-BoldOblique", fontWeight: "bold", fontStyle: "italic" },
        ],
      });

      if (mounted) setFontsReady(true);
    })();

    return () => { mounted = false; };
  }, []);

  if (!fontsReady) {
    return <div className="w-full h-96 bg-gray-50 animate-pulse rounded-lg" />;
  }

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