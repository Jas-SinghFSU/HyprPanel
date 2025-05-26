import { Gtk } from 'astal/gtk3';
import icons from 'src/lib/icons/icons';
import { JsonPreviewProps } from './types';

export const JsonPreview = ({ value, onClick, isExpanded }: JsonPreviewProps): JSX.Element => {
    const formatPreview = (val: unknown): string => {
        const str = JSON.stringify(val);
        return str.length > 30 ? str.substring(0, 30) + '...' : str;
    };

    return (
        <eventbox className="object-input-row" onClick={onClick}>
            <box hexpand>
                <label
                    className="json-preview-label"
                    label={formatPreview(value)}
                    halign={Gtk.Align.START}
                    hexpand
                    css="color: rgba(255, 255, 255, 0.6); font-family: monospace;"
                />
                <icon
                    icon={isExpanded ? 'window-close-symbolic' : icons.ui.settings}
                    css="margin-left: 8px;"
                />
            </box>
        </eventbox>
    );
};
