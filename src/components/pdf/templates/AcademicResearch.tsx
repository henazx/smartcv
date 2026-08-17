import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { CVData, CVTheme, LayoutConfig } from "@/types";
import { SectionTitle } from "../shared/SectionTitle";
import { ContactInfo } from "../shared/ContactInfo";
import { ExperienceItem } from "../shared/ExperienceItem";
import { EducationItem } from "../shared/EducationItem";
import { SkillDisplay } from "../shared/SkillDisplay";
import { DynamicSections } from "../shared/DynamicSections";

interface Props { data: CVData; theme: CVTheme; layout: LayoutConfig; isPremium: boolean; }

export function AcademicResearch({ data, theme, layout }: Props) {
  const s = makeStyles(theme, layout);
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.content}>
          <View style={s.header}>
            <Text style={s.name}>{data.personal.fullName}</Text>
            {data.personal.headline && <Text style={s.headline}>{data.personal.headline}</Text>}
            <ContactInfo personal={data.personal} theme={theme} layout="horizontal" />
          </View>

          {data.personal.summary && (
            <View style={s.section}>
              <SectionTitle title="Research Interests" theme={theme} style="underline" />
              <Text style={s.bodyText}>{data.personal.summary}</Text>
            </View>
          )}

          {data.education.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Education" theme={theme} style="underline" level={1} />
              {data.education.map((edu, i) => (
                <EducationItem key={edu.id} education={edu} theme={theme} fontScale={layout.fontScale} isLast={i === data.education.length - 1} />
              ))}
            </View>
          )}

          {data.experiences.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Academic Experience" theme={theme} style="underline" />
              {data.experiences.map((exp, i) => (
                <ExperienceItem key={exp.id} experience={exp} theme={theme} style="detailed" fontScale={layout.fontScale} isLast={i === data.experiences.length - 1} />
              ))}
            </View>
          )}

          {data.publications.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Publications" theme={theme} style="underline" />
              {data.publications.map((pub) => (
                <View key={pub.id} style={{ marginBottom: 6 }}>
                  <Text style={{ fontFamily: theme.typography.headingFont, color: theme.colors.text, fontSize: 9.5 * layout.fontScale }}>{pub.title}</Text>
                  <Text style={{ color: theme.colors.muted, fontSize: 8.5 * layout.fontScale }}>{pub.journal}{pub.date ? `, ${pub.date}` : ""}</Text>
                  {pub.url && <Text style={{ color: theme.colors.primary, fontSize: 8 * layout.fontScale }}>{pub.url}</Text>}
                </View>
              ))}
            </View>
          )}

          {data.projects.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Projects" theme={theme} style="underline" />
              {data.projects.map((proj) => (
                <View key={proj.id} style={{ marginBottom: 6 }}>
                  <Text style={{ fontFamily: theme.typography.headingFont, color: theme.colors.text, fontSize: 9.5 * layout.fontScale }}>{proj.name}</Text>
                  {proj.description && <Text style={s.bodyText}>{proj.description}</Text>}
                  {proj.technologies.length > 0 && (
                    <Text style={{ color: theme.colors.muted, fontSize: 8 * layout.fontScale }}>{proj.technologies.join(", ")}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {data.awards.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Awards and Honors" theme={theme} style="underline" />
              {data.awards.map((award) => (
                <Text key={award.id} style={s.bodyText}>{award.name} - {award.issuer}{award.date ? ` (${award.date})` : ""}</Text>
              ))}
            </View>
          )}

          {data.skills.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Skills" theme={theme} style="underline" />
              <SkillDisplay skills={data.skills} theme={theme} style="grouped" fontScale={layout.fontScale} />
            </View>
          )}

          {data.certifications.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Certifications" theme={theme} style="underline" />
              {data.certifications.map((c) => (
                <Text key={c.id} style={s.bodyText}>{c.name} - {c.issuer}</Text>
              ))}
            </View>
          )}

          {data.languages.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Languages" theme={theme} style="underline" />
              <Text style={s.bodyText}>{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(" | ")}</Text>
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
    page: { padding: 40, paddingTop: 30, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, color: theme.colors.text, lineHeight: theme.typography.lineHeight },
    content: { flex: 1 },
    header: { marginBottom: 10 },
    name: { fontSize: 22 * layout.fontScale, fontFamily: theme.typography.headingFont, color: theme.colors.text, marginBottom: 10 },
    headline: { fontSize: 10 * layout.fontScale, color: theme.colors.muted, marginBottom: 12 },
    section: { marginBottom: theme.spacing.sectionGap * layout.spacingScale },
    bodyText: { color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, lineHeight: theme.typography.lineHeight },
  });
}
