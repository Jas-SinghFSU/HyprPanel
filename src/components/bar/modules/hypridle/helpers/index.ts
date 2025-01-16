import options from 'src/options';
import { execAsync, Variable } from 'astal';

const { startCommand, stopCommand, isActiveCommand } = options.bar.customModules.hypridle;

/**
 * Checks if the hypridle process is active.
 *
 * This command checks if the hypridle process is currently running by using the configured `isActiveCommand`.
 * It returns 'yes' if the process is found and 'no' otherwise.
 */
export const isActiveCmd = `bash -c "${isActiveCommand.get()}"`;

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
    execAsync(isActiveCmd).then((res) => {
        isActive.set(res.trim() === 'yes');
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
    execAsync(isActiveCmd).then((res) => {
        const toggleIdleCommand =
            res.trim() === 'no' ? `bash -c "${startCommand.get()}"` : `bash -c "${stopCommand.get()}"`;

        execAsync(toggleIdleCommand).then(() => updateIsActive(isActive));
    });
};

/**
 * Checks the current status of the hypridle process and updates the active state.
 *
 * This function checks if the hypridle process is currently running and updates the `isActive` variable accordingly.
 */
export const checkIdleStatus = (): undefined => {
    execAsync(isActiveCmd).then((res) => {
        isActive.set(res.trim() === 'yes');
    });
};
