# Memory Architecture

ALCHEMIST WORLD separates durable knowledge, durable experience, project source material, and temporary execution state. These stores have different purposes and must not be collapsed into one generic memory bucket.

## 1. Project Memory

Versioned, human-readable repository files: manifests, architecture decisions, specifications, roadmaps, source code, tests, and operational notes.

- Primary purpose: preserve the authoritative project definition and implementation history.
- Ownership: the project and its maintainers.
- Change policy: changes are reviewed and versioned with the project.
- Rule: critical project knowledge must not exist only in model context.

## 2. Persistent Knowledge

Curated statements and reusable information that the world can rely on.

A KnowledgeItem contains:
- stable ID, title, and content;
- scope: world, project, or agent;
- optional scope owner for project- and agent-scoped knowledge;
- source attribution and capture timestamp;
- tags, status, version, and lifecycle timestamps.

Knowledge lifecycle:
1. Capture a candidate with its source.
2. Keep new knowledge in draft state.
3. Validate its evidence, scope, freshness, and conflicts.
4. Promote it to verified when accepted.
5. Version changes; do not silently overwrite established knowledge.
6. Deprecate knowledge that is no longer reliable while preserving its history.

Knowledge is not a transcript. It is the curated, reusable result of understanding sources.

## 3. Persistent Memory

Durable records of what happened, what was learned, and how the system or an agent behaved.

A MemoryRecord contains:
- stable ID and kind: episodic, semantic, or procedural;
- scope: world, project, or agent;
- optional subject and scope owner;
- concise summary and supporting content;
- source event IDs;
- confidence, status, occurrence time, and recording time.

Memory lifecycle:
1. Observe an event or outcome.
2. Record a traceable memory candidate with source event references.
3. Evaluate confidence, relevance, duplication, and sensitivity.
4. Store accepted records as active.
5. Mark replaced records as superseded; archive records when no longer active.
6. Keep the original event trail so later review can reconstruct why a memory exists.

Memory is experience and state, not automatically trusted truth. A memory can inform knowledge, but does not become verified knowledge without curation.

## 4. Runtime Memory

Temporary execution state for an active workflow: current plan, step, tool result handles, retries, checkpoints, and pending approvals.

- It is scoped to a run.
- It is not automatically promoted into persistent memory.
- It can be discarded after a run once required outcomes and audit events are safely recorded.

## Ouroboros feedback loop

OBSERVE → CAPTURE EVENT → EXTRACT CANDIDATE → VALIDATE → CURATE → UPDATE KNOWLEDGE / RECORD MEMORY → REVIEW OUTCOME.

Ouroboros proposes and validates lessons; it must not silently rewrite verified knowledge or agent permissions.

## Invariants

- Every durable knowledge item has source attribution.
- Every durable memory has an occurrence time and recording time.
- Non-world scopes identify their owner.
- Confidence is explicit and bounded from 0 to 1.
- Source events remain addressable.
- Runtime state is not confused with durable memory.
- No critical project knowledge exists only in model context.
