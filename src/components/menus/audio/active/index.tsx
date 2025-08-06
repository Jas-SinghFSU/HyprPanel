import { Gtk } from 'astal/gtk3';
import { ActiveDevices } from './devices/index.js';
import { ActivePlaybacks } from './playbacks/index.js';
import { bind, Variable } from 'astal';
import { isPrimaryClick } from 'src/lib/events/mouse';

export enum ActiveDeviceMenu {
    DEVICES = 'devices',
    PLAYBACKS = 'playbacks',
}

const activeMenu: Variable<ActiveDeviceMenu> = Variable(ActiveDeviceMenu.DEVICES);

const Header = (): JSX.Element => (
    <box className={'menu-label-container volume selected'} halign={Gtk.Align.FILL}>
        <label className={'menu-label audio volume'} halign={Gtk.Align.START} hexpand label={'Volume'} />
        <button
            className={'menu-icon-button menu-label slider-toggle volume'}
            onClick={(_, event) => {
                if (!isPrimaryClick(event)) {
                    return;
                }

                if (activeMenu.get() === ActiveDeviceMenu.DEVICES) {
                    activeMenu.set(ActiveDeviceMenu.PLAYBACKS);
                } else {
                    activeMenu.set(ActiveDeviceMenu.DEVICES);
                }
            }}
            halign={Gtk.Align.END}
            hexpand
            label={bind(activeMenu).as((menu) => (menu === ActiveDeviceMenu.DEVICES ? '' : '󰤽'))}
        />
    </box>
);

export const VolumeSliders = (): JSX.Element => {
    return (
        <box className={'menu-section-container volume'} vertical>
            <Header />
            <revealer
                transitionType={Gtk.RevealerTransitionType.NONE}
                revealChild={bind(activeMenu).as((curMenu) => curMenu === ActiveDeviceMenu.DEVICES)}
            >
                <ActiveDevices />
            </revealer>
            <revealer
                transitionType={Gtk.RevealerTransitionType.NONE}
                revealChild={bind(activeMenu).as((curMenu) => curMenu === ActiveDeviceMenu.PLAYBACKS)}
            >
                <ActivePlaybacks />
            </revealer>
        </box>
    );
};
