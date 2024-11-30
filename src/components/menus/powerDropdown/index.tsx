import { bind } from 'astal/binding.js';
import DropdownMenu from '../shared/dropdown/index.js';
import { PowerButton } from './button.js';
import { GtkWidget } from 'src/lib/types/widget.js';
import options from 'src/options.js';

export default (): GtkWidget => {
    <DropdownMenu
        name="powerdropdownmenu"
        transition={bind(options.menus.transition)}
        child={
            <box className={'menu-items power-dropdown'}>
                <box className={'menu-items-container power-dropdown'} vertical hexpand>
                    {PowerButton('shutdown')}
                    {PowerButton('reboot')}
                    {PowerButton('logout')}
                    {PowerButton('sleep')}
                </box>
            </box>
        }
    />;
};
