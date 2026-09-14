# Security Policy

## Reporting

Do not place credentials, private keys, personal records, legal documents, customer media, or vulnerability details in public issues.

Report suspected exposure privately to the repository owner and rotate affected credentials immediately.

## Development rules

- Store secrets in an approved secret manager or local environment file.
- Never commit `.env` files.
- Use least-privilege service credentials.
- Require human approval for production changes.
- Run cyber-agent checks only against systems with documented authorization.
- Preserve audit records without storing unnecessary sensitive content.
