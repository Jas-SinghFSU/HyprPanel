import { MprisPlayer } from 'types/service/mpris.js';
import icons from '../../../icons/index.js';
import { LoopStatus, PlaybackStatus } from 'lib/types/mpris.js';
import { BoxWidget } from 'lib/types/widget.js';
const media = await Service.import('mpris');

const Controls = (getPlayerInfo: () => MprisPlayer): BoxWidget => {
    const isValidLoopStatus = (status: string): status is LoopStatus => ['none', 'track', 'playlist'].includes(status);

    const isValidPlaybackStatus = (status: string): status is PlaybackStatus =>
        ['playing', 'paused', 'stopped'].includes(status);

    const isLoopActive = (player: MprisPlayer): string => {
        return player['loop_status'] !== null && ['track', 'playlist'].includes(player['loop_status'].toLowerCase())
            ? 'active'
            : '';
    };

    const isShuffleActive = (player: MprisPlayer): string => {
        return player['shuffle_status'] !== null && player['shuffle_status'] ? 'active' : '';
    };

    return Widget.Box({
        class_name: 'media-indicator-current-player-controls',
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'media-indicator-current-controls',
                hpack: 'center',
                children: [
                    Widget.Box({
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
                    }),
                    Widget.Box({
                        children: [
                            Widget.Button({
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
                            }),
                        ],
                    }),
                    Widget.Box({
                        children: [
                            Widget.Button({
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
                                        const foundPlayer: MprisPlayer = getPlayerInfo();
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
                            }),
                        ],
                    }),
                    Widget.Box({
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
                    }),
                    Widget.Box({
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

                                        self.tooltip_text =
                                            foundPlayer.loop_status !== null
                                                ? foundPlayer.loop_status
                                                    ? 'Shuffling'
                                                    : 'Not Shuffling'
                                                : null;
                                        self.on_primary_click = (): void => {
                                            foundPlayer.loop();
                                        };
                                        self.class_name = `media-indicator-control-button loop ${isLoopActive(foundPlayer)} ${foundPlayer.loop_status !== null ? 'enabled' : 'disabled'}`;
                                    });
                                },
                                child: Widget.Icon({
                                    setup: (self) => {
                                        self.hook(media, () => {
                                            const foundPlayer: MprisPlayer = getPlayerInfo();

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
                    }),
                ],
            }),
        ],
    });
};

export { Controls };
