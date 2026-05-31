# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 1.x     | Yes       |

## Reporting a vulnerability

Please report security issues **privately** via [GitHub Security Advisories](https://github.com/chayprabs/xlsx-workbook-diff/security/advisories/new) on this repository, or contact the maintainer at https://www.chaitanyaprabuddha.com.

Do **not** open public issues for undisclosed vulnerabilities.

## Security practices (hosted Service)

- Uploads are processed in ephemeral per-job directories with file-size limits.
- Workbook cell contents are not intentionally written to application logs.
- Artifact download URLs expire after the configured TTL (default one hour).
- Use HTTPS in production deployments.

## Your responsibility when self-hosting

If you deploy SheetDiff yourself, you are responsible for TLS, access control, patching, backups,
and compliance with laws that apply to data you process.
