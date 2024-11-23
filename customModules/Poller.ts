import GLib from 'gi://GLib?version=2.0';
import { GenericFunction } from 'common/lib/types/customModules/generic';
import { Bind } from 'common/lib/types/variable';
import { Variable as VariableType } from 'types/variable';

/**
 * A class that manages polling of a variable by executing a function or a bash command at specified intervals.
 */
export class Poller<Value, Parameters extends unknown[]> {
    private targetVariable: VariableType<Value>;
    private trackers: Bind[];
    private pollingInterval: Bind;
    private pollingFunction: GenericFunction<Value, Parameters>;
    private params: Parameters;
    private intervalInstance: number | null = null;
    private isExecuting: boolean = false;

    constructor(
        targetVariable: VariableType<Value>,
        trackers: Bind[],
        pollingInterval: Bind,
        func: GenericFunction<Value, Parameters>,
        ...params: Parameters
    ) {
        this.targetVariable = targetVariable;
        this.trackers = trackers;
        this.pollingInterval = pollingInterval;
        this.params = params;

        this.pollingFunction = func;
    }

    /**
     * Starts the polling process.
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
     * Executes the polling logic based on the type (function or bash command).
     *
     * @param intervalMs - The polling interval in milliseconds.
     */
    private executePolling(intervalMs: number): void {
        console.log(this.params);
        console.log(this.pollingFunction?.name ?? '');

        if (this.intervalInstance !== null) {
            GLib.source_remove(this.intervalInstance);
        }

        this.intervalInstance = Utils.interval(intervalMs, async () => {
            if (this.isExecuting) {
                return;
            }

            this.isExecuting = true;

            try {
                const result = this.pollingFunction(...this.params);
                this.targetVariable.value = result;
            } catch (error) {
                console.error('Error during polling execution:', error);
            } finally {
                this.isExecuting = false;
            }
        });
    }
}
