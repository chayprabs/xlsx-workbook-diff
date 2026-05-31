import { redirect } from "next/navigation";

export const metadata = {
  title: "Spreadsheet Diff Online — SheetDiff",
  description: "Online spreadsheet diff tool for Excel XLSX files.",
};

export default function SpreadsheetDiffPage() {
  redirect("/");
}
