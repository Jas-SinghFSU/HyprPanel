import { execAsync, Variable } from 'astal';

export const isActiveCommand = `bash -c "pgrep -x 'hypridle' &>/dev/null && echo 'yes' || echo 'no'"`;

export const isActive = Variable(false);

const updateIsActive = (isActive: Variable<boolean>): void => {
    execAsync(isActiveCommand).then((res) => {
        isActive.set(res === 'yes');
    });
};

export const toggleIdle = (isActive: Variable<boolean>): void => {
    execAsync(isActiveCommand).then((res) => {
        const toggleIdleCommand =
            res === 'no' ? `bash -c "nohup hypridle > /dev/null 2>&1 &"` : `bash -c "pkill hypridle"`;

        execAsync(toggleIdleCommand).then(() => updateIsActive(isActive));
    });
};

export const checkIdleStatus = (): undefined => {
    execAsync(isActiveCommand).then((res) => {
        isActive.set(res === 'yes');
    });
};
