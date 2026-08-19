export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  const year = parts[0];
  if (!year) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (parts.length > 1 && parts[1]) {
    const month = months[parseInt(parts[1], 10) - 1];
    return month ? `${month} ${year}` : year;
  }
  return year;
}

export function formatDateRange(start: string, end: string): string {
  const s = formatDate(start);
  const e = end ? formatDate(end) : "Present";
  if (s && e) return `${s} — ${e}`;
  return s || e;
}

export function normalizeDateInput(value: string): string {
  const v = value.trim();
  if (!v) return "";
  const parts = v.split("-");
  const year = parts[0];
  if (!/^\d{4}$/.test(year)) return "";
  if (parts.length > 1 && parts[1]) {
    const month = parseInt(parts[1], 10);
    if (month >= 1 && month <= 12) {
      return `${year}-${String(month).padStart(2, "0")}`;
    }
    return year;
  }
  return year;
}