import { Gtk } from 'astal/gtk3';
import { LeftSection, RightSection } from './sections/Section';
import { recordingPoller } from './helpers';

const Shortcuts = ({ isEnabled }: ShortcutsProps): JSX.Element => {
    recordingPoller.initialize();

    if (!isEnabled) {
        return <box />;
    }

    return (
        <box className={'shortcuts-container'} halign={Gtk.Align.FILL} hexpand>
            <LeftSection />
            <RightSection />
        </box>
    );
};

export { Shortcuts };

interface ShortcutsProps {
    isEnabled: boolean;
}
