import type { EntityId } from "./entity.js";
import type { AgentDefinition } from "./agent.js";
import type {
  PermissionAction,
  PermissionGrant,
  ToolDefinition,
} from "./capabilities.js";

export type PolicyDecision = "allow" | "deny" | "requires_approval";
export type PolicyReason =
  | "agent_inactive"
  | "tool_not_assigned"
  | "permission_not_assigned"
  | "no_matching_allow_grant"
  | "explicit_deny"
  | "grant_expired"
  | "grant_not_yet_valid"
  | "approval_required";

export interface PolicyRequest {
  readonly agent: AgentDefinition;
  readonly tool: ToolDefinition;
  readonly action: PermissionAction;
  readonly resource: string;
  readonly context: Readonly<Record<string, unknown>>;
  readonly grants: readonly PermissionGrant[];
  readonly now: string;
  readonly approvalRequired?: boolean;
  readonly approvalGranted?: boolean;
}

export interface PolicyResult {
  readonly decision: PolicyDecision;
  readonly reason: PolicyReason;
  readonly matchedGrantIds: readonly string[];
  readonly evaluatedAt: string;
}

function matchesResource(pattern: string, resource: string): boolean {
  if (pattern === "*") return true;
  if (pattern.endsWith(":*")) return resource.startsWith(pattern.slice(0, -1));
  return pattern === resource;
}

function matchesConditions(
  conditions: Readonly<Record<string, unknown>>,
  context: Readonly<Record<string, unknown>>,
): boolean {
  return Object.entries(conditions).every(([key, expected]) =>
    Object.prototype.hasOwnProperty.call(context, key)
    && Object.is(context[key], expected));
}

function result(
  decision: PolicyDecision,
  reason: PolicyReason,
  matchedGrantIds: string[],
  evaluatedAt: string,
): PolicyResult {
  return Object.freeze({
    decision,
    reason,
    matchedGrantIds: Object.freeze(matchedGrantIds),
    evaluatedAt,
  });
}

/**
 * Deterministic, default-deny policy evaluation.
 * This function evaluates declared grants; it does not execute the tool.
 */
export function evaluatePolicy(request: PolicyRequest): PolicyResult {
  const now = Date.parse(request.now);
  if (!Number.isFinite(now)) throw new Error("Policy evaluation time must be valid.");
  if (request.agent.status !== "active") {
    return result("deny", "agent_inactive", [], request.now);
  }
  if (!request.agent.toolIds.includes(request.tool.id)) {
    return result("deny", "tool_not_assigned", [], request.now);
  }
  if (request.tool.requiredPermissionIds.length === 0
    || request.tool.requiredPermissionIds.some((id) => !request.agent.permissionIds.includes(id))) {
    return result("deny", "permission_not_assigned", [], request.now);
  }

  const applicable = request.grants.filter((grant) =>
    grant.subjectId === request.agent.id
    && grant.action === request.action
    && matchesResource(grant.resource, request.resource)
    && matchesConditions(grant.conditions, request.context));

  const explicitDeny = applicable.filter((grant) =>
    grant.effect === "deny" && request.agent.permissionIds.includes(grant.id));
  if (explicitDeny.length > 0) {
    return result("deny", "explicit_deny", explicitDeny.map((grant) => grant.id), request.now);
  }

  const relevant = applicable.filter((grant) =>
    request.agent.permissionIds.includes(grant.id));
  const activeAllows = relevant.filter((grant) => {
    const created = Date.parse(grant.createdAt);
    const expires = grant.expiresAt === undefined ? Number.POSITIVE_INFINITY : Date.parse(grant.expiresAt);
    return grant.effect === "allow" && created <= now && now < expires;
  });

  const requiredIds = request.tool.requiredPermissionIds;
  const missing = requiredIds.filter((id) => !activeAllows.some((grant) => grant.id === id));
  if (missing.length > 0) {
    const hasExpired = relevant.some((grant) =>
      requiredIds.includes(grant.id)
      && grant.effect === "allow"
      && grant.expiresAt !== undefined
      && Date.parse(grant.expiresAt) <= now);
    const hasFuture = relevant.some((grant) =>
      requiredIds.includes(grant.id)
      && grant.effect === "allow"
      && Date.parse(grant.createdAt) > now);
    return result(
      "deny",
      hasExpired ? "grant_expired" : hasFuture ? "grant_not_yet_valid" : "no_matching_allow_grant",
      relevant.map((grant) => grant.id),
      request.now,
    );
  }

  const needsApproval = request.tool.approval === "always" || request.approvalRequired === true;
  if (needsApproval && request.approvalGranted !== true) {
    return result("requires_approval", "approval_required", activeAllows.map((grant) => grant.id), request.now);
  }

  return result("allow", "no_matching_allow_grant", activeAllows.map((grant) => grant.id), request.now);
}
