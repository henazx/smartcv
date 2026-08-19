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

export function CreativePortfolio({ data, theme, layout }: Props) {
  const s = makeStyles(theme, layout);
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.row}>
          <View style={[s.main, { flex: 1, overflow: "hidden" }]}>
            <Text style={[s.name, { color: theme.colors.primary }]}>{data.personal.fullName}</Text>
            {data.personal.headline && <Text style={s.headline}>{data.personal.headline}</Text>}

            {data.personal.summary && (
              <View style={s.section}>
                <SectionTitle title="About" theme={theme} style="numbered" level={1} />
                <Text style={s.bodyText}>{data.personal.summary}</Text>
              </View>
            )}

            {data.experiences.length > 0 && (
              <View style={s.section}>
                <SectionTitle title="Experience" theme={theme} style="numbered" level={2} />
                {data.experiences.map((exp, i) => (
                  <ExperienceItem key={exp.id} experience={exp} theme={theme} style="card" fontScale={layout.fontScale} isLast={i === data.experiences.length - 1} />
                ))}
              </View>
            )}

            {data.projects.length > 0 && (
              <View style={s.section}>
                <SectionTitle title="Projects" theme={theme} style="numbered" level={3} />
                <View style={s.projectGrid}>
                  {data.projects.map((proj) => (
                    <View key={proj.id} style={s.projectCard}>
                      <Text style={s.projName}>{proj.name}</Text>
                      {proj.description && <Text style={s.projDesc}>{proj.description}</Text>}
                      {proj.technologies.length > 0 && (
                        <View style={s.techRow}>
                          {proj.technologies.map((t, i) => (
                            <Text key={i} style={s.techTag}>{t}</Text>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {data.education.length > 0 && (
              <View style={s.section}>
                <SectionTitle title="Education" theme={theme} style="numbered" level={4} />
                {data.education.map((edu, i) => (
                  <EducationItem key={edu.id} education={edu} theme={theme} fontScale={layout.fontScale} isLast={i === data.education.length - 1} />
                ))}
              </View>
            )}

            {data.awards.length > 0 && (
              <View style={s.section}>
                <SectionTitle title="Awards" theme={theme} style="numbered" level={5} />
                {data.awards.map((award) => (
                  <View key={award.id} style={{ marginBottom: 4 }}>
                    <Text style={{ fontFamily: theme.typography.headingFont, color: theme.colors.text, fontSize: 9 * layout.fontScale }}>{award.name}</Text>
                    <Text style={{ color: theme.colors.muted, fontSize: 8 * layout.fontScale }}>{award.issuer}{award.date ? ` - ${award.date}` : ""}</Text>
                  </View>
                ))}
              </View>
            )}

            <DynamicSections data={data} theme={theme} layout={layout} omit={{ certifications: true, languages: true }} />
          </View>

          <View style={[s.sidebar, { backgroundColor: theme.colors.primary }]}>
            {data.personal.photoUrl && (
              <View style={{ marginBottom: 12, alignItems: data.personal.photoPosition === "left" ? "flex-start" : data.personal.photoPosition === "right" ? "flex-end" : "center", flexShrink: 0 }}>
                <PhotoBadge src={data.personal.photoUrl} size={data.personal.photoSize} borderColor="rgba(255,255,255,0.8)" borderWidth={2} />
              </View>
            )}
            <View style={s.sideSection}>
              <Text style={[s.sideTitle, { color: theme.colors.background }]}>CONTACT</Text>
              {data.personal.email && <Text style={s.sideText}>{data.personal.email}</Text>}
              {data.personal.phone && <Text style={s.sideText}>{data.personal.phone}</Text>}
              {data.personal.address && <Text style={s.sideText}>{data.personal.address}</Text>}
              {data.personal.linkedIn && <Text style={s.sideText}>{data.personal.linkedIn}</Text>}
              {data.personal.github && <Text style={s.sideText}>{data.personal.github}</Text>}
              {data.personal.website && <Text style={s.sideText}>{data.personal.website}</Text>}
            </View>

            {data.skills.length > 0 && (
              <View style={s.sideSection}>
                <Text style={[s.sideTitle, { color: theme.colors.background }]}>SKILLS</Text>
                <SkillDisplay skills={data.skills} theme={{ ...theme, colors: { ...theme.colors, text: theme.colors.background, primary: theme.colors.background, muted: "rgba(255,255,255,0.7)", accent: "transparent", border: "rgba(255,255,255,0.3)" } }} style="proficiency-grid" fontScale={layout.fontScale} />
              </View>
            )}

            {data.languages.length > 0 && (
              <View style={s.sideSection}>
                <Text style={[s.sideTitle, { color: theme.colors.background }]}>LANGUAGES</Text>
                {data.languages.map((l) => (
                  <Text key={l.id} style={s.sideText}>{l.name} - {l.proficiency}</Text>
                ))}
              </View>
            )}

            {data.certifications.length > 0 && (
              <View style={s.sideSection}>
                <Text style={[s.sideTitle, { color: theme.colors.background }]}>CERTIFICATIONS</Text>
                {data.certifications.map((c) => (
                  <Text key={c.id} style={s.sideText}>{c.name}</Text>
                ))}
              </View>
            )}
          </View>
        </View>

      </Page>
    </Document>
  );
}

function makeStyles(theme: CVTheme, layout: LayoutConfig) {
  return StyleSheet.create({
    page: { padding: 0, flexDirection: "row", fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, color: theme.colors.text, lineHeight: theme.typography.lineHeight },
    row: { flexDirection: "row", flex: 1 },
    main: { flex: 1, padding: 20, paddingTop: 22, overflow: "hidden" },
    sidebar: { width: 155, padding: 12, paddingTop: 22, flexShrink: 0 },
    name: { fontSize: 18 * layout.fontScale, fontFamily: theme.typography.headingFont, marginBottom: 10 },
    headline: { fontSize: 9 * layout.fontScale, fontFamily: theme.typography.bodyFont, marginBottom: 12, color: theme.colors.muted },
    sideSection: { marginBottom: 10 },
    sideTitle: { fontSize: 8, fontFamily: theme.typography.headingFont, letterSpacing: 1, marginBottom: 5 },
    sideText: { fontSize: 7 * layout.fontScale, color: "rgba(255,255,255,0.85)", fontFamily: theme.typography.bodyFont, marginBottom: 2, maxWidth: 131 },
    section: { marginBottom: theme.spacing.sectionGap * layout.spacingScale },
    bodyText: { color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, lineHeight: theme.typography.lineHeight },
    projectGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    projectCard: { width: "48%", marginBottom: 6, padding: 8, borderWidth: 0.5, borderColor: theme.colors.border, borderRadius: 4 },
    projName: { fontFamily: theme.typography.headingFont, color: theme.colors.primary, fontSize: 9 * layout.fontScale, marginBottom: 2 },
    projDesc: { fontSize: 7.5 * layout.fontScale, color: theme.colors.text, marginBottom: 3 },
    techRow: { flexDirection: "row", flexWrap: "wrap", gap: 3 },
    techTag: { fontSize: 6.5 * layout.fontScale, color: theme.colors.primary, backgroundColor: theme.colors.accent, paddingHorizontal: 3, paddingVertical: 1, borderRadius: 2 },
  });
}
