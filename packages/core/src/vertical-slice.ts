
export interface VerticalSliceStep {
  readonly name: "intent" | "project" | "context" | "plan" | "change" | "validation" | "documentation" | "memory" | "report";
  readonly status: "completed" | "pending";
}

export interface VerticalSlice {
  readonly id: string;
  readonly intent: string;
  readonly steps: readonly VerticalSliceStep[];
}

/**
 * Creates the canonical first Alchemist World workflow.
 * This is a planning record only; it does not execute tools or mutate a repository.
 */
export function buildVerticalSlice(intent: string): VerticalSlice {
  const normalizedIntent = intent.trim();
  if (normalizedIntent.length === 0) {
    throw new Error("Intent must not be empty.");
  }

  const names: VerticalSliceStep["name"][] = [
    "intent", "project", "context", "plan", "change",
    "validation", "documentation", "memory", "report",
  ];

  return {
    id: "vertical-slice-v1",
    intent: normalizedIntent,
    steps: names.map((name, index) => ({
      name,
      status: index === 0 ? "completed" : "pending",
    })),
  };
}

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
    state.phase, state.fireEssence, state.waterEssence,
    Number(state.firstTransmutationComplete), Number(state.combatComplete),
    Number(state.essenceStationBuilt), Number(state.elementLakeUnlocked),
    Number(state.saveComplete), Number(state.replayVerified),
  ].join("|");
  let hash = 2166136261;
  for (let i = 0; i < canonical.length; i++) {
    hash ^= canonical.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
