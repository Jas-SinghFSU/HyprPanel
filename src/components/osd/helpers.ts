import { Binding } from 'astal';
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
 * Handles the reveal state of a Widget.Revealer.
 *
 * This function sets the `reveal_child` property of the Widget.Revealer to true if the OSD is enabled and the property is 'revealChild'.
 * It also manages a timeout to reset the `reveal_child` property after the specified duration.
 *
 * @param self The Widget.Revealer instance.
 * @param property The property to check, either 'revealChild' or 'visible'.
 */
export const handleRevealRevealer = (self: Widget.Revealer, property: 'revealChild' | 'visible'): void => {
    if (!enable.get() || property !== 'revealChild') {
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
 * Handles the reveal state of a Widget.Window.
 *
 * This function sets the `visible` property of the Widget.Window to true if the OSD is enabled and the property is 'visible'.
 * It also manages a timeout to reset the `visible` property after the specified duration.
 *
 * @param self The Widget.Window instance.
 * @param property The property to check, either 'revealChild' or 'visible'.
 */
export const handleRevealWindow = (self: Widget.Window, property: 'revealChild' | 'visible'): void => {
    if (!enable.get() || property !== 'visible') {
        return;
    }

    self.visible = true;

    count++;
    timeout(duration.get(), () => {
        count--;

        if (count === 0) {
            self.visible = false;
        }
    });
};

/**
 * Handles the reveal state of a Widget.Revealer or Widget.Window.
 *
 * This function delegates the reveal handling to either `handleRevealRevealer` or `handleRevealWindow` based on the type of the widget.
 *
 * @param self The Widget.Revealer or Widget.Window instance.
 * @param property The property to check, either 'revealChild' or 'visible'.
 */
export const handleReveal = (self: Widget.Revealer | Widget.Window, property: 'revealChild' | 'visible'): void => {
    if (isStartingUp) {
        return;
    }

    if (self instanceof Widget.Revealer) {
        handleRevealRevealer(self, property);
    } else if (self instanceof Widget.Window) {
        handleRevealWindow(self, property);
    }
};

/**
 * Retrieves the monitor index for the OSD.
 *
 * This function derives the monitor index for the OSD based on the focused monitor, default monitor, and active monitor settings.
 *
 * @returns A Binding<number> representing the monitor index for the OSD.
 */
export const getOsdMonitor = (): Binding<number> => {
    return Variable.derive(
        [bind(hyprlandService, 'focusedMonitor'), bind(monitor), bind(active_monitor)],
        (currentMonitor, defaultMonitor, followMonitor) => {
            if (followMonitor === true) {
                return currentMonitor.id;
            }

            return defaultMonitor;
        },
    )();
};

/**
 * Sets up the window for OSD.
 *
 * This function hooks various services and settings to the window to handle its visibility based on the OSD configuration.
 *
 * @param self The Widget.Window instance to set up.
 */
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

/**
 * Sets up the revealer for OSD.
 *
 * This function hooks various services and settings to the revealer to handle its reveal state based on the OSD configuration.
 *
 * @param self The Widget.Revealer instance to set up.
 */
export const revealerSetup = (self: Widget.Revealer): void => {
    self.hook(enable, () => {
        handleReveal(self, 'revealChild');
    });

    self.hook(brightnessService, 'notify::screen', () => {
        handleReveal(self, 'revealChild');
    });

    self.hook(brightnessService, 'notify::kbd', () => {
        handleReveal(self, 'revealChild');
    });

    Variable.derive(
        [bind(audioService.defaultMicrophone, 'volume'), bind(audioService.defaultMicrophone, 'mute')],
        () => {
            handleReveal(self, 'revealChild');
        },
    );

    Variable.derive([bind(audioService.defaultSpeaker, 'volume'), bind(audioService.defaultSpeaker, 'mute')], () => {
        handleReveal(self, 'revealChild');
    });
};
