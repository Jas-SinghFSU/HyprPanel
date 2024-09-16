import Window from 'types/widgets/window.js';
import DropdownMenu from '../shared/dropdown/index.js';
import { PowerButton } from './button.js';
import { Attribute, Child } from 'lib/types/widget.js';

export default (): Window<Child, Attribute> => {
    return DropdownMenu({
        name: 'powerdropdownmenu',
        transition: 'crossfade',
        child: Widget.Box({
            class_name: 'menu-items power-dropdown',
            child: Widget.Box({
                vertical: true,
                hexpand: true,
                class_name: 'menu-items-container power-dropdown',
                children: [PowerButton('shutdown'), PowerButton('reboot'), PowerButton('logout'), PowerButton('sleep')],
            }),
        }),
    });
};
