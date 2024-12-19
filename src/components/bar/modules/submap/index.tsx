import { hyprlandService } from 'src/lib/constants/services';
import options from 'src/options';
import { Module } from '../../shared/Module';
import { inputHandler } from 'src/components/bar/utils/helpers';
import { BarBoxChild } from 'src/lib/types/bar';
import { capitalizeFirstLetter } from 'src/lib/utils';
import { getInitialSubmap, isSubmapEnabled } from './helpers';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';

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

const submapStatus: Variable<string> = Variable('default');

hyprlandService.connect('submap', (_, currentSubmap) => {
    if (currentSubmap.length === 0) {
        submapStatus.set('default');
    } else {
        submapStatus.set(currentSubmap);
    }
});

getInitialSubmap(submapStatus);

export const Submap = (): BarBoxChild => {
    const submapLabel = Variable.derive(
        [bind(submapStatus), bind(enabledText), bind(disabledText), bind(showSubmapName)],
        (status, enabled, disabled, showSmName) => {
            if (showSmName) {
                return capitalizeFirstLetter(status);
            }
            return isSubmapEnabled(status, enabled, disabled);
        },
    );
    const submapIcon = Variable.derive(
        [bind(submapStatus), bind(enabledIcon), bind(disabledIcon)],
        (status, enabled, disabled) => {
            return isSubmapEnabled(status, enabled, disabled);
        },
    );

    const submapModule = Module({
        textIcon: submapIcon(),
        tooltipText: submapLabel(),
        label: submapLabel(),
        showLabelBinding: bind(label),
        boxClass: 'submap',
        props: {
            setup: (self: Astal.Button) => {
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
            onDestroy: () => {
                submapLabel.drop();
                submapIcon.drop();
            },
        },
    });

    return submapModule;
};
