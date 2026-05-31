from pathlib import Path

from sheet_diff.engine import compare_workbooks
from sheet_diff.models import DiffOptions

SAMPLES = Path(__file__).resolve().parents[3] / "samples"


def test_pricing_structure_sheet_added():
    result = compare_workbooks(
        SAMPLES / "pricing_before.xlsx",
        SAMPLES / "pricing_after.xlsx",
        DiffOptions(),
    )
    assert "Summary" in result.structure.sheets.get("added", [])
