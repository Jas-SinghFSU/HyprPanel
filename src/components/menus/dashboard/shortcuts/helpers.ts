import { bind, execAsync, timeout, Variable } from 'astal';
import { App } from 'astal/gtk3';
import { BashPoller } from 'src/lib/poller/BashPoller';
import { ShortcutVariable } from 'src/lib/types/dashboard';
import options from 'src/options';

const { left } = options.menus.dashboard.shortcuts;

export const handleRecorder = (commandOutput: string): boolean => {
    if (commandOutput === 'recording') {
        return true;
    }
    return false;
};

export const handleClick = (action: string, tOut: number = 250): void => {
    App.get_window('dashboardmenu')?.set_visible(false);

    timeout(tOut, () => {
        execAsync(action)
            .then((res) => {
                return res;
            })
            .catch((err) => err);
    });
};
export const hasCommand = (shortCut: ShortcutVariable): boolean => {
    return shortCut.command.value.length > 0;
};

export const leftCardHidden = Variable(
    !(
        hasCommand(left.shortcut1) ||
        hasCommand(left.shortcut2) ||
        hasCommand(left.shortcut3) ||
        hasCommand(left.shortcut4)
    ),
);
export const pollingInterval = Variable(1000);
export const isRecording = Variable(false);

export const recordingPoller = new BashPoller<boolean, []>(
    isRecording,
    [],
    bind(pollingInterval),
    `${SRC}/src/services/screen_record.sh status`,
    handleRecorder,
);
