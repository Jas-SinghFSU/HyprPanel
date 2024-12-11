import GObject, { GLib, property, register, signal } from 'astal/gobject';
import { dependencies, sh } from '../lib/utils';
import options from '../options';
import { execAsync } from 'astal/process';
import { monitorFile } from 'astal/file';

const WP = `${GLib.get_home_dir()}/.config/background`;

@register({ GTypeName: 'Wallpaper' })
class Wallpaper extends GObject.Object {
    #blockMonitor = false;
    #isRunning = false;

    #wallpaper(): void {
        if (!dependencies('swww')) return;

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

    setWallpaper(path: string): void {
        this.#setWallpaper(path);
    }

    isRunning(): boolean {
        return this.#isRunning;
    }

    @property(String)
    declare wallpaper: string;

    @signal(Boolean)
    declare changed: (event: boolean) => void;

    constructor() {
        super();

        this.wallpaper = WP;

        options.wallpaper.enable.subscribe(() => {
            if (options.wallpaper.enable.get()) {
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

        if (dependencies('swww') && options.wallpaper.enable.get()) {
            this.#isRunning = true;

            monitorFile(WP, () => {
                if (!this.#blockMonitor) this.#wallpaper();
            });

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
