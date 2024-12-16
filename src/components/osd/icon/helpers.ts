import { bind, Variable } from 'astal';
import { Widget } from 'astal/gtk3';
import { audioService, brightnessService } from 'src/lib/constants/services';

type OSDIcon = {
    micVariable: Variable<unknown>;
    speakerVariable: Variable<unknown>;
};

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
