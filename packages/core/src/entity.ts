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
  | "agent.action.completed";

export interface WorldEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> {
  readonly id: EventId;
  readonly type: WorldEventType;
  readonly occurredAt: string;
  readonly actorId?: EntityId;
  readonly subjectId?: EntityId;
  readonly payload: Readonly<TPayload>;
}
