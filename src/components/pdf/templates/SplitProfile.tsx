import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { CVData, CVTheme, LayoutConfig } from "@/types";
import { SectionTitle } from "../shared/SectionTitle";
import { ExperienceItem } from "../shared/ExperienceItem";
import { EducationItem } from "../shared/EducationItem";
import { SkillDisplay } from "../shared/SkillDisplay";
import { PhotoBadge } from "../shared/PhotoBadge";
import { DynamicSections } from "../shared/DynamicSections";

interface Props { data: CVData; theme: CVTheme; layout: LayoutConfig; }

export function SplitProfile({ data, theme, layout }: Props) {
  const s = makeStyles(theme, layout);
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.name}>{data.personal.fullName}</Text>
          {data.personal.headline && <Text style={s.headline}>{data.personal.headline}</Text>}
        </View>

        <View style={[s.profileRow, { flexShrink: 0 }]}>
          <View style={[s.profileBox, { borderColor: theme.colors.primary }]}>
            {data.personal.photoUrl && (
              <View style={{ marginBottom: 10, alignItems: data.personal.photoPosition === "left" ? "flex-start" : data.personal.photoPosition === "right" ? "flex-end" : "center" }}>
                <PhotoBadge src={data.personal.photoUrl} size={data.personal.photoSize} borderColor={theme.colors.primary} borderWidth={2} />
              </View>
            )}
            {data.personal.summary && <Text style={s.bodyText}>{data.personal.summary}</Text>}
          </View>
          <View style={s.contactBox}>
            {data.personal.email && <Text style={s.contactLine}>{data.personal.email}</Text>}
            {data.personal.phone && <Text style={s.contactLine}>{data.personal.phone}</Text>}
            {data.personal.address && <Text style={s.contactLine}>{data.personal.address}</Text>}
            {data.personal.linkedIn && <Text style={[s.contactLine, { color: theme.colors.primary }]}>{data.personal.linkedIn}</Text>}
            {data.personal.github && <Text style={[s.contactLine, { color: theme.colors.primary }]}>{data.personal.github}</Text>}
          </View>
        </View>

        <View style={[s.content, { flex: 1, overflow: "hidden" }]}>
          {data.experiences.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Experience" theme={theme} style="bordered-left" />
              {data.experiences.map((exp, i) => (
                <ExperienceItem key={exp.id} experience={exp} theme={theme} style="standard" fontScale={layout.fontScale} isLast={i === data.experiences.length - 1} />
              ))}
            </View>
          )}

          {data.education.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Education" theme={theme} style="bordered-left" />
              {data.education.map((edu, i) => (
                <EducationItem key={edu.id} education={edu} theme={theme} fontScale={layout.fontScale} isLast={i === data.education.length - 1} />
              ))}
            </View>
          )}

          {data.skills.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Skills" theme={theme} style="bordered-left" />
              <SkillDisplay skills={data.skills} theme={theme} style="two-column" fontScale={layout.fontScale} />
            </View>
          )}

          {data.languages.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Languages" theme={theme} style="bordered-left" />
              <Text style={s.bodyText}>{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(" | ")}</Text>
            </View>
          )}

          <DynamicSections data={data} theme={theme} layout={layout} omit={{ languages: true }} />
        </View>

      </Page>
    </Document>
  );
}

function makeStyles(theme: CVTheme, layout: LayoutConfig) {
  return StyleSheet.create({
    page: { padding: theme.spacing.padding, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, color: theme.colors.text, lineHeight: theme.typography.lineHeight },
    header: { marginBottom: 10 },
    name: { fontSize: 22 * layout.fontScale, fontFamily: theme.typography.headingFont, color: theme.colors.primary, marginBottom: 10 },
    headline: { fontSize: 10 * layout.fontScale, color: theme.colors.muted, marginBottom: 12 },
    profileRow: { flexDirection: "row", gap: 16, marginBottom: 14 },
    profileBox: { flex: 2, borderLeftWidth: 3, paddingLeft: 10 },
    contactBox: { flex: 1 },
    contactLine: { fontSize: 8.5 * layout.fontScale, color: theme.colors.muted, fontFamily: theme.typography.bodyFont, marginBottom: 3 },
    content: { flex: 1 },
    section: { marginBottom: theme.spacing.sectionGap * layout.spacingScale },
    bodyText: { color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, lineHeight: theme.typography.lineHeight },
  });
}
