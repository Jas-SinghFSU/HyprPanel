import AstalMpris from 'gi://AstalMpris?version=0.1';

export type PlaybackIconMap = {
    [key in AstalMpris.PlaybackStatus]: string;
};
