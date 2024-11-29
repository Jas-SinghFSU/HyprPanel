import { execAsync, Variable } from 'astal';
import options from 'src/options';

const { temperature } = options.bar.customModules.hyprsunset;

export const isActiveCommand = `bash -c "pgrep -x 'hyprsunset' > /dev/null && echo 'yes' || echo 'no'"`;

export const isActive = Variable(false);

export const toggleSunset = (isActive: Variable<boolean>): void => {
    execAsync(isActiveCommand).then((res) => {
        if (res === 'no') {
            execAsync(`bash -c "nohup hyprsunset -t ${temperature.value} > /dev/null 2>&1 &"`).then(() => {
                execAsync(isActiveCommand).then((res) => {
                    isActive.set(res === 'yes');
                });
            });
        } else {
            execAsync(`bash -c "pkill hyprsunset "`).then(() => {
                execAsync(isActiveCommand).then((res) => {
                    isActive.set(res === 'yes');
                });
            });
        }
    });
};

export const checkSunsetStatus = (): undefined => {
    execAsync(isActiveCommand).then((res) => {
        isActive.set(res === 'yes');
    });
};
