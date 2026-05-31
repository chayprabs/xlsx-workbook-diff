from __future__ import annotations

import zipfile
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

NS = {
    "c": "http://schemas.openxmlformats.org/drawingml/2006/chart",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
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
    title_el = root.find(".//c:title//a:t", NS)
    if title_el is None:
        title_el = root.find(".//c:title//c:v", NS)
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


def _package_path(target: str) -> str:
    """Normalize OOXML relationship Target to zip path (e.g. xl/charts/chart1.xml)."""
    t = target.strip().lstrip("/")
    if not t.startswith("xl/"):
        t = f"xl/{t}"
    return t


def _chart_file_to_sheet(zf: zipfile.ZipFile) -> dict[str, str]:
    """Map chart XML path (e.g. xl/charts/chart1.xml) to worksheet name."""
    chart_to_sheet: dict[str, str] = {}
    sheet_id_to_name: dict[str, str] = {}
    try:
        wb = ET.fromstring(zf.read("xl/workbook.xml"))
        for sheet in wb.findall(".//main:sheet", NS):
            name = sheet.get("name")
            rid = sheet.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
            if name and rid:
                sheet_id_to_name[rid] = name
    except KeyError:
        return chart_to_sheet

    try:
        wb_rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
        rid_to_worksheet: dict[str, str] = {}
        for rel in wb_rels.findall("rel:Relationship", NS):
            rid = rel.get("Id")
            target = rel.get("Target", "")
            if rid and "worksheets/" in target:
                rid_to_worksheet[rid] = _package_path(target)
    except KeyError:
        return chart_to_sheet

    for sheet_rid, sheet_path in rid_to_worksheet.items():
        sheet_name = sheet_id_to_name.get(sheet_rid, "Sheet1")
        sheet_file = sheet_path.rsplit("/", 1)[-1]
        rel_path = f"xl/worksheets/_rels/{sheet_file}.rels"
        if rel_path not in zf.namelist():
            continue
        try:
            srels = ET.fromstring(zf.read(rel_path))
        except KeyError:
            continue
        drawing_target = None
        for rel in srels.findall("rel:Relationship", NS):
            if "drawing" in rel.get("Type", ""):
                drawing_target = rel.get("Target", "")
                break
        if not drawing_target:
            continue
        draw_path = _package_path(drawing_target)
        draw_file = draw_path.rsplit("/", 1)[-1]
        draw_rel_path = f"xl/drawings/_rels/{draw_file}.rels"
        if draw_rel_path not in zf.namelist():
            continue
        try:
            drels = ET.fromstring(zf.read(draw_rel_path))
        except KeyError:
            continue
        for rel in drels.findall("rel:Relationship", NS):
            if "chart" in rel.get("Type", ""):
                chart_path = _package_path(rel.get("Target", ""))
                chart_to_sheet[chart_path] = sheet_name
    return chart_to_sheet


def extract_charts_from_xlsx(path: Path) -> dict[str, list[dict[str, Any]]]:
    charts_by_sheet: dict[str, list[dict[str, Any]]] = {}
    try:
        with zipfile.ZipFile(path, "r") as zf:
            chart_to_sheet = _chart_file_to_sheet(zf)
            chart_files = sorted(
                n for n in zf.namelist() if n.startswith("xl/charts/chart") and n.endswith(".xml")
            )
            for i, cf in enumerate(chart_files):
                data = parse_chart_xml(zf.read(cf))
                sheet = chart_to_sheet.get(cf, "Sheet1")
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
