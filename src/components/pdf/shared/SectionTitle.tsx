import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { CVTheme } from "@/types";

interface SectionTitleProps {
  title: string;
  theme: CVTheme;
  style?: "underline" | "background-block" | "plain" | "boxed" | "bordered-left" | "numbered";
  level?: number;
}

export function SectionTitle({ title, theme, style = "underline", level = 1 }: SectionTitleProps) {
  const fontSize = level === 1 ? 14 : 12;

  if (style === "background-block") {
    return (
      <View style={[s.bgBlock, { backgroundColor: theme.colors.primary }]}>
        <Text style={[s.bgBlockText, { fontFamily: theme.typography.headingFont, color: theme.colors.background }]}>
          {title.toUpperCase()}
        </Text>
      </View>
    );
  }

  if (style === "boxed") {
    return (
      <View style={[s.boxed, { borderColor: theme.colors.primary }]}>
        <Text style={[s.boxedText, { fontFamily: theme.typography.headingFont, color: theme.colors.primary, fontSize }]}>
          {title.toUpperCase()}
        </Text>
      </View>
    );
  }

  if (style === "bordered-left") {
    return (
      <View style={[s.borderedLeft, { borderLeftColor: theme.colors.primary }]}>
        <Text style={[s.borderedLeftText, { fontFamily: theme.typography.headingFont, color: theme.colors.primary, fontSize }]}>
          {title.toUpperCase()}
        </Text>
      </View>
    );
  }

  if (style === "numbered") {
    return (
      <View style={s.numberedRow}>
        <View style={[s.numberCircle, { backgroundColor: theme.colors.primary }]}>
          <Text style={[s.numberText, { color: theme.colors.background }]}>{level}</Text>
        </View>
        <Text style={[s.numberedText, { fontFamily: theme.typography.headingFont, color: theme.colors.primary, fontSize }]}>
          {title.toUpperCase()}
        </Text>
      </View>
    );
  }

  // default: underline or plain
  return (
    <View style={s.container}>
      <Text
        style={[
          s.title,
          {
            fontFamily: theme.typography.headingFont,
            color: theme.colors.primary,
            fontSize,
          },
        ]}
      >
        {title.toUpperCase()}
      </Text>
      {style === "underline" && (
        <View style={[s.underline, { backgroundColor: theme.colors.primary }]} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: 6, marginTop: 14 },
  title: { marginBottom: 2 },
  underline: { height: 1, width: 40 },
  bgBlock: { paddingHorizontal: 8, paddingVertical: 4, marginBottom: 8, marginTop: 14 },
  bgBlockText: { fontSize: 11 },
  boxed: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, marginBottom: 8, marginTop: 14 },
  boxedText: {},
  borderedLeft: { borderLeftWidth: 3, paddingLeft: 8, marginBottom: 8, marginTop: 14 },
  borderedLeftText: {},
  numberedRow: { flexDirection: "row", alignItems: "center", marginBottom: 8, marginTop: 14 },
  numberCircle: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  numberText: { fontSize: 9, fontWeight: "bold" },
  numberedText: {},
});
