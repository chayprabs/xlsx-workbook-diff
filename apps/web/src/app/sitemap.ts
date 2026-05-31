import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://github.com/chayprabs/xlsx-workbook-diff");
  const routes = [
    "",
    "/excel-diff",
    "/xlsx-compare",
    "/spreadsheet-diff-online",
    "/excel-formula-diff",
    "/excel-cell-compare",
    "/privacy",
    "/terms",
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
