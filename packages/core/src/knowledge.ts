import type { EntityId } from "./entity.js";
import type { KnowledgeId } from "./ids.js";

export type KnowledgeScope = "world" | "project" | "agent";
export type KnowledgeStatus = "draft" | "verified" | "deprecated";
export type KnowledgeSourceKind = "user" | "repository" | "agent" | "external";

export interface KnowledgeSource {
  readonly kind: KnowledgeSourceKind;
  readonly reference?: string;
  readonly capturedAt: string;
}

export interface KnowledgeItem<TData extends Record<string, unknown> = Record<string, unknown>> {
  readonly id: KnowledgeId;
  readonly title: string;
  readonly content: string;
  readonly scope: KnowledgeScope;
  readonly scopeOwnerId?: EntityId;
  readonly status: KnowledgeStatus;
  readonly source: KnowledgeSource;
  readonly tags: readonly string[];
  readonly data: Readonly<TData>;
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type NewKnowledgeItem<TData extends Record<string, unknown> = Record<string, unknown>> =
  Omit<KnowledgeItem<TData>, "createdAt" | "updatedAt" | "version" | "status" | "tags" | "data"> & {
    readonly createdAt?: string;
    readonly updatedAt?: string;
    readonly version?: number;
    readonly status?: KnowledgeStatus;
    readonly tags?: readonly string[];
    readonly data?: TData;
  };

function assertText(value: string, label: string): void {
  if (value.trim().length === 0) throw new Error(`${label} must not be empty.`);
}

function assertTimestamp(value: string, label: string): void {
  if (!Number.isFinite(Date.parse(value)) || !/^\d{4}-\d{2}-\d{2}T/.test(value)) {
    throw new Error(`${label} must be a valid ISO-8601 timestamp.`);
  }
}

export function createKnowledgeItem<TData extends Record<string, unknown>>(
  input: NewKnowledgeItem<TData>,
  now = new Date().toISOString(),
): KnowledgeItem<TData> {
  assertText(input.title, "Knowledge title");
  assertText(input.content, "Knowledge content");
  assertTimestamp(now, "Current timestamp");
  assertTimestamp(input.source.capturedAt, "Knowledge source capturedAt");
  if (input.scope === "world" && input.scopeOwnerId !== undefined) {
    throw new Error("World-scoped knowledge must not have a scope owner.");
  }
  if (input.scope !== "world" && input.scopeOwnerId === undefined) {
    throw new Error("Project- and agent-scoped knowledge require a scope owner.");
  }
  const createdAt = input.createdAt ?? now;
  const updatedAt = input.updatedAt ?? createdAt;
  assertTimestamp(createdAt, "Knowledge createdAt");
  assertTimestamp(updatedAt, "Knowledge updatedAt");
  if (Date.parse(updatedAt) < Date.parse(createdAt)) {
    throw new Error("Knowledge updatedAt cannot be earlier than createdAt.");
  }
  const version = input.version ?? 1;
  if (!Number.isInteger(version) || version < 1) {
    throw new Error("Knowledge version must be a positive integer.");
  }
  return Object.freeze({
    ...input,
    status: input.status ?? "draft",
    tags: Object.freeze([...(input.tags ?? [])]),
    data: Object.freeze({ ...(input.data ?? {} as TData) }),
    version,
    createdAt,
    updatedAt,
  });
}
