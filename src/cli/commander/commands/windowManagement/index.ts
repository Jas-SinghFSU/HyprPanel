import { errorHandler } from 'src/lib/utils';
import { Command } from '../../types';
import { App } from 'astal/gtk3';

export const windowManagementCommands: Command[] = [
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
        name: 'toggleWindow',
        aliases: ['t'],
        description: 'Toggles the visibility of a specified window.',
        category: 'Window Management',
        args: [
            {
                name: 'window',
                description: 'The name of the window to toggle.',
                type: 'string',
                required: true,
            },
        ],
        handler: (args: Record<string, unknown>): string => {
            try {
                const windowName = args['window'] as string;
                const foundWindow = App.get_window(windowName);

                if (!foundWindow) {
                    throw new Error(`Window ${args['window']} not found.`);
                }

                const windowStatus = foundWindow.visible ? 'hidden' : 'visible';

                App.toggle_window(windowName);

                return windowStatus;
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'listWindows',
        aliases: ['lw'],
        description: 'Gets a list of all HyprPanel windows.',
        category: 'Window Management',
        args: [],
        handler: (): string => {
            try {
                const windowList = App.get_windows().map((window) => window.name);
                return windowList.join('\n');
            } catch (error) {
                errorHandler(error);
            }
        },
    },
];
