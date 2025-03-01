import options from 'src/options';
import { Module } from '../../shared/Module';
import { inputHandler } from '../../utils/helpers';
import Variable from 'astal/variable';
import { bind } from 'astal';
import { BarBoxChild } from 'src/lib/types/bar';
import { Astal } from 'astal/gtk3';

const { label, onIcon, offIcon, onLabel, offLabel, rightClick, middleClick, scrollUp, scrollDown } =
    options.bar.customModules.hypridle;

function toggleInhibit(): void {
    idleInhibit.set(!idleInhibit.get());
}

export const Hypridle = (): BarBoxChild => {
    const iconBinding = Variable.derive([bind(idleInhibit), bind(onIcon), bind(offIcon)], (active, onIcn, offIcn) => {
        return active ? onIcn : offIcn;
    });

    const labelBinding = Variable.derive(
        [bind(idleInhibit), bind(onLabel), bind(offLabel)],
        (active, onLbl, offLbl) => {
            return active ? onLbl : offLbl;
        },
    );

    const hypridleModule = Module({
        textIcon: iconBinding(),
        tooltipText: bind(idleInhibit).as((active) => `Idle Inhibitor: ${active ? 'Enabled' : 'Disabled'}`),
        boxClass: 'hypridle',
        label: labelBinding(),
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandler(self, {
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
                iconBinding.drop();
                labelBinding.drop();
            },
        },
    });

    return hypridleModule;
};
