import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import { EditorControlsProps } from './types';

export const EditorControls = ({ jsonError, onSave }: EditorControlsProps): JSX.Element => {
    return (
        <box vertical>
            <revealer
                revealChild={bind(jsonError).as((err) => err.length > 0)}
                transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            >
                <label
                    className="json-error-label"
                    halign={Gtk.Align.START}
                    label={bind(jsonError)}
                    css="color: #f44336; font-size: 0.9em; margin: 5px 0;"
                />
            </revealer>

            <box css="margin-top: 10px;">
                <label
                    label="Press Ctrl+Enter to save"
                    css="color: rgba(255, 255, 255, 0.5); font-size: 0.85em;"
                    halign={Gtk.Align.START}
                />
                <box hexpand />
                <button
                    className="json-save-button"
                    css="padding: 5px 15px; background-color: rgba(255, 255, 255, 0.1); border-radius: 4px;"
                    onClick={onSave}
                >
                    <box>
                        <icon icon="object-select-symbolic" css="margin-right: 5px;" />
                        <label label="Save" />
                    </box>
                </button>
            </box>
        </box>
    );
};
