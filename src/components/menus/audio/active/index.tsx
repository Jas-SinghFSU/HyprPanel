import { Gtk } from 'astal/gtk3';
import { ActiveDevices } from './devices/index.js';
import Variable from 'astal/variable.js';
import { ActivePlaybacks } from './playbacks/index.js';
import { bind } from 'astal/binding.js';
import { isPrimaryClick } from 'src/lib/utils.js';

export enum ActiveDeviceMenu {
    Devices = 'devices',
    Playbacks = 'playbacks',
}

const activeMenu: Variable<ActiveDeviceMenu> = Variable(ActiveDeviceMenu.Devices);

const Header = (): JSX.Element => (
    <box className={'menu-label-container volume selected'} halign={Gtk.Align.FILL}>
        <label className={'menu-label audio volume'} halign={Gtk.Align.START} hexpand label={'Volume'} />
        <button
            className={'menu-icon-button menu-label slider-toggle volume'}
            onClick={(_, event) => {
                if (!isPrimaryClick(event)) {
                    return;
                }

                if (activeMenu.get() === ActiveDeviceMenu.Devices) {
                    activeMenu.set(ActiveDeviceMenu.Playbacks);
                } else {
                    activeMenu.set(ActiveDeviceMenu.Devices);
                }
            }}
            halign={Gtk.Align.END}
            hexpand
            label={bind(activeMenu).as((menu) => (menu === ActiveDeviceMenu.Devices ? '' : '󰤽'))}
        />
    </box>
);

export const VolumeSliders = (): JSX.Element => {
    return (
        <box className={'menu-section-container volume'} vertical>
            <Header />
            <revealer
                transitionType={Gtk.RevealerTransitionType.NONE}
                revealChild={bind(activeMenu).as((curMenu) => curMenu === ActiveDeviceMenu.Devices)}
            >
                <ActiveDevices />
            </revealer>
            <revealer
                transitionType={Gtk.RevealerTransitionType.NONE}
                revealChild={bind(activeMenu).as((curMenu) => curMenu === ActiveDeviceMenu.Playbacks)}
            >
                <ActivePlaybacks />
            </revealer>
        </box>
    );
};
