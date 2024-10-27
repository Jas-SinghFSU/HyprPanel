import { LoopStatus } from 'lib/types/mpris';
import { MprisPlayer } from 'types/service/mpris';

export const isValidLoopStatus = (status: string): status is LoopStatus =>
    ['none', 'track', 'playlist'].includes(status);

export const isLoopActive = (player: MprisPlayer): string => {
    return player['loop_status'] !== null && ['track', 'playlist'].includes(player['loop_status'].toLowerCase())
        ? 'active'
        : '';
};
