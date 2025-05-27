import { execAsync, Variable } from 'astal';
import { openDropdownMenu } from '../menu';
import { EventArgs } from './types';

/**
 * Executes an asynchronous command and handles the result.
 *
 * This function runs a given command asynchronously using `execAsync`. If the command starts with 'menu:', it opens the specified menu.
 * Otherwise, it executes the command in a bash shell. After execution, it handles the post input updater and calls the provided callback function with the command output.
 *
 * @param cmd The command to execute.
 * @param events An object containing the clicked widget and event information.
 * @param fn An optional callback function to handle the command output.
 * @param postInputUpdater An optional Variable<boolean> that tracks the post input update state.
 */
export function runAsyncCommand(
    cmd: string,
    events: EventArgs,
    fn?: (output: string) => void,
    postInputUpdater?: Variable<boolean>,
): void {
    if (cmd.startsWith('menu:')) {
        const menuName = cmd.split(':')[1].trim().toLowerCase();

        openDropdownMenu(events.clicked, events.event, `${menuName}menu`);
        handlePostInputUpdater(postInputUpdater);

        return;
    }

    execAsync(['bash', '-c', cmd])
        .then((output) => {
            handlePostInputUpdater(postInputUpdater);

            if (fn !== undefined) {
                fn(output);
            }
        })
        .catch((err) => console.error(`Error running command "${cmd}": ${err})`));
}

/**
 * Handles the post input updater by toggling its value.
 *
 * This function checks if the `postInputUpdater` variable is defined. If it is, it toggles its value.
 *
 * @param postInputUpdater An optional Variable<boolean> that tracks the post input update state.
 */
function handlePostInputUpdater(postInputUpdater?: Variable<boolean>): void {
    if (postInputUpdater !== undefined) {
        postInputUpdater.set(!postInputUpdater.get());
    }
}
