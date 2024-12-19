import { execAsync, Variable } from 'astal';
import options from 'src/options';

const { temperature } = options.bar.customModules.hyprsunset;

/**
 * Checks if the hyprsunset process is active.
 *
 * This command checks if the hyprsunset process is currently running by using the `pgrep` command.
 * It returns 'yes' if the process is found and 'no' otherwise.
 */
export const isActiveCommand = `bash -c "pgrep -x 'hyprsunset' > /dev/null && echo 'yes' || echo 'no'"`;

/**
 * A variable to track the active state of the hyprsunset process.
 */
export const isActive = Variable(false);

/**
 * Toggles the hyprsunset process on or off based on its current state.
 *
 * This function checks if the hyprsunset process is currently running. If it is not running, it starts the process with the specified temperature.
 * If it is running, it stops the process. The active state is updated accordingly.
 *
 * @param isActive A Variable<boolean> that tracks the active state of the hyprsunset process.
 */
export const toggleSunset = (isActive: Variable<boolean>): void => {
    execAsync(isActiveCommand).then((res) => {
        if (res === 'no') {
            execAsync(`bash -c "nohup hyprsunset -t ${temperature.get()} > /dev/null 2>&1 &"`).then(() => {
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

/**
 * Checks the current status of the hyprsunset process and updates the active state.
 *
 * This function checks if the hyprsunset process is currently running and updates the `isActive` variable accordingly.
 */
export const checkSunsetStatus = (): undefined => {
    execAsync(isActiveCommand).then((res) => {
        isActive.set(res === 'yes');
    });
};
