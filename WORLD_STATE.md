# World State

Phase: v0.6 Core Contracts

Current milestone: establish shared domain contracts for entities, relationships, events, persistent knowledge, persistent memory, and the first intent-to-memory workflow.

## Established

- ALCHEMIST WORLD is an AI-native world and workspace, not merely a dashboard skin.
- The Alchemist is the central orchestrator.
- Persistent Knowledge and Persistent Memory are distinct subsystems.
- Project Memory is the versioned repository source of truth.
- Runtime Memory is temporary and scoped to active execution.
- The Transmutation Engine converts intent into plans and validated outcomes.
- The Agent Guild consists of Thinkers, Builders, Guardians, Messengers, Observers, and Explorers.
- Skills, Tools, and Permissions are separate architectural concerns.
- Builder Agent is the first major execution agent.
- Runtime / Execution owns workflow execution state.
- Ouroboros closes the loop through auditable, evidence-based learning.
- Core domain contracts now include Entity, Relationship, WorldEvent, KnowledgeItem, and MemoryRecord.

## Implemented in Core

- Branded identifiers for entities, relationships, events, knowledge, and memory.
- Constructors with input validation for entities, relationships, events, knowledge items, and memory records.
- Persistent knowledge scopes: world, project, agent.
- Persistent memory kinds: episodic, semantic, procedural.
- Persistent memory scopes: world, project, agent.
- Intent-to-memory vertical-slice planner.
- Tests authored for domain contracts and lifecycle invariants.

## In progress

- Verify CI, package install, lint, typecheck, and tests in a real Node environment.
- Review event vocabulary and constructor validation.
- Define skill, tool, permission, and agent contracts.
- Prepare periodic ZIP checkpoints of the full repository.

## Next

1. Add Agent, Skill, Tool, Permission, and RuntimeRun contracts.
2. Add an event log / append-only audit boundary.
3. Implement Builder Agent as a policy-gated workflow.
4. Add Ouroboros outcome capture and candidate-learning review.
5. Create the first full project ZIP checkpoint after the next coherent milestone.

## Open

- Persistence technology and schema evolution.
- Permission policy representation and approval UX.
- Runtime orchestration boundary.
- Knowledge retention, memory retention, and conflict resolution policies.
- CI dependency lockfile and action pin verification.
