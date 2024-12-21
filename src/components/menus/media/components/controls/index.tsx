import { BoxWidget } from 'src/lib/types/widget.js';
import { NextTrack, PreviousTrack } from './Tracks.js';
import { PlayPause } from './PlayPause.js';
import { Loop, Shuffle } from './Modes.js';
import { Gtk } from 'astal/gtk3';
import { NextPlayer, PreviousPlayer } from './Players.js';

export const MediaControls = (): BoxWidget => {
    return (
        <box className={'media-indicator-current-player-controls'} vertical>
            <box className={'media-indicator-current-controls'} halign={Gtk.Align.CENTER}>
                <PreviousPlayer />
                <Shuffle />
                <PreviousTrack />
                <PlayPause />
                <NextTrack />
                <Loop />
                <NextPlayer />
            </box>
        </box>
    );
};
