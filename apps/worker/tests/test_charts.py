from pathlib import Path

from sheet_diff.charts import extract_charts_from_xlsx, parse_chart_xml
from sheet_diff.engine import compare_workbooks
from sheet_diff.models import DiffOptions

SAMPLES = Path(__file__).resolve().parents[3] / "samples"


def test_chart_title_parsing_from_xml():
    import zipfile

    with zipfile.ZipFile(SAMPLES / "financial_after.xlsx") as zf:
        chart_xml = zf.read("xl/charts/chart1.xml")
    parsed = parse_chart_xml(chart_xml)
    assert parsed["title"] == "Revenue Q1"


def test_financial_chart_diff():
    result = compare_workbooks(
        SAMPLES / "financial_before.xlsx",
        SAMPLES / "financial_after.xlsx",
        DiffOptions(),
    )
    assert len(result.charts) >= 1
    assert result.charts[0].sheet == "Report"


def test_chart_sheet_mapping():
    charts = extract_charts_from_xlsx(SAMPLES / "financial_before.xlsx")
    assert "Report" in charts
    assert charts["Report"][0]["title"] == "Revenue"


def test_formula_only_kind():
    before = SAMPLES / "formula_only_before.xlsx"
    after = SAMPLES / "formula_only_after.xlsx"
    if not before.exists():
        return
    result = compare_workbooks(before, after, DiffOptions())
    assert any(c.kind == "formula" for c in result.cells)
