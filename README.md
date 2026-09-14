# Good Steward

Good Steward is the umbrella repository for LayLow's connected projects:

- **Righteous Warrior Good Steward Academy** — educational publishing, lessons, student resources, and stewardship tools.
- **Framecraft** — AI-enhanced music, video, and cinematic production.
- **Good Steward Cyber Agents** — defensive cybersecurity assessment, monitoring, and training agents.
- **Shared Platform** — reusable identity, content, data, automation, and deployment components.

## Repository layout

```text
apps/
  academy/          Good Steward Academy application
  framecraft/       Framecraft production application
  cyber-agents/     Defensive cybersecurity agents and control plane
packages/
  shared/           Shared types, utilities, and design foundations
docs/               Architecture, governance, safety, and product documentation
```

## Project status

This repository is newly initialized. Each application begins with a scoped README so product requirements can be developed without coupling the codebases prematurely.

## Operating principles

1. Preserve private source code, credentials, prompts, and customer information.
2. Require human approval before consequential external actions.
3. Keep cybersecurity functionality defensive, authorized, logged, and auditable.
4. Separate educational information from individualized legal advice.
5. Build shared components only after at least two applications genuinely need them.

## Next milestone

Define the first deployable vertical slice for each application, then select the primary web stack and hosting environment.
