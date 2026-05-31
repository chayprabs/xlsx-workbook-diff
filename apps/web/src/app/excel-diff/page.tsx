import { redirect } from "next/navigation";

export const metadata = {
  title: "Excel Diff Online — SheetDiff",
  description: "Compare Excel workbooks online with cell-level and formula diff.",
};

export default function ExcelDiffPage() {
  redirect("/");
}
