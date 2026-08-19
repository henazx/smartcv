import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { CVTheme, Education } from "@/types";
import { formatDate } from "@/lib/dates";

interface EducationItemProps {
  education: Education;
  theme: CVTheme;
  fontScale?: number;
  isLast?: boolean;
}

export function EducationItem({ education, theme, fontScale = 1, isLast = false }: EducationItemProps) {
  const dateStr = `${formatDate(education.startDate)} - ${formatDate(education.endDate)}`;

  // Level 1: Degree — 11pt, bold
  const degreeStyle = { fontFamily: theme.typography.headingFont, color: theme.colors.text, fontSize: 11 * fontScale, fontWeight: "bold" as const, flex: 1 };
  // Level 2: Institution — 9.5pt, muted
  const institutionStyle = { color: theme.colors.muted, fontFamily: theme.typography.bodyFont, fontSize: 9.5 * fontScale };
  // Level 3: Date — 8pt, muted
  const dateStyle = { color: theme.colors.muted, fontFamily: theme.typography.bodyFont, fontSize: 8 * fontScale, flexShrink: 0, marginLeft: 8 };

  return (
    <View style={[s.container, ...(isLast ? [] : [{ marginBottom: 8 }])]}>
      <View style={s.header}>
        <Text style={degreeStyle}>
          {education.degree}{education.field ? ` in ${education.field}` : ""}
        </Text>
        <Text style={dateStyle}>{dateStr}</Text>
      </View>
      <Text style={institutionStyle}>{education.institution}</Text>
      {education.gpa && (
        <Text style={{ color: theme.colors.muted, fontFamily: theme.typography.bodyFont, fontSize: 8 * fontScale, marginTop: 2 }}>
          GPA: {education.gpa}
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {},
  header: { flexDirection: "row", alignItems: "center" },
});
