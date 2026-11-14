import { describe, expect, it } from "vitest";
import { createKnowledgeItem } from "../src/knowledge.js";
import { createMemoryRecord } from "../src/memory.js";
import { entityId, eventId, knowledgeId, memoryId } from "../src/ids.js";

const timestamp = "2026-11-14T00:00:00.000Z";
const projectId = entityId("project_aworld");
const agentId = entityId("agent_builder");

describe("persistent knowledge", () => {
  it("creates versioned, source-attributed knowledge", () => {
    const item = createKnowledgeItem({
      id: knowledgeId("knowledge_core_contracts"),
      title: "Core contracts",
      content: "Entities, relationships and events form the shared domain model.",
      scope: "project",
      scopeOwnerId: projectId,
      source: { kind: "repository", reference: "docs/architecture/core-domain-model.md", capturedAt: timestamp },
      tags: ["architecture", "core"],
    }, timestamp);

    expect(item.status).toBe("draft");
    expect(item.version).toBe(1);
    expect(item.tags).toEqual(["architecture", "core"]);
    expect(Object.isFrozen(item)).toBe(true);
    expect(Object.isFrozen(item.tags)).toBe(true);
  });

  it("requires an owner for non-world scopes", () => {
    expect(() => createKnowledgeItem({
      id: knowledgeId("knowledge_scope_test"),
      title: "Scoped",
      content: "A scoped knowledge item.",
      scope: "project",
      source: { kind: "user", capturedAt: timestamp },
    }, timestamp)).toThrow("require a scope owner");
  });

  it("rejects an empty title and invalid version", () => {
    const base = {
      id: knowledgeId("knowledge_invalid"),
      title: " ",
      content: "Body",
      scope: "world" as const,
      source: { kind: "user" as const, capturedAt: timestamp },
    };
    expect(() => createKnowledgeItem(base, timestamp)).toThrow("Knowledge title");
    expect(() => createKnowledgeItem({ ...base, title: "Valid", version: 0 }, timestamp))
      .toThrow("positive integer");
  });
});

describe("persistent memory", () => {
  it("records a source-linked agent memory", () => {
    const record = createMemoryRecord({
      id: memoryId("memory_builder_lesson"),
      kind: "procedural",
      scope: "agent",
      scopeOwnerId: agentId,
      summary: "Validate before reporting completion",
      content: "The Builder must run the defined validation steps before reporting success.",
      sourceEventIds: [eventId("event_validation_01")],
      confidence: 0.95,
      occurredAt: timestamp,
    }, timestamp);

    expect(record.status).toBe("active");
    expect(record.recordedAt).toBe(timestamp);
    expect(record.sourceEventIds).toHaveLength(1);
    expect(Object.isFrozen(record.sourceEventIds)).toBe(true);
  });

  it("rejects invalid confidence and missing scope owner", () => {
    const base = {
      id: memoryId("memory_invalid"),
      kind: "episodic" as const,
      scope: "world" as const,
      summary: "A world event",
      content: "An observed event.",
      confidence: 1.1,
      occurredAt: timestamp,
    };
    expect(() => createMemoryRecord(base, timestamp)).toThrow("between 0 and 1");
    expect(() => createMemoryRecord({
      ...base, confidence: 0.5, scope: "agent",
    }, timestamp)).toThrow("require a scope owner");
  });
});
