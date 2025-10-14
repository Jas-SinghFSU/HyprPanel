import { bind } from 'astal'
import { Gtk } from 'astal/gtk3'
import { RevealerTransitionMap } from 'src/components/settings/constants.js'
import options from 'src/configuration'
import { SystemUtilities } from 'src/core/system/SystemUtilities.js'
import DropdownMenu from '../shared/dropdown/index.js'
import { BluetoothDevices } from './devices/index.js'
import { Header } from './header/index.js'

const btStatus = SystemUtilities.checkServiceStatus(['bluetooth.service']);

export default (): JSX.Element => {
    if (btStatus === 'MISSING') {
        return (
            <DropdownMenu
                name={'bluetoothmenu'}
                transition={bind(options.menus.transition).as(
                    (transition) => RevealerTransitionMap[transition],
                )}
            >
                <box className={'menu-items bluetooth'} halign={Gtk.Align.FILL} hexpand>
                    <box
                        className={'menu-items-container bluetooth'}
                        halign={Gtk.Align.FILL}
                        vertical
                        hexpand
                    >
                        <box className={'menu-section-container bluetooth unavailable'} vertical>
                            <Header />
                            <box className={'menu-items-section'} valign={Gtk.Align.FILL} vexpand vertical>
                                <label
                                    className={'menu-label unavailable'}
                                    halign={Gtk.Align.CENTER}
                                    label={'Bluetooth service is not installed on your system.\nPlease install it to use Bluetooth features.'}
                                    hexpand
                                    justify={Gtk.Justification.CENTER}
                                />
                            </box>
                        </box>
                    </box>
                </box>
            </DropdownMenu>
        );
    }

    return (
        <DropdownMenu
            name={'bluetoothmenu'}
            transition={bind(options.menus.transition).as((transition) => RevealerTransitionMap[transition])}
        >
            <box className={'menu-items bluetooth'} halign={Gtk.Align.FILL} hexpand>
                <box className={'menu-items-container bluetooth'} halign={Gtk.Align.FILL} vertical hexpand>
                    <box className={'menu-section-container bluetooth'} vertical>
                        <Header />
                        <BluetoothDevices />
                    </box>
                </box>
            </box>
        </DropdownMenu>
    );
};
