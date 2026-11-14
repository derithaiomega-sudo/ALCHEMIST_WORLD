import type { EntityId, EventId } from "./entity.js";
import type { MemoryId } from "./ids.js";

export type MemoryKind = "episodic" | "semantic" | "procedural";
export type MemoryScope = "world" | "project" | "agent";
export type MemoryStatus = "active" | "superseded" | "archived";

export interface MemoryRecord<TData extends Record<string, unknown> = Record<string, unknown>> {
  readonly id: MemoryId;
  readonly kind: MemoryKind;
  readonly scope: MemoryScope;
  readonly scopeOwnerId?: EntityId;
  readonly subjectId?: EntityId;
  readonly summary: string;
  readonly content: string;
  readonly sourceEventIds: readonly EventId[];
  readonly confidence: number;
  readonly status: MemoryStatus;
  readonly data: Readonly<TData>;
  readonly occurredAt: string;
  readonly recordedAt: string;
}

export type NewMemoryRecord<TData extends Record<string, unknown> = Record<string, unknown>> =
  Omit<MemoryRecord<TData>, "recordedAt" | "status" | "data" | "sourceEventIds"> & {
    readonly recordedAt?: string;
    readonly status?: MemoryStatus;
    readonly data?: TData;
    readonly sourceEventIds?: readonly EventId[];
  };

function assertText(value: string, label: string): void {
  if (value.trim().length === 0) throw new Error(`${label} must not be empty.`);
}

function assertTimestamp(value: string, label: string): void {
  if (!Number.isFinite(Date.parse(value)) || !/^\d{4}-\d{2}-\d{2}T/.test(value)) {
    throw new Error(`${label} must be a valid ISO-8601 timestamp.`);
  }
}

export function createMemoryRecord<TData extends Record<string, unknown>>(
  input: NewMemoryRecord<TData>,
  now = new Date().toISOString(),
): MemoryRecord<TData> {
  assertText(input.summary, "Memory summary");
  assertText(input.content, "Memory content");
  assertTimestamp(input.occurredAt, "Memory occurredAt");
  assertTimestamp(now, "Current timestamp");
  if (input.scope === "world" && input.scopeOwnerId !== undefined) {
    throw new Error("World-scoped memory must not have a scope owner.");
  }
  if (input.scope !== "world" && input.scopeOwnerId === undefined) {
    throw new Error("Project- and agent-scoped memory require a scope owner.");
  }
  if (!Number.isFinite(input.confidence) || input.confidence < 0 || input.confidence > 1) {
    throw new Error("Memory confidence must be between 0 and 1.");
  }
  return Object.freeze({
    ...input,
    sourceEventIds: Object.freeze([...(input.sourceEventIds ?? [])]),
    status: input.status ?? "active",
    data: Object.freeze({ ...(input.data ?? {} as TData) }),
    recordedAt: input.recordedAt ?? now,
  });
}
