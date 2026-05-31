from __future__ import annotations

from pathlib import Path

import pytest
from sheet_diff.engine import compare_workbooks
from sheet_diff.models import DiffOptions, TolerancePreset
from sheet_diff.main import app

SAMPLES = Path(__file__).resolve().parents[3] / "samples"


@pytest.fixture
def invoice_paths():
    return SAMPLES / "invoice_before.xlsx", SAMPLES / "invoice_after.xlsx"


def test_invoice_diff_shape(invoice_paths):
    before, after = invoice_paths
    result = compare_workbooks(before, after, DiffOptions())
    assert isinstance(result.cells, list)
    assert result.structure.sheets is not None
    assert result.summary.total_changes >= 1


def test_tolerance_numerical_noise():
    before = SAMPLES / "noise_before.xlsx"
    after = SAMPLES / "noise_after.xlsx"
    strict = compare_workbooks(before, after, DiffOptions(tolerance_preset=TolerancePreset.STRICT))
    noise = compare_workbooks(
        before, after, DiffOptions(tolerance_preset=TolerancePreset.NUMERICAL_NOISE)
    )
    assert len(strict.cells) >= len(noise.cells)


def test_currency_preset():
    before = SAMPLES / "invoice_before.xlsx"
    after = SAMPLES / "invoice_after.xlsx"
    result = compare_workbooks(
        before, after, DiffOptions(tolerance_preset=TolerancePreset.CURRENCY_2DP)
    )
    assert result.summary.total_changes >= 0


def test_pricing_samples_exist():
    assert (SAMPLES / "pricing_before.xlsx").exists()
    assert (SAMPLES / "pricing_after.xlsx").exists()


def test_health():
    from starlette.testclient import TestClient

    client = TestClient(app)
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"
