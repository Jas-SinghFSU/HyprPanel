import { ConfigManager } from './configManager';
import { Opt, OptProps } from './opt';
import { OptionRegistry } from './optionRegistry';
import { MkOptionsResult, OptionsObject } from './types';

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
