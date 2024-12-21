import { Bind } from 'src/lib/types/variable';
import { GenericFunction } from 'src/lib/types/customModules/generic';
import { BarModule } from 'src/lib/types/options';
import { Poller } from './Poller';
import { execAsync, Variable } from 'astal';

/**
 * A class that manages polling of a variable by executing a bash command at specified intervals.
 */
export class BashPoller<Value, Parameters extends unknown[]> {
    private poller: Poller;

    private params: Parameters;

    /**
     * Creates an instance of BashPoller.
     *
     * @param targetVariable - The target variable to poll.
     * @param trackers - An array of trackers to monitor.
     * @param pollingInterval - The interval at which polling occurs.
     * @param updateCommand - The command to update the target variable.
     * @param pollingFunction - The function to execute during each poll.
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
        private targetVariable: Variable<Value>,
        private trackers: Bind[],
        private pollingInterval: Bind,
        private updateCommand: string,
        private pollingFunction: GenericFunction<Value, [string, ...Parameters]>,
        ...params: Parameters
    ) {
        this.params = params;

        this.poller = new Poller(this.pollingInterval, this.trackers, this.execute);
    }

    /**
     * Executes the bash command specified in the updateCommand property.
     *
     * The result of the command is processed by the pollingFunction and
     * assigned to the targetVariable.
     */
    public execute = async (): Promise<void> => {
        try {
            const res = await execAsync(`bash -c "${this.updateCommand}"`);
            this.targetVariable.set(await this.pollingFunction(res, ...this.params));
        } catch (error) {
            console.error(`Error executing bash command "${this.updateCommand}":`, error);
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
