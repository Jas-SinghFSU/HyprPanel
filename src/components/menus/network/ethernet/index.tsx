import { Gtk } from 'astal/gtk3';
import { bind } from 'astal/binding';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { DEVICE_STATES } from 'src/lib/constants/network';
import { wiredIcon, wiredInternet, wiredSpeed, wiredState } from './helpers';

export const Ethernet = (): JSX.Element => {
    return (
        <box className={'menu-section-container ethernet'} vertical>
            <box className={'menu-label-container'} halign={Gtk.Align.FILL}>
                <label className={'menu-label'} halign={Gtk.Align.START} hexpand label={'Ethernet'} />
            </box>
            <box className={'menu-items-section'} vertical>
                <box className={'menu-content'} vertical>
                    <box className={'network-element-item'}>
                        <box halign={Gtk.Align.START}>
                            <icon
                                className={bind(wiredState).as((state) => {
                                    return `network-icon ethernet ${state === AstalNetwork.DeviceState.ACTIVATED ? 'active' : ''}`;
                                })}
                                tooltipText={bind(wiredInternet).as((internet) => {
                                    return internet.toString();
                                })}
                                icon={bind(wiredIcon)}
                            />
                            <box className={'connection-container'} vertical>
                                <label
                                    className={'active-connection'}
                                    halign={Gtk.Align.START}
                                    truncate
                                    wrap
                                    label={bind(wiredSpeed).as((speed) => {
                                        return `Ethernet Connection (${speed} Mbps)`;
                                    })}
                                />
                                <label
                                    className={'connection-status dim'}
                                    halign={Gtk.Align.START}
                                    truncate
                                    wrap
                                    label={bind(wiredState).as((state) => {
                                        return DEVICE_STATES[state];
                                    })}
                                />
                            </box>
                        </box>
                    </box>
                </box>
            </box>
        </box>
    );
};
