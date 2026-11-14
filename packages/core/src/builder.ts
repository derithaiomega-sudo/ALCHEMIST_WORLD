import type { EntityId, EventId } from "./entity.js";
import { createWorldEvent } from "./entity.js";
import type { ToolDefinition } from "./capabilities.js";
import { evaluatePolicy, type PolicyRequest, type PolicyResult } from "./policy.js";
import { InMemoryEventLog } from "./event-log.js";

export interface ToolExecutor<TInput, TOutput> {
  execute(tool: ToolDefinition, input: TInput): Promise<TOutput>;
}

export interface ToolAuditEventIds {
  readonly denied: EventId;
  readonly approvalRequested: EventId;
  readonly executed: EventId;
}

export interface BuilderToolCall<TInput> {
  readonly policy: PolicyRequest;
  readonly input: TInput;
  readonly auditEventIds: ToolAuditEventIds;
  readonly occurredAt: string;
}

export type BuilderToolCallResult<TOutput> =
  | { readonly status: "denied"; readonly policy: PolicyResult }
  | { readonly status: "waiting_approval"; readonly policy: PolicyResult }
  | { readonly status: "succeeded"; readonly policy: PolicyResult; readonly output: TOutput }
  | { readonly status: "failed"; readonly policy: PolicyResult; readonly errorName: string };

/**
 * Policy-gated tool boundary for the first Builder Agent runtime.
 * The executor is never called for denied or approval-pending requests.
 * Audit payloads intentionally exclude raw tool input and output.
 */
export async function executeBuilderTool<TInput, TOutput>(
  call: BuilderToolCall<TInput>,
  executor: ToolExecutor<TInput, TOutput>,
  eventLog: InMemoryEventLog,
): Promise<BuilderToolCallResult<TOutput>> {
  const policy = evaluatePolicy(call.policy);
  const actorId: EntityId = call.policy.agent.id;
  const toolId = call.policy.tool.id;

  if (policy.decision === "deny") {
    eventLog.append(createWorldEvent({
      id: call.auditEventIds.denied,
      type: "permission.denied",
      actorId,
      payload: {
        toolId,
        action: call.policy.action,
        resource: call.policy.resource,
        reason: policy.reason,
      },
    }, call.occurredAt));
    return Object.freeze({ status: "denied", policy });
  }

  if (policy.decision === "requires_approval") {
    eventLog.append(createWorldEvent({
      id: call.auditEventIds.approvalRequested,
      type: "approval.requested",
      actorId,
      payload: {
        toolId,
        action: call.policy.action,
        resource: call.policy.resource,
        reason: policy.reason,
      },
    }, call.occurredAt));
    return Object.freeze({ status: "waiting_approval", policy });
  }

  try {
    const output = await executor.execute(call.policy.tool, call.input);
    eventLog.append(createWorldEvent({
      id: call.auditEventIds.executed,
      type: "tool.executed",
      actorId,
      payload: { toolId, outcome: "succeeded" },
    }, call.occurredAt));
    return Object.freeze({ status: "succeeded", policy, output });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    eventLog.append(createWorldEvent({
      id: call.auditEventIds.executed,
      type: "tool.executed",
      actorId,
      payload: { toolId, outcome: "failed", errorName },
    }, call.occurredAt));
    return Object.freeze({ status: "failed", policy, errorName });
  }
}
