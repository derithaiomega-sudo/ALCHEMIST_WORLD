import { describe, expect, it } from "vitest";
import { createAgentDefinition } from "../src/agent.js";
import { createPermissionGrant, createToolDefinition } from "../src/capabilities.js";
import { createRuntimeRun } from "../src/runtime.js";
import { entityId, permissionId, runId, skillId, toolId } from "../src/ids.js";

const timestamp = "2026-11-14T00:00:00.000Z";
const builderId = entityId("agent_builder");

describe("capability contracts", () => {
  it("requires approval policy for external and destructive tools", () => {
    expect(() => createToolDefinition({
      id: toolId("tool_publish"),
      name: "Publish",
      description: "Publish an artifact externally.",
      effect: "external",
      approval: "not_required",
      requiredPermissionIds: [],
      inputContract: {},
      outputContract: {},
      timeoutMs: 10000,
    })).toThrow("cannot bypass approval policy");
  });

  it("creates a valid tool definition", () => {
    const tool = createToolDefinition({
      id: toolId("tool_read_repo"),
      name: "Read repository",
      description: "Read files from an authorized repository.",
      effect: "read",
      approval: "not_required",
      requiredPermissionIds: [permissionId("perm_repo_read")],
      inputContract: { path: "string" },
      outputContract: { content: "string" },
      timeoutMs: 5000,
    });
    expect(Object.isFrozen(tool)).toBe(true);
    expect(Object.isFrozen(tool.requiredPermissionIds)).toBe(true);
  });

  it("rejects permission grants with expired-at-creation timestamps", () => {
    expect(() => createPermissionGrant({
      id: permissionId("perm_expired"),
      subjectId: builderId,
      effect: "allow",
      action: "read",
      resource: "repository:*",
      conditions: {},
      createdAt: timestamp,
      expiresAt: timestamp,
    })).toThrow("later than createdAt");
  });
});

describe("agent contracts", () => {
  it("creates a bounded agent with explicit memory scope", () => {
    const agent = createAgentDefinition({
      id: builderId,
      name: "Builder Agent",
      goal: "Implement approved repository changes.",
      status: "draft",
      skillIds: [skillId("skill_repository_inspection")],
      toolIds: [toolId("tool_read_repo")],
      permissionIds: [permissionId("perm_repo_read")],
      memoryAccess: [{ scope: "project", ownerId: entityId("project_aworld"), mode: "read" }],
      constraints: ["No unapproved writes"],
      triggers: ["approved.build.request"],
      outputContract: { summary: "string", validation: "object" },
    });
    expect(agent.status).toBe("draft");
    expect(Object.isFrozen(agent.memoryAccess)).toBe(true);
  });

  it("rejects project memory access without an owner", () => {
    expect(() => createAgentDefinition({
      id: builderId,
      name: "Builder Agent",
      goal: "Build safely.",
      status: "draft",
      skillIds: [],
      toolIds: [],
      permissionIds: [],
      memoryAccess: [{ scope: "project", mode: "read" }],
      constraints: [],
      triggers: [],
      outputContract: {},
    })).toThrow("require an owner");
  });
});

describe("runtime run contracts", () => {
  it("creates an active run with immutable checkpoints", () => {
    const run = createRuntimeRun({
      id: runId("run_builder_001"),
      agentId: builderId,
      goal: "Inspect the repository.",
      status: "running",
      currentStep: "load-context",
      checkpoints: [{
        step: "observe",
        status: "completed",
        recordedAt: timestamp,
        summary: "Repository metadata loaded.",
      }],
      startedAt: timestamp,
      updatedAt: timestamp,
    });
    expect(run.status).toBe("running");
    expect(Object.isFrozen(run.checkpoints)).toBe(true);
  });

  it("requires completion time for terminal runs", () => {
    expect(() => createRuntimeRun({
      id: runId("run_builder_002"),
      agentId: builderId,
      goal: "Inspect the repository.",
      status: "succeeded",
      checkpoints: [],
      startedAt: timestamp,
      updatedAt: timestamp,
    })).toThrow("require completedAt");
  });
});
