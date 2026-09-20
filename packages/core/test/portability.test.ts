import { describe, expect, it } from "node:test";
import { MemoryStorage } from "../src/portability.js";

describe("memory storage", () => {
  it("round-trips values", () => {
    const storage = new MemoryStorage();
    storage.write("save", "snapshot");
    expect(storage.read("save")).toBe("snapshot");
  });
});
