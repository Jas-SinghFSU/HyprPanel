import { execAsync, Variable } from 'astal';

export const isActiveCommand = `bash -c "pgrep -x 'hypridle' &>/dev/null && echo 'yes' || echo 'no'"`;

export const isActive = Variable(false);

export const toggleIdle = (isActive: Variable<boolean>): void => {
    execAsync(isActiveCommand).then((res) => {
        if (res === 'no') {
            execAsync(`bash -c "nohup hypridle > /dev/null 2>&1 &"`).then(() => {
                execAsync(isActiveCommand).then((res) => {
                    isActive.set(res === 'yes');
                });
            });
        } else {
            execAsync(`bash -c "pkill hypridle "`).then(() => {
                execAsync(isActiveCommand).then((res) => {
                    isActive.set(res === 'yes');
                });
            });
        }
    });
};

export const checkIdleStatus = (): undefined => {
    execAsync(isActiveCommand).then((res) => {
        isActive.set(res === 'yes');
    });
};
