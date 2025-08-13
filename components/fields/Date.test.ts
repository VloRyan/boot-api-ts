import { describe, expect, it } from "vitest";
import { exportedForTesting as Date } from "./Date";

describe("formatDate", () => {
  it("should format undefined value to empty string", () => {
    expect(Date.formatDate(undefined, undefined)).toBe("");
  });
  it("should format empty value to empty string", () => {
    expect(Date.formatDate("", undefined)).toBe("");
  });
  it("should just return date value for undefined format", () => {
    expect(Date.formatDate("2025-08-11", undefined)).toBe("2025-08-11");
  });
  it("should just return date value for DateOnly format", () => {
    expect(Date.formatDate("2025-08-11", "DateOnly")).toBe("2025-08-11");
  });
  it("should return ISO 8601 formated date without millis value for ISO 8601 format", () => {
    expect(Date.formatDate("2025-08-11", "ISO 8601")).toBe(
      "2025-08-11T00:00:00Z",
    );
    expect(Date.formatDate("2025-08-11T12:01:10+02:00", "ISO 8601")).toBe(
      "2025-08-11T10:01:10Z",
    );
  });
});
