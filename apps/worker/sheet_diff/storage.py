from __future__ import annotations

import shutil
import time
import uuid
from pathlib import Path

JOBS_DIR = Path("/tmp/sheet-diff-jobs")
ARTIFACT_TTL_SECONDS = int(__import__("os").environ.get("ARTIFACT_TTL_SECONDS", "3600"))
MAX_FILE_BYTES = 25 * 1024 * 1024


def ensure_jobs_dir() -> Path:
    JOBS_DIR.mkdir(parents=True, exist_ok=True)
    return JOBS_DIR


def new_job_dir() -> Path:
    ensure_jobs_dir()
    purge_expired_jobs()
    job_id = str(uuid.uuid4())
    path = JOBS_DIR / job_id
    path.mkdir(parents=True, exist_ok=True)
    return path


def cleanup_job(path: Path) -> None:
    if path.exists() and path.is_dir():
        shutil.rmtree(path, ignore_errors=True)


def purge_expired_jobs() -> int:
    """Remove job directories older than ARTIFACT_TTL_SECONDS."""
    if not JOBS_DIR.exists():
        return 0
    cutoff = time.time() - ARTIFACT_TTL_SECONDS
    removed = 0
    for child in JOBS_DIR.iterdir():
        if not child.is_dir():
            continue
        try:
            if child.stat().st_mtime < cutoff:
                shutil.rmtree(child, ignore_errors=True)
                removed += 1
        except OSError:
            pass
    return removed
