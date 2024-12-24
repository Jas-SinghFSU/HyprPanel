import AstalMpris from 'gi://AstalMpris?version=0.1';
import { activePlayer } from 'src/globals/media';
import { mprisService } from 'src/lib/constants/services';
import icons2 from 'src/lib/icons/icons2';
import { PlaybackIconMap } from 'src/lib/types/mpris';

/**
 * Determines if the loop status is active.
 *
 * This function checks if the provided loop status is either PLAYLIST or TRACK.
 * If the status matches, it returns 'active'; otherwise, it returns an empty string.
 *
 * @param status The loop status to check.
 *
 * @returns 'active' if the loop status is PLAYLIST or TRACK, otherwise an empty string.
 */
export const isLoopActive = (status: AstalMpris.Loop): string => {
    return [AstalMpris.Loop.PLAYLIST, AstalMpris.Loop.TRACK].includes(status) ? 'active' : '';
};

export const loopIconMap: Record<AstalMpris.Loop, keyof typeof icons2.mpris.loop> = {
    [AstalMpris.Loop.NONE]: 'none',
    [AstalMpris.Loop.UNSUPPORTED]: 'none',
    [AstalMpris.Loop.TRACK]: 'track',
    [AstalMpris.Loop.PLAYLIST]: 'playlist',
};

const playbackIconMap: PlaybackIconMap = {
    [AstalMpris.PlaybackStatus.PLAYING]: 'playing',
    [AstalMpris.PlaybackStatus.PAUSED]: 'paused',
    [AstalMpris.PlaybackStatus.STOPPED]: 'stopped',
};

export const loopTooltipMap: Record<AstalMpris.Loop, string> = {
    [AstalMpris.Loop.NONE]: 'Not Looping',
    [AstalMpris.Loop.UNSUPPORTED]: 'Unsupported',
    [AstalMpris.Loop.TRACK]: 'Looping Track',
    [AstalMpris.Loop.PLAYLIST]: 'Looping Playlist',
};

/**
 * Retrieves the playback icon for the given playback status.
 *
 * This function returns the corresponding icon name for the provided playback status from the `icons2.mpris` object.
 *
 * @param playbackStatus The playback status to get the icon for.
 *
 * @returns The icon name for the given playback status.
 */
export const getPlaybackIcon = (playbackStatus: AstalMpris.PlaybackStatus): string => {
    const playbackIcon = playbackIconMap[playbackStatus];
    const mprisIcons = icons2.mpris;

    return mprisIcons[playbackIcon as keyof typeof mprisIcons] as string;
};

/**
 * Determines if the shuffle status is active.
 *
 * This function checks if the provided shuffle status is ON.
 * If the status matches, it returns 'active'; otherwise, it returns an empty string.
 *
 * @param status The shuffle status to check.
 *
 * @returns 'active' if the shuffle status is ON, otherwise an empty string.
 */
export const isShuffleActive = (status: AstalMpris.Shuffle): string => {
    if (status === AstalMpris.Shuffle.ON) {
        return 'active';
    }
    return '';
};

/**
 * Sets the next active player.
 *
 * This function sets the next player in the `mprisService.players` array as the active player.
 * If there is only one player, it sets that player as the active player.
 *
 * @returns void
 */
export const getNextPlayer = (): void => {
    const currentPlayer = activePlayer.get();

    if (currentPlayer === undefined) {
        return;
    }

    const currentPlayerIndex = mprisService
        .get_players()
        .findIndex((player) => player.busName === currentPlayer.busName);
    const totalPlayers = mprisService.get_players().length;

    if (totalPlayers === 1) {
        return activePlayer.set(mprisService.get_players()[0]);
    }

    return activePlayer.set(mprisService.get_players()[(currentPlayerIndex + 1) % totalPlayers]);
};

/**
 * Sets the previous active player.
 *
 * This function sets the previous player in the `mprisService.players` array as the active player.
 * If there is only one player, it sets that player as the active player.
 *
 * @returns void
 */
export const getPreviousPlayer = (): void => {
    const currentPlayer = activePlayer.get();

    if (currentPlayer === undefined) {
        return;
    }

    const currentPlayerIndex = mprisService
        .get_players()
        .findIndex((player) => player.busName === currentPlayer.busName);
    const totalPlayers = mprisService.get_players().length;

    if (totalPlayers === 1) {
        return activePlayer.set(mprisService.get_players()[0]);
    }

    return activePlayer.set(mprisService.get_players()[(currentPlayerIndex - 1 + totalPlayers) % totalPlayers]);
};
