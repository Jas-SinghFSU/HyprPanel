import { errorHandler } from 'src/lib/utils';
import { Command } from '../types';

export const utilityCommands: Command[] = [
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
];
