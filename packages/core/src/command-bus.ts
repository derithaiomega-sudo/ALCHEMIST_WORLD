export interface RuntimeCommand { readonly type: string; readonly payload?: unknown; }
export interface RuntimeEvent { readonly type: string; readonly sequence: number; readonly payload?: unknown; }
export type CommandHandler<C extends RuntimeCommand = RuntimeCommand> = (command: C) => RuntimeEvent[];

export class CommandBus {
  private sequence = 0;
  private readonly handlers = new Map<string, CommandHandler>();
  private readonly events: RuntimeEvent[] = [];

  register(type: string, handler: CommandHandler): void {
    if (this.handlers.has(type)) throw new Error(`COMMAND_HANDLER_EXISTS:${type}`);
    this.handlers.set(type, handler);
  }

  dispatch(command: RuntimeCommand): RuntimeEvent[] {
    const handler = this.handlers.get(command.type);
    if (!handler) throw new Error(`COMMAND_UNKNOWN:${command.type}`);
    const produced = handler(command) ?? [];
    const stamped = produced.map((event) => ({ ...event, sequence: ++this.sequence }));
    this.events.push(...stamped);
    return stamped;
  }

  getTrace(): readonly RuntimeEvent[] { return this.events; }
}
