import {
  createInitialSliceState,
  isSliceComplete,
  stableSliceChecksum,
} from "../src/vertical-slice";

describe("vertical slice", () => {
  it("starts in bootstrap with no progression", () => {
    const state = createInitialSliceState();
    expect(state.phase).toBe("bootstrap");
    expect(state.fireEssence).toBe(0);
    expect(state.waterEssence).toBe(0);
    expect(isSliceComplete(state)).toBe(false);
  });

  it("requires every release-candidate milestone", () => {
    const state = {
      ...createInitialSliceState(),
      phase: "complete" as const,
      firstTransmutationComplete: true,
      combatComplete: true,
      essenceStationBuilt: true,
      elementLakeUnlocked: true,
      saveComplete: true,
      replayVerified: true,
    };
    expect(isSliceComplete(state)).toBe(true);
  });

  it("produces a stable checksum for identical canonical state", () => {
    const a = createInitialSliceState();
    const b = createInitialSliceState();
    expect(stableSliceChecksum(a)).toBe(stableSliceChecksum(b));
  });
});
