import { Gtk } from 'astal/gtk3';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { Variable, bind } from 'astal';
import { isPrimaryClick } from 'src/lib/events/mouse';
import { handlePasswordInput } from './helpers';
import Spinner from 'src/components/shared/Spinner';

export const PasswordInput = ({
    connecting,
    staging,
    isConnectingWithPassword,
}: PasswordInputProps): JSX.Element => {
    const showPassword = Variable(false);

    return (
        <box className="network-password-input-container" halign={Gtk.Align.FILL} hexpand vertical>
            <box visible={bind(isConnectingWithPassword).as((loading) => !loading)}>
                <entry
                    className="network-password-input"
                    hexpand
                    halign={Gtk.Align.START}
                    visibility={bind(showPassword)}
                    placeholderText="Enter Password"
                    onKeyPressEvent={(self, event) => {
                        handlePasswordInput(self, event, staging, isConnectingWithPassword);
                    }}
                    setup={(self) => {
                        setTimeout(() => self.grab_focus(), 100);
                    }}
                />
                <button
                    className="toggle-password-visibility-button"
                    halign={Gtk.Align.END}
                    onClick={(_, event) => {
                        if (isPrimaryClick(event)) {
                            showPassword.set(!showPassword.get());
                        }
                    }}
                    tooltipText={bind(showPassword).as((show) => (show ? 'Hide password' : 'Show password'))}
                >
                    <icon
                        className="toggle-password-visibility-icon"
                        icon={bind(showPassword).as((show) =>
                            show ? 'view-conceal-symbolic' : 'view-reveal-symbolic',
                        )}
                    />
                </button>
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
            <box visible={bind(isConnectingWithPassword)} halign={Gtk.Align.START} spacing={8}>
                <Spinner active halign={Gtk.Align.START} />
                <label className="dim-label" label="Connecting..." />
            </box>
        </box>
    );
};

interface PasswordInputProps {
    staging: Variable<AstalNetwork.AccessPoint | undefined>;
    connecting: Variable<string>;
    isConnectingWithPassword: Variable<boolean>;
}
