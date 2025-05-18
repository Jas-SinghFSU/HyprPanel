import GObject, { GLib, property, register, signal } from 'astal/gobject';
import { execAsync } from 'astal/process';
import { monitorFile } from 'astal/file';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { dependencies, sh } from 'src/core';
import options from 'src/options';

const hyprlandService = AstalHyprland.get_default();
const WP = `${GLib.get_home_dir()}/.config/background`;

@register({ GTypeName: 'Wallpaper' })
export class WallpaperService extends GObject.Object {
    private _blockMonitor = false;
    private _isRunning = false;

    private _wallpaper(): void {
        if (!dependencies('swww')) return;

        try {
            const cursorPosition = hyprlandService.message('cursorpos');
            const transitionCmd = [
                'swww',
                'img',
                '--invert-y',
                '--transition-type',
                'grow',
                '--transition-duration',
                '1.5',
                '--transition-fps',
                '60',
                '--transition-pos',
                cursorPosition.replace(' ', ''),
                `"${WP}"`,
            ].join(' ');

            sh(transitionCmd)
                .then(() => {
                    this.notify('wallpaper');
                    this.emit('changed', true);
                })
                .catch((err) => {
                    console.error('Error setting wallpaper:', err);
                });
        } catch (err) {
            console.error('Error getting cursor position:', err);
        }
    }

    private async _setWallpaper(path: string): Promise<void> {
        this._blockMonitor = true;

        try {
            await sh(`cp "${path}" "${WP}"`);
            this._wallpaper();
        } catch (error) {
            console.error('Error setting wallpaper:', error);
        } finally {
            this._blockMonitor = false;
        }
    }

    public setWallpaper(path: string): void {
        this._setWallpaper(path);
    }

    public isRunning(): boolean {
        return this._isRunning;
    }

    @property(String)
    declare public wallpaper: string;

    @signal(Boolean)
    declare public changed: (event: boolean) => void;

    constructor() {
        super();

        this.wallpaper = WP;

        options.wallpaper.enable.subscribe(() => {
            if (options.wallpaper.enable.get()) {
                this._isRunning = true;
                execAsync('swww-daemon')
                    .then(() => {
                        this._wallpaper();
                    })
                    .catch((err) => {
                        console.error('Failed to start swww-daemon:', err);
                    });
            } else {
                this._isRunning = false;

                execAsync('pkill swww-daemon')
                    .then(() => {
                        console.log('swww-daemon stopped.');
                    })
                    .catch((err) => {
                        console.error('Failed to stop swww-daemon:', err);
                    });
            }
        });

        if (options.wallpaper.enable.get() && dependencies('swww')) {
            this._isRunning = true;

            monitorFile(WP, () => {
                if (!this._blockMonitor) this._wallpaper();
            });

            execAsync('swww-daemon')
                .then(() => {
                    this._wallpaper();
                })
                .catch((err) => {
                    console.error('Failed to start swww-daemon:', err);
                });
        }
    }
}

export default new WallpaperService();
