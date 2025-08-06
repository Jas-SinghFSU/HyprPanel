import { CommandRegistry } from './Registry';
import { Command } from './types';
import { createExplainCommand } from './helpers';
import { appearanceCommands } from './commands/appearance';
import { utilityCommands } from './commands/system/utility';
import { windowManagementCommands } from './commands/windowManagement';
import { mediaCommands } from './commands/modules/media';

/**
 * Initializes and registers commands in the provided CommandRegistry.
 *
 * @param registry - The command registry to register commands in.
 */
export function initializeCommands(registry: CommandRegistry): void {
    const commandList: Command[] = [
        ...appearanceCommands,
        ...utilityCommands,
        ...windowManagementCommands,
        ...mediaCommands,
    ];

    commandList.forEach((command) => registry.register(command));

    registry.register(createExplainCommand(registry));
}
