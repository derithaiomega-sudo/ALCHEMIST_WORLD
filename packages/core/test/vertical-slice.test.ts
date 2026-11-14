import { describe, expect, it } from "vitest";
import {
  buildVerticalSlice,
  createInitialSliceState,
  isSliceComplete,
  stableSliceChecksum,
} from "../src/vertical-slice.js";

describe("vertical slice", () => {
  it("builds the intent-to-memory sequence in order", () => {
    const result = buildVerticalSlice("Create a project");
    expect(result.steps.map((step) => step.name)).toEqual([
      "intent", "project", "context", "plan", "change",
      "validation", "documentation", "memory", "report",
    ]);
    expect(result.steps[0]?.status).toBe("completed");
    expect(result.steps.at(-1)?.status).toBe("pending");
  });

  it("rejects an empty intent", () => {
    expect(() => buildVerticalSlice("  ")).toThrow("Intent must not be empty");
  });

  it("starts incomplete and produces a stable checksum", () => {
    const state = createInitialSliceState();
    expect(isSliceComplete(state)).toBe(false);
    expect(stableSliceChecksum(state)).toBe(stableSliceChecksum(state));
  });
});
