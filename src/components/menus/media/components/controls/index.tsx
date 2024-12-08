import { BoxWidget } from 'src/lib/types/widget.js';
import { Shuffle } from './shuffle/index.js';
import { PreviousTrack } from './previous/index.js';
import { PlayPause } from './playpause/index.js';
import { NextTrack } from './next/index.js';
import { Loop } from './loop/index.js';
import { Gtk } from 'astal/gtk3';

export const MediaControls = (): BoxWidget => {
    return (
        <box className={'media-indicator-current-player-controls'} vertical>
            <box className={'media-indicator-current-controls'} halign={Gtk.Align.CENTER}>
                <Shuffle />
                <PreviousTrack />
                <PlayPause />
                <NextTrack />
                <Loop />
            </box>
        </box>
    );
};
