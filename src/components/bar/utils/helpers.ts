import { ResourceLabelType } from 'src/lib/types/bar';
import { GenericResourceData, Postfix, UpdateHandlers } from 'src/lib/types/customModules/generic';
import { InputHandlerEventArgs, InputHandlerEvents, RunAsyncCommand } from 'src/lib/types/customModules/utils';
import { ThrottleFn } from 'src/lib/types/utils';
import { bind, Binding, execAsync, Variable } from 'astal';
import { openMenu } from 'src/components/bar/utils/menu';
import options from 'src/options';
import { Gdk } from 'astal/gtk3';
import { GtkWidget } from 'src/lib/types/widget';
import { onMiddleClick, onPrimaryClick, onSecondaryClick } from 'src/lib/shared/eventHandlers';
import { isScrollDown, isScrollUp } from 'src/lib/utils';

const { scrollSpeed } = options.bar.customModules;

const dummyVar = Variable('');

/**
 * Handles the post input updater by toggling its value.
 *
 * This function checks if the `postInputUpdater` variable is defined. If it is, it toggles its value.
 *
 * @param postInputUpdater An optional Variable<boolean> that tracks the post input update state.
 */
const handlePostInputUpdater = (postInputUpdater?: Variable<boolean>): void => {
    if (postInputUpdater !== undefined) {
        postInputUpdater.set(!postInputUpdater.get());
    }
};

/**
 * Executes an asynchronous command and handles the result.
 *
 * This function runs a given command asynchronously using `execAsync`. If the command starts with 'menu:', it opens the specified menu.
 * Otherwise, it executes the command in a bash shell. After execution, it handles the post input updater and calls the provided callback function with the command output.
 *
 * @param cmd The command to execute.
 * @param events An object containing the clicked widget and event information.
 * @param fn An optional callback function to handle the command output.
 * @param postInputUpdater An optional Variable<boolean> that tracks the post input update state.
 */
export const runAsyncCommand: RunAsyncCommand = (cmd, events, fn, postInputUpdater?: Variable<boolean>): void => {
    if (cmd.startsWith('menu:')) {
        const menuName = cmd.split(':')[1].trim().toLowerCase();
        openMenu(events.clicked, events.event, `${menuName}menu`);

        return;
    }

    execAsync(['bash', '-c', cmd])
        .then((output) => {
            handlePostInputUpdater(postInputUpdater);
            if (fn !== undefined) {
                fn(output);
            }
        })
        .catch((err) => console.error(`Error running command "${cmd}": ${err})`));
};

/*
 * NOTE: Added a throttle since spamming a button yields duplicate events
 * which undo the toggle.
 */
const throttledAsyncCommand = throttleInput(
    (cmd, events, fn, postInputUpdater?: Variable<boolean>) => runAsyncCommand(cmd, events, fn, postInputUpdater),
    50,
);

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

/**
 * Handles input events for a GtkWidget.
 *
 * This function sets up event handlers for primary, secondary, and middle clicks, as well as scroll events.
 * It uses the provided input handler events and post input updater to manage the input state.
 *
 * @param self The GtkWidget instance to handle input events for.
 * @param inputHandlerEvents An object containing the input handler events for primary, secondary, and middle clicks, as well as scroll up and down.
 * @param postInputUpdater An optional Variable<boolean> that tracks the post input update state.
 */
export const inputHandler = (
    self: GtkWidget,
    {
        onPrimaryClick: onPrimaryClickInput,
        onSecondaryClick: onSecondaryClickInput,
        onMiddleClick: onMiddleClickInput,
        onScrollUp: onScrollUpInput,
        onScrollDown: onScrollDownInput,
    }: InputHandlerEvents,
    postInputUpdater?: Variable<boolean>,
): void => {
    const sanitizeInput = (input?: Variable<string> | Variable<string>): string => {
        if (input === undefined) {
            return '';
        }
        return input.get();
    };

    const updateHandlers = (): UpdateHandlers => {
        const interval = scrollSpeed.get();
        const throttledHandler = throttledScrollHandler(interval);

        const disconnectPrimaryClick = onPrimaryClick(self, (clicked: GtkWidget, event: Gdk.Event) => {
            throttledAsyncCommand(
                sanitizeInput(onPrimaryClickInput?.cmd || dummyVar),
                { clicked, event },
                onPrimaryClickInput?.fn,
                postInputUpdater,
            );
        });

        const disconnectSecondaryClick = onSecondaryClick(self, (clicked: GtkWidget, event: Gdk.Event) => {
            throttledAsyncCommand(
                sanitizeInput(onSecondaryClickInput?.cmd || dummyVar),
                { clicked, event },
                onSecondaryClickInput?.fn,
                postInputUpdater,
            );
        });

        const disconnectMiddleClick = onMiddleClick(self, (clicked: GtkWidget, event: Gdk.Event) => {
            throttledAsyncCommand(
                sanitizeInput(onMiddleClickInput?.cmd || dummyVar),
                { clicked, event },
                onMiddleClickInput?.fn,
                postInputUpdater,
            );
        });

        const id = self.connect('scroll-event', (self: GtkWidget, event: Gdk.Event) => {
            const handleScroll = (input?: InputHandlerEventArgs): void => {
                if (input) {
                    throttledHandler(sanitizeInput(input.cmd), { clicked: self, event }, input.fn, postInputUpdater);
                }
            };

            if (isScrollUp(event)) {
                handleScroll(onScrollUpInput);
            }

            if (isScrollDown(event)) {
                handleScroll(onScrollDownInput);
            }
        });

        return {
            disconnectPrimary: disconnectPrimaryClick,
            disconnectSecondary: disconnectSecondaryClick,
            disconnectMiddle: disconnectMiddleClick,
            disconnectScroll: () => self.disconnect(id),
        };
    };

    updateHandlers();

    const sanitizeVariable = (someVar?: Variable<string>): Binding<string> => {
        if (someVar === undefined) {
            return bind(dummyVar);
        }
        return bind(someVar);
    };

    Variable.derive(
        [
            bind(scrollSpeed),
            sanitizeVariable(onPrimaryClickInput?.cmd),
            sanitizeVariable(onSecondaryClickInput?.cmd),
            sanitizeVariable(onMiddleClickInput?.cmd),
            sanitizeVariable(onScrollUpInput?.cmd),
            sanitizeVariable(onScrollDownInput?.cmd),
        ],
        () => {
            const handlers = updateHandlers();

            handlers.disconnectPrimary();
            handlers.disconnectSecondary();
            handlers.disconnectMiddle();
            handlers.disconnectScroll();
        },
    )();
};

/**
 * Calculates the percentage of used resources.
 *
 * This function calculates the percentage of used resources based on the total and used values.
 * It can optionally round the result to the nearest integer.
 *
 * @param totalUsed An array containing the total and used values.
 * @param round A boolean indicating whether to round the result.
 *
 * @returns The percentage of used resources as a number.
 */
export const divide = ([total, used]: number[], round: boolean): number => {
    const percentageTotal = (used / total) * 100;
    if (round) {
        return total > 0 ? Math.round(percentageTotal) : 0;
    }
    return total > 0 ? parseFloat(percentageTotal.toFixed(2)) : 0;
};

/**
 * Formats a size in bytes to KiB.
 *
 * This function converts a size in bytes to kibibytes (KiB) and optionally rounds the result.
 *
 * @param sizeInBytes The size in bytes to format.
 * @param round A boolean indicating whether to round the result.
 *
 * @returns The size in KiB as a number.
 */
export const formatSizeInKiB = (sizeInBytes: number, round: boolean): number => {
    const sizeInGiB = sizeInBytes / 1024 ** 1;
    return round ? Math.round(sizeInGiB) : parseFloat(sizeInGiB.toFixed(2));
};

/**
 * Formats a size in bytes to MiB.
 *
 * This function converts a size in bytes to mebibytes (MiB) and optionally rounds the result.
 *
 * @param sizeInBytes The size in bytes to format.
 * @param round A boolean indicating whether to round the result.
 *
 * @returns The size in MiB as a number.
 */
export const formatSizeInMiB = (sizeInBytes: number, round: boolean): number => {
    const sizeInGiB = sizeInBytes / 1024 ** 2;
    return round ? Math.round(sizeInGiB) : parseFloat(sizeInGiB.toFixed(2));
};

/**
 * Formats a size in bytes to GiB.
 *
 * This function converts a size in bytes to gibibytes (GiB) and optionally rounds the result.
 *
 * @param sizeInBytes The size in bytes to format.
 * @param round A boolean indicating whether to round the result.
 *
 * @returns The size in GiB as a number.
 */
export const formatSizeInGiB = (sizeInBytes: number, round: boolean): number => {
    const sizeInGiB = sizeInBytes / 1024 ** 3;
    return round ? Math.round(sizeInGiB) : parseFloat(sizeInGiB.toFixed(2));
};

/**
 * Formats a size in bytes to TiB.
 *
 * This function converts a size in bytes to tebibytes (TiB) and optionally rounds the result.
 *
 * @param sizeInBytes The size in bytes to format.
 * @param round A boolean indicating whether to round the result.
 *
 * @returns The size in TiB as a number.
 */
export const formatSizeInTiB = (sizeInBytes: number, round: boolean): number => {
    const sizeInGiB = sizeInBytes / 1024 ** 4;
    return round ? Math.round(sizeInGiB) : parseFloat(sizeInGiB.toFixed(2));
};

/**
 * Automatically formats a size in bytes to the appropriate unit.
 *
 * This function converts a size in bytes to the most appropriate unit (TiB, GiB, MiB, KiB, or bytes) and optionally rounds the result.
 *
 * @param sizeInBytes The size in bytes to format.
 * @param round A boolean indicating whether to round the result.
 *
 * @returns The formatted size as a number.
 */
export const autoFormatSize = (sizeInBytes: number, round: boolean): number => {
    // auto convert to GiB, MiB, KiB, TiB, or bytes
    if (sizeInBytes >= 1024 ** 4) return formatSizeInTiB(sizeInBytes, round);
    if (sizeInBytes >= 1024 ** 3) return formatSizeInGiB(sizeInBytes, round);
    if (sizeInBytes >= 1024 ** 2) return formatSizeInMiB(sizeInBytes, round);
    if (sizeInBytes >= 1024 ** 1) return formatSizeInKiB(sizeInBytes, round);

    return sizeInBytes;
};

/**
 * Retrieves the appropriate postfix for a size in bytes.
 *
 * This function returns the appropriate postfix (TiB, GiB, MiB, KiB, or B) for a given size in bytes.
 *
 * @param sizeInBytes The size in bytes to determine the postfix for.
 *
 * @returns The postfix as a string.
 */
export const getPostfix = (sizeInBytes: number): Postfix => {
    if (sizeInBytes >= 1024 ** 4) return 'TiB';
    if (sizeInBytes >= 1024 ** 3) return 'GiB';
    if (sizeInBytes >= 1024 ** 2) return 'MiB';
    if (sizeInBytes >= 1024 ** 1) return 'KiB';

    return 'B';
};

/**
 * Renders a resource label based on the label type and resource data.
 *
 * This function generates a resource label string based on the provided label type, resource data, and rounding option.
 * It formats the used, total, and free resource values and calculates the percentage if needed.
 *
 * @param lblType The type of label to render (used/total, used, free, or percentage).
 * @param rmUsg An object containing the resource usage data (used, total, percentage, and free).
 * @param round A boolean indicating whether to round the values.
 *
 * @returns The rendered resource label as a string.
 */
export const renderResourceLabel = (lblType: ResourceLabelType, rmUsg: GenericResourceData, round: boolean): string => {
    const { used, total, percentage, free } = rmUsg;

    const formatFunctions = {
        TiB: formatSizeInTiB,
        GiB: formatSizeInGiB,
        MiB: formatSizeInMiB,
        KiB: formatSizeInKiB,
        B: (size: number): number => size,
    };

    // Get the data in proper GiB, MiB, KiB, TiB, or bytes
    const totalSizeFormatted = autoFormatSize(total, round);
    // get the postfix: one of [TiB, GiB, MiB, KiB, B]
    const postfix = getPostfix(total);

    // Determine which format function to use
    const formatUsed = formatFunctions[postfix] || formatFunctions['B'];
    const usedSizeFormatted = formatUsed(used, round);

    if (lblType === 'used/total') {
        return `${usedSizeFormatted}/${totalSizeFormatted} ${postfix}`;
    }
    if (lblType === 'used') {
        return `${autoFormatSize(used, round)} ${getPostfix(used)}`;
    }
    if (lblType === 'free') {
        return `${autoFormatSize(free, round)} ${getPostfix(free)}`;
    }

    return `${percentage}%`;
};

/**
 * Formats a tooltip based on the data type and label type.
 *
 * This function generates a tooltip string based on the provided data type and label type.
 *
 * @param dataType The type of data to include in the tooltip.
 * @param lblTyp The type of label to format the tooltip for (used, free, used/total, or percentage).
 *
 * @returns The formatted tooltip as a string.
 */
export const formatTooltip = (dataType: string, lblTyp: ResourceLabelType): string => {
    switch (lblTyp) {
        case 'used':
            return `Used ${dataType}`;
        case 'free':
            return `Free ${dataType}`;
        case 'used/total':
            return `Used/Total ${dataType}`;
        case 'percentage':
            return `Percentage ${dataType} Usage`;
        default:
            return '';
    }
};
