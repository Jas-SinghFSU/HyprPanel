import icons from 'lib/icons';
import { BoxWidget } from 'lib/types/widget';
import { getPlayerInfo } from '../../helpers';
import { isLoopActive, isValidLoopStatus } from './helpers';

const media = await Service.import('mpris');

export const loopControl = (): BoxWidget => {
    return Widget.Box({
        class_name: 'media-indicator-control loop',
        children: [
            Widget.Button({
                hpack: 'center',
                setup: (self) => {
                    self.hook(media, () => {
                        const foundPlayer = getPlayerInfo();
                        if (foundPlayer === undefined) {
                            self.tooltip_text = 'Unavailable';
                            self.class_name = 'media-indicator-control-button shuffle disabled';
                            return;
                        }

                        self.tooltip_text = foundPlayer.loop_status !== null ? foundPlayer.loop_status : 'None';

                        self.on_primary_click = (): void => {
                            foundPlayer.loop();
                        };

                        const statusTag = foundPlayer.loop_status !== null ? 'enabled' : 'disabled';
                        const isActiveTag = isLoopActive(foundPlayer);

                        self.class_name = `media-indicator-control-button loop ${isActiveTag} ${statusTag}`;
                    });
                },
                child: Widget.Icon({
                    setup: (self) => {
                        self.hook(media, () => {
                            const foundPlayer = getPlayerInfo();

                            if (foundPlayer === undefined) {
                                self.icon = icons.mpris.loop['none'];
                                return;
                            }

                            const loopStatus = foundPlayer.loop_status?.toLowerCase();

                            if (loopStatus && isValidLoopStatus(loopStatus)) {
                                self.icon = icons.mpris.loop[loopStatus];
                            } else {
                                self.icon = icons.mpris.loop['none'];
                            }
                        });
                    },
                }),
            }),
        ],
    });
};
