import AstalMpris from 'gi://AstalMpris?version=0.1';

export const isShuffleActive = (player: AstalMpris.Player): string => {
    if (player.shuffleStatus === AstalMpris.Shuffle.ON) {
        return 'active';
    }
    return '';
};
