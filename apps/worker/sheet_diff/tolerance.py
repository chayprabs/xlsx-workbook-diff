from __future__ import annotations

import math
from datetime import date, datetime
from typing import Any

from sheet_diff.models import DiffOptions, TolerancePreset


def resolve_tolerance(opts: DiffOptions) -> tuple[float, float]:
    if opts.absolute_tolerance is not None or opts.relative_tolerance is not None:
        return opts.absolute_tolerance or 0.0, opts.relative_tolerance or 0.0
    if opts.tolerance_preset == TolerancePreset.NUMERICAL_NOISE:
        return 1e-6, 0.0
    if opts.tolerance_preset == TolerancePreset.CURRENCY_2DP:
        return 0.005, 0.0
    return 0.0, 0.0


def normalize_value(
    value: Any,
    opts: DiffOptions,
    abs_tol: float,
    rel_tol: float,
) -> Any:
    if value is None:
        return None
    if isinstance(value, datetime):
        if opts.normalize_dates:
            return value.date().isoformat()
        return value.isoformat()
    if isinstance(value, date):
        return value.isoformat() if opts.normalize_dates else value
    if isinstance(value, str):
        s = value.strip() if opts.trim_strings else value
        return s.casefold() if opts.case_fold_strings else s
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if opts.tolerance_preset == TolerancePreset.CURRENCY_2DP:
            return round(float(value), 2)
        return float(value)
    return value


def values_equal(
    before: Any,
    after: Any,
    opts: DiffOptions,
    abs_tol: float,
    rel_tol: float,
) -> bool:
    nb = normalize_value(before, opts, abs_tol, rel_tol)
    na = normalize_value(after, opts, abs_tol, rel_tol)
    if nb == na:
        return True
    if isinstance(nb, (int, float)) and isinstance(na, (int, float)):
        if not (math.isfinite(nb) and math.isfinite(na)):
            return nb == na
        diff = abs(nb - na)
        if diff <= abs_tol:
            return True
        denom = max(abs(nb), abs(na), 1e-15)
        if rel_tol > 0 and diff / denom <= rel_tol:
            return True
        if opts.tolerance_preset == TolerancePreset.CURRENCY_2DP:
            return round(nb, 2) == round(na, 2)
    return False
