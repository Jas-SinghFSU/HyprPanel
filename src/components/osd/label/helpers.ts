import { bind, Variable } from 'astal';
import { Widget } from 'astal/gtk3';
import { audioService, brightnessService } from 'src/lib/constants/services';

/**
 * Sets up the OSD label for a given widget.
 *
 * This function hooks various services and settings to the widget to update its label based on the brightness and audio services.
 * It handles screen brightness, keyboard brightness, microphone volume, microphone mute status, speaker volume, and speaker mute status.
 *
 * @param self The Widget.Label instance to set up.
 */
export const setupOsdLabel = (self: Widget.Label): void => {
    self.hook(brightnessService, 'notify::screen', () => {
        self.className = self.className.replace(/\boverflow\b/, '').trim();
        self.label = `${Math.round(brightnessService.screen * 100)}`;
    });

    self.hook(brightnessService, 'notify::kbd', () => {
        self.className = self.className.replace(/\boverflow\b/, '').trim();
        self.label = `${Math.round(brightnessService.kbd * 100)}`;
    });

    Variable.derive([bind(audioService.defaultMicrophone, 'volume')], () => {
        self.toggleClassName('overflow', audioService.defaultMicrophone.volume > 1);
        self.label = `${Math.round(audioService.defaultMicrophone.volume * 100)}`;
    });

    Variable.derive([bind(audioService.defaultMicrophone, 'mute')], () => {
        self.toggleClassName(
            'overflow',
            audioService.defaultMicrophone.volume > 1 &&
                (!options.theme.osd.muted_zero.value || audioService.defaultMicrophone.mute === false),
        );
        const inputVolume =
            options.theme.osd.muted_zero.value && audioService.defaultMicrophone.mute !== false
                ? 0
                : Math.round(audioService.defaultMicrophone.volume * 100);
        self.label = `${inputVolume}`;
    });

    Variable.derive([bind(audioService.defaultSpeaker, 'volume')], () => {
        self.toggleClassName('overflow', audioService.defaultSpeaker.volume > 1);
        self.label = `${Math.round(audioService.defaultSpeaker.volume * 100)}`;
    });

    Variable.derive([bind(audioService.defaultSpeaker, 'mute')], () => {
        self.toggleClassName(
            'overflow',
            audioService.defaultSpeaker.volume > 1 &&
                (!options.theme.osd.muted_zero.value || audioService.defaultSpeaker.mute === false),
        );
        const speakerVolume =
            options.theme.osd.muted_zero.value && audioService.defaultSpeaker.mute !== false
                ? 0
                : Math.round(audioService.defaultSpeaker.volume * 100);
        self.label = `${speakerVolume}`;
    });
};
