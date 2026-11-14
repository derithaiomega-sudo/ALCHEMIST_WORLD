# Alchemist World

AI-native operating environment for turning intent into reality.

Version: 0.5-architecture-baseline

Source of truth: this repository plus its versioned project memory and, as implemented, structured World Memory.

Core loop: INTENT → CLARITY → SYSTEM → CODE → ACTION → REALITY → LEARNING ↺

## System identity

ALCHEMIST WORLD is an integrated AI-native world and workspace. Its world metaphor is both an interaction model and an architectural map: projects, knowledge, memory, agents, skills, tools, permissions, and execution belong to one coherent environment.

## Top-level systems

- World / Workspace
- Alchemist — central orchestrator
- Persistent Knowledge — curated reusable knowledge
- Persistent Memory — durable record of entities, relationships, events, and state
- Transmutation Engine — intent-to-plan and plan-to-outcome pipeline
- Agent Guild — Thinkers, Builders, Guardians, Messengers, Observers, Explorers
- Skills — versioned procedures and capability contracts
- Tools — explicit operation interfaces
- Permissions — independent authorization and policy boundary
- Builder Agent — first major implementation agent
- Runtime / Execution — workflow and agent execution
- Ouroboros — evidence-based outcome learning loop

## Core transformation

Chaos → Clarity → System → Code → Action → Reality → Learning.

## Architectural principles

1. Agents are bounded capabilities, not unrestricted chat personas.
2. Knowledge, persistent memory, and temporary runtime state are separate concerns.
3. Skills define procedures; tools expose operations; permissions govern access.
4. The Alchemist coordinates specialized agents and assembles context.
5. The Ouroboros loop learns only from captured and validated outcomes.
6. Consequential or external actions require explicit authorization and must be auditable.
7. The repository is the current durable project memory; structured World Memory will extend it without making essential knowledge inaccessible.

See [System Map](docs/architecture/system-map.md) for subsystem responsibilities, interaction flow, and implementation sequence.
