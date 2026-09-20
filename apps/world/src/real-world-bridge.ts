import { CommandBus, RuntimeCommand, RuntimeEvent } from "../../packages/core/src/command-bus.js";
import { MemoryStorage, StoragePort } from "../../packages/core/src/portability.js";
import { createInitialSliceState, SliceState, stableSliceChecksum } from "../../packages/core/src/vertical-slice.js";

export interface BridgeSnapshot { schemaVersion: 1; state: SliceState; checksum: string; events: readonly RuntimeEvent[]; }

export class RealWorldBridge {
  readonly bus = new CommandBus();
  private state: SliceState = createInitialSliceState();
  private readonly storage: StoragePort;

  constructor(storage: StoragePort = new MemoryStorage()) {
    this.storage = storage;
    this.registerHandlers();
  }

  dispatch(command: RuntimeCommand): RuntimeEvent[] { return this.bus.dispatch(command); }
  getState(): SliceState { return { ...this.state }; }

  save(): BridgeSnapshot {
    const snapshot: BridgeSnapshot = { schemaVersion: 1, state: this.state, checksum: stableSliceChecksum(this.state), events: this.bus.getTrace() };
    this.storage.write("alchemist-world:v2.3", JSON.stringify(snapshot));
    return snapshot;
  }

  restore(): SliceState {
    const raw = this.storage.read("alchemist-world:v2.3");
    if (!raw) return this.getState();
    const snapshot = JSON.parse(raw) as BridgeSnapshot;
    if (snapshot.schemaVersion !== 1) throw new Error("SNAPSHOT_VERSION_UNSUPPORTED");
    if (stableSliceChecksum(snapshot.state) !== snapshot.checksum) throw new Error("SNAPSHOT_CHECKSUM_MISMATCH");
    this.state = { ...snapshot.state };
    return this.getState();
  }

  private registerHandlers(): void {
    const advance = (phase: SliceState["phase"], patch: Partial<SliceState> = {}) => {
      this.state = { ...this.state, ...patch, phase };
    };
    const simple = (type: string, phase: SliceState["phase"], patch: Partial<SliceState> = {}) => {
      this.bus.register(type, () => { advance(phase, patch); return [{ type: `world.${type}`, sequence: 0 }]; });
    };
    simple("bootstrap", "explore");
    simple("discover_grove", "dialogue");
    simple("finish_dialogue", "collect");
    simple("collect_fire", "collect", { fireEssence: 1 });
    simple("collect_water", "transmute", { waterEssence: 1 });
    this.bus.register("finish_transmutation", () => {
      if (this.state.fireEssence < 1 || this.state.waterEssence < 1) throw new Error("TRANS_MISSING_ESSENCE");
      advance("combat", { firstTransmutationComplete: true });
      return [{ type: "world.transmuted", sequence: 0 }];
    });
    simple("finish_combat", "build", { combatComplete: true });
    this.bus.register("build_essence_station", () => {
      if (!this.state.combatComplete) throw new Error("BUILD_PREREQUISITES_MISSING");
      advance("unlock", { essenceStationBuilt: true });
      return [{ type: "world.essence_station_built", sequence: 0 }];
    });
    this.bus.register("unlock_element_lake", () => {
      if (!this.state.essenceStationBuilt) throw new Error("UNLOCK_PREREQUISITE_MISSING");
      advance("persist", { elementLakeUnlocked: true });
      return [{ type: "world.element_lake_unlocked", sequence: 0 }];
    });
    simple("save_complete", "replay", { saveComplete: true });
    simple("replay_verified", "complete", { replayVerified: true });
  }
}
