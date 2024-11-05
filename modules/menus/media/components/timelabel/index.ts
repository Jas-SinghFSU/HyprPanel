import { BoxWidget } from 'lib/types/widget';
import { getPlayerInfo } from '../helpers';
import { getFormattedTime } from '../timebar/helpers';

const Time = (): BoxWidget => {
    return Widget.Box({
        class_name: 'media-indicator-current-progress-bar',
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
                            if (
                                foundPlayer !== undefined &&
                                typeof foundPlayer.position === 'number' &&
                                foundPlayer.position >= 0
                            ) {
                                self.label = `${getFormattedTime(foundPlayer.position)} / ${getFormattedTime(foundPlayer.length)}`;
                            } else {
                                self.label = `00:00`;
                            }
                        });
                    },
                }),
            }),
        ],
    });
};

export { Time };
