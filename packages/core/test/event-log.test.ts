import { describe, expect, it } from "vitest";
import { createWorldEvent } from "../src/entity.js";
import { InMemoryEventLog } from "../src/event-log.js";
import { entityId, eventId } from "../src/ids.js";

const actorId = entityId("agent_builder");
const timestamp = "2026-11-14T03:00:00.000Z";

function event(id: string, value: number) {
  return createWorldEvent({
    id: eventId(id),
    type: "agent.action.completed",
    actorId,
    payload: { value, nested: { safe: true } },
  }, timestamp);
}

describe("append-only event log", () => {
  it("appends events with a verifiable hash chain", () => {
    const log = new InMemoryEventLog();
    const first = log.append(event("event_builder_001", 1));
    const second = log.append(event("event_builder_002", 2));

    expect(first.sequence).toBe(1);
    expect(first.previousHash).toBe("GENESIS");
    expect(second.sequence).toBe(2);
    expect(second.previousHash).toBe(first.hash);
    expect(log.verify()).toBe(true);
    expect(log.size).toBe(2);
  });

  it("rejects duplicate event IDs", () => {
    const log = new InMemoryEventLog();
    log.append(event("event_builder_dup", 1));
    expect(() => log.append(event("event_builder_dup", 2))).toThrow("Duplicate event id");
  });

  it("returns immutable snapshots and deeply freezes event payloads", () => {
    const log = new InMemoryEventLog();
    log.append(event("event_builder_immutable", 1));
    const entries = log.readAll();
    expect(Object.isFrozen(entries)).toBe(true);
    expect(Object.isFrozen(entries[0]?.event.payload.nested)).toBe(true);
  });

  it("replays events deterministically through a reducer", () => {
    const log = new InMemoryEventLog();
    log.append(event("event_builder_replay1", 2));
    log.append(event("event_builder_replay2", 3));
    const total = log.replay(0, (state, item) => state + Number(item.payload.value));
    expect(total).toBe(5);
  });
});
