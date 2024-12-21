import { Gtk } from 'astal/gtk3';
import { LeftShortcuts, RightShortcuts } from './sections/Section';
import { recordingPoller } from './helpers';

export const Shortcuts = ({ isEnabled }: ShortcutsProps): JSX.Element => {
    recordingPoller.initialize();

    if (!isEnabled) {
        return <box />;
    }

    return (
        <box className={'shortcuts-container'} halign={Gtk.Align.FILL} hexpand>
            <LeftShortcuts />
            <RightShortcuts />
        </box>
    );
};

interface ShortcutsProps {
    isEnabled: boolean;
}
