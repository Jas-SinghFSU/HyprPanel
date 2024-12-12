import { Gdk, Gtk } from 'astal/gtk3';
import { execAsync, Variable } from '../../../../../../../../../../usr/share/astal/gjs';
import { isPrimaryClick, Notify } from 'src/lib/utils';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';

export const PasswordInput = ({ connecting, staging }: PasswordInputProps): JSX.Element => {
    return (
        <box className="network-password-input-container" halign={Gtk.Align.FILL} hexpand>
            <entry
                className="network-password-input"
                hexpand
                halign={Gtk.Align.START}
                visibility={false}
                placeholderText="Enter Password"
                onKeyPressEvent={(self, event) => {
                    const keyPressed = event.get_keyval()[1];

                    if (keyPressed === Gdk.KEY_Return) {
                        connecting.set(staging.get().bssid ?? '');

                        execAsync(`nmcli dev wifi connect ${staging.get().bssid} password ${self.text}`)
                            .catch((err) => {
                                connecting.set('');
                                console.error(`Failed to connect to Wi-Fi: ${staging.get().ssid}... ${err}`);

                                Notify({
                                    summary: 'Network',
                                    body: err.message,
                                    timeout: 5000,
                                });
                            })
                            .then(() => {
                                connecting.set('');

                                staging.set({} as AstalNetwork.AccessPoint);
                            });

                        self.text = '';
                    }
                }}
            />
            <button
                className="close-network-password-input-button"
                halign={Gtk.Align.END}
                onClick={(_, event) => {
                    if (isPrimaryClick(event)) {
                        connecting.set('');
                        staging.set({} as AstalNetwork.AccessPoint);
                    }
                }}
            >
                <icon className="close-network-password-input-icon" icon="window-close-symbolic" />
            </button>
        </box>
    );
};

interface PasswordInputProps {
    staging: Variable<AstalNetwork.AccessPoint>;
    connecting: Variable<string>;
}
