# World State

Phase: v0.5 Architecture Baseline

Current milestone: establish the top-level system map and implement the first core domain contracts.

## Established

- ALCHEMIST WORLD is an AI-native world and workspace, not merely a dashboard skin.
- The Alchemist is the central orchestrator.
- Persistent Knowledge and Persistent Memory are distinct subsystems.
- The Transmutation Engine converts intent into plans and validated outcomes.
- The Agent Guild consists of Thinkers, Builders, Guardians, Messengers, Observers, and Explorers.
- Skills, Tools, and Permissions are separate architectural concerns.
- Builder Agent is the first major execution agent.
- Runtime / Execution owns workflow execution state.
- Ouroboros closes the loop by learning from observed and validated outcomes.
- The repository is the durable project memory until structured World Memory is implemented.

## In progress

- Core domain package: Entity, Relationship, WorldEvent, and identifier contracts.
- Package and CI baseline validation.

## Next

1. Reconcile existing vertical-slice implementation and tests.
2. Generate and commit package-lock.json.
3. Define knowledge, memory, skill, tool, and permission contracts.
4. Implement Builder Agent's first controlled repository-change workflow.
5. Add outcome capture and Ouroboros feedback as an auditable process.

## Open

- Persistence technology and schema evolution.
- Permission policy representation and approval UX.
- Runtime orchestration boundary.
- Knowledge curation and memory retention policies.
