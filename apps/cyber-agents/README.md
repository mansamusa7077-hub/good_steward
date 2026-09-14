# Good Steward Cyber Agents

Human-supervised defensive cybersecurity agents for authorized systems only.

## Initial agents

- **Asset Steward** — inventories approved systems and ownership.
- **Configuration Guardian** — checks defensive configuration baselines.
- **Dependency Watchman** — identifies vulnerable or outdated dependencies.
- **Secret Sentinel** — detects accidentally committed secrets without exposing them.
- **Log Steward** — summarizes authorized security events.
- **Remediation Planner** — proposes prioritized fixes for human approval.
- **Evidence Ledger** — records checks, findings, approvals, and outcomes.

## Safety boundaries

- Defensive and authorized use only
- No credential theft, persistence, destructive testing, or unauthorized access
- No autonomous remediation in production
- Human approval before external actions or material changes
- Minimize sensitive-data collection and redact findings by default
