import type { EntityId } from "./entity.js";
import type { RunId } from "./ids.js";

export type RuntimeRunStatus =
  | "queued"
  | "running"
  | "waiting_approval"
  | "succeeded"
  | "failed"
  | "cancelled";

export interface RuntimeCheckpoint {
  readonly step: string;
  readonly status: "completed" | "failed";
  readonly recordedAt: string;
  readonly summary: string;
}

export interface RuntimeRun {
  readonly id: RunId;
  readonly agentId: EntityId;
  readonly goal: string;
  readonly status: RuntimeRunStatus;
  readonly currentStep?: string;
  readonly checkpoints: readonly RuntimeCheckpoint[];
  readonly startedAt: string;
  readonly updatedAt: string;
  readonly completedAt?: string;
}

export function createRuntimeRun(input: RuntimeRun): RuntimeRun {
  if (input.goal.trim().length === 0) throw new Error("Runtime run goal must not be empty.");
  if (!Number.isFinite(Date.parse(input.startedAt)) || !Number.isFinite(Date.parse(input.updatedAt))) {
    throw new Error("Runtime run timestamps must be valid.");
  }
  if (Date.parse(input.updatedAt) < Date.parse(input.startedAt)) {
    throw new Error("Runtime run updatedAt cannot be earlier than startedAt.");
  }
  const terminal = ["succeeded", "failed", "cancelled"].includes(input.status);
  if (terminal && input.completedAt === undefined) {
    throw new Error("Terminal runtime runs require completedAt.");
  }
  if (input.completedAt !== undefined && !Number.isFinite(Date.parse(input.completedAt))) {
    throw new Error("Runtime run completedAt must be valid.");
  }
  if (input.completedAt !== undefined && Date.parse(input.completedAt) < Date.parse(input.startedAt)) {
    throw new Error("Runtime run completedAt cannot be earlier than startedAt.");
  }
  return Object.freeze({
    ...input,
    checkpoints: Object.freeze(input.checkpoints.map((checkpoint) => Object.freeze({ ...checkpoint }))),
  });
}
