import { BoxWidget } from 'lib/types/widget';
import { getPlayerInfo } from '../helpers';
import { updateTimestamp } from '../timebar/helpers';

const Time = (): BoxWidget => {
    return Widget.Box({
        class_name: 'media-indicator-current-time-label',
        hexpand: true,
        children: [
            Widget.Box({
                hexpand: true,
                child: Widget.Label({
                    hexpand: true,
                    tooltip_text: '--',
                    class_name: 'time-label',
                    setup: (self) => {
                        self.poll(1000, () => {
                            const foundPlayer = getPlayerInfo();
                            updateTimestamp(self, foundPlayer);
                        });
                    },
                }),
            }),
        ],
    });
};

export { Time };
