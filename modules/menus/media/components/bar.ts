import { BoxWidget } from 'lib/types/widget';
import { Mpris, MprisPlayer } from 'types/service/mpris';

const media = await Service.import('mpris');

const Bar = (getPlayerInfo: (media: Mpris) => MprisPlayer): BoxWidget => {
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
                        const foundPlayer = getPlayerInfo(media);
                        if (foundPlayer === undefined) {
                            return;
                        }
                        return (foundPlayer.position = value * foundPlayer.length);
                    },
                    setup: (self) => {
                        const update = (): void => {
                            const foundPlayer = getPlayerInfo(media);
                            if (foundPlayer !== undefined) {
                                const value = foundPlayer.length ? foundPlayer.position / foundPlayer.length : 0;
                                self.value = value > 0 ? value : 0;
                            } else {
                                self.value = 0;
                            }
                        };
                        self.hook(media, update);
                        self.poll(1000, update);

                        const updateTooltip = (): void => {
                            const foundPlayer = getPlayerInfo(media);
                            if (foundPlayer === undefined) {
                                self.tooltip_text = '00:00';
                                return;
                            }
                            const curHour = Math.floor(foundPlayer.position / 3600);
                            const curMin = Math.floor((foundPlayer.position % 3600) / 60);
                            const curSec = Math.floor(foundPlayer.position % 60);

                            if (typeof foundPlayer.position === 'number' && foundPlayer.position >= 0) {
                                const formatTime = (time: number): string => {
                                    return time.toString().padStart(2, '0');
                                };

                                const formatHour = (hour: number): string => {
                                    return hour > 0 ? formatTime(hour) + ':' : '';
                                };

                                self.tooltip_text = `${formatHour(curHour)}${formatTime(curMin)}:${formatTime(curSec)}`;
                            } else {
                                self.tooltip_text = `00:00`;
                            }
                        };
                        self.poll(1000, updateTooltip);
                        self.hook(media, updateTooltip);
                    },
                }),
            }),
        ],
    });
};

export { Bar };
