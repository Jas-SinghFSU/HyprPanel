import { Command } from './types';

/**
 * The CommandRegistry manages the storage and retrieval of commands.
 * It supports registration of multiple commands, lookup by name or alias,
 * and retrieval of all commands for listing and help functionalities.
 */
export class CommandRegistry {
    private commands: Map<string, Command> = new Map();

    /**
     * Registers a command. If a command with the same name or alias already exists,
     * it will throw an error.
     *
     * @param command - The command to register.
     * @throws If a command with the same name or alias already exists.
     */
    register(command: Command): void {
        if (this.commands.has(command.name)) {
            throw new Error(`Command "${command.name}" is already registered.`);
        }
        this.commands.set(command.name, command);

        if (command.aliases) {
            for (const alias of command.aliases) {
                if (this.commands.has(alias)) {
                    throw new Error(`Alias "${alias}" is already in use.`);
                }
                this.commands.set(alias, command);
            }
        }
    }

    /**
     * Retrieves a command by its name or alias. Returns undefined if not found.
     *
     * @param commandName - The name or alias of the command to retrieve.
     * @returns The command if found, otherwise undefined.
     */
    get(commandName: string): Command | undefined {
        return this.commands.get(commandName);
    }

    /**
     * Retrieves all registered commands, ensuring each command is returned once even if it has aliases.
     *
     * @returns An array of all registered commands.
     */
    getAll(): Command[] {
        const unique = new Set<Command>(this.commands.values());
        return Array.from(unique);
    }
}
