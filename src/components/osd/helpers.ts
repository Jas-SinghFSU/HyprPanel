import { bind, Variable } from 'astal';
import { Widget } from 'astal/gtk3';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import AstalWp from 'gi://AstalWp?version=0.1';
import options from 'src/configuration';
import { GdkMonitorService } from 'src/services/display/monitor';
import BrightnessService from 'src/services/system/brightness';
import { OsdRevealerController } from './revealer/revealerController';

const wireplumber = AstalWp.get_default() as AstalWp.Wp;
const audioService = wireplumber.audio;
const brightnessService = BrightnessService.getInstance();
const hyprlandService = AstalHyprland.get_default();

const { enable, active_monitor, monitor } = options.theme.osd;

const osdController = OsdRevealerController.getInstance();

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
                if (followMonitor === false) {
                    const gdkMonitor = gdkMonitorMapper.mapHyprlandToGdk(defaultMonitor);
                    return gdkMonitor;
                }

                if (!currentMonitor || currentMonitor.id === undefined || currentMonitor.id === null) {
                    console.warn('OSD: No focused monitor available, defaulting to monitor 0');
                    return 0;
                }

                const gdkMonitor = gdkMonitorMapper.mapHyprlandToGdk(currentMonitor.id);
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
export const revealerSetup = (self: Widget.Revealer): void => {
    osdController.setRevealer(self);

    const handleReveal = (): void => {
        osdController.show();
    };

    self.hook(enable, handleReveal);
    self.hook(brightnessService, 'notify::screen', handleReveal);
    self.hook(brightnessService, 'notify::kbd', handleReveal);

    const microphoneBinding = Variable.derive(
        [bind(audioService.defaultMicrophone, 'volume'), bind(audioService.defaultMicrophone, 'mute')],
        handleReveal,
    );

    const speakerBinding = Variable.derive(
        [bind(audioService.defaultSpeaker, 'volume'), bind(audioService.defaultSpeaker, 'mute')],
        handleReveal,
    );

    self.connect('destroy', () => {
        microphoneBinding.drop();
        speakerBinding.drop();
        osdController.onRevealerDestroy(self);
    });
};
