# Policy Engine and Event Integrity

## Policy evaluation

The Core policy evaluator is deterministic and default-deny. A request is evaluated against an active AgentDefinition, its assigned ToolDefinition, the requested action and resource, runtime context, and the grants supplied by the policy source.

Evaluation order:
1. Reject inactive agents.
2. Reject tools not assigned to the agent.
3. Require every permission ID declared by the tool to be assigned to the agent.
4. Find grants for the same subject, action, resource pattern, and context.
5. Apply explicit deny precedence across all matching grants for the subject.
6. Require an active allow grant for every required permission ID.
7. Enforce approval when the tool requires it or runtime policy marks the request as approval-gated.
8. Return a structured decision and matched grant IDs.

### Resource matching

- Exact strings match exact resources.
- `*` matches every resource.
- A suffix `:*` matches resources under the named prefix (for example, `repo:project:*`).

### Conditions

Every condition key must exist in the request context and have the same primitive value. More expressive policy operators, nested paths, and environment-specific evaluators are not part of this initial contract.

### Security boundary

The evaluator does not execute tools, issue credentials, persist grants, or approve requests. The runtime must call it immediately before execution and must not treat agent-authored context as trusted policy input. Approval evidence must come from a trusted approval channel. The current implementation is a domain-level evaluator, not a complete security system.

## Event log

The in-memory event log provides:
- monotonically assigned sequence numbers;
- unique event ID enforcement;
- previous-hash chaining;
- immutable snapshots;
- integrity verification;
- deterministic replay through a caller-supplied reducer.

The current hash is a lightweight deterministic checksum for accidental-change detection, not a cryptographic signature or tamper-proof audit mechanism. A production event store needs durable append-only storage, access controls, cryptographic hashing/signatures, retention rules, concurrency control, and recovery procedures.

## Audit event vocabulary

The WorldEvent vocabulary includes policy denial, approval requested/granted, tool execution, and agent run lifecycle events. Runtime adapters should emit events for decisions and consequential actions, including denied attempts and failed validations.

## Implementation boundary

Core provides the evaluator and in-memory event-log abstraction. It does not yet provide persistent storage, a policy administration interface, a trusted approval service, or a production-grade audit ledger.
