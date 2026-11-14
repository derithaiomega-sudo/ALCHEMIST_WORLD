import type { WorldEvent } from "./entity.js";

export interface EventEnvelope<TPayload extends Record<string, unknown> = Record<string, unknown>> {
  readonly sequence: number;
  readonly previousHash: string;
  readonly hash: string;
  readonly event: WorldEvent<TPayload>;
}

function canonicalize(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? String(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) =>
    `${JSON.stringify(key)}:${canonicalize(record[key])}`).join(",")}}`;
}

function hashText(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function cloneAndFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    return Object.freeze(value.map((item) => cloneAndFreeze(item))) as T;
  }
  const clone = Object.fromEntries(Object.entries(value as Record<string, unknown>)
    .map(([key, item]) => [key, cloneAndFreeze(item)]));
  return Object.freeze(clone) as T;
}

function eventHash(sequence: number, previousHash: string, event: WorldEvent): string {
  return hashText(`${sequence}| ${previousHash}| ${canonicalize(event)}`);
}

/**
 * In-memory append-only event log.
 * Hashes detect accidental edits; they are not cryptographic signatures.
 * A durable adapter and cryptographic integrity layer are future work.
 */
export class InMemoryEventLog {
  private readonly entries: EventEnvelope[] = [];
  private readonly eventIds = new Set<string>();

  append<TPayload extends Record<string, unknown>>(
    event: WorldEvent<TPayload>,
  ): EventEnvelope<TPayload> {
    if (this.eventIds.has(event.id)) throw new Error(`Duplicate event id: ${event.id}`);
    const sequence = this.entries.length + 1;
    const previousHash = this.entries.at(-1)?.hash ?? "GENESIS";
    const hash = eventHash(sequence, previousHash, event);
    const envelope = Object.freeze({
      sequence,
      previousHash,
      hash,
      event: cloneAndFreeze(event),
    });
    this.entries.push(envelope);
    this.eventIds.add(event.id);
    return envelope;
  }

  readAll(): readonly EventEnvelope[] {
    return Object.freeze([...this.entries]);
  }

  verify(): boolean {
    let previousHash = "GENESIS";
    for (let index = 0; index < this.entries.length; index++) {
      const entry = this.entries[index];
      if (entry === undefined) return false;
      if (entry.sequence !== index + 1 || entry.previousHash !== previousHash) return false;
      if (eventHash(entry.sequence, entry.previousHash, entry.event) !== entry.hash) return false;
      previousHash = entry.hash;
    }
    return true;
  }

  replay<TState>(
    initialState: TState,
    reducer: (state: TState, event: WorldEvent) => TState,
  ): TState {
    if (!this.verify()) throw new Error("Event log integrity verification failed.");
    return this.entries.reduce((state, entry) => reducer(state, entry.event), initialState);
  }

  get size(): number {
    return this.entries.length;
  }
}
