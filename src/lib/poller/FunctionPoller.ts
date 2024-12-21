import { Bind } from 'src/lib/types/variable';
import { GenericFunction } from 'src/lib/types/customModules/generic';
import { BarModule } from 'src/lib/types/options';
import { Poller } from './Poller';
import { Variable } from 'astal';

/**
 * A class that manages polling of a variable by executing a generic function at specified intervals.
 */
export class FunctionPoller<Value, Parameters extends unknown[] = []> {
    private poller: Poller;

    private params: Parameters;

    /**
     * Creates an instance of FunctionPoller.
     *
     * @param targetVariable - The target variable to poll.
     * @param trackers - An array of trackers to monitor.
     * @param pollingInterval - The interval at which polling occurs.
     * @param pollingFunction - The function to execute during each poll.
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
        private targetVariable: Variable<Value>,
        private trackers: Bind[],
        private pollingInterval: Bind,
        private pollingFunction: GenericFunction<Value, Parameters>,
        ...params: Parameters
    ) {
        this.params = params;

        this.poller = new Poller(this.pollingInterval, this.trackers, this.execute);
    }

    /**
     * Executes the polling function with the provided parameters.
     *
     * The result of the function is assigned to the target variable.
     */
    private execute = async (): Promise<void> => {
        try {
            const result = await this.pollingFunction(...this.params);
            this.targetVariable.set(result);
        } catch (error) {
            console.error('Error executing polling function:', error);
        }
    };

    /**
     * Starts the polling process.
     */
    public start(): void {
        this.poller.start();
    }

    /**
     * Stops the polling process.
     */
    public stop(): void {
        this.poller.stop();
    }

    /**
     * Initializes the poller with the specified module.
     *
     * @param moduleName - The name of the module to initialize.
     */
    public initialize(moduleName?: BarModule): void {
        this.poller.initialize(moduleName);
    }
}
