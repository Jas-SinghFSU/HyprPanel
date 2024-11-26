import GObject, { GLib, property, register, signal } from 'astal/gobject';
import { dependencies, sh } from '../lib/utils';
import options from '../options';
import Hyprland from 'gi://AstalHyprland';
import { execAsync } from 'astal/process';
import { monitorFile } from 'astal/file';

const hyprland = Hyprland.get_default();

const WP = `${GLib.get_home_dir()}/.config/background`;

@register({ GTypeName: 'Wallpaper' })
class Wallpaper extends GObject.Object {
    #blockMonitor = false;
    #isRunning = false;

    // Define the wallpaper update method
    #wallpaper(): void {
        if (!dependencies('swww')) return;

        // Log monitor names for debugging
        const monitorNames = hyprland.monitors.map((m) => m.name);
        console.log('Monitors:', monitorNames);

        // Get cursor position
        sh('hyprctl cursorpos')
            .then((pos) => {
                const transitionCmd = [
                    'swww',
                    'img',
                    '--invert-y',
                    '--transition-type',
                    'grow',
                    '--transition-duration',
                    '1.5',
                    '--transition-fps',
                    '30',
                    '--transition-pos',
                    pos.replace(' ', ''),
                    WP,
                ].join(' ');

                sh(transitionCmd)
                    .then(() => {
                        this.notify('wallpaper');
                        this.emit('changed', true);
                    })
                    .catch((err) => {
                        console.error('Error setting wallpaper:', err);
                    });
            })
            .catch((err) => {
                console.error('Error getting cursor position:', err);
            });
    }

    async #setWallpaper(path: string): Promise<void> {
        this.#blockMonitor = true;

        try {
            await sh(`cp ${path} ${WP}`);
            this.#wallpaper();
        } catch (error) {
            console.error('Error setting wallpaper:', error);
        } finally {
            this.#blockMonitor = false;
        }
    }

    // Renamed from 'set' to 'setWallpaper' to avoid conflict
    setWallpaper(path: string): void {
        this.#setWallpaper(path);
    }

    // Method to check if wallpaper service is running
    isRunning(): boolean {
        return this.#isRunning;
    }

    // Define the wallpaper property with the correct decorator
    @property(String)
    declare wallpaper: string;

    @signal(Boolean)
    declare changed: (event: boolean) => void;

    constructor() {
        super();

        // Initialize the wallpaper property
        this.wallpaper = WP;

        // Connect to the 'changed' signal of the wallpaper enable option
        options.wallpaper.enable.subscribe(() => {
            if (options.wallpaper.enable.value) {
                this.#isRunning = true;
                execAsync('swww-daemon')
                    .then(() => {
                        this.#wallpaper();
                    })
                    .catch((err) => {
                        console.error('Failed to start swww-daemon:', err);
                    });
            } else {
                this.#isRunning = false;

                execAsync('pkill swww-daemon')
                    .then(() => {
                        console.log('swww-daemon stopped.');
                    })
                    .catch((err) => {
                        console.error('Failed to stop swww-daemon:', err);
                    });
            }
        });

        // If dependencies are met and wallpaper is enabled, initialize
        if (dependencies('swww') && options.wallpaper.enable.value) {
            this.#isRunning = true;

            monitorFile(WP, () => {
                if (!this.#blockMonitor) this.#wallpaper();
            });

            // Start the swww-daemon and set the initial wallpaper
            execAsync('swww-daemon')
                .then(() => {
                    this.#wallpaper();
                })
                .catch((err) => {
                    console.error('Failed to start swww-daemon:', err);
                });
        }
    }
}

export default new Wallpaper();
