import { describe, expect, it } from "node:test";
import { RealWorldBridge } from "../src/real-world-bridge.js";

describe("real world bridge", () => {
  const complete = (bridge: RealWorldBridge) => {
    ["bootstrap","discover_grove","finish_dialogue","collect_fire","collect_water","finish_transmutation","finish_combat","build_essence_station","unlock_element_lake","save_complete","replay_verified"]
      .forEach((type) => bridge.dispatch({ type }));
  };

  it("drives the complete input-to-persistence slice", () => {
    const bridge = new RealWorldBridge();
    complete(bridge);
    expect(bridge.getState().phase).toBe("complete");
    expect(bridge.getState().replayVerified).toBe(true);
  });

  it("persists through the storage port", () => {
    const first = new RealWorldBridge();
    first.dispatch({ type: "bootstrap" });
    first.dispatch({ type: "discover_grove" });
    first.save();

    const storage = (first as unknown as { storage: { read(key: string): string | null; write(key: string, value: string): void } }).storage;
    const second = new RealWorldBridge(storage);
    expect(second.restore().phase).toBe("dialogue");
  });
});
