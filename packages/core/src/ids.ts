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

export type KnowledgeId = import("./entity.js").Brand<string, "KnowledgeId">;
export type MemoryId = import("./entity.js").Brand<string, "MemoryId">;

export function knowledgeId(value: string): KnowledgeId {
  return validateId(value, "knowledge id") as KnowledgeId;
}

export function memoryId(value: string): MemoryId {
  return validateId(value, "memory id") as MemoryId;
}

export type SkillId = import("./entity.js").Brand<string, "SkillId">;
export type ToolId = import("./entity.js").Brand<string, "ToolId">;
export type PermissionId = import("./entity.js").Brand<string, "PermissionId">;
export type RunId = import("./entity.js").Brand<string, "RunId">;

export function skillId(value: string): SkillId {
  return validateId(value, "skill id") as SkillId;
}

export function toolId(value: string): ToolId {
  return validateId(value, "tool id") as ToolId;
}

export function permissionId(value: string): PermissionId {
  return validateId(value, "permission id") as PermissionId;
}

export function runId(value: string): RunId {
  return validateId(value, "run id") as RunId;
}
