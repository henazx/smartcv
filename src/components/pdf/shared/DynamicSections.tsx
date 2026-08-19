import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { CVData, CVTheme, LayoutConfig } from "@/types";
import { SectionTitle } from "./SectionTitle";
import { formatDate, formatDateRange } from "@/lib/dates";

interface Props {
  data: CVData;
  theme: CVTheme;
  layout: LayoutConfig;
  sectionStyle?: "underline" | "background-block" | "plain" | "boxed" | "bordered-left" | "numbered";
  omit?: {
    certifications?: boolean;
    languages?: boolean;
    references?: boolean;
  };
}

export function DynamicSections({ data, theme, layout, sectionStyle = "underline", omit = {} }: Props) {
  const s = makeStyles(theme, layout);

  // Always render sections that have data, regardless of activeSections config.
  // Core sections (certifications, languages, references) are rendered here too
  // so no user data is ever dropped by a template that doesn't render them itself.
  const allSections: { id: string; data: boolean }[] = [
    { id: "projects", data: data.projects.length > 0 },
    { id: "awards", data: data.awards.length > 0 },
    { id: "publications", data: data.publications.length > 0 },
    { id: "volunteer", data: data.volunteer.length > 0 },
    { id: "courses", data: data.courses.length > 0 },
    { id: "certifications", data: data.certifications.length > 0 && !omit.certifications },
    { id: "languages", data: data.languages.length > 0 && !omit.languages },
    {
      id: "references",
      data: data.includeReferences && (data.showAvailableUponRequest || data.references.length > 0) && !omit.references,
    },
  ];

  const sectionsToRender = allSections.filter((sec) => sec.data).map((sec) => sec.id);

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "projects":
        return data.projects.length > 0 ? (
          <View key="projects" style={s.section}>
            <SectionTitle title="Projects" theme={theme} style={sectionStyle} />
            {data.projects.map((proj) => (
              <View key={proj.id} style={s.item}>
                <View style={s.itemHeader}>
                  <Text style={s.itemTitle}>{proj.name}</Text>
                  {proj.url && <Text style={s.link}>{proj.url}</Text>}
                </View>
                {proj.description && <Text style={s.bodyText}>{proj.description}</Text>}
                {proj.technologies.length > 0 && (
                  <Text style={s.mutedText}>Technologies: {proj.technologies.join(", ")}</Text>
                )}
                {proj.bullets.filter(Boolean).length > 0 && (
                  <View style={s.bullets}>
                    {proj.bullets.filter(Boolean).map((b, i) => (
                      <Text key={i} style={s.bullet}>• {b}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case "awards":
        return data.awards.length > 0 ? (
          <View key="awards" style={s.section}>
            <SectionTitle title="Awards & Achievements" theme={theme} style={sectionStyle} />
            {data.awards.map((award) => (
              <View key={award.id} style={s.item}>
                <View style={s.itemHeader}>
                  <Text style={s.itemTitle}>{award.name}</Text>
                  <Text style={s.dateText}>{formatDate(award.date)}</Text>
                </View>
                {award.issuer && <Text style={s.mutedText}>{award.issuer}</Text>}
                {award.description && <Text style={s.bodyText}>{award.description}</Text>}
              </View>
            ))}
          </View>
        ) : null;

      case "publications":
        return data.publications.length > 0 ? (
          <View key="publications" style={s.section}>
            <SectionTitle title="Publications" theme={theme} style={sectionStyle} />
            {data.publications.map((pub) => (
              <View key={pub.id} style={s.item}>
                <View style={s.itemHeader}>
                  <Text style={s.itemTitle}>{pub.title}</Text>
                  <Text style={s.dateText}>{formatDate(pub.date)}</Text>
                </View>
                {pub.journal && <Text style={s.mutedText}>{pub.journal}</Text>}
                {pub.url && <Text style={s.link}>{pub.url}</Text>}
              </View>
            ))}
          </View>
        ) : null;

      case "volunteer":
        return data.volunteer.length > 0 ? (
          <View key="volunteer" style={s.section}>
            <SectionTitle title="Volunteer Experience" theme={theme} style={sectionStyle} />
            {data.volunteer.map((vol) => (
              <View key={vol.id} style={s.item}>
                <View style={s.itemHeader}>
                  <Text style={s.itemTitle}>{vol.role} — {vol.organization}</Text>
                  <Text style={s.dateText}>{formatDateRange(vol.startDate, vol.endDate)}</Text>
                </View>
                {vol.description && <Text style={s.bodyText}>{vol.description}</Text>}
              </View>
            ))}
          </View>
        ) : null;

      case "courses":
        return data.courses.length > 0 ? (
          <View key="courses" style={s.section}>
            <SectionTitle title="Courses & Training" theme={theme} style={sectionStyle} />
            {data.courses.map((course) => (
              <View key={course.id} style={s.item}>
                <View style={s.itemHeader}>
                  <Text style={s.itemTitle}>{course.name}</Text>
                  <Text style={s.dateText}>{formatDate(course.date)}</Text>
                </View>
                {course.provider && <Text style={s.mutedText}>{course.provider}</Text>}
                {course.description && <Text style={s.bodyText}>{course.description}</Text>}
              </View>
            ))}
          </View>
        ) : null;

      case "certifications":
        return data.certifications.length > 0 ? (
          <View key="certifications" style={s.section}>
            <SectionTitle title="Certifications" theme={theme} style={sectionStyle} />
            {data.certifications.map((cert) => (
              <View key={cert.id} style={s.item}>
                <Text style={s.bodyText}>
                  {cert.name}{cert.issuer ? ` - ${cert.issuer}` : ""}{cert.date ? ` (${cert.date})` : ""}
                </Text>
              </View>
            ))}
          </View>
        ) : null;

      case "languages":
        return data.languages.length > 0 ? (
          <View key="languages" style={s.section}>
            <SectionTitle title="Languages" theme={theme} style={sectionStyle} />
            <Text style={s.bodyText}>
              {data.languages.map((l) => `${l.name} (${l.proficiency})`).join(" | ")}
            </Text>
          </View>
        ) : null;

      case "references":
        return data.includeReferences ? (
          <View key="references" style={s.section}>
            <SectionTitle title="References" theme={theme} style={sectionStyle} />
            <Text style={s.bodyText}>
              {data.showAvailableUponRequest
                ? "Available upon request"
                : data.references.map((r) => `${r.name}${r.title ? ` - ${r.title}` : ""}`).join(", ")}
            </Text>
          </View>
        ) : null;

      default:
        return null;
    }
  };

  return <>{sectionsToRender.map(renderSection)}</>;
}

function makeStyles(theme: CVTheme, layout: LayoutConfig) {
  return StyleSheet.create({
    section: { marginBottom: theme.spacing.sectionGap * layout.spacingScale },
    item: { marginBottom: 6 },
    itemHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 },
    itemTitle: { fontSize: 11 * layout.fontScale, fontFamily: theme.typography.headingFont, color: theme.colors.text, fontWeight: "bold" },
    dateText: { fontSize: 8 * layout.fontScale, color: theme.colors.muted, fontFamily: theme.typography.bodyFont },
    bodyText: { color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: 9 * layout.fontScale, lineHeight: theme.typography.lineHeight },
    mutedText: { color: theme.colors.muted, fontFamily: theme.typography.bodyFont, fontSize: 9.5 * layout.fontScale, marginBottom: 2 },
    link: { color: theme.colors.primary, fontFamily: theme.typography.bodyFont, fontSize: 8 * layout.fontScale },
    bullets: { marginTop: 2 },
    bullet: { color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: 9 * layout.fontScale, lineHeight: theme.typography.lineHeight, marginLeft: 10 },
  });
}
