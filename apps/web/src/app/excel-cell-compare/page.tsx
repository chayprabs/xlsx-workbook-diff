import { redirect } from "next/navigation";

export const metadata = {
  title: "Excel Cell Compare — SheetDiff",
  description: "Per-cell Excel comparison with numeric tolerance presets.",
};

export default function ExcelCellComparePage() {
  redirect("/");
}
