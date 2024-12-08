import AstalMpris from 'gi://AstalMpris?version=0.1';
import icons2 from 'src/lib/icons/icons2';

export const isLoopActive = (player: AstalMpris.Player): string => {
    return player.loopStatus !== null && [AstalMpris.Loop.PLAYLIST, AstalMpris.Loop.TRACK].includes(player.loopStatus)
        ? 'active'
        : '';
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
