# SheetDiff (`xlsx-workbook-diff`)

Compare Excel **XLSX** workbooks online at cell, formula, style, chart, named-range and sheet-structure level — with numeric tolerance presets and downloadable color-coded diff reports.

[![CI](https://github.com/chayprabs/xlsx-workbook-diff/actions/workflows/ci.yml/badge.svg)](https://github.com/chayprabs/xlsx-workbook-diff/actions/workflows/ci.yml)

## What you can do

1. Upload or load two `.xlsx` files (drag-and-drop, file picker, URL, or built-in samples).
2. Choose a tolerance preset or open **Advanced options** (absolute/relative tolerance, string trim, case-fold, date normalization).
3. Click **Compare workbooks** and review per-sheet change counts, cell-level diffs, structure/charts/named ranges.
4. Download a color-coded diff workbook, HTML report, summary spreadsheet, or JSON for CI.

## Features (PRD coverage)

| Area | Capability |
|------|------------|
| **Cells** | Value diff with absolute + relative numeric tolerance |
| **Formulas** | String diff + dependency change hints (AST metadata) |
| **Styles** | Font, fill, border, number format, alignment, conditional formatting |
| **Charts** | Title/series/type changes via OOXML walk |
| **Structure** | Sheets added/removed/renamed/reordered, hidden rows/cols/sheets |
| **Named ranges & tables** | Added / removed / changed |
| **Reports** | Diff `.xlsx`, HTML, JSON, summary `.xlsx` |
| **Presets** | Strict, Numerical noise (1e-6), Currency (2 dp) |

## Architecture

```
apps/web/          Next.js 15 playground (proxies /api/* → worker)
apps/worker/       Python 3.12 FastAPI + openpyxl + lxml + formulas
packages/shared-types/   TypeScript DiffResult types
samples/           Golden workbook pairs
docker-compose.yml   web + worker for self-host
```

## Quick start

### Docker (recommended)

```bash
docker compose up --build
# or
docker compose -f docker-compose.single.yml up --build
```

- Web: http://localhost:3000  
- Worker health: http://localhost:8080/health  

Uploads are processed in ephemeral job directories (default TTL **1 hour**, configurable via `ARTIFACT_TTL_SECONDS`).

### Local development

**Worker:**

```bash
cd apps/worker
pip install -r requirements.txt
python3 ../../samples/generate_samples.py
uvicorn sheet_diff.main:app --reload --port 8080
```

**Web:**

```bash
pnpm install
node scripts/copy-samples.mjs
pnpm --filter @sheet-diff/shared-types build
API_PROXY_TARGET=http://localhost:8080 pnpm --filter @sheet-diff/web dev
```

## API

`POST /v1/diff` — multipart form fields:

| Field | Description |
|-------|-------------|
| `before`, `after` | XLSX files (required) |
| `tolerance_preset` | `strict`, `numerical-noise`, `currency-2dp` |
| `absolute_tolerance`, `relative_tolerance` | Optional overrides |
| `trim_strings`, `case_fold_strings`, `normalize_dates` | `true` / `false` |

Returns `result` (DiffResult JSON) and artifact URLs (`diffWorkbookUrl`, `htmlReportUrl`, `jsonReportUrl`, `summaryWorkbookUrl`).

Errors: `400_XLSX_INVALID`, `413_TOO_LARGE`.

## Tests

```bash
# Worker (22+ tests)
cd apps/worker && python3 -m pytest tests/ -v

# Web unit tests
pnpm --filter @sheet-diff/web test

# Everything
pnpm test
```

## SEO routes

These paths serve unique metadata and redirect to the home tool:

- `/excel-diff`, `/xlsx-compare`, `/spreadsheet-diff-online`, `/excel-formula-diff`, `/excel-cell-compare`

## Privacy & legal

- [Privacy Policy](https://github.com/chayprabs/xlsx-workbook-diff/blob/main/apps/web/src/app/privacy/page.tsx) (on site: `/privacy`)
- [Terms & Conditions](https://github.com/chayprabs/xlsx-workbook-diff/blob/main/apps/web/src/app/terms/page.tsx) (on site: `/terms`)
- [LEGAL.md](LEGAL.md) — index of legal documents
- Ephemeral upload storage with TTL; no intentional logging of cell contents

## License

Copyright (C) 2026 Chaitanya Prabuddha. Licensed under [GNU AGPL-3.0](LICENSE). See [NOTICE](NOTICE).

## Links

- [GitHub](https://github.com/chayprabs/xlsx-workbook-diff)
- Maintainer: [@chayprabs](https://x.com/chayprabs) · [chaitanyaprabuddha.com](https://www.chaitanyaprabuddha.com)
