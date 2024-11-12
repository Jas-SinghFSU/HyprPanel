import { Attribute, Child } from 'lib/types/widget';
import { volumeLevelIcons } from 'modules/bar/volume/index';
import brightness from 'services/Brightness';
import Box from 'types/widgets/box';
const audio = await Service.import('audio');

const getIcon = (vol: number, isMuted: boolean): string => {
    const icon = (): number => {
        if (isMuted) return 0;

        const foundVol = [101, 66, 34, 1, 0].find((threshold) => threshold <= vol * 100);

        if (foundVol !== undefined) {
            return foundVol;
        }

        return 101;
    };

    return icon() !== undefined ? volumeLevelIcons[icon()] : volumeLevelIcons[101];
};

export const OSDIcon = (): Box<Child, Attribute> => {
    return Widget.Box({
        class_name: 'osd-icon-container',
        hexpand: true,
        child: Widget.Label({
            class_name: 'osd-icon txt-icon',
            hexpand: true,
            vexpand: true,
            hpack: 'center',
            vpack: 'center',
            setup: (self) => {
                self.hook(
                    brightness,
                    () => {
                        self.label = '󱍖';
                    },
                    'notify::screen',
                );
                self.hook(
                    brightness,
                    () => {
                        self.label = '󰥻';
                    },
                    'notify::kbd',
                );
                self.hook(
                    audio.microphone,
                    () => {
                        self.label = audio.microphone.is_muted ? '󰍭' : '󰍬';
                    },
                    'notify::volume',
                );
                self.hook(
                    audio.microphone,
                    () => {
                        self.label = audio.microphone.is_muted ? '󰍭' : '󰍬';
                    },
                    'notify::is-muted',
                );
                self.hook(
                    audio.speaker,
                    () => {
                        self.label = getIcon(
                            audio.speaker.volume,
                            audio.speaker.is_muted !== null ? audio.speaker.is_muted : false,
                        );
                    },
                    'notify::volume',
                );
                self.hook(
                    audio.speaker,
                    () => {
                        self.label = getIcon(
                            audio.speaker.volume,
                            audio.speaker.is_muted !== null ? audio.speaker.is_muted : false,
                        );
                    },
                    'notify::is-muted',
                );
            },
        }),
    });
};
