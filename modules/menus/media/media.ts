const media = await Service.import('mpris');
import { MediaInfo } from './components/mediainfo.js';
import { Controls } from './components/controls.js';
import { Bar } from './components/bar.js';
import { MprisPlayer } from 'types/service/mpris.js';
import options from 'options.js';
import { BoxWidget } from 'lib/types/widget.js';

const { tint, color } = options.theme.bar.menus.menu.media.card;

const generateAlbumArt = (imageUrl: string): string => {
    const userTint = tint.value;
    const userHexColor = color.value;

    const r = parseInt(userHexColor.slice(1, 3), 16);
    const g = parseInt(userHexColor.slice(3, 5), 16);
    const b = parseInt(userHexColor.slice(5, 7), 16);

    const alpha = userTint / 100;

    const css = `background-image: linear-gradient(
                rgba(${r}, ${g}, ${b}, ${alpha}),
                rgba(${r}, ${g}, ${b}, ${alpha}),
                ${userHexColor} 65em
            ), url("${imageUrl}");`;

    return css;
};
const Media = (): BoxWidget => {
    const curPlayer = Variable('');

    media.connect('changed', () => {
        const statusOrder = {
            Playing: 1,
            Paused: 2,
            Stopped: 3,
        };

        const isPlaying = media.players.find((p) => p['play_back_status'] === 'Playing');

        const playerStillExists = media.players.some((p) => curPlayer.value === p['bus_name']);

        const nextPlayerUp = media.players.sort(
            (a, b) => statusOrder[a['play_back_status']] - statusOrder[b['play_back_status']],
        )[0].bus_name;

        if (isPlaying || !playerStillExists) {
            curPlayer.value = nextPlayerUp;
        }
    });

    const getPlayerInfo = (): MprisPlayer => {
        return media.players.find((p) => p.bus_name === curPlayer.value) || media.players[0];
    };

    return Widget.Box({
        class_name: 'menu-section-container',
        children: [
            Widget.Box({
                class_name: 'menu-items-section',
                vertical: false,
                child: Widget.Box({
                    class_name: 'menu-content',
                    children: [
                        Widget.Box({
                            class_name: 'media-content',
                            child: Widget.Box({
                                class_name: 'media-indicator-right-section',
                                hpack: 'fill',
                                hexpand: true,
                                vertical: true,
                                children: [MediaInfo(getPlayerInfo), Controls(getPlayerInfo), Bar(getPlayerInfo)],
                            }),
                        }),
                    ],
                    setup: (self) => {
                        self.hook(media, () => {
                            const curPlayer = getPlayerInfo();
                            if (curPlayer !== undefined) {
                                self.css = generateAlbumArt(curPlayer.track_cover_url);
                            }
                        });

                        Utils.merge([color.bind('value'), tint.bind('value')], () => {
                            const curPlayer = getPlayerInfo();
                            if (curPlayer !== undefined) {
                                self.css = generateAlbumArt(curPlayer.track_cover_url);
                            }
                        });
                    },
                }),
            }),
        ],
    });
};

export { Media };
