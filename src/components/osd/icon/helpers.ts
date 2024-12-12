import { bind, Variable } from 'astal';
import { Widget } from 'astal/gtk3';
import { audioService, brightnessService } from 'src/lib/constants/services';

export const setupOsdIcon = (self: Widget.Label): void => {
    self.hook(brightnessService, 'notify::screen', () => {
        self.label = '󱍖';
    });

    self.hook(brightnessService, 'notify::kbd', () => {
        self.label = '󰥻';
    });

    Variable.derive(
        [bind(audioService.defaultMicrophone, 'volume'), bind(audioService.defaultMicrophone, 'mute')],
        () => {
            self.label = audioService.defaultMicrophone.mute ? '󰍭' : '󰍬';
        },
    );

    Variable.derive([bind(audioService.defaultSpeaker, 'volume'), bind(audioService.defaultSpeaker, 'mute')], () => {
        self.label = audioService.defaultSpeaker.mute ? '󰝟' : '󰕾';
    });
};
