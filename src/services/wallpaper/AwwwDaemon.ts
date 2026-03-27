import { execAsync } from 'astal/process';
import { SystemUtilities } from 'src/core/system/SystemUtilities';

/**
 * Manages the lifecycle of the awww daemon process
 */
export class AwwwDaemon {
    private _isRunning = false;

    /**
     * Gets whether the daemon is currently running
     */
    public get isRunning(): boolean {
        return this._isRunning;
    }

    /**
     * Checks if awww is installed on the system
     */
    public isInstalled(): boolean {
        return SystemUtilities.checkDependencies('awww');
    }

    /**
     * Starts the awww daemon if not already running
     */
    public async start(): Promise<boolean> {
        if (!this.isInstalled()) {
            console.warn('awww is not installed, cannot start daemon');
            return false;
        }

        const isAlreadyRunning = await this._checkIfRunning();
        if (isAlreadyRunning) {
            console.debug('awww-daemon is already running...');
            this._isRunning = true;
            return true;
        }

        return await this._startNewDaemon();
    }

    /**
     * Stops the awww daemon
     */
    public async stop(): Promise<void> {
        try {
            await execAsync('awww kill');
            this._isRunning = false;
        } catch (err) {
            await this._handleStopError(err);
        }
    }

    /**
     * Checks if the awww daemon is currently running
     */
    private async _checkIfRunning(): Promise<boolean> {
        try {
            await execAsync('awww query');
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Starts a new awww daemon instance
     */
    private async _startNewDaemon(): Promise<boolean> {
        try {
            await execAsync('awww-daemon');

            const ready = await this._waitForReady();
            this._isRunning = ready;

            if (!ready) {
                await this._cleanupFailedDaemon();
                return false;
            }

            return ready;
        } catch (err) {
            console.error('Failed to start awww-daemon:', err);
            this._isRunning = false;
            return false;
        }
    }

    /**
     * Cleans up a failed daemon start attempt
     */
    private async _cleanupFailedDaemon(): Promise<void> {
        try {
            await execAsync('awww kill');
        } catch {}
        console.error('awww-daemon failed to become ready');
    }

    /**
     * Handles errors when stopping the daemon
     */
    private async _handleStopError(err: unknown): Promise<void> {
        const wasRunning = await this._checkIfRunning();

        if (wasRunning) {
            console.error('[AwwwDaemon] Failed to stop awww-daemon:', err);
        } else {
            console.debug('[AwwwDaemon] awww-daemon was not running');
        }

        this._isRunning = false;
    }

    /**
     * Waits for awww daemon to be ready using exponential backoff
     */
    private async _waitForReady(): Promise<boolean> {
        const maxAttempts = 10;
        let delay = 50;

        for (let i = 0; i < maxAttempts; i++) {
            try {
                await execAsync('awww query');
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
