from __future__ import annotations

import hashlib
import zipfile
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

NS = {
    "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
}


def _worksheet_file_to_name(zf: zipfile.ZipFile) -> dict[str, str]:
    """Map worksheet file stem (e.g. sheet1) to workbook sheet name (e.g. Report)."""
    file_to_name: dict[str, str] = {}
    sheet_id_to_name: dict[str, str] = {}
    try:
        wb = ET.fromstring(zf.read("xl/workbook.xml"))
        for sheet in wb.findall(".//main:sheet", NS):
            name = sheet.get("name")
            rid = sheet.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
            if name and rid:
                sheet_id_to_name[rid] = name
        wb_rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
        for rel in wb_rels.findall("rel:Relationship", NS):
            target = rel.get("Target", "")
            if "worksheets/" not in target:
                continue
            rid = rel.get("Id")
            stem = target.rstrip("/").split("/")[-1].replace(".xml", "")
            file_to_name[stem] = sheet_id_to_name.get(rid, stem)
    except KeyError:
        pass
    return file_to_name


def extract_conditional_formatting(path: Path) -> dict[str, list[str]]:
    """Walk OOXML for conditional formatting rule fingerprints per sheet name."""
    result: dict[str, list[str]] = {}
    try:
        with zipfile.ZipFile(path, "r") as zf:
            name_map = _worksheet_file_to_name(zf)
            sheet_files = sorted(
                n for n in zf.namelist() if n.startswith("xl/worksheets/sheet") and n.endswith(".xml")
            )
            for sf in sheet_files:
                from lxml import etree

                root = etree.fromstring(zf.read(sf))
                ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
                rules = []
                for cf in root.findall(".//m:conditionalFormatting", ns):
                    blob = etree.tostring(cf)
                    rules.append(hashlib.sha256(blob).hexdigest()[:16])
                if rules:
                    stem = sf.split("/")[-1].replace(".xml", "")
                    sheet_name = name_map.get(stem, stem)
                    result[sheet_name] = rules
    except Exception:
        pass
    return result


def diff_conditional(before: dict[str, list[str]], after: dict[str, list[str]]) -> list[dict[str, Any]]:
    changes = []
    for sheet in set(before) | set(after):
        b, a = before.get(sheet, []), after.get(sheet, [])
        if b != a:
            changes.append(
                {
                    "sheet": sheet,
                    "cell": "",
                    "kind": "style",
                    "before": {"conditionalFormatting": b},
                    "after": {"conditionalFormatting": a},
                }
            )
    return changes
