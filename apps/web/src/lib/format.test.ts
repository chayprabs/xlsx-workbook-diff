import { describe, expect, it } from "vitest";

/** Mirrors DiffPlayground formatCellDisplay logic for unit tests. */
function formatCellDisplay(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "object" && v !== null) {
    const o = v as { value?: unknown; formula?: unknown };
    if (o.formula != null && String(o.formula) !== "") return String(o.formula);
    if (o.value != null) return String(o.value);
    return JSON.stringify(v).slice(0, 80);
  }
  return String(v);
}

function normalizeArtifactUrl(url: string, apiBase: string): string {
  if (apiBase) return url;
  try {
    const u = new URL(url, "http://localhost");
    if (u.pathname.startsWith("/v1/artifacts/")) {
      return `/api${u.pathname}`;
    }
  } catch {
    /* ignore */
  }
  return url;
}

describe("formatCellDisplay", () => {
  it("shows formula when present", () => {
    expect(formatCellDisplay({ value: 5, formula: "=A1+A2" })).toBe("=A1+A2");
  });

  it("shows value when no formula", () => {
    expect(formatCellDisplay({ value: 42 })).toBe("42");
  });
});

describe("normalizeArtifactUrl", () => {
  it("rewrites worker artifact URLs through api proxy", () => {
    expect(
      normalizeArtifactUrl("http://localhost:8080/v1/artifacts/job/diff.xlsx", ""),
    ).toBe("/api/v1/artifacts/job/diff.xlsx");
  });

  it("leaves url unchanged when api base is set", () => {
    const url = "http://localhost:8080/v1/artifacts/job/diff.xlsx";
    expect(normalizeArtifactUrl(url, "http://localhost:8080")).toBe(url);
  });
});
