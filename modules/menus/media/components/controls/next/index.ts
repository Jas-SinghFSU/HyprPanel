const media = await Service.import('mpris');
import icons from 'lib/icons';
import { BoxWidget } from 'lib/types/widget';
import { getPlayerInfo } from '../../helpers';

export const nextTrack = (): BoxWidget => {
    return Widget.Box({
        class_name: `media-indicator-control next`,
        children: [
            Widget.Button({
                hpack: 'center',
                child: Widget.Icon(icons.mpris.next),
                setup: (self) => {
                    self.hook(media, () => {
                        const foundPlayer = getPlayerInfo();
                        if (foundPlayer === undefined) {
                            self.class_name = 'media-indicator-control-button next disabled';
                            return;
                        }

                        self.on_primary_click = (): void => {
                            foundPlayer.next();
                        };
                        self.class_name = `media-indicator-control-button next ${foundPlayer.can_go_next !== null && foundPlayer.can_go_next ? 'enabled' : 'disabled'}`;
                    });
                },
            }),
        ],
    });
};
