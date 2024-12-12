import AstalMpris from 'gi://AstalMpris?version=0.1';
import { activePlayer } from 'src/globals/media';
import { mprisService } from 'src/lib/constants/services';
import icons2 from 'src/lib/icons/icons2';
import { PlaybackIconMap } from 'src/lib/types/mpris';

export const isLoopActive = (status: AstalMpris.Loop): string => {
    return [AstalMpris.Loop.PLAYLIST, AstalMpris.Loop.TRACK].includes(status) ? 'active' : '';
};

export const loopIconMap: Record<AstalMpris.Loop, keyof typeof icons2.mpris.loop> = {
    [AstalMpris.Loop.NONE]: 'none',
    [AstalMpris.Loop.UNSUPPORTED]: 'none',
    [AstalMpris.Loop.TRACK]: 'track',
    [AstalMpris.Loop.PLAYLIST]: 'playlist',
};

export const loopTooltipMap: Record<AstalMpris.Loop, string> = {
    [AstalMpris.Loop.NONE]: 'Not Looping',
    [AstalMpris.Loop.UNSUPPORTED]: 'Unsupported',
    [AstalMpris.Loop.TRACK]: 'Looping Track',
    [AstalMpris.Loop.PLAYLIST]: 'Looping Playlist',
};

const playbackIconMap: PlaybackIconMap = {
    [AstalMpris.PlaybackStatus.PLAYING]: 'playing',
    [AstalMpris.PlaybackStatus.PAUSED]: 'paused',
    [AstalMpris.PlaybackStatus.STOPPED]: 'stopped',
};

export const getPlaybackIcon = (playbackStatus: AstalMpris.PlaybackStatus): string => {
    const playbackIcon = playbackIconMap[playbackStatus];

    const mprisIcons = icons2.mpris;

    return mprisIcons[playbackIcon as keyof typeof mprisIcons] as string;
};

export const isShuffleActive = (status: AstalMpris.Shuffle): string => {
    if (status === AstalMpris.Shuffle.ON) {
        return 'active';
    }
    return '';
};

export const getNextPlayer = (): void => {
    const currentPlayer = activePlayer.get();

    if (currentPlayer === undefined) {
        return;
    }

    const currentPlayerIndex = mprisService.players.findIndex((player) => player.busName === currentPlayer.busName);

    const totalPlayers = mprisService.players.length;

    if (totalPlayers === 1) {
        return activePlayer.set(mprisService.players[0]);
    }

    return activePlayer.set(mprisService.players[(currentPlayerIndex + 1) % totalPlayers]);
};

export const getPreviousPlayer = (): void => {
    const currentPlayer = activePlayer.get();

    if (currentPlayer === undefined) {
        return;
    }

    const currentPlayerIndex = mprisService.players.findIndex((player) => player.busName === currentPlayer.busName);

    const totalPlayers = mprisService.players.length;

    if (totalPlayers === 1) {
        return activePlayer.set(mprisService.players[0]);
    }

    return activePlayer.set(mprisService.players[(currentPlayerIndex - 1 + totalPlayers) % totalPlayers]);
};
