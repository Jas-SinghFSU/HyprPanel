import options from 'options';
import { module } from '../module';

import { inputHandler } from 'customModules/utils';
import Button from 'types/widgets/button';
import { Attribute, Child } from 'lib/types/widget';
import { BarBoxChild } from 'lib/types/bar';
import { pollVariable } from 'customModules/PollVar';

const { label, pollingInterval, onIcon, offIcon, onLabel, offLabel, rightClick, middleClick, scrollUp, scrollDown } =
    options.bar.customModules.hyprsunset;

const isActive = Variable(false);

const isActiveCommand = `bash -c "pgrep -x "hyprsunset" > /dev/null && echo "yes" || echo "no""`;

const checkSunsetStatus = (): boolean => {
    const isRunning = Utils.exec(isActiveCommand);
    console.log(isRunning);
    return isRunning === 'yes';
};

const toggleSunset = (): void => {
    Utils.execAsync(isActiveCommand).then((res) => {
        if (res === 'no') {
            Utils.execAsync(`bash -c "hyprsunset"`).then(() => {
                Utils.execAsync(isActiveCommand).then((res) => {
                    isActive.value = res === 'yes';
                });
            });
        } else {
            Utils.execAsync(`bash -c "pkill -SIGTERM hyprsunset"`).then(() => {
                Utils.execAsync(isActiveCommand).then((res) => {
                    isActive.value = res === 'yes';
                });
            });
        }
    });
};

pollVariable(isActive, [], pollingInterval.bind('value'), checkSunsetStatus);

export const Hyprsunset = (): BarBoxChild => {
    const hyprsunsetModule = module({
        textIcon: isActive.bind('value').as((active) => (active ? onIcon.value : offIcon.value)),
        tooltipText: isActive.bind('value').as((v) => `${v} updates available`),
        boxClass: 'hyprsunset',
        label: isActive.bind('value').as((active) => (active ? onLabel : offLabel)),
        showLabelBinding: label.bind('value'),
        props: {
            onPrimaryClick: toggleSunset,
            setup: (self: Button<Child, Attribute>) => {
                inputHandler(self, {
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

    return hyprsunsetModule;
};
