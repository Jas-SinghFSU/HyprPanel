import { Gtk } from 'astal/gtk3';
import { JsonPreviewProps } from './types';
import { bind } from 'astal';

export const JsonPreview = ({ value, onClick, isExpanded }: JsonPreviewProps): JSX.Element => {
    return (
        <eventbox onClick={onClick}>
            <box
                className={bind(isExpanded).as((expanded) => `json-preview ${expanded ? 'expanded' : ''}`)}
                hexpand
            >
                <label
                    className="preview-text"
                    label={value.as((val) => JSON.stringify(val))}
                    halign={Gtk.Align.START}
                    truncate
                    hexpand
                    maxWidthChars={55}
                />
                <label
                    className="preview-icon txt-icon"
                    label={bind(isExpanded).as((expanded) => (expanded ? '󰅖' : '󰏫'))}
                />
            </box>
        </eventbox>
    );
};
