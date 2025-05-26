import { Gtk } from 'astal/gtk3';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { Variable } from 'astal';
import { isPrimaryClick } from 'src/lib/events/mouse';
import { handlePasswordInput } from './helpers';

export const PasswordInput = ({ connecting, staging }: PasswordInputProps): JSX.Element => {
    const showPassword = true;

    return (
        <box className="network-password-input-container" halign={Gtk.Align.FILL} hexpand>
            <entry
                className="network-password-input"
                hexpand
                halign={Gtk.Align.START}
                visibility={!showPassword}
                placeholderText="Enter Password"
                onKeyPressEvent={(self, event) => {
                    handlePasswordInput(self, event, staging);
                }}
                setup={(self) => {
                    setTimeout(() => self.grab_focus(), 100);
                }}
            />
            <button
                className="close-network-password-input-button"
                halign={Gtk.Align.END}
                onClick={(_, event) => {
                    if (isPrimaryClick(event)) {
                        connecting.set('');
                        staging.set(undefined);
                    }
                }}
            >
                <icon className="close-network-password-input-icon" icon="window-close-symbolic" />
            </button>
        </box>
    );
};

interface PasswordInputProps {
    staging: Variable<AstalNetwork.AccessPoint | undefined>;
    connecting: Variable<string>;
}
