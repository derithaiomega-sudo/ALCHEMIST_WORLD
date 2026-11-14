# ALCHEMIST WORLD — System Map

This document defines the top-level architecture of ALCHEMIST WORLD. It is the architectural map used to organize implementation, documentation, and future agent capabilities.

## System topology

```text
ALCHEMIST WORLD
├── World / Workspace
├── Alchemist
├── Persistent Knowledge
├── Persistent Memory
├── Transmutation Engine
├── Agent Guild
│   ├── Thinkers
│   ├── Builders
│   ├── Guardians
│   ├── Messengers
│   ├── Observers
│   └── Explorers
├── Skills
├── Tools
├── Permissions
├── Builder Agent
├── Runtime / Execution
└── Ouroboros
    └── system learns from outcomes
```

## Responsibilities

| Subsystem | Responsibility |
|---|---|
| World / Workspace | User-facing and project-facing environment where work, artifacts, entities, and activity are organized. |
| Alchemist | Central orchestrator: interprets intent, assembles context, delegates bounded work, and coordinates transmutation. |
| Persistent Knowledge | Curated, reusable knowledge: documentation, references, decisions, patterns, and validated discoveries. |
| Persistent Memory | Durable record of entities, relationships, events, project state, and relevant agent experience. |
| Transmutation Engine | Converts intent into structured plans and plans into validated changes or artifacts. |
| Agent Guild | Specialized agents grouped by capability and responsibility. |
| Skills | Versioned capability contracts describing procedures, inputs, outputs, and validation. |
| Tools | Explicitly integrated operations and external system interfaces. |
| Permissions | Policy boundary governing which agents may use which tools, resources, and actions. |
| Builder Agent | First major execution agent; changes the repository through a controlled observe-plan-execute-validate-document loop. |
| Runtime / Execution | Runs workflows and agents, tracks execution state, and captures results. |
| Ouroboros | Feedback cycle that evaluates outcomes and feeds validated lessons back into knowledge, memory, skills, and system improvements. |

## Agent Guild

- **Thinkers** — analysis, reasoning, decomposition, and planning.
- **Builders** — implementation, artifact creation, and integration.
- **Guardians** — policy, safety, quality, and invariant checks.
- **Messengers** — communication, reporting, and coordination.
- **Observers** — monitoring, evaluation, and state inspection.
- **Explorers** — research, discovery, and option generation.

These are capability families, not unrestricted personas. Every agent instance must have an explicit goal, skills, tools, memory scope, permissions, constraints, and output contract.

## Core interaction flow

1. A user expresses an intent in the World / Workspace.
2. The Alchemist clarifies the intent and assembles relevant persistent knowledge and memory.
3. The Transmutation Engine produces a bounded plan and selects suitable guild capabilities.
4. Permissions are checked before tools or external effects are used.
5. Runtime / Execution runs the approved work.
6. Guardians and relevant validators inspect the result.
7. The system records artifacts, events, decisions, and validated discoveries.
8. Ouroboros evaluates outcomes and proposes improvements to knowledge, memory, skills, and workflows.

## Ouroboros feedback loop

`OBSERVE → CAPTURE OUTCOME → EVALUATE → EXTRACT LESSON → VALIDATE → UPDATE KNOWLEDGE / MEMORY / SKILL → APPLY → OBSERVE AGAIN`

Learning must be evidence-based. A failed run is not automatically a lesson; proposed changes should be validated, attributable, and reversible. The system must not silently expand permissions or execute consequential changes merely because a feedback loop suggested them.

## Architectural boundaries

- Knowledge and memory are related but distinct: knowledge is curated and reusable; memory records what happened and the context in which it happened.
- Skills describe how work should be performed; tools provide the operations through which work is performed.
- Permissions are enforced independently of agent intent or skill instructions.
- Runtime state is temporary unless explicitly committed to persistent memory.
- The Alchemist coordinates; specialized agents perform bounded tasks.
- The Builder Agent is the first end-to-end implementation target, not the entirety of the system.

## Implementation sequence

1. Core domain contracts: Entity, Relationship, WorldEvent, identifiers.
2. Persistent knowledge and memory contracts and storage boundaries.
3. Permission model and tool contracts.
4. Runtime orchestration and Alchemist context assembly.
5. Builder Agent vertical slice.
6. Guild expansion and Ouroboros feedback automation.
7. World / Workspace experience.

The sequence is an implementation plan, not a restriction on the final product architecture.
