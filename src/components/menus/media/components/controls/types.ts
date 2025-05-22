import AstalMpris from 'gi://AstalMpris';

export type PlaybackIconMap = {
    [key in AstalMpris.PlaybackStatus]: string;
};
