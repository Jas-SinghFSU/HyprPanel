import { PlaybackStatus } from 'lib/types/mpris';

export const isValidPlaybackStatus = (status: string): status is PlaybackStatus =>
    ['playing', 'paused', 'stopped'].includes(status);
