import GObject, { GLib, property, register, signal } from 'astal/gobject';
import { monitorFile } from 'astal/file';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import options from 'src/configuration';
import { SystemUtilities } from 'src/core/system/SystemUtilities';
import { SwwwDaemon } from './SwwwDaemon';

const hyprlandService = AstalHyprland.get_default();
const WP = `${GLib.get_home_dir()}/.config/background`;

/**
 * Service for managing desktop wallpaper using swww daemon
 */
@register({ GTypeName: 'Wallpaper' })
export class WallpaperService extends GObject.Object {
    @property(String)
    declare public wallpaper: string;

    @signal(Boolean)
    declare public changed: (event: boolean) => void;

    private static _instance: WallpaperService;
    private _blockMonitor = false;
    private _daemon = new SwwwDaemon();

    constructor() {
        super();

        this.wallpaper = WP;

        monitorFile(WP, () => {
            if (!this._blockMonitor && this._daemon.isRunning) {
                this._wallpaper();
            }
        });

        options.wallpaper.enable.subscribe(async (isWallpaperEnabled) => {
            if (isWallpaperEnabled) {
                const started = await this._daemon.start();
                if (started) {
                    this._wallpaper();
                }
            } else {
                await this._daemon.stop();
            }
        });

        if (options.wallpaper.enable.get()) {
            this._daemon.start().then((started) => {
                if (started) {
                    this._wallpaper();
                }
            });
        }
    }

    /**
     * Gets the singleton instance of WallpaperService
     *
     * @returns The WallpaperService instance
     */
    public static getInstance(): WallpaperService {
        if (this._instance === undefined) {
            this._instance = new WallpaperService();
        }

        return this._instance;
    }

    /**
     * Sets a new wallpaper from the specified file path
     *
     * @param path - Path to the wallpaper image file
     */
    public setWallpaper(path: string): void {
        this._setWallpaper(path);
    }

    /**
     * Checks if the wallpaper service is currently running
     *
     * @returns Whether swww daemon is active
     */
    public isRunning(): boolean {
        return this._daemon.isRunning;
    }

    /**
     * Applies the wallpaper using swww with a transition effect from cursor position
     */
    private _wallpaper(): void {
        if (!this._daemon.isRunning) {
            console.warn('Cannot set wallpaper: swww-daemon is not running');
            return;
        }

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

            SystemUtilities.sh(transitionCmd)
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

    /**
     * Copies wallpaper to config location and applies it
     *
     * @param path - Path to the wallpaper image file
     */
    private async _setWallpaper(path: string): Promise<void> {
        this._blockMonitor = true;

        try {
            await SystemUtilities.sh(`cp "${path}" "${WP}"`);
            this._wallpaper();
        } catch (error) {
            console.error('Error setting wallpaper:', error);
        } finally {
            this._blockMonitor = false;
        }
    }
}
