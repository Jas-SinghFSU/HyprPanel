import { bind } from 'astal/binding.js';
import DropdownMenu from '../shared/dropdown/index.js';
import { Media } from './components/index.js';
import options from 'src/options.js';
import { Gtk } from 'astal/gtk3';

const { transition } = options.menus;

export default (): JSX.Element => {
    return (
        <DropdownMenu
            name="mediamenu"
            transition={bind(transition)}
            child={
                <box className="menu-items media" halign={Gtk.Align.FILL} hexpand>
                    <box className="menu-items-container media" halign={Gtk.Align.FILL} hexpand>
                        <Media />
                    </box>
                </box>
            }
        />
    );
};
