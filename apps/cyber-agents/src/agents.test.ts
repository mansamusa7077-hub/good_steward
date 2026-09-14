import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { configurationGuardian, secretSentinel, walkFiles } from "./agents.js";

test("Secret Sentinel reports without copying the secret", async () => {
  const root = await mkdtemp(join(tmpdir(), "good-steward-"));
  const secret = "ghp_abcdefghijklmnopqrstuvwxyz123456";
  await writeFile(join(root, "config.ts"), `export const token = "${secret}";`);
  const files = await walkFiles(root, 1_000_000);
  const result = await secretSentinel({ target: root, startedAt: new Date().toISOString(), maxFileBytes: 1_000_000 }, files);
  assert(result.findings.length >= 1);
  assert.equal(JSON.stringify(result).includes(secret), false);
});

test("Configuration Guardian identifies environment files", async () => {
  const root = await mkdtemp(join(tmpdir(), "good-steward-"));
  await mkdir(join(root, "src"));
  await writeFile(join(root, ".env"), "PASSWORD=not-a-real-password");
  const files = await walkFiles(root, 1_000_000);
  const result = await configurationGuardian({ target: root, startedAt: new Date().toISOString(), maxFileBytes: 1_000_000 }, files);
  assert(result.findings.some((finding) => finding.rule === "environment-file-present"));
});
