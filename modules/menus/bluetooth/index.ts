import Window from 'types/widgets/window.js';
import DropdownMenu from '../shared/dropdown/index.js';
import { Devices } from './devices/index.js';
import { Attribute, Child } from 'lib/types/widget.js';
import options from 'options.js';

export default (): Window<Child, Attribute> => {
    return DropdownMenu({
        name: 'bluetoothmenu',
        transition: options.menus.transition.bind('value'),
        child: Widget.Box({
            class_name: 'menu-items bluetooth',
            hpack: 'fill',
            hexpand: true,
            child: Widget.Box({
                vertical: true,
                hpack: 'fill',
                hexpand: true,
                class_name: 'menu-items-container bluetooth',
                child: Devices(),
            }),
        }),
    });
};
