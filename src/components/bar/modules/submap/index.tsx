import { Module } from '../../shared/module';
import { getInitialSubmap, isSubmapEnabled } from './helpers';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import options from 'src/configuration';
import { capitalizeFirstLetter } from 'src/lib/string/formatters';
import { BarBoxChild } from 'src/components/bar/types';
import { InputHandlerService } from '../../utils/input/inputHandler';

const inputHandler = InputHandlerService.getInstance();

const hyprlandService = AstalHyprland.get_default();
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

    let inputHandlerBindings: Variable<void>;

    const submapModule = Module({
        textIcon: submapIcon(),
        tooltipText: submapLabel(),
        label: submapLabel(),
        showLabelBinding: bind(label),
        boxClass: 'submap',
        props: {
            setup: (self: Astal.Button) => {
                inputHandlerBindings = inputHandler.attachHandlers(self, {
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
                inputHandlerBindings.drop();
                submapLabel.drop();
                submapIcon.drop();
            },
        },
    });

    return submapModule;
};
