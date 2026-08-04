import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { CVData, CVTheme, LayoutConfig } from "@/types";
import { SectionTitle } from "../shared/SectionTitle";
import { ExperienceItem } from "../shared/ExperienceItem";
import { EducationItem } from "../shared/EducationItem";
import { SkillDisplay } from "../shared/SkillDisplay";
import { DynamicSections } from "../shared/DynamicSections";

interface Props { data: CVData; theme: CVTheme; layout: LayoutConfig; isPremium: boolean; }

export function ModernHeader({ data, theme, layout }: Props) {
  const s = makeStyles(theme, layout);
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={[s.header, { backgroundColor: theme.colors.primary }]}>
          <Text style={[s.name, { color: theme.colors.background }]}>{data.personal.fullName}</Text>
          {data.personal.headline && <Text style={[s.headline, { color: theme.colors.background }]}>{data.personal.headline}</Text>}
        </View>
        <View style={s.contactBar}>
          {data.personal.email && <Text style={[s.contactItem, { color: theme.colors.primary }]}>{data.personal.email}</Text>}
          {data.personal.phone && <Text style={[s.contactItem, { color: theme.colors.muted }]}>{data.personal.phone}</Text>}
          {data.personal.address && <Text style={[s.contactItem, { color: theme.colors.muted }]}>{data.personal.address}</Text>}
          {data.personal.linkedIn && <Text style={[s.contactItem, { color: theme.colors.primary }]}>{data.personal.linkedIn}</Text>}
        </View>

        <View style={s.content}>
          {data.personal.summary && (
            <View style={s.section}>
              <SectionTitle title="Summary" theme={theme} style="background-block" />
              <Text style={s.bodyText}>{data.personal.summary}</Text>
            </View>
          )}

          {data.experiences.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Experience" theme={theme} style="background-block" />
              {data.experiences.map((exp, i) => (
                <ExperienceItem key={exp.id} experience={exp} theme={theme} style="standard" fontScale={layout.fontScale} isLast={i === data.experiences.length - 1} />
              ))}
            </View>
          )}

          {data.education.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Education" theme={theme} style="background-block" />
              {data.education.map((edu, i) => (
                <EducationItem key={edu.id} education={edu} theme={theme} fontScale={layout.fontScale} isLast={i === data.education.length - 1} />
              ))}
            </View>
          )}

          {data.skills.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Skills" theme={theme} style="background-block" />
              <SkillDisplay skills={data.skills} theme={theme} style="tags" fontScale={layout.fontScale} />
            </View>
          )}

          {data.projects.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Projects" theme={theme} style="background-block" />
              {data.projects.map((proj) => (
                <View key={proj.id} style={{ marginBottom: 6 }}>
                  <Text style={{ fontFamily: theme.typography.headingFont, color: theme.colors.text, fontSize: 10 * layout.fontScale }}>{proj.name}</Text>
                  {proj.description && <Text style={s.bodyText}>{proj.description}</Text>}
                  {proj.url && <Text style={{ color: theme.colors.primary, fontSize: 8 * layout.fontScale }}>{proj.url}</Text>}
                </View>
              ))}
            </View>
          )}

          {data.languages.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Languages" theme={theme} style="background-block" />
              <Text style={s.bodyText}>{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(" | ")}</Text>
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
    page: { padding: 0, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, color: theme.colors.text, lineHeight: theme.typography.lineHeight },
    header: { padding: 24, textAlign: "center" },
    name: { fontSize: 26 * layout.fontScale, fontFamily: theme.typography.headingFont, textAlign: "center", marginBottom: 10 },
    headline: { fontSize: 11 * layout.fontScale, fontFamily: theme.typography.bodyFont, textAlign: "center", marginBottom: 12 },
    contactBar: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", gap: 12, paddingVertical: 10, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    contactItem: { fontSize: 9 * layout.fontScale, fontFamily: theme.typography.bodyFont },
    content: { flex: 1, padding: 24 },
    section: { marginBottom: theme.spacing.sectionGap * layout.spacingScale },
    bodyText: { color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, lineHeight: theme.typography.lineHeight },
  });
}
