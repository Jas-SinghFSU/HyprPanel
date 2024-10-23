import { ResourceLabelType } from 'lib/types/bar';
import { GenericResourceData, Postfix } from 'lib/types/customModules/generic';
import { InputHandlerEvents, RunAsyncCommand } from 'lib/types/customModules/utils';
import { ThrottleFn, ThrottleFnCallback } from 'lib/types/utils';
import { Attribute, Child, EventArgs } from 'lib/types/widget';
import { Binding } from 'lib/utils';
import { openMenu } from 'modules/bar/utils';
import options from 'options';
import Gdk from 'types/@girs/gdk-3.0/gdk-3.0';
import { Variable as VariableType } from 'types/variable';
import Button from 'types/widgets/button';

const { scrollSpeed } = options.bar.customModules;

export const runAsyncCommand: RunAsyncCommand = (cmd, events, fn): void => {
    if (cmd.startsWith('menu:')) {
        const menuName = cmd.split(':')[1].trim().toLowerCase();
        openMenu(events.clicked, events.event, `${menuName}menu`);

        return;
    }

    Utils.execAsync(`bash -c "${cmd}"`)
        .then((output) => {
            if (fn !== undefined) {
                fn(output);
            }
        })
        .catch((err) => console.error(`Error running command "${cmd}": ${err})`));
};

export function throttle<T extends ThrottleFn>(func: T, limit: number): T {
    let inThrottle: boolean;
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

export const throttledScrollHandler = (interval: number): ThrottleFn =>
    throttle((cmd: string, events: EventArgs, fn: ThrottleFnCallback) => {
        runAsyncCommand(cmd, events, fn);
    }, 200 / interval);

const dummyVar = Variable('');

export const inputHandler = (
    self: Button<Child, Attribute>,
    { onPrimaryClick, onSecondaryClick, onMiddleClick, onScrollUp, onScrollDown }: InputHandlerEvents,
): void => {
    const sanitizeInput = (input: VariableType<string>): string => {
        if (input === undefined) {
            return '';
        }
        return input.value;
    };

    const updateHandlers = (): void => {
        const interval = scrollSpeed.value;
        const throttledHandler = throttledScrollHandler(interval);

        self.on_primary_click = (clicked: Button<Child, Attribute>, event: Gdk.Event): void =>
            runAsyncCommand(sanitizeInput(onPrimaryClick?.cmd || dummyVar), { clicked, event }, onPrimaryClick.fn);

        self.on_secondary_click = (clicked: Button<Child, Attribute>, event: Gdk.Event): void =>
            runAsyncCommand(sanitizeInput(onSecondaryClick?.cmd || dummyVar), { clicked, event }, onSecondaryClick.fn);

        self.on_middle_click = (clicked: Button<Child, Attribute>, event: Gdk.Event): void =>
            runAsyncCommand(sanitizeInput(onMiddleClick?.cmd || dummyVar), { clicked, event }, onMiddleClick.fn);

        self.on_scroll_up = (clicked: Button<Child, Attribute>, event: Gdk.Event): void =>
            throttledHandler(sanitizeInput(onScrollUp?.cmd || dummyVar), { clicked, event }, onScrollUp.fn);

        self.on_scroll_down = (clicked: Button<Child, Attribute>, event: Gdk.Event): void =>
            throttledHandler(sanitizeInput(onScrollDown?.cmd || dummyVar), { clicked, event }, onScrollDown.fn);
    };

    // Initial setup of event handlers
    updateHandlers();

    const sanitizeVariable = (someVar: VariableType<string> | undefined): Binding<string> => {
        if (someVar === undefined || typeof someVar.bind !== 'function') {
            return dummyVar.bind('value');
        }
        return someVar.bind('value');
    };

    // Re-run the update whenever scrollSpeed changes
    Utils.merge(
        [
            scrollSpeed.bind('value'),
            sanitizeVariable(onPrimaryClick),
            sanitizeVariable(onSecondaryClick),
            sanitizeVariable(onMiddleClick),
            sanitizeVariable(onScrollUp),
            sanitizeVariable(onScrollDown),
        ],
        updateHandlers,
    );
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
