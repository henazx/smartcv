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

export function ElegantEditorial({ data, theme, layout }: Props) {
  const s = makeStyles(theme, layout);
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={[s.content, { flex: 1, overflow: "hidden" }]}>
          <View style={[s.headerRow, { flexShrink: 0 }]}>
            <View style={s.headerLeft}>
              {data.personal.photoUrl && (
                <View style={{ marginBottom: 8, flexShrink: 0, alignItems: data.personal.photoPosition === "left" ? "flex-start" : data.personal.photoPosition === "right" ? "flex-end" : "center" }}>
                  <PhotoBadge src={data.personal.photoUrl} size={data.personal.photoSize} borderColor={theme.colors.primary} borderWidth={2} />
                </View>
              )}
              <Text style={s.name}>{data.personal.fullName}</Text>
              {data.personal.headline && <Text style={s.headline}>{data.personal.headline}</Text>}
            </View>
            <View style={[s.headerRight, { borderLeftColor: theme.colors.primary }]}>
              {data.personal.email && <Text style={s.contactLine}>{data.personal.email}</Text>}
              {data.personal.phone && <Text style={s.contactLine}>{data.personal.phone}</Text>}
              {data.personal.address && <Text style={s.contactLine}>{data.personal.address}</Text>}
              {data.personal.linkedIn && <Text style={[s.contactLine, { color: theme.colors.primary }]}>{data.personal.linkedIn}</Text>}
              {data.personal.github && <Text style={[s.contactLine, { color: theme.colors.primary }]}>{data.personal.github}</Text>}
            </View>
          </View>

          <View style={[s.divider, { backgroundColor: theme.colors.primary }]} />

          {data.personal.summary && (
            <View style={s.section}>
              <SectionTitle title="Profile" theme={theme} style="bordered-left" />
              <Text style={s.bodyText}>{data.personal.summary}</Text>
            </View>
          )}

          {data.experiences.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Professional Experience" theme={theme} style="bordered-left" />
              {data.experiences.map((exp, i) => (
                <ExperienceItem key={exp.id} experience={exp} theme={theme} style="detailed" fontScale={layout.fontScale} isLast={i === data.experiences.length - 1} />
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
              <SectionTitle title="Expertise" theme={theme} style="bordered-left" />
              <SkillDisplay skills={data.skills} theme={theme} style="two-column" fontScale={layout.fontScale} />
            </View>
          )}

          {data.projects.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Selected Projects" theme={theme} style="bordered-left" />
              {data.projects.map((proj) => (
                <View key={proj.id} style={{ marginBottom: 6 }}>
                  <Text style={{ fontFamily: theme.typography.headingFont, color: theme.colors.text, fontSize: 10 * layout.fontScale }}>{proj.name}</Text>
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
              <SectionTitle title="Awards" theme={theme} style="bordered-left" />
              {data.awards.map((award) => (
                <Text key={award.id} style={s.bodyText}>{award.name} - {award.issuer}{award.date ? ` (${award.date})` : ""}</Text>
              ))}
            </View>
          )}

          {data.certifications.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Certifications" theme={theme} style="bordered-left" />
              {data.certifications.map((c) => (
                <Text key={c.id} style={s.bodyText}>{c.name} - {c.issuer}</Text>
              ))}
            </View>
          )}

          {data.languages.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Languages" theme={theme} style="bordered-left" />
              <SkillDisplay skills={data.languages.map((l) => ({ id: l.id, name: `${l.name} (${l.proficiency})`, proficiency: null, category: "" }))} theme={theme} style="two-column" fontScale={layout.fontScale} />
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
    page: { padding: theme.spacing.padding, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, color: theme.colors.text, lineHeight: theme.typography.lineHeight },
    content: { flex: 1 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 },
    headerLeft: { flex: 2 },
    headerRight: { flex: 1, borderLeftWidth: 2, paddingLeft: 12 },
    name: { fontSize: 24 * layout.fontScale, fontFamily: theme.typography.headingFont, color: theme.colors.primary, marginBottom: 10 },
    headline: { fontSize: 10 * layout.fontScale, color: theme.colors.muted, marginBottom: 12 },
    contactLine: { fontSize: 8.5 * layout.fontScale, color: theme.colors.muted, fontFamily: theme.typography.bodyFont, marginBottom: 2 },
    divider: { height: 2, marginBottom: 14 },
    section: { marginBottom: theme.spacing.sectionGap * layout.spacingScale },
    bodyText: { color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, lineHeight: theme.typography.lineHeight },
  });
}
