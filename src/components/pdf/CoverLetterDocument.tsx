"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CoverLetter as CoverLetterType } from "@/types";

interface CoverLetterDocumentProps {
  coverLetter: CoverLetterType;
  fullName: string;
  email: string;
  phone: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 30,
    textAlign: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  contact: {
    fontSize: 9,
    color: "#666",
  },
  date: {
    fontSize: 9,
    color: "#666",
    marginBottom: 20,
  },
  paragraph: {
    marginBottom: 14,
    textAlign: "justify",
  },
});

export function CoverLetterDocument({ coverLetter, fullName, email, phone }: CoverLetterDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.contact}>{email}{phone ? ` | ${phone}` : ""}</Text>
        </View>
        <Text style={styles.date}>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</Text>
        {coverLetter.paragraphs.map((para) => (
          <Text key={para.id} style={styles.paragraph}>{para.content}</Text>
        ))}
      </Page>
    </Document>
  );
}
