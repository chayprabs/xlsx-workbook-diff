from __future__ import annotations

import json
import logging
import os
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from sheet_diff.engine import compare_workbooks
from sheet_diff.models import DiffArtifacts, DiffOptions, DiffResponse, TolerancePreset
from sheet_diff.reports import write_diff_workbook, write_html_report, write_json_report, write_summary_xlsx
from sheet_diff.storage import MAX_FILE_BYTES, cleanup_job, new_job_dir

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sheet-diff")
# Never log sheet contents
logger.addFilter(lambda r: "cell" not in r.getMessage().lower() or "health" in r.getMessage().lower())

app = FastAPI(title="SheetDiff Worker", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "sheet-diff-worker"}


async def _save_upload(upload: UploadFile, dest: Path) -> None:
    size = 0
    with dest.open("wb") as f:
        while chunk := await upload.read(1024 * 64):
            size += len(chunk)
            if size > MAX_FILE_BYTES:
                raise HTTPException(status_code=413, detail="413_TOO_LARGE")
            f.write(chunk)


def _validate_xlsx(path: Path) -> None:
    if path.suffix.lower() != ".xlsx":
        raise HTTPException(status_code=400, detail="400_XLSX_INVALID")
    try:
        import zipfile

        with zipfile.ZipFile(path) as zf:
            if "[Content_Types].xml" not in zf.namelist():
                raise ValueError("not xlsx")
    except Exception as exc:
        raise HTTPException(status_code=400, detail="400_XLSX_INVALID") from exc


@app.post("/v1/diff")
async def diff_endpoint(
    before: UploadFile = File(...),
    after: UploadFile = File(...),
    tolerance_preset: str = Form("strict"),
    absolute_tolerance: float | None = Form(None),
    relative_tolerance: float | None = Form(None),
    trim_strings: bool = Form(True),
    case_fold_strings: bool = Form(False),
    normalize_dates: bool = Form(True),
):
    job_dir = new_job_dir()
    try:
        before_path = job_dir / "before.xlsx"
        after_path = job_dir / "after.xlsx"
        await _save_upload(before, before_path)
        await _save_upload(after, after_path)
        _validate_xlsx(before_path)
        _validate_xlsx(after_path)

        try:
            preset = TolerancePreset(tolerance_preset)
        except ValueError:
            preset = TolerancePreset.STRICT

        opts = DiffOptions(
            tolerance_preset=preset,
            absolute_tolerance=absolute_tolerance,
            relative_tolerance=relative_tolerance,
            trim_strings=trim_strings,
            case_fold_strings=case_fold_strings,
            normalize_dates=normalize_dates,
        )
        try:
            result = compare_workbooks(before_path, after_path, opts)
        except Exception as exc:
            if "400_XLSX_INVALID" in str(exc):
                raise
            from openpyxl.utils.exceptions import InvalidFileException

            if isinstance(exc, (InvalidFileException, ValueError, KeyError)):
                raise HTTPException(status_code=400, detail="400_XLSX_INVALID") from exc
            raise

        diff_wb = job_dir / "diff.xlsx"
        html_path = job_dir / "report.html"
        json_path = job_dir / "report.json"
        write_diff_workbook(result, before_path, after_path, diff_wb)
        write_html_report(result, html_path)
        write_json_report(result, json_path)
        write_summary_xlsx(result, job_dir / "summary.xlsx")

        job_id = job_dir.name
        base = os.environ.get("PUBLIC_WORKER_URL", "http://localhost:8080")
        artifacts = DiffArtifacts(
            diff_workbook_path=str(diff_wb),
            html_report_path=str(html_path),
            json_report_path=str(json_path),
        )
        payload = DiffResponse(result=result, artifacts=artifacts)
        data = json.loads(payload.model_dump_json())
        data["artifacts"]["diffWorkbookUrl"] = f"{base}/v1/artifacts/{job_id}/diff.xlsx"
        data["artifacts"]["htmlReportUrl"] = f"{base}/v1/artifacts/{job_id}/report.html"
        data["artifacts"]["jsonReportUrl"] = f"{base}/v1/artifacts/{job_id}/report.json"
        data["jobId"] = job_id
        return JSONResponse(content=data)
    except HTTPException:
        cleanup_job(job_dir)
        raise
    except Exception as exc:
        cleanup_job(job_dir)
        logger.exception("diff failed")
        raise HTTPException(status_code=500, detail="diff_failed") from exc


@app.get("/v1/artifacts/{job_id}/{filename}")
def get_artifact(job_id: str, filename: str):
    safe = Path(filename).name
    path = Path("/tmp/sheet-diff-jobs") / job_id / safe
    if not path.exists():
        raise HTTPException(status_code=404, detail="not_found")
    media = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    if safe.endswith(".html"):
        media = "text/html"
    elif safe.endswith(".json"):
        media = "application/json"
    return FileResponse(path, media_type=media, filename=safe)
