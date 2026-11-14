# Agent Runtime

An Agent is a bounded execution capability, not an unrestricted chat persona.

Agent = identity + goal + skills + tools + memory scope + permissions + constraints + triggers + output contract.

## Lifecycle

OBSERVE → LOAD CONTEXT → UNDERSTAND → PLAN → POLICY CHECK → EXECUTE → VALIDATE → DOCUMENT → REMEMBER → REPORT.

## Runtime boundaries

- The runtime owns temporary execution state and workflow checkpoints.
- Persistent Knowledge provides curated, source-attributed information.
- Persistent Memory provides traceable records of experience and outcomes.
- Project Memory remains the versioned source of truth for project definition.
- Skills define reusable capability contracts; Tools provide concrete external or internal operations.
- Permissions and constraints are checked before execution, not inferred from an agent's goal.

## Execution rules

1. Every run has an explicit goal and output contract.
2. The agent loads only memory and knowledge within its authorized scope.
3. Plans are inspectable before consequential execution.
4. Tool calls are bounded by declared permissions.
5. External, destructive, or irreversible side effects require the configured approval.
6. Results are validated against the output contract.
7. Documentation and durable memory updates are explicit workflow steps.
8. The agent reports what it actually did; it never claims an unverified success.

## First implementation target: Builder Agent

The Builder Agent performs a controlled vertical slice:
Intent → Project → Context → Plan → Repository Change → Validation → Documentation → Memory → Report.

The first implementation must remain read-first and approval-gated for writes. The agent must provide a clear change summary and validation evidence.
