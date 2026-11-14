# Roadmap

## v0.5 — Architecture baseline
- [x] Define top-level ALCHEMIST WORLD system map
- [x] Separate Persistent Knowledge, Persistent Memory, and Runtime state
- [x] Define Agent Guild capability families
- [x] Establish Skills, Tools, and Permissions as distinct subsystems

## v0.6 — Core contracts
- [x] Entity, Relationship, WorldEvent, and stable identifiers
- [x] Knowledge item and provenance contracts
- [x] Memory record and source-event references
- [x] Skill manifest and tool contracts
- [x] Agent definition and runtime execution records

## v0.7 — Policy & Event Integrity
- [x] Deterministic default-deny policy evaluator
- [x] Explicit deny precedence
- [x] Resource patterns and context conditions
- [x] Tool-effect/action compatibility checks
- [x] Approval-required decision state
- [x] Append-only in-memory event log and replay
- [x] Hash-chain integrity verification
- [ ] Durable event storage and concurrency control
- [ ] Trusted approval service and policy administration

## v0.8 — Builder Agent vertical slice
- [x] Policy-gated tool execution boundary
- [x] Denied and approval-pending calls stop before executor invocation
- [x] Trusted approval evidence verification fails closed
- [x] Execution outcomes create audit events
- [ ] Repository read adapter and safe path constraints
- [ ] Read-only Builder workflow: observe, load context, plan, inspect
- [ ] Output contract validation and execution reporting
- [ ] Approval-gated repository write adapter
- [ ] Durable run checkpoints and recovery

## v0.9 — Agent Guild
- [ ] Thinkers
- [ ] Builders
- [ ] Guardians
- [ ] Messengers
- [ ] Observers
- [ ] Explorers

## v1.0 — Ouroboros
- [ ] Capture execution outcomes
- [ ] Evaluate results against explicit criteria
- [ ] Extract candidate lessons
- [ ] Validate and version knowledge / memory / skill updates
- [ ] Feed approved improvements into future runs

## Later — World / Workspace experience
- [ ] World navigation and project spaces
- [ ] Knowledge and memory exploration
- [ ] Agent and execution observability
- [ ] Artifact and workflow interaction
