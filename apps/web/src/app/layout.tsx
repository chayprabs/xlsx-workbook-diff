import type { Metadata } from "next";
import "./globals.css";
import { TopBar } from "@/components/TopBar";
import { SeoBar } from "@/components/SeoBar";

export const metadata: Metadata = {
  title: "SheetDiff — Compare Excel XLSX Workbooks Online",
  description:
    "Compare Excel XLSX workbooks online at cell, formula, style, chart, named-range and sheet-structure level with tolerance settings.",
  keywords: [
    "xlsx",
    "excel",
    "excel-diff",
    "xlsx-diff",
    "spreadsheet-diff",
    "workbook-compare",
  ],
  openGraph: {
    title: "SheetDiff — XLSX Workbook Diff",
    description:
      "Compare two Excel workbooks with numeric tolerance, formula AST diff, and downloadable color-coded reports.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <TopBar />
        <SeoBar />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">{children}</main>
        <footer className="border-t border-[var(--border)] py-6 text-center text-sm text-[var(--muted)]">
          <nav className="flex justify-center gap-6">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms &amp; Conditions</a>
          </nav>
          <p className="mt-3">© {new Date().getFullYear()} SheetDiff · AGPL-3.0</p>
        </footer>
      </body>
    </html>
  );
}
