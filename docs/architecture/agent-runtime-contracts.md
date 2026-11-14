# Agent, Capability, and Runtime Contracts

## Agent

An AgentDefinition is a bounded identity and execution policy. It declares:
- stable agent entity ID, name, and goal;
- lifecycle status: draft, active, disabled;
- allowed Skill IDs, Tool IDs, and Permission IDs;
- explicit memory scope and access mode;
- constraints and triggers;
- a machine-readable output contract.

An agent's declared goal does not grant authority. Tool and memory access remain constrained by permission policy.

## Skill

A SkillDefinition is a reusable, versioned capability contract. It declares a name, version, description, input and output contracts, required tools, and required permissions.

A skill describes how a capability is composed. It does not itself execute external operations.

## Tool

A ToolDefinition describes a concrete operation and its effect class: read, write, external, or destructive. It also declares approval mode, required permissions, input/output contracts, and timeout. External and destructive tools cannot use the not_required approval mode.

The runtime must still enforce permissions and approval at call time. A type declaration is not a security boundary by itself.

## Permission

A PermissionGrant binds a subject entity to an allow/deny decision for an action and resource. It can include conditions, creation time, and optional expiry.

The policy evaluator is responsible for combining grants, deny precedence, conditions, and expiry. That evaluator is a later runtime component; this contract only defines the data shape.

## RuntimeRun

A RuntimeRun is a durable-shaped description of one execution's state: agent and goal; queued/running/waiting_approval/succeeded/failed/cancelled status; current step and checkpoints; start, update, and optional completion timestamps.

Runtime execution state remains separate from Persistent Memory. A run may later emit WorldEvents and memory candidates, but a run record is not itself a curated lesson.

## Current implementation boundary

Core now contains typed contracts and basic constructor validation for these records. It does not yet implement a permission policy evaluator, tool execution engine, approval UX or approval persistence, skill loader/registry, durable database adapters, or event append-only storage/replay. These must be implemented in the runtime layer with explicit audit events and tests.
