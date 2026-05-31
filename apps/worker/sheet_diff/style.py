from __future__ import annotations

from typing import Any

from openpyxl.styles import Alignment, Border, Font, PatternFill


def _color(c: Any) -> str | None:
    if c is None:
        return None
    if hasattr(c, "rgb") and c.rgb:
        return str(c.rgb)
    return str(c)


def font_dict(f: Font | None) -> dict[str, Any]:
    if f is None:
        return {}
    return {
        "name": f.name,
        "size": f.size,
        "bold": f.bold,
        "italic": f.italic,
        "color": _color(f.color),
    }


def fill_dict(f: PatternFill | None) -> dict[str, Any]:
    if f is None:
        return {}
    return {
        "patternType": f.patternType,
        "fgColor": _color(f.fgColor),
        "bgColor": _color(f.bgColor),
    }


def border_dict(b: Border | None) -> dict[str, Any]:
    if b is None:
        return {}
    sides = {}
    for side in ("left", "right", "top", "bottom", "diagonal"):
        edge = getattr(b, side, None)
        if edge:
            sides[side] = {"style": edge.style, "color": _color(edge.color)}
    return sides


def alignment_dict(a: Alignment | None) -> dict[str, Any]:
    if a is None:
        return {}
    return {
        "horizontal": a.horizontal,
        "vertical": a.vertical,
        "wrapText": a.wrap_text,
        "indent": a.indent,
    }


def style_snapshot(cell) -> dict[str, Any]:
    return {
        "font": font_dict(cell.font),
        "fill": fill_dict(cell.fill),
        "border": border_dict(cell.border),
        "numberFormat": cell.number_format,
        "alignment": alignment_dict(cell.alignment),
    }


def style_diff(before: dict[str, Any], after: dict[str, Any]) -> dict[str, Any] | None:
    diff: dict[str, Any] = {}
    for key in before.keys() | after.keys():
        bv, av = before.get(key), after.get(key)
        if bv != av:
            diff[key] = {"before": bv, "after": av}
    return diff if diff else None
