# Product Requirements — SheetDiff

See the full PRD in repository documentation. Core requirements:

- Compare two XLSX workbooks: cells, formulas, styles, charts, structure, named ranges
- Tolerance presets: Strict, Numerical noise (1e-6), Currency (2 dp)
- Reports: color-coded diff workbook, HTML, JSON
- API: `POST /v1/diff`

Full specification was used to implement v1.0.0 of this repository.
