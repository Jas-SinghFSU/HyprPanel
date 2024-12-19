import { CommandRegistry } from './Registry';
import { Command } from './types';
import { createExplainCommand } from './helpers';
import { appearanceCommands } from './commands/Appearance';
import { utilityCommands } from './commands/Utility';
import { windowManagementCommands } from './commands/WindowManagement';

/**
 * Initializes and registers commands in the provided CommandRegistry.
 *
 * @param registry - The command registry to register commands in.
 */
export function initializeCommands(registry: CommandRegistry): void {
    const commandList: Command[] = [...appearanceCommands, ...utilityCommands, ...windowManagementCommands];

    commandList.forEach((command) => registry.register(command));

    registry.register(createExplainCommand(registry));
}
