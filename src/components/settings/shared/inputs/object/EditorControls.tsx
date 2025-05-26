import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import { EditorControlsProps } from './types';

export const EditorControls = ({ jsonError, onSave }: EditorControlsProps): JSX.Element => {
    return (
        <box vertical className="editor-controls">
            <revealer
                revealChild={bind(jsonError).as((err) => err.length > 0)}
                transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            >
                <label
                    className="error-message"
                    halign={Gtk.Align.START}
                    label={bind(jsonError)}
                    wrap
                    wrapMode={Gtk.WrapMode.WORD}
                    maxWidthChars={50}
                />
            </revealer>

            <box className="controls-row">
                <label label="Press Ctrl+Enter to save" className="hint-text" halign={Gtk.Align.START} />
                <box hexpand />
                <button className="save-button" onClick={onSave}>
                    <box>
                        <label label="Save" />
                    </box>
                </button>
            </box>
        </box>
    );
};
