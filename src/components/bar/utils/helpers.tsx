import { ResourceLabelType } from 'src/lib/types/bar';
import { GenericResourceData, Postfix, UpdateHandlers } from 'src/lib/types/customModules/generic';
import { InputHandlerEvents, RunAsyncCommand } from 'src/lib/types/customModules/utils';
import { ThrottleFn } from 'src/lib/types/utils';
import { bind, Binding, execAsync, Variable } from 'astal';
import { openMenu } from 'src/components/bar/utils/menu';
import options from 'src/options';
import { Gdk } from 'astal/gtk3';
import { GtkWidget } from 'src/lib/types/widget';
import { onMiddleClick, onPrimaryClick, onSecondaryClick } from 'src/lib/shared/eventHandlers';

const { scrollSpeed } = options.bar.customModules;

const handlePostInputUpdater = (postInputUpdater?: Variable<boolean>): void => {
    if (postInputUpdater !== undefined) {
        postInputUpdater.set(!postInputUpdater.get());
    }
};

export const runAsyncCommand: RunAsyncCommand = (cmd, events, fn, postInputUpdater?: Variable<boolean>): void => {
    if (cmd.startsWith('menu:')) {
        const menuName = cmd.split(':')[1].trim().toLowerCase();
        openMenu(events.clicked, events.event, `${menuName}menu`);

        return;
    }

    execAsync(`bash -c "${cmd}"`)
        .then((output) => {
            handlePostInputUpdater(postInputUpdater);
            if (fn !== undefined) {
                fn(output);
            }
        })
        .catch((err) => console.error(`Error running command "${cmd}": ${err})`));
};

/**
 * Generic throttle function to limit the rate at which a function can be called.
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
 */
export const throttledScrollHandler = (interval: number): ThrottleFn =>
    throttleInput((cmd: string, args, fn, postInputUpdater) => {
        console.log('input command');

        runAsyncCommand(cmd, args, fn, postInputUpdater);
    }, 200 / interval);

const dummyVar = Variable('');

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
    const sanitizeInput = (input: Variable<string>): string => {
        if (input === undefined) {
            return '';
        }
        return input.get();
    };

    const updateHandlers = (): UpdateHandlers => {
        const interval = scrollSpeed.value;
        const throttledHandler = throttledScrollHandler(interval);

        const disconnectPrimaryClick = onPrimaryClick(self, (clicked: GtkWidget, event: Gdk.Event) => {
            runAsyncCommand(
                sanitizeInput(onPrimaryClickInput?.cmd || dummyVar),
                { clicked, event },
                onPrimaryClickInput.fn,
                postInputUpdater,
            );
        });

        const disconnectSecondaryClick = onSecondaryClick(self, (clicked: GtkWidget, event: Gdk.Event) => {
            runAsyncCommand(
                sanitizeInput(onSecondaryClickInput?.cmd || dummyVar),
                { clicked, event },
                onSecondaryClickInput.fn,
                postInputUpdater,
            );
        });

        const disconnectMiddleClick = onMiddleClick(self, (clicked: GtkWidget, event: Gdk.Event) => {
            runAsyncCommand(
                sanitizeInput(onMiddleClickInput?.cmd || dummyVar),
                { clicked, event },
                onMiddleClickInput.fn,
                postInputUpdater,
            );
        });

        const id = self.connect('scroll-event', (self: GtkWidget, event: Gdk.Event) => {
            const eventDirection = event.get_scroll_direction()[1];
            if (eventDirection === Gdk.ScrollDirection.UP) {
                throttledHandler(
                    sanitizeInput(onScrollUpInput?.cmd),
                    { clicked: self, event },
                    onScrollUpInput.fn,
                    postInputUpdater,
                );
            } else if (eventDirection === Gdk.ScrollDirection.DOWN) {
                throttledHandler(
                    sanitizeInput(onScrollDownInput?.cmd),
                    { clicked: self, event },
                    onScrollDownInput.fn,
                    postInputUpdater,
                );
            }
        });

        return {
            disconnectPrimary: disconnectPrimaryClick,
            disconnectSecondary: disconnectSecondaryClick,
            disconnectMiddle: disconnectMiddleClick,
            disconnectScroll: () => self.disconnect(id),
        };
    };

    // Initial setup of event handlers
    updateHandlers();

    const sanitizeVariable = (someVar: Variable<string> | undefined): Binding<string> => {
        if (someVar === undefined || typeof someVar.bind !== 'function') {
            return bind(dummyVar);
        }
        return bind(someVar);
    };

    // Re-run the update whenever scrollSpeed changes
    Variable.derive(
        [
            bind(scrollSpeed),
            sanitizeVariable(onPrimaryClickInput),
            sanitizeVariable(onSecondaryClickInput),
            sanitizeVariable(onMiddleClickInput),
            sanitizeVariable(onScrollUpInput),
            sanitizeVariable(onScrollDownInput),
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

export const divide = ([total, used]: number[], round: boolean): number => {
    const percentageTotal = (used / total) * 100;
    if (round) {
        return total > 0 ? Math.round(percentageTotal) : 0;
    }
    return total > 0 ? parseFloat(percentageTotal.toFixed(2)) : 0;
};

export const formatSizeInKiB = (sizeInBytes: number, round: boolean): number => {
    const sizeInGiB = sizeInBytes / 1024 ** 1;
    return round ? Math.round(sizeInGiB) : parseFloat(sizeInGiB.toFixed(2));
};
export const formatSizeInMiB = (sizeInBytes: number, round: boolean): number => {
    const sizeInGiB = sizeInBytes / 1024 ** 2;
    return round ? Math.round(sizeInGiB) : parseFloat(sizeInGiB.toFixed(2));
};
export const formatSizeInGiB = (sizeInBytes: number, round: boolean): number => {
    const sizeInGiB = sizeInBytes / 1024 ** 3;
    return round ? Math.round(sizeInGiB) : parseFloat(sizeInGiB.toFixed(2));
};
export const formatSizeInTiB = (sizeInBytes: number, round: boolean): number => {
    const sizeInGiB = sizeInBytes / 1024 ** 4;
    return round ? Math.round(sizeInGiB) : parseFloat(sizeInGiB.toFixed(2));
};

export const autoFormatSize = (sizeInBytes: number, round: boolean): number => {
    // auto convert to GiB, MiB, KiB, TiB, or bytes
    if (sizeInBytes >= 1024 ** 4) return formatSizeInTiB(sizeInBytes, round);
    if (sizeInBytes >= 1024 ** 3) return formatSizeInGiB(sizeInBytes, round);
    if (sizeInBytes >= 1024 ** 2) return formatSizeInMiB(sizeInBytes, round);
    if (sizeInBytes >= 1024 ** 1) return formatSizeInKiB(sizeInBytes, round);

    return sizeInBytes;
};

export const getPostfix = (sizeInBytes: number): Postfix => {
    if (sizeInBytes >= 1024 ** 4) return 'TiB';
    if (sizeInBytes >= 1024 ** 3) return 'GiB';
    if (sizeInBytes >= 1024 ** 2) return 'MiB';
    if (sizeInBytes >= 1024 ** 1) return 'KiB';

    return 'B';
};

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
