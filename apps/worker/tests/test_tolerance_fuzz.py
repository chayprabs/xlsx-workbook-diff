"""Fuzz numeric tolerance boundaries."""
from __future__ import annotations

import random

import pytest

from sheet_diff.tolerance import DiffOptions, TolerancePreset, values_equal


@pytest.mark.parametrize("seed", range(20))
def test_numerical_noise_fuzz(seed: int):
    rng = random.Random(seed)
    opts = DiffOptions(tolerance_preset=TolerancePreset.NUMERICAL_NOISE)
    abs_tol, rel_tol = 1e-6, 0.0
    for _ in range(50):
        a = rng.uniform(-1e6, 1e6)
        delta = rng.uniform(0, 2e-6)
        b = a + delta
        if delta <= 1e-6:
            assert values_equal(a, b, opts, abs_tol, rel_tol)
        elif delta > 1e-5:
            assert not values_equal(a, b, opts, abs_tol, rel_tol)


def test_relative_tolerance():
    opts = DiffOptions(absolute_tolerance=0.0, relative_tolerance=0.01)
    assert values_equal(100.0, 100.5, opts, 0.0, 0.01)
    assert not values_equal(100.0, 102.0, opts, 0.0, 0.01)
