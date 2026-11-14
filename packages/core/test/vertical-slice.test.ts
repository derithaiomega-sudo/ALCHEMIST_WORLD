import { describe, expect, it } from "vitest";
import { buildVerticalSlice } from "../src/vertical-slice.js";

describe("vertical slice", () => {
  it("builds the intent-to-memory sequence", () => {
    const result = buildVerticalSlice("Create a project");
    expect(result.steps[0]?.name).toBe("intent");
    expect(result.steps.at(-1)?.name).toBe("memory");
  });
});
