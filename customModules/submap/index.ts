const hyprland = await Service.import('hyprland');
import options from 'options';
import { module } from '../module';

import { inputHandler } from 'customModules/utils';
import Button from 'types/widgets/button';
import { Variable as VariableType } from 'types/variable';
import { Attribute, Child } from 'lib/types/widget';
import { BarBoxChild } from 'lib/types/bar';

const {
    label,
    enabledIcon,
    disabledIcon,
    enabledText,
    disabledText,
    leftClick,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
} = options.bar.customModules.submap;

const submapStatus: VariableType<boolean> = Variable(false);

hyprland.connect('submap', () => {
    submapStatus.value = !submapStatus.value;
});

export const Submap = (): BarBoxChild => {
    const submapModule = module({
        textIcon: Utils.merge(
            [submapStatus.bind('value'), enabledIcon.bind('value'), disabledIcon.bind('value')],
            (status, enabled, disabled) => {
                return status ? enabled : disabled;
            },
        ),
        tooltipText: Utils.merge(
            [submapStatus.bind('value'), enabledText.bind('value'), disabledText.bind('value')],
            (status, enabled, disabled) => {
                return status ? enabled : disabled;
            },
        ),
        boxClass: 'submap',
        label: Utils.merge(
            [submapStatus.bind('value'), enabledText.bind('value'), disabledText.bind('value')],
            (status, enabled, disabled) => {
                return status ? enabled : disabled;
            },
        ),
        showLabelBinding: label.bind('value'),
        props: {
            setup: (self: Button<Child, Attribute>) => {
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

    return submapModule;
};
