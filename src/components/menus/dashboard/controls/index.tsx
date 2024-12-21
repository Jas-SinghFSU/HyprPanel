import { Gtk } from 'astal/gtk3';
import { BluetoothButton, MicrophoneButton, NotificationsButton, PlaybackButton, WifiButton } from './ControlButtons';

export const Controls = ({ isEnabled }: ControlsProps): JSX.Element => {
    if (!isEnabled) {
        return <box />;
    }

    return (
        <box className={'dashboard-card controls-container'} halign={Gtk.Align.FILL} valign={Gtk.Align.FILL} expand>
            <WifiButton />
            <BluetoothButton />
            <NotificationsButton />
            <PlaybackButton />
            <MicrophoneButton />
        </box>
    );
};

interface ControlsProps {
    isEnabled: boolean;
}
