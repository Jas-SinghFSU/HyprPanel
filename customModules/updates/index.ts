import options from 'options';
import { module } from '../module';

import { inputHandler } from 'customModules/utils';
import Gtk from 'types/@girs/gtk-3.0/gtk-3.0';
import Button from 'types/widgets/button';
import { Variable as VariableType } from 'types/variable';
import { pollVariableBash } from 'customModules/PollVar';
import { Module } from 'lib/types/bar';

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

const pendingUpdates: VariableType<string> = Variable(' 0');

const processUpdateCount = (updateCount: string): string => {
    if (!padZero.value) return updateCount;
    return `${updateCount.padStart(2, '0')}`;
};

pollVariableBash(
    pendingUpdates,
    [padZero.bind('value')],
    pollingInterval.bind('value'),
    updateCommand.value,
    processUpdateCount,
);

export const Updates = (): Module => {
    const updatesModule = module({
        textIcon: icon.bind('value'),
        tooltipText: pendingUpdates.bind('value').as((v) => `${v} updates available`),
        boxClass: 'updates',
        label: pendingUpdates.bind('value'),
        showLabelBinding: label.bind('value'),
        props: {
            setup: (self: Button<Gtk.Widget, Gtk.Widget>) => {
                inputHandler(self, {
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
                });
            },
        },
    });

    return updatesModule;
};
