import GLib from 'gi://GLib?version=2.0';
import { Bind } from 'lib/types/variable';
import { Variable as VariableType } from 'types/variable';

type GenericFunction<T> = (...args: unknown[]) => T;

/**
 * @param {VariableType<T>} targetVariable - The Variable to update with the function's result.
 * @param {Array<Binding>} trackers - Array of trackers to watch.
 * @param {Binding} pollingInterval - The polling interval in milliseconds.
 * @param {GenericFunction<T>} someFunc - The function to execute at each interval, which updates the Variable.
 * @param  {...unknown} params - Parameters to pass to someFunc.
 */
export const pollVariable = <T>(
    targetVariable: VariableType<T>,
    trackers: Array<Bind>,
    pollingInterval: Bind,
    someFunc: GenericFunction<T>,
    ...params: unknown[]
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
 * @param {Array<Binding>} trackers - Array of trackers to watch.
 * @param {Binding} pollingInterval - The polling interval in milliseconds.
 * @param {string} someCommand - The bash command to execute.
 * @param {GenericFunction<T>} someFunc - The function to execute after processing the command result.
 * @param  {...unknown} params - Parameters to pass to someFunc.
 */
export const pollVariableBash = <T>(
    targetVariable: VariableType<T>,
    trackers: Array<Bind>,
    pollingInterval: Bind,
    someCommand: string,
    someFunc: (res: unknown, ...params: unknown[]) => T,
    ...params: unknown[]
): void => {
    let intervalInstance: number | null = null;

    const intervalFn = (pollIntrvl: number): void => {
        if (intervalInstance !== null) {
            GLib.source_remove(intervalInstance);
        }

        intervalInstance = Utils.interval(pollIntrvl, () => {
            Utils.execAsync(`bash -c "${someCommand}"`)
                .then((res: unknown) => {
                    try {
                        targetVariable.value = someFunc(res, ...params);
                    } catch (error) {
                        console.warn(`An error occurred when running interval bash function: ${error}`);
                    }
                })
                .catch((err) => console.error(`Error running command "${someCommand} ${err}`));
        });
    };

    Utils.merge([pollingInterval, ...trackers], (pollIntrvl: number) => {
        intervalFn(pollIntrvl);
    });
};
