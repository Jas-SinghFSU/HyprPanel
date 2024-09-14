import Gdk from 'gi://Gdk?version=3.0';
const audio = await Service.import('audio');
import { openMenu } from '../utils.js';
import options from 'options';
import { Binding } from 'lib/utils.js';
import { VolumeIcons } from 'lib/types/volume.js';
import { BarBoxChild } from 'lib/types/bar.js';
import { Bind } from 'lib/types/variable.js';
import Button from 'types/widgets/button.js';
import { Child } from 'lib/types/widget.js';

const Volume = (): BarBoxChild => {
    const icons: VolumeIcons = {
        101: '󰕾',
        66: '󰕾',
        34: '󰖀',
        1: '󰕿',
        0: '󰝟',
    };

    const getIcon = (): Bind => {
        const icon: Binding<number> = Utils.merge(
            [audio.speaker.bind('is_muted'), audio.speaker.bind('volume')],
            (isMuted, vol) => {
                return isMuted ? 0 : [101, 66, 34, 1, 0].find((threshold) => threshold <= vol * 100) || 101;
            },
        );

        return icon.as((i: number) => (i !== undefined ? icons[i] : icons[101]));
    };

    const volIcn = Widget.Label({
        hexpand: true,
        label: getIcon(),
        class_name: 'bar-button-icon volume txt-icon bar',
    });

    const volPct = Widget.Label({
        hexpand: true,
        label: audio.speaker.bind('volume').as((v) => `${Math.round(v * 100)}%`),
        class_name: 'bar-button-label volume',
    });

    return {
        component: Widget.Box({
            hexpand: true,
            vexpand: true,
            className: Utils.merge(
                [options.theme.bar.buttons.style.bind('value'), options.bar.volume.label.bind('value')],
                (style, showLabel) => {
                    const styleMap = {
                        default: 'style1',
                        split: 'style2',
                        wave: 'style3',
                        wave2: 'style3',
                    };
                    return `volume ${styleMap[style]} ${!showLabel ? 'no-label' : ''}`;
                },
            ),
            children: options.bar.volume.label.bind('value').as((showLabel) => {
                if (showLabel) {
                    return [volIcn, volPct];
                }
                return [volIcn];
            }),
        }),
        isVisible: true,
        boxClass: 'volume',
        props: {
            on_primary_click: (clicked: Button<Child, Child>, event: Gdk.Event): void => {
                openMenu(clicked, event, 'audiomenu');
            },
        },
    };
};

export { Volume };
