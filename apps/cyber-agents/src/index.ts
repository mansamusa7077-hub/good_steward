#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { assetSteward, configurationGuardian, dependencyWatchman, logSteward, remediationPlanner, scanId, secretSentinel, walkFiles } from "./agents.js";
import type { EvidenceLedger, ScanContext, Severity } from "./types.js";

function argument(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main(): Promise<void> {
  const target = resolve(argument("--target") ?? process.cwd());
  const output = resolve(argument("--output") ?? ".good-steward/evidence-ledger.json");
  const context: ScanContext = { target, startedAt: new Date().toISOString(), maxFileBytes: 1_000_000 };
  const files = await walkFiles(target, context.maxFileBytes);

  const core = await Promise.all([
    assetSteward(context, files),
    configurationGuardian(context, files),
    dependencyWatchman(context, files),
    secretSentinel(context, files),
    logSteward(context, files)
  ]);
  const results = [...core, remediationPlanner(core)];
  const summary: Record<Severity, number> = { info: 0, low: 0, medium: 0, high: 0 };
  for (const finding of results.flatMap((result) => result.findings)) summary[finding.severity]++;

  const ledger: EvidenceLedger = {
    schemaVersion: "1.0",
    scanId: scanId(context, files),
    target,
    startedAt: context.startedAt,
    completedAt: new Date().toISOString(),
    mode: "local-read-only",
    approvedExternalActions: false,
    results: [...results, { agent: "Evidence Ledger", findings: [], metadata: { output, redaction: "secret-values-never-recorded" } }],
    summary
  };

  await mkdir(resolve(output, ".."), { recursive: true });
  await writeFile(output, JSON.stringify(ledger, null, 2) + "\n", { mode: 0o600 });
  console.log(JSON.stringify({ scanId: ledger.scanId, target, output, summary }, null, 2));
  if (summary.high > 0) process.exitCode = 2;
  else if (summary.medium > 0) process.exitCode = 1;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Good Steward scan failed: ${message}`);
  process.exitCode = 3;
});
