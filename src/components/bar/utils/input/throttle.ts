import { Variable } from 'astal';
import { runAsyncCommand } from './commandExecutor';
import { ThrottleFn } from 'src/lib/shared/eventHandlers/types';

/**
 * Generic throttle function to limit the rate at which a function can be called.
 *
 * This function creates a throttled version of the provided function that can only be called once within the specified limit.
 *
 * @param func The function to throttle.
 * @param limit The time limit in milliseconds.
 *
 * @returns The throttled function.
 */
export function throttleInput<T extends ThrottleFn>(func: T, limit: number): T {
    let inThrottle = false;
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    } as T;
}

/**
 * Creates a throttled scroll handler with the given interval.
 *
 * This function returns a throttled version of the `runAsyncCommand` function that can be called with the specified interval.
 *
 * @param interval The interval in milliseconds.
 *
 * @returns The throttled scroll handler function.
 */
export const throttledScrollHandler = (interval: number): ThrottleFn =>
    throttleInput((cmd: string, args, fn, postInputUpdater) => {
        throttledAsyncCommand(cmd, args, fn, postInputUpdater);
    }, 200 / interval);

/*
 * NOTE: Added a throttle since spamming a button yields duplicate events
 * which undo the toggle.
 */
export const throttledAsyncCommand = throttleInput(
    (cmd, events, fn, postInputUpdater?: Variable<boolean>) =>
        runAsyncCommand(cmd, events, fn, postInputUpdater),
    50,
);
