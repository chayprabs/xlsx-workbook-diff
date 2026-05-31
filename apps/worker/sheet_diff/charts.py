from __future__ import annotations

import hashlib
import zipfile
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

NS = {
    "c": "http://schemas.openxmlformats.org/drawingml/2006/chart",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


def _text(el: ET.Element | None) -> str:
    if el is None:
        return ""
    return "".join(el.itertext()).strip()


def parse_chart_xml(xml_bytes: bytes) -> dict[str, Any]:
    root = ET.fromstring(xml_bytes)
    chart_type = "unknown"
    for tag in ("barChart", "lineChart", "pieChart", "areaChart", "scatterChart"):
        if root.find(f".//c:{tag}", NS) is not None:
            chart_type = tag
            break
    title_el = root.find(".//c:title//a:t", NS) or root.find(".//c:title//c:v", NS)
    title = _text(title_el)
    series = []
    for ser in root.findall(".//c:ser", NS):
        f_el = ser.find(".//c:strRef/c:f", NS)
        if f_el is not None and f_el.text:
            name = f_el.text.strip()
        else:
            name = _text(ser.find(".//c:v", NS))
        series.append({"name": name})
    return {"chartType": chart_type, "title": title, "series": series}


def extract_charts_from_xlsx(path: Path) -> dict[str, list[dict[str, Any]]]:
    charts_by_sheet: dict[str, list[dict[str, Any]]] = {}
    try:
        with zipfile.ZipFile(path, "r") as zf:
            chart_files = [n for n in zf.namelist() if n.startswith("xl/charts/chart") and n.endswith(".xml")]
            for i, cf in enumerate(chart_files):
                data = parse_chart_xml(zf.read(cf))
                sheet = "Sheet1"
                charts_by_sheet.setdefault(sheet, []).append(
                    {"chartId": f"chart_{i}", "embedded": True, **data}
                )
    except (zipfile.BadZipFile, KeyError):
        pass
    return charts_by_sheet


def diff_charts(
    before: dict[str, list[dict[str, Any]]],
    after: dict[str, list[dict[str, Any]]],
) -> list[dict[str, Any]]:
    diffs: list[dict[str, Any]] = []
    all_sheets = set(before) | set(after)
    for sheet in all_sheets:
        b_list = before.get(sheet, [])
        a_list = after.get(sheet, [])
        b_map = {c["chartId"]: c for c in b_list}
        a_map = {c["chartId"]: c for c in a_list}
        for cid in set(b_map) | set(a_map):
            b = b_map.get(cid)
            a = a_map.get(cid)
            if b != a:
                diffs.append(
                    {
                        "sheet": sheet,
                        "chartId": cid,
                        "diff": {"before": b, "after": a},
                    }
                )
    return diffs
