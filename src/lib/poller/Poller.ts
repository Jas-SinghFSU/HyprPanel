import { AstalIO, Binding, interval, Variable } from 'astal';
import options from 'src/configuration';
import { BarModule } from '../options/types';
import { getLayoutItems } from '../bar/helpers';

const { layouts } = options.bar;

/**
 * A class that manages the polling lifecycle, including interval management and execution state.
 */
export class Poller {
    private _intervalInstance: AstalIO.Time | null = null;
    private _isExecuting: boolean = false;
    private _pollingFunction: () => Promise<void>;

    /**
     * Creates an instance of Poller.
     * @param _pollingInterval - The interval at which polling occurs.
     * @param _trackers - An array of trackers to monitor.
     * @param pollingFunction - The function to execute during each poll.
     */
    constructor(
        private _pollingInterval: Binding<number>,
        private _trackers: Binding<unknown>[],
        pollingFunction: () => Promise<void>,
    ) {
        this._pollingFunction = pollingFunction;
    }

    /**
     * Starts the polling process by setting up the interval.
     */
    public start(): void {
        Variable.derive([this._pollingInterval, ...this._trackers], (intervalMs: number) => {
            this._executePolling(intervalMs);
        })();
    }

    /**
     * Stops the polling process and cleans up resources.
     */
    public stop(): void {
        if (this._intervalInstance !== null) {
            this._intervalInstance.cancel();
            this._intervalInstance = null;
        }
    }

    /**
     * Initializes the polling based on module usage.
     *
     * If not module is provided then we can safely assume that we want
     * to always run the pollig interval.
     *
     * @param moduleName - The name of the module to initialize.
     */
    public initialize(moduleName?: BarModule): void {
        if (moduleName === undefined) {
            return this.start();
        }

        const initialModules = getLayoutItems();

        if (initialModules.includes(moduleName)) {
            this.start();
        } else {
            this.stop();
        }

        layouts.subscribe(() => {
            const usedModules = getLayoutItems();

            if (usedModules.includes(moduleName)) {
                this.start();
            } else {
                this.stop();
            }
        });
    }

    /**
     * Executes the polling function at the specified interval.
     *
     * @param intervalMs - The polling interval in milliseconds.
     */
    private _executePolling(intervalMs: number): void {
        if (this._intervalInstance !== null) {
            this._intervalInstance.cancel();
        }

        if (intervalMs === 0) {
            this._executeSinglePoll();
            return;
        }

        this._intervalInstance = interval(intervalMs, () => this._executePollingCycle());
    }

    /**
     * Executes a single polling operation synchronously.
     */
    private _executeSinglePoll(): void {
        try {
            this._pollingFunction();
        } catch (error) {
            console.error('Error during polling execution:', error);
        }
    }

    /**
     * Executes an asynchronous polling cycle with execution guard.
     * Ensures only one polling cycle runs at a time using the isExecuting flag.
     */
    private async _executePollingCycle(): Promise<void> {
        if (this._isExecuting) {
            return;
        }

        this._isExecuting = true;

        try {
            await this._pollingFunction();
        } catch (error) {
            console.error('Error during polling execution:', error);
        } finally {
            this._isExecuting = false;
        }
    }
}
