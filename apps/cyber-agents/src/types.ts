export type Severity = "info" | "low" | "medium" | "high";

export interface Finding {
  agent: string;
  rule: string;
  severity: Severity;
  summary: string;
  path?: string;
  remediation?: string;
}

export interface ScanContext {
  target: string;
  startedAt: string;
  maxFileBytes: number;
}

export interface AgentResult {
  agent: string;
  findings: Finding[];
  metadata?: Record<string, unknown>;
}

export interface EvidenceLedger {
  schemaVersion: "1.0";
  scanId: string;
  target: string;
  startedAt: string;
  completedAt: string;
  mode: "local-read-only";
  approvedExternalActions: false;
  results: AgentResult[];
  summary: Record<Severity, number>;
}
