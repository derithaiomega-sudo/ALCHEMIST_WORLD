import { describe, expect, it } from "node:test";
import { CommandBus } from "../src/command-bus.js";

describe("command bus", () => {
  it("dispatches registered commands and stamps events monotonically", () => {
    const bus = new CommandBus();
    bus.register("ping", () => [{ type: "pong", sequence: 0 }]);
    bus.register("double", () => [
      { type: "one", sequence: 0 },
      { type: "two", sequence: 0 },
    ]);
    expect(bus.dispatch({ type: "ping" })[0]?.sequence).toBe(1);
    expect(bus.dispatch({ type: "double" }).map((e) => e.sequence)).toEqual([2, 3]);
  });

  it("rejects unknown commands", () => {
    const bus = new CommandBus();
    expect(() => bus.dispatch({ type: "missing" })).toThrow("COMMAND_UNKNOWN:missing");
  });
});
