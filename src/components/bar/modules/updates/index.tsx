import options from 'src/options';
import { module } from '../../shared/module';
import { inputHandler } from 'src/components/bar/utils/helpers';
import { BarBoxChild } from 'src/lib/types/bar';
import { BashPoller } from 'src/lib/poller/BashPoller';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';

const {
    updateCommand,
    label,
    padZero,
    pollingInterval,
    icon,
    leftClick,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
} = options.bar.customModules.updates;

const pendingUpdates: Variable<string> = Variable('0');
const postInputUpdater = Variable(true);

const processUpdateCount = (updateCount: string): string => {
    if (!padZero.get()) return updateCount;
    return `${updateCount.padStart(2, '0')}`;
};

const updatesPoller = new BashPoller<string, []>(
    pendingUpdates,
    [bind(padZero), bind(postInputUpdater)],
    bind(pollingInterval),
    updateCommand.get(),
    processUpdateCount,
);

updatesPoller.initialize('updates');

export const Updates = (): BarBoxChild => {
    const updatesModule = module({
        textIcon: bind(icon),
        tooltipText: bind(pendingUpdates).as((v) => `${v} updates available`),
        boxClass: 'updates',
        label: bind(pendingUpdates),
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandler(
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
        },
    });

    return updatesModule;
};
