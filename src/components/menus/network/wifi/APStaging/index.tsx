import { Gdk, Gtk } from 'astal/gtk3';
import { bind } from 'astal/binding';
import { execAsync, Variable } from 'astal';
import { networkService } from 'src/lib/constants/services';
import { isPrimaryClick, Notify } from 'src/lib/utils';
import Spinner from 'src/components/shared/Spinner';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';

export const APStaging = ({ staging, connecting }: APStagingProps): JSX.Element => {
    return (
        <box className="wap-staging">
            {Variable.derive([bind(networkService, 'wifi'), bind(staging)], () => {
                if (staging.get().ssid === undefined) {
                    return <box />;
                }

                return (
                    <box className="network-element-item staging" vertical>
                        <box halign={Gtk.Align.FILL} hexpand>
                            <icon className="network-icon wifi" icon={staging.get().iconName} />
                            <box className="connection-container" vertical hexpand>
                                <label
                                    className="active-connection"
                                    halign={Gtk.Align.START}
                                    truncate
                                    wrap
                                    label={staging.get().ssid ?? ''}
                                />
                            </box>
                            <revealer
                                halign={Gtk.Align.END}
                                revealChild={bind(connecting).as((conBssid) => staging.get().bssid === conBssid)}
                            >
                                <Spinner className="spinner wap" />
                            </revealer>
                        </box>
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
                                                console.error(
                                                    `Failed to connect to Wi-Fi: ${staging.get().ssid}... ${err}`,
                                                );

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
                    </box>
                );
            })()}
        </box>
    );
};

interface APStagingProps {
    staging: Variable<AstalNetwork.AccessPoint>;
    connecting: Variable<string>;
}
