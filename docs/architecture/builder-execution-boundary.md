# Builder Tool Execution Boundary

## Purpose

The first Builder runtime boundary demonstrates how a bounded agent request reaches a tool without bypassing policy. It is an adapter boundary, not yet a repository-specific executor or a complete agent loop.

## Execution sequence

1. Receive an invocation assembled by the trusted runtime.
2. Evaluate policy with approval defaulted to false, ignoring any caller-supplied approval boolean.
3. If denied, append a permission-denied event and stop.
4. If approval is required, ask the trusted ApprovalVerifier to validate an opaque approval evidence ID.
5. If approval is absent, invalid, or the verifier is unavailable, append an approval-requested event and stop.
6. If allowed, invoke the injected ToolExecutor.
7. Append a tool-executed event for success or failure.
8. Return a typed outcome; do not claim success when execution failed.

## Adapter contracts

- ToolExecutor is the only component that performs the concrete operation.
- ApprovalVerifier is injected by trusted runtime composition and verifies approval evidence against the intended agent, tool, action, and resource.
- Policy evaluation occurs immediately before tool execution.
- The execution boundary records audit summaries without raw input, output, credentials, or exception messages.
- Approval verification fails closed: a verifier error cannot authorize execution.

## Important limitations

- The current implementation is a pure Core boundary with injected interfaces; it does not connect to GitHub, a filesystem, or other external systems by itself.
- The caller that composes the runtime, verifier, and executor must be trusted. Agent-authored input must never be allowed to supply the verifier or approval evidence as trusted state.
- The in-memory event log is not durable and its checksum is not cryptographic.
- Retries, idempotency keys, cancellation, timeouts, output schema validation, and durable approval records remain future work.
