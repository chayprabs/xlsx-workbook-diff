# SheetDiff (`xlsx-workbook-diff`)

Compare Excel **XLSX** workbooks online at cell, formula, style, chart, named-range and sheet-structure level — with numeric tolerance presets and downloadable color-coded diff reports.

[![CI](https://github.com/chayprabs/xlsx-workbook-diff/actions/workflows/ci.yml/badge.svg)](https://github.com/chayprabs/xlsx-workbook-diff/actions/workflows/ci.yml)

## Features

- **Cell diff** with absolute/relative numeric tolerance, date normalization, and string trim/case-fold options
- **Formula diff** with dependency-change detection
- **Style diff** — font, fill, border, number format, alignment, conditional formatting
- **Chart & structure diff** — sheets, named ranges, hidden rows/columns, Excel tables
- **Reports** — color-coded diff workbook, HTML report, JSON for CI
- **Tolerance presets** — Strict, Numerical noise (1e-6), Currency (2 dp)

## Quick start

### Docker (recommended)

```bash
docker compose up --build
```

- Web: http://localhost:3000  
- Worker API: http://localhost:8080  

### Local development

**Worker (Python 3.12):**

```bash
cd apps/worker
pip install -r requirements.txt
python3 ../../samples/generate_samples.py
uvicorn sheet_diff.main:app --reload --port 8080
```

**Web (Node 22 + pnpm 9):**

```bash
pnpm install
pnpm --filter @sheet-diff/shared-types build
NEXT_PUBLIC_API_URL=http://localhost:8080 pnpm --filter @sheet-diff/web dev
```

## API

`POST /v1/diff` — multipart form with `before` and `after` XLSX files plus optional tolerance fields.

Returns `DiffResult` JSON and artifact URLs for diff workbook, HTML, and JSON reports.

## Samples

Sample pairs live in `samples/` (invoice, pricing, financial report with chart, numerical-noise fixture). Regenerate with:

```bash
python3 samples/generate_samples.py
```

## License

[AGPL-3.0](LICENSE) — Chaitanya Prabuddha

## Links

- [GitHub](https://github.com/chayprabs/xlsx-workbook-diff)
- [Privacy Policy](/privacy) (on deployed site)
- [Terms](/terms)
