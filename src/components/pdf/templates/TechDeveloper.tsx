import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { CVData, CVTheme, LayoutConfig } from "@/types";
import { SectionTitle } from "../shared/SectionTitle";
import { ExperienceItem } from "../shared/ExperienceItem";
import { EducationItem } from "../shared/EducationItem";
import { DynamicSections } from "../shared/DynamicSections";

interface Props { data: CVData; theme: CVTheme; layout: LayoutConfig; isPremium: boolean; }

export function TechDeveloper({ data, theme, layout }: Props) {
  const s = makeStyles(theme, layout);
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={[s.headerBar, { backgroundColor: theme.colors.primary }]}>
          <View style={s.headerLeft}>
            <Text style={[s.name, { color: theme.colors.background }]}>{data.personal.fullName}</Text>
            {data.personal.headline && <Text style={[s.headline, { color: theme.colors.background }]}>{data.personal.headline}</Text>}
          </View>
          <View style={s.headerRight}>
            {data.personal.email && <Text style={s.contactItem}>{data.personal.email}</Text>}
            {data.personal.phone && <Text style={s.contactItem}>{data.personal.phone}</Text>}
            {data.personal.github && <Text style={s.contactItem}>{data.personal.github}</Text>}
            {data.personal.website && <Text style={s.contactItem}>{data.personal.website}</Text>}
          </View>
        </View>

        <View style={s.content}>
          <View style={s.twoCol}>
            <View style={s.colLeft}>
              {data.personal.summary && (
                <View style={s.section}>
                  <SectionTitle title="About" theme={theme} style="background-block" />
                  <Text style={s.bodyText}>{data.personal.summary}</Text>
                </View>
              )}

              {data.experiences.length > 0 && (
                <View style={s.section}>
                  <SectionTitle title="Experience" theme={theme} style="background-block" />
                  {data.experiences.map((exp, i) => (
                    <ExperienceItem key={exp.id} experience={exp} theme={theme} style="detailed" fontScale={layout.fontScale} isLast={i === data.experiences.length - 1} />
                  ))}
                </View>
              )}

              {data.projects.length > 0 && (
                <View style={s.section}>
                  <SectionTitle title="Projects" theme={theme} style="background-block" />
                  {data.projects.map((proj) => (
                    <View key={proj.id} style={s.projectCard}>
                      <View style={s.projHeader}>
                        <Text style={s.projName}>{proj.name}</Text>
                        {proj.url && <Text style={s.projUrl}>{proj.url}</Text>}
                      </View>
                      {proj.description && <Text style={s.bodyText}>{proj.description}</Text>}
                      {proj.technologies.length > 0 && (
                        <View style={s.techRow}>
                          {proj.technologies.map((t, i) => (
                            <Text key={i} style={s.techTag}>{t}</Text>
                          ))}
                        </View>
                      )}
                      {proj.bullets.filter((b) => b.trim()).map((b, i) => (
                        <Text key={i} style={s.bullet}>- {b}</Text>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={s.colRight}>
              {data.skills.length > 0 && (
                <View style={s.section}>
                  <SectionTitle title="Skills" theme={theme} style="background-block" />
                  {(() => {
                    const groups: Record<string, typeof data.skills> = {};
                    data.skills.forEach((sk) => { const c = sk.category || "General"; if (!groups[c]) groups[c] = []; groups[c].push(sk); });
                    return Object.entries(groups).map(([cat, skills]) => (
                      <View key={cat} style={s.skillGroup}>
                        <Text style={s.skillCat}>{cat}</Text>
                        {skills.map((sk) => (
                          <Text key={sk.id} style={s.skillItem}>{sk.name}</Text>
                        ))}
                      </View>
                    ));
                  })()}
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

              {data.certifications.length > 0 && (
                <View style={s.section}>
                  <SectionTitle title="Certifications" theme={theme} style="background-block" />
                  {data.certifications.map((c) => (
                    <Text key={c.id} style={s.bodyText}>{c.name}</Text>
                  ))}
                </View>
              )}

              {data.languages.length > 0 && (
                <View style={s.section}>
                  <SectionTitle title="Languages" theme={theme} style="background-block" />
                  {data.languages.map((l) => (
                    <Text key={l.id} style={s.bodyText}>{l.name} - {l.proficiency}</Text>
                  ))}
                </View>
              )}
            </View>
          </View>

          <DynamicSections data={data} theme={theme} layout={layout} />
        </View>

      </Page>
    </Document>
  );
}

function makeStyles(theme: CVTheme, layout: LayoutConfig) {
  return StyleSheet.create({
    page: { padding: 0, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, color: theme.colors.text, lineHeight: theme.typography.lineHeight },
    headerBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingVertical: 14 },
    headerLeft: { flex: 1 },
    headerRight: { alignItems: "flex-end" },
    name: { fontSize: 20 * layout.fontScale, fontFamily: theme.typography.headingFont, marginBottom: 10 },
    headline: { fontSize: 9 * layout.fontScale, fontFamily: theme.typography.bodyFont, opacity: 0.9, marginBottom: 12 },
    contactItem: { fontSize: 7.5 * layout.fontScale, color: "rgba(255,255,255,0.85)", fontFamily: theme.typography.bodyFont, marginBottom: 1 },
    content: { flex: 1, padding: 20, paddingTop: 14 },
    twoCol: { flexDirection: "row", gap: 16 },
    colLeft: { flex: 3 },
    colRight: { flex: 2 },
    section: { marginBottom: theme.spacing.sectionGap * layout.spacingScale },
    bodyText: { color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, lineHeight: theme.typography.lineHeight },
    projectCard: { marginBottom: 8, padding: 8, backgroundColor: theme.colors.accent, borderRadius: 3 },
    projHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
    projName: { fontFamily: theme.typography.headingFont, color: theme.colors.primary, fontSize: 9.5 * layout.fontScale },
    projUrl: { color: theme.colors.muted, fontSize: 7 * layout.fontScale },
    techRow: { flexDirection: "row", flexWrap: "wrap", gap: 3, marginTop: 3, marginBottom: 3 },
    techTag: { fontSize: 6.5 * layout.fontScale, color: theme.colors.primary, backgroundColor: theme.colors.background, paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2, borderWidth: 0.5, borderColor: theme.colors.primary },
    bullet: { fontSize: 8 * layout.fontScale, color: theme.colors.text, marginLeft: 8, marginTop: 1 },
    skillGroup: { marginBottom: 8 },
    skillCat: { fontSize: 8 * layout.fontScale, fontFamily: theme.typography.headingFont, color: theme.colors.primary, marginBottom: 2 },
    skillItem: { fontSize: 7.5 * layout.fontScale, color: theme.colors.text, marginBottom: 1.5 },
  });
}
