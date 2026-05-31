import { redirect } from "next/navigation";

export const metadata = {
  title: "Excel Formula Diff — SheetDiff",
  description: "Detect formula and dependency changes between Excel workbooks.",
};

export default function ExcelFormulaDiffPage() {
  redirect("/");
}
