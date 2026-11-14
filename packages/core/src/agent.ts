import type { EntityId } from "./entity.js";
import type { PermissionId, SkillId, ToolId } from "./ids.js";

export type AgentStatus = "draft" | "active" | "disabled";
export type AgentMemoryScope = "world" | "project" | "agent";
export type MemoryAccessMode = "read" | "write";

export interface AgentMemoryAccess {
  readonly scope: AgentMemoryScope;
  readonly ownerId?: EntityId;
  readonly mode: MemoryAccessMode;
}

export interface AgentDefinition {
  readonly id: EntityId;
  readonly name: string;
  readonly goal: string;
  readonly status: AgentStatus;
  readonly skillIds: readonly SkillId[];
  readonly toolIds: readonly ToolId[];
  readonly permissionIds: readonly PermissionId[];
  readonly memoryAccess: readonly AgentMemoryAccess[];
  readonly constraints: readonly string[];
  readonly triggers: readonly string[];
  readonly outputContract: Readonly<Record<string, unknown>>;
}

export function createAgentDefinition(input: AgentDefinition): AgentDefinition {
  if (input.name.trim().length === 0) throw new Error("Agent name must not be empty.");
  if (input.goal.trim().length === 0) throw new Error("Agent goal must not be empty.");
  for (const access of input.memoryAccess) {
    if (access.scope === "world" && access.ownerId !== undefined) {
      throw new Error("World memory access must not specify an owner.");
    }
    if (access.scope !== "world" && access.ownerId === undefined) {
      throw new Error("Project and agent memory access require an owner.");
    }
  }
  return Object.freeze({
    ...input,
    skillIds: Object.freeze([...input.skillIds]),
    toolIds: Object.freeze([...input.toolIds]),
    permissionIds: Object.freeze([...input.permissionIds]),
    memoryAccess: Object.freeze(input.memoryAccess.map((entry) => Object.freeze({ ...entry }))),
    constraints: Object.freeze([...input.constraints]),
    triggers: Object.freeze([...input.triggers]),
    outputContract: Object.freeze({ ...input.outputContract }),
  });
}
