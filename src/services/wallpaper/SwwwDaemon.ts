import { execAsync } from 'astal/process';
import { SystemUtilities } from 'src/core/system/SystemUtilities';

/**
 * Manages the lifecycle of the swww daemon process
 */
export class SwwwDaemon {
    private _isRunning = false;

    /**
     * Gets whether the daemon is currently running
     */
    public get isRunning(): boolean {
        return this._isRunning;
    }

    /**
     * Checks if swww is installed on the system
     */
    public isInstalled(): boolean {
        return SystemUtilities.checkDependencies('swww');
    }

    /**
     * Starts the swww daemon if not already running
     */
    public async start(): Promise<boolean> {
        if (!this.isInstalled()) {
            console.warn('swww is not installed, cannot start daemon');
            return false;
        }

        const isAlreadyRunning = await this._checkIfRunning();
        if (isAlreadyRunning) {
            console.debug('swww-daemon is already running...');
            this._isRunning = true;
            return true;
        }

        return await this._startNewDaemon();
    }

    /**
     * Stops the swww daemon
     */
    public async stop(): Promise<void> {
        try {
            await execAsync('swww kill');
            this._isRunning = false;
        } catch (err) {
            await this._handleStopError(err);
        }
    }

    /**
     * Checks if the swww daemon is currently running
     */
    private async _checkIfRunning(): Promise<boolean> {
        try {
            await execAsync('swww query');
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Starts a new swww daemon instance
     */
    private async _startNewDaemon(): Promise<boolean> {
        try {
            await execAsync('swww-daemon');

            const ready = await this._waitForReady();
            this._isRunning = ready;

            if (!ready) {
                await this._cleanupFailedDaemon();
                return false;
            }

            return ready;
        } catch (err) {
            console.error('Failed to start swww-daemon:', err);
            this._isRunning = false;
            return false;
        }
    }

    /**
     * Cleans up a failed daemon start attempt
     */
    private async _cleanupFailedDaemon(): Promise<void> {
        try {
            await execAsync('swww kill');
        } catch {}
        console.error('swww-daemon failed to become ready');
    }

    /**
     * Handles errors when stopping the daemon
     */
    private async _handleStopError(err: unknown): Promise<void> {
        const wasRunning = await this._checkIfRunning();

        if (wasRunning) {
            console.error('[SwwwDaemon] Failed to stop swww-daemon:', err);
        } else {
            console.debug('[SwwwDaemon] swww-daemon was not running');
        }

        this._isRunning = false;
    }

    /**
     * Waits for swww daemon to be ready using exponential backoff
     */
    private async _waitForReady(): Promise<boolean> {
        const maxAttempts = 10;
        let delay = 50;

        for (let i = 0; i < maxAttempts; i++) {
            try {
                await execAsync('swww query');
                return true;
            } catch {
                if (i < maxAttempts - 1) {
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    delay = Math.min(delay * 2, 1000);
                }
            }
        }

        return false;
    }
}
