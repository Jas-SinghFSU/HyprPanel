const media = await Service.import('mpris');
import icons from 'lib/icons';
import { Attribute } from 'lib/types/widget';
import { getPlayerInfo } from '../../helpers';
import Button from 'types/widgets/button';
import Icon from 'types/widgets/icon';

export const previousTrack = (): Button<Icon<Attribute>, Attribute> => {
    return Widget.Button({
        hpack: 'center',
        child: Widget.Icon(icons.mpris.prev),
        setup: (self) => {
            self.hook(media, () => {
                const foundPlayer = getPlayerInfo();
                if (foundPlayer === undefined) {
                    self.class_name = 'media-indicator-control-button prev disabled';
                    return;
                }

                self.on_primary_click = (): void => {
                    foundPlayer.previous();
                };
                self.class_name = `media-indicator-control-button prev ${foundPlayer.can_go_prev !== null && foundPlayer.can_go_prev ? 'enabled' : 'disabled'}`;
            });
        },
    });
};
