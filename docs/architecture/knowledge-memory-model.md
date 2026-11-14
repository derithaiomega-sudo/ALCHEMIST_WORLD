# Knowledge and Memory Domain Model

## Purpose

The model gives ALCHEMIST WORLD two distinct durable stores: Persistent Knowledge and Persistent Memory. Both are traceable, but they answer different questions.

- Knowledge: what has been curated and can be reused as an accepted reference?
- Memory: what happened, what was experienced, and what lesson was recorded?
- Project Memory: what is the current authoritative project definition?
- Runtime Memory: what must the current execution temporarily retain?

## KnowledgeItem

A KnowledgeItem is a source-attributed, versioned information unit.

| Field | Meaning |
|---|---|
| id | Stable KnowledgeId |
| title / content | Human-readable knowledge |
| scope | world, project, or agent |
| scopeOwnerId | Required for project and agent scope |
| status | draft, verified, deprecated |
| source | origin kind, optional reference, capture timestamp |
| tags | Retrieval and organization labels |
| version | Positive integer |
| createdAt / updatedAt | Lifecycle timestamps |

New knowledge defaults to draft. Verification is a curation decision, not an automatic consequence of capture.

## MemoryRecord

A MemoryRecord is a durable, traceable record of experience or learning.

| Field | Meaning |
|---|---|
| id | Stable MemoryId |
| kind | episodic, semantic, procedural |
| scope | world, project, or agent |
| scopeOwnerId | Required for project and agent scope |
| subjectId | Optional entity the memory concerns |
| summary / content | Condensed lesson and supporting detail |
| sourceEventIds | Event references supporting the record |
| confidence | Numeric value from 0 to 1 |
| status | active, superseded, archived |
| occurredAt / recordedAt | When it happened vs when it was recorded |

Memory confidence is not a verification status. An active memory may still be uncertain.

## Scope rules

- World scope has no scope owner.
- Project scope must identify its project entity.
- Agent scope must identify its agent entity.
- Agents may only read or write scopes granted by their runtime policy.

## Ouroboros and provenance

Ouroboros may propose new knowledge or memory after observing validated outcomes. Every proposal must preserve its source references and be reviewed for relevance, duplication, conflicts, and confidence. Verified knowledge is never silently overwritten.

## Implementation boundary

The first Core implementation provides typed contracts and validated constructors. It does not yet provide database persistence, retrieval ranking, retention jobs, conflict resolution, or an approval interface. Those belong to later adapters and runtime services.
