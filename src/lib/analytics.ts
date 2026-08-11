const ANALYTICS_KEY = "smartcv-analytics";

interface AnalyticsEvent {
  type: "page_view" | "feature_use" | "export" | "generate";
  page: string;
  feature?: string;
  timestamp: string;
  metadata?: Record<string, string | number>;
}

interface AnalyticsData {
  events: AnalyticsEvent[];
  pageViews: Record<string, number>;
  featureUsage: Record<string, number>;
  lastVisit: string;
  totalVisits: number;
}

function getAnalytics(): AnalyticsData {
  if (typeof window === "undefined") {
    return { events: [], pageViews: {}, featureUsage: {}, lastVisit: "", totalVisits: 0 };
  }

  try {
    const saved = localStorage.getItem(ANALYTICS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}

  return { events: [], pageViews: {}, featureUsage: {}, lastVisit: "", totalVisits: 0 };
}

function saveAnalytics(data: AnalyticsData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
  } catch {}
}

export function trackPageView(page: string): void {
  const data = getAnalytics();
  const now = new Date().toISOString();

  data.pageViews[page] = (data.pageViews[page] || 0) + 1;
  data.lastVisit = now;
  data.totalVisits += 1;

  // Keep only last 100 events
  data.events.push({ type: "page_view", page, timestamp: now });
  if (data.events.length > 100) {
    data.events = data.events.slice(-100);
  }

  saveAnalytics(data);
}

export function trackFeatureUse(feature: string, page: string, metadata?: Record<string, string | number>): void {
  const data = getAnalytics();
  const now = new Date().toISOString();

  data.featureUsage[feature] = (data.featureUsage[feature] || 0) + 1;

  data.events.push({ type: "feature_use", page, feature, timestamp: now, metadata });
  if (data.events.length > 100) {
    data.events = data.events.slice(-100);
  }

  saveAnalytics(data);
}

export function trackExport(template: string, format: string): void {
  const data = getAnalytics();
  const now = new Date().toISOString();

  data.events.push({ type: "export", page: "/export", timestamp: now, metadata: { template, format } });
  if (data.events.length > 100) {
    data.events = data.events.slice(-100);
  }

  saveAnalytics(data);
}

export function trackGenerate(type: string): void {
  const data = getAnalytics();
  const now = new Date().toISOString();

  data.events.push({ type: "generate", page: `/${type}`, timestamp: now, metadata: { type } });
  if (data.events.length > 100) {
    data.events = data.events.slice(-100);
  }

  saveAnalytics(data);
}

export function getAnalyticsSummary(): {
  totalPageViews: number;
  uniquePages: number;
  topPages: { page: string; views: number }[];
  topFeatures: { feature: string; uses: number }[];
  totalVisits: number;
  lastVisit: string;
} {
  const data = getAnalytics();

  const totalPageViews = Object.values(data.pageViews).reduce((a, b) => a + b, 0);
  const uniquePages = Object.keys(data.pageViews).length;

  const topPages = Object.entries(data.pageViews)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const topFeatures = Object.entries(data.featureUsage)
    .map(([feature, uses]) => ({ feature, uses }))
    .sort((a, b) => b.uses - a.uses)
    .slice(0, 10);

  return {
    totalPageViews,
    uniquePages,
    topPages,
    topFeatures,
    totalVisits: data.totalVisits,
    lastVisit: data.lastVisit,
  };
}

export function clearAnalytics(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ANALYTICS_KEY);
}
