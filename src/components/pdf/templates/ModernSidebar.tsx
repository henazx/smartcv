import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { CVData, CVTheme, LayoutConfig } from "@/types";
import { SectionTitle } from "../shared/SectionTitle";
import { ExperienceItem } from "../shared/ExperienceItem";
import { EducationItem } from "../shared/EducationItem";
import { PhotoBadge } from "../shared/PhotoBadge";
import { DynamicSections } from "../shared/DynamicSections";

interface Props {
  data: CVData;
  theme: CVTheme;
  layout: LayoutConfig;
  isPremium: boolean;
}

export function ModernSidebar({ data, theme, layout }: Props) {
  const s = makeStyles(theme, layout);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.row}>
          {/* Sidebar */}
          <View style={[s.sidebar, { backgroundColor: theme.colors.primary, flexShrink: 0 }]}>
            {data.personal.photoUrl && (
              <View style={{ marginBottom: 10, flexShrink: 0, alignItems: data.personal.photoPosition === "left" ? "flex-start" : data.personal.photoPosition === "right" ? "flex-end" : "center" }}>
                <PhotoBadge src={data.personal.photoUrl} size={data.personal.photoSize} borderColor="rgba(255,255,255,0.8)" borderWidth={2} />
              </View>
            )}
            <Text style={[s.name, { color: theme.colors.background }]}>{data.personal.fullName}</Text>
            {data.personal.headline && (
              <Text style={[s.headline, { color: theme.colors.background }]}>{data.personal.headline}</Text>
            )}

            <View style={s.sidebarSection}>
              <Text style={[s.sidebarTitle, { color: theme.colors.background }]}>CONTACT</Text>
              {data.personal.email && <Text style={s.sidebarText}>{data.personal.email}</Text>}
              {data.personal.phone && <Text style={s.sidebarText}>{data.personal.phone}</Text>}
              {data.personal.address && <Text style={s.sidebarText}>{data.personal.address}</Text>}
              {data.personal.linkedIn && <Text style={s.sidebarLink}>{data.personal.linkedIn}</Text>}
              {data.personal.github && <Text style={s.sidebarLink}>{data.personal.github}</Text>}
              {data.personal.website && <Text style={s.sidebarLink}>{data.personal.website}</Text>}
            </View>

            {data.skills.length > 0 && (
              <View style={s.sidebarSection}>
                <Text style={[s.sidebarTitle, { color: theme.colors.background }]}>SKILLS</Text>
                {data.skills.map((skill) => (
                  <View key={skill.id} style={{ marginBottom: 3 }}>
                    <Text style={s.sidebarText}>{skill.name}</Text>
                    {skill.proficiency && (
                      <View style={[s.skillBarOuter, { backgroundColor: "rgba(255,255,255,0.3)" }]}>
                        <View style={[s.skillBarInner, { backgroundColor: theme.colors.background, width: `${skill.proficiency === "expert" ? 100 : skill.proficiency === "advanced" ? 75 : skill.proficiency === "intermediate" ? 50 : 25}%` }]} />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {data.languages.length > 0 && (
              <View style={s.sidebarSection}>
                <Text style={[s.sidebarTitle, { color: theme.colors.background }]}>LANGUAGES</Text>
                {data.languages.map((lang) => (
                  <Text key={lang.id} style={s.sidebarText}>
                    {lang.name} - {lang.proficiency}
                  </Text>
                ))}
              </View>
            )}

            {data.certifications.length > 0 && (
              <View style={s.sidebarSection}>
                <Text style={[s.sidebarTitle, { color: theme.colors.background }]}>CERTIFICATIONS</Text>
                {data.certifications.map((cert) => (
                  <Text key={cert.id} style={s.sidebarText}>{cert.name}</Text>
                ))}
              </View>
            )}
          </View>

          {/* Main Content */}
          <View style={[s.main, { flex: 1, overflow: "hidden" }]}>
            {data.personal.summary && (
              <View style={s.section}>
                <SectionTitle title="About Me" theme={theme} style="background-block" />
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

            {data.projects.length > 0 && (
              <View style={s.section}>
                <SectionTitle title="Projects" theme={theme} style="background-block" />
                {data.projects.map((proj, i) => (
                  <View key={proj.id} style={{ marginBottom: i === data.projects.length - 1 ? 0 : 6 }}>
                    <Text style={{ fontFamily: theme.typography.headingFont, color: theme.colors.text, fontSize: 10 * layout.fontScale }}>{proj.name}</Text>
                    {proj.description && <Text style={s.bodyText}>{proj.description}</Text>}
                    {proj.technologies.length > 0 && (
                      <Text style={{ color: theme.colors.muted, fontSize: 8 * layout.fontScale, marginTop: 2 }}>{proj.technologies.join(", ")}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            <DynamicSections data={data} theme={theme} layout={layout} omit={{ certifications: true, languages: true }} />
          </View>
        </View>

      </Page>
    </Document>
  );
}

function makeStyles(theme: CVTheme, layout: LayoutConfig) {
  return StyleSheet.create({
    page: { padding: 0, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, color: theme.colors.text, lineHeight: theme.typography.lineHeight },
    row: { flexDirection: "row", flex: 1 },
    sidebar: { width: "35%", padding: 20, paddingTop: 25, flex: 1 },
    main: { flex: 1, padding: 20, paddingTop: 25 },
    name: { fontSize: 18 * layout.fontScale, fontFamily: theme.typography.headingFont, marginBottom: 10 },
    headline: { fontSize: 9 * layout.fontScale, fontFamily: theme.typography.bodyFont, marginBottom: 12, opacity: 0.9 },
    sidebarSection: { marginBottom: 14 },
    sidebarTitle: { fontSize: 9, fontFamily: theme.typography.headingFont, marginBottom: 6, letterSpacing: 1 },
    sidebarText: { fontSize: 8.5 * layout.fontScale, color: "rgba(255,255,255,0.9)", fontFamily: theme.typography.bodyFont, marginBottom: 3 },
    sidebarLink: { fontSize: 8 * layout.fontScale, color: "rgba(255,255,255,0.8)", fontFamily: theme.typography.bodyFont, marginBottom: 3 },
    skillBarOuter: { height: 3, borderRadius: 1.5, marginTop: 2 },
    skillBarInner: { height: 3, borderRadius: 1.5 },
    section: { marginBottom: theme.spacing.sectionGap * layout.spacingScale },
    bodyText: { color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, lineHeight: theme.typography.lineHeight },
  });
}
