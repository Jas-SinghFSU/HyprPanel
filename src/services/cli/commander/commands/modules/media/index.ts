import { errorHandler } from 'src/core/errors/handler';
import { Command } from '../../../types';
import { MediaPlayerService } from 'src/services/media';

const mediaPlayerService = MediaPlayerService.getInstance();

export const mediaCommands: Command[] = [
    {
        name: 'Play/Pause active media player',
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
];
