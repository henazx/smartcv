import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { CVData, CVTheme, LayoutConfig } from "@/types";
import { ContactInfo } from "../shared/ContactInfo";
import { ExperienceItem } from "../shared/ExperienceItem";
import { EducationItem } from "../shared/EducationItem";
import { DynamicSections } from "../shared/DynamicSections";

interface Props { data: CVData; theme: CVTheme; layout: LayoutConfig; }

export function CompactATS({ data, theme, layout }: Props) {
  const s = makeStyles(theme, layout);
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.content}>
          <Text style={s.name}>{data.personal.fullName}</Text>
          <ContactInfo personal={data.personal} theme={theme} layout="horizontal" showLinks={false} />

          {data.personal.summary && (
            <View style={s.section}>
              <Text style={s.sectionHeading}>PROFESSIONAL SUMMARY</Text>
              <View style={[s.divider, { backgroundColor: theme.colors.border }]} />
              <Text style={s.bodyText}>{data.personal.summary}</Text>
            </View>
          )}

          {data.experiences.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionHeading}>WORK EXPERIENCE</Text>
              <View style={[s.divider, { backgroundColor: theme.colors.border }]} />
              {data.experiences.map((exp, i) => (
                <ExperienceItem key={exp.id} experience={exp} theme={theme} style="compact" fontScale={layout.fontScale} isLast={i === data.experiences.length - 1} />
              ))}
            </View>
          )}

          {data.education.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionHeading}>EDUCATION</Text>
              <View style={[s.divider, { backgroundColor: theme.colors.border }]} />
              {data.education.map((edu, i) => (
                <EducationItem key={edu.id} education={edu} theme={theme} fontScale={layout.fontScale} isLast={i === data.education.length - 1} />
              ))}
            </View>
          )}

          {data.skills.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionHeading}>SKILLS</Text>
              <View style={[s.divider, { backgroundColor: theme.colors.border }]} />
              <Text style={s.bodyText}>{data.skills.map((s) => s.name).join(", ")}</Text>
            </View>
          )}

          {data.certifications.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionHeading}>CERTIFICATIONS</Text>
              <View style={[s.divider, { backgroundColor: theme.colors.border }]} />
              {data.certifications.map((cert) => (
                <Text key={cert.id} style={s.bodyText}>{cert.name} - {cert.issuer}</Text>
              ))}
            </View>
          )}

          {data.languages.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionHeading}>LANGUAGES</Text>
              <View style={[s.divider, { backgroundColor: theme.colors.border }]} />
              <Text style={s.bodyText}>{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</Text>
            </View>
          )}

          <DynamicSections data={data} theme={theme} layout={layout} omit={{ certifications: true, languages: true }} />
        </View>

      </Page>
    </Document>
  );
}

function makeStyles(theme: CVTheme, layout: LayoutConfig) {
  return StyleSheet.create({
    page: { padding: 28, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, color: theme.colors.text, lineHeight: theme.typography.lineHeight },
    content: { flex: 1 },
    name: { fontSize: 18 * layout.fontScale, fontFamily: theme.typography.headingFont, color: theme.colors.text, marginBottom: 10 },
    section: { marginBottom: 10 },
    sectionHeading: { fontSize: 10 * layout.fontScale, fontFamily: theme.typography.headingFont, color: theme.colors.text, marginBottom: 2, textTransform: "uppercase" as const },
    divider: { height: 0.5, marginBottom: 4 },
    bodyText: { color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, lineHeight: theme.typography.lineHeight },
  });
}
