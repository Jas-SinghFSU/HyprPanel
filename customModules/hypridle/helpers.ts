import { Variable as TVariable } from 'types/variable';

export const isActiveCommand = `bash -c "pgrep -x "hypridle" > /dev/null && echo "yes" || echo "no""`;

export const isActive = Variable(false);

export const toggleIdle = (isActive: TVariable<boolean>): void => {
    Utils.execAsync(isActiveCommand).then((res) => {
        if (res === 'no') {
            Utils.execAsync(`bash -c "nohup hypridle > /dev/null 2>&1 &"`).then(() => {
                Utils.execAsync(isActiveCommand).then((res) => {
                    isActive.value = res === 'yes';
                });
            });
        } else {
            Utils.execAsync(`bash -c "pkill hypridle "`).then(() => {
                Utils.execAsync(isActiveCommand).then((res) => {
                    isActive.value = res === 'yes';
                });
            });
        }
    });
};

export const checkIdleStatus = (): undefined => {
    Utils.execAsync(isActiveCommand).then((res) => {
        isActive.value = res === 'yes';
    });
};
