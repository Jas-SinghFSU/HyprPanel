import DropdownMenu from '../shared/dropdown/index.js';
import { BluetoothDevices } from './devices/index.js';
import { Header } from './header/index.js';
import options from 'src/options.js';
import { bind } from 'astal/binding.js';
import { Gtk } from 'astal/gtk3';
import { RevealerTransitionMap } from 'src/lib/constants/options.js';

export default (): JSX.Element => {
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
