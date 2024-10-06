import Window from 'types/widgets/window.js';
import DropdownMenu from '../shared/dropdown/index.js';
import { PowerButton } from './button.js';
import { Attribute, Child } from 'lib/types/widget.js';
import options from 'options.js';

export default (): Window<Child, Attribute> => {
    return DropdownMenu({
        name: 'powerdropdownmenu',
        transition: options.menus.transition.bind('value'),
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
