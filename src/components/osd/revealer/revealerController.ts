import { timeout } from 'astal';
import { Widget } from 'astal/gtk3';
import AstalIO from 'gi://AstalIO?version=0.1';
import options from 'src/configuration';

const { enable, duration } = options.theme.osd;

/**
 * Manages OSD revealer instances to prevent stale references and ensure proper cleanup
 */
export class OsdRevealerController {
    private static _instance: OsdRevealerController;

    private _currentRevealer?: Widget.Revealer;
    private _autoHideTimeout?: AstalIO.Time;
    private _startupTimeout?: AstalIO.Time;
    private _allowReveal = false;

    private constructor() {
        this._startupTimeout = timeout(3000, () => {
            this._allowReveal = true;
            this._startupTimeout = undefined;
        });
    }

    public static getInstance(): OsdRevealerController {
        if (this._instance === undefined) {
            this._instance = new OsdRevealerController();
        }

        return this._instance;
    }

    /**
     * Sets the active revealer
     */
    public setRevealer(revealer: Widget.Revealer): void {
        if (this._currentRevealer && this._currentRevealer !== revealer) {
            this._cleanup();
        }

        this._currentRevealer = revealer;
        revealer.set_reveal_child(false);
    }

    /**
     * Shows the OSD
     */
    public show(): void {
        const enableRevealer = enable.get();
        if (!this._allowReveal || this._currentRevealer === undefined || !enableRevealer) {
            return;
        }

        this._currentRevealer.set_reveal_child(true);

        if (this._autoHideTimeout !== undefined) {
            this._autoHideTimeout.cancel();
            this._autoHideTimeout = undefined;
        }

        const hideDelay = duration.get();
        const revealer = this._currentRevealer;

        this._autoHideTimeout = timeout(hideDelay, () => {
            if (revealer !== undefined) {
                revealer.set_reveal_child(false);
            }
            this._autoHideTimeout = undefined;
        });
    }

    /**
     * Cleans up the current state
     */
    private _cleanup(): void {
        if (this._autoHideTimeout) {
            this._autoHideTimeout.cancel();
            this._autoHideTimeout = undefined;
        }
    }

    /**
     * Handles revealer destruction
     */
    public onRevealerDestroy(revealer: Widget.Revealer): void {
        if (this._currentRevealer === revealer) {
            this._cleanup();
            this._currentRevealer = undefined;
        }
    }

    /**
     * Destroys the controller
     */
    public destroy(): void {
        this._cleanup();

        if (this._startupTimeout) {
            this._startupTimeout.cancel();
            this._startupTimeout = undefined;
        }
        this._currentRevealer = undefined;
    }
}
