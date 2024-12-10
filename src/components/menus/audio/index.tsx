import { GtkWidget } from 'src/lib/types/widget.js';
import DropdownMenu from '../shared/dropdown/index.js';
import { SelectedDevices } from './active/index.js';
import options from 'src/options.js';
import { bind } from 'astal/binding.js';
import { Gtk } from 'astal/gtk3';
import { AvailableDevices } from './available/index.js';

export default (): GtkWidget => {
    return (
        <DropdownMenu
            name="audiomenu"
            transition={bind(options.menus.transition)}
            child={
                <box className={'menu-items audio'} halign={Gtk.Align.FILL} hexpand>
                    <box className={'menu-items-container audio'} halign={Gtk.Align.FILL} vertical hexpand>
                        <SelectedDevices />
                        <AvailableDevices />
                    </box>
                </box>
            }
        />
    );
};
