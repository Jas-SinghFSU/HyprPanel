import { bind, timeout, Variable } from 'astal';
import { Widget } from 'astal/gtk3';
import { audioService, brightnessService, hyprlandService } from 'src/lib/constants/services';
import options from 'src/options';

const { enable, duration, active_monitor, monitor } = options.theme.osd;

let count = 0;

/*
 * So the OSD doesn't show on startup for no reason
 */
let isStartingUp = true;
timeout(3000, () => {
    isStartingUp = false;
});

/**
 * Handles the reveal state of a Widget.Revealer or Widget.Window.
 *
 * This function delegates the reveal handling to either `handleRevealRevealer` or `handleRevealWindow` based on the type of the widget.
 *
 * @param self The Widget.Revealer or Widget.Window instance.
 * @param property The property to check, either 'revealChild' or 'visible'.
 */
export const handleReveal = (self: Widget.Revealer): void => {
    if (isStartingUp) {
        return;
    }

    if (!enable.get()) {
        return;
    }

    self.reveal_child = true;

    count++;
    timeout(duration.get(), () => {
        count--;

        if (count === 0) {
            self.reveal_child = false;
        }
    });
};

/**
 * Retrieves the monitor index for the OSD.
 *
 * This function derives the monitor index for the OSD based on the focused monitor, default monitor, and active monitor settings.
 *
 * @returns A Variable<number> representing the monitor index for the OSD.
 */
export const getOsdMonitor = (): Variable<number> => {
    return Variable.derive(
        [bind(hyprlandService, 'focusedMonitor'), bind(monitor), bind(active_monitor)],
        (currentMonitor, defaultMonitor, followMonitor) => {
            if (followMonitor === true) {
                return currentMonitor.id;
            }

            return defaultMonitor;
        },
    );
};

/**
 * Sets up the revealer for OSD.
 *
 * This function hooks various services and settings to the revealer to handle its reveal state based on the OSD configuration.
 *
 * @param self The Widget.Revealer instance to set up.
 */
export const revealerSetup = (self: Widget.Revealer): void => {
    self.hook(enable, () => {
        handleReveal(self);
    });

    self.hook(brightnessService, 'notify::screen', () => {
        handleReveal(self);
    });

    self.hook(brightnessService, 'notify::kbd', () => {
        handleReveal(self);
    });

    Variable.derive(
        [bind(audioService.defaultMicrophone, 'volume'), bind(audioService.defaultMicrophone, 'mute')],
        () => {
            handleReveal(self);
        },
    );

    Variable.derive([bind(audioService.defaultSpeaker, 'volume'), bind(audioService.defaultSpeaker, 'mute')], () => {
        handleReveal(self);
    });
};
