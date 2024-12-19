import { execAsync, Variable } from 'astal';

/**
 * Checks if the hypridle process is active.
 *
 * This command checks if the hypridle process is currently running by using the `pgrep` command.
 * It returns 'yes' if the process is found and 'no' otherwise.
 */
export const isActiveCommand = `bash -c "pgrep -x 'hypridle' &>/dev/null && echo 'yes' || echo 'no'"`;

/**
 * A variable to track the active state of the hypridle process.
 */
export const isActive = Variable(false);

/**
 * Updates the active state of the hypridle process.
 *
 * This function checks if the hypridle process is currently running and updates the `isActive` variable accordingly.
 *
 * @param isActive A Variable<boolean> that tracks the active state of the hypridle process.
 */
const updateIsActive = (isActive: Variable<boolean>): void => {
    execAsync(isActiveCommand).then((res) => {
        isActive.set(res === 'yes');
    });
};

/**
 * Toggles the hypridle process on or off based on its current state.
 *
 * This function checks if the hypridle process is currently running. If it is not running, it starts the process.
 * If it is running, it stops the process. The active state is updated accordingly.
 *
 * @param isActive A Variable<boolean> that tracks the active state of the hypridle process.
 */
export const toggleIdle = (isActive: Variable<boolean>): void => {
    execAsync(isActiveCommand).then((res) => {
        const toggleIdleCommand =
            res === 'no' ? `bash -c "nohup hypridle > /dev/null 2>&1 &"` : `bash -c "pkill hypridle"`;

        execAsync(toggleIdleCommand).then(() => updateIsActive(isActive));
    });
};

/**
 * Checks the current status of the hypridle process and updates the active state.
 *
 * This function checks if the hypridle process is currently running and updates the `isActive` variable accordingly.
 */
export const checkIdleStatus = (): undefined => {
    execAsync(isActiveCommand).then((res) => {
        isActive.set(res === 'yes');
    });
};
