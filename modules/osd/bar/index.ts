import { OSDOrientation } from 'lib/types/options';
import brightness from 'services/Brightness';
import options from 'options';
import Box from 'types/widgets/box';
import { Attribute, Child } from 'lib/types/widget';
const audio = await Service.import('audio');

export const OSDBar = (ort: OSDOrientation): Box<Child, Attribute> => {
    return Widget.Box({
        class_name: 'osd-bar-container',
        children: [
            Widget.LevelBar({
                class_name: 'osd-bar',
                vertical: ort === 'vertical',
                inverted: ort === 'vertical',
                bar_mode: 'continuous',
                setup: (self) => {
                    self.hook(
                        brightness,
                        () => {
                            self.class_names = self.class_names.filter((c) => c !== 'overflow');
                            self.value = brightness.screen;
                        },
                        'notify::screen',
                    );
                    self.hook(
                        brightness,
                        () => {
                            self.class_names = self.class_names.filter((c) => c !== 'overflow');
                            self.value = brightness.kbd;
                        },
                        'notify::kbd',
                    );
                    self.hook(
                        audio.microphone,
                        () => {
                            self.toggleClassName('overflow', audio.microphone.volume > 1);
                            self.value =
                                audio.microphone.volume <= 1 ? audio.microphone.volume : audio.microphone.volume - 1;
                        },
                        'notify::volume',
                    );
                    self.hook(
                        audio.microphone,
                        () => {
                            self.toggleClassName(
                                'overflow',
                                audio.microphone.volume > 1 &&
                                    (!options.theme.osd.muted_zero.value || audio.microphone.is_muted === false),
                            );
                            self.value =
                                options.theme.osd.muted_zero.value && audio.microphone.is_muted !== false
                                    ? 0
                                    : audio.microphone.volume <= 1
                                      ? audio.microphone.volume
                                      : audio.microphone.volume - 1;
                        },
                        'notify::is-muted',
                    );
                    self.hook(
                        audio.speaker,
                        () => {
                            self.toggleClassName('overflow', audio.speaker.volume > 1);
                            self.value = audio.speaker.volume <= 1 ? audio.speaker.volume : audio.speaker.volume - 1;
                        },
                        'notify::volume',
                    );
                    self.hook(
                        audio.speaker,
                        () => {
                            self.toggleClassName(
                                'overflow',
                                audio.speaker.volume > 1 &&
                                    (!options.theme.osd.muted_zero.value || audio.speaker.is_muted === false),
                            );
                            self.value =
                                options.theme.osd.muted_zero.value && audio.speaker.is_muted !== false
                                    ? 0
                                    : audio.speaker.volume <= 1
                                      ? audio.speaker.volume
                                      : audio.speaker.volume - 1;
                        },
                        'notify::is-muted',
                    );
                },
            }),
        ],
    });
};
