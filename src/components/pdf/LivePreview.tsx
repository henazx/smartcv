"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useCVStore } from "@/lib/store";
import { computeLayout, analyzeContent } from "@/lib/layoutEngine";
import { estimatePageCount } from "@/lib/atsScorer";

class PreviewErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PdfViewerWrapper({ children, ...props }: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Viewer, setViewer] = useState<React.ComponentType<any> | null>(null);
  useEffect(() => {
    import("@react-pdf/renderer").then((m) => setViewer(() => m.PDFViewer));
  }, []);
  if (!Viewer) return <div className="w-full h-full bg-gray-50 animate-pulse rounded-lg" />;
  return <Viewer {...props}>{children}</Viewer>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PdfDocumentLoader(props: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Doc, setDoc] = useState<React.ComponentType<any> | null>(null);
  useEffect(() => {
    import("@/components/pdf/CVDocument").then((m) => setDoc(() => m.CVDocument));
  }, []);
  if (!Doc) return null;
  return <Doc {...props} />;
}

export function LivePreview() {
  const { data, template, theme, layoutOverride, manualLayout, isPremium, fontChoice } = useCVStore();
  const [zoom, setZoom] = useState(100);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const autoLayout = useMemo(() => computeLayout(data, template), [data, template]);
  const finalLayout = layoutOverride ? { ...autoLayout, ...manualLayout } : autoLayout;

  const contentAnalysis = useMemo(() => analyzeContent(data), [data]);
  const pageCount = useMemo(() => estimatePageCount(data), [data]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm">
      <div className="px-3 sm:px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-900">Preview</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Page {pageCount} · {contentAnalysis.contentDensity}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="w-6 h-6 rounded bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200">-</button>
          <span className="text-[10px] text-gray-400 w-8 text-center font-medium">{zoom}%</span>
          <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="w-6 h-6 rounded bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200">+</button>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        {mounted ? (
          <PreviewErrorBoundary
            fallback={
              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center" style={{ height: "min(400px, 50vh)" }}>
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-2">Preview unavailable</p>
                  <p className="text-[10px] text-gray-300">PDF preview requires a modern browser</p>
                </div>
              </div>
            }
          >
            <div
              className="rounded-lg overflow-hidden border border-gray-200 origin-top"
              style={{
                height: "min(400px, 50vh)",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                width: `${10000 / zoom}%`,
              }}
            >
              <PdfViewerWrapper width="100%" height="100%" showToolbar={false}>
                <PdfDocumentLoader data={data} template={template} theme={theme} layout={finalLayout} isPremium={isPremium} fontChoice={fontChoice} />
              </PdfViewerWrapper>
            </div>
          </PreviewErrorBoundary>
        ) : (
          <div className="w-full rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center" style={{ height: "min(400px, 50vh)" }}>
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
