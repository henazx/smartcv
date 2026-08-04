import React from "react";
import { Image, View, StyleSheet } from "@react-pdf/renderer";

interface PhotoBadgeProps {
  src: string | null;
  size?: number;
  borderColor?: string;
  borderWidth?: number;
}

export function PhotoBadge({ src, size = 60, borderColor = "#1f2937", borderWidth = 2 }: PhotoBadgeProps) {
  if (!src) return null;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        src={src}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: borderWidth,
            borderColor: borderColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  image: {
    objectFit: "cover",
  },
});
