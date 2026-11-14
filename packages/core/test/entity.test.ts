import { describe, expect, it } from "vitest";
import { entityId, eventId, relationshipId } from "../src/ids.js";

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
