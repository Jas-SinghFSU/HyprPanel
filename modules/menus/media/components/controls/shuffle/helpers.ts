import { MprisPlayer } from 'types/service/mpris';

export const isShuffleActive = (player: MprisPlayer): string => {
    return player['shuffle_status'] !== null && player['shuffle_status'] ? 'active' : '';
};
