import { bind, Variable } from 'astal';
import { Widget } from 'astal/gtk3';
import AstalWp from 'gi://AstalWp?version=0.1';
import BrightnessService from 'src/services/system/brightness';

const wireplumber = AstalWp.get_default() as AstalWp.Wp;
const audioService = wireplumber.audio;
const brightnessService = BrightnessService.getInstance();

/**
 * Sets up the OSD icon for a given widget.
 *
 * This function hooks various services and settings to the widget to update its label based on the brightness and audio services.
 * It handles screen brightness, keyboard brightness, microphone mute status, and speaker mute status.
 *
 * @param self The Widget.Label instance to set up.
 *
 * @returns An object containing the micVariable and speakerVariable, which are derived variables for microphone and speaker status.
 */
export const setupOsdIcon = (self: Widget.Label): void => {
    self.hook(brightnessService, 'notify::screen', () => {
        self.label = '󱍖';
    });

    self.hook(brightnessService, 'notify::kbd', () => {
        self.label = '󰥻';
    });

    const micVariable = Variable.derive(
        [bind(audioService.defaultMicrophone, 'volume'), bind(audioService.defaultMicrophone, 'mute')],
        () => {
            self.label = audioService.defaultMicrophone.mute ? '󰍭' : '󰍬';
        },
    );

    const speakerVariable = Variable.derive(
        [bind(audioService.defaultSpeaker, 'volume'), bind(audioService.defaultSpeaker, 'mute')],
        () => {
            self.label = audioService.defaultSpeaker.mute ? '󰝟' : '󰕾';
        },
    );

    self.connect('destroy', () => {
        micVariable.drop();
        speakerVariable.drop();
    });
};
