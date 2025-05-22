import { BarModule } from '../options/types';
import { Poller } from './Poller';
import { Binding, Variable } from 'astal';
import { GenericFunction } from './types';

/**
 * A class that manages polling of a variable by executing a generic function at specified intervals.
 */
export class FunctionPoller<Value, Parameters extends unknown[] = []> {
    private _poller: Poller;

    private _params: Parameters;

    /**
     * Creates an instance of FunctionPoller.
     *
     * @param _targetVariable - The target variable to poll.
     * @param _trackers - An array of trackers to monitor.
     * @param _pollingInterval - The interval at which polling occurs.
     * @param _pollingFunction - The function to execute during each poll.
     * @param params - Additional parameters for the polling function.
     *
     * @example
     *
     * ```ts
     * //##################### EXAMPLE ##########################
     *  const cpuPoller = new FunctionPoller<number, []>(
     *    cpuUsage,
     *    [bind(round)],
     *    bind(pollingInterval),
     *    computeCPU,
     *  );
     * //#######################################################
     *
     * ```
     */
    constructor(
        private _targetVariable: Variable<Value>,
        private _trackers: Binding<unknown>[],
        private _pollingInterval: Binding<number>,
        private _pollingFunction: GenericFunction<Value, Parameters>,
        ...params: Parameters
    ) {
        this._params = params;

        this._poller = new Poller(this._pollingInterval, this._trackers, this._execute);
    }

    /**
     * Executes the polling function with the provided parameters.
     *
     * The result of the function is assigned to the target variable.
     */
    private _execute = async (): Promise<void> => {
        try {
            const result = await this._pollingFunction(...this._params);
            this._targetVariable.set(result);
        } catch (error) {
            console.error('Error executing polling function:', error);
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
