import { Module } from '../../shared/module';
import { BashPoller } from 'src/lib/poller/BashPoller';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/components/bar/types';
import options from 'src/configuration';
import { InputHandlerService } from '../../utils/input/inputHandler';

const inputHandler = InputHandlerService.getInstance();

const {
    updateCommand,
    updateTooltipCommand,
    extendedTooltip,
    label,
    padZero,
    autoHide,
    pollingInterval,
    icon,
    leftClick,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
} = options.bar.customModules.updates;

const pendingUpdates: Variable<string> = Variable('0');
const pendingUpdatesTooltip: Variable<string> = Variable('');
const postInputUpdater = Variable(true);
const isVis = Variable(!autoHide.get());

const processUpdateCount = (updateCount: string): string => {
    if (!padZero.get()) return updateCount;
    return `${updateCount.padStart(2, '0')}`;
};

const processUpdateTooltip = (updateTooltip: string, updateCount: Variable<string>): string => {
    const defaultTooltip = updateCount.get() + ' updates available';
    if (!extendedTooltip.get() || !updateTooltip) return defaultTooltip;
    return defaultTooltip + '\n\n' + updateTooltip;
};

const updatesPoller = new BashPoller<string, []>(
    pendingUpdates,
    [bind(padZero), bind(postInputUpdater), bind(updateCommand)],
    bind(pollingInterval),
    updateCommand.get(),
    processUpdateCount,
);

const tooltipPoller = new BashPoller<string, [Variable<string>]>(
    pendingUpdatesTooltip,
    [bind(extendedTooltip), bind(postInputUpdater), bind(updateTooltipCommand)],
    bind(pollingInterval),
    updateTooltipCommand.get(),
    processUpdateTooltip,
    pendingUpdates,
);

updatesPoller.initialize('updates');
tooltipPoller.initialize('updates');

Variable.derive([bind(autoHide)], (autoHideModule) => {
    isVis.set(!autoHideModule || (autoHideModule && parseFloat(pendingUpdates.get()) > 0));
});

const updatesIcon = Variable.derive(
    [bind(icon.pending), bind(icon.updated), bind(pendingUpdates)],
    (pendingIcon, updatedIcon, pUpdates) => {
        isVis.set(!autoHide.get() || (autoHide.get() && parseFloat(pUpdates) > 0));
        return parseFloat(pUpdates) === 0 ? updatedIcon : pendingIcon;
    },
);

export const Updates = (): BarBoxChild => {
    let inputHandlerBindings: Variable<void>;

    const updatesModule = Module({
        textIcon: updatesIcon(),
        tooltipText: bind(pendingUpdatesTooltip),
        boxClass: 'updates',
        isVis: bind(isVis),
        label: bind(pendingUpdates),
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandlerBindings = inputHandler.attachHandlers(
                    self,
                    {
                        onPrimaryClick: {
                            cmd: leftClick,
                        },
                        onSecondaryClick: {
                            cmd: rightClick,
                        },
                        onMiddleClick: {
                            cmd: middleClick,
                        },
                        onScrollUp: {
                            cmd: scrollUp,
                        },
                        onScrollDown: {
                            cmd: scrollDown,
                        },
                    },
                    postInputUpdater,
                );
            },
            onDestroy: () => {
                inputHandlerBindings.drop();
            },
        },
    });

    return updatesModule;
};
