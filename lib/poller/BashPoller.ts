import GLib from 'gi://GLib?version=2.0';
import { GenericFunction } from 'lib/types/customModules/generic';
import { Bind } from 'lib/types/variable';
import { Variable as VariableType } from 'types/variable';
import { Poller } from './poller.interface';
import { BarModule } from 'lib/types/options';
import { getLayoutItems } from 'lib/utils';

const { layouts } = options.bar;

/**
 * A class that manages polling of a variable by executing a function or a bash command at specified intervals.
 */
export class BashPoller<Value, Parameters extends unknown[]> implements Poller {
    private targetVariable: VariableType<Value>;
    private trackers: Bind[];
    private pollingInterval: Bind;
    private pollingFunction: GenericFunction<Value, [string, ...Parameters]>;
    private params: Parameters;
    private intervalInstance: number | null = null;
    private isExecuting: boolean = false;
    private updateCommand: string;

    constructor(
        targetVariable: VariableType<Value>,
        trackers: Bind[],
        pollingInterval: Bind,
        updateCommand: string,
        func: GenericFunction<Value, [string, ...Parameters]>,
        ...params: Parameters
    ) {
        this.targetVariable = targetVariable;
        this.trackers = trackers;
        this.pollingInterval = pollingInterval;
        this.params = params;

        this.updateCommand = updateCommand;

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
        if (this.intervalInstance !== null) {
            GLib.source_remove(this.intervalInstance);
        }

        this.intervalInstance = Utils.interval(intervalMs, async () => {
            if (this.isExecuting) {
                return;
            }

            this.isExecuting = true;

            Utils.execAsync(`bash -c "${this.updateCommand}"`)
                .then((res: string) => {
                    try {
                        this.targetVariable.value = this.pollingFunction(res, ...this.params);
                    } catch (error) {
                        console.warn(`An error occurred when running interval bash function: ${error}`);
                    }
                })
                .catch((err: Error) => {
                    console.error(`Error running command "${this.updateCommand}": ${err}`);
                })
                .finally(() => {
                    this.isExecuting = false;
                });
        });
    }

    /**
     * Initializes the poller with the specified module.
     *
     * @param moduleName - The name of the module to initialize.
     */
    public initialize = (moduleName: BarModule): void => {
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
    };
}
