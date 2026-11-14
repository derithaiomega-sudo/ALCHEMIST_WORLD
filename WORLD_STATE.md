# World State

Phase: v0.6 Core Contracts

Current milestone: shared domain contracts for the world model, persistent knowledge and memory, bounded agents, capabilities, permissions, and runtime execution records.

## Established

- ALCHEMIST WORLD is an AI-native world and workspace, not merely a dashboard skin.
- The Alchemist is the central orchestrator.
- Persistent Knowledge, Persistent Memory, Project Memory, and Runtime Memory are distinct concerns.
- The Transmutation Engine converts intent into plans and validated outcomes.
- The Agent Guild consists of Thinkers, Builders, Guardians, Messengers, Observers, and Explorers.
- Skills define reusable capability contracts; Tools define concrete operations; Permissions define authority.
- Builder Agent is the first major execution agent.
- Runtime / Execution owns active workflow state.
- Ouroboros proposes evidence-based lessons from observed outcomes.

## Implemented in Core

- Entity, Relationship, and WorldEvent contracts with branded identifiers.
- Validated constructors for core domain objects.
- KnowledgeItem with source attribution, scope, status, tags, and version.
- MemoryRecord with episodic / semantic / procedural kinds, scope, confidence, and source event references.
- SkillDefinition and ToolDefinition contracts.
- PermissionGrant data contract with expiry and validation.
- AgentDefinition with explicit skills, tools, permissions, constraints, triggers, and memory access.
- RuntimeRun with status, checkpoints, and lifecycle timestamps.
- Intent-to-memory vertical-slice planner.
- Automated GitHub Actions quality workflow: lint, typecheck, tests, and build passed on commit 3dd90fe.

## In progress

- Permission policy evaluator and deny precedence.
- Event log and audit boundary.
- Tool execution and approval workflow.
- Skill registry and loading boundary.
- Persistence adapter and schema evolution.
- Periodic full-repository ZIP checkpoints.

## Next

1. Implement the policy evaluator: subject + action + resource + conditions + expiry.
2. Add an append-only WorldEvent store and replay contract.
3. Build the first read-only Builder Agent runtime flow.
4. Add approval-gated write operations.
5. Implement Ouroboros outcome capture and review.
6. Create the next ZIP checkpoint after the first runnable Builder vertical slice.

## Open

- Persistence technology and migration strategy.
- Permission conflict resolution and approval UX.
- Memory retention, knowledge deprecation, and conflict resolution.
- Runtime orchestration boundary and tool adapter model.
