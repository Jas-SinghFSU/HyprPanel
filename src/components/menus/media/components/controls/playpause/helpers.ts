import AstalMpris from 'gi://AstalMpris?version=0.1';
import icons2 from 'src/lib/icons/icons2';
import { PlaybackIconMap } from 'src/lib/types/mpris';

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
