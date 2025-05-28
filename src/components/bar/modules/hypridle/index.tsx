import { Module } from '../../shared/module';
import Variable from 'astal/variable';
import { bind } from 'astal';
import { Astal } from 'astal/gtk3';
import { idleInhibit } from 'src/lib/window/visibility';
import { BarBoxChild } from 'src/components/bar/types';
import { InputHandlerService } from '../../utils/input/inputHandler';
import options from 'src/configuration';

const inputHandler = InputHandlerService.getInstance();

const { label, onIcon, offIcon, onLabel, offLabel, rightClick, middleClick, scrollUp, scrollDown } =
    options.bar.customModules.hypridle;

function toggleInhibit(): void {
    idleInhibit.set(idleInhibit.get() === false);
}

export const Hypridle = (): BarBoxChild => {
    const iconBinding = Variable.derive(
        [bind(idleInhibit), bind(onIcon), bind(offIcon)],
        (active, onIcn, offIcn) => {
            return active === true ? onIcn : offIcn;
        },
    );

    const labelBinding = Variable.derive(
        [bind(idleInhibit), bind(onLabel), bind(offLabel)],
        (active, onLbl, offLbl) => {
            return active === true ? onLbl : offLbl;
        },
    );

    let inputHandlerBindings: Variable<void>;

    const hypridleModule = Module({
        textIcon: iconBinding(),
        tooltipText: bind(idleInhibit).as(
            (active) => `Idle Inhibitor: ${active === true ? 'Enabled' : 'Disabled'}`,
        ),
        boxClass: 'hypridle',
        label: labelBinding(),
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandlerBindings = inputHandler.attachHandlers(self, {
                    onPrimaryClick: {
                        fn: () => {
                            toggleInhibit();
                        },
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
                iconBinding.drop();
                labelBinding.drop();
            },
        },
    });

    return hypridleModule;
};
