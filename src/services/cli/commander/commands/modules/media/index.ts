import { errorHandler } from 'src/core/errors/handler';
import { Command } from '../../../types';
import { MediaPlayerService } from 'src/services/media';
import AstalMpris from 'gi://AstalMpris?version=0.1';
import { getNextPlayer, getPreviousPlayer } from 'src/components/menus/media/components/controls/helpers';

const mprisService = AstalMpris.get_default();
const mediaPlayerService = MediaPlayerService.getInstance();

export const mediaCommands: Command[] = [
    {
        name: 'playPause',
        aliases: ['pp'],
        description: 'Plays or Pauses the active media player.',
        category: 'Media',
        args: [],
        handler: (): string => {
            try {
                mediaPlayerService.activePlayer.get()?.play_pause();

                const playbackStatus = mediaPlayerService.activePlayer.get()?.playback_status;

                return playbackStatus === 0 ? 'Paused' : 'Playing';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'playNext',
        aliases: ['pln'],
        description: 'Plays the next track in the active media player.',
        category: 'Media',
        args: [],
        handler: (): string => {
            try {
                const activeMediaPlayer = mediaPlayerService.activePlayer.get();
                if (activeMediaPlayer === undefined) {
                    return 'No active media player';
                }

                if (!activeMediaPlayer.get_can_go_next()) {
                    return 'Not allowed';
                }

                activeMediaPlayer.next();

                return 'Success';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'playPrev',
        aliases: ['plp'],
        description: 'Plays the previous track in the active media player.',
        category: 'Media',
        args: [],
        handler: (): string => {
            try {
                const activeMediaPlayer = mediaPlayerService.activePlayer.get();
                if (activeMediaPlayer === undefined) {
                    return 'No active media player';
                }

                if (!activeMediaPlayer.get_can_go_previous()) {
                    return 'Not allowed';
                }

                activeMediaPlayer.previous();

                return 'Success';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'mediaPlayerNext',
        aliases: ['mpn'],
        description: 'Goes to the next available media player (if it exists).',
        category: 'Media',
        args: [],
        handler: (): string => {
            try {
                const totalMediaPlayers = mprisService.get_players().length;

                if (totalMediaPlayers <= 1) {
                    return 'Not allowed';
                }
                getNextPlayer();

                const activeMediaPlayerName = mediaPlayerService.activePlayer.get()?.busName;
                return activeMediaPlayerName ?? 'Unknown Player';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'mediaPlayerPrev',
        aliases: ['mpp'],
        description: 'Goes to the previous available media player (if it exists).',
        category: 'Media',
        args: [],
        handler: (): string => {
            try {
                const totalMediaPlayers = mprisService.get_players().length;

                if (totalMediaPlayers <= 1) {
                    return 'Not allowed';
                }
                getPreviousPlayer();

                const activeMediaPlayerName = mediaPlayerService.activePlayer.get()?.busName;
                return activeMediaPlayerName ?? 'Unknown Player';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
];
