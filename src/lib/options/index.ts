import { ConfigManager } from './ConfigManager';
import { Opt, OptProps } from './Opt';
import { OptionRegistry } from './OptionRegistry';
import { MkOptionsResult, OptionsObject } from './options.types';

const CONFIG_PATH = CONFIG_FILE;

const configManager = new ConfigManager(CONFIG_PATH);

/**
 * Creates an option with the specified initial value
 */
export function opt<T>(initial: T, props?: OptProps): Opt<T> {
    return new Opt(initial, configManager, props);
}

/**
 * Creates and initializes an options management system
 */
export function mkOptions<T extends OptionsObject>(optionsObj: T): T & MkOptionsResult {
    const registry = new OptionRegistry(optionsObj, configManager);
    return registry.createEnhancedOptions();
}

export { Opt };
