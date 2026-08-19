import { formatDate, formatDateRange, normalizeDateInput } from "@/lib/dates";

describe("dates", () => {
  describe("formatDate", () => {
    it("returns empty string for empty input", () => {
      expect(formatDate("")).toBe("");
    });

    it("renders a year-only value", () => {
      expect(formatDate("2020")).toBe("2020");
    });

    it("renders a month-year value", () => {
      expect(formatDate("2020-06")).toBe("Jun 2020");
    });

    it("renders a full date value", () => {
      expect(formatDate("2020-06-15")).toBe("Jun 2020");
    });

    it("falls back to year when month is invalid", () => {
      expect(formatDate("2020-99")).toBe("2020");
    });

    it("returns empty when year is missing", () => {
      expect(formatDate("-06")).toBe("");
    });
  });

  describe("formatDateRange", () => {
    it("uses Present when end is empty", () => {
      expect(formatDateRange("2020-01", "")).toBe("Jan 2020 — Present");
    });

    it("renders both dates", () => {
      expect(formatDateRange("2016-09", "2020-06")).toBe("Sep 2016 — Jun 2020");
    });

    it("handles year-only start", () => {
      expect(formatDateRange("2016", "2020")).toBe("2016 — 2020");
    });
  });

  describe("normalizeDateInput", () => {
    it("normalizes month-year into zero-padded format", () => {
      expect(normalizeDateInput("2020-6")).toBe("2020-06");
    });

    it("keeps a valid month-year", () => {
      expect(normalizeDateInput("2020-12")).toBe("2020-12");
    });

    it("keeps a year-only value", () => {
      expect(normalizeDateInput("2020")).toBe("2020");
    });

    it("rejects an invalid year", () => {
      expect(normalizeDateInput("abc")).toBe("");
    });

    it("rejects an out-of-range month but keeps the year", () => {
      expect(normalizeDateInput("2020-13")).toBe("2020");
    });

    it("returns empty for blank input", () => {
      expect(normalizeDateInput("  ")).toBe("");
    });
  });
});