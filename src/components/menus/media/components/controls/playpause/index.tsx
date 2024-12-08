import { mprisService } from 'src/lib/constants/services';
import icons from 'src/lib/icons/icons2';
import { Astal, Gtk, Widget } from 'astal/gtk3';
import { isPrimaryClick } from 'src/lib/utils';
import { bind } from 'astal';
import { getPlaybackIcon } from './helpers';
import AstalMpris from 'gi://AstalMpris?version=0.1';

export const PlayPause = (): JSX.Element => {
    const className = bind(mprisService.players[0], 'playbackStatus').as(() => {
        const currentPlayer = mprisService.players[0];

        if (!currentPlayer) {
            return 'media-indicator-control-button play disabled';
        }

        const canPlay = currentPlayer.can_play !== null;
        const playStatus = canPlay ? 'enabled' : 'disabled';

        return `media-indicator-control-button play ${playStatus}`;
    });

    const icon = bind(mprisService.players[0], 'playbackStatus').as(() => {
        const currentPlayer = mprisService.players[0];

        if (!currentPlayer) {
            return icons.mpris.paused;
        }

        const playbackStatus = currentPlayer.playbackStatus;

        if (playbackStatus !== null) {
            return getPlaybackIcon(playbackStatus);
        } else {
            return icons.mpris.paused;
        }
    });

    const tooltipText = bind(mprisService.players[0], 'playbackStatus').as(() => {
        const currentPlayer = mprisService.players[0];

        if (!currentPlayer) {
            return 'Play/Pause';
        }

        const playbackStatus = currentPlayer.playbackStatus;
        return playbackStatus === AstalMpris.PlaybackStatus.PLAYING ? 'Pause' : 'Play';
    });

    const onClick = (_: Widget.Button, event: Astal.ClickEvent): void => {
        if (!isPrimaryClick(event)) {
            return;
        }

        const currentPlayer = mprisService.players[0];

        if (currentPlayer && currentPlayer.can_play !== null) {
            currentPlayer.play_pause();
        }
    };

    return (
        <button className={className} halign={Gtk.Align.CENTER} hasTooltip tooltipText={tooltipText} onClick={onClick}>
            <icon icon={icon} />
        </button>
    );
};
