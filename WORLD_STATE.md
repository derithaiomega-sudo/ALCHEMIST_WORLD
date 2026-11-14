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
- Explicit deny precedence across matching grants.
- Exact and prefix resource matching; primitive context conditions.
- Approval-required policy result.
- In-memory append-only event log with unique IDs, sequence numbers, hash chaining, integrity verification, and replay.
- Audit event types for permission denial, approval, tool execution, and agent run lifecycle.
- Automated CI passed lint, typecheck, tests, and build on commit 3dd90fe before the v0.7 additions.

## Current validation

- v0.7 policy and event-log tests have been added.
- CI for the latest changes is pending; do not treat the v0.7 implementation as validated until the workflow completes successfully.
- Event-log checksum is for accidental mutation detection only; it is not cryptographic or tamper-proof.
- Persistence, trusted approval, and policy administration are not implemented.

## Next

1. Validate v0.7 through CI and resolve any failures.
2. Add trusted runtime context and approval evidence boundaries.
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
