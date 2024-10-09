const hyprland = await Service.import('hyprland');
import options from 'options';
import { module } from '../module';

import { inputHandler } from 'customModules/utils';
import Button from 'types/widgets/button';
import { Variable as VariableType } from 'types/variable';
import { Attribute, Child } from 'lib/types/widget';
import { BarBoxChild } from 'lib/types/bar';
import { capitalizeFirstLetter } from 'lib/utils';
import { getInitialSubmap, isSubmapEnabled } from './helpers';

const {
    label,
    showSubmapName,
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

const submapStatus: VariableType<string> = Variable('default');

hyprland.connect('submap', (_, currentSubmap) => {
    if (currentSubmap.length === 0) {
        submapStatus.value = 'default';
    } else {
        submapStatus.value = currentSubmap;
    }
});

getInitialSubmap(submapStatus);

export const Submap = (): BarBoxChild => {
    const submapModule = module({
        textIcon: Utils.merge(
            [submapStatus.bind('value'), enabledIcon.bind('value'), disabledIcon.bind('value')],
            (status, enabled, disabled) => {
                return isSubmapEnabled(status, enabled, disabled);
            },
        ),
        tooltipText: Utils.merge(
            [
                submapStatus.bind('value'),
                enabledText.bind('value'),
                disabledText.bind('value'),
                showSubmapName.bind('value'),
            ],
            (status, enabled, disabled, showSmName) => {
                if (showSmName) {
                    return capitalizeFirstLetter(status);
                }
                return isSubmapEnabled(status, enabled, disabled);
            },
        ),
        boxClass: 'submap',
        label: Utils.merge(
            [
                submapStatus.bind('value'),
                enabledText.bind('value'),
                disabledText.bind('value'),
                showSubmapName.bind('value'),
            ],
            (status, enabled, disabled, showSmName) => {
                if (showSmName) {
                    return capitalizeFirstLetter(status);
                }
                return isSubmapEnabled(status, enabled, disabled);
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
