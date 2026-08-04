import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { CVTheme, Skill } from "@/types";

interface SkillDisplayProps {
  skills: Skill[];
  theme: CVTheme;
  style: "tags" | "bars" | "comma-list" | "grouped" | "two-column" | "proficiency-grid";
  fontScale?: number;
}

const proficiencyWidth: Record<string, number> = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 100,
};

export function SkillDisplay({ skills, theme, style, fontScale = 1 }: SkillDisplayProps) {
  if (style === "tags") {
    return (
      <View style={s.tagContainer}>
        {skills.map((skill) => (
          <View key={skill.id} style={[s.tag, { backgroundColor: theme.colors.accent, borderColor: theme.colors.border }]}>
            <Text style={[s.tagText, { color: theme.colors.primary, fontFamily: theme.typography.bodyFont, fontSize: 9 * fontScale }]}>
              {skill.name}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  if (style === "bars") {
    return (
      <View>
        {skills.map((skill) => (
          <View key={skill.id} style={s.barRow}>
            <Text style={[s.barName, { color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: 9.5 * fontScale }]}>
              {skill.name}
            </Text>
            <View style={[s.barOuter, { backgroundColor: theme.colors.border }]}>
              <View
                style={[
                  s.barInner,
                  {
                    backgroundColor: theme.colors.primary,
                    width: `${skill.proficiency ? proficiencyWidth[skill.proficiency] || 50 : 50}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (style === "comma-list") {
    return (
      <Text style={{ color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: 9.5 * fontScale, lineHeight: 1.6 * theme.typography.lineHeight }}>
        {skills.map((s) => s.name).join(" | ")}
      </Text>
    );
  }

  if (style === "grouped") {
    const groups: Record<string, Skill[]> = {};
    skills.forEach((skill) => {
      const cat = skill.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(skill);
    });

    return (
      <View>
        {Object.entries(groups).map(([category, catSkills]) => (
          <View key={category} style={{ marginBottom: 6 }}>
            <Text style={{ fontFamily: theme.typography.headingFont, color: theme.colors.primary, fontSize: 9 * fontScale, marginBottom: 2 }}>
              {category}
            </Text>
            <Text style={{ color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: 9 * fontScale, lineHeight: 1.5 * theme.typography.lineHeight }}>
              {catSkills.map((s) => s.name).join(" | ")}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  if (style === "two-column") {
    const half = Math.ceil(skills.length / 2);
    const col1 = skills.slice(0, half);
    const col2 = skills.slice(half);

    return (
      <View style={s.twoCol}>
        <View style={s.col}>
          {col1.map((skill) => (
            <Text key={skill.id} style={{ color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: 9 * fontScale, marginBottom: 3 }}>
              {skill.name}
            </Text>
          ))}
        </View>
        <View style={s.col}>
          {col2.map((skill) => (
            <Text key={skill.id} style={{ color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: 9 * fontScale, marginBottom: 3 }}>
              {skill.name}
            </Text>
          ))}
        </View>
      </View>
    );
  }

  if (style === "proficiency-grid") {
    return (
      <View style={s.grid}>
        {skills.map((skill) => (
          <View key={skill.id} style={s.gridItem}>
            <Text style={{ color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: 8.5 * fontScale }}>
              {skill.name}
            </Text>
            <View style={[s.gridBar, { backgroundColor: theme.colors.border }]}>
              <View
                style={[
                  s.gridBarInner,
                  {
                    backgroundColor: theme.colors.primary,
                    width: `${skill.proficiency ? proficiencyWidth[skill.proficiency] || 50 : 50}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    );
  }

  return null;
}

const s = StyleSheet.create({
  tagContainer: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 3, borderWidth: 0.5 },
  tagText: {},
  barRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  barName: { width: 100 },
  barOuter: { flex: 1, height: 5, borderRadius: 2.5 },
  barInner: { height: 5, borderRadius: 2.5 },
  twoCol: { flexDirection: "row", gap: 12 },
  col: { flex: 1 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  gridItem: { width: "48%", marginBottom: 4 },
  gridBar: { height: 3, borderRadius: 1.5, marginTop: 2 },
  gridBarInner: { height: 3, borderRadius: 1.5 },
});
