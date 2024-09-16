import { MprisPlayer } from 'types/service/mpris';
const mpris = await Service.import('mpris');

export const getCurrentPlayer = (activePlayer: MprisPlayer = mpris.players[0]): MprisPlayer => {
    const statusOrder = {
        Playing: 1,
        Paused: 2,
        Stopped: 3,
    };

    if (mpris.players.length === 0) {
        return mpris.players[0];
    }

    const isPlaying = mpris.players.some((p: MprisPlayer) => p.play_back_status === 'Playing');

    const playerStillExists = mpris.players.some((p) => activePlayer.bus_name === p.bus_name);

    const nextPlayerUp = mpris.players.sort(
        (a: MprisPlayer, b: MprisPlayer) => statusOrder[a.play_back_status] - statusOrder[b.play_back_status],
    )[0];

    if (isPlaying || !playerStillExists) {
        return nextPlayerUp;
    }

    return activePlayer;
};
