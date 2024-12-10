import { networkService } from 'src/lib/constants/services.js';
import { Gtk } from 'astal/gtk3';
import { bind } from 'astal/binding';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { DEVICE_STATES } from 'src/lib/constants/network';

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
                                className={bind(networkService.wired, 'state').as((state) => {
                                    return `network-icon ethernet ${state === AstalNetwork.DeviceState.ACTIVATED ? 'active' : ''}`;
                                })}
                                tooltipText={bind(networkService.wired, 'internet').as((internet) => {
                                    return internet.toString();
                                })}
                                icon={bind(networkService.wired, 'iconName')}
                            />
                            <box className={'connection-container'} vertical>
                                <label
                                    className={'active-connection'}
                                    halign={Gtk.Align.START}
                                    truncate
                                    wrap
                                    label={bind(networkService.wired, 'speed').as((speed) => {
                                        return `Ethernet Connection (${speed} Gbps)`;
                                    })}
                                />
                                <label
                                    className={'connection-status dim'}
                                    halign={Gtk.Align.START}
                                    truncate
                                    wrap
                                    label={bind(networkService.wired, 'state').as((state) => {
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
