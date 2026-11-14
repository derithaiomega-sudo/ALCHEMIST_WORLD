# World State

Phase: v0.7 Policy & Event Integrity

## Established

- ALCHEMIST WORLD is an AI-native world and workspace.
- The Alchemist orchestrates intent, context, bounded agents, and transmutation.
- Persistent Knowledge, Persistent Memory, Project Memory, and Runtime Memory are separate concerns.
- The Agent Guild consists of Thinkers, Builders, Guardians, Messengers, Observers, and Explorers.
- Skills define reusable capability contracts; Tools define operations; Permissions define authority.
- Builder Agent is the first end-to-end execution target.
- Ouroboros proposes evidence-based lessons from outcomes.

## Implemented in Core

- Entity, Relationship, and WorldEvent contracts with branded IDs and constructors.
- KnowledgeItem and MemoryRecord contracts with provenance, scope, lifecycle, and validation.
- SkillDefinition, ToolDefinition, PermissionGrant, and AgentDefinition contracts.
- RuntimeRun and execution checkpoints.
- Deterministic default-deny policy evaluator.
- Explicit deny precedence across all matching grants for the subject.
- Tool-effect/action compatibility checks: read, write, external, destructive.
- Exact and prefix resource matching; primitive context conditions.
- Approval-required policy decision state.
- In-memory append-only event log with unique IDs, sequence numbers, hash chaining, immutable snapshots, integrity verification, and replay.
- Audit event types for permission denial, approval, tool execution, and agent run lifecycle.

## Validation status

- Policy and event-log test suites have been added.
- The v0.6 baseline passed lint, typecheck, tests, and build.
- The latest v0.7 CI run is required before marking this milestone validated.
- Event-log checksum is for accidental mutation detection only; it is not cryptographic or tamper-proof.
- Persistence, trusted approval, and policy administration are not implemented.

## Next

1. Confirm v0.7 CI is green and repair any failures.
2. Establish trusted runtime context and approval evidence boundaries.
3. Build the read-only Builder Agent flow.
4. Connect tool invocation to policy evaluation and audit events.
5. Add approval-gated repository writes.
6. Prepare the first complete ZIP checkpoint after the runnable Builder vertical slice.

## Open

- Durable event store, transactions, concurrency, and replay recovery.
- Policy administration and conflict-resolution rules.
- Trusted approval service and credential boundaries.
- Persistence technology and migrations.
- Knowledge and memory retention, conflict resolution, and deprecation.
