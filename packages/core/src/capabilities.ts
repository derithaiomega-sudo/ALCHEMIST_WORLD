import type { EntityId } from "./entity.js";
import type { PermissionId, SkillId, ToolId } from "./ids.js";

export interface SkillDefinition {
  readonly id: SkillId;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly inputContract: Readonly<Record<string, unknown>>;
  readonly outputContract: Readonly<Record<string, unknown>>;
  readonly requiredToolIds: readonly ToolId[];
  readonly requiredPermissionIds: readonly PermissionId[];
}

export type ToolEffect = "read" | "write" | "external" | "destructive";
export type ApprovalMode = "not_required" | "policy" | "always";

export interface ToolDefinition {
  readonly id: ToolId;
  readonly name: string;
  readonly description: string;
  readonly effect: ToolEffect;
  readonly approval: ApprovalMode;
  readonly requiredPermissionIds: readonly PermissionId[];
  readonly inputContract: Readonly<Record<string, unknown>>;
  readonly outputContract: Readonly<Record<string, unknown>>;
  readonly timeoutMs: number;
}

export type PermissionEffect = "allow" | "deny";
export type PermissionAction = "read" | "create" | "update" | "delete" | "execute" | "publish";

export interface PermissionGrant {
  readonly id: PermissionId;
  readonly subjectId: EntityId;
  readonly effect: PermissionEffect;
  readonly action: PermissionAction;
  readonly resource: string;
  readonly conditions: Readonly<Record<string, unknown>>;
  readonly expiresAt?: string;
  readonly createdAt: string;
}

export function createToolDefinition(input: ToolDefinition): ToolDefinition {
  if (input.name.trim().length === 0) throw new Error("Tool name must not be empty.");
  if (!Number.isInteger(input.timeoutMs) || input.timeoutMs < 1) {
    throw new Error("Tool timeoutMs must be a positive integer.");
  }
  if ((input.effect === "destructive" || input.effect === "external") && input.approval === "not_required") {
    throw new Error("External and destructive tools cannot bypass approval policy.");
  }
  return Object.freeze({
    ...input,
    requiredPermissionIds: Object.freeze([...input.requiredPermissionIds]),
    inputContract: Object.freeze({ ...input.inputContract }),
    outputContract: Object.freeze({ ...input.outputContract }),
  });
}

export function createPermissionGrant(input: PermissionGrant): PermissionGrant {
  if (input.resource.trim().length === 0) throw new Error("Permission resource must not be empty.");
  if (!Number.isFinite(Date.parse(input.createdAt))) throw new Error("Permission createdAt must be a valid timestamp.");
  if (input.expiresAt !== undefined && !Number.isFinite(Date.parse(input.expiresAt))) {
    throw new Error("Permission expiresAt must be a valid timestamp.");
  }
  if (input.expiresAt !== undefined && Date.parse(input.expiresAt) <= Date.parse(input.createdAt)) {
    throw new Error("Permission expiresAt must be later than createdAt.");
  }
  return Object.freeze({ ...input, conditions: Object.freeze({ ...input.conditions }) });
}
