import GLib from 'gi://GLib?version=2.0';
import { GenericFunction } from 'lib/types/customModules/generic';
import { Bind } from 'lib/types/variable';
import { Variable as VariableType } from 'types/variable';

/**
 * @param {VariableType<T>} targetVariable - The Variable to update with the function's result.
 * @param {Array<Bind>} trackers - Array of trackers to watch.
 * @param {Bind} pollingInterval - The polling interval in milliseconds.
 * @param {GenericFunction<T, P>} someFunc - The function to execute at each interval, which updates the Variable.
 * @param  {...P} params - Parameters to pass to someFunc.
 */
export const pollVariable = <T, P extends unknown[], F extends GenericFunction<T, P>>(
    targetVariable: VariableType<T>,
    trackers: Array<Bind>,
    pollingInterval: Bind,
    someFunc: F,
    ...params: P
): void => {
    let intervalInstance: number | null = null;

    const intervalFn = (pollIntrvl: number): void => {
        if (intervalInstance !== null) {
            GLib.source_remove(intervalInstance);
        }

        intervalInstance = Utils.interval(pollIntrvl, () => {
            targetVariable.value = someFunc(...params);
        });
    };

    Utils.merge([pollingInterval, ...trackers], (pollIntrvl: number) => {
        intervalFn(pollIntrvl);
    });
};

/**
 * @param {VariableType<T>} targetVariable - The Variable to update with the result of the command.
 * @param {Array<Bind>} trackers - Array of trackers to watch.
 * @param {Bind} pollingInterval - The polling interval in milliseconds.
 * @param {string} someCommand - The bash command to execute.
 * @param {GenericFunction<T, [unknown, ...P]>} someFunc - The function to execute after processing the command result;
 * with the first argument being the result of the command execution.
 * @param  {...P} params - Additional parameters to pass to someFunc.
 */
export const pollVariableBash = <T, P extends unknown[], F extends GenericFunction<T, [string, ...P]>>(
    targetVariable: VariableType<T>,
    trackers: Array<Bind>,
    pollingInterval: Bind,
    someCommand: string,
    someFunc: F,
    ...params: P
): void => {
    let intervalInstance: number | null = null;

    const intervalFn = (pollIntrvl: number): void => {
        if (intervalInstance !== null) {
            GLib.source_remove(intervalInstance);
        }

        intervalInstance = Utils.interval(pollIntrvl, () => {
            Utils.execAsync(`bash -c "${someCommand}"`)
                .then((res: string) => {
                    try {
                        targetVariable.value = someFunc(res, ...params);
                    } catch (error) {
                        console.warn(`An error occurred when running interval bash function: ${error}`);
                    }
                })
                .catch((err) => console.error(`Error running command "${someCommand}": ${err}`));
        });
    };

    Utils.merge([pollingInterval, ...trackers], (pollIntrvl: number) => {
        intervalFn(pollIntrvl);
    });
};
