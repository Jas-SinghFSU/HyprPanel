import { Module } from '../../shared/module';
import { getKeyboardLayout } from './helpers';
import { bind, Variable } from 'astal';
import { useHook } from 'src/lib/shared/hookHandler';
import { Astal } from 'astal/gtk3';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { BarBoxChild } from 'src/components/bar/types';
import { InputHandlerService } from '../../utils/input/inputHandler';
import options from 'src/configuration';

const inputHandler = InputHandlerService.getInstance();

const hyprlandService = AstalHyprland.get_default();
const { label, labelType, icon, leftClick, rightClick, middleClick, scrollUp, scrollDown } =
    options.bar.customModules.kbLayout;

function setLabel(self: Astal.Label): void {
    try {
        const devices = hyprlandService.message('j/devices');
        self.label = getKeyboardLayout(devices, labelType.get());
    } catch (error) {
        console.error(error);
    }
}

export const KbInput = (): BarBoxChild => {
    let inputHandlerBindings: Variable<void>;

    const keyboardModule = Module({
        textIcon: bind(icon),
        tooltipText: '',
        labelHook: (self: Astal.Label): void => {
            useHook(
                self,
                hyprlandService,
                () => {
                    setLabel(self);
                },
                'keyboard-layout',
            );

            useHook(self, labelType, () => {
                setLabel(self);
            });
        },
        boxClass: 'kblayout',
        showLabelBinding: bind(label),
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
            },
        },
    });

    return keyboardModule;
};
