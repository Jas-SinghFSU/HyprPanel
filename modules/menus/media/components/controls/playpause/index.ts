const media = await Service.import('mpris');
import { getPlayerInfo } from '../../helpers';
import { isValidPlaybackStatus } from './helpers';
import Button from 'types/widgets/button';
import Icon from 'types/widgets/icon';
import { Attribute } from 'lib/types/widget';
import icons from 'modules/icons/index';

export const playPause = (): Button<Icon<Attribute>, Attribute> => {
    return Widget.Button({
        hpack: 'center',
        setup: (self) => {
            self.hook(media, () => {
                const foundPlayer = getPlayerInfo();
                if (foundPlayer === undefined) {
                    self.class_name = 'media-indicator-control-button play disabled';
                    return;
                }

                self.on_primary_click = (): void => {
                    foundPlayer.playPause();
                };
                self.class_name = `media-indicator-control-button play ${foundPlayer.can_play !== null ? 'enabled' : 'disabled'}`;
            });
        },
        child: Widget.Icon({
            icon: Utils.watch(icons.mpris.paused, media, 'changed', () => {
                const foundPlayer = getPlayerInfo();

                if (foundPlayer === undefined) {
                    return icons.mpris['paused'];
                }

                const playbackStatus = foundPlayer.play_back_status?.toLowerCase();

                if (playbackStatus && isValidPlaybackStatus(playbackStatus)) {
                    return icons.mpris[playbackStatus];
                } else {
                    return icons.mpris['paused'];
                }
            }),
        }),
    });
};
