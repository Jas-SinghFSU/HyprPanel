import options from 'options';
import { module } from '../module';

import { inputHandler } from 'customModules/utils';
import Button from 'types/widgets/button';
import { Variable as TVariable } from 'types/variable';
import { Attribute, Child } from 'lib/types/widget';
import { BarBoxChild } from 'lib/types/bar';
import { BashPoller } from 'lib/poller/BashPoller';

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

const pendingUpdates: TVariable<string> = Variable('0');
const postInputUpdater = Variable(true);

const processUpdateCount = (updateCount: string): string => {
    if (!padZero.value) return updateCount;
    return `${updateCount.padStart(2, '0')}`;
};

const updatesPoller = new BashPoller<string, []>(
    pendingUpdates,
    [padZero.bind('value'), postInputUpdater.bind('value')],
    pollingInterval.bind('value'),
    updateCommand.value,
    processUpdateCount,
);

updatesPoller.initialize('updates');

export const Updates = (): BarBoxChild => {
    const updatesModule = module({
        textIcon: icon.bind('value'),
        tooltipText: pendingUpdates.bind('value').as((v) => `${v} updates available`),
        boxClass: 'updates',
        label: pendingUpdates.bind('value'),
        showLabelBinding: label.bind('value'),
        props: {
            setup: (self: Button<Child, Attribute>) => {
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
