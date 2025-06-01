import { bind, timeout, Variable } from 'astal';
import { Widget } from 'astal/gtk3';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import AstalWp from 'gi://AstalWp?version=0.1';
import options from 'src/configuration';
import { GdkMonitorService } from 'src/services/display/monitor';
import BrightnessService from 'src/services/system/brightness';
import { RevealerSetupBindings } from './types';

const wireplumber = AstalWp.get_default() as AstalWp.Wp;
const audioService = wireplumber.audio;
const brightnessService = BrightnessService.getInstance();
const hyprlandService = AstalHyprland.get_default();

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
const handleReveal = (self: Widget.Revealer): void => {
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
            try {
                self.reveal_child = false;
            } catch (error) {
                // Widget might have been destroyed, ignore
            }
        }
    });
};

/**
 * Determines which monitor the OSD should appear on based on user configuration.
 * Safely handles null monitors and DPMS events to prevent crashes.
 *
 * @returns Variable containing the GDK monitor index where OSD should be displayed (defaults to 0 if no valid monitor)
 */
export const getOsdMonitor = (): Variable<number> => {
    const gdkMonitorMapper = GdkMonitorService.getInstance();

    return Variable.derive(
        [bind(hyprlandService, 'focusedMonitor'), bind(monitor), bind(active_monitor)],
        (currentMonitor, defaultMonitor, followMonitor) => {
            try {
                if (followMonitor === true) {
                    if (!currentMonitor || currentMonitor.id === undefined || currentMonitor.id === null) {
                        console.warn('OSD: No focused monitor available, defaulting to monitor 0');
                        return 0;
                    }
                    const gdkMonitor = gdkMonitorMapper.mapHyprlandToGdk(currentMonitor.id);
                    return gdkMonitor;
                }

                const gdkMonitor = gdkMonitorMapper.mapHyprlandToGdk(defaultMonitor);
                return gdkMonitor;
            } catch (error) {
                console.error('OSD: Failed to map monitor, defaulting to 0:', error);
                return 0;
            }
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
export const revealerSetup = (self: Widget.Revealer): RevealerSetupBindings => {
    self.hook(enable, () => {
        handleReveal(self);
    });

    self.hook(brightnessService, 'notify::screen', () => {
        handleReveal(self);
    });

    self.hook(brightnessService, 'notify::kbd', () => {
        handleReveal(self);
    });

    const microphoneBinding = Variable.derive(
        [bind(audioService.defaultMicrophone, 'volume'), bind(audioService.defaultMicrophone, 'mute')],
        () => {
            handleReveal(self);
        },
    );

    const speakerBinding = Variable.derive(
        [bind(audioService.defaultSpeaker, 'volume'), bind(audioService.defaultSpeaker, 'mute')],
        () => {
            handleReveal(self);
        },
    );

    const cleanup = (): void => {
        microphoneBinding.drop();
        speakerBinding.drop();
    };

    return {
        cleanup,
    };
};
