from __future__ import annotations

import shutil
import uuid
from pathlib import Path

JOBS_DIR = Path("/tmp/sheet-diff-jobs")
ARTIFACT_TTL_SECONDS = 3600
MAX_FILE_BYTES = 25 * 1024 * 1024


def ensure_jobs_dir() -> Path:
    JOBS_DIR.mkdir(parents=True, exist_ok=True)
    return JOBS_DIR


def new_job_dir() -> Path:
    job_id = str(uuid.uuid4())
    path = ensure_jobs_dir() / job_id
    path.mkdir(parents=True, exist_ok=True)
    return path


def cleanup_job(path: Path) -> None:
    if path.exists() and path.is_dir():
        shutil.rmtree(path, ignore_errors=True)
