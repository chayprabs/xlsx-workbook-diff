# Implementation Handoff — SheetDiff

Standalone open-source tool: **xlsx-workbook-diff** (SheetDiff).

- **Pattern:** Server-side (Next.js web + Python worker)
- **License:** AGPL-3.0
- **Local run:** `docker compose up --build` or see README

## Stack

- Web: Next.js 15, Tailwind 4, runtime API proxy at `app/api/[...path]/route.ts`
- Worker: Python 3.12, FastAPI, openpyxl, lxml, formulas
- Monorepo: pnpm workspaces + `packages/shared-types`

## Key env vars

| Variable | Service | Purpose |
|----------|---------|---------|
| `API_PROXY_TARGET` | web | Worker URL for runtime proxy (e.g. `http://worker:8080`) |
| `PUBLIC_WORKER_URL` | worker | Base URL embedded in artifact links |
| `ARTIFACT_TTL_SECONDS` | worker | Ephemeral job retention (default 3600) |
| `CORS_ORIGINS` | worker | Allowed browser origins |

## Verification

See `RELEASE_QUALIFICATION_CHECKLIST.md` and run `pnpm test`.
