from __future__ import annotations

import json
from pathlib import Path

from sheet_diff.engine import compare_workbooks
from sheet_diff.models import DiffOptions, TolerancePreset

SAMPLES = Path(__file__).resolve().parents[3] / "samples"
GOLDEN = Path(__file__).parent / "golden"


def test_invoice_golden_shape():
    before = SAMPLES / "invoice_before.xlsx"
    after = SAMPLES / "invoice_after.xlsx"
    result = compare_workbooks(before, after, DiffOptions())
    assert len(result.cells) >= 2
    assert result.summary.total_changes == len(result.cells)
    kinds = {c.kind for c in result.cells}
    assert "value" in kinds or "added" in kinds


def test_a2_tolerance_noise():
    before = SAMPLES / "noise_before.xlsx"
    after = SAMPLES / "noise_after.xlsx"
    strict = compare_workbooks(before, after, DiffOptions(tolerance_preset=TolerancePreset.STRICT))
    noise = compare_workbooks(
        before, after, DiffOptions(tolerance_preset=TolerancePreset.NUMERICAL_NOISE)
    )
    assert len(strict.cells) > len(noise.cells)


def test_a3_diff_workbook_colors(tmp_path):
    from sheet_diff.reports import write_diff_workbook

    before = SAMPLES / "invoice_before.xlsx"
    after = SAMPLES / "invoice_after.xlsx"
    result = compare_workbooks(before, after, DiffOptions())
    out = tmp_path / "diff.xlsx"
    write_diff_workbook(result, before, after, out)
    assert out.exists() and out.stat().st_size > 1000
