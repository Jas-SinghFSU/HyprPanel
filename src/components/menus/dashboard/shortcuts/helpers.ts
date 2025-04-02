import { bind, execAsync, timeout, Variable } from 'astal';
import { App } from 'astal/gtk3';
import { BashPoller } from 'src/lib/poller/BashPoller';
import { ShortcutVariable } from 'src/lib/types/dashboard';
import options from 'src/options';

const { left } = options.menus.dashboard.shortcuts;

/**
 * Retrieves the latest recording path from options.
 *
 * @returns The configured recording path.
 */
export const getRecordingPath = (): string => options.menus.dashboard.recording.path.get();

/**
 * Executes a shell command asynchronously with proper error handling.
 *
 * @param command The command to execute.
 */
export const executeCommand = async (command: string): Promise<void> => {
    try {
        await execAsync(`/bin/bash -c '${command}'`);
    } catch (err) {
        console.error('Command failed:', command);
        console.error('Error:', err);
    }
};

/**
 * Handles the recorder status based on the command output.
 *
 * This function checks if the command output indicates that recording is in progress.
 *
 * @param commandOutput The output of the command to check.
 *
 * @returns True if the command output is 'recording', false otherwise.
 */
export const handleRecorder = (commandOutput: string): boolean => {
    return commandOutput === 'recording';
};

/**
 * Handles the click action for a shortcut.
 *
 * This function hides the dashboard menu and executes the specified action after an optional timeout.
 *
 * @param action The action to execute.
 * @param tOut The timeout in milliseconds before executing the action. Defaults to 0.
 */
export const handleClick = (action: string, tOut: number = 0): void => {
    App.get_window('dashboardmenu')?.set_visible(false);

    timeout(tOut, () => {
        execAsync(`bash -c "${action}"`)
            .then((res) => res)
            .catch((err) => console.error(err));
    });
};

/**
 * Checks if a shortcut has a command.
 *
 * @param shortCut The shortcut to check.
 * @returns True if the shortcut has a command, false otherwise.
 */
export const hasCommand = (shortCut: ShortcutVariable): boolean => {
    return shortCut.command.get().length > 0;
};

/**
 * A variable indicating whether the left card is hidden.
 *
 * This is set to true if none of the left shortcuts have commands.
 */
export const leftCardHidden = Variable(
    !(
        hasCommand(left.shortcut1) ||
        hasCommand(left.shortcut2) ||
        hasCommand(left.shortcut3) ||
        hasCommand(left.shortcut4)
    ),
);

/**
 * A variable representing the polling interval in milliseconds.
 */
export const pollingInterval = Variable(1000);

/**
 * A variable indicating whether recording is in progress.
 */
export const isRecording = Variable(false);

/**
 * A poller for checking the recording status.
 *
 * This poller periodically checks the recording status by executing a bash command
 * and updates the `isRecording` variable accordingly.
 */
export const recordingPoller = new BashPoller<boolean, []>(
    isRecording,
    [],
    bind(pollingInterval),
    `${SRC_DIR}/scripts/screen_record.sh status`,
    handleRecorder,
);
