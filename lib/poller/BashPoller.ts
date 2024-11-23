import { Variable as VariableType } from 'types/variable';
import { Bind } from 'lib/types/variable';
import { GenericFunction } from 'lib/types/customModules/generic';
import { BarModule } from 'lib/types/options';
import { ModulePoller } from './Poller';

/**
 * A class that manages polling of a variable by executing a bash command at specified intervals.
 */
export class BashPoller<Value, Parameters extends unknown[]> {
    private poller: ModulePoller;

    private params: Parameters;

    constructor(
        private targetVariable: VariableType<Value>,
        private trackers: Bind[],
        private pollingInterval: Bind,
        private updateCommand: string,
        private pollingFunction: GenericFunction<Value, [string, ...Parameters]>,
        ...params: Parameters
    ) {
        this.params = params;

        this.poller = new ModulePoller(this.pollingInterval, this.trackers, this.execute);
    }

    /**
     * Executes the bash command specified in the updateCommand property.
     *
     * The result of the command is processed by the pollingFunction and
     * assigned to the targetVariable.
     */
    public execute = async (): Promise<void> => {
        try {
            const res = await Utils.execAsync(`bash -c "${this.updateCommand}"`);
            this.targetVariable.value = this.pollingFunction(res, ...this.params);
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
    public initialize(moduleName: BarModule): void {
        this.poller.initialize(moduleName);
    }
}
