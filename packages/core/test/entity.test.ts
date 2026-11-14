import { describe, expect, it } from "vitest";
import {
  createEntity,
  createRelationship,
  createWorldEvent,
  type EntityId,
} from "../src/entity.js";
import { entityId, eventId, relationshipId } from "../src/ids.js";

const timestamp = "2026-11-14T00:00:00.000Z";

describe("domain identifiers", () => {
  it("accepts stable lowercase identifiers", () => {
    expect(entityId("project_alchemist_world")).toBe("project_alchemist_world");
    expect(relationshipId("project-owns-artifact")).toBe("project-owns-artifact");
    expect(eventId("event_001")).toBe("event_001");
  });

  it("rejects invalid identifiers", () => {
    expect(() => entityId("A")).toThrow("Invalid entity id");
    expect(() => relationshipId("has spaces")).toThrow("Invalid relationship id");
    expect(() => eventId("UPPERCASE")).toThrow("Invalid event id");
  });
});

describe("domain constructors", () => {
  const projectId = entityId("project_aworld");
  const artifactId = entityId("artifact_codex");

  it("creates immutable entities with validated timestamps", () => {
    const entity = createEntity({
      id: projectId,
      kind: "project",
      name: "Alchemist World",
      data: { phase: "core" },
    }, timestamp);

    expect(entity.createdAt).toBe(timestamp);
    expect(Object.isFrozen(entity)).toBe(true);
    expect(Object.isFrozen(entity.data)).toBe(true);
  });

  it("rejects empty names and invalid timestamp ordering", () => {
    expect(() => createEntity({
      id: projectId, kind: "project", name: " ", data: {},
    }, timestamp)).toThrow("Entity name must not be empty.");

    expect(() => createEntity({
      id: projectId, kind: "project", name: "World", data: {},
      createdAt: "2026-11-15T00:00:00.000Z",
      updatedAt: timestamp,
    }, timestamp)).toThrow("updatedAt cannot be earlier");
  });

  it("creates directed relationships", () => {
    const relation = createRelationship({
      id: relationshipId("project-creates-artifact"),
      kind: "created",
      from: projectId,
      to: artifactId,
      properties: {},
    }, timestamp);
    expect(relation.from).toBe(projectId);
    expect(relation.to).toBe(artifactId);
    expect(Object.isFrozen(relation.properties)).toBe(true);
  });

  it("creates immutable world events", () => {
    const event = createWorldEvent({
      id: eventId("event_created_01"),
      type: "entity.created",
      subjectId: projectId as EntityId,
      payload: { kind: "project" },
    }, timestamp);
    expect(event.occurredAt).toBe(timestamp);
    expect(Object.isFrozen(event.payload)).toBe(true);
  });
});
