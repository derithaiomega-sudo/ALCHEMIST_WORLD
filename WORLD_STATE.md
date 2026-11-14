# World State

Phase: v0.8 Builder Agent vertical slice — execution boundary validated

## Established

- ALCHEMIST WORLD is an AI-native world and workspace.
- The Alchemist orchestrates intent, context, bounded agents, and transmutation.
- Persistent Knowledge, Persistent Memory, Project Memory, and Runtime Memory are separate concerns.
- Skills define reusable capability contracts; Tools define operations; Permissions define authority.
- The Agent Guild comprises Thinkers, Builders, Guardians, Messengers, Observers, and Explorers.
- Builder Agent is the first end-to-end execution target.

## Implemented in Core

- Entity, Relationship, WorldEvent, KnowledgeItem, MemoryRecord, AgentDefinition, SkillDefinition, ToolDefinition, PermissionGrant, and RuntimeRun contracts.
- Deterministic default-deny policy evaluator with explicit deny precedence.
- Tool-effect/action compatibility, resource matching, and context conditions.
- Approval-required policy decisions.
- Append-only in-memory event log with sequence, hash chaining, verification, immutable snapshots, and replay.
- Policy-gated Builder tool execution boundary.
- Denied requests and approval-pending requests do not invoke the executor.
- Approval flags supplied by callers are ignored at the Builder boundary; an injected trusted verifier must validate approval evidence.
- Execution success/failure produces audit events without raw tool inputs, outputs, or exception messages.

## Validation status

- v0.7 Policy & Event Integrity passed lint, typecheck, tests, and build on commit 2e0c35f.
- Builder execution tests passed in GitHub Actions on commit 3a95136 (lint, typecheck, tests, build).
- The current Builder boundary uses injected executor and approval-verifier interfaces. It is not yet connected to GitHub or filesystem operations.
- Event-log checksum is not cryptographic or tamper-proof; storage is in-memory only.

## Next

1. Validate Builder execution boundary in CI.
2. Implement a repository read adapter with strict path constraints.
3. Assemble project context and a read-only Builder plan.
4. Validate outputs and persist run checkpoints.
5. Add approval-gated write adapter with idempotency and audit events.
6. Create the first complete ZIP checkpoint after the runnable Builder vertical slice.

## Open

- Durable event store, transactions, concurrency, and replay recovery.
- Trusted approval service and policy administration.
- Filesystem/repository sandboxing, secret handling, and credential boundaries.
- Persistence technology and migrations.
- Knowledge and memory retention, conflict resolution, and deprecation.
