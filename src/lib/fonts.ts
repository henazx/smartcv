"use client";

let registered = false;

export async function ensureFontsRegistered() {
  if (registered) return;

  try {
    const { Font } = await import("@react-pdf/renderer");

    // Register standard PDF fonts (built into all PDF readers)
    Font.register({
      family: "Helvetica",
      fonts: [
        { src: "Helvetica", fontWeight: "normal", fontStyle: "normal" },
        { src: "Helvetica-Bold", fontWeight: "bold", fontStyle: "normal" },
        { src: "Helvetica-Oblique", fontWeight: "normal", fontStyle: "italic" },
        { src: "Helvetica-BoldOblique", fontWeight: "bold", fontStyle: "italic" },
      ],
    });

    Font.register({
      family: "Times-Roman",
      fonts: [
        { src: "Times-Roman", fontWeight: "normal", fontStyle: "normal" },
        { src: "Times-Bold", fontWeight: "bold", fontStyle: "normal" },
        { src: "Times-Italic", fontWeight: "normal", fontStyle: "italic" },
        { src: "Times-BoldItalic", fontWeight: "bold", fontStyle: "italic" },
      ],
    });

    Font.register({
      family: "Courier",
      fonts: [
        { src: "Courier", fontWeight: "normal", fontStyle: "normal" },
        { src: "Courier-Bold", fontWeight: "bold", fontStyle: "normal" },
        { src: "Courier-Oblique", fontWeight: "normal", fontStyle: "italic" },
        { src: "Courier-BoldOblique", fontWeight: "bold", fontStyle: "italic" },
      ],
    });

    registered = true;
  } catch (e) {
    console.warn("Font registration failed:", e);
  }
}