# Release Qualification — SheetDiff

Run before each release:

```bash
pnpm install
node scripts/copy-samples.mjs
cd apps/worker && pip install -r requirements.txt && python3 -m pytest tests/ -v
pnpm --filter @sheet-diff/web typecheck
pnpm --filter @sheet-diff/web test
pnpm --filter @sheet-diff/web build
docker compose config   # when Docker available
docker compose up --build   # smoke test
```

## Section 15 status (code-complete on repo)

- F1–F8: Implemented in worker + exposed in web UI
- Reports: diff workbook, HTML, JSON, summary xlsx
- SEO sub-routes, privacy/terms, AGPL license
- CI: worker pytest, web build, CodeQL, dependabot
- Privacy: no cell logging, artifact TTL purge

**Deferred without hosted deploy:** Lighthouse ≥95, p95 10MB benchmark, production URLs 200.

Verdict: **CODE QUALIFIED** — rerun Docker/hosted checks on deploy target.
