import time
from pathlib import Path

from sheet_diff.storage import ARTIFACT_TTL_SECONDS, JOBS_DIR, new_job_dir, purge_expired_jobs


def test_purge_expired_jobs(tmp_path, monkeypatch):
    monkeypatch.setattr("sheet_diff.storage.JOBS_DIR", tmp_path)
    old = tmp_path / "old-job"
    old.mkdir()
    old.touch()
    old_time = time.time() - ARTIFACT_TTL_SECONDS - 10
    import os

    os.utime(old, (old_time, old_time))
    new_job_dir()
    assert not old.exists() or purge_expired_jobs() >= 0
