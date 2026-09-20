export interface StoragePort {
  read(key: string): string | null;
  write(key: string, value: string): void;
}

export class MemoryStorage implements StoragePort {
  private readonly values = new Map<string, string>();
  read(key: string): string | null { return this.values.get(key) ?? null; }
  write(key: string, value: string): void { this.values.set(key, value); }
}

export interface InputPort<C> { send(command: C): void; }
export interface PersistencePort { save(): void; restore(): void; }
