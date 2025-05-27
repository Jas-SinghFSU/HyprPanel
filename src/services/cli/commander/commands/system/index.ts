import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import AstalWp from 'gi://AstalWp?version=0.1';
import { Command } from '../../types';
import { execAsync, Gio, GLib } from 'astal';
import { checkDependencies } from './checkDependencies';
import { getSystrayItems } from 'src/services/cli/helpers/systray';
import { idleInhibit } from 'src/lib/window/visibility';
import { errorHandler } from 'src/core/errors/handler';
import { clearNotifications } from 'src/lib/shared/notifications';
import options from 'src/configuration';
import { listCpuTempSensors } from './listSensors';

const { clearDelay } = options.notifications;
const notifdService = AstalNotifd.get_default();
const audio = AstalWp.get_default();

export const utilityCommands: Command[] = [
    {
        name: 'systrayItems',
        aliases: ['sti'],
        description: 'Gets a list of IDs for the current applications in the system tray.',
        category: 'System',
        args: [],
        handler: (): string => {
            try {
                return getSystrayItems() ?? 'No items found!';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'clearNotifications',
        aliases: ['cno'],
        description: 'Clears all of the notifications that currently exist.',
        category: 'System',
        args: [],
        handler: (): string => {
            try {
                const allNotifications = notifdService.get_notifications();
                clearNotifications(allNotifications, clearDelay.get());

                return 'Notifications cleared successfully.';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'toggleDnd',
        aliases: ['dnd'],
        description: 'Toggled the Do Not Disturb mode for notifications.',
        category: 'System',
        args: [],
        handler: (): string => {
            try {
                notifdService.set_dont_disturb(!notifdService.dontDisturb);

                return notifdService.dontDisturb ? 'Enabled' : 'Disabled';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'adjustVolume',
        aliases: ['vol'],
        description: 'Adjusts the volume of the default audio output device.',
        category: 'System',
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
                const speaker = audio?.defaultSpeaker;

                if (speaker === undefined) {
                    throw new Error('A default speaker was not found.');
                }

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
        name: 'isInhibiting',
        aliases: ['isi'],
        description: 'Returns the status of the Idle Inhibitor.',
        category: 'System',
        args: [],
        handler: (): boolean => {
            try {
                return idleInhibit.get();
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'idleInhibit',
        aliases: ['idi'],
        description:
            'Enables/Disables the Idle Inhibitor. Toggles the Inhibitor if no parameter is provided.',
        category: 'System',
        args: [
            {
                name: 'shouldInhibit',
                description: 'The boolean value that enables/disables the inhibitor.',
                type: 'boolean',
                required: false,
            },
        ],
        handler: (args: Record<string, unknown>): boolean => {
            try {
                const shouldInhibit = args['shouldInhibit'] ?? idleInhibit.get() === false;
                idleInhibit.set(Boolean(shouldInhibit));

                return idleInhibit.get();
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'migrateConfig',
        aliases: ['mcfg'],
        description: 'Migrates the configuration file from the old location to the new one.',
        category: 'System',
        args: [],
        handler: (): string => {
            const oldPath = `${GLib.get_user_cache_dir()}/ags/hyprpanel/options.json`;

            try {
                const oldFile = Gio.File.new_for_path(oldPath);
                const newFile = Gio.File.new_for_path(CONFIG_FILE);

                if (oldFile.query_exists(null)) {
                    oldFile.move(newFile, Gio.FileCopyFlags.OVERWRITE, null, null);
                    return `Configuration file moved to ${CONFIG_FILE}`;
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
        category: 'System',
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
        name: 'listCpuSensors',
        aliases: ['lcs'],
        description: 'Lists all available CPU temperature sensors and shows the current one.',
        category: 'System',
        args: [],
        handler: (): string => {
            try {
                return listCpuTempSensors();
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'restart',
        aliases: ['r'],
        description: 'Restarts HyprPanel.',
        category: 'System',
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
        category: 'System',
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
