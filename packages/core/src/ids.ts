import type { EntityId, EventId, RelationshipId } from "./entity.js";

const ID_PATTERN = /^[a-z][a-z0-9_-]{2,63}$/;

function validateId(value: string, label: string): string {
  if (!ID_PATTERN.test(value)) {
    throw new Error(`Invalid ${label}: expected 3-64 lowercase letters, digits, "_" or "-".`);
  }
  return value;
}

export function entityId(value: string): EntityId {
  return validateId(value, "entity id") as EntityId;
}

export function relationshipId(value: string): RelationshipId {
  return validateId(value, "relationship id") as RelationshipId;
}

export function eventId(value: string): EventId {
  return validateId(value, "event id") as EventId;
}
