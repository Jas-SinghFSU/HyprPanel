import options from 'options';
import { module } from '../../utils/module';

import { inputHandler } from 'src/components/bar/utils/bar';
import Button from 'types/widgets/button';
import { Attribute, Child } from 'src/lib/types/widget';
import { BarBoxChild } from 'src/lib/types/bar';

const { icon, leftClick, rightClick, middleClick, scrollUp, scrollDown } = options.bar.customModules.power;

export const Power = (): BarBoxChild => {
    const powerModule = module({
        tooltipText: 'Power Menu',
        textIcon: icon.bind('value'),
        boxClass: 'powermodule',
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

    return powerModule;
};
