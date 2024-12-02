import { GtkWidget } from 'src/lib/types/widget.js';
import DropdownMenu from '../shared/dropdown/index.js';
import { BluetoothDevices } from './Devices/index.js';
import { Header } from './Devices/Header.js';
import options from 'src/options.js';
import { bind } from 'astal/binding.js';
import { Gtk } from 'astal/gtk3';

export default (): GtkWidget => {
    return (
        <DropdownMenu
            name={'bluetoothmenu'}
            transition={bind(options.menus.transition)}
            child={
                <box className={'menu-items bluetooth'} halign={Gtk.Align.FILL} hexpand>
                    <box className={'menu-items-container bluetooth'} halign={Gtk.Align.FILL} vertical hexpand>
                        <box className={'menu-section-container bluetooth'} vertical>
                            <Header />
                            <BluetoothDevices />
                        </box>
                    </box>
                </box>
            }
        />
    );
};
