import { redirect } from "next/navigation";

export const metadata = {
  title: "XLSX Compare — SheetDiff",
  description: "Side-by-side XLSX workbook comparison with downloadable diff reports.",
};

export default function XlsxComparePage() {
  redirect("/");
}
