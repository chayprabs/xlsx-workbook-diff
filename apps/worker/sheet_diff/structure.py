from __future__ import annotations

from difflib import SequenceMatcher
from typing import Any

from openpyxl import Workbook
from openpyxl.workbook.defined_name import DefinedName


def sheet_structure(wb: Workbook) -> dict[str, Any]:
    names = wb.sheetnames
    hidden_sheets = []
    for name in names:
        ws = wb[name]
        if getattr(ws, "sheet_state", None) == "hidden":
            hidden_sheets.append(name)
    return {"order": names, "hidden": hidden_sheets}


def diff_sheet_structure(before: dict[str, Any], after: dict[str, Any]) -> dict[str, Any]:
    b_order = before["order"]
    a_order = after["order"]
    b_set, a_set = set(b_order), set(a_order)
    added = sorted(a_set - b_set)
    removed = sorted(b_set - a_set)
    common_b = [s for s in b_order if s in a_set and s in b_set]
    common_a = [s for s in a_order if s in a_set and s in b_set]
    renamed = []
    if len(common_b) == len(common_a) and common_b != common_a:
        matcher = SequenceMatcher(None, common_b, common_a)
        for tag, i1, i2, j1, j2 in matcher.get_opcodes():
            if tag == "replace" and (i2 - i1) == (j2 - j1) == 1:
                renamed.append({"from": common_b[i1], "to": common_a[j1]})
    reordered = common_b == common_a and b_order != a_order and not added and not removed
    return {
        "added": added,
        "removed": removed,
        "renamed": renamed,
        "reordered": reordered,
    }


def diff_named_ranges(wb_before: Workbook, wb_after: Workbook) -> dict[str, Any]:
    def collect(wb: Workbook) -> dict[str, str]:
        out: dict[str, str] = {}
        for name, dn in wb.defined_names.items():
            if isinstance(dn, DefinedName):
                out[name] = str(dn.attr_text or getattr(dn, "value", "") or "")
            else:
                out[name] = str(dn)
        return out

    b = collect(wb_before)
    a = collect(wb_after)
    added = sorted(set(a) - set(b))
    removed = sorted(set(b) - set(a))
    changed = []
    for name in set(b) & set(a):
        if b[name] != a[name]:
            changed.append({"name": name, "before": b[name], "after": a[name]})
    return {"added": added, "removed": removed, "changed": changed}


def diff_hidden(before: Workbook, after: Workbook) -> dict[str, Any]:
    rows_b: dict[str, list[int]] = {}
    cols_b: dict[str, list[str]] = {}
    rows_a: dict[str, list[int]] = {}
    cols_a: dict[str, list[str]] = {}

    def scan(wb: Workbook, rows_acc, cols_acc):
        for name in wb.sheetnames:
            ws = wb[name]
            hr = [r for r, dim in ws.row_dimensions.items() if dim.hidden]
            hc = [c for c, dim in ws.column_dimensions.items() if dim.hidden]
            if hr:
                rows_acc[name] = hr
            if hc:
                cols_acc[name] = hc

    scan(before, rows_b, cols_b)
    scan(after, rows_a, cols_a)
    b_hidden = sheet_structure(before)["hidden"]
    a_hidden = sheet_structure(after)["hidden"]
    return {
        "rows": {k: v for k, v in rows_a.items() if rows_a.get(k) != rows_b.get(k)},
        "cols": {k: v for k, v in cols_a.items() if cols_a.get(k) != cols_b.get(k)},
        "sheets": {
            "added": sorted(set(a_hidden) - set(b_hidden)),
            "removed": sorted(set(b_hidden) - set(a_hidden)),
        },
    }


def diff_tables(path_before, path_after) -> dict[str, Any]:
    from lxml import etree
    import zipfile

    def table_names(path) -> set[str]:
        names: set[str] = set()
        try:
            with zipfile.ZipFile(path, "r") as zf:
                for n in zf.namelist():
                    if "/tables/table" in n and n.endswith(".xml"):
                        root = etree.fromstring(zf.read(n))
                        t = root.get("name") or root.get("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}name")
                        if t:
                            names.add(t)
        except Exception:
            pass
        return names

    b, a = table_names(path_before), table_names(path_after)
    added = sorted(a - b)
    removed = sorted(b - a)
    return {"added": added, "removed": removed, "changed": []}
