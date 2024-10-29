const media = await Service.import('mpris');
import { MediaInfo } from './title/index.js';
import { Controls } from './controls/index.js';
import { Bar } from './timebar/index.js';
import options from 'options.js';
import { BoxWidget } from 'lib/types/widget.js';
import { generateAlbumArt, getPlayerInfo, initializeActivePlayerHook } from './helpers.js';

const { tint, color } = options.theme.bar.menus.menu.media.card;

initializeActivePlayerHook();

const Media = (): BoxWidget => {
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
                                children: [MediaInfo(), Controls(), Bar()],
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
