import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { CVData, CVTheme, LayoutConfig } from "@/types";
import { SectionTitle } from "../shared/SectionTitle";
import { ContactInfo } from "../shared/ContactInfo";
import { ExperienceItem } from "../shared/ExperienceItem";
import { EducationItem } from "../shared/EducationItem";
import { SkillDisplay } from "../shared/SkillDisplay";
import { DynamicSections } from "../shared/DynamicSections";

interface Props {
  data: CVData;
  theme: CVTheme;
  layout: LayoutConfig;
  isPremium: boolean;
}

export function Minimalist({ data, theme, layout }: Props) {
  const s = makeStyles(theme, layout);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.content}>
          <Text style={s.name}>{data.personal.fullName}</Text>
          {data.personal.headline && <Text style={s.headline}>{data.personal.headline}</Text>}
          <ContactInfo personal={data.personal} theme={theme} layout="horizontal" />

          {data.personal.summary && (
            <Text style={[s.bodyText, { marginTop: 12 }]}>{data.personal.summary}</Text>
          )}

          {data.experiences.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Experience" theme={theme} style="plain" />
              {data.experiences.map((exp, i) => (
                <ExperienceItem key={exp.id} experience={exp} theme={theme} style="compact" fontScale={layout.fontScale} isLast={i === data.experiences.length - 1} />
              ))}
            </View>
          )}

          {data.education.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Education" theme={theme} style="plain" />
              {data.education.map((edu, i) => (
                <EducationItem key={edu.id} education={edu} theme={theme} fontScale={layout.fontScale} isLast={i === data.education.length - 1} />
              ))}
            </View>
          )}

          {data.skills.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Skills" theme={theme} style="plain" />
              <SkillDisplay skills={data.skills} theme={theme} style="comma-list" fontScale={layout.fontScale} />
            </View>
          )}

          {data.languages.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Languages" theme={theme} style="plain" />
              <Text style={s.bodyText}>
                {data.languages.map((l) => `${l.name} (${l.proficiency})`).join(" | ")}
              </Text>
            </View>
          )}

          <DynamicSections data={data} theme={theme} layout={layout} />
        </View>

      </Page>
    </Document>
  );
}

function makeStyles(theme: CVTheme, layout: LayoutConfig) {
  return StyleSheet.create({
    page: { padding: theme.spacing.padding, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, color: theme.colors.text, lineHeight: theme.typography.lineHeight },
    content: { flex: 1 },
    name: { fontSize: 22 * layout.fontScale, fontFamily: theme.typography.headingFont, color: theme.colors.text, marginBottom: 10 },
    headline: { fontSize: 10 * layout.fontScale, color: theme.colors.muted, marginBottom: 12 },
    section: { marginTop: 16 },
    bodyText: { color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, lineHeight: theme.typography.lineHeight },
  });
}
