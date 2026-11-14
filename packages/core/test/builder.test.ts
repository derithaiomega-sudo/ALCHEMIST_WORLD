import { describe, expect, it } from "vitest";
import { createAgentDefinition } from "../src/agent.js";
import { executeBuilderTool } from "../src/builder.js";
import { createPermissionGrant, createToolDefinition } from "../src/capabilities.js";
import { InMemoryEventLog } from "../src/event-log.js";
import { entityId, eventId, permissionId, toolId } from "../src/ids.js";

const timestamp = "2026-11-14T03:00:00.000Z";
const agent = createAgentDefinition({
  id: entityId("agent_builder"),
  name: "Builder Agent",
  goal: "Inspect repository files.",
  status: "active",
  skillIds: [],
  toolIds: [toolId("tool_read_repo")],
  permissionIds: [permissionId("perm_repo_read")],
  memoryAccess: [],
  constraints: ["Read-only unless explicitly approved"],
  triggers: [],
  outputContract: {},
});
const tool = createToolDefinition({
  id: toolId("tool_read_repo"),
  name: "Read repository",
  description: "Read an authorized repository file.",
  effect: "read",
  approval: "not_required",
  requiredPermissionIds: [permissionId("perm_repo_read")],
  inputContract: { path: "string" },
  outputContract: { content: "string" },
  timeoutMs: 5000,
});
const grant = createPermissionGrant({
  id: permissionId("perm_repo_read"),
  subjectId: agent.id,
  effect: "allow",
  action: "read",
  resource: "repo:alchemist-world:*",
  conditions: {},
  createdAt: "2026-11-14T00:00:00.000Z",
});

function call(suffix: string, overrides: Record<string, unknown> = {}) {
  return {
    policy: {
      agent,
      tool,
      action: "read" as const,
      resource: "repo:alchemist-world:README.md",
      context: {},
      grants: [grant],
      now: timestamp,
      ...overrides,
    },
    input: { path: "README.md" },
    auditEventIds: {
      denied: eventId(`event_denied_${suffix}`),
      approvalRequested: eventId(`event_approval_${suffix}`),
      executed: eventId(`event_executed_${suffix}`),
    },
    occurredAt: timestamp,
  };
}

describe("Builder policy-gated execution", () => {
  it("never invokes the executor for a denied request and records denial", async () => {
    let calls = 0;
    const log = new InMemoryEventLog();
    const result = await executeBuilderTool(
      call("denied", { grants: [] }),
      { execute: async () => { calls++; return "unexpected"; } },
      log,
    );

    expect(result.status).toBe("denied");
    expect(calls).toBe(0);
    expect(log.readAll()[0]?.event.type).toBe("permission.denied");
    expect(log.verify()).toBe(true);
  });

  it("does not invoke the executor while approval is pending", async () => {
    let calls = 0;
    const log = new InMemoryEventLog();
    const result = await executeBuilderTool(
      call("approval", { approvalRequired: true }),
      { execute: async () => { calls++; return "unexpected"; } },
      log,
    );

    expect(result.status).toBe("waiting_approval");
    expect(calls).toBe(0);
    expect(log.readAll()[0]?.event.type).toBe("approval.requested");
  });

  it("executes an authorized request and records only a safe audit summary", async () => {
    const log = new InMemoryEventLog();
    const result = await executeBuilderTool(
      call("success"),
      { execute: async (_tool, input: { path: string }) => ({ content: `contents of ${input.path}` }) },
      log,
    );

    expect(result.status).toBe("succeeded");
    if (result.status === "succeeded") expect(result.output.content).toBe("contents of README.md");
    expect(log.readAll()[0]?.event.type).toBe("tool.executed");
    expect(log.readAll()[0]?.event.payload).toEqual({
      toolId: tool.id,
      outcome: "succeeded",
    });
    expect(log.verify()).toBe(true);
  });

  it("records executor failures without leaking error messages", async () => {
    const log = new InMemoryEventLog();
    const result = await executeBuilderTool(
      call("failure"),
      { execute: async () => { throw new Error("sensitive path /private/token"); } },
      log,
    );

    expect(result.status).toBe("failed");
    if (result.status === "failed") expect(result.errorName).toBe("Error");
    expect(log.readAll()[0]?.event.payload).toEqual({
      toolId: tool.id,
      outcome: "failed",
      errorName: "Error",
    });
  });
});
