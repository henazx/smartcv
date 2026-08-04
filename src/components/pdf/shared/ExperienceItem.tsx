import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { CVTheme, WorkExperience } from "@/types";

interface ExperienceItemProps {
  experience: WorkExperience;
  theme: CVTheme;
  style: "standard" | "timeline" | "compact" | "detailed" | "card";
  fontScale?: number;
  isLast?: boolean;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

export function ExperienceItem({ experience, theme, style, fontScale = 1, isLast = false }: ExperienceItemProps) {
  const dateStr = `${formatDate(experience.startDate)} - ${experience.current ? "Present" : formatDate(experience.endDate)}`;

  // Level 1: Role title — 11pt, bold
  const roleStyle = { fontFamily: theme.typography.headingFont, color: theme.colors.text, fontSize: 11 * fontScale, fontWeight: "bold" as const };
  // Level 2: Company — 9.5pt, muted
  const companyStyle = { color: theme.colors.muted, fontFamily: theme.typography.bodyFont, fontSize: 9.5 * fontScale };
  // Level 3: Date — 8pt, muted
  const dateStyle = { color: theme.colors.muted, fontFamily: theme.typography.bodyFont, fontSize: 8 * fontScale, flexShrink: 0, marginLeft: 8 };
  // Level 4: Bullets — 9pt, regular
  const bulletStyle = { color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: 9 * fontScale, marginLeft: 8, lineHeight: 1.5 };

  if (style === "timeline") {
    return (
      <View style={[s.timelineItem, ...(isLast ? [] : [s.timelineWithLine])]}>
        <View style={[s.timelineDot, { backgroundColor: theme.colors.primary }]} />
        {!isLast ? <View style={[s.timelineLine, { backgroundColor: theme.colors.border }]} /> : null}
        <View style={s.timelineContent}>
          <View style={s.header}>
            <Text style={[roleStyle, { flex: 1 }]}>{experience.role}</Text>
            <Text style={dateStyle}>{dateStr}</Text>
          </View>
          <Text style={[companyStyle, { marginBottom: 4 }]}>{experience.company}</Text>
          {experience.bullets.filter((b) => b.trim()).map((bullet, i) => (
            <Text key={i} style={bulletStyle}>- {bullet}</Text>
          ))}
        </View>
      </View>
    );
  }

  if (style === "compact") {
    return (
      <View style={[s.compactItem, ...(isLast ? [] : [{ marginBottom: 8 }])]}>
        <View style={s.compactHeader}>
          <Text style={[roleStyle, { flex: 1 }]}>{experience.role}</Text>
          <Text style={dateStyle}>{dateStr}</Text>
        </View>
        <Text style={[companyStyle, { marginBottom: 2 }]}>{experience.company}</Text>
        {experience.bullets.filter((b) => b.trim()).map((bullet, i) => (
          <Text key={i} style={[bulletStyle, { marginLeft: 8, marginBottom: 1 }]}>- {bullet}</Text>
        ))}
      </View>
    );
  }

  if (style === "card") {
    return (
      <View style={[s.cardItem, { borderColor: theme.colors.border, backgroundColor: theme.colors.accent }, ...(isLast ? [] : [{ marginBottom: 8 }])]}>
        <View style={s.header}>
          <Text style={[roleStyle, { flex: 1, color: theme.colors.primary }]}>{experience.role}</Text>
          <Text style={dateStyle}>{dateStr}</Text>
        </View>
        <Text style={[companyStyle, { marginBottom: 4 }]}>{experience.company}</Text>
        {experience.bullets.filter((b) => b.trim()).map((bullet, i) => (
          <Text key={i} style={[bulletStyle, { marginLeft: 8, marginBottom: 2 }]}>- {bullet}</Text>
        ))}
      </View>
    );
  }

  // standard or detailed
  return (
    <View style={[s.standardItem, ...(isLast ? [] : [{ marginBottom: 10 }])]}>
      <View style={s.header}>
        <Text style={[roleStyle, { flex: 1 }]}>{experience.role}</Text>
        <Text style={dateStyle}>{dateStr}</Text>
      </View>
      <Text style={[companyStyle, { marginBottom: 3 }]}>{experience.company}</Text>
      {experience.bullets.filter((b) => b.trim()).map((bullet, i) => (
        <Text key={i} style={bulletStyle}>- {bullet}</Text>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center" },
  standardItem: {},
  compactItem: {},
  compactHeader: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  cardItem: { borderWidth: 0.5, borderRadius: 4, padding: 8 },
  timelineItem: { flexDirection: "row", marginBottom: 12, position: "relative" },
  timelineWithLine: { paddingBottom: 4 },
  timelineDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, marginRight: 10, zIndex: 1 },
  timelineLine: { position: "absolute", left: 3.5, top: 12, bottom: 0, width: 1 },
  timelineContent: { flex: 1 },
});
