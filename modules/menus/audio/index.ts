import Window from 'types/widgets/window.js';
import DropdownMenu from '../shared/dropdown/index.js';
import { activeDevices } from './active/index.js';
import { availableDevices } from './available/index.js';
import { Attribute, Child } from 'lib/types/widget.js';
import options from 'options.js';

export default (): Window<Child, Attribute> => {
    return DropdownMenu({
        name: 'audiomenu',
        transition: options.menus.transition.bind('value'),
        child: Widget.Box({
            class_name: 'menu-items audio',
            hpack: 'fill',
            hexpand: true,
            child: Widget.Box({
                vertical: true,
                hpack: 'fill',
                hexpand: true,
                class_name: 'menu-items-container audio',
                children: [activeDevices(), availableDevices()],
            }),
        }),
    });
};
