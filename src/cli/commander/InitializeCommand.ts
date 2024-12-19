import { CommandRegistry } from './Registry';
import { Command } from './types';
import { createExplainCommand } from './helpers';
import { errorHandler } from 'src/lib/utils';
import { BarLayouts } from 'src/lib/types/options';

/**
 * Initializes and registers commands in the provided CommandRegistry.
 *
 * @param registry - The command registry to register commands in.
 */
export function initializeCommands(registry: CommandRegistry): void {
    const commandList: Command[] = [
        {
            name: 'isWindowVisible',
            aliases: ['iwv'],
            description: 'Checks if a specified window is visible.',
            category: 'Window Management',
            args: [
                {
                    name: 'window',
                    description: 'Name of the window to check.',
                    type: 'string',
                    required: true,
                },
            ],
            handler: (args: Record<string, unknown>): boolean => {
                return isWindowVisible(args['window'] as string);
            },
        },
        {
            name: 'setWallpaper',
            aliases: ['sw'],
            description: 'Sets the wallpaper based on the provided input.',
            category: 'Appearance',
            args: [
                {
                    name: 'path',
                    description: 'Path to the wallpaper image.',
                    type: 'string',
                    required: true,
                },
            ],
            handler: (args: Record<string, unknown>): string => {
                try {
                    setWallpaper(args['path'] as string);
                    return 'Wallpaper set successfully.';
                } catch (error) {
                    if (error instanceof Error) {
                        return `Error setting wallpaper: ${error.message}`;
                    }
                    return `Error setting wallpaper: ${error}`;
                }
            },
        },
        {
            name: 'useTheme',
            aliases: ['ut'],
            description: 'Sets the theme based on the provided input.',
            category: 'Appearance',
            args: [
                {
                    name: 'path',
                    description: 'Path to the JSON file of the HyprPanel theme.',
                    type: 'string',
                    required: true,
                },
            ],
            handler: (args: Record<string, unknown>): string => {
                try {
                    useTheme(args['path'] as string);
                    return 'Theme set successfully.';
                } catch (error) {
                    errorHandler(error);
                }
            },
        },
        {
            name: 'systrayItems',
            aliases: ['sti'],
            description: 'Gets a list of IDs for the current applications in the system tray.',
            category: 'Utility',
            args: [],
            handler: (): string => {
                try {
                    return getSystrayItems();
                } catch (error) {
                    errorHandler(error);
                }
            },
        },
        {
            name: 'clearNotifications',
            aliases: ['cno'],
            description: 'Clears all of the notifications that currently exist.',
            category: 'Utility',
            args: [],
            handler: (): string => {
                try {
                    clearAllNotifications();
                    return 'Notifications cleared successfully.';
                } catch (error) {
                    errorHandler(error);
                }
            },
        },
        {
            name: 'setLayout',
            aliases: ['slo'],
            description: 'Sets the layout of the modules on the bar.',
            category: 'Appearance',
            args: [
                {
                    name: 'layout',
                    description: 'Bar layout to apply. Wiki: https://hyprpanel.com/configuration/panel.html#layouts',
                    type: 'object',
                    required: true,
                },
            ],
            handler: (args: Record<string, unknown>): string => {
                try {
                    setLayout(args['layout'] as BarLayouts);
                    return 'Layout applied successfully.';
                } catch (error) {
                    errorHandler(error);
                }
            },
        },
    ];

    commandList.forEach((command) => registry.register(command));
    registry.register(createExplainCommand(registry));
}
