const media = await Service.import('mpris');
import { BoxWidget } from 'lib/types/widget';
import { getPlayerInfo } from '../helpers';
import { update, updateTooltip } from './helpers';

const Bar = (): BoxWidget => {
    return Widget.Box({
        class_name: 'media-indicator-current-progress-bar',
        hexpand: true,
        children: [
            Widget.Box({
                hexpand: true,
                child: Widget.Slider({
                    hexpand: true,
                    tooltip_text: '--',
                    class_name: 'menu-slider media progress',
                    draw_value: false,
                    on_change: ({ value }) => {
                        const foundPlayer = getPlayerInfo();
                        if (foundPlayer === undefined) {
                            return;
                        }
                        return (foundPlayer.position = value * foundPlayer.length);
                    },
                    setup: (self) => {
                        self.poll(1000, () => {
                            const foundPlayer = getPlayerInfo();

                            if (foundPlayer?.play_back_status === 'Playing') {
                                update(self, foundPlayer);
                                updateTooltip(self, foundPlayer);
                            }
                        });

                        self.hook(media, () => {
                            const foundPlayer = getPlayerInfo();
                            update(self, foundPlayer);
                            updateTooltip(self, foundPlayer);
                        });
                    },
                }),
            }),
        ],
    });
};

export { Bar };
