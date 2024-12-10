import { bind, Variable } from 'astal';
import LevelBar from 'src/components/shared/LevelBar';
import { audioService, brightnessService } from 'src/lib/constants/services';

export const setupOsdBar = (self: LevelBar): void => {
    self.hook(brightnessService, 'notify::screen', () => {
        self.className = self.className.replace(/\boverflow\b/, '').trim();
        self.value = brightnessService.screen;
    });

    self.hook(brightnessService, 'notify::kbd', () => {
        self.className = self.className.replace(/\boverflow\b/, '').trim();
        self.value = brightnessService.kbd;
    });

    Variable.derive([bind(audioService.defaultMicrophone, 'volume')], () => {
        self.toggleClassName('overflow', audioService.defaultMicrophone.volume > 1);
        self.value =
            audioService.defaultMicrophone.volume <= 1
                ? audioService.defaultMicrophone.volume
                : audioService.defaultMicrophone.volume - 1;
    });

    Variable.derive([bind(audioService.defaultMicrophone, 'mute')], () => {
        self.toggleClassName(
            'overflow',
            audioService.defaultMicrophone.volume > 1 &&
                (!options.theme.osd.muted_zero.value || audioService.defaultMicrophone.mute === false),
        );
        self.value =
            options.theme.osd.muted_zero.value && audioService.defaultMicrophone.mute !== false
                ? 0
                : audioService.defaultMicrophone.volume <= 1
                  ? audioService.defaultMicrophone.volume
                  : audioService.defaultMicrophone.volume - 1;
    });

    Variable.derive([bind(audioService.defaultSpeaker, 'volume')], () => {
        self.toggleClassName('overflow', audioService.defaultSpeaker.volume > 1);
        self.value =
            audioService.defaultSpeaker.volume <= 1
                ? audioService.defaultSpeaker.volume
                : audioService.defaultSpeaker.volume - 1;
    });

    Variable.derive([bind(audioService.defaultSpeaker, 'mute')], () => {
        self.toggleClassName(
            'overflow',
            audioService.defaultSpeaker.volume > 1 &&
                (!options.theme.osd.muted_zero.value || audioService.defaultSpeaker.mute === false),
        );
        self.value =
            options.theme.osd.muted_zero.value && audioService.defaultSpeaker.mute !== false
                ? 0
                : audioService.defaultSpeaker.volume <= 1
                  ? audioService.defaultSpeaker.volume
                  : audioService.defaultSpeaker.volume - 1;
    });
};
