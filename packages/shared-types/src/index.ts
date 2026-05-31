export type CellChangeKind =
  | "value"
  | "formula"
  | "style"
  | "value+formula"
  | "added"
  | "removed";

export interface CellChange {
  sheet: string;
  cell: string;
  kind: CellChangeKind;
  before?: unknown;
  after?: unknown;
}

export interface ChartDiff {
  sheet: string;
  chartId: string;
  diff: Record<string, unknown>;
}

export interface StructureDiff {
  sheets: {
    added: string[];
    removed: string[];
    renamed: { from: string; to: string }[];
    reordered: boolean;
  };
}

export interface NamedRangeChange {
  name: string;
  before?: string;
  after?: string;
}

export interface NamedRangesDiff {
  added: string[];
  removed: string[];
  changed: NamedRangeChange[];
}

export interface HiddenDiff {
  rows: Record<string, number[]>;
  cols: Record<string, string[]>;
  sheets: { added: string[]; removed: string[] };
}

export interface DiffResult {
  cells: CellChange[];
  charts: ChartDiff[];
  structure: StructureDiff;
  namedRanges: NamedRangesDiff;
  hidden: HiddenDiff;
  tables: { added: string[]; removed: string[]; changed: { name: string; before: string; after: string }[] };
  summary: {
    totalChanges: number;
    bySheet: Record<string, { value: number; formula: number; style: number; total: number }>;
  };
  artifacts?: {
    diffWorkbookUrl?: string;
    htmlReportUrl?: string;
    jsonReportUrl?: string;
  };
}

export type TolerancePreset = "strict" | "numerical-noise" | "currency-2dp";

export interface DiffOptions {
  tolerancePreset?: TolerancePreset;
  absoluteTolerance?: number;
  relativeTolerance?: number;
  trimStrings?: boolean;
  caseFoldStrings?: boolean;
  normalizeDates?: boolean;
}

export interface DiffRequest {
  beforeFileId: string;
  afterFileId: string;
  options?: DiffOptions;
}
