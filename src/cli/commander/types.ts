export interface PositionalArg {
    name: string;
    description: string;
    type: 'string' | 'number' | 'boolean' | 'object';
    required?: boolean;
    default?: string | number | boolean | Record<string, unknown>;
}

export type HandlerReturn = unknown | Promise<unknown>;

export interface Command {
    name: string;
    aliases?: string[];
    description: string;
    category: string;
    args: PositionalArg[];
    handler: (args: Record<string, unknown>) => HandlerReturn;
}

export interface ParsedCommand {
    command: Command;
    args: Record<string, unknown>;
}

export interface ResponseCallback {
    (res: unknown): void;
}

export interface CategoryMap {
    [category: string]: Command[];
}
