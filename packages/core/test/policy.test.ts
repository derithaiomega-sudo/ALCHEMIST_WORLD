import { describe, expect, it } from "vitest";
import { createAgentDefinition } from "../src/agent.js";
import { createPermissionGrant, createToolDefinition } from "../src/capabilities.js";
import { evaluatePolicy } from "../src/policy.js";
import { entityId, permissionId, toolId } from "../src/ids.js";

const now = "2026-11-14T03:00:00.000Z";
const agent = createAgentDefinition({
  id: entityId("agent_builder"),
  name: "Builder Agent",
  goal: "Inspect project files.",
  status: "active",
  skillIds: [],
  toolIds: [toolId("tool_read_repo")],
  permissionIds: [permissionId("perm_repo_read")],
  memoryAccess: [],
  constraints: ["Read-only"],
  triggers: [],
  outputContract: {},
});
const tool = createToolDefinition({
  id: toolId("tool_read_repo"),
  name: "Read repository",
  description: "Read an authorized repository path.",
  effect: "read",
  approval: "not_required",
  requiredPermissionIds: [permissionId("perm_repo_read")],
  inputContract: {},
  outputContract: {},
  timeoutMs: 5000,
});
const allow = createPermissionGrant({
  id: permissionId("perm_repo_read"),
  subjectId: agent.id,
  effect: "allow",
  action: "read",
  resource: "repo:alchemist-world:*",
  conditions: { environment: "test" },
  createdAt: "2026-11-14T00:00:00.000Z",
});

describe("policy evaluator", () => {
  const base = {
    agent,
    tool,
    action: "read" as const,
    resource: "repo:alchemist-world:README.md",
    context: { environment: "test" },
    grants: [allow],
    now,
  };

  it("allows a fully authorized request", () => {
    const result = evaluatePolicy(base);
    expect(result.decision).toBe("allow");
    expect(result.reason).toBe("policy_satisfied");
    expect(result.matchedGrantIds).toContain(allow.id);
  });

  it("defaults to deny when there is no matching allow grant", () => {
    const result = evaluatePolicy({ ...base, grants: [] });
    expect(result.decision).toBe("deny");
    expect(result.reason).toBe("no_matching_allow_grant");
  });

  it("gives any matching explicit deny precedence", () => {
    const deny = createPermissionGrant({
      id: permissionId("perm_repo_deny"),
      subjectId: agent.id,
      effect: "deny",
      action: "read",
      resource: "repo:alchemist-world:*",
      conditions: {},
      createdAt: "2026-11-14T00:00:00.000Z",
    });
    const result = evaluatePolicy({ ...base, grants: [allow, deny] });
    expect(result.decision).toBe("deny");
    expect(result.reason).toBe("explicit_deny");
  });

  it("rejects actions that do not match the tool effect", () => {
    const result = evaluatePolicy({ ...base, action: "delete" });
    expect(result.decision).toBe("deny");
    expect(result.reason).toBe("action_mismatch");
  });

  it("denies when a required context condition does not match", () => {
    const result = evaluatePolicy({ ...base, context: { environment: "production" } });
    expect(result.decision).toBe("deny");
    expect(result.reason).toBe("no_matching_allow_grant");
  });

  it("denies expired grants", () => {
    const expired = createPermissionGrant({
      ...allow,
      expiresAt: "2026-11-14T02:59:59.000Z",
    });
    const result = evaluatePolicy({ ...base, grants: [expired] });
    expect(result.decision).toBe("deny");
    expect(result.reason).toBe("grant_expired");
  });

  it("requires approval when requested by policy", () => {
    const pending = evaluatePolicy({ ...base, approvalRequired: true });
    expect(pending.decision).toBe("requires_approval");
    const approved = evaluatePolicy({ ...base, approvalRequired: true, approvalGranted: true });
    expect(approved.decision).toBe("allow");
  });

  it("denies inactive agents and unassigned tools", () => {
    expect(evaluatePolicy({
      ...base,
      agent: createAgentDefinition({ ...agent, status: "disabled" }),
    }).reason).toBe("agent_inactive");
    expect(evaluatePolicy({
      ...base,
      agent: createAgentDefinition({ ...agent, toolIds: [] }),
    }).reason).toBe("tool_not_assigned");
  });
});
