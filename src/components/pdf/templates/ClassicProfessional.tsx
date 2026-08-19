import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { CVData, CVTemplate, CVTheme, LayoutConfig } from "@/types";
import { SectionTitle } from "../shared/SectionTitle";
import { ContactInfo } from "../shared/ContactInfo";
import { ExperienceItem } from "../shared/ExperienceItem";
import { EducationItem } from "../shared/EducationItem";
import { SkillDisplay } from "../shared/SkillDisplay";
import { DynamicSections } from "../shared/DynamicSections";

interface Props {
  data: CVData;
  template: CVTemplate;
  theme: CVTheme;
  layout: LayoutConfig;
}

export function ClassicProfessional({ data, template, theme, layout }: Props) {
  const s = makeStyles(theme, layout);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.content}>
          {/* Header */}
          <View style={s.header}>
            <Text style={s.name}>{data.personal.fullName}</Text>
            {data.personal.headline && (
              <Text style={s.headline}>{data.personal.headline}</Text>
            )}
            <ContactInfo personal={data.personal} theme={theme} layout="horizontal" />
          </View>

          <View style={s.dividerGroup}>
            <View style={[s.dividerThick, { backgroundColor: theme.colors.primary }]} />
            <View style={[s.dividerThin, { backgroundColor: theme.colors.primary }]} />
          </View>

          {/* Summary */}
          {data.personal.summary && (
            <View style={s.section}>
              <SectionTitle title="Professional Summary" theme={theme} style={template.sectionStyle} />
              <Text style={s.bodyText}>{data.personal.summary}</Text>
            </View>
          )}

          {/* Experience */}
          {data.experiences.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Work Experience" theme={theme} style={template.sectionStyle} level={data.personal.summary ? 2 : 1} />
              {data.experiences.map((exp, i) => (
                <ExperienceItem key={exp.id} experience={exp} theme={theme} style="standard" fontScale={layout.fontScale} isLast={i === data.experiences.length - 1} />
              ))}
            </View>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Education" theme={theme} style={template.sectionStyle} />
              {data.education.map((edu, i) => (
                <EducationItem key={edu.id} education={edu} theme={theme} fontScale={layout.fontScale} isLast={i === data.education.length - 1} />
              ))}
            </View>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Skills" theme={theme} style={template.sectionStyle} />
              <SkillDisplay skills={data.skills} theme={theme} style={template.skillsStyle} fontScale={layout.fontScale} />
            </View>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Languages" theme={theme} style={template.sectionStyle} />
              <Text style={s.bodyText}>
                {data.languages.map((l) => `${l.name} (${l.proficiency})`).join(" | ")}
              </Text>
            </View>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <View style={s.section}>
              <SectionTitle title="Certifications" theme={theme} style={template.sectionStyle} />
              {data.certifications.map((cert) => (
                <View key={cert.id} style={{ marginBottom: 4 }}>
                  <Text style={s.bodyText}>
                    {cert.name} - {cert.issuer}{cert.date ? ` (${cert.date})` : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* References */}
          {data.includeReferences && (
            <View style={s.section}>
              <SectionTitle title="References" theme={theme} style={template.sectionStyle} />
              <Text style={s.bodyText}>
                {data.showAvailableUponRequest ? "Available upon request" : data.references.map((r) => `${r.name} - ${r.title}`).join(", ")}
              </Text>
            </View>
          )}

          <DynamicSections data={data} theme={theme} layout={layout} sectionStyle={template.sectionStyle} omit={{ certifications: true, languages: true, references: true }} />
        </View>

      </Page>
    </Document>
  );
}

function makeStyles(theme: CVTheme, layout: LayoutConfig) {
  return StyleSheet.create({
    page: { padding: theme.spacing.padding, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, color: theme.colors.text, lineHeight: theme.typography.lineHeight },
    content: { flex: 1 },
    header: { textAlign: "center", marginBottom: 12 },
    name: { fontSize: 24 * layout.fontScale, fontFamily: theme.typography.headingFont, color: theme.colors.primary, textAlign: "center", marginBottom: 10 },
    headline: { fontSize: 11 * layout.fontScale, color: theme.colors.muted, textAlign: "center", marginBottom: 12, fontFamily: theme.typography.bodyFont },
    dividerGroup: { marginBottom: 12 },
    dividerThick: { height: 2.5, marginBottom: 2 },
    dividerThin: { height: 0.5 },
    section: { marginBottom: theme.spacing.sectionGap * layout.spacingScale },
    bodyText: { color: theme.colors.text, fontFamily: theme.typography.bodyFont, fontSize: theme.typography.bodySize * layout.fontScale, lineHeight: theme.typography.lineHeight },
  });
}
