import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { CVTheme, PersonalInfo } from "@/types";

interface ContactInfoProps {
  personal: PersonalInfo;
  theme: CVTheme;
  layout?: "horizontal" | "vertical" | "sidebar";
  showLinks?: boolean;
}

export function ContactInfo({ personal, theme, layout = "horizontal", showLinks = true }: ContactInfoProps) {
  const items: string[] = [];
  if (personal.email) items.push(personal.email);
  if (personal.phone) items.push(personal.phone);
  if (personal.address) items.push(personal.address);

  const links: string[] = [];
  if (showLinks) {
    if (personal.linkedIn) links.push(personal.linkedIn);
    if (personal.github) links.push(personal.github);
    if (personal.website) links.push(personal.website);
  }

  if (layout === "sidebar") {
    return (
      <View style={s.sidebar}>
        {items.map((item, i) => (
          <Text key={i} style={[s.sidebarItem, { color: theme.colors.muted, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize - 1 }]}>
            {item}
          </Text>
        ))}
        {links.map((link, i) => (
          <Text key={`l${i}`} style={[s.sidebarItem, { color: theme.colors.primary, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize - 1 }]}>
            {link}
          </Text>
        ))}
      </View>
    );
  }

  if (layout === "vertical") {
    return (
      <View style={s.vertical}>
        {items.map((item, i) => (
          <Text key={i} style={[s.verticalItem, { color: theme.colors.muted, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize }]}>
            {item}
          </Text>
        ))}
        {links.length > 0 && (
          <Text style={[s.verticalItem, { color: theme.colors.primary, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize }]}>
            {links.join(" | ")}
          </Text>
        )}
      </View>
    );
  }

  // horizontal
  return (
    <View style={s.horizontal}>
      <Text style={[s.horizontalText, { color: theme.colors.muted, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize }]}>
        {items.join(" | ")}
      </Text>
      {links.length > 0 && (
        <Text style={[s.horizontalText, { color: theme.colors.primary, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize }]}>
          {links.join(" | ")}
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  horizontal: { marginBottom: 10, alignItems: "center" },
  horizontalText: { marginBottom: 2 },
  vertical: { marginBottom: 10 },
  verticalItem: { marginBottom: 2 },
  sidebar: { marginBottom: 10 },
  sidebarItem: { marginBottom: 4 },
});
