import options from 'options';

import { Variable as TVariable } from 'types/variable';

const { temperature } = options.bar.customModules.hyprsunset;

export const isActiveCommand = `bash -c "pgrep -x "hyprsunset" > /dev/null && echo "yes" || echo "no""`;

export const isActive = Variable(false);

export const toggleSunset = (isActive: TVariable<boolean>): void => {
    Utils.execAsync(isActiveCommand).then((res) => {
        if (res === 'no') {
            Utils.execAsync(`bash -c "nohup hyprsunset -t ${temperature.value} > /dev/null 2>&1 &"`).then(() => {
                Utils.execAsync(isActiveCommand).then((res) => {
                    isActive.value = res === 'yes';
                });
            });
        } else {
            Utils.execAsync(`bash -c "pkill hyprsunset "`).then(() => {
                Utils.execAsync(isActiveCommand).then((res) => {
                    isActive.value = res === 'yes';
                });
            });
        }
    });
};

export const checkSunsetStatus = (): undefined => {
    Utils.execAsync(isActiveCommand).then((res) => {
        isActive.value = res === 'yes';
    });
};
