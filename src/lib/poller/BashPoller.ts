import { BarModule } from '../options/types';
import { Poller } from './Poller';
import { Binding, execAsync, Variable } from 'astal';
import { GenericFunction } from './types';

/**
 * A class that manages polling of a variable by executing a bash command at specified intervals.
 */
export class BashPoller<Value, Parameters extends unknown[]> {
    private _poller: Poller;

    private _params: Parameters;

    /**
     * Creates an instance of BashPoller.
     *
     * @param _targetVariable - The target variable to poll.
     * @param _trackers - An array of trackers to monitor.
     * @param _pollingInterval - The interval at which polling occurs.
     * @param _updateCommand - The command to update the target variable.
     * @param _pollingFunction - The function to execute during each poll.
     * @param params - Additional parameters for the polling function.
     *
     * @example
     *
     * ```ts
     * //##################### EXAMPLE ##########################
     *  const updatesPoller = new BashPoller<string, []>(
     *    pendingUpdates,
     *    [bind(padZero), bind(postInputUpdater)],
     *    bind(pollingInterval),
     *    updateCommand.value,
     *    processUpdateCount,
     *  );
     * //#######################################################
     *
     * ```
     */
    constructor(
        private _targetVariable: Variable<Value>,
        private _trackers: Binding<unknown>[],
        private _pollingInterval: Binding<number>,
        private _updateCommand: string,
        private _pollingFunction: GenericFunction<Value, [string, ...Parameters]>,
        ...params: Parameters
    ) {
        this._params = params;

        this._poller = new Poller(this._pollingInterval, this._trackers, this.execute);
    }

    /**
     * Executes the bash command specified in the updateCommand property.
     *
     * The result of the command is processed by the pollingFunction and
     * assigned to the targetVariable.
     */
    public execute = async (): Promise<void> => {
        try {
            const res = await execAsync(['bash', '-c', this._updateCommand]);
            this._targetVariable.set(await this._pollingFunction(res, ...this._params));
        } catch (error) {
            console.error(`Error executing bash command "${this._updateCommand}":`, error);
        }
    };

    /**
     * Starts the polling process.
     */
    public start(): void {
        this._poller.start();
    }

    /**
     * Stops the polling process.
     */
    public stop(): void {
        this._poller.stop();
    }

    /**
     * Initializes the poller with the specified module.
     *
     * @param moduleName - The name of the module to initialize.
     */
    public initialize(moduleName?: BarModule): void {
        this._poller.initialize(moduleName);
    }
}
