"use client";

import { useCallback, useState } from "react";
import { Download, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import type { DiffResult, TolerancePreset } from "@sheet-diff/shared-types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const diffApiUrl = API_BASE ? `${API_BASE}/v1/diff` : "/api/v1/diff";

const SAMPLES = [
  { id: "invoice", label: "Invoice (before/after)", before: "/samples/invoice_before.xlsx", after: "/samples/invoice_after.xlsx" },
  { id: "pricing", label: "Pricing model", before: "/samples/pricing_before.xlsx", after: "/samples/pricing_after.xlsx" },
  { id: "financial", label: "Financial report + chart", before: "/samples/financial_before.xlsx", after: "/samples/financial_after.xlsx" },
  { id: "noise", label: "Numerical noise", before: "/samples/noise_before.xlsx", after: "/samples/noise_after.xlsx" },
];

const PRESETS: { value: TolerancePreset; label: string }[] = [
  { value: "strict", label: "Strict" },
  { value: "numerical-noise", label: "Numerical noise (1e-6)" },
  { value: "currency-2dp", label: "Currency (2 dp)" },
];

interface ApiSummary {
  total_changes?: number;
  totalChanges?: number;
  by_sheet?: Record<string, { value: number; formula: number; style: number; total: number }>;
  bySheet?: Record<string, { value: number; formula: number; style: number; total: number }>;
}

interface ApiResult {
  cells: DiffResult["cells"];
  charts?: DiffResult["charts"];
  structure?: DiffResult["structure"];
  summary?: ApiSummary;
}

interface ApiResponse {
  result: ApiResult;
  artifacts?: {
    diffWorkbookUrl?: string;
    htmlReportUrl?: string;
    jsonReportUrl?: string;
  };
  jobId?: string;
}

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

function normalizeArtifactUrl(url: string): string {
  if (API_BASE) return url;
  try {
    const u = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    if (u.pathname.startsWith("/v1/artifacts/")) {
      return `/api${u.pathname}`;
    }
  } catch {
    /* ignore */
  }
  return url;
}

function normalizeResult(raw: ApiResult): DiffResult & { summary: { totalChanges: number; bySheet: Record<string, { value: number; formula: number; style: number; total: number }> } } {
  const s = raw.summary;
  const bySheet = s?.bySheet ?? s?.by_sheet ?? {};
  const rawCharts = raw.charts ?? [];
  return {
    ...raw,
    cells: raw.cells ?? [],
    charts: rawCharts.map((c) => {
      const chart = c as { chartId?: string; chart_id?: string; sheet: string; diff: Record<string, unknown> };
      return {
        sheet: chart.sheet,
        chartId: chart.chartId ?? chart.chart_id ?? "",
        diff: chart.diff,
      };
    }),
    structure: raw.structure ?? { sheets: { added: [], removed: [], renamed: [], reordered: false } },
    namedRanges:
      (raw as { namedRanges?: DiffResult["namedRanges"]; named_ranges?: DiffResult["namedRanges"] })
        .namedRanges ??
      (raw as { named_ranges?: DiffResult["namedRanges"] }).named_ranges ??
      { added: [], removed: [], changed: [] },
    hidden: (raw as { hidden?: DiffResult["hidden"] }).hidden ?? {
      rows: {},
      cols: {},
      sheets: { added: [], removed: [] },
    },
    tables:
      (raw as { tables?: DiffResult["tables"] }).tables ??
      { added: [], removed: [], changed: [] },
    summary: {
      totalChanges: s?.totalChanges ?? s?.total_changes ?? raw.cells?.length ?? 0,
      bySheet,
    },
  } as DiffResult & { summary: { totalChanges: number; bySheet: Record<string, { value: number; formula: number; style: number; total: number }> } };
}

function FileSlot({
  label,
  file,
  onFile,
}: {
  label: string;
  file: File | null;
  onFile: (f: File | null) => void;
}) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f?.name.endsWith(".xlsx")) onFile(f);
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      className="flex-1 min-h-[140px] border-2 border-dashed border-[var(--border)] rounded-xl bg-white p-4 flex flex-col items-center justify-center gap-2 hover:border-[var(--accent)] transition-colors"
    >
      <FileSpreadsheet className="w-8 h-8 text-[var(--muted)]" />
      <p className="text-sm font-medium">{label}</p>
      {file ? (
        <p className="text-xs text-[var(--accent)] truncate max-w-full">{file.name}</p>
      ) : (
        <p className="text-xs text-[var(--muted)]">Drop .xlsx or click to browse</p>
      )}
      <label className="cursor-pointer text-xs text-[var(--accent)] flex items-center gap-1">
        <Upload className="w-3 h-3" />
        Choose file
        <input type="file" accept=".xlsx" className="hidden" onChange={onChange} />
      </label>
    </div>
  );
}

export function DiffPlayground() {
  const [before, setBefore] = useState<File | null>(null);
  const [after, setAfter] = useState<File | null>(null);
  const [preset, setPreset] = useState<TolerancePreset>("strict");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [beforeUrl, setBeforeUrl] = useState("");
  const [afterUrl, setAfterUrl] = useState("");

  const loadFromUrl = async (url: string, setter: (f: File | null) => void) => {
    if (!url.trim()) return;
    try {
      const res = await fetch(url.trim());
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const name = url.split("/").pop()?.split("?")[0] || "workbook.xlsx";
      setter(new File([blob], name.endsWith(".xlsx") ? name : `${name}.xlsx`, { type: blob.type }));
    } catch {
      setError("Could not load workbook from URL.");
    }
  };

  const runDiff = useCallback(async () => {
    if (!before || !after) {
      setError("Please upload both workbooks.");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const fd = new FormData();
      fd.append("before", before);
      fd.append("after", after);
      fd.append("tolerance_preset", preset);
      const res = await fetch(diffApiUrl, { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { detail?: string }).detail || `Error ${res.status}`);
      }
      const json = (await res.json()) as ApiResponse;
      setData({
        ...json,
        result: normalizeResult(json.result),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Diff failed");
    } finally {
      setLoading(false);
    }
  }, [before, after, preset]);

  const loadSample = async (sample: (typeof SAMPLES)[0]) => {
    setError(null);
    try {
      const [bRes, aRes] = await Promise.all([
        fetch(sample.before),
        fetch(sample.after),
      ]);
      if (!bRes.ok || !aRes.ok) {
        throw new Error("Could not load sample files.");
      }
      const bBlob = await bRes.blob();
      const aBlob = await aRes.blob();
      setBefore(new File([bBlob], sample.before.split("/").pop()!, { type: bBlob.type }));
      setAfter(new File([aBlob], sample.after.split("/").pop()!, { type: aBlob.type }));
    } catch {
      setError("Could not load sample files.");
    }
  };

  const result = data?.result as ReturnType<typeof normalizeResult> | undefined;
  const artifacts = data?.artifacts;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-[var(--muted)]">Tolerance:</span>
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPreset(p.value)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              preset === p.value
                ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                : "bg-white border-[var(--border)] hover:border-[var(--accent)]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <FileSlot label="Before workbook" file={before} onFile={setBefore} />
        <FileSlot label="After workbook" file={after} onFile={setAfter} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Paste before workbook URL (.xlsx)"
            value={beforeUrl}
            onChange={(e) => setBeforeUrl(e.target.value)}
            className="flex-1 text-sm px-3 py-2 border border-[var(--border)] rounded-lg bg-white"
          />
          <button
            type="button"
            onClick={() => loadFromUrl(beforeUrl, setBefore)}
            className="text-sm px-3 py-2 border border-[var(--border)] rounded-lg bg-white hover:border-[var(--accent)]"
          >
            Load
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Paste after workbook URL (.xlsx)"
            value={afterUrl}
            onChange={(e) => setAfterUrl(e.target.value)}
            className="flex-1 text-sm px-3 py-2 border border-[var(--border)] rounded-lg bg-white"
          />
          <button
            type="button"
            onClick={() => loadFromUrl(afterUrl, setAfter)}
            className="text-sm px-3 py-2 border border-[var(--border)] rounded-lg bg-white hover:border-[var(--accent)]"
          >
            Load
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={runDiff}
          disabled={loading || !before || !after}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] text-white rounded-lg font-medium disabled:opacity-50 hover:bg-[var(--accent-hover)] transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Compare workbooks
        </button>
        <span className="text-sm text-[var(--muted)]">or try a sample:</span>
        {SAMPLES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => loadSample(s)}
            className="text-sm px-3 py-1 rounded-lg border border-[var(--border)] bg-white hover:border-[var(--accent)]"
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {artifacts?.diffWorkbookUrl && (
              <a
                href={normalizeArtifactUrl(artifacts.diffWorkbookUrl)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-[var(--border)] rounded-lg hover:border-[var(--accent)]"
                download
              >
                <Download className="w-4 h-4" /> Diff workbook (.xlsx)
              </a>
            )}
            {artifacts?.htmlReportUrl && (
              <a
                href={normalizeArtifactUrl(artifacts.htmlReportUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-[var(--border)] rounded-lg hover:border-[var(--accent)]"
              >
                <Download className="w-4 h-4" /> HTML report
              </a>
            )}
            {artifacts?.jsonReportUrl && (
              <a
                href={normalizeArtifactUrl(artifacts.jsonReportUrl)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-[var(--border)] rounded-lg hover:border-[var(--accent)]"
                download
              >
                <Download className="w-4 h-4" /> JSON (CI)
              </a>
            )}
            <button
              type="button"
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="text-sm px-4 py-2 border border-[var(--border)] rounded-lg bg-white"
            >
              {drawerOpen ? "Hide" : "Show"} structure &amp; charts
            </button>
          </div>

          <p className="text-sm font-medium">
            {result.summary?.totalChanges ?? result.cells.length} total changes
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(result.summary?.bySheet ?? {}).map(([sheet, counts]) => (
              <div key={sheet} className="bg-white border border-[var(--border)] rounded-xl p-4 shadow-sm">
                <h3 className="font-medium truncate">{sheet}</h3>
                <p className="text-2xl font-semibold mt-1">{counts.total}</p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {counts.value} value · {counts.formula} formula · {counts.style} style
                </p>
              </div>
            ))}
          </div>

          {drawerOpen && (
            <aside className="bg-white border border-[var(--border)] rounded-xl p-4 text-sm">
              <h3 className="font-medium mb-2">Structure</h3>
              <pre className="overflow-auto text-xs bg-[#fafafa] p-3 rounded-lg">
                {JSON.stringify(result.structure, null, 2)}
              </pre>
              {result.charts?.length > 0 && (
                <>
                  <h3 className="font-medium mt-4 mb-2">Charts</h3>
                  <pre className="overflow-auto text-xs bg-[#fafafa] p-3 rounded-lg max-h-48">
                    {JSON.stringify(result.charts, null, 2)}
                  </pre>
                </>
              )}
            </aside>
          )}

          <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#f5f5f5]">
                <tr>
                  <th className="text-left p-2">Sheet</th>
                  <th className="text-left p-2">Cell</th>
                  <th className="text-left p-2">Kind</th>
                  <th className="text-left p-2 hidden md:table-cell">Before</th>
                  <th className="text-left p-2 hidden md:table-cell">After</th>
                </tr>
              </thead>
              <tbody>
                {result.cells.slice(0, 100).map((c, i) => (
                  <tr key={i} className="border-t border-[var(--border)]">
                    <td className="p-2">{c.sheet}</td>
                    <td className="p-2 font-mono">{c.cell}</td>
                    <td className="p-2">
                      <span className="px-2 py-0.5 rounded text-xs bg-[#f0f0f0]">{c.kind}</span>
                    </td>
                    <td className="p-2 hidden md:table-cell truncate max-w-[120px] text-[var(--muted)]">
                      {formatCellDisplay(c.before).slice(0, 80)}
                    </td>
                    <td className="p-2 hidden md:table-cell truncate max-w-[120px] text-[var(--muted)]">
                      {formatCellDisplay(c.after).slice(0, 80)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {result.cells.length > 100 && (
              <p className="text-xs text-center text-[var(--muted)] p-2">
                Showing first 100 of {result.cells.length} changes
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
