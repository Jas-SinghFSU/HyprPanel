import { Binding } from 'astal';
import { bind, timeout, Variable } from 'astal';
import { Widget } from 'astal/gtk3';
import { audioService, brightnessService, hyprlandService } from 'src/lib/constants/services';
import options from 'src/options';

const { enable, duration, active_monitor, monitor } = options.theme.osd;

let count = 0;

export const handleRevealRevealer = (self: Widget.Revealer, property: 'reveal_child' | 'visible'): void => {
    if (!enable.get() || property !== 'reveal_child') {
        return;
    }

    self.reveal_child = true;

    count++;
    timeout(duration.value, () => {
        count--;

        if (count === 0) {
            self.reveal_child = false;
        }
    });
};

export const handleRevealWindow = (self: Widget.Window, property: 'reveal_child' | 'visible'): void => {
    if (!enable.value || property !== 'visible') {
        return;
    }

    self.visible = true;

    count++;
    timeout(duration.value, () => {
        count--;

        if (count === 0) {
            self.visible = false;
        }
    });
};

export const handleReveal = (self: Widget.Revealer | Widget.Window, property: 'reveal_child' | 'visible'): void => {
    if (self instanceof Widget.Revealer) {
        handleRevealRevealer(self, property);
    } else if (self instanceof Widget.Window) {
        handleRevealWindow(self, property);
    }
};

export const getOsdMonitor = (): Binding<number> => {
    return Variable.derive(
        [bind(hyprlandService.focusedMonitor, 'id'), bind(monitor), bind(active_monitor)],
        (currentMonitor, defaultMonitor, followMonitor) => {
            if (followMonitor === true) {
                return currentMonitor;
            }

            return defaultMonitor;
        },
    )();
};

export const windowSetup = (self: Widget.Window): void => {
    self.hook(enable, () => {
        handleReveal(self, 'visible');
    });

    self.hook(brightnessService, 'notify::screen', () => {
        handleReveal(self, 'visible');
    });

    self.hook(brightnessService, 'notify::kbd', () => {
        handleReveal(self, 'visible');
    });

    Variable.derive(
        [bind(audioService.defaultMicrophone, 'volume'), bind(audioService.defaultMicrophone, 'mute')],
        () => {
            handleReveal(self, 'visible');
        },
    );

    Variable.derive([bind(audioService.defaultSpeaker, 'volume'), bind(audioService.defaultSpeaker, 'mute')], () => {
        handleReveal(self, 'visible');
    });
};

export const revealerSetup = (self: Widget.Revealer): void => {
    self.hook(enable, () => {
        handleReveal(self, 'reveal_child');
    });

    self.hook(brightnessService, 'notify::screen', () => {
        handleReveal(self, 'reveal_child');
    });

    self.hook(brightnessService, 'notify::kbd', () => {
        handleReveal(self, 'reveal_child');
    });

    Variable.derive(
        [bind(audioService.defaultMicrophone, 'volume'), bind(audioService.defaultMicrophone, 'mute')],
        () => {
            handleReveal(self, 'reveal_child');
        },
    );

    Variable.derive([bind(audioService.defaultSpeaker, 'volume'), bind(audioService.defaultSpeaker, 'mute')], () => {
        handleReveal(self, 'reveal_child');
    });
};
