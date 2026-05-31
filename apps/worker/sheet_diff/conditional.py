from __future__ import annotations

import hashlib
import zipfile
from pathlib import Path
from typing import Any

from lxml import etree


def extract_conditional_formatting(path: Path) -> dict[str, list[str]]:
    """Walk OOXML for conditional formatting rule fingerprints per sheet."""
    result: dict[str, list[str]] = {}
    try:
        with zipfile.ZipFile(path, "r") as zf:
            sheet_files = sorted(n for n in zf.namelist() if n.startswith("xl/worksheets/sheet") and n.endswith(".xml"))
            for sf in sheet_files:
                root = etree.fromstring(zf.read(sf))
                ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
                rules = []
                for cf in root.findall(".//m:conditionalFormatting", ns):
                    blob = etree.tostring(cf)
                    rules.append(hashlib.sha256(blob).hexdigest()[:16])
                if rules:
                    sheet_name = sf.split("/")[-1].replace(".xml", "")
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
