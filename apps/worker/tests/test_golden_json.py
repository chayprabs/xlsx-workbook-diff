"""Golden DiffResult shape checks per PRD acceptance A1."""
from __future__ import annotations

import json
from pathlib import Path

from sheet_diff.engine import compare_workbooks
from sheet_diff.models import DiffOptions

SAMPLES = Path(__file__).resolve().parents[3] / "samples"
GOLDEN = Path(__file__).parent / "golden"


def _assert_shape(result) -> None:
    assert hasattr(result, "cells")
    assert hasattr(result, "charts")
    assert hasattr(result, "structure")
    assert hasattr(result, "named_ranges")
    assert hasattr(result, "hidden")
    assert hasattr(result, "tables")
    assert hasattr(result, "summary")
    dumped = json.loads(result.model_dump_json())
    assert "cells" in dumped and isinstance(dumped["cells"], list)


def test_golden_invoice_shape():
    result = compare_workbooks(
        SAMPLES / "invoice_before.xlsx",
        SAMPLES / "invoice_after.xlsx",
        DiffOptions(),
    )
    _assert_shape(result)
    assert result.summary.total_changes >= 2
    GOLDEN.mkdir(exist_ok=True)
    path = GOLDEN / "invoice_summary.json"
    if not path.exists():
        path.write_text(
            json.dumps({"minChanges": 2, "sheets": list(result.summary.by_sheet.keys())}, indent=2)
        )
    spec = json.loads(path.read_text())
    assert result.summary.total_changes >= spec["minChanges"]


def test_golden_noise_tolerance_a2():
    before, after = SAMPLES / "noise_before.xlsx", SAMPLES / "noise_after.xlsx"
    strict = compare_workbooks(before, after, DiffOptions())
    from sheet_diff.models import TolerancePreset

    noise = compare_workbooks(
        before,
        after,
        DiffOptions(tolerance_preset=TolerancePreset.NUMERICAL_NOISE),
    )
    assert len(strict.cells) > len(noise.cells)
