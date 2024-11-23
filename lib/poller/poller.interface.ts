import { BarModule } from 'lib/types/options';

/**
 * Interface for the Poller class.
 */
export interface Poller {
    start(): void;
    stop(): void;
    initialize(moduleName: BarModule): void;
}
