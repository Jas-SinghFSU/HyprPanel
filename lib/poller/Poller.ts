import GLib from 'gi://GLib?version=2.0';
import { Bind } from 'lib/types/variable';
import { BarModule } from 'lib/types/options';
import { getLayoutItems } from 'lib/utils';

const { layouts } = options.bar;

/**
 * A class that manages the polling lifecycle, including interval management and execution state.
 */
export class Poller {
    private intervalInstance: number | null = null;
    private isExecuting: boolean = false;
    private pollingFunction: () => Promise<void>;

    /**
     * Creates an instance of Poller.
     * @param pollingInterval - The interval at which polling occurs.
     * @param trackers - An array of trackers to monitor.
     * @param pollingFunction - The function to execute during each poll.
     */
    constructor(
        private pollingInterval: Bind,
        private trackers: Bind[],
        pollingFunction: () => Promise<void>,
    ) {
        this.pollingFunction = pollingFunction;
    }

    /**
     * Starts the polling process by setting up the interval.
     */
    public start(): void {
        Utils.merge([this.pollingInterval, ...this.trackers], (intervalMs: number) => {
            this.executePolling(intervalMs);
        });
    }

    /**
     * Stops the polling process and cleans up resources.
     */
    public stop(): void {
        if (this.intervalInstance !== null) {
            GLib.source_remove(this.intervalInstance);
            this.intervalInstance = null;
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

        layouts.connect('changed', () => {
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
    private executePolling(intervalMs: number): void {
        if (this.intervalInstance !== null) {
            GLib.source_remove(this.intervalInstance);
        }

        this.intervalInstance = Utils.interval(intervalMs, async () => {
            if (this.isExecuting) {
                return;
            }

            this.isExecuting = true;

            try {
                await this.pollingFunction();
            } catch (error) {
                console.error('Error during polling execution:', error);
            } finally {
                this.isExecuting = false;
            }
        });
    }
}
