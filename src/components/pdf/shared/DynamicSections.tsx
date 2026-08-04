import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { CVData, CVTheme, LayoutConfig } from "@/types";
import { SectionTitle } from "./SectionTitle";

interface Props {
  data: CVData;
  theme: CVTheme;
  layout: LayoutConfig;
  sectionStyle?: "underline" | "background-block" | "plain" | "boxed" | "bordered-left" | "numbered";
  sectionsToShow?: string[];
}

export function DynamicSections({ data, theme, layout, sectionStyle = "underline", sectionsToShow }: Props) {
  const s = makeStyles(theme, layout);
  const active = sectionsToShow || data.activeSections;

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

      default:
        return null;
    }
  };

  return <>{active.map(renderSection)}</>;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  if (!year) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return month ? `${months[parseInt(month, 10) - 1]} ${year}` : year;
}

function formatDateRange(start: string, end: string): string {
  const s = formatDate(start);
  const e = end ? formatDate(end) : "Present";
  return s && e ? `${s} — ${e}` : s || e;
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
