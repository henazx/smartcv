import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { CVData, CVTheme, LayoutConfig } from "@/types";
import { SectionTitle } from "../shared/SectionTitle";
import { ExperienceItem } from "../shared/ExperienceItem";
import { EducationItem } from "../shared/EducationItem";
import { SkillDisplay } from "../shared/SkillDisplay";
import { PhotoBadge } from "../shared/PhotoBadge";
import { DynamicSections } from "../shared/DynamicSections";

interface Props { data: CVData; theme: CVTheme; layout: LayoutConfig; isPremium: boolean; }

export function Executive({ data, theme, layout }: Props) {
  const s = makeStyles(theme, layout);
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={[s.topLine, { backgroundColor: theme.colors.primary }]} />

        <View style={[s.headerArea, { flexShrink: 0 }]}>
          {data.personal.photoUrl && (
            <View style={{ alignItems: data.personal.photoPosition === "left" ? "flex-start" : data.personal.photoPosition === "right" ? "flex-end" : "center", marginBottom: 10, flexShrink: 0 }}>
              <PhotoBadge src={data.personal.photoUrl} size={data.personal.photoSize} borderColor={theme.colors.primary} borderWidth={2} />
            </View>
          )}
          <Text style={[s.name, { color: theme.colors.primary }]}>{data.personal.fullName}</Text>
          {data.personal.headline && <Text style={s.headline}>{data.personal.headline}</Text>}
          <View style={s.contactRow}>
            {data.personal.email && <Text style={s.contactItem}>{data.personal.email}</Text>}
            {data.personal.phone && <Text style={s.contactItem}>{data.personal.phone}</Text>}
            {data.personal.address && <Text style={s.contactItem}>{data.personal.address}</Text>}
          </View>
        </View>

        <View style={[s.bottomLine, { backgroundColor: theme.colors.primary }]} />

        <View style={[s.content, { flex: 1, overflow: "hidden" }]}>
          {data.personal.summary && (
            <View style={s.section}>
              <SectionTitle title="Executive Summary" theme={theme} style="boxed" />
              <Text style={s.bodyText}>{data.personal.summary}</Text>
            </View>
          )}

          {data.experiences.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Leadership Experience" theme={theme} style="boxed" />
              {data.experiences.map((exp, i) => (
                <ExperienceItem key={exp.id} experience={exp} theme={theme} style="detailed" fontScale={layout.fontScale} isLast={i === data.experiences.length - 1} />
              ))}
            </View>
          )}

          {data.skills.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Core Competencies" theme={theme} style="boxed" />
              <SkillDisplay skills={data.skills} theme={theme} style="grouped" fontScale={layout.fontScale} />
            </View>
          )}

          {data.education.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Education" theme={theme} style="boxed" />
              {data.education.map((edu, i) => (
                <EducationItem key={edu.id} education={edu} theme={theme} fontScale={layout.fontScale} isLast={i === data.education.length - 1} />
              ))}
            </View>
          )}

          {data.certifications.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Certifications" theme={theme} style="boxed" />
              {data.certifications.map((cert) => (
                <Text key={cert.id} style={s.bodyText}>{cert.name} - {cert.issuer}</Text>
              ))}
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
    topLine: { height: 4, marginBottom: 16 },
    headerArea: { marginBottom: 12, textAlign: "center" },
    name: { fontSize: 26 * layout.fontScale, fontFamily: theme.typography.headingFont, textAlign: "center", marginBottom: 10 },
    headline: { fontSize: 11 * layout.fontScale, fontFamily: theme.typography.bodyFont, textAlign: "center", marginBottom: 12, color: theme.colors.muted },
    contactRow: { flexDirection: "row", justifyContent: "center", gap: 12 },
    contactItem: { fontSize: 8.5 * layout.fontScale, color: theme.colors.muted, fontFamily: theme.typography.bodyFont },
    bottomLine: { height: 1, marginBottom: 16 },
    content: { flex: 1 },
    section: { marginBottom: theme.spacing.sectionGap * layout.spacingScale },
    bodyText: { color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, lineHeight: theme.typography.lineHeight },
  });
}
