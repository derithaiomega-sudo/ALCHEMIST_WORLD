export type SlicePhase =
  | "bootstrap" | "explore" | "dialogue" | "collect" | "transmute"
  | "combat" | "build" | "unlock" | "persist" | "replay" | "complete";

export interface SliceState {
  phase: SlicePhase;
  fireEssence: number;
  waterEssence: number;
  firstTransmutationComplete: boolean;
  combatComplete: boolean;
  essenceStationBuilt: boolean;
  elementLakeUnlocked: boolean;
  saveComplete: boolean;
  replayVerified: boolean;
}

export function createInitialSliceState(): SliceState {
  return {
    phase: "bootstrap",
    fireEssence: 0,
    waterEssence: 0,
    firstTransmutationComplete: false,
    combatComplete: false,
    essenceStationBuilt: false,
    elementLakeUnlocked: false,
    saveComplete: false,
    replayVerified: false,
  };
}

export function isSliceComplete(state: SliceState): boolean {
  return state.phase === "complete"
    && state.firstTransmutationComplete
    && state.combatComplete
    && state.essenceStationBuilt
    && state.elementLakeUnlocked
    && state.saveComplete
    && state.replayVerified;
}

export function stableSliceChecksum(state: SliceState): string {
  const canonical = [
    state.phase,
    state.fireEssence,
    state.waterEssence,
    Number(state.firstTransmutationComplete),
    Number(state.combatComplete),
    Number(state.essenceStationBuilt),
    Number(state.elementLakeUnlocked),
    Number(state.saveComplete),
    Number(state.replayVerified),
  ].join("|");
  let hash = 2166136261;
  for (let i = 0; i < canonical.length; i++) {
    hash ^= canonical.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
