import { bind, Variable } from 'astal';
import { Widget } from 'astal/gtk3';
import { audioService, brightnessService } from 'src/lib/constants/services';

type OSDIcon = {
    micVariable: Variable<unknown>;
    speakerVariable: Variable<unknown>;
};

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
export const setupOsdIcon = (self: Widget.Label): OSDIcon => {
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

    return {
        micVariable,
        speakerVariable,
    };
};
