from __future__ import annotations

import re
from typing import Any


def normalize_formula(formula: str | None) -> str:
    if not formula:
        return ""
    f = formula.strip()
    if f.startswith("="):
        f = f[1:]
    return re.sub(r"\s+", "", f.upper())


def formula_dependencies(formula: str | None) -> set[str]:
    if not formula:
        return set()
    refs = re.findall(
        r"(?:'[^']+'|[A-Za-z_][\w.]*)!?\$?[A-Z]{1,3}\$?\d{1,7}(?::\$?[A-Z]{1,3}\$?\d{1,7})?",
        formula,
        re.IGNORECASE,
    )
    return {r.upper().replace("$", "") for r in refs}


def formula_ast_diff(before: str | None, after: str | None) -> dict[str, Any]:
    b_norm = normalize_formula(before)
    a_norm = normalize_formula(after)
    b_deps = formula_dependencies(before)
    a_deps = formula_dependencies(after)
    added_deps = sorted(a_deps - b_deps)
    removed_deps = sorted(b_deps - a_deps)
    try:
        import formulas  # noqa: F401

        ast_changed = b_norm != a_norm
    except ImportError:
        ast_changed = b_norm != a_norm
    return {
        "stringChanged": b_norm != a_norm,
        "astChanged": ast_changed,
        "dependenciesAdded": added_deps,
        "dependenciesRemoved": removed_deps,
        "before": before,
        "after": after,
    }


def classify_formula_change(
    before_formula: str | None,
    after_formula: str | None,
    before_value: Any,
    after_value: Any,
    value_equal: bool,
) -> str | None:
    b_has = bool(before_formula and str(before_formula).startswith("="))
    a_has = bool(after_formula and str(after_formula).startswith("="))
    if not b_has and not a_has:
        return None
    f_changed = normalize_formula(before_formula) != normalize_formula(after_formula)
    if f_changed:
        if value_equal:
            return "formula"
        return "value+formula"
    if not value_equal and (b_has or a_has):
        return "value"
    return None
