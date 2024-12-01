import { Gtk } from 'astal/gtk3';
import { bind } from 'astal/binding';
import { AccessPoint } from 'src/lib/types/network.js';
import { execAsync, Variable } from 'astal';
import { networkService } from 'src/lib/constants/services';
import { Notify } from 'src/lib/utils';

export const APStaging = ({ staging, connecting }: APStagingProps): JSX.Element => {
    return (
        <box className="wap-staging">
            {Variable.derive([bind(networkService, 'wifi'), bind(staging)], () => {
                if (Object.keys(staging.get()).length === 0) {
                    return <box />;
                }

                return (
                    <box className="network-element-item staging" vertical>
                        <box className="network-element-item staging" halign={Gtk.Align.FILL} hexpand vertical>
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
                                className="spinner wap"
                                revealChild={bind(connecting).as((c) => staging.get().bssid === c)}
                            >
                                {/* <spinner className="spinner wap" /> */}
                            </revealer>
                        </box>
                        <box className="network-password-input-container" halign={Gtk.Align.FILL} hexpand vertical>
                            <entry
                                className="network-password-input"
                                hexpand
                                halign={Gtk.Align.START}
                                visibility={false}
                                placeholderText="Enter password"
                                onAccept={(selfInp) => {
                                    connecting.set(staging.get().bssid ?? '');
                                    execAsync(`nmcli dev wifi connect ${staging.get().bssid} password ${selfInp.text}`)
                                        .catch((err) => {
                                            connecting.set('');
                                            console.error(
                                                `Failed to connect to Wi-Fi: ${staging.get().ssid}... ${err}`,
                                            );
                                            Notify({
                                                summary: 'Network',
                                                body: err,
                                                timeout: 5000,
                                            });
                                        })
                                        .then(() => {
                                            connecting.set('');
                                            staging.set({} as AccessPoint);
                                        });
                                    selfInp.text = '';
                                }}
                            />
                            <button
                                className="close-network-password-input-button"
                                halign={Gtk.Align.END}
                                onPrimaryClick={() => {
                                    connecting.set('');
                                    staging.set({} as AccessPoint);
                                }}
                            >
                                <icon className="close-network-password-input-icon" icon="window-close-symbolic" />
                            </button>
                        </box>
                    </box>
                );
            })}
        </box>
    );
};

interface APStagingProps {
    staging: Variable<AccessPoint>;
    connecting: Variable<string>;
}
