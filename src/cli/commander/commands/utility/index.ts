import { errorHandler } from 'src/lib/utils';
import { Command } from '../../types';
import { execAsync, Gio, GLib } from 'astal';
import { checkDependencies } from './checkDependencies';
import { audioService } from 'src/lib/constants/services';

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
    {
        name: 'adjustVolume',
        aliases: ['vol'],
        description: 'Adjusts the volume of the default audio output device.',
        category: 'Utility',
        args: [
            {
                name: 'volume',
                description: 'A positive or negative number to adjust the volume by.',
                type: 'number',
                required: true,
            },
        ],
        handler: (args: Record<string, unknown>): number => {
            try {
                const speaker = audioService.defaultSpeaker;
                const volumeInput = Number(args['volume']) / 100;

                if (options.menus.volume.raiseMaximumVolume.get()) {
                    speaker.set_volume(Math.min(speaker.volume + volumeInput, 1.5));
                } else {
                    speaker.set_volume(Math.min(speaker.volume + volumeInput, 1));
                }

                return Math.round((speaker.volume + volumeInput) * 100);
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'migrateConfig',
        aliases: ['mcfg'],
        description: 'Migrates the configuration file from the old location to the new one.',
        category: 'Utility',
        args: [],
        handler: (): string => {
            const oldPath = `${GLib.get_user_cache_dir()}/ags/hyprpanel/options.json`;

            try {
                const oldFile = Gio.File.new_for_path(oldPath);
                const newFile = Gio.File.new_for_path(CONFIG);

                if (oldFile.query_exists(null)) {
                    oldFile.move(newFile, Gio.FileCopyFlags.OVERWRITE, null, null);
                    return `Configuration file moved to ${CONFIG}`;
                } else {
                    return `Old configuration file does not exist at ${oldPath}`;
                }
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'checkDependencies',
        aliases: ['chd'],
        description: 'Checks the status of required and optional dependencies.',
        category: 'Utility',
        args: [],
        handler: (): string => {
            try {
                return checkDependencies();
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'restart',
        aliases: ['r'],
        description: 'Restarts HyprPanel.',
        category: 'Utility',
        args: [],
        handler: (): string => {
            try {
                execAsync('bash -c "hyprpanel -q; hyprpanel"');
                return '';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'quit',
        aliases: ['q'],
        description: 'Quits HyprPanel.',
        category: 'Utility',
        args: [],
        handler: (): string => {
            try {
                execAsync('bash -c "hyprpanel -q"');
                return '';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
];
