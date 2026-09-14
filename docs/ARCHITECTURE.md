# Initial Architecture

This repository is organized as a monorepo with independent applications and deliberately small shared packages.

## Boundaries

| Area | Owns | Must not own |
|---|---|---|
| Academy | Courses, lessons, students, publications | Framecraft render internals |
| Framecraft | Creative projects, scenes, media workflow, exports | Academy enrollment rules |
| Cyber Agents | Authorized defensive checks, findings, approvals, audit events | Offensive or unsupervised actions |
| Shared | Stable interfaces used by multiple applications | Premature application logic |

## Cross-cutting requirements

- Role-based access
- Encrypted secret storage outside Git
- Structured audit logging
- Explicit human approval gates
- Privacy-conscious media and student-data handling
- Separate development, test, and production environments

## Decision still required

Choose the implementation stack and hosting platform before application scaffolding. A practical default is TypeScript, a modern React framework, PostgreSQL, background jobs, object storage, and isolated worker processes for rendering and authorized security checks.
