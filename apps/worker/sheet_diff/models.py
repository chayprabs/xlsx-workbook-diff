from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class TolerancePreset(str, Enum):
    STRICT = "strict"
    NUMERICAL_NOISE = "numerical-noise"
    CURRENCY_2DP = "currency-2dp"


class DiffOptions(BaseModel):
    tolerance_preset: TolerancePreset = TolerancePreset.STRICT
    absolute_tolerance: float | None = None
    relative_tolerance: float | None = None
    trim_strings: bool = True
    case_fold_strings: bool = False
    normalize_dates: bool = True


class CellChange(BaseModel):
    sheet: str
    cell: str
    kind: str
    before: Any = None
    after: Any = None


class ChartDiff(BaseModel):
    sheet: str
    chart_id: str
    diff: dict[str, Any] = Field(default_factory=dict)


class StructureDiff(BaseModel):
    sheets: dict[str, Any] = Field(default_factory=dict)


class NamedRangesDiff(BaseModel):
    added: list[str] = Field(default_factory=list)
    removed: list[str] = Field(default_factory=list)
    changed: list[dict[str, Any]] = Field(default_factory=list)


class HiddenDiff(BaseModel):
    rows: dict[str, list[int]] = Field(default_factory=dict)
    cols: dict[str, list[str]] = Field(default_factory=dict)
    sheets: dict[str, list[str]] = Field(default_factory=dict)


class DiffSummary(BaseModel):
    total_changes: int = 0
    by_sheet: dict[str, dict[str, int]] = Field(default_factory=dict)


class DiffResult(BaseModel):
    cells: list[CellChange] = Field(default_factory=list)
    charts: list[ChartDiff] = Field(default_factory=list)
    structure: StructureDiff = Field(default_factory=StructureDiff)
    named_ranges: NamedRangesDiff = Field(default_factory=NamedRangesDiff)
    hidden: HiddenDiff = Field(default_factory=HiddenDiff)
    tables: dict[str, Any] = Field(default_factory=dict)
    summary: DiffSummary = Field(default_factory=DiffSummary)


class DiffArtifacts(BaseModel):
    diff_workbook_path: str | None = None
    html_report_path: str | None = None
    json_report_path: str | None = None


class DiffResponse(BaseModel):
    result: DiffResult
    artifacts: DiffArtifacts = Field(default_factory=DiffArtifacts)
