import AstalMpris from 'gi://AstalMpris?version=0.1';
import icons2 from '../icons/icons2';

export type PlaybackIconMap = {
    [key in AstalMpris.PlaybackStatus]: string;
};
