import GLib from "gi://GLib?version=2.0";
import { Binding } from "types/service";
import { Variable as VariableType } from "types/variable";

type GenericFunction = (...args: any[]) => any;

/**
 * @param {VariableType<T>} targetVariable - The Variable to update with the function's result.
 * @param {Array<VariableType<any>>} trackers - Array of trackers to watch.
 * @param {Binding<any, any, unknown>} pollingInterval - The polling interval in milliseconds.
 * @param {GenericFunction} someFunc - The function to execute at each interval, which updates the Variable.
 * @param  {...any} params - Parameters to pass to someFunc.
 */
export const pollVariable = <T>(
    targetVariable: VariableType<T>,
    trackers: Array<Binding<any, any, unknown>>,
    pollingInterval: Binding<any, any, unknown>,
    someFunc: GenericFunction,
    ...params: any[]
): void => {
    let intervalInstance: number | null = null;

    const intervalFn = (pollIntrvl: number) => {
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
 * @param {Binding<any, any, unknown>} pollingInterval - The polling interval in milliseconds.
 * @param {string} someCommand - The bash command to execute.
 * @param {GenericFunction} someFunc - The function to execute after processing the command result.
 * @param  {...any} params - Parameters to pass to someFunc.
 */
export const pollVariableBash = <T>(
    targetVariable: VariableType<T>,
    trackers: Array<Binding<any, any, unknown>>,
    pollingInterval: Binding<any, any, unknown>,
    someCommand: string,
    someFunc: (res: any, ...params: any[]) => T,
    ...params: any[]
): void => {
    let intervalInstance: number | null = null;

    const intervalFn = (pollIntrvl: number) => {
        if (intervalInstance !== null) {
            GLib.source_remove(intervalInstance);
        }

        intervalInstance = Utils.interval(pollIntrvl, () => {
            Utils.execAsync(`bash -c "${someCommand}"`).then((res: any) => {
                try {
                    targetVariable.value = someFunc(res, ...params);
                } catch (error) {
                    console.warn(`An error occurred when running interval bash function: ${error}`);
                }
            })
                .catch((err) => console.error(`Error running command "${someCommand}": ${err}`));
        });
    };

    // Set up the interval initially with the provided polling interval
    Utils.merge([pollingInterval, ...trackers], (pollIntrvl: number) => {
        intervalFn(pollIntrvl);
    });
};
