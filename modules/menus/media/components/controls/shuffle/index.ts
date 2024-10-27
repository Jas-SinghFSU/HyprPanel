const media = await Service.import('mpris');
import { Attribute, Child } from 'lib/types/widget';
import { getPlayerInfo } from '../../helpers';
import Box from 'types/widgets/box';
import { isShuffleActive } from './helpers';
import icons from 'lib/icons';

export const shuffleControl = (): Box<Child, Attribute> => {
    return Widget.Box({
        class_name: 'media-indicator-control shuffle',
        children: [
            Widget.Button({
                hpack: 'center',
                hasTooltip: true,
                setup: (self) => {
                    self.hook(media, () => {
                        const foundPlayer = getPlayerInfo();
                        if (foundPlayer === undefined) {
                            self.tooltip_text = 'Unavailable';
                            self.class_name = 'media-indicator-control-button shuffle disabled';
                            return;
                        }

                        self.tooltip_text =
                            foundPlayer.shuffle_status !== null
                                ? foundPlayer.shuffle_status
                                    ? 'Shuffling'
                                    : 'Not Shuffling'
                                : null;
                        self.on_primary_click = (): void => {
                            foundPlayer.shuffle();
                        };
                        self.class_name = `media-indicator-control-button shuffle ${isShuffleActive(foundPlayer)} ${foundPlayer.shuffle_status !== null ? 'enabled' : 'disabled'}`;
                    });
                },
                child: Widget.Icon(icons.mpris.shuffle['enabled']),
            }),
        ],
    });
};
