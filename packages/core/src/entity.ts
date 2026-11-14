/**
 * Stable domain primitives for Alchemist World.
 * IDs are branded strings so accidental cross-entity assignments fail type-checking.
 */
export type Brand<T, Name extends string> = T & { readonly __brand: Name };

export type EntityId = Brand<string, "EntityId">;
export type RelationshipId = Brand<string, "RelationshipId">;
export type EventId = Brand<string, "EventId">;

export type EntityKind =
  | "person"
  | "agent"
  | "project"
  | "artifact"
  | "place"
  | "organization"
  | "concept"
  | "resource";

export interface Entity<TData extends Record<string, unknown> = Record<string, unknown>> {
  readonly id: EntityId;
  readonly kind: EntityKind;
  readonly name: string;
  readonly description?: string;
  readonly data: Readonly<TData>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type RelationshipKind =
  | "owns"
  | "created"
  | "belongs_to"
  | "depends_on"
  | "relates_to"
  | "located_in"
  | "member_of"
  | "derived_from";

export interface Relationship {
  readonly id: RelationshipId;
  readonly kind: RelationshipKind;
  readonly from: EntityId;
  readonly to: EntityId;
  readonly properties: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
}

export type WorldEventType =
  | "entity.created"
  | "entity.updated"
  | "relationship.created"
  | "memory.recorded"
  | "knowledge.created"
  | "knowledge.updated"
  | "memory.recalled"
  | "agent.action.completed";

export interface WorldEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> {
  readonly id: EventId;
  readonly type: WorldEventType;
  readonly occurredAt: string;
  readonly actorId?: EntityId;
  readonly subjectId?: EntityId;
  readonly payload: Readonly<TPayload>;
}

function assertNonEmpty(value: string, label: string): void {
  if (value.trim().length === 0) throw new Error(`${label} must not be empty.`);
}

function assertIsoTimestamp(value: string, label: string): void {
  if (!Number.isFinite(Date.parse(value)) || !/^\d{4}-\d{2}-\d{2}T/.test(value)) {
    throw new Error(`${label} must be a valid ISO-8601 timestamp.`);
  }
}

export type NewEntity<TData extends Record<string, unknown> = Record<string, unknown>> =
  Omit<Entity<TData>, "createdAt" | "updatedAt"> & {
    readonly createdAt?: string;
    readonly updatedAt?: string;
  };

export function createEntity<TData extends Record<string, unknown>>(
  input: NewEntity<TData>,
  now = new Date().toISOString(),
): Entity<TData> {
  assertNonEmpty(input.name, "Entity name");
  assertIsoTimestamp(now, "Current timestamp");
  const createdAt = input.createdAt ?? now;
  const updatedAt = input.updatedAt ?? createdAt;
  assertIsoTimestamp(createdAt, "Entity createdAt");
  assertIsoTimestamp(updatedAt, "Entity updatedAt");
  if (Date.parse(updatedAt) < Date.parse(createdAt)) {
    throw new Error("Entity updatedAt cannot be earlier than createdAt.");
  }
  return Object.freeze({ ...input, data: Object.freeze({ ...input.data }), createdAt, updatedAt });
}

export type NewRelationship = Omit<Relationship, "createdAt"> & { readonly createdAt?: string };

export function createRelationship(
  input: NewRelationship,
  now = new Date().toISOString(),
): Relationship {
  assertIsoTimestamp(now, "Current timestamp");
  assertIsoTimestamp(input.createdAt ?? now, "Relationship createdAt");
  return Object.freeze({
    ...input,
    properties: Object.freeze({ ...input.properties }),
    createdAt: input.createdAt ?? now,
  });
}

export type NewWorldEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> =
  Omit<WorldEvent<TPayload>, "occurredAt"> & { readonly occurredAt?: string };

export function createWorldEvent<TPayload extends Record<string, unknown>>(
  input: NewWorldEvent<TPayload>,
  now = new Date().toISOString(),
): WorldEvent<TPayload> {
  const occurredAt = input.occurredAt ?? now;
  assertIsoTimestamp(occurredAt, "Event occurredAt");
  return Object.freeze({ ...input, payload: Object.freeze({ ...input.payload }), occurredAt });
}
