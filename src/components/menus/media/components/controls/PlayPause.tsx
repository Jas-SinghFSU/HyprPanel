import { Astal, Gtk, Widget } from 'astal/gtk3';
import { bind } from 'astal';
import { getPlaybackIcon } from './helpers';
import AstalMpris from 'gi://AstalMpris?version=0.1';
import { canPlay, playbackStatus, activePlayer } from 'src/services/media';
import { isPrimaryClick } from 'src/lib/events/mouse';

export const PlayPause = (): JSX.Element => {
    const className = bind(canPlay).as((canPlay) => {
        return `media-indicator-control-button play ${canPlay ? 'enabled' : 'disabled'}`;
    });

    const icon = bind(playbackStatus).as((status) => {
        return getPlaybackIcon(status);
    });

    const tooltipText = bind(playbackStatus).as((playbackStatus) => {
        return playbackStatus === AstalMpris.PlaybackStatus.PLAYING ? 'Pause' : 'Play';
    });

    const onClick = (_: Widget.Button, event: Astal.ClickEvent): void => {
        if (!isPrimaryClick(event)) {
            return;
        }

        const currentPlayer = activePlayer.get();

        if (currentPlayer && currentPlayer.can_play) {
            currentPlayer.play_pause();
        }
    };

    return (
        <button
            className={className}
            halign={Gtk.Align.CENTER}
            hasTooltip
            tooltipText={tooltipText}
            onClick={onClick}
        >
            <icon icon={icon} />
        </button>
    );
};
