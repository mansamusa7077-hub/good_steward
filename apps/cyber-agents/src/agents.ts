import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { basename, extname, join, relative, resolve } from "node:path";
import type { AgentResult, Finding, ScanContext } from "./types.js";

const IGNORED = new Set([".git", "node_modules", "dist", "build", "coverage", ".cache"]);
const TEXT_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".json", ".yml", ".yaml", ".toml", ".ini", ".env", ".md", ".txt", ".sh", ".py"]);

export async function walkFiles(root: string, maxFileBytes: number): Promise<string[]> {
  const files: string[] = [];
  async function visit(dir: string): Promise<void> {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (IGNORED.has(entry.name)) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) await visit(full);
      else if (entry.isFile() && (await stat(full)).size <= maxFileBytes) files.push(full);
    }
  }
  await visit(root);
  return files;
}

export async function assetSteward(ctx: ScanContext, files: string[]): Promise<AgentResult> {
  const extensions: Record<string, number> = {};
  let bytes = 0;
  for (const file of files) {
    const s = await stat(file);
    bytes += s.size;
    const ext = extname(file).toLowerCase() || "[none]";
    extensions[ext] = (extensions[ext] ?? 0) + 1;
  }
  return { agent: "Asset Steward", findings: [], metadata: { files: files.length, bytes, extensions } };
}

export async function configurationGuardian(ctx: ScanContext, files: string[]): Promise<AgentResult> {
  const findings: Finding[] = [];
  const names = new Set(files.map((file) => basename(file)));
  for (const file of files) {
    const rel = relative(ctx.target, file);
    if (/^\.env($|\.)/.test(basename(file)) && basename(file) !== ".env.example") {
      findings.push({ agent: "Configuration Guardian", rule: "environment-file-present", severity: "high", summary: "A local environment file may contain credentials.", path: rel, remediation: "Keep it outside version control and rotate exposed values." });
    }
  }
  if (!names.has(".gitignore")) findings.push({ agent: "Configuration Guardian", rule: "missing-gitignore", severity: "medium", summary: "No .gitignore was found.", remediation: "Add ignore rules for secrets, dependencies, builds, logs, and local tooling." });
  if (!names.has("SECURITY.md")) findings.push({ agent: "Configuration Guardian", rule: "missing-security-policy", severity: "low", summary: "No SECURITY.md was found.", remediation: "Document private reporting and credential-handling procedures." });
  return { agent: "Configuration Guardian", findings };
}

const SECRET_RULES = [
  { name: "private-key", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
  { name: "github-token", regex: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/g },
  { name: "generic-secret", regex: /\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*["'][^"'\s]{12,}["']/gi }
];

export async function secretSentinel(ctx: ScanContext, files: string[]): Promise<AgentResult> {
  const findings: Finding[] = [];
  for (const file of files) {
    if (!TEXT_EXTENSIONS.has(extname(file).toLowerCase()) && !basename(file).startsWith(".env")) continue;
    const text = await readFile(file, "utf8").catch(() => "");
    for (const rule of SECRET_RULES) {
      rule.regex.lastIndex = 0;
      if (rule.regex.test(text)) findings.push({ agent: "Secret Sentinel", rule: rule.name, severity: "high", summary: "Potential secret detected; value was not collected or printed.", path: relative(ctx.target, file), remediation: "Verify privately, remove it from history, and rotate it if genuine." });
    }
  }
  return { agent: "Secret Sentinel", findings };
}

export async function dependencyWatchman(ctx: ScanContext, files: string[]): Promise<AgentResult> {
  const findings: Finding[] = [];
  const manifests = files.filter((file) => basename(file) === "package.json");
  for (const file of manifests) {
    try {
      const pkg = JSON.parse(await readFile(file, "utf8")) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
      for (const [name, range] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
        if (range === "*" || /^(latest|next)$/i.test(range)) findings.push({ agent: "Dependency Watchman", rule: "unbounded-dependency", severity: "medium", summary: `Dependency ${name} uses an unbounded version range.`, path: relative(ctx.target, file), remediation: "Pin or constrain the dependency and review updates intentionally." });
      }
    } catch {
      findings.push({ agent: "Dependency Watchman", rule: "invalid-package-json", severity: "medium", summary: "A package manifest could not be parsed.", path: relative(ctx.target, file), remediation: "Correct the JSON before installing dependencies." });
    }
  }
  if (manifests.length && !files.some((file) => /(?:package-lock\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|yarn\.lock)$/.test(file))) {
    findings.push({ agent: "Dependency Watchman", rule: "missing-lockfile", severity: "medium", summary: "JavaScript dependencies exist without a detected lockfile.", remediation: "Generate and commit the package-manager lockfile." });
  }
  return { agent: "Dependency Watchman", findings, metadata: { manifests: manifests.length, advisoryLookup: "disabled-local-only" } };
}

export async function logSteward(ctx: ScanContext, files: string[]): Promise<AgentResult> {
  const logs = files.filter((file) => extname(file).toLowerCase() === ".log");
  const findings: Finding[] = logs.map((file) => ({ agent: "Log Steward", rule: "log-file-present", severity: "low", summary: "A log file is present and may contain sensitive operational data.", path: relative(ctx.target, file), remediation: "Review retention, redact sensitive fields, and keep logs out of source control." }));
  return { agent: "Log Steward", findings, metadata: { logFiles: logs.length } };
}

export function remediationPlanner(results: AgentResult[]): AgentResult {
  const actionable = results.flatMap((result) => result.findings).filter((finding) => finding.remediation);
  const order = { high: 0, medium: 1, low: 2, info: 3 };
  actionable.sort((a, b) => order[a.severity] - order[b.severity]);
  return { agent: "Remediation Planner", findings: [], metadata: { requiresHumanApproval: true, plan: actionable.map((f, index) => ({ priority: index + 1, severity: f.severity, action: f.remediation, sourceRule: f.rule, path: f.path })) } };
}

export function scanId(ctx: ScanContext, files: string[]): string {
  return createHash("sha256").update([resolve(ctx.target), ctx.startedAt, String(files.length)].join("|")).digest("hex").slice(0, 16);
}
