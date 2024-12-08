import AstalMpris from 'gi://AstalMpris?version=0.1';
import { mprisService } from '../constants/services';

export const getCurrentPlayer = (
    activePlayer: AstalMpris.Player = mprisService.get_players()[0],
): AstalMpris.Player => {
    const statusOrder = {
        [AstalMpris.PlaybackStatus.PLAYING]: 1,
        [AstalMpris.PlaybackStatus.PAUSED]: 2,
        [AstalMpris.PlaybackStatus.STOPPED]: 3,
    };

    const mprisPlayers = mprisService.get_players();
    if (mprisPlayers.length === 0) {
        return mprisPlayers[0];
    }

    const isPlaying = mprisPlayers.some(
        (p: AstalMpris.Player) => p.playbackStatus === AstalMpris.PlaybackStatus.PLAYING,
    );

    const playerStillExists = mprisPlayers.some((p) => activePlayer.bus_name === p.bus_name);

    const nextPlayerUp = mprisPlayers.sort(
        (a: AstalMpris.Player, b: AstalMpris.Player) => statusOrder[a.playbackStatus] - statusOrder[b.playbackStatus],
    )[0];

    if (isPlaying || !playerStillExists) {
        return nextPlayerUp;
    }

    return activePlayer;
};
